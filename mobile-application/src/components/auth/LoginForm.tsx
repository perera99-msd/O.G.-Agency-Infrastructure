"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Shield, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login, actionLoading, error, clearError } = useAuth();

  const [passport, setPassport] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (!passport.trim()) {
      setLocalError("Passport number is required.");
      return;
    }

    if (!pin.trim()) {
      setLocalError("PIN / Password is required.");
      return;
    }

    const ok = await login(passport.trim(), pin.trim());
    if (ok) {
      router.push("/dashboard");
    }
  }

  return (
    <div style={{
      maxWidth: "420px",
      margin: "0 auto",
      padding: "2rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      justifyContent: "center",
      fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)"
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{
          width: "68px",
          height: "68px",
          margin: "0 auto 1rem",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "1.6rem",
          letterSpacing: "1px"
        }}>
          OG
        </div>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#3b82f6",
          letterSpacing: "1.5px",
          textTransform: "uppercase"
        }}>
          Applicant Portal
        </span>
        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--text-primary, #0f172a)",
          margin: "0.4rem 0 0.2rem"
        }}>
          Welcome Back
        </h1>
        <p style={{
          fontSize: "0.9rem",
          color: "var(--text-muted, #64748b)",
          margin: 0
        }}>
          Sign in using your Passport Number & Access PIN
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          borderRadius: "28px",
          padding: "2rem 1.75rem",
          boxShadow: "0 20px 40px -15px rgba(37, 99, 235, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}
      >
        {/* Passport Field */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#334155",
            marginBottom: "0.4rem"
          }}>
            Passport Number
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              required
              autoCapitalize="characters"
              placeholder="e.g. N1234567"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "1.5px solid #cbd5e1",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}
            />
          </div>
        </div>

        {/* PIN / Password Field */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#334155",
            marginBottom: "0.4rem"
          }}>
            Access PIN / Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPin ? "text" : "password"}
              required
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 2.75rem 0.85rem 1rem",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "1.5px solid #cbd5e1",
                outline: "none",
                fontWeight: 600
              }}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(error || localError) && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "#dc2626",
            fontSize: "0.85rem",
            fontWeight: 600
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error || localError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={actionLoading}
          style={{
            width: "100%",
            padding: "0.95rem",
            borderRadius: "12px",
            border: "none",
            background: actionLoading
              ? "#94a3b8"
              : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: actionLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
            transition: "transform 0.15s, opacity 0.15s"
          }}
        >
          {actionLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Security Footer Note */}
      <div style={{
        marginTop: "auto",
        paddingTop: "2rem",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "0.78rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem"
      }}>
        <Shield size={14} />
        <span>Secured by OG Agency Admin Credentials</span>
      </div>
    </div>
  );
}
