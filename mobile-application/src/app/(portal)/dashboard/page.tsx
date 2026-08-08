"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { UserSubmission, TrackingStep } from "@/types/applicant";
import {
  LogOut,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  Calendar,
} from "lucide-react";

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [uploadingSteps, setUploadingSteps] = useState<Record<string, boolean>>({});

  // Real-time listener for user submissions
  useEffect(() => {
    if (!user?.id) return;
    const q = query(
      collection(db, "user_submissions"),
      where("employeeId", "==", user.id)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserSubmission, "id">),
      }) as UserSubmission);
      setSubmissions(list);
    }, (err) => {
      console.error("Submissions listener error:", err);
    });

    return () => unsub();
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleFileUpload = async (stepName: string, files: FileList | null) => {
    if (!files || !files.length || !user) return;
    const file = files[0];

    setUploadingSteps((prev) => ({ ...prev, [stepName]: true }));

    try {
      const cleanedStepName = stepName.replace(/[^a-zA-Z0-9]/g, "_");
      const storagePath = `user_submissions/${user.id}/${cleanedStepName}_${file.name}`;
      const fileRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const subId = `${user.id}_${cleanedStepName}`;
      await setDoc(doc(db, "user_submissions", subId), {
        id: subId,
        employeeId: user.id,
        employeeName: user.fullName,
        passportNumber: user.passportNumber,
        stepName: stepName,
        fileUrl: downloadUrl,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: "pending",
        comment: "",
      });

      alert(`"${stepName}" document sent successfully! OG staff will review it.`);
    } catch (err) {
      console.error("Failed to upload document:", err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingSteps((prev) => ({ ...prev, [stepName]: false }));
    }
  };

  if (loading || !user) {
    return (
      <div className="dashboard-loading" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: "1rem", background: "var(--bg-primary)" }}>
        <div className="dashboard-loading__spinner" style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent-color)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--text-secondary)" }}>Loading your application portal...</p>
      </div>
    );
  }

  // Calculate overall progress from checklist
  const currentTracking = user.tracking || [];
  const completedSteps = currentTracking.filter((t) => t.completed).length;
  const totalSteps = currentTracking.length;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Map submissions by step name for easier lookup
  const submissionMap = new Map(submissions.map((s) => [s.stepName, s]));

  return (
    <div className="dashboard-page" style={{ padding: "1.5rem", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      
      {/* Header */}
      <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div className="dashboard-header__greeting">
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Hello, {user.fullName.split(" ")[0]}</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Visa Application Tracking Portal</p>
        </div>
        <button
          className="dashboard-header__logout"
          onClick={handleLogout}
          aria-label="Log out"
          style={{ background: "rgba(255, 68, 68, 0.1)", border: "1px solid rgba(255, 68, 68, 0.2)", borderRadius: "10px", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#ff4444", cursor: "pointer" }}
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Profile summary card */}
      <section className="dashboard-section" style={{ marginBottom: "1.5rem" }}>
        <div className="profile-card" style={{ padding: "1.25rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="profile-card__avatar-placeholder" style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--accent-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "bold", color: "white" }}>
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700" }}>{user.fullName}</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>Passport: {user.passportNumber}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <MapPin size={14} style={{ color: "var(--accent-color)" }} />
              <span>Applied for {user.countryApplied}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Status Card */}
      <section className="dashboard-section" style={{ marginBottom: "2rem" }}>
        <div className="dashboard-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)" }}>
          <div className="dashboard-card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Visa Processing Status</h3>
            <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--accent-color)" }}>{progressPct}%</span>
          </div>
          
          <div className="progress-summary__bar" style={{ width: "100%", height: 8, background: "rgba(255, 255, 255, 0.05)", borderRadius: "99px", overflow: "hidden", marginBottom: "0.5rem" }}>
            <div className="progress-summary__fill" style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-color), var(--success-color))", borderRadius: "99px", transition: "width 0.4s" }} />
          </div>
          
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            {completedSteps} of {totalSteps} milestones achieved
          </p>
        </div>
      </section>

      {/* Visa Checklist milestones list */}
      <section className="dashboard-section">
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-color)" }}>
          Milestone Checklist
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {currentTracking.map((step, idx) => {
            const sub = submissionMap.get(step.step);

            return (
              <div
                key={idx}
                style={{
                  padding: "1rem",
                  background: step.completed ? "rgba(34, 197, 94, 0.04)" : "var(--bg-secondary)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${step.completed ? "rgba(34, 197, 94, 0.2)" : "var(--border-color)"}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {/* Milestone Info */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    {step.completed ? (
                      <CheckCircle2 size={22} style={{ color: "var(--success-color)", flexShrink: 0 }} />
                    ) : sub?.status === "pending" ? (
                      <Clock size={22} style={{ color: "var(--warning-color)", flexShrink: 0 }} />
                    ) : (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: "2px solid var(--text-tertiary)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: step.completed ? "var(--success-color)" : "var(--text-primary)" }}>
                        {step.step}
                      </h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {step.completed ? `Completed on ${formatDate(step.date)}` : "Awaiting processing"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submissions feedback / requests */}
                {!step.completed && sub?.status === "rejected" && (
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      color: "var(--error-color)",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <strong>Unclear Document:</strong> {sub.comment || "Please re-upload a clear scanned copy of this document."}
                    </div>
                  </div>
                )}

                {/* Send / Upload action block (if document is not uploaded yet or was rejected) */}
                {!step.completed && (
                  <div style={{ marginTop: "0.25rem" }}>
                    {sub?.status === "pending" ? (
                      <div
                        style={{
                          padding: "0.5rem",
                          textAlign: "center",
                          fontSize: "0.8rem",
                          background: "var(--bg-tertiary)",
                          color: "var(--warning-color)",
                          borderRadius: "8px",
                          fontWeight: "600",
                          border: "1px solid rgba(245, 158, 11, 0.2)",
                        }}
                      >
                        ✓ Document sent for review
                      </div>
                    ) : (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "0.6rem",
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "var(--accent-color)",
                          border: "1px dashed var(--accent-color)",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <UploadCloud size={16} />
                        <span>
                          {uploadingSteps[step.step]
                            ? "Sending..."
                            : sub?.status === "rejected"
                            ? "Re-upload Document"
                            : "Send Document"}
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(step.step, e.target.files)}
                          disabled={uploadingSteps[step.step]}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Keyframe animations support */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
