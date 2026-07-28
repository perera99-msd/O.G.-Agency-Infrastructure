// src/components/auth/PinSetupForm.tsx
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { setPin, isPinSet, checkBiometricSupport, createBiometricCredential, setBiometricEnabled, isBiometricEnabled, storeLockedUid } from "@/lib/localAuth";
import { Button } from "@/components/ui/Button";
import { Shield, Fingerprint, Smartphone, CheckCircle, Lock } from "lucide-react";

interface PinSetupFormProps {
  userId: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function PinSetupForm({ userId, onComplete, onSkip }: PinSetupFormProps) {
  const [step, setStep] = useState<"create" | "confirm" | "biometric" | "done">("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [biometricSupported, setBiometricSupported] = useState<boolean | null>(null);
  const [biometricType, setBiometricType] = useState<string>("");
  const [biometricLoading, setBiometricLoading] = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);

  // Check biometric support on mount
  useEffect(() => {
    checkBiometricSupport().then((support) => {
      setBiometricSupported(support.available);
      setBiometricType(support.type || "");
    });
  }, []);

  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4,6}$/.test(pin)) {
      setError("PIN must be 4-6 digits.");
      return;
    }

    setStep("confirm");
    setTimeout(() => pinRef.current?.focus(), 100);
  };

  const handleConfirmSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (pin !== confirmPin) {
      setError("PINs don't match. Please try again.");
      setConfirmPin("");
      return;
    }

    const saved = setPin(pin);
    if (!saved) {
      setError("Failed to save PIN. Please try again.");
      return;
    }

    // Store the locked UID
    if (userId) {
      storeLockedUid(userId);
    }

    // Move to biometric option step
    if (biometricSupported) {
      setStep("biometric");
    } else {
      setStep("done");
      setTimeout(onComplete, 1500);
    }
  };

  const handleEnableBiometric = async () => {
    setBiometricLoading(true);
    setError("");

    try {
      const success = await createBiometricCredential(userId || "user");
      if (success) {
        setBiometricEnabled(true);
        setStep("done");
        setTimeout(onComplete, 1500);
      } else {
        setError("Biometric setup failed. Your device may not support it.");
        setBiometricLoading(false);
      }
    } catch {
      setError("Biometric setup failed. You can enable it later in Settings.");
      setBiometricLoading(false);
    }
  };

  const handleSkipBiometric = () => {
    setBiometricEnabled(false);
    setStep("done");
    setTimeout(onComplete, 1500);
  };

  const handleReset = () => {
    setStep("create");
    setPin("");
    setConfirmPin("");
    setError("");
  };

  if (step === "done") {
    return (
      <div className="og-auth-form" style={{ textAlign: "center", padding: "2rem 0" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#22c55e" }}>
          <CheckCircle size={48} style={{ margin: "0 auto" }} />
        </div>
        <h2 className="og-auth-title" style={{ fontSize: "1.5rem" }}>Setup Complete!</h2>
        <p className="og-auth-subtitle">
          Your app is now secured.
        </p>
      </div>
    );
  }

  return (
    <div className="og-auth-form">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
          <Lock size={20} />
        </div>
        <span className="og-eyebrow" style={{ margin: 0 }}>SECURE YOUR APP</span>
      </div>

      {step === "create" && (
        <>
          <h1 className="og-auth-title">Set Your App PIN</h1>
          <p className="og-auth-subtitle">
            Choose a 4-6 digit PIN. You'll need this every time you open the app.
          </p>

          <form onSubmit={handleCreateSubmit} noValidate>
            <div className="og-field">
              <label className="og-field-label">Enter PIN</label>
              <input
                ref={pinRef}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                className="og-field-input"
                style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" }}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
              />
            </div>

            {error && <p className="og-form-error" role="alert">{error}</p>}

            <Button type="submit" className="og-btn--full" disabled={pin.length < 4}>
              Continue
            </Button>
          </form>

          {onSkip && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={onSkip}
                style={{ background: "none", border: "none", color: "var(--accent-color)", cursor: "pointer", fontSize: "0.875rem" }}
              >
                Skip for now
              </button>
            </p>
          )}
        </>
      )}

      {step === "confirm" && (
        <>
          <h1 className="og-auth-title">Confirm Your PIN</h1>
          <p className="og-auth-subtitle">Re-enter your PIN to confirm.</p>

          <form onSubmit={handleConfirmSubmit} noValidate>
            <div className="og-field">
              <label className="og-field-label">Confirm PIN</label>
              <input
                ref={pinRef}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                className="og-field-input"
                style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" }}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
              />
            </div>

            {error && <p className="og-form-error" role="alert">{error}</p>}

            <Button type="submit" className="og-btn--full" disabled={confirmPin.length < 4}>
              Confirm PIN
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
            <button
              type="button"
              onClick={handleReset}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.875rem" }}
            >
              Go back
            </button>
          </p>
        </>
      )}

      {step === "biometric" && (
        <>
          <h1 className="og-auth-title">Enable Biometric Login?</h1>
          <p className="og-auth-subtitle">
            Use your device's {biometricType === "face" ? "Face ID" : "fingerprint"} to quickly unlock the app.
          </p>

          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "2rem", margin: "1.5rem 0",
            background: "var(--bg-tertiary)", borderRadius: "var(--radius-xl)",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>
              {biometricType === "face" ? "😊" : "👆"}
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textAlign: "center" }}>
              {biometricType === "face"
                ? "Your device supports Face ID"
                : "Your device supports fingerprint unlock"}
            </p>
          </div>

          {error && <p className="og-form-error" role="alert">{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Button
              onClick={handleEnableBiometric}
              loading={biometricLoading}
              className="og-btn--full"
            >
              <Fingerprint size={18} style={{ marginRight: 8 }} />
              Enable Biometric Unlock
            </Button>
            <Button
              onClick={handleSkipBiometric}
              className="og-btn--full og-btn--outline"
              disabled={biometricLoading}
            >
              Skip, Use PIN Only
            </Button>
          </div>
        </>
      )}
    </div>
  );
}