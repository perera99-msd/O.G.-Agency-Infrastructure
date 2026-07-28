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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80) center/cover no-repeat",
      padding: 24,
      position: "relative"
    }}>
      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }} />

      <div className="card" style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 420,
        padding: "40px",
        background: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 24
      }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <img
            src="/Logo-removebg-preview.png"
            alt="O.G. Agency Logo"
            style={{
              width: 80, height: 80,
              objectFit: "contain",
              margin: "0 auto 16px",
              display: "block",
            }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 6 }}>
            Command Center
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
            Secure portal for O.G. Agency admins.
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
              <button type="button" onClick={handleForgotPassword} style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>Forgot?</button>
            </label>
            <div style={{ position: "relative" }}>
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
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", padding: 4 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Remember this device</span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15, marginTop: 4 }}
          >
            {isLoading ? "Authenticating..." : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, color: "var(--text-faint)", fontSize: 11, fontWeight: 600 }}>
          <ShieldCheck size={14} color="#10b981" /> SLBFE #2751 • 256-Bit Secure Access
        </div>
      </div>
    </div>
  );
};

