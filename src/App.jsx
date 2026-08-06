import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import TerminalConsole from './components/TerminalConsole';
import AIExplanation from './components/AIExplanation';
import ModalManager from './components/Modals/ModalManager';
import { SAMPLE_PROGRAMS } from './data/samplePrograms';
import { executeCCode } from './utils/cRunner';

export default function App() {
  const [currentSampleKey, setCurrentSampleKey] = useState('factorial');
  const [code, setCode] = useState(SAMPLE_PROGRAMS.factorial.code);
  const [activeRightTab, setActiveRightTab] = useState('console');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const currentSample = SAMPLE_PROGRAMS[currentSampleKey] || SAMPLE_PROGRAMS.factorial;

  // When switching sample preset
  useEffect(() => {
    const selected = SAMPLE_PROGRAMS[currentSampleKey];
    if (selected) {
      setCode(selected.code);
      runCodeSimulation(selected.code);
    }
  }, [currentSampleKey]);

  // Initial code run on mount
  useEffect(() => {
    runCodeSimulation(code);
  }, []);

  const runCodeSimulation = (codeToRun, userInputs = []) => {
    const results = executeCCode(codeToRun, userInputs);
    setConsoleLogs(results);
  };

  const handleRun = (userInputs = []) => {
    runCodeSimulation(code, userInputs);
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
    runCodeSimulation(fixedCode);
  };

  return (
    <div className="app-root">
      {/* Top Header Navigation */}
      <Header 
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        currentSampleKey={currentSampleKey}
        setCurrentSampleKey={setCurrentSampleKey}
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
            filename={currentSample.filename}
            language="C Language"
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
      />

      <style>{`
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
