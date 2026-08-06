import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import TerminalConsole from './components/TerminalConsole';
import AIExplanation from './components/AIExplanation';
import ModalManager from './components/Modals/ModalManager';
import { SAMPLE_PROGRAMS, LANGUAGE_DEFAULTS } from './data/samplePrograms';
import { executeCode } from './utils/cRunner';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('c'); // 'c', 'python', 'java'
  const [currentSampleKey, setCurrentSampleKey] = useState('factorial');
  const [code, setCode] = useState(SAMPLE_PROGRAMS.factorial.code);
  const [filename, setFilename] = useState('main.c');
  const [activeRightTab, setActiveRightTab] = useState('console');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentSample = SAMPLE_PROGRAMS[currentSampleKey] || LANGUAGE_DEFAULTS[selectedLanguage] || SAMPLE_PROGRAMS.factorial;

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
    try {
      const results = await executeCode(codeToRun, langToRun, userInputs);
      setConsoleLogs(results);
    } catch (err) {
      setConsoleLogs([{ type: 'err', text: `Execution Error: ${err.message}` }]);
    } finally {
      setIsRunning(false);
    }
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
            filename={filename}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            isRunning={isRunning}
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
