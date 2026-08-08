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
      {/* Welcome Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
        borderRadius: "20px",
        padding: "1.5rem",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(29, 78, 216, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.85, textTransform: "uppercase", letterSpacing: "1px" }}>
              Applicant Portal
            </span>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "2px 0 0" }}>
              Hello, {user?.fullName?.split(' ')[0] || 'Applicant'}! 👋
            </h1>
          </div>
          <div style={{
            padding: "6px 12px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <ShieldCheck size={16} />
            <span>{user?.passportNumber || 'PWA'}</span>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div style={{
          display: "flex",
          gap: "1rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid rgba(255,255,255,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 600 }}>
            <Globe size={15} style={{ opacity: 0.8 }} />
            <span>{user?.countryApplied || "Qatar"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 600 }}>
            <Briefcase size={15} style={{ opacity: 0.8 }} />
            <span>{user?.jobApplied || "General Worker"}</span>
          </div>
        </div>
      </div>

      {/* Migration Progress Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "1.25rem",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Checklist Status
          </span>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "2px 0 0" }}>
            {completedSteps} / 11 Steps Cleared
          </h3>
        </div>

        <Link
          href="/status"
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "10px",
            background: "#eff6ff",
            color: "#2563eb",
            fontSize: "0.82rem",
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Action Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Docs Card */}
        <Link
          href="/documents"
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "1.25rem",
            border: "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            transition: "transform 0.15s"
          }}
        >
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#0f172a" }}>
              My Documents
            </h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
              Upload & track files
            </p>
          </div>
        </Link>

        {/* Profile Card */}
        <Link
          href="/profile"
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "1.25rem",
            border: "1px solid #e2e8f0",
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            transition: "transform 0.15s"
          }}
        >
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "#f0fdf4",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <User size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#0f172a" }}>
              My Profile
            </h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
              Info & change PIN
            </p>
          </div>
        </Link>
      </div>

      {/* Support Banner */}
      <Link
        href="/inquiry"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "16px",
          padding: "1.15rem 1.25rem",
          color: "#ffffff",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <MessageSquare size={20} style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800 }}>Need Help with Visa?</h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>Contact agency support</p>
          </div>
        </div>

        <ArrowRight size={18} style={{ color: "#38bdf8" }} />
      </Link>
    </div>
  );
}
