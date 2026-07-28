// src/app/(auth)/pin-setup/PinSetupPageClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PinSetupForm } from "@/components/auth/PinSetupForm";
import { useEffect, useState } from "react";
import { isPinSet, setPinSetupSkipped } from "@/lib/localAuth";
import { markSessionUnlocked } from "@/components/auth/AppLockProvider";

export function PinSetupPageClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }
      // If PIN is already set, redirect to dashboard
      if (isPinSet()) {
        router.replace("/dashboard");
        return;
      }
      setChecked(true);
    }
  }, [user, loading, router]);

  const handleComplete = () => {
    if (user?.uid) markSessionUnlocked(user.uid);
    router.push("/dashboard");
  };

  const handleSkip = () => {
    setPinSetupSkipped();
    if (user?.uid) markSessionUnlocked(user.uid);
    router.push("/dashboard");
  };

  if (loading || !checked) {
    return (
      <div className="og-auth-form" style={{ textAlign: "center", padding: "3rem 0" }}>
        <div className="og-spinner" style={{ width: 32, height: 32, margin: "0 auto 1rem" }} />
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <PinSetupForm
      userId={user?.uid || ""}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}