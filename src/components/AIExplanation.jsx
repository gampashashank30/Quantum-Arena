import React, { useState } from 'react';
import { Star, Lightbulb, Bug, Zap, Check, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function AIExplanation({ 
  currentSample, 
  onApplyFixedCode 
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true); // Default loaded matching Screenshot 2
  const [rootCauseOpen, setRootCauseOpen] = useState(true);
  const [howToFixOpen, setHowToFixOpen] = useState(false);
  const [showCorrectedCode, setShowCorrectedCode] = useState(false);

  const analysisData = currentSample.aiAnalysis;

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 600);
  };

  return (
    <div className="ai-explanation-view animate-fade-in">
      {/* Cyan / Teal Banner Button matching Screenshot 2 */}
      <div className="analysis-action-wrapper">
        <button 
          className={`run-analysis-btn ${isAnalyzing ? 'analyzing' : ''}`}
          onClick={handleRunAnalysis}
        >
          <Star size={16} fill="#ffffff" />
          <span>{isAnalyzing ? 'Analyzing Code...' : '★ Run Analysis'}</span>
        </button>
        <div className="analysis-subtitle">
          Finds syntax errors, logic mistakes, and offers fixes
        </div>
      </div>

      {/* Main Analysis Results (Soft Light Theme matching Screenshot 2) */}
      {hasAnalyzed && (
        <div className="analysis-cards-container">
          {/* Yellow AI Analysis Card */}
          <div className="analysis-card yellow-card">
            <div className="card-header">
              <div className="icon-badge yellow-badge">
                <Lightbulb size={18} />
              </div>
              <div className="card-title yellow-title">AI Analysis</div>
            </div>
            <div className="card-body">
              <div className="step-item">
                <span className="step-num">1</span>
                <span className="step-text">{analysisData.summary}</span>
              </div>
            </div>
          </div>

          {/* Red Root Cause Accordion Card */}
          <div className="analysis-card red-card">
            <div 
              className="card-header accordion-header"
              onClick={() => setRootCauseOpen(!rootCauseOpen)}
            >
              <div className="icon-badge red-badge">
                <Bug size={16} />
              </div>
              <div className="card-title red-title">Root Cause</div>
              <div className="accordion-arrow red-arrow">
                {rootCauseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {rootCauseOpen && (
              <div className="card-body">
                <div className="root-cause-box">
                  <span className="line-badge">Line {analysisData.bugLine}</span>
                  <span className="tag-badge logical-tag">{analysisData.issueType}</span>
                  <span className="root-text">{analysisData.summary}</span>
                </div>
                {analysisData.rootCause && (
                  <div className="root-cause-details">
                    {analysisData.rootCause}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Blue How to Fix Accordion Card */}
          <div className="analysis-card blue-card">
            <div 
              className="card-header accordion-header"
              onClick={() => setHowToFixOpen(!howToFixOpen)}
            >
              <div className="icon-badge blue-badge">
                <Zap size={16} />
              </div>
              <div className="card-title blue-title">How to Fix</div>
              <div className="accordion-arrow blue-arrow">
                {howToFixOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {howToFixOpen && (
              <div className="card-body">
                <div className="fix-instructions">
                  {analysisData.howToFix}
                </div>
              </div>
            )}
          </div>

          {/* Show Corrected Code Button */}
          <div className="corrected-code-wrapper">
            <button 
              className="show-corrected-btn"
              onClick={() => setShowCorrectedCode(!showCorrectedCode)}
            >
              <Check size={16} className="check-icon" />
              <span>{showCorrectedCode ? 'Hide corrected code' : '✓ Show corrected code'}</span>
            </button>

            {showCorrectedCode && (
              <div className="corrected-code-block animate-fade-in">
                <div className="code-header">
                  <span>Corrected C Code:</span>
                  <button 
                    className="apply-fix-btn"
                    onClick={() => onApplyFixedCode(analysisData.correctedCode)}
                  >
                    <CheckCircle2 size={13} />
                    <span>Apply Fix to Editor</span>
                  </button>
                </div>
                <pre className="code-content">{analysisData.correctedCode}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .ai-explanation-view {
          flex: 1;
          background-color: #ffffff;
          padding: 20px;
          overflow-y: auto;
          height: 100%;
          color: #1e293b;
        }

        .analysis-action-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .run-analysis-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #00a8c6;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 168, 198, 0.25);
        }

        .run-analysis-btn:hover {
          background: #0294b0;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 168, 198, 0.35);
        }

        .run-analysis-btn.analyzing {
          opacity: 0.8;
          cursor: wait;
        }

        .analysis-subtitle {
          margin-top: 8px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .analysis-cards-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .analysis-card {
          border-radius: 12px;
          padding: 16px;
          border: 1px solid transparent;
        }

        /* Yellow Card */
        .yellow-card {
          background-color: #fffbeb;
          border-color: #fde68a;
        }

        .yellow-badge {
          background-color: #f59e0b;
          color: #ffffff;
        }

        .yellow-title {
          color: #92400e;
        }

        /* Red Card */
        .red-card {
          background-color: #fef2f2;
          border-color: #fecaca;
        }

        .red-badge {
          background-color: #ef4444;
          color: #ffffff;
        }

        .red-title {
          color: #991b1b;
        }

        .red-arrow {
          color: #991b1b;
        }

        /* Blue Card */
        .blue-card {
          background-color: #f0f9ff;
          border-color: #bae6fd;
        }

        .blue-badge {
          background-color: #0ea5e9;
          color: #ffffff;
        }

        .blue-title {
          color: #075985;
        }

        .blue-arrow {
          color: #075985;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .accordion-header {
          cursor: pointer;
        }

        .icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          font-weight: 700;
          font-size: 15px;
        }

        .accordion-arrow {
          margin-left: auto;
        }

        .card-body {
          margin-top: 12px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fde68a;
          color: #92400e;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-text {
          font-size: 13px;
          color: #78350f;
          font-weight: 500;
        }

        .root-cause-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }

        .line-badge {
          background: #ffe4e6;
          color: #e11d48;
          border: 1px solid #fda4af;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .tag-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .logical-tag {
          background: #fef08a;
          color: #854d0e;
        }

        .root-text {
          font-size: 13px;
          color: #334155;
          font-weight: 500;
        }

        .root-cause-details {
          margin-top: 8px;
          font-size: 12px;
          color: #7f1d1d;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .fix-instructions {
          font-size: 13px;
          color: #0369a1;
          line-height: 1.5;
        }

        .corrected-code-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 8px;
        }

        .show-corrected-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .show-corrected-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .check-icon {
          color: #16a34a;
        }

        .corrected-code-block {
          width: 100%;
          margin-top: 12px;
          background: #0f172a;
          color: #f8fafc;
          border-radius: 8px;
          padding: 12px 16px;
          font-family: var(--font-mono);
          font-size: 12px;
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #94a3b8;
          font-weight: 600;
        }

        .apply-fix-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .apply-fix-btn:hover {
          background: #22c55e;
        }

        .code-content {
          margin: 0;
          white-space: pre-wrap;
          line-height: 1.5;
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
