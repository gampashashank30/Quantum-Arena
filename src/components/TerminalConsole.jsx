import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, RotateCcw, Terminal as TermIcon, CheckCircle2 } from 'lucide-react';

export default function TerminalConsole({ 
  activeTab, 
  setActiveTab, 
  consoleLogs, 
  onRunCode, 
  onClearConsole,
  isRunning
}) {
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs, commandHistory]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = terminalInput.trim();

      if (trimmed === 'clear') {
        onClearConsole();
        setCommandHistory([]);
        setTerminalInput('');
        return;
      }

      if (trimmed === 'help') {
        setCommandHistory(prev => [...prev, { type: 'sys', text: 'Commands: gcc main.c -o main, ./main, clear, help' }]);
        setTerminalInput('');
        return;
      }

      // Send input to running C process or execute run
      if (trimmed.startsWith('gcc') || trimmed === './main') {
        onRunCode();
      } else if (trimmed) {
        onRunCode([trimmed]);
      } else {
        onRunCode();
      }

      setTerminalInput('');
    }
  };

  return (
    <div className="vscode-terminal-container" onClick={handleContainerClick}>
      {/* VS Code Style Header Tabs Bar */}
      <div className="terminal-header-bar">
        <div className="header-tabs">
          <button 
            className={`term-tab ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            <TermIcon size={13} className="term-tab-icon" />
            <span>TERMINAL (bash)</span>
            {isRunning && <span className="running-dot">●</span>}
          </button>

          <button 
            className={`term-tab ${activeTab === 'aiExplanation' ? 'active' : ''}`}
            onClick={() => setActiveTab('aiExplanation')}
          >
            <Sparkles size={13} className="term-tab-icon ai-icon" />
            <span>AI Explanation</span>
          </button>
        </div>

        <div className="header-actions">
          <button 
            className="action-btn clear-btn"
            onClick={(e) => { e.stopPropagation(); onClearConsole(); setCommandHistory([]); }} 
            title="Clear Terminal (Ctrl+L)"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* VS Code / Programiz Integrated Terminal Body */}
      <div className="terminal-viewport">
        {/* Terminal Welcome & Shell Banner */}
        <div className="shell-banner">
          <div className="banner-txt">SmartCompiler Integrated Terminal v2.4 (x86_64-pc-linux-gnu)</div>
          <div className="banner-txt">Type <code>gcc main.c</code> or press <span className="kbd">▶ RUN</span> to compile and execute.</div>
          <div className="banner-txt text-muted">Type stdin inputs directly at the <code>$</code> prompt.</div>
        </div>

        {/* Execution Logs Stream */}
        <div className="terminal-output-stream">
          {consoleLogs.map((log, index) => (
            <div key={index} className={`term-line ${log.type}`}>
              {log.type === 'out' && <span className="out-prefix"></span>}
              <span className="line-content">{log.text}</span>
            </div>
          ))}

          {commandHistory.map((cmd, idx) => (
            <div key={idx} className={`term-line ${cmd.type}`}>
              {cmd.text}
            </div>
          ))}

          {/* Integrated VS Code Interactive Command & Stdin Line */}
          <div className="vscode-prompt-line">
            <span className="prompt-path">user@smartcompiler:~$</span>
            <input 
              ref={inputRef}
              type="text"
              className="vscode-term-input"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              placeholder={isRunning ? "compiling gcc..." : "type stdin or command..."}
              spellCheck="false"
              autoFocus
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>

      <style>{`
        .vscode-terminal-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #05070a;
          color: #cccccc;
          font-family: var(--font-mono);
          user-select: text;
          cursor: text;
        }

        .terminal-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 38px;
          background-color: #0d1117;
          border-bottom: 1px solid #1e293b;
          padding: 0 10px;
        }

        .header-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .term-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #8b949e;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          font-family: var(--font-sans);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }

        .term-tab:hover {
          color: #c9d1d9;
        }

        .term-tab.active {
          color: #ffffff;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
        }

        .term-tab-icon {
          color: #38bdf8;
        }

        .ai-icon {
          color: #c084fc;
        }

        .running-dot {
          color: #22c55e;
          font-size: 10px;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #8b949e;
          padding: 5px;
          border-radius: 4px;
          cursor: pointer;
        }

        .action-btn:hover {
          color: #ffffff;
          background: #21262d;
        }

        .terminal-viewport {
          flex: 1;
          padding: 14px 16px;
          overflow-y: auto;
          font-size: 13px;
          line-height: 1.55;
          background-color: #05070a;
        }

        .shell-banner {
          margin-bottom: 12px;
          color: #6e7681;
          font-size: 12px;
          border-bottom: 1px solid #161b22;
          padding-bottom: 8px;
        }

        .banner-txt {
          margin-bottom: 2px;
        }

        .banner-txt code {
          color: #58a6ff;
          background: rgba(110, 118, 129, 0.1);
          padding: 1px 4px;
          border-radius: 3px;
        }

        .kbd {
          color: #3fb950;
          font-weight: 700;
        }

        .text-muted {
          color: #484f58;
        }

        .terminal-output-stream {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .term-line {
          white-space: pre-wrap;
          word-break: break-word;
        }

        .term-line.sys {
          color: #58a6ff;
        }

        .term-line.out {
          color: #f0f6fc;
          font-weight: 500;
        }

        .term-line.err {
          color: #f85149;
        }

        .term-line.warn {
          color: #d29922;
        }

        .vscode-prompt-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .prompt-path {
          color: #3fb950;
          font-weight: 700;
          font-size: 13px;
        }

        .vscode-term-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #58a6ff;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          caret-color: #58a6ff;
        }

        .vscode-term-input::placeholder {
          color: #30363d;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}
