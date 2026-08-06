import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, RotateCcw, Terminal as TermIcon } from 'lucide-react';

export default function TerminalConsole({ 
  activeTab, 
  setActiveTab, 
  consoleLogs, 
  onRunCode, 
  onClearConsole,
  isRunning
}) {
  const [stdinInput, setStdinInput] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal to bottom on new logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  // Focus input when clicking anywhere in terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = stdinInput.trim();
      if (val) {
        onRunCode([val]);
        setStdinInput('');
      }
    }
  };

  // Check if terminal is waiting for user input
  const isWaitingInput = consoleLogs.some(l => l.text && l.text.includes('Enter a number:')) || 
                         consoleLogs.some(l => l.type === 'out' && !l.text.endsWith('\n'));

  return (
    <div className="terminal-container" onClick={handleTerminalClick}>
      {/* Top Tab Bar for Right Panel */}
      <div className="terminal-tab-bar">
        <button 
          className={`tab-item ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          <Play size={12} className="tab-icon" />
          <span>Console (Interactive PTY)</span>
        </button>

        <button 
          className={`tab-item ${activeTab === 'aiExplanation' ? 'active' : ''}`}
          onClick={() => setActiveTab('aiExplanation')}
        >
          <Sparkles size={13} className="tab-icon ai-sparkle" />
          <span>AI Explanation</span>
        </button>

        {activeTab === 'console' && (
          <button 
            className="clear-term-btn" 
            onClick={(e) => { e.stopPropagation(); onClearConsole(); }} 
            title="Clear Terminal"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>

      {/* Terminal View Body */}
      <div className="terminal-body">
        {/* Banner Comments matching Screenshot 1 */}
        <div className="terminal-banner">
          <div className="banner-line"># Smart Compiler &mdash; Interactive PTY Terminal</div>
          <div className="banner-line"># Press ▶ Run or Ctrl+Enter to compile &amp; run.</div>
          <div className="banner-line"># Type input at prompt and press ENTER to send stdin.</div>
        </div>

        {/* Console Logs Stream */}
        <div className="logs-stream">
          {consoleLogs.map((log, index) => (
            <div key={index} className={`log-line ${log.type}`}>
              {log.text}
            </div>
          ))}

          {/* Interactive PTY Stdin Terminal Line */}
          <div className="pty-stdin-row">
            <span className="pty-prompt">{isRunning ? '⏳ Compiling...' : '>'}</span>
            <input 
              ref={inputRef}
              type="text" 
              className="pty-stdin-input" 
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isRunning}
              placeholder={isRunning ? "Compiling program..." : "Type stdin input & press Enter..."}
              autoFocus
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>

      <style>{`
        .terminal-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #0b0e17;
          cursor: text;
        }

        .terminal-tab-bar {
          display: flex;
          align-items: center;
          height: 38px;
          background-color: #0c1017;
          border-bottom: 1px solid #1e293b;
          padding: 0 8px;
          gap: 4px;
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab-item:hover {
          color: #f8fafc;
        }

        .tab-item.active {
          color: #ffffff;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.05);
        }

        .ai-sparkle {
          color: #38bdf8;
        }

        .clear-term-btn {
          margin-left: auto;
          background: transparent;
          border: none;
          color: #64748b;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
        }

        .clear-term-btn:hover {
          color: #f8fafc;
          background: #1e293b;
        }

        .terminal-body {
          flex: 1;
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.6;
          overflow-y: auto;
          background-color: #080a11;
        }

        .terminal-banner {
          color: #475569;
          margin-bottom: 16px;
          user-select: none;
        }

        .banner-line {
          height: 22px;
        }

        .logs-stream {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .log-line {
          white-space: pre-wrap;
          word-break: break-word;
        }

        .log-line.sys {
          color: #38bdf8;
        }

        .log-line.out {
          color: #f8fafc;
          font-weight: 500;
        }

        .log-line.err {
          color: #ef4444;
        }

        .log-line.warn {
          color: #facc15;
        }

        .pty-stdin-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          background: rgba(15, 23, 42, 0.6);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #1e293b;
        }

        .pty-prompt {
          color: #22c55e;
          font-weight: 700;
          font-size: 13px;
        }

        .pty-stdin-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #4ade80;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
        }

        .pty-stdin-input::placeholder {
          color: #475569;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}
