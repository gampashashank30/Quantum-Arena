import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Database, KeyRound, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signUpWithEmail, signInWithEmail, signInAsGuest, isSupabaseConfigured } from '../../utils/supabaseClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('signin'); // 'signin', 'signup', 'guest'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signInWithEmail(email, password);
        setSuccessMsg('Successfully signed in!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 800);
      } else if (tab === 'signup') {
        const res = await signUpWithEmail(email, password, fullName);
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const res = await signInAsGuest();
      setSuccessMsg('Logged in as Guest!');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }, 600);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-header-title">
            <ShieldCheck size={20} className="auth-header-icon" />
            <span>Quantum-Arena Authentication</span>
          </div>
          <button className="auth-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Connection Status Banner */}
        <div className={`supabase-status-bar ${isSupabaseConfigured ? 'cloud' : 'local'}`}>
          <Database size={14} />
          <span>
            {isSupabaseConfigured 
              ? 'Connected to Supabase Cloud Database' 
              : 'Demo Mode (Add VITE_SUPABASE_URL to .env for live Supabase Auth)'}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => setTab('signin')}>
            <LogIn size={14} /> Sign In
          </button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>
            <UserPlus size={14} /> Sign Up
          </button>
          <button className={`auth-tab ${tab === 'guest' ? 'active' : ''}`} onClick={() => setTab('guest')}>
            <ShieldCheck size={14} /> Guest Login
          </button>
        </div>

        {/* Modal Body */}
        <div className="auth-body">
          {errorMsg && (
            <div className="auth-alert error">
              <AlertCircle size={15} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="auth-alert success">
              <CheckCircle2 size={15} /> {successMsg}
            </div>
          )}

          {tab === 'guest' ? (
            <div className="guest-box">
              <h4>Quick Demo Guest Access</h4>
              <p>Sign in instantly as an Arena Guest to test snippet saving and code execution without creating an account.</p>
              <button className="auth-submit-btn guest-btn" onClick={handleGuestLogin} disabled={loading}>
                {loading ? 'Logging in...' : '⚡ Enter as Arena Guest'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {tab === 'signup' && (
                <div className="input-group">
                  <label><User size={13} /> Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Shashank Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label><Mail size={13} /> Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label><KeyRound size={13} /> Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .auth-modal-content {
          width: 440px;
          max-width: 90vw;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          color: #f8fafc;
        }

        .auth-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .auth-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 14px;
        }

        .auth-header-icon { color: #38bdf8; }

        .auth-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 4px;
          padding: 4px;
        }

        .auth-close-btn:hover { color: #ffffff; background: #334155; }

        .supabase-status-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 600;
        }

        .supabase-status-bar.cloud {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border-bottom: 1px solid rgba(34, 197, 94, 0.2);
        }

        .supabase-status-bar.local {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid #334155;
          background: #0c1017;
        }

        .auth-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .auth-tab.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.05);
        }

        .auth-body { padding: 20px; }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
        }

        .auth-alert.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .auth-alert.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .input-group input {
          background: #162032;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 9px 12px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
        }

        .input-group input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
        }

        .auth-submit-btn {
          background: #0284c7;
          color: #ffffff;
          border: none;
          padding: 10px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          margin-top: 6px;
          transition: all 0.15s ease;
        }

        .auth-submit-btn:hover { background: #0369a1; }

        .guest-box {
          text-align: center;
          padding: 10px 0;
        }

        .guest-box h4 { font-size: 15px; margin-bottom: 6px; color: #ffffff; }
        .guest-box p { font-size: 12px; color: #94a3b8; margin-bottom: 16px; line-height: 1.5; }

        .guest-btn {
          width: 100%;
          background: #16a34a;
        }

        .guest-btn:hover { background: #15803d; }
      `}</style>
    </div>
  );
}
