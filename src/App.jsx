import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import TerminalConsole from './components/TerminalConsole';
import AIExplanation from './components/AIExplanation';
import ModalManager from './components/Modals/ModalManager';
import AuthModal from './components/Modals/AuthModal';
import { SAMPLE_PROGRAMS, LANGUAGE_DEFAULTS } from './data/samplePrograms';
import { executeCode } from './utils/cRunner';
import { 
  openDatabase, 
  addHistoryEntry, 
  getAllHistory, 
  saveSnippet, 
  getUserProfile,
  updateUserProfile 
} from './utils/db';
import { 
  getCurrentSession, 
  onAuthChange, 
  signOutUser, 
  saveCloudSnippet, 
  saveCloudExecutionHistory,
  isSupabaseConfigured
} from './utils/supabaseClient';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('c'); // 'c', 'python', 'java'
  const [currentSampleKey, setCurrentSampleKey] = useState('factorial');
  const [code, setCode] = useState(SAMPLE_PROGRAMS.factorial.code);
  const [filename, setFilename] = useState('main.c');
  const [activeRightTab, setActiveRightTab] = useState('console');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Database & Auth state
  const [dbConnected, setDbConnected] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const currentSample = SAMPLE_PROGRAMS[currentSampleKey] || LANGUAGE_DEFAULTS[selectedLanguage] || SAMPLE_PROGRAMS.factorial;

  // Initialize Database connection & Auth state on mount
  useEffect(() => {
    async function initDB() {
      try {
        await openDatabase();
        setDbConnected(true);

        const history = await getAllHistory();
        setHistoryCount(history.length);

        const profile = await getUserProfile();
        setUserProfile(profile);

        const session = await getCurrentSession();
        if (session?.user) {
          setCurrentUser(session.user);
        }
      } catch (err) {
        console.error("Failed to connect to QuantumArenaDB:", err);
        setDbConnected(false);
      }
    }
    initDB();

    // Listen for Auth changes
    const authSub = onAuthChange((event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        showNotification(`👋 Welcome back, ${session.user.user_metadata?.full_name || session.user.email}!`);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      if (authSub?.unsubscribe) authSub.unsubscribe();
    };
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle switching languages via dropdown menu
  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    const langDefault = LANGUAGE_DEFAULTS[newLang];
    if (langDefault) {
      setCode(langDefault.code);
      setFilename(langDefault.filename);
      runCodeSimulation(langDefault.code, newLang);
    }
  };

  // Handle switching sample presets in header
  useEffect(() => {
    const selected = SAMPLE_PROGRAMS[currentSampleKey];
    if (selected) {
      setSelectedLanguage(selected.language || 'c');
      setCode(selected.code);
      setFilename(selected.filename || 'main.c');
      runCodeSimulation(selected.code, selected.language || 'c');
    }
  }, [currentSampleKey]);

  // Initial code run on mount
  useEffect(() => {
    runCodeSimulation(code, selectedLanguage);
  }, []);

  const runCodeSimulation = async (codeToRun, langToRun = selectedLanguage, userInputs = []) => {
    setIsRunning(true);
    const startTime = performance.now();
    let results = [];
    let runStatus = 'Success';

    try {
      results = await executeCode(codeToRun, langToRun, userInputs);
      setConsoleLogs(results);

      // Check if execution had errors or warnings
      const hasError = results.some(l => l.type === 'err');
      const hasWarn = results.some(l => l.type === 'warn');
      if (hasError) runStatus = 'Warning';
    } catch (err) {
      runStatus = 'Error';
      results = [{ type: 'err', text: `Execution Error: ${err.message}` }];
      setConsoleLogs(results);
    } finally {
      setIsRunning(false);
      const durationMs = Math.round(performance.now() - startTime);

      // Save execution result into IndexedDB History & Supabase Cloud
      try {
        const runRecord = {
          filename: filename,
          language: langToRun,
          code: codeToRun,
          status: runStatus,
          dur: `${durationMs}ms`,
          memKB: '1168 KB',
          exitCode: runStatus === 'Error' ? 1 : 0,
          logs: results
        };

        await addHistoryEntry(runRecord);

        // Sync to Supabase cloud if user authenticated
        if (currentUser) {
          saveCloudExecutionHistory(runRecord, currentUser.id);
        }

        // Refresh history count
        const updatedHistory = await getAllHistory();
        setHistoryCount(updatedHistory.length);

        // Increment run count in user profile
        if (userProfile) {
          const updatedProf = { ...userProfile, totalRuns: (userProfile.totalRuns || 0) + 1 };
          await updateUserProfile(updatedProf);
          setUserProfile(updatedProf);
        }
      } catch (dbErr) {
        console.warn("Could not save run to history DB:", dbErr);
      }
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      const defaultTitle = `${selectedLanguage.toUpperCase()} Program - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const titlePrompt = window.prompt("Enter a title for this snippet in Database:", defaultTitle);
      if (!titlePrompt) return;

      const snippetData = {
        title: titlePrompt,
        language: selectedLanguage,
        filename: filename,
        code: code,
        tags: ['custom', selectedLanguage]
      };

      await saveSnippet(snippetData);

      if (currentUser) {
        await saveCloudSnippet(snippetData, currentUser.id);
      }

      showNotification(`💾 Snippet "${titlePrompt}" saved to Database!`);
    } catch (err) {
      showNotification(`❌ Error saving snippet: ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    showNotification('👋 Signed out of Quantum-Arena session.');
  };

  const handleRun = (userInputs = []) => {
    runCodeSimulation(code, selectedLanguage, userInputs);
    setActiveRightTab('console');
  };

  const handleClear = () => {
    setCode('');
    setConsoleLogs([]);
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
  };

  const handleApplyFixedCode = (fixedCode) => {
    setCode(fixedCode);
    setActiveRightTab('console');
    runCodeSimulation(fixedCode, selectedLanguage);
  };

  return (
    <div className="app-root">
      {/* DB Toast Notification */}
      {notification && (
        <div className="db-notification-toast">
          {notification}
        </div>
      )}

      {/* Top Header Navigation */}
      <Header 
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        currentSampleKey={currentSampleKey}
        setCurrentSampleKey={setCurrentSampleKey}
        dbConnected={dbConnected}
        historyCount={historyCount}
        userProfile={userProfile}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Split View */}
      <main className="workspace-container">
        {/* Left Side Panel: Code Editor */}
        <section className="workspace-left">
          <CodeEditor 
            code={code}
            setCode={setCode}
            onRun={() => handleRun()}
            onClear={handleClear}
            filename={filename}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            isRunning={isRunning}
            onSaveToDB={handleSaveToDatabase}
            dbConnected={dbConnected}
          />
        </section>

        {/* Right Side Panel: Console OR AI Explanation */}
        <section className="workspace-right">
          {activeRightTab === 'console' ? (
            <TerminalConsole 
              activeTab={activeRightTab}
              setActiveTab={setActiveRightTab}
              consoleLogs={consoleLogs}
              onRunCode={handleRun}
              onClearConsole={handleClearConsole}
              isRunning={isRunning}
            />
          ) : (
            <div className="right-panel-wrapper">
              {/* Tab Header inside AI Explanation View */}
              <div className="ai-tab-header">
                <button 
                  className={`tab-btn ${activeRightTab === 'console' ? 'active' : ''}`}
                  onClick={() => setActiveRightTab('console')}
                >
                  ▶ Console
                </button>
                <button 
                  className={`tab-btn ${activeRightTab === 'aiExplanation' ? 'active' : ''}`}
                  onClick={() => setActiveRightTab('aiExplanation')}
                >
                  ✦ AI Explanation
                </button>
              </div>

              <AIExplanation 
                currentSample={currentSample}
                onApplyFixedCode={handleApplyFixedCode}
              />
            </div>
          )}
        </section>
      </main>

      {/* Interactive Modals */}
      <ModalManager 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
        onLoadSnippet={(snipCode, snipLang, snipFile) => {
          if (snipLang) setSelectedLanguage(snipLang);
          if (snipFile) setFilename(snipFile);
          if (snipCode) setCode(snipCode);
          setActiveModal(null);
          showNotification('📥 Loaded snippet from QuantumArenaDB');
        }}
        dbConnected={dbConnected}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        onHistoryCleared={() => setHistoryCount(0)}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showNotification(`⚡ Signed in as ${user.user_metadata?.full_name || user.email}!`);
        }}
      />

      <style>{`
        .db-notification-toast {
          position: fixed;
          top: 16px;
          right: 20px;
          z-index: 9999;
          background: #0f172a;
          border: 1px solid #38bdf8;
          color: #38bdf8;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(56, 189, 248, 0.25);
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .app-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background-color: #090c13;
        }

        .workspace-container {
          display: flex;
          flex: 1;
          height: calc(100vh - 52px);
          overflow: hidden;
        }

        .workspace-left {
          flex: 1.1;
          height: 100%;
          min-width: 320px;
        }

        .workspace-right {
          flex: 0.9;
          height: 100%;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          background: #0b0e17;
        }

        .right-panel-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .ai-tab-header {
          display: flex;
          align-items: center;
          height: 38px;
          background-color: #0c1017;
          border-bottom: 1px solid #1e293b;
          padding: 0 8px;
          gap: 4px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .tab-btn.active {
          color: #ffffff;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.05);
        }
      `}</style>
    </div>
  );
}
