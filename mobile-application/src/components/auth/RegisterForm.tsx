// src/components/auth/RegisterForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

export function RegisterForm() {
  const router = useRouter();
  const { register, loginWithGoogle, actionLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    if (!agreed) {
      setLocalError("Please accept the Terms & Privacy Policy to continue.");
      return;
    }

    const ok = await register(email, password);
    if (ok) router.push("/dashboard");
  }

  async function handleGoogle() {
    clearError();
    setLocalError(null);
    const ok = await loginWithGoogle();
    if (ok) router.push("/dashboard");
  }

  const displayError = localError || error;

  return (
    <div className="og-auth-form">
      <span className="og-eyebrow">CREATE ACCOUNT</span>
      <h1 className="og-auth-title">Start your application</h1>
      <p className="og-auth-subtitle">Track progress and upload documents securely</p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label className="og-checkbox-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="og-link">Terms</Link> and{" "}
            <Link href="/privacy" className="og-link">Privacy Policy</Link>
          </span>
        </label>

        {displayError && <p className="og-form-error" role="alert">{displayError}</p>}

        <Button type="submit" loading={actionLoading} className="og-btn--full">
          Create Account
        </Button>
      </form>

      <div className="og-divider">
        <span>or</span>
      </div>

      <SocialLoginButton onClick={handleGoogle} loading={actionLoading} />

      <p className="og-auth-footer">
        Already have an account?{" "}
        <Link href="/login" className="og-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
