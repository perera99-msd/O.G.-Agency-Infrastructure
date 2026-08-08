"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";

interface InquiryMessage {
  id: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "open" | "replied" | "closed";
}

export default function InquiryPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Real-time listener for user inquiries
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "inquiries"),
      where("employeeId", "==", user.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<InquiryMessage, "id">)
      }));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInquiries(list);
    }, (err) => {
      console.error("Inquiries listener error:", err);
    });

    return () => unsub();
  }, [user?.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !user?.id) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        employeeId: user.id,
        fullName: user.fullName || "Applicant",
        passportNumber: user.passportNumber || "",
        subject: subject.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: "open"
      });

      setSubject("");
      setMessage("");
      setToast("Inquiry sent successfully to Admin!");
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      console.error("Inquiry submission error:", err);
      alert("Failed to send inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        borderRadius: "18px",
        padding: "1.5rem",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.3)"
      }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <MessageSquare size={22} style={{ color: "#a5b4fc" }} />
          <span>Support & Inquiries</span>
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#c7d2fe", margin: "6px 0 0" }}>
          Have questions about your visa or application? Send a direct inquiry to the agency staff.
        </p>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div style={{
          padding: "0.85rem 1rem",
          background: "#10b981",
          color: "#ffffff",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Inquiry Form */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "1.25rem",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginTop: 0, marginBottom: "1rem" }}>
          Send New Inquiry
        </h3>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
              Subject / Topic
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Visa Status Question"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.85rem",
                fontSize: "0.9rem",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
              Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write your inquiry details here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.85rem",
                fontSize: "0.9rem",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "10px",
              border: "none",
              background: "#4f46e5",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
          >
            <Send size={16} />
            <span>{submitting ? "Sending..." : "Submit Inquiry"}</span>
          </button>
        </form>
      </div>

      {/* Past Inquiries History */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "1.25rem",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginTop: 0, marginBottom: "1rem" }}>
          Inquiry History ({inquiries.length})
        </h3>

        {inquiries.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center", margin: "1rem 0" }}>
            No past inquiries found.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                  padding: "0.85rem 1rem",
                  border: "1px solid #f1f5f9"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>
                    {inq.subject}
                  </h4>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: inq.status === "open" ? "#fef9c3" : "#dcfce7",
                    color: inq.status === "open" ? "#854d0e" : "#166534"
                  }}>
                    {inq.status}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#475569", margin: "6px 0 4px" }}>
                  {inq.message}
                </p>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                  Sent on {new Date(inq.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
