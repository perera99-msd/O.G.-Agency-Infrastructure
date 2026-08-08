"use client";

import { useAuth } from "@/hooks/useAuth";
import { Activity, CheckCircle2, Clock, Globe, ArrowRight } from "lucide-react";

const DEFAULT_11_STEPS = [
  "Document Submission",
  "Medical Test",
  "Passport Submission",
  "Visa Application",
  "Visa Approval",
  "Fingerprint & Biometrics",
  "Insurance & Contract",
  "Bureau Clearance",
  "Flight Booking",
  "Pre-Departure Briefing",
  "Final Clearance & Departure"
];

export default function StatusPage() {
  const { user } = useAuth();
  const trackingList = user?.tracking || [];

  const completedCount = trackingList.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / 11) * 100);

  return (
    <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Overview Banner */}
      <div style={{
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        borderRadius: "18px",
        padding: "1.5rem",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px" }}>
              Migration Progress
            </span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "2px 0 0" }}>
              {completedCount} of 11 Steps Complete
            </h2>
          </div>
          <div style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            padding: "8px 14px",
            fontSize: "1.1rem",
            fontWeight: 800
          }}>
            {progressPercent}%
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: "100%",
          height: "8px",
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "#ffffff",
            borderRadius: "4px",
            transition: "width 0.4s ease"
          }} />
        </div>
      </div>

      {/* 11 Steps List */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "1.25rem",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}>
        <h3 style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#0f172a",
          marginTop: 0,
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Activity size={18} style={{ color: "#2563eb" }} />
          <span>Migration Checklist Steps</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {DEFAULT_11_STEPS.map((stepTitle, idx) => {
            const trackingItem = trackingList.find(t => t.step === stepTitle) || trackingList[idx];
            const isDone = trackingItem?.completed || false;
            const stepDate = trackingItem?.date;

            return (
              <div
                key={stepTitle}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: isDone ? "#f0fdf4" : "#f8fafc",
                  border: isDone ? "1px solid #bbf7d0" : "1px solid #f1f5f9"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isDone ? "#10b981" : "#cbd5e1",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    flexShrink: 0
                  }}>
                    {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <div>
                    <div style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: isDone ? "#15803d" : "#334155"
                    }}>
                      Step {idx + 1}: {stepTitle}
                    </div>
                    {stepDate && (
                      <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                        Completed on {stepDate}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: isDone ? "#dcfce7" : "#e2e8f0",
                  color: isDone ? "#166534" : "#64748b"
                }}>
                  {isDone ? "Done" : "Pending"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
