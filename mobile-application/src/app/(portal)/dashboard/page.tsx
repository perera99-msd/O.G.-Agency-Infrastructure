"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  FileText,
  Activity,
  User,
  MessageSquare,
  Globe,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const trackingList = user?.tracking || [];
  const completedSteps = trackingList.filter(t => t.completed).length;

  return (
    <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Hero Welcome Card - Vibrant Gradient Bento */}
      <div style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        borderRadius: "24px",
        padding: "1.75rem 1.5rem",
        color: "#ffffff",
        boxShadow: "0 14px 30px -5px rgba(37, 99, 235, 0.35)",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle Background Glow Elements */}
        <div style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "50%",
          filter: "blur(20px)"
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
          <div>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
              Welcome Back
            </span>
            <h1 style={{ fontSize: "1.65rem", fontWeight: 900, margin: "2px 0 0", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Hello, {user?.fullName?.split(' ')[0] || 'Applicant'}! 👋
            </h1>
          </div>
          <div style={{
            padding: "6px 12px",
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(10px)",
            borderRadius: "14px",
            fontSize: "0.78rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            border: "1px solid rgba(255,255,255,0.3)"
          }}>
            <ShieldCheck size={15} />
            <span>{user?.passportNumber || 'PWA'}</span>
          </div>
        </div>

        {/* Quick Info Pill Bar */}
        <div style={{
          display: "flex",
          gap: "0.6rem",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(8px)",
            padding: "6px 14px",
            borderRadius: "30px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8rem",
            fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <Globe size={14} />
            <span>{user?.countryApplied || "Qatar"}</span>
          </div>
          <div style={{
            background: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(8px)",
            padding: "6px 14px",
            borderRadius: "30px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8rem",
            fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <Briefcase size={14} />
            <span>{user?.jobApplied || "General Worker"}</span>
          </div>
        </div>
      </div>

      {/* Bento Row 1: Large Progress Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "1.5rem",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Migration Progress
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: "2px 0 0" }}>
              {completedSteps} <span style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: 700 }}>/ 11 Steps Cleared</span>
            </h3>
          </div>

          <Link
            href="/status"
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: "14px",
              background: "#eff6ff",
              color: "#2563eb",
              fontSize: "0.82rem",
              fontWeight: 800,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "transform 0.15s"
            }}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Progress Bar Track */}
        <div style={{
          width: "100%",
          height: "10px",
          background: "#f1f5f9",
          borderRadius: "30px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${Math.round((completedSteps / 11) * 100)}%`,
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
            borderRadius: "30px",
            transition: "width 0.4s ease"
          }} />
        </div>
      </div>

      {/* Bento Grid 2 Columns: Colorful Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Documents Card - Soft Blue Bento */}
        <Link
          href="/documents"
          style={{
            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
            borderRadius: "24px",
            padding: "1.35rem 1.25rem",
            textDecoration: "none",
            boxShadow: "0 10px 20px -5px rgba(56, 189, 248, 0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "140px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: "#ffffff",
            color: "#0284c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)"
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 900, color: "#0369a1" }}>
              Documents
            </h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#0284c7", fontWeight: 700 }}>
              Files & Records
            </p>
          </div>
        </Link>

        {/* Profile Card - Soft Emerald Bento */}
        <Link
          href="/profile"
          style={{
            background: "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)",
            borderRadius: "24px",
            padding: "1.35rem 1.25rem",
            textDecoration: "none",
            boxShadow: "0 10px 20px -5px rgba(34, 197, 94, 0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "140px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: "#ffffff",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.15)"
          }}>
            <User size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 900, color: "#15803d" }}>
              My Profile
            </h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#16a34a", fontWeight: 700 }}>
              Account & Security
            </p>
          </div>
        </Link>
      </div>

      {/* Support Banner - Soft Dark Bento */}
      <Link
        href="/inquiry"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "24px",
          padding: "1.35rem 1.4rem",
          color: "#ffffff",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 12px 25px -5px rgba(15, 23, 42, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: "rgba(56, 189, 248, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <MessageSquare size={22} style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 900 }}>Agency Inquiry Chat</h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.76rem", color: "#94a3b8", fontWeight: 600 }}>Real-time agency support</p>
          </div>
        </div>

        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <ArrowRight size={16} style={{ color: "#38bdf8" }} />
        </div>
      </Link>
    </div>
  );
}
