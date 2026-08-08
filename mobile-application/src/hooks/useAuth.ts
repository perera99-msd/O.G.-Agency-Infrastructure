"use client";

import { useEffect, useState, useCallback } from "react";
import { db, auth } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { signInWithCustomToken, signOut } from "firebase/auth";
import type { Employee } from "@/types/applicant";

interface UseAuthReturn {
  user: Employee | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  login: (passportNumber: string, pin: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  // Legacy stubs
  setupPin: (passportNumber: string, pin: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync user status on mount via stored employeeId
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedId = localStorage.getItem("og_mobile_user_id");

    if (!storedId) {
      setLoading(false);
      return;
    }

    // Subscribe to employee document updates in real-time
    const unsub = onSnapshot(doc(db, "employees", storedId), (docSnap) => {
      if (docSnap.exists()) {
        const empData = docSnap.data() as Omit<Employee, "id">;
        setUser({
          ...empData,
          id: docSnap.id,
          uid: docSnap.id,
          displayName: empData.fullName || "",
          email: empData.email || "",
        } as Employee);
      } else {
        localStorage.removeItem("og_mobile_user_id");
        localStorage.removeItem("og_mobile_passport");
        setUser(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (passportNumber: string, pin: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passportNumber, password: pin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Sign in failed. Please check credentials.");
        return false;
      }

      // If Custom Token returned, sign in with Firebase Auth client side for Storage rules
      if (data.customToken) {
        try {
          await signInWithCustomToken(auth, data.customToken);
        } catch (authErr) {
          console.warn("Custom token sign in warning (proceeding with local session):", authErr);
        }
      }

      // Store local session details
      localStorage.setItem("og_mobile_user_id", data.employeeId);
      localStorage.setItem("og_mobile_passport", data.passportNumber);
      localStorage.setItem("og_locked_uid", data.employeeId);
      sessionStorage.setItem("og_session_unlocked", data.employeeId);

      return true;
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.message || "An unexpected error occurred during sign in.");
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const empId = user?.id || localStorage.getItem("og_mobile_user_id");
    if (!empId) return { success: false, message: "No active session found." };

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: empId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error while changing password." };
    }
  }, [user]);

  const logout = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("og_mobile_user_id");
      localStorage.removeItem("og_mobile_passport");
      sessionStorage.removeItem("og_session_unlocked");
    }
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
  }, []);

  // Legacy stubs to preserve TS compatibility
  const setupPin = useCallback(async () => false, []);
  const register = useCallback(async () => false, []);
  const loginWithGoogle = useCallback(async () => false, []);
  const forgotPassword = useCallback(async () => false, []);

  return {
    user,
    loading,
    actionLoading,
    error,
    login,
    changePassword,
    logout,
    clearError,
    setupPin,
    register,
    loginWithGoogle,
    forgotPassword,
  };
}
