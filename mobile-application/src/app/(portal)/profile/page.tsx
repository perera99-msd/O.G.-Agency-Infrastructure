"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Shield,
  Key,
  Globe,
  Briefcase,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  LogOut
} from "lucide-react";

export default function ProfilePage() {
  const { user, changePassword, logout } = useAuth();

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword.trim()) {
      setMessage({ type: "error", text: "Please enter your current password." });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: "error", text: "New password must be at least 4 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update password." });
    }
  };

  return (
    <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header Profile Card - Modern Gradient Hero Bento */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "24px",
        padding: "1.75rem 1.5rem",
        color: "#ffffff",
        boxShadow: "0 12px 30px -5px rgba(15, 23, 42, 0.25)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            fontWeight: 900,
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.4)",
            flexShrink: 0,
            color: "#ffffff"
          }}>
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={30} />}
          </div>
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 900, margin: 0, lineHeight: 1.15, letterSpacing: "-0.3px" }}>
              {user?.fullName || "Applicant User"}
            </h2>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
              <Shield size={14} style={{ color: "#38bdf8" }} />
              <span>Passport: {user?.passportNumber || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Information Card - Bento Grid */}
      <div style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "1.5rem",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)"
      }}>
        <h3 style={{
          fontSize: "1.05rem",
          fontWeight: 900,
          color: "#0f172a",
          marginTop: 0,
          marginBottom: "1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <User size={18} style={{ color: "#2563eb" }} />
          <span>Personal & Application Details</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
          <div style={{ background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>NIC Number</span>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              {user?.nicNumber || "Not Specified"}
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Country Applied</span>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#2563eb", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Globe size={14} />
              <span>{user?.countryApplied || "General"}</span>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Position</span>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Briefcase size={14} style={{ color: "#64748b" }} />
              <span>{user?.jobApplied || "General Worker"}</span>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Phone</span>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Phone size={14} style={{ color: "#10b981" }} />
              <span>{user?.phoneNumber || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card - Bento Container */}
      <div style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "1.5rem",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)"
      }}>
        <h3 style={{
          fontSize: "1.05rem",
          fontWeight: 900,
          color: "#0f172a",
          marginTop: 0,
          marginBottom: "0.25rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Key size={18} style={{ color: "#2563eb" }} />
          <span>Security & Change PIN / Password</span>
        </h3>
        <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 0, marginBottom: "1.25rem", fontWeight: 500 }}>
          Update your PWA password. Changes sync directly with Admin.
        </p>

        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {/* Current Password */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>
              Current Password / PIN
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"}
                required
                placeholder="Enter current PIN"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 2.5rem 0.85rem 1rem",
                  fontSize: "0.9rem",
                  borderRadius: "14px",
                  border: "1.5px solid #e2e8f0",
                  outline: "none",
                  background: "#f8fafc",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>
              New Password / PIN
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                required
                placeholder="Enter new PIN"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 2.5rem 0.85rem 1rem",
                  fontSize: "0.9rem",
                  borderRadius: "14px",
                  border: "1.5px solid #e2e8f0",
                  outline: "none",
                  background: "#f8fafc",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter new PIN"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                fontSize: "0.9rem",
                borderRadius: "14px",
                border: "1.5px solid #e2e8f0",
                outline: "none",
                background: "#f8fafc",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
            />
          </div>

          {/* Alert Feedback */}
          {message && (
            <div style={{
              padding: "0.85rem 1rem",
              borderRadius: "14px",
              fontSize: "0.85rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: message.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: message.type === "success" ? "#047857" : "#dc2626",
              border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`
            }}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
              transition: "transform 0.15s"
            }}
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Logout Button - Clean Red Outline Bento Pill */}
      <button
        onClick={async () => {
          if (confirm("Are you sure you want to log out?")) {
            await logout();
            window.location.href = "/login";
          }
        }}
        style={{
          width: "100%",
          padding: "0.9rem",
          borderRadius: "16px",
          border: "1.5px solid #fecaca",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: "0.95rem",
          fontWeight: 800,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s"
        }}
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );
}
