// src/components/auth/AppLockScreen.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { verifyPin, isPinSet, isBiometricEnabled, promptBiometric, getLockedUid } from "@/lib/localAuth";
import { markSessionUnlocked } from "@/components/auth/AppLockProvider";
import { Button } from "@/components/ui/Button";
import { LogOut, Fingerprint, Lock, Eye, EyeOff } from "lucide-react";
import { signOutUser } from "@/lib/firebase/auth";

interface AppLockScreenProps {
  onUnlock: () => void;
}

export function AppLockScreen({ onUnlock }: AppLockScreenProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricChecking, setBiometricChecking] = useState(true);
  const [biometricType, setBiometricType] = useState<string>("");
  const pinRef = useRef<HTMLInputElement>(null);
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 30; // seconds

  useEffect(() => {
    // Check biometric availability
    import("@/lib/localAuth").then(({ checkBiometricSupport, isBiometricEnabled }) => {
      if (isBiometricEnabled()) {
        checkBiometricSupport().then((support) => {
          setBiometricAvailable(support.available);
          setBiometricType(support.type || "");
          setBiometricChecking(false);

          // Auto-prompt biometric if available
          if (support.available) {
            handleBiometricAuth();
          }
        });
      } else {
        setBiometricChecking(false);
      }
    });

    // Focus PIN input
    setTimeout(() => pinRef.current?.focus(), 300);
  }, []);

  const handleBiometricAuth = useCallback(async () => {
    setBiometricChecking(true);
    try {
      const success = await promptBiometric();
      if (success) {
        onUnlock();
      } else {
        setBiometricChecking(false);
        setTimeout(() => pinRef.current?.focus(), 200);
      }
    } catch {
      setBiometricChecking(false);
    }
  }, [onUnlock]);

  const handlePinSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    if (isLockedOut) return;

    if (!/^\d{4,6}$/.test(pin)) {
      setError("Please enter a valid PIN.");
      return;
    }

    const isValid = verifyPin(pin);
    if (isValid) {
      setAttempts(0);
      markSessionUnlocked(getLockedUid() || "");
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLockedOut(true);
        setError(`Too many incorrect attempts. Locked for ${LOCKOUT_DURATION} seconds.`);
        setTimeout(() => {
          setIsLockedOut(false);
          setAttempts(0);
          setError("");
        }, LOCKOUT_DURATION * 1000);
      } else {
        setError(`Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    router.push("/login");
  };

  const handleForgotPin = () => {
    // Force re-login - clear local auth state and redirect
    import("@/lib/localAuth").then(({ clearPin }) => {
      clearPin();
      router.push("/login");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePinSubmit();
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ textAlign: "center" }}>
        {/* Lock Icon */}
        <div style={{
          width: 72, height: 72,
          borderRadius: "50%",
          background: "var(--accent-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
        }}>
          {biometricChecking && biometricAvailable ? (
            <div className="og-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          ) : (
            <Lock size={32} color="white" />
          )}
        </div>

        <h1 className="og-auth-title" style={{ fontSize: "1.5rem" }}>App Locked</h1>
        <p className="og-auth-subtitle">
          {biometricAvailable
            ? `Unlock with your PIN or ${biometricType === "face" ? "Face ID" : "fingerprint"}`
            : "Enter your PIN to unlock"}
        </p>

        {/* Biometric Button */}
        {biometricAvailable && !biometricChecking && (
          <button
            onClick={handleBiometricAuth}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              width: "100%", padding: "1rem",
              background: "var(--bg-tertiary)", border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)", marginBottom: "1.5rem",
              cursor: "pointer", color: "var(--text-primary)",
              fontSize: "1rem", fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--border-color)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-tertiary)"}
          >
            <Fingerprint size={24} color="var(--accent-color)" />
            {biometricType === "face" ? "Use Face ID" : "Use Fingerprint"}
          </button>
        )}

        {biometricChecking && biometricAvailable && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Waiting for biometric verification...
          </p>
        )}

        {/* PIN Input */}
        <form onSubmit={handlePinSubmit} noValidate>
          <div className="og-field">
            <label className="og-field-label">App PIN</label>
            <div style={{ position: "relative" }}>
              <input
                ref={pinRef}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                className="og-field-input"
                style={{
                  textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem",
                  paddingRight: "2.5rem",
                }}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleKeyDown}
                placeholder="••••"
                disabled={isLockedOut}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: "absolute", right: "0.75rem", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "var(--text-tertiary)", cursor: "pointer", padding: "0.25rem",
                }}
                tabIndex={-1}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="og-form-error" role="alert">{error}</p>}

          <Button
            type="submit"
            className="og-btn--full"
            disabled={pin.length < 4 || isLockedOut}
          >
            {isLockedOut ? "Locked" : "Unlock"}
          </Button>
        </form>

        {/* Footer links */}
        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={handleForgotPin}
            style={{ background: "none", border: "none", color: "var(--accent-color)", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Forgot PIN?
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", color: "var(--error-color)", cursor: "pointer", fontSize: "0.875rem" }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}