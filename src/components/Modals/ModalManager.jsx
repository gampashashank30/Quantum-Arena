import React, { useState, useEffect } from 'react';
import { 
  X, Server, Cpu, HardDrive, GraduationCap, BarChart3, History as HistIcon, 
  Bug, CheckCircle2, AlertTriangle, Database, Trash2, Download, Upload, 
  Search, Code2, Plus, RefreshCw, Play
} from 'lucide-react';
import { 
  getAllHistory, clearHistory, getAllSnippets, deleteSnippet, 
  getAllBugs, addBugReport, deleteBugReport, getDatabaseStats, 
  exportDatabaseJSON, importDatabaseJSON, getUserProfile, updateUserProfile 
} from '../../utils/db';

export default function ModalManager({ 
  activeModal, 
  onClose, 
  onLoadSnippet, 
  dbConnected = true,
  userProfile,
  setUserProfile,
  onHistoryCleared
}) {
  const [activeDbTab, setActiveDbTab] = useState('snippets');
  const [dbStats, setDbStats] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [bugList, setBugList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for adding new bug
  const [newBugTitle, setNewBugTitle] = useState('');
  const [newBugDesc, setNewBugDesc] = useState('');
  const [newBugSev, setNewBugSev] = useState('WARNING');

  // Load database records whenever modal opens or tab changes
  useEffect(() => {
    if (!activeModal) return;
    refreshData();
  }, [activeModal, activeDbTab]);

  const refreshData = async () => {
    try {
      const stats = await getDatabaseStats();
      setDbStats(stats);

      if (activeModal === 'database' || activeModal === 'history') {
        const h = await getAllHistory();
        setHistoryList(h);
      }

      if (activeModal === 'database') {
        const s = await getAllSnippets();
        setSnippets(s);
      }

      if (activeModal === 'database' || activeModal === 'bugTracker') {
        const b = await getAllBugs();
        setBugList(b);
      }
    } catch (err) {
      console.error("Error loading database records:", err);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all execution history from IndexedDB?")) {
      await clearHistory();
      setHistoryList([]);
      if (onHistoryCleared) onHistoryCleared();
      refreshData();
    }
  };

  const handleDeleteSnippet = async (id) => {
    await deleteSnippet(id);
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    refreshData();
  };

  const handleDeleteBug = async (id) => {
    await deleteBugReport(id);
    const updated = bugList.filter(b => b.id !== id);
    setBugList(updated);
    refreshData();
  };

  const handleAddBug = async (e) => {
    e.preventDefault();
    if (!newBugTitle) return;
    await addBugReport({
      title: newBugTitle,
      description: newBugDesc || 'User reported issue from static analyzer',
      severity: newBugSev,
      line_num: 1,
      status: 'Open'
    });
    setNewBugTitle('');
    setNewBugDesc('');
    refreshData();
  };

  const handleExportDB = async () => {
    const jsonStr = await exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuantumArenaDB_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDB = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        await importDatabaseJSON(evt.target.result);
        alert("Database successfully restored from JSON backup!");
        refreshData();
      } catch (err) {
        alert("Failed to import database: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!activeModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {activeModal === 'database' && <Database className="modal-title-icon" />}
            {activeModal === 'admin' && <Server className="modal-title-icon" />}
            {activeModal === 'aiTutor' && <GraduationCap className="modal-title-icon" />}
            {activeModal === 'analytics' && <BarChart3 className="modal-title-icon" />}
            {activeModal === 'history' && <HistIcon className="modal-title-icon" />}
            {activeModal === 'bugTracker' && <Bug className="modal-title-icon" />}
            <span className="modal-title">
              {activeModal === 'database' && 'QuantumArenaDB — IndexedDB Explorer'}
              {activeModal === 'admin' && 'Admin & Compiler Settings'}
              {activeModal === 'aiTutor' && 'AI Tutor & Learning Hub'}
              {activeModal === 'analytics' && 'Code Performance & Analytics'}
              {activeModal === 'history' && `Execution History (${historyList.length} Runs)`}
              {activeModal === 'bugTracker' && `Bug Tracker & Static Analyzer (${bugList.length} Active)`}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* ==================== DATABASE MANAGER MODAL ==================== */}
          {activeModal === 'database' && (
            <div className="db-manager-view">
              {/* DB Status Banner */}
              <div className="db-status-banner">
                <div className="banner-left">
                  <Database size={22} className="banner-icon" />
                  <div>
                    <div className="banner-title">QuantumArenaDB (IndexedDB)</div>
                    <div className="banner-sub">
                      Status: <span className="status-online">● Connected</span> · Engine: Browser Native IndexedDB v1
                    </div>
                  </div>
                </div>
                <div className="banner-actions">
                  <button className="db-action-btn export-btn" onClick={handleExportDB} title="Export database JSON">
                    <Download size={13} /> Export DB
                  </button>

                  <label className="db-action-btn import-btn" title="Import database JSON">
                    <Upload size={13} /> Import DB
                    <input type="file" accept=".json" onChange={handleImportDB} style={{ display: 'none' }} />
                  </label>

                  <button className="db-action-btn refresh-btn" onClick={refreshData} title="Refresh tables">
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              {/* Database Store Stats */}
              <div className="db-stats-row">
                <div className="stat-pill">
                  <span className="stat-label">Total Records</span>
                  <span className="stat-val">{dbStats?.totalRecords || 0}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Snippets</span>
                  <span className="stat-val">{dbStats?.storeCounts?.snippets || 0}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">History Logs</span>
                  <span className="stat-val">{dbStats?.storeCounts?.history || 0}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Bug Reports</span>
                  <span className="stat-val">{dbStats?.storeCounts?.bug_reports || 0}</span>
                </div>
              </div>

              {/* Table Explorer Tabs */}
              <div className="db-tabs">
                <button className={`db-tab ${activeDbTab === 'snippets' ? 'active' : ''}`} onClick={() => setActiveDbTab('snippets')}>
                  📁 Snippets Store ({snippets.length})
                </button>
                <button className={`db-tab ${activeDbTab === 'history' ? 'active' : ''}`} onClick={() => setActiveDbTab('history')}>
                  📜 Execution History ({historyList.length})
                </button>
                <button className={`db-tab ${activeDbTab === 'bugs' ? 'active' : ''}`} onClick={() => setActiveDbTab('bugs')}>
                  🐞 Bug Store ({bugList.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="db-search-bar">
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  className="db-search-input" 
                  placeholder={`Search ${activeDbTab} table...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* TAB 1: SNIPPETS TABLE */}
              {activeDbTab === 'snippets' && (
                <div className="db-table-container">
                  {snippets.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.language.includes(searchQuery.toLowerCase())).length === 0 ? (
                    <div className="empty-db-msg">No saved snippets found in IndexedDB store.</div>
                  ) : (
                    <div className="db-cards-list">
                      {snippets
                        .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.language.includes(searchQuery.toLowerCase()))
                        .map((snip) => (
                          <div key={snip.id} className="snip-card">
                            <div className="snip-card-header">
                              <div className="snip-title-group">
                                <Code2 size={16} className="snip-icon" />
                                <span className="snip-title">{snip.title}</span>
                                <span className="snip-lang-badge">{snip.language.toUpperCase()}</span>
                              </div>
                              <div className="snip-actions">
                                <button className="snip-load-btn" onClick={() => onLoadSnippet(snip.code, snip.language, snip.filename)}>
                                  <Play size={12} /> Load Code
                                </button>
                                <button className="snip-del-btn" onClick={() => handleDeleteSnippet(snip.id)}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <pre className="snip-preview">{snip.code.slice(0, 120)}...</pre>
                            <div className="snip-footer">Saved: {new Date(snip.updated_at).toLocaleString()}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HISTORY TABLE */}
              {activeDbTab === 'history' && (
                <div className="db-table-container">
                  {historyList.length === 0 ? (
                    <div className="empty-db-msg">No execution runs logged in history table yet.</div>
                  ) : (
                    <div className="history-table-wrapper">
                      <div className="table-header-action">
                        <button className="clear-hist-btn" onClick={handleClearHistory}>
                          <Trash2 size={13} /> Clear History Table
                        </button>
                      </div>
                      <div className="db-history-rows">
                        {historyList
                          .filter(h => h.filename?.toLowerCase().includes(searchQuery.toLowerCase()) || h.language?.includes(searchQuery.toLowerCase()))
                          .map((h, i) => (
                            <div key={h.id || i} className="db-history-row">
                              <span className="h-time">{new Date(h.timestamp).toLocaleTimeString()}</span>
                              <span className="h-file">{h.filename}</span>
                              <span className="h-lang">{h.language}</span>
                              <span className={`h-status ${(h.status || 'success').toLowerCase()}`}>{h.status}</span>
                              <span className="h-dur">{h.dur}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BUG STORE TABLE */}
              {activeDbTab === 'bugs' && (
                <div className="db-table-container">
                  <div className="db-cards-list">
                    {bugList.map((bug) => (
                      <div key={bug.id} className="bug-item-row">
                        <AlertTriangle size={16} className={`bug-severity-icon ${bug.severity?.toLowerCase()}`} />
                        <div className="bug-info">
                          <div className="bug-title-line">{bug.title}</div>
                          <div className="bug-desc-line">{bug.description}</div>
                        </div>
                        <span className="bug-tag">{bug.severity}</span>
                        <button className="bug-del-btn" onClick={() => handleDeleteBug(bug.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Modal Content */}
          {activeModal === 'admin' && (
            <div className="modal-section-grid">
              <div className="info-card">
                <Cpu size={24} className="card-icon" />
                <h4>Compiler Cluster</h4>
                <p>GCC 13.2.0 x86_64 Target (Judge0 API)</p>
                <span className="badge-active">Online · 99.98% Uptime</span>
              </div>
              <div className="info-card">
                <HardDrive size={24} className="card-icon" />
                <h4>Database Engine</h4>
                <p>QuantumArenaDB (IndexedDB)</p>
                <p>Status: Active Local Persistence</p>
              </div>
              <div className="info-card wide">
                <h4>Active Edge Nodes</h4>
                <div className="node-list">
                  <div className="node-item"><span>us-east-1 (N. Virginia)</span> <span className="status-green">12ms</span></div>
                  <div className="node-item"><span>ap-south-1 (Mumbai)</span> <span className="status-green">18ms</span></div>
                  <div className="node-item"><span>eu-central-1 (Frankfurt)</span> <span className="status-green">24ms</span></div>
                </div>
              </div>
            </div>
          )}

          {/* AI Tutor Content */}
          {activeModal === 'aiTutor' && (
            <div className="tutor-view">
              <div className="tutor-banner">
                <h3>🎓 SmartCompiler AI Learning Assistant & Program Hub</h3>
                <p>Interactive curriculum for C memory allocation, linked lists, binary search algorithms, and polyglot coding.</p>
              </div>

              <div className="tutor-topics">
                <div className="topic-card">
                  <div className="topic-card-header">
                    <div>
                      <h5>1. Pointers & Dynamic Memory (malloc / free)</h5>
                      <p>Learn heap memory allocation, pointer dereferencing, and avoiding dangling pointer leaks in C.</p>
                    </div>
                    <button 
                      className="snip-load-btn"
                      onClick={() => onLoadSnippet(
                        `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = (int*) malloc(n * sizeof(int));\n    if (arr == NULL) return 1;\n    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;\n    printf("Heap array values:\\n");\n    for (int i = 0; i < n; i++) printf("arr[%d] = %d\\n", i, arr[i]);\n    free(arr);\n    return 0;\n}`,
                        'c',
                        'pointers.c'
                      )}
                    >
                      <Play size={12} /> Load Program
                    </button>
                  </div>
                </div>

                <div className="topic-card">
                  <div className="topic-card-header">
                    <div>
                      <h5>2. Singly Linked List Operations</h5>
                      <p>Struct node pointers, dynamic node allocation with malloc, traversal, and null pointer termination.</p>
                    </div>
                    <button 
                      className="snip-load-btn"
                      onClick={() => onLoadSnippet(
                        `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\nint main() {\n    struct Node* head = (struct Node*)malloc(sizeof(struct Node));\n    head->data = 100;\n    head->next = NULL;\n    printf("Linked list head value: %d\\n", head->data);\n    free(head);\n    return 0;\n}`,
                        'c',
                        'linked_list.c'
                      )}
                    >
                      <Play size={12} /> Load Program
                    </button>
                  </div>
                </div>

                <div className="topic-card">
                  <div className="topic-card-header">
                    <div>
                      <h5>3. Recursive Binary Search O(log N)</h5>
                      <p>Divide and conquer array search using middle index pointers.</p>
                    </div>
                    <button 
                      className="snip-load-btn"
                      onClick={() => onLoadSnippet(
                        `#include <stdio.h>\n\nint binarySearch(int arr[], int l, int r, int x) {\n    if (r >= l) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == x) return mid;\n        if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);\n        return binarySearch(arr, mid + 1, r, x);\n    }\n    return -1;\n}\n\nint main() {\n    int arr[] = {2, 3, 4, 10, 40};\n    printf("Search result for 40: index %d\\n", binarySearch(arr, 0, 4, 40));\n    return 0;\n}`,
                        'c',
                        'binary_search.c'
                      )}
                    >
                      <Play size={12} /> Load Program
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Content */}
          {activeModal === 'analytics' && (
            <div className="analytics-view">
              <div className="stat-grid">
                <div className="stat-box">
                  <span className="stat-num">{userProfile?.totalRuns || historyList.length || 50}</span>
                  <span className="stat-lbl">Total Executions</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">O(N)</span>
                  <span className="stat-lbl">Avg Time Complexity</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">1.4 MB</span>
                  <span className="stat-lbl">Peak RAM Usage</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">14 ms</span>
                  <span className="stat-lbl">Avg Run Speed</span>
                </div>
              </div>
            </div>
          )}

          {/* History Content */}
          {activeModal === 'history' && (
            <div className="history-list">
              <div className="history-top-actions">
                <span className="hist-count-text">Saved runs in IndexedDB: {historyList.length}</span>
                <button className="clear-hist-btn" onClick={handleClearHistory}>
                  <Trash2 size={13} /> Clear History
                </button>
              </div>
              {historyList.length === 0 ? (
                <div className="empty-db-msg">No execution history recorded in IndexedDB yet.</div>
              ) : (
                historyList.map((h, i) => (
                  <div key={h.id || i} className="history-row">
                    <span className="h-time">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="h-file">{h.filename} ({h.language})</span>
                    <span className={`h-status ${(h.status || 'success').toLowerCase()}`}>{h.status}</span>
                    <span className="h-dur">{h.dur}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Bug Tracker Content */}
          {activeModal === 'bugTracker' && (
            <div className="bugs-view">
              <form className="add-bug-form" onSubmit={handleAddBug}>
                <input 
                  type="text" 
                  placeholder="Issue title..."
                  className="bug-input"
                  value={newBugTitle}
                  onChange={(e) => setNewBugTitle(e.target.value)}
                />
                <select 
                  className="bug-select"
                  value={newBugSev}
                  onChange={(e) => setNewBugSev(e.target.value)}
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="LOGICAL">LOGICAL</option>
                  <option value="WARNING">WARNING</option>
                </select>
                <button type="submit" className="add-bug-btn">
                  <Plus size={14} /> Add Bug
                </button>
              </form>

              <div className="bugs-list">
                {bugList.map((bug) => (
                  <div key={bug.id} className={`bug-item ${bug.severity?.toLowerCase()}`}>
                    <AlertTriangle size={16} className="bug-icon" />
                    <div className="bug-details">
                      <div className="bug-title">{bug.title}</div>
                      <div className="bug-desc">{bug.description}</div>
                    </div>
                    <span className="bug-tag">{bug.severity}</span>
                    <button className="bug-del-btn" onClick={() => handleDeleteBug(bug.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 680px;
          max-width: 92vw;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 24px 50px rgba(0,0,0,0.6);
          color: #f8fafc;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-title-icon {
          color: #38bdf8;
        }

        .modal-title {
          font-weight: 700;
          font-size: 15px;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 4px;
          padding: 4px;
        }

        .modal-close-btn:hover {
          color: #ffffff;
          background: #334155;
        }

        .modal-body {
          padding: 20px;
          max-height: 75vh;
          overflow-y: auto;
        }

        /* Database Manager Styles */
        .db-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid #38bdf8;
          margin-bottom: 16px;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-icon {
          color: #38bdf8;
        }

        .banner-title {
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
        }

        .banner-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .status-online {
          color: #4ade80;
          font-weight: 600;
        }

        .banner-actions {
          display: flex;
          gap: 8px;
        }

        .db-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #162032;
          border: 1px solid #334155;
          color: #38bdf8;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .db-action-btn:hover {
          background: #1e293b;
          border-color: #38bdf8;
          color: #ffffff;
        }

        .db-stats-row {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-pill {
          flex: 1;
          background: #162032;
          border: 1px solid #27354a;
          padding: 10px 14px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 11px;
          color: #94a3b8;
        }

        .stat-val {
          font-size: 18px;
          font-weight: 800;
          color: #38bdf8;
          margin-top: 2px;
        }

        .db-tabs {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid #334155;
          margin-bottom: 14px;
        }

        .db-tab {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .db-tab.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.05);
        }

        .db-search-bar {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 14px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
        }

        .db-search-input {
          width: 100%;
          background: #162032;
          border: 1px solid #27354a;
          border-radius: 6px;
          padding: 8px 12px 8px 34px;
          color: #f8fafc;
          font-size: 13px;
          outline: none;
        }

        .db-cards-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .snip-card {
          background: #162032;
          border: 1px solid #27354a;
          border-radius: 8px;
          padding: 12px;
        }

        .snip-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .snip-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .snip-icon { color: #38bdf8; }
        .snip-title { font-size: 14px; font-weight: 600; }

        .snip-lang-badge {
          font-size: 10px;
          font-weight: 700;
          background: #0f172a;
          color: #38bdf8;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #1e293b;
        }

        .snip-actions {
          display: flex;
          gap: 6px;
        }

        .snip-load-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .snip-del-btn, .bug-del-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .snip-preview {
          background: #0f172a;
          padding: 8px 10px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 6px;
          overflow: hidden;
        }

        .snip-footer {
          font-size: 10px;
          color: #64748b;
        }

        .empty-db-msg {
          text-align: center;
          padding: 30px;
          color: #64748b;
          font-size: 13px;
        }

        /* History Table */
        .history-top-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .hist-count-text {
          font-size: 12px;
          color: #94a3b8;
        }

        .clear-hist-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .db-history-rows {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .db-history-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #162032;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
        }

        /* Bugs Form */
        .add-bug-form {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }

        .bug-input {
          flex: 1;
          background: #162032;
          border: 1px solid #27354a;
          border-radius: 6px;
          padding: 6px 12px;
          color: #ffffff;
          font-size: 13px;
        }

        .bug-select {
          background: #162032;
          border: 1px solid #27354a;
          color: #38bdf8;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .add-bug-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .bug-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #162032;
          padding: 10px 14px;
          border-radius: 6px;
          border: 1px solid #27354a;
        }

        .topic-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .topic-card-header h5 {
          color: #38bdf8;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .topic-card-header p {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
        }

        .bug-info { flex: 1; }
        .bug-title-line { font-size: 13px; font-weight: 600; color: #ffffff; }
        .bug-desc-line { font-size: 11px; color: #94a3b8; }
      `}</style>
    </div>
  );
}
