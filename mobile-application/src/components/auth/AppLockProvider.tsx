"use client";

import { ReactNode } from "react";

interface AppLockProviderProps {
  children: ReactNode;
}

export function AppLockProvider({ children }: AppLockProviderProps) {
  return <>{children}</>;
}

export function markSessionUnlocked(uid: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("og_session_unlocked", uid);
}