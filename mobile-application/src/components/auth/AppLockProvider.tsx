// src/components/auth/AppLockProvider.tsx
"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isPinSet, getLockedUid, isBiometricEnabled } from "@/lib/localAuth";

interface AppLockProviderProps {
  children: ReactNode;
}

/**
 * AppLockProvider wraps the portal layout and checks if the user needs
 * to go through the PIN/biometric unlock screen on every app launch.
 *
 * Skips the lock screen for:
 * - Auth pages (login, register, forgot-password)
 * - PIN setup page
 * - First-time users who haven't set a PIN yet
 */
export function AppLockProvider({ children }: AppLockProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [checkingLock, setCheckingLock] = useState(true);
  const [shouldLock, setShouldLock] = useState(false);
  const checkedRef = useRef(false);

  // Paths that should never be locked
  const publicPaths = [
    "/login", "/register", "/forgot-password",
    "/pin-setup", "/lock-page",
  ];

  useEffect(() => {
    if (loading || checkedRef.current) return;
    checkedRef.current = true;

    // Only check lock on portal routes (after login)
    if (!user || publicPaths.some(p => pathname.startsWith(p))) {
      setCheckingLock(false);
      return;
    }

    // Check if PIN is set
    const pinSet = isPinSet();
    if (!pinSet) {
      // First time - redirect to PIN setup
      if (pathname !== "/pin-setup") {
        router.replace("/pin-setup");
        return;
      }
      setCheckingLock(false);
      return;
    }

    // Check if we need to lock - user has PIN set but may be coming from fresh page load
    const lockedUid = getLockedUid();
    if (lockedUid === user.uid) {
      // User has already authenticated this session - check if we need to re-lock
      // We track this in sessionStorage so it resets on tab close
      const sessionUnlocked = sessionStorage.getItem("og_session_unlocked");
      if (sessionUnlocked === user.uid) {
        setCheckingLock(false);
        return;
      }

      // Need to lock - redirect to lock page
      if (pathname !== "/lock-page") {
        setShouldLock(true);
        router.replace("/lock-page");
        return;
      }
    } else {
      // No locked UID stored - user might have cleared data
      // Allow access but they'll need to re-login
      setCheckingLock(false);
    }

    setCheckingLock(false);
  }, [user, loading, pathname, router]);

  // If we're on the lock page, don't render children
  if (pathname === "/lock-page") {
    return <>{children}</>;
  }

  // Show nothing while checking lock status
  if (loading || checkingLock) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "var(--bg-primary)",
      }}>
        <div className="og-spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  // If we determined we should redirect to lock page, show nothing
  if (shouldLock) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Call this function when the user successfully unlocks the app
 * to mark the session as authenticated.
 */
export function markSessionUnlocked(uid: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("og_session_unlocked", uid);
}