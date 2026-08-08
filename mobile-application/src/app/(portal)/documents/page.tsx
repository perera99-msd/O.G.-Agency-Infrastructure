"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { compressImage } from "@/lib/imageCompressor";
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
  { key: "nicDocUrl", title: "NIC Document" },
  { key: "passportDocUrl", title: "Passport Document" },
  { key: "policeReportUrl", title: "Police Clearance Report" },
  { key: "photoUrl", title: "Applicant Photograph" }
];

const getCountrySteps = (country?: string) => {
  const dest = country || 'Destination';
  const isRussia = dest.toLowerCase() === 'russia';
  const isRomania = dest.toLowerCase() === 'romania';
  const adj = isRussia ? 'Russian' : isRomania ? 'Romanian' : dest;

  return [
    'Video Upload',
    'Photo Upload',
    'Medical Receipt',
    'Medical Report',
    'Apply the Company',
    'Invitation',
    `${adj} Agreement`,
    'English Agreement',
    `${adj} Embassy Process`,
    'Bureau Done',
    'Tickets',
  ];
};

const getCountryIsoCode = (country?: string) => {
  if (!country) return null;
  const c = country.toLowerCase();
  if (c.includes('russia')) return 'ru';
  if (c.includes('romania')) return 'ro';
  if (c.includes('qatar')) return 'qa';
  if (c.includes('saudi') || c.includes('ksa')) return 'sa';
  if (c.includes('dubai') || c.includes('uae') || c.includes('emirates')) return 'ae';
  if (c.includes('kuwait')) return 'kw';
  if (c.includes('oman')) return 'om';
  if (c.includes('bahrain')) return 'bh';
  if (c.includes('malaysia')) return 'my';
  if (c.includes('singapore')) return 'sg';
  if (c.includes('maldives')) return 'mv';
  if (c.includes('cyprus')) return 'cy';
  if (c.includes('poland')) return 'pl';
  return null;
};

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        compressImage(file, { maxWidth: 1400, maxHeight: 1000, quality: 0.8, maxSizeKB: 800 })
          .then(resolve)
          .catch(reject);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const stepName = currentStepForUpload.current;

    if (!file || !stepName || !user?.id) return;

    if (!file.type.startsWith('image/') && file.size > 900 * 1024) {
      alert('PDF file is too large. Please keep it under 900KB.');
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadingStep(stepName);
    try {
      const base64Url = await fileToBase64(file);

      // Create submission doc in Firestore
      await addDoc(collection(db, "user_submissions"), {
        employeeId: user.id,
        employeeName: user.fullName || "Applicant",
        passportNumber: user.passportNumber || "",
        stepName: stepName,
        fileUrl: base64Url,
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
    ...getCountrySteps(user?.countryApplied).map((s, idx) => {
      const trackingMatch = (user?.tracking || []).find(t => t.step === s) || (user?.tracking || [])[idx];
      return {
        stepName: s,
        type: `Checklist #${idx + 1}`,
        existingUrl: trackingMatch?.fileUrl || null
      };
    })
  ];

  const countryCode = getCountryIsoCode(user?.countryApplied);

  return (
    <div style={{ 
      padding: "1.25rem 1rem", 
      display: "flex", 
      flexDirection: "column", 
      gap: "1.5rem",
      background: "#f8fafc",
      minHeight: "100vh",
      paddingBottom: "100px"
    }}>
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
        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        borderRadius: "24px",
        padding: "1.75rem",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glassmorphic Decor */}
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "150px", height: "150px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(4px)" }} />
        <div style={{ position: "absolute", bottom: "-40%", left: "5%", width: "120px", height: "120px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(2px)" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              <FileText size={26} color="white" />
            </div>

            {/* Country Flag Logo */}
            {countryCode && (
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                background: "#ffffff"
              }}>
                <img 
                  src={`https://flagcdn.com/w80/${countryCode}.png`} 
                  alt={`${user?.countryApplied} Flag`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
          
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            My Documents
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.85)", margin: "8px 0 0", lineHeight: 1.4 }}>
            Manage and upload your required files. Admin approved files are locked safely into your official record.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          padding: "1rem 1.25rem",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          fontWeight: 700,
          fontSize: "0.9rem",
          boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "slideIn 0.3s ease-out forwards"
        }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", padding: "4px" }}>
            <CheckCircle2 size={18} />
          </div>
          <span>{toast}</span>
        </div>
      )}

      {/* Document List Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
        {allDocItems.map((docItem) => {
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
                borderRadius: "20px",
                padding: "1.25rem",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: isApproved ? "0 4px 15px rgba(16, 185, 129, 0.08)" : "0 4px 15px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Left Accent Bar */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                background: isApproved ? "#10b981" : isPending ? "#f59e0b" : isRejected ? "#ef4444" : "#cbd5e1"
              }} />

              {/* Header Info */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px"
                  }}>
                    {docItem.type}
                  </span>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>
                    {docItem.stepName}
                  </h4>
                </div>

                {/* Status Badge */}
                {isApproved && (
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <CheckCircle2 size={16} />
                    Approved
                  </span>
                )}
                {isPending && (
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: "rgba(245, 158, 11, 0.1)",
                    color: "#f59e0b",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    animation: "pulse 2s infinite"
                  }}>
                    <Clock size={16} />
                    Reviewing
                  </span>
                )}
                {isRejected && (
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <AlertCircle size={16} />
                    Action Required
                  </span>
                )}
                {isMissing && (
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: 800
                  }}>
                    Pending Upload
                  </span>
                )}
              </div>

              {/* Rejection Note */}
              {isRejected && latestSub?.comment && (
                <div style={{
                  background: "#fef2f2",
                  borderLeft: "3px solid #ef4444",
                  borderRadius: "0 8px 8px 0",
                  padding: "0.75rem 1rem",
                  fontSize: "0.85rem",
                  color: "#991b1b",
                  fontWeight: 500
                }}>
                  <strong style={{ display: "block", marginBottom: "2px" }}>Admin Feedback:</strong> 
                  {latestSub.comment}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {displayUrl && (
                  <button
                    onClick={() => setPreviewUrl(displayUrl)}
                    style={{
                      flex: 1,
                      padding: "0.85rem",
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      color: "#334155",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <Eye size={18} />
                    <span>View File</span>
                  </button>
                )}

                {(isMissing || isRejected) && (
                  <button
                    onClick={() => triggerUpload(docItem.stepName)}
                    disabled={isUploading}
                    style={{
                      flex: 1,
                      padding: "0.85rem",
                      borderRadius: "14px",
                      border: "none",
                      background: isRejected ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: isUploading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: isRejected ? "0 4px 15px rgba(239, 68, 68, 0.3)" : "0 4px 15px rgba(79, 70, 229, 0.3)",
                      transition: "transform 0.1s"
                    }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {isUploading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Upload size={18} />
                    )}
                    <span>{isRejected ? "Re-upload Now" : "Upload Document"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Glassmorphic Document View Modal */}
      {previewUrl && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "480px",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f8fafc"
            }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileCheck size={20} color="#3b82f6" />
                Document Preview
              </h4>
              <button
                onClick={() => setPreviewUrl(null)}
                style={{ 
                  background: "#e2e8f0", 
                  border: "none", 
                  cursor: "pointer", 
                  color: "#475569",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#cbd5e1"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", justifyContent: "center", background: "#f1f5f9" }}>
              <img
                src={previewUrl}
                alt="Document Preview"
                style={{ maxWidth: "100%", borderRadius: "12px", objectFit: "contain", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add keyframes globally if not already present in layout, but standard CSS animations can be done inline or assume global. */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
