"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const { login, setupPin, actionLoading, error, clearError } = useAuth();

  const [activeTab, setActiveTab] = useState<"signin" | "setup">("signin");
  const [passport, setPassport] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [localError, setLocalError] = useState("");

  const handleTabChange = (tab: "signin" | "setup") => {
    setActiveTab(tab);
    setPassport("");
    setPin("");
    setConfirmPin("");
    setLocalError("");
    clearError();
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (!passport.trim()) {
      setLocalError("Passport number is required.");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setLocalError("PIN must be exactly 4 digits.");
      return;
    }

    if (activeTab === "signin") {
      const ok = await login(passport, pin);
      if (ok) {
        router.push("/dashboard");
      }
    } else {
      if (pin !== confirmPin) {
        setLocalError("PINs do not match.");
        return;
      }
      const ok = await setupPin(passport, pin);
      if (ok) {
        router.push("/dashboard");
      }
    }
  }

  return (
    <div className="og-auth-form">
      <span className="og-eyebrow">OG APPLICANT PORTAL</span>
      <h1 className="og-auth-title">
        {activeTab === "signin" ? "Sign In" : "PIN Setup"}
      </h1>
      <p className="og-auth-subtitle">
        {activeTab === "signin" 
          ? "Access your visa status using your passport and PIN" 
          : "Register your 4-digit mobile access PIN"}
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", padding: "0.25rem", background: "rgba(15, 23, 42, 0.05)", borderRadius: "8px" }}>
        <button
          type="button"
          onClick={() => handleTabChange("signin")}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "6px",
            border: "none",
            background: activeTab === "signin" ? "#ffffff" : "transparent",
            color: activeTab === "signin" ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: activeTab === "signin" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s"
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("setup")}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "6px",
            border: "none",
            background: activeTab === "setup" ? "#ffffff" : "transparent",
            color: activeTab === "setup" ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: activeTab === "setup" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s"
          }}
        >
          PIN Setup
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Passport Number"
          type="text"
          required
          autoCapitalize="characters"
          placeholder="e.g. N1234567"
          value={passport}
          onChange={(e) => setPassport(e.target.value)}
        />
        
        <Input
          label={activeTab === "signin" ? "Enter 4-Digit PIN" : "Create 4-Digit PIN"}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          required
          placeholder="••••"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        />

        {activeTab === "setup" && (
          <Input
            label="Confirm 4-Digit PIN"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            required
            placeholder="••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
          />
        )}

        {(error || localError) && (
          <p className="og-form-error" role="alert" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: "600" }}>
            {error || localError}
          </p>
        )}

        <Button type="submit" loading={actionLoading} className="og-btn--full" style={{ marginTop: "1.5rem" }}>
          {activeTab === "signin" ? "Sign In" : "Register and Sign In"}
        </Button>
      </form>
    </div>
  );
}
