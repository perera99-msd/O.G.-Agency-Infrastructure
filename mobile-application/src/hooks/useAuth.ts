// src/hooks/useAuth.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import type { User } from "firebase/auth";
import {
  onAuthChange,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  getAuthErrorMessage,
} from "@/lib/firebase/auth";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;       // true while Firebase determines initial auth state
  actionLoading: boolean; // true while a login/signup/etc. call is in-flight
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setActionLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOutUser();
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      return true;
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    actionLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    clearError,
  };
}
