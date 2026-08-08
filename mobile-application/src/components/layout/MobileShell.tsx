"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  User,
  FileText,
  Activity,
  MessageSquare,
  LogOut,
  ShieldCheck
} from "lucide-react";

interface MobileShellProps {
  children: ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Status", href: "/status", icon: Activity },
    { label: "Home", href: "/dashboard", icon: Home, isCenter: true },
    { label: "Docs", href: "/documents", icon: FileText },
    { label: "Inquiry", href: "/inquiry", icon: MessageSquare },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await logout();
      router.push("/login");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      boxShadow: "0 0 40px rgba(0, 0, 0, 0.08)",
      fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)"
    }}>
      {/* Top Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        padding: "0.75rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.95rem",
            boxShadow: "0 3px 10px rgba(37, 99, 235, 0.3)"
          }}>
            OG
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
              O.G. Agency
            </div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}>
              {user?.fullName ? user.fullName.split(' ')[0] : 'Applicant Portal'}
            </div>
          </div>
        </div>

        {/* User Quick Info & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            padding: "4px 8px",
            background: "#e0f2fe",
            borderRadius: "6px",
            color: "#0369a1",
            fontSize: "0.72rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <ShieldCheck size={13} />
            <span>{user?.passportNumber || "PWA"}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area with Bottom Padding for Navbar */}
      <main style={{
        flex: 1,
        paddingBottom: "80px"
      }}>
        {children}
      </main>

      {/* Fixed Bottom Mobile Navbar */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "500px",
        height: "68px",
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 50,
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)"
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  position: "relative",
                  top: "-14px",
                  textDecoration: "none"
                }}
              >
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: isActive
                    ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 6px 18px rgba(37, 99, 235, 0.45)",
                  border: "3px solid #ffffff"
                }}>
                  <Icon size={24} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                textDecoration: "none",
                color: isActive ? "#2563eb" : "#94a3b8",
                transition: "color 0.2s",
                padding: "6px 12px"
              }}
            >
              <Icon size={20} style={{ strokeWidth: isActive ? 2.5 : 2 }} />
              <span style={{
                fontSize: "0.68rem",
                fontWeight: isActive ? 700 : 500
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
