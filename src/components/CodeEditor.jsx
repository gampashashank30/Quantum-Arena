import React, { useRef } from 'react';
import { Play, Download, Trash2, Plus, X } from 'lucide-react';

export default function CodeEditor({ 
  code, 
  setCode, 
  onRun, 
  onClear, 
  filename = 'main.c',
  language = 'C Language'
}) {
  const textareaRef = useRef(null);

  const lines = code.split('\n');

  // Handle Tab key inside textarea
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

  // Basic syntax highlighter layer rendering
  const renderHighlightedLine = (lineText) => {
    if (!lineText) return '\u00A0';

    // Simple syntax highlighting regexes
    const tokens = [];
    let remaining = lineText;

    // We render tokens as spans with inline classes
    return (
      <span>
        {lineText.split(/(\s+|[(){}[\];,+\-*\/=<>!&|"])/).map((chunk, idx) => {
          if (!chunk) return null;
          
          if (/^(#include|int|long|for|if|else|return|void|float|double|char)$/.test(chunk)) {
            return <span key={idx} style={{ color: '#c084fc', fontWeight: 600 }}>{chunk}</span>;
          }
          if (/^(stdio\.h|math\.h|stdlib\.h|<stdio\.h>|<math\.h>)$/.test(chunk)) {
            return <span key={idx} style={{ color: '#4ade80' }}>{chunk}</span>;
          }
          if (/^(printf|scanf|main)$/.test(chunk)) {
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

        <div className="language-badge">
          <span className="lang-dot">●</span>
          <span>{language}</span>
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
        <button className="footer-btn download-btn" onClick={handleDownload}>
          <Download size={14} />
          <span>DOWNLOAD</span>
        </button>

        <button className="footer-btn clear-btn" onClick={onClear}>
          <Trash2 size={14} />
          <span>CLEAR</span>
        </button>

        <button className="footer-btn run-btn" onClick={onRun}>
          <Play size={14} fill="#ffffff" />
          <span>RUN</span>
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
          transition: color 0.15s;
        }

        .tab-close-icon:hover {
          color: #ef4444;
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
          transition: all 0.15s;
        }

        .tab-add-btn:hover {
          background: #1e293b;
          color: #ffffff;
        }

        .language-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-family: var(--font-mono);
          color: #64748b;
          background: rgba(15, 23, 42, 0.6);
          padding: 3px 10px;
          border-radius: 12px;
          border: 1px solid #1e293b;
        }

        .lang-dot {
          color: #22c55e;
          font-size: 10px;
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

        .download-btn {
          flex: 1;
          background: #0f172a;
          color: #38bdf8;
          border-right: 1px solid #1e293b;
        }

        .download-btn:hover {
          background: #1e293b;
          color: #7dd3fc;
        }

        .clear-btn {
          flex: 1;
          background: #0f172a;
          color: #94a3b8;
          border-right: 1px solid #1e293b;
        }

        .clear-btn:hover {
          background: #1e293b;
          color: #f1f5f9;
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
