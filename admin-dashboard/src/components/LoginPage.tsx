import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email/username and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="btr-login-wrapper">
      {/* Background Layers */}
      <div className="btr-bg-image" />
      <div className="btr-bg-gradient" />
      <div className="btr-bg-silhouette" />

      {/* Center Modal Card */}
      <div className="btr-login-card">
        {/* LEFT PANEL: Solid Dark Form Panel (Login Only) */}
        <div className="btr-form-panel">
          <div>
            <div className="btr-logo-row">
              <div className="btr-logo">
                O.G.<span className="btr-logo-dot">.</span>
              </div>
              <span className="btr-mode-badge">
                PORTAL ACCESS
              </span>
            </div>

            <div className="btr-form-header">
              <h1 className="btr-form-title">Sign in</h1>
              <p className="btr-form-subtitle">
                Enter your credentials to access the O.G. Command Center & Manpower Reserves.
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 600,
                marginTop: '14px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="btr-form-body">
              <div className="btr-input-box">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  className="btr-input"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="btr-input-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="btr-input btr-input-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btr-eye-btn"
                  title="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="btr-checkbox-row">
                <label className="btr-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="btr-checkbox"
                  />
                  <span>Remember this device</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Please contact the O.G. IT Administrator to reset your password.'); }}
                  className="btr-forgot-link"
                >
                  Forgot?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btr-submit-btn"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="btr-security-footer">
            <ShieldCheck size={15} color="#10b981" />
            <span>SLBFE #2751 • 256-Bit Secure Command Center</span>
          </div>
        </div>

        {/* RIGHT PANEL: Translucent Glass Window with Admin Login PNG */}
        <div className="btr-visual-panel">
          <img
            src="/Admin login.png"
            alt="O.G. Command Center"
            className="btr-visual-img"
          />
        </div>
      </div>
    </div>
  );
};
