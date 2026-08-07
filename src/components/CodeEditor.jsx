import React, { useRef } from 'react';
import { Play, Download, Trash2, Plus, X, ChevronDown, Database } from 'lucide-react';

export default function CodeEditor({ 
  code, 
  setCode, 
  onRun, 
  onClear, 
  filename = 'main.c',
  selectedLanguage = 'c',
  onLanguageChange,
  isRunning,
  onSaveToDB,
  dbConnected = true
}) {
  const textareaRef = useRef(null);
  const lines = code.split('\n');

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderHighlightedLine = (lineText) => {
    if (!lineText) return '\u00A0';

    return (
      <span>
        {lineText.split(/(\s+|[(){}[\];,+\-*\/=<>!&|"])/).map((chunk, idx) => {
          if (!chunk) return null;
          
          // Keywords for C, Python, Java
          if (/^(#include|int|long|for|if|else|return|void|float|double|char|def|class|public|static|import|print|println|System|range)$/.test(chunk)) {
            return <span key={idx} style={{ color: '#c084fc', fontWeight: 600 }}>{chunk}</span>;
          }
          if (/^(stdio\.h|math\.h|<stdio\.h>|<math\.h>|String|args)$/.test(chunk)) {
            return <span key={idx} style={{ color: '#4ade80' }}>{chunk}</span>;
          }
          if (/^(printf|scanf|main|out|print)$/.test(chunk)) {
            return <span key={idx} style={{ color: '#38bdf8', fontWeight: 600 }}>{chunk}</span>;
          }
          if (/^".*"$/.test(chunk) || chunk.startsWith('"') || chunk.endsWith('"')) {
            return <span key={idx} style={{ color: '#facc15' }}>{chunk}</span>;
          }
          if (/^\d+$/.test(chunk)) {
            return <span key={idx} style={{ color: '#fb923c' }}>{chunk}</span>;
          }
          return <span key={idx} style={{ color: '#f8fafc' }}>{chunk}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="editor-container">
      {/* File Tabs Top Bar */}
      <div className="editor-tab-bar">
        <div className="tab-group-left">
          <div className="editor-tab active">
            <span className="tab-dot">●</span>
            <span className="tab-filename">{filename}</span>
            <X size={12} className="tab-close-icon" />
          </div>
          <button className="tab-add-btn" title="Add File">
            <Plus size={14} />
          </button>
        </div>

        {/* Language Selector Dropdown */}
        <div className="language-selector-wrapper">
          <span className="lang-dot">●</span>
          <select 
            className="language-select" 
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="c">C Language (GCC 9.2)</option>
            <option value="python">Python 3 (Python 3.8)</option>
            <option value="java">Java 17 (OpenJDK)</option>
          </select>
          <ChevronDown size={12} className="lang-arrow" />
        </div>
      </div>

      {/* Code Text Area & Line Numbers */}
      <div className="editor-body">
        <div className="line-numbers">
          {lines.map((_, i) => (
            <div key={i + 1} className="line-num">{i + 1}</div>
          ))}
        </div>

        <div className="code-wrapper">
          <textarea
            ref={textareaRef}
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
          />
          <div className="code-highlight-display" aria-hidden="true">
            {lines.map((l, i) => (
              <div key={i} className="highlight-line">
                {renderHighlightedLine(l)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="editor-footer">
        <button className="footer-btn save-db-btn" onClick={onSaveToDB} title="Save snippet to IndexedDB Database">
          <Database size={14} />
          <span>SAVE TO DB</span>
        </button>

        <button className="footer-btn download-btn" onClick={handleDownload}>
          <Download size={14} />
          <span>DOWNLOAD</span>
        </button>

        <button className="footer-btn clear-btn" onClick={onClear}>
          <Trash2 size={14} />
          <span>CLEAR</span>
        </button>

        <button className="footer-btn run-btn" onClick={onRun} disabled={isRunning}>
          <Play size={14} fill="#ffffff" />
          <span>{isRunning ? 'RUNNING...' : 'RUN'}</span>
        </button>
      </div>

      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #07090e;
          border-right: 2px solid #1e293b;
        }

        .editor-tab-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 38px;
          background-color: #0c1017;
          border-bottom: 1px solid #1e293b;
          padding: 0 12px;
        }

        .tab-group-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .editor-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #07090e;
          color: #f8fafc;
          padding: 6px 14px;
          border-radius: 6px 6px 0 0;
          font-size: 13px;
          font-family: var(--font-mono);
          font-weight: 500;
          border: 1px solid #1e293b;
          border-bottom: none;
        }

        .tab-dot {
          color: #38bdf8;
          font-size: 10px;
        }

        .tab-close-icon {
          color: #64748b;
          cursor: pointer;
        }

        .tab-add-btn {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          background: #161e2e;
          border: 1px solid #2d3748;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .language-selector-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #0f172a;
          padding: 3px 10px;
          border-radius: 12px;
          border: 1px solid #334155;
        }

        .lang-dot {
          color: #22c55e;
          font-size: 10px;
        }

        .language-select {
          appearance: none;
          background: transparent;
          border: none;
          color: #38bdf8;
          font-size: 12px;
          font-family: var(--font-mono);
          font-weight: 600;
          outline: none;
          cursor: pointer;
          padding-right: 14px;
        }

        .lang-arrow {
          position: absolute;
          right: 8px;
          color: #64748b;
          pointer-events: none;
        }

        .editor-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          position: relative;
          background-color: #07090e;
        }

        .line-numbers {
          width: 48px;
          padding: 16px 0;
          background-color: #07090e;
          border-right: 1px solid #161e2e;
          color: #334155;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.6;
          text-align: right;
          padding-right: 14px;
          user-select: none;
        }

        .line-num {
          height: 20.8px;
        }

        .code-wrapper {
          flex: 1;
          position: relative;
          height: 100%;
          overflow: auto;
        }

        .code-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          color: transparent;
          caret-color: #38bdf8;
          border: none;
          outline: none;
          resize: none;
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.6;
          white-space: pre;
          overflow: auto;
          z-index: 2;
        }

        .code-highlight-display {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.6;
          white-space: pre;
          pointer-events: none;
          z-index: 1;
          color: #f8fafc;
        }

        .highlight-line {
          height: 20.8px;
        }

        .editor-footer {
          display: flex;
          height: 44px;
          background: #0c1017;
          border-top: 1px solid #1e293b;
        }

        .footer-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-db-btn {
          flex: 1;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border-right: 1px solid #1e293b;
        }

        .save-db-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          color: #7dd3fc;
        }

        .download-btn {
          flex: 1;
          background: #0f172a;
          color: #cbd5e1;
          border-right: 1px solid #1e293b;
        }

        .download-btn:hover {
          background: #1e293b;
        }

        .clear-btn {
          flex: 1;
          background: #0f172a;
          color: #94a3b8;
          border-right: 1px solid #1e293b;
        }

        .clear-btn:hover {
          background: #1e293b;
        }

        .run-btn {
          flex: 1.2;
          background: #16a34a;
          color: #ffffff;
        }

        .run-btn:hover {
          background: #22c55e;
          box-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
        }
      `}</style>
    </div>
  );
}
