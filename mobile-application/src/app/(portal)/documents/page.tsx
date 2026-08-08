"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileCheck,
  RefreshCw
} from "lucide-react";

interface Submission {
  id: string;
  stepName: string;
  fileUrl: string;
  fileName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  comment?: string;
}

const REGISTRATION_DOCS = [
  { key: "passportDocUrl", title: "Passport Document" },
  { key: "nicDocUrl", title: "NIC Document" },
  { key: "policeReportUrl", title: "Police Clearance Report" },
  { key: "photoUrl", title: "Applicant Photograph" }
];

const CHECKLIST_STEPS = [
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

export default function DocumentsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [uploadingStep, setUploadingStep] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentStepForUpload = useRef<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time listener for user_submissions
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "user_submissions"),
      where("employeeId", "==", user.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Submission, "id">)
      }));
      setSubmissions(list);
    }, (err) => {
      console.error("Submissions listener error:", err);
    });

    return () => unsub();
  }, [user?.id]);

  const triggerUpload = (stepName: string) => {
    currentStepForUpload.current = stepName;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const stepName = currentStepForUpload.current;

    if (!file || !stepName || !user?.id) return;

    setUploadingStep(stepName);
    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const storagePath = `user_uploads/${user.id}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadTask.ref);

      // Create submission doc in Firestore
      await addDoc(collection(db, "user_submissions"), {
        employeeId: user.id,
        employeeName: user.fullName || "Applicant",
        passportNumber: user.passportNumber || "",
        stepName: stepName,
        fileUrl: downloadUrl,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: "pending"
      });

      showToast(`Uploaded "${file.name}"! Submitted for Admin review.`);
    } catch (err: any) {
      console.error("File upload error:", err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingStep(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Combine Registration & Checklist Documents
  const allDocItems = [
    ...REGISTRATION_DOCS.map(d => ({
      stepName: d.title,
      type: "Registration Document",
      existingUrl: (user as any)?.[d.key] || null
    })),
    ...CHECKLIST_STEPS.map((s, idx) => {
      const trackingMatch = (user?.tracking || []).find(t => t.step === s) || (user?.tracking || [])[idx];
      return {
        stepName: s,
        type: `Checklist #${idx + 1}`,
        existingUrl: trackingMatch?.fileUrl || null
      };
    })
  ];

  return (
    <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        style={{ display: "none" }}
      />

      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "18px",
        padding: "1.5rem",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3)"
      }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={22} style={{ color: "#38bdf8" }} />
          <span>My Documents</span>
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: "6px 0 0" }}>
          Upload required documents. Once approved by Admin, files are locked into your official record.
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          padding: "0.85rem 1rem",
          background: "#10b981",
          color: "#ffffff",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "0.88rem",
          boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Document List Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {allDocItems.map((docItem) => {
          // Find matching submission (pending or rejected or approved)
          const latestSub = submissions
            .filter(s => s.stepName === docItem.stepName)
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

          const isApproved = Boolean(docItem.existingUrl) || latestSub?.status === "approved";
          const isPending = !isApproved && latestSub?.status === "pending";
          const isRejected = !isApproved && !isPending && latestSub?.status === "rejected";
          const isMissing = !isApproved && !isPending && !isRejected;

          const displayUrl = docItem.existingUrl || latestSub?.fileUrl;
          const isUploading = uploadingStep === docItem.stepName;

          return (
            <div
              key={docItem.stepName}
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1rem 1.15rem",
                border: isApproved
                  ? "1px solid #a7f3d0"
                  : isPending
                  ? "1px solid #fef08a"
                  : isRejected
                  ? "1px solid #fecaca"
                  : "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              {/* Header Info */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {docItem.type}
                  </span>
                  <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", margin: "2px 0 0" }}>
                    {docItem.stepName}
                  </h4>
                </div>

                {/* Status Badge */}
                {isApproved && (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: "#dcfce7",
                    color: "#15803d",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <CheckCircle2 size={14} />
                    Approved
                  </span>
                )}

                {isPending && (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: "#fef9c3",
                    color: "#a16207",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <Clock size={14} />
                    Pending Review
                  </span>
                )}

                {isRejected && (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <AlertCircle size={14} />
                    Rejected
                  </span>
                )}

                {isMissing && (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.72rem",
                    fontWeight: 700
                  }}>
                    Missing
                  </span>
                )}
              </div>

              {/* Rejection Note if Rejected */}
              {isRejected && latestSub?.comment && (
                <div style={{
                  background: "#fff1f2",
                  border: "1px solid #ffe4e6",
                  borderRadius: "8px",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.82rem",
                  color: "#9f1239"
                }}>
                  <strong>Admin Rejection Note:</strong> {latestSub.comment}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "4px" }}>
                {/* View Button */}
                {displayUrl && (
                  <button
                    onClick={() => setPreviewUrl(displayUrl)}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#334155",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Eye size={16} />
                    <span>View Document</span>
                  </button>
                )}

                {/* Upload Button (Only if Missing or Rejected) */}
                {(isMissing || isRejected) && (
                  <button
                    onClick={() => triggerUpload(docItem.stepName)}
                    disabled={isUploading}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "none",
                      background: isRejected ? "#dc2626" : "#2563eb",
                      color: "#ffffff",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: isUploading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)"
                    }}
                  >
                    {isUploading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}
                    <span>{isRejected ? "Re-upload File" : "Upload File"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document View Modal */}
      {previewUrl && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "460px",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Document Preview</h4>
              <button
                onClick={() => setPreviewUrl(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "1rem", overflowY: "auto", display: "flex", justifyContent: "center" }}>
              <img
                src={previewUrl}
                alt="Document Preview"
                style={{ maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
