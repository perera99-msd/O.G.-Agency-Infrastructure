// src/components/auth/LoginForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle, actionLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await login(email, password);
    if (ok) router.push("/dashboard");
  }

  async function handleGoogle() {
    clearError();
    const ok = await loginWithGoogle();
    if (ok) router.push("/dashboard");
  }

  return (
    <div className="og-auth-form">
      <span className="og-eyebrow">SIGN IN</span>
      <h1 className="og-auth-title">Welcome back</h1>
      <p className="og-auth-subtitle">Track your application securely</p>

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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="og-form-error" role="alert">{error}</p>}

        <div className="og-auth-links">
          <Link href="/forgot-password" className="og-link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={actionLoading} className="og-btn--full">
          Sign In
        </Button>
      </form>

      <div className="og-divider">
        <span>or</span>
      </div>

      <SocialLoginButton onClick={handleGoogle} loading={actionLoading} />

      <p className="og-auth-footer">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="og-link">
          Register
        </Link>
      </p>
    </div>
  );
}
