"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#64748b"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e2e8f0",
          borderTopColor: "#2563eb",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", fontWeight: 600 }}>Loading Portal...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#64748b"
      }}>
        <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>Redirecting to Login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
