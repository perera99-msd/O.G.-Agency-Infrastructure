import React, { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

interface LoginPageProps {
  onLogin: () => void;
  initialError?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, initialError = "" }) => {
  const [email, setEmail] = useState(() => localStorage.getItem("og_remembered_admin_email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const stored = localStorage.getItem("og_remember_device");
    return stored !== null ? stored === "true" : true;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email/username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      await signInWithEmailAndPassword(auth, email.trim(), password);

      if (rememberMe) {
        localStorage.setItem("og_remembered_admin_email", email.trim());
        localStorage.setItem("og_remember_device", "true");
      } else {
        localStorage.removeItem("og_remembered_admin_email");
        localStorage.setItem("og_remember_device", "false");
      }

      onLogin();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email first, then click Forgot? to receive a reset link.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setError("If an account exists for this address, a password reset link has been sent.");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("If an account exists for this address, a password reset link has been sent.");
        return;
      }
      setError("Unable to send a reset link right now. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">

      {/* ── Left Brand Panel ──────────────────────────────── */}
      <div className="login-brand-panel">
        <img
          src="/Logo-removebg-preview.png"
          alt="O.G. Agency Logo"
          className="login-brand-logo"
        />

        <img
          src="/Admin login.png"
          alt="Admin Dashboard Illustration"
          className="login-illustration"
        />

        <h2 className="login-brand-title">O.G. Agency</h2>
        <p className="login-brand-subtitle">
          Command Center — Secure administration portal for managing placements, operations & analytics.
        </p>
      </div>

      {/* ── Right Form Panel ─────────────────────────────── */}
      <div className="login-form-panel">
        <div className="login-form-card">

          {/* Header */}
          <div className="login-form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your admin account to continue.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group" style={{ gap: 6 }}>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ogagency.com"
                className="field-input"
                disabled={isLoading}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="field-group" style={{ gap: 6 }}>
              <label className="field-label" style={{ display: "flex", justifyContent: "space-between" }}>
                Password
                <button type="button" onClick={handleForgotPassword} className="login-forgot-btn">
                  Forgot?
                </button>
              </label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field-input"
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-password-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="login-remember-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this device</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary login-submit-btn"
            >
              {isLoading ? "Authenticating..." : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Footer badge */}
          <div className="login-footer">
            <ShieldCheck size={14} color="#10b981" /> SLBFE #2751 • 256-Bit Secure Access
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};
