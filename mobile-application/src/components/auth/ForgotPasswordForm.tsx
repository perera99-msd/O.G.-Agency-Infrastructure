// src/components/auth/ForgotPasswordForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const { forgotPassword, actionLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await forgotPassword(email);
    if (ok) setSent(true);
  }

  if (sent) {
    return (
      <div className="og-auth-form">
        <span className="og-eyebrow">CHECK YOUR EMAIL</span>
        <h1 className="og-auth-title">Reset link sent</h1>
        <p className="og-auth-subtitle">
          If an account exists for {email}, a password reset link is on its way.
        </p>
        <Link href="/login" className="og-link">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="og-auth-form">
      <span className="og-eyebrow">RESET PASSWORD</span>
      <h1 className="og-auth-title">Forgot your password?</h1>
      <p className="og-auth-subtitle">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="og-form-error" role="alert">{error}</p>}

        <Button type="submit" loading={actionLoading} className="og-btn--full">
          Send Reset Link
        </Button>
      </form>

      <p className="og-auth-footer">
        Remembered your password?{" "}
        <Link href="/login" className="og-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
