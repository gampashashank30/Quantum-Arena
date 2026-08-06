import React from 'react';
import { Settings, GraduationCap, BarChart2, History, Bug, Code2, ChevronDown } from 'lucide-react';

export default function Header({ 
  activeModal, 
  setActiveModal, 
  currentSampleKey, 
  setCurrentSampleKey 
}) {
  return (
    <header className="header-container">
      {/* Left Branding */}
      <div className="header-left">
        <div className="logo-badge">
          <Code2 size={20} className="logo-icon" />
        </div>
        <div className="brand-text">
          <div className="brand-title">SmartCompiler</div>
          <div className="brand-tagline">WRITE · ANALYZE · LEARN</div>
        </div>

        {/* C Program Presets Dropdown */}
        <div className="preset-selector">
          <span className="preset-label">Program:</span>
          <select 
            className="preset-dropdown"
            value={currentSampleKey}
            onChange={(e) => setCurrentSampleKey(e.target.value)}
          >
            <option value="factorial">Factorial & Sum (Img 1)</option>
            <option value="largestNumber">Find Largest Number (Img 2)</option>
            <option value="arraySort">Bubble Sort Array</option>
            <option value="mathCalc">Math Library (&lt;math.h&gt;)</option>
          </select>
        </div>
      </div>

      {/* Right Navigation Pills */}
      <div className="header-right">
        <button className="nav-pill" onClick={() => setActiveModal('admin')}>
          <Settings size={14} className="pill-icon" />
          <span>Admin</span>
        </button>

        <button className="nav-pill" onClick={() => setActiveModal('aiTutor')}>
          <GraduationCap size={14} className="pill-icon" />
          <span>AI Tutor</span>
        </button>

        <button className="nav-pill" onClick={() => setActiveModal('analytics')}>
          <BarChart2 size={14} className="pill-icon" />
          <span>Analytics</span>
        </button>

        <button className="nav-pill" onClick={() => setActiveModal('history')}>
          <History size={14} className="pill-icon" />
          <span>History</span>
          <span className="pill-badge count-badge">50</span>
        </button>

        <button className="nav-pill" onClick={() => setActiveModal('bugTracker')}>
          <Bug size={14} className="pill-icon" />
          <span>Bug Tracker</span>
          <span className="pill-badge alert-badge">+12</span>
        </button>

        {/* User Profile Pill */}
        <div className="user-profile">
          <div className="user-avatar">S</div>
          <div className="user-info">
            <span className="user-name">Shashank Gam...</span>
            <span className="user-signout">Sign Out</span>
          </div>
        </div>
      </div>

      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          padding: 0 16px;
          background-color: #0c1017;
          border-bottom: 1px solid #1e293b;
          user-select: none;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-badge {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 1px solid #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -0.3px;
          color: #ffffff;
          line-height: 1.1;
        }

        .brand-tagline {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #64748b;
          margin-top: 2px;
        }

        .preset-selector {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 12px;
          padding: 3px 8px;
          background: #161e2e;
          border-radius: 16px;
          border: 1px solid #1e293b;
        }

        .preset-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .preset-dropdown {
          background: #0f172a;
          border: 1px solid #334155;
          color: #38bdf8;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 8px;
          outline: none;
          cursor: pointer;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #161e2e;
          border: 1px solid #2d3748;
          color: #cbd5e1;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nav-pill:hover {
          background: #1e293b;
          border-color: #475569;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .pill-icon {
          color: #94a3b8;
        }

        .pill-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 2px;
        }

        .count-badge {
          background: #0284c7;
          color: #ffffff;
        }

        .alert-badge {
          background: #ef4444;
          color: #ffffff;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 10px 3px 4px;
          background: #161e2e;
          border: 1px solid #2d3748;
          border-radius: 20px;
          margin-left: 4px;
          cursor: pointer;
        }

        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #16a34a;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .user-name {
          font-size: 11px;
          font-weight: 600;
          color: #f8fafc;
        }

        .user-signout {
          font-size: 9px;
          color: #64748b;
        }
      `}</style>
    </header>
  );
}
