import React from 'react';
import { X, Server, Cpu, HardDrive, GraduationCap, BarChart3, History as HistIcon, Bug, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ModalManager({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {activeModal === 'admin' && <Server className="modal-title-icon" />}
            {activeModal === 'aiTutor' && <GraduationCap className="modal-title-icon" />}
            {activeModal === 'analytics' && <BarChart3 className="modal-title-icon" />}
            {activeModal === 'history' && <HistIcon className="modal-title-icon" />}
            {activeModal === 'bugTracker' && <Bug className="modal-title-icon" />}
            <span className="modal-title">
              {activeModal === 'admin' && 'Admin & Compiler Settings'}
              {activeModal === 'aiTutor' && 'AI Tutor & Learning Hub'}
              {activeModal === 'analytics' && 'Code Performance & Analytics'}
              {activeModal === 'history' && 'Execution History (50 Runs)'}
              {activeModal === 'bugTracker' && 'Bug Tracker & Static Analyzer (+12)'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Admin Modal Content */}
          {activeModal === 'admin' && (
            <div className="modal-section-grid">
              <div className="info-card">
                <Cpu size={24} className="card-icon" />
                <h4>Compiler Cluster</h4>
                <p>GCC 13.2.0 x86_64 Linux Target</p>
                <span className="badge-active">Online · 99.98% Uptime</span>
              </div>
              <div className="info-card">
                <HardDrive size={24} className="card-icon" />
                <h4>Resource Quota</h4>
                <p>Memory Limit: 512 MB per run</p>
                <p>CPU Timeout: 5.0 Seconds</p>
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
                <h3>🎓 SmartCompiler AI Learning Assistant</h3>
                <p>Ask anything about C pointers, memory allocation, loops, or recursion!</p>
              </div>
              <div className="tutor-topics">
                <div className="topic-card">
                  <h5>Memory & Pointers</h5>
                  <p>Learn pointer arithmetic, stack vs heap, and malloc/free.</p>
                </div>
                <div className="topic-card">
                  <h5>Control Flow & Loops</h5>
                  <p>Understand for, while, and do-while edge cases.</p>
                </div>
                <div className="topic-card">
                  <h5>Time Complexity</h5>
                  <p>Analyze O(n), O(log n), and O(n²) loop iterations.</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Content */}
          {activeModal === 'analytics' && (
            <div className="analytics-view">
              <div className="stat-grid">
                <div className="stat-box">
                  <span className="stat-num">27</span>
                  <span className="stat-lbl">Lines of Code</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">O(N)</span>
                  <span className="stat-lbl">Time Complexity</span>
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
              {[
                { time: 'Just now', file: 'main.c', status: 'Success', dur: '14ms' },
                { time: '2 mins ago', file: 'main.c', status: 'Warning', dur: '18ms' },
                { time: '10 mins ago', file: 'test_logic.c', status: 'Success', dur: '12ms' },
                { time: '1 hour ago', file: 'main.c', status: 'Success', dur: '15ms' },
                { time: 'Yesterday', file: 'array_sort.c', status: 'Success', dur: '22ms' },
              ].map((h, i) => (
                <div key={i} className="history-row">
                  <span className="h-time">{h.time}</span>
                  <span className="h-file">{h.file}</span>
                  <span className={`h-status ${h.status.toLowerCase()}`}>{h.status}</span>
                  <span className="h-dur">{h.dur}</span>
                </div>
              ))}
            </div>
          )}

          {/* Bug Tracker Content */}
          {activeModal === 'bugTracker' && (
            <div className="bugs-view">
              <div className="bug-item high">
                <AlertTriangle size={16} className="bug-icon" />
                <div className="bug-details">
                  <div className="bug-title">Variable `fact` initialized to 0</div>
                  <div className="bug-desc">Line 5: Multiplication by zero causes incorrect output.</div>
                </div>
                <span className="bug-tag">CRITICAL</span>
              </div>
              <div className="bug-item medium">
                <AlertTriangle size={16} className="bug-icon" />
                <div className="bug-details">
                  <div className="bug-title">Strict inequality `i &lt; n` in loop</div>
                  <div className="bug-desc">Line 10: Omits `n` from total multiplication.</div>
                </div>
                <span className="bug-tag">LOGICAL</span>
              </div>
              <div className="bug-item low">
                <CheckCircle2 size={16} className="bug-icon" />
                <div className="bug-details">
                  <div className="bug-title">Unchecked division `avg = sum / n`</div>
                  <div className="bug-desc">Line 21: Division by zero risk if `n == 0`.</div>
                </div>
                <span className="bug-tag">WARNING</span>
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
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 580px;
          max-width: 90vw;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          color: #f8fafc;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
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
          max-height: 70vh;
          overflow-y: auto;
        }

        .modal-section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .info-card {
          background: #162032;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #27354a;
        }

        .info-card.wide {
          grid-column: span 2;
        }

        .card-icon {
          color: #38bdf8;
          margin-bottom: 8px;
        }

        .info-card h4 {
          font-size: 14px;
          margin-bottom: 6px;
          color: #ffffff;
        }

        .info-card p {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 4px;
        }

        .badge-active {
          display: inline-block;
          font-size: 11px;
          color: #4ade80;
          font-weight: 600;
          margin-top: 6px;
        }

        .node-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .node-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #cbd5e1;
          background: #0f172a;
          padding: 6px 10px;
          border-radius: 4px;
        }

        .status-green {
          color: #4ade80;
          font-weight: 600;
        }

        /* AI Tutor */
        .tutor-banner {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #38bdf8;
          margin-bottom: 16px;
        }

        .tutor-topics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .topic-card {
          background: #162032;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #27354a;
        }

        .topic-card h5 {
          color: #38bdf8;
          margin-bottom: 4px;
        }

        .topic-card p {
          font-size: 12px;
          color: #94a3b8;
        }

        /* Analytics */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-box {
          background: #162032;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #27354a;
        }

        .stat-num {
          display: block;
          font-size: 24px;
          font-weight: 800;
          color: #38bdf8;
        }

        .stat-lbl {
          font-size: 12px;
          color: #94a3b8;
        }

        /* History */
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #162032;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 12px;
        }

        .h-time { color: #64748b; }
        .h-file { color: #f8fafc; font-family: var(--font-mono); }
        .h-status.success { color: #4ade80; font-weight: 600; }
        .h-status.warning { color: #facc15; font-weight: 600; }
        .h-dur { color: #94a3b8; }

        /* Bugs */
        .bugs-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bug-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background: #162032;
          border: 1px solid #27354a;
        }

        .bug-item.high .bug-icon { color: #ef4444; }
        .bug-item.medium .bug-icon { color: #f59e0b; }
        .bug-item.low .bug-icon { color: #38bdf8; }

        .bug-details { flex: 1; }
        .bug-title { font-size: 13px; font-weight: 600; }
        .bug-desc { font-size: 11px; color: #94a3b8; }
        .bug-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #0f172a; color: #f8fafc; }
      `}</style>
    </div>
  );
}
