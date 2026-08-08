"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { signUpWithEmail, signInWithEmail, signOutUser } from "@/lib/firebase/auth";
import type { Employee } from "@/types/applicant";

interface UseAuthReturn {
  user: Employee | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  login: (passportNumber: string, pin: string) => Promise<boolean>;
  setupPin: (passportNumber: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  register: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync login status on mount
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
        // User deleted or not found in system
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
      const q = query(
        collection(db, "employees"),
        where("passportNumber", "==", passportNumber.trim().toUpperCase())
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setError("Passport number not registered.");
        return false;
      }

      const empDoc = snapshot.docs[0];
      const empData = empDoc.data() as Omit<Employee, "id">;

      if (!empData.mobilePin) {
        setError("PIN not set up. Please set up your PIN first.");
        return false;
      }

      if (empData.mobilePin !== pin) {
        setError("Incorrect PIN. Please try again.");
        return false;
      }

      // Silent Firebase Auth Session Initialization via Passport credentials
      const passportClean = passportNumber.trim().toLowerCase();
      const authEmail = `${passportClean}@ogagency.com`;
      const authPassword = `og_${passportClean}_pin`;

      try {
        await signInWithEmail(authEmail, authPassword);
      } catch (authErr: any) {
        if (authErr.code === "auth/user-not-found" || authErr.code === "auth/invalid-credential") {
          try {
            await signUpWithEmail(authEmail, authPassword);
          } catch {
            await signInWithEmail(authEmail, authPassword);
          }
        } else {
          throw authErr;
        }
      }

      // Successful login
      localStorage.setItem("og_mobile_user_id", empDoc.id);
      localStorage.setItem("og_mobile_passport", empData.passportNumber);
      localStorage.setItem("og_pin_setup_complete", "true");
      localStorage.setItem("og_locked_uid", empDoc.id);
      sessionStorage.setItem("og_session_unlocked", empDoc.id);

      setUser({
        ...empData,
        id: empDoc.id,
        uid: empDoc.id,
        displayName: empData.fullName || "",
        email: empData.email || "",
      } as Employee);

      return true;
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.message || "An unexpected error occurred during sign in.");
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const setupPin = useCallback(async (passportNumber: string, pin: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "employees"),
        where("passportNumber", "==", passportNumber.trim().toUpperCase())
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setError("Passport number not registered.");
        return false;
      }

      const empDoc = snapshot.docs[0];
      const empData = empDoc.data() as Omit<Employee, "id">;

      if (empData.mobilePin) {
        setError("PIN is already set up for this passport. Please sign in instead.");
        return false;
      }

      // Silent Firebase Auth Setup via Passport credentials
      const passportClean = passportNumber.trim().toLowerCase();
      const authEmail = `${passportClean}@ogagency.com`;
      const authPassword = `og_${passportClean}_pin`;

      try {
        await signUpWithEmail(authEmail, authPassword);
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          await signInWithEmail(authEmail, authPassword);
        } else {
          throw authErr;
        }
      }

      // Update employee document in Firestore with mobilePin
      await updateDoc(doc(db, "employees", empDoc.id), {
        mobilePin: pin
      });

      // Log the user in
      localStorage.setItem("og_mobile_user_id", empDoc.id);
      localStorage.setItem("og_mobile_passport", empData.passportNumber);
      localStorage.setItem("og_pin_setup_complete", "true");
      localStorage.setItem("og_locked_uid", empDoc.id);
      sessionStorage.setItem("og_session_unlocked", empDoc.id);

      setUser({
        ...empData,
        id: empDoc.id,
        uid: empDoc.id,
        mobilePin: pin,
        displayName: empData.fullName || "",
        email: empData.email || "",
      } as Employee);

      return true;
    } catch (err: any) {
      console.error("PIN Setup failed:", err);
      setError(err?.message || "An unexpected error occurred during PIN setup.");
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("og_mobile_user_id");
      localStorage.removeItem("og_mobile_passport");
    }
    await signOutUser();
    setUser(null);
  }, []);

  // Dummy mock functions to satisfy TS checks on legacy registration/forgot pages
  const register = useCallback(async () => false, []);
  const loginWithGoogle = useCallback(async () => false, []);
  const forgotPassword = useCallback(async () => false, []);

  return {
    user,
    loading,
    actionLoading,
    error,
    login,
    setupPin,
    logout,
    clearError,
    register,
    loginWithGoogle,
    forgotPassword,
  };
}
