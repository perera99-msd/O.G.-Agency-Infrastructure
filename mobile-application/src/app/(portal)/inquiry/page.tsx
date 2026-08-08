"use client";

import React, { useState, useEffect, useRef, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  orderBy,
  increment,
  setDoc
} from "firebase/firestore";
import {
  MessageSquare,
  Send,
  Plus,
  ArrowLeft,
  Clock,
  CheckCheck,
  User,
  ShieldCheck,
  X,
  Sparkles,
  Trash2
} from "lucide-react";

interface ChatThread {
  id: string;
  employeeId: string;
  fullName: string;
  passportNumber: string;
  subject: string;
  status: "open" | "replied" | "closed";
  createdAt: string;
  lastMessageAt: string;
  lastMessageText: string;
  lastMessageBy: "user" | "admin";
  unreadByUser?: number;
  deletedByUser?: boolean;
}


interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

export default function InquiryPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // New inquiry modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newFirstMessage, setNewFirstMessage] = useState("");
  const [creating, setCreating] = useState(false);

  // Chat message input
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Listen for user's chat threads
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "pwa_chats"),
      where("employeeId", "==", user.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ChatThread, "id">)
      }));
      // Filter out threads hidden/deleted by user
      list = list.filter((t) => !t.deletedByUser);

      // Sort by lastMessageAt descending
      list.sort((a, b) => new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime());
      setThreads(list);

      // If active thread exists, keep sync
      if (activeThread) {
        const updated = list.find((t) => t.id === activeThread.id);
        if (updated) {
          setActiveThread(updated);
        } else {
          setActiveThread(null);
        }
      }
    }, (err) => {
      console.error("Chats listener error:", err);
    });

    return () => unsub();
  }, [user?.id, activeThread?.id]);

  // Soft delete thread from mobile view
  const handleUserDeleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this inquiry thread from your chat list?")) return;
    try {
      await updateDoc(doc(db, "pwa_chats", chatId), {
        deletedByUser: true
      });
      if (activeThread?.id === chatId) {
        setActiveThread(null);
      }
    } catch (err: any) {
      console.error("Error hiding chat:", err);
      alert("Failed to delete chat thread.");
    }
  };


  // 2. Listen for messages in active thread
  useEffect(() => {
    if (!activeThread?.id) {
      setMessages([]);
      return;
    }

    // Reset unreadByUser when chat is opened
    if (activeThread.unreadByUser && activeThread.unreadByUser > 0) {
      updateDoc(doc(db, "pwa_chats", activeThread.id), {
        unreadByUser: 0
      }).catch(err => console.error("Reset unread error:", err));
    }

    const messagesQuery = query(
      collection(db, "pwa_chats", activeThread.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ChatMessage, "id">)
      }));
      setMessages(msgs);
    }, (err) => {
      console.error("Messages listener error:", err);
    });

    return () => unsub();
  }, [activeThread?.id]);

  // Create new conversation thread
  const handleCreateInquiry = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newFirstMessage.trim() || !user?.id) return;

    setCreating(true);
    try {
      const chatRef = doc(collection(db, "pwa_chats"));
      const now = new Date().toISOString();

      // Parent thread document
      await setDoc(chatRef, {
        employeeId: user.id,
        fullName: user.fullName || "Applicant",
        passportNumber: user.passportNumber || "",
        subject: newSubject.trim(),
        status: "open",
        createdAt: now,
        lastMessageAt: now,
        lastMessageText: newFirstMessage.trim(),
        lastMessageBy: "user",
        unreadByAdmin: 1,
        unreadByUser: 0
      });

      // First message subcollection
      await addDoc(collection(db, "pwa_chats", chatRef.id, "messages"), {
        sender: "user",
        senderName: user.fullName || "Applicant",
        text: newFirstMessage.trim(),
        timestamp: now,
        read: false
      });

      setNewSubject("");
      setNewFirstMessage("");
      setShowNewModal(false);

      // Open new chat directly
      setActiveThread({
        id: chatRef.id,
        employeeId: user.id,
        fullName: user.fullName || "Applicant",
        passportNumber: user.passportNumber || "",
        subject: newSubject.trim(),
        status: "open",
        createdAt: now,
        lastMessageAt: now,
        lastMessageText: newFirstMessage.trim(),
        lastMessageBy: "user",
        unreadByUser: 0
      });
    } catch (err: any) {
      console.error("Error creating inquiry chat:", err);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Send reply message in existing thread
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread || !user?.id) return;

    setSending(true);
    const textToSend = replyText.trim();
    setReplyText("");

    try {
      const now = new Date().toISOString();

      // 1. Add to messages subcollection
      await addDoc(collection(db, "pwa_chats", activeThread.id, "messages"), {
        sender: "user",
        senderName: user.fullName || "Applicant",
        text: textToSend,
        timestamp: now,
        read: false
      });

      // 2. Update parent chat doc
      await updateDoc(doc(db, "pwa_chats", activeThread.id), {
        lastMessageAt: now,
        lastMessageText: textToSend,
        lastMessageBy: "user",
        status: "open",
        unreadByAdmin: increment(1)
      });
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  // Format timestamp helper
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateLabel = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return formatTime(isoString);
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)", background: "#f8fafc" }}>
      
      {/* ────────────────── ACTIVE CHAT DETAIL VIEW ────────────────── */}
      {activeThread ? (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 70px)", background: "#f1f5f9" }}>
          
          {/* WhatsApp Header */}
          <div style={{
            padding: "0.85rem 1rem",
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            position: "sticky",
            top: 0,
            zIndex: 10
          }}>
            <button
              onClick={() => setActiveThread(null)}
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              <ArrowLeft size={22} />
            </button>

            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "1rem"
            }}>
              OG
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {activeThread.subject}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Agency Staff Support</span>
                <span style={{
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background: activeThread.status === "open" ? "#fef3c7" : activeThread.status === "replied" ? "#dcfce7" : "#e2e8f0",
                  color: activeThread.status === "open" ? "#b45309" : activeThread.status === "replied" ? "#15803d" : "#475569"
                }}>
                  {activeThread.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleUserDeleteChat(activeThread.id)}
              title="Delete Thread"
              style={{
                border: "none",
                background: "#fef2f2",
                color: "#ef4444",
                borderRadius: "8px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>


          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            background: "#f8fafc"
          }}>
            {/* System Info Banner */}
            <div style={{
              alignSelf: "center",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "0.6rem 1rem",
              fontSize: "0.75rem",
              color: "#64748b",
              textAlign: "center",
              maxWidth: "85%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}>
              🔒 Direct inquiry thread regarding <b>"{activeThread.subject}"</b>. Agency support team replies directly here.
            </div>

            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{
                    padding: "0.75rem 1rem",
                    borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                    background: isUser
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "#ffffff",
                    color: isUser ? "#ffffff" : "#0f172a",
                    border: isUser ? "none" : "1px solid #e2e8f0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    wordBreak: "break-word"
                  }}>
                    {!isUser && (
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#2563eb", marginBottom: "3px" }}>
                        O.G. Agency Support
                      </div>
                    )}
                    {msg.text}
                  </div>
                  
                  <div style={{
                    fontSize: "0.65rem",
                    color: "#94a3b8",
                    marginTop: "3px",
                    padding: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px"
                  }}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {isUser && <CheckCheck size={13} style={{ color: "#3b82f6" }} />}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "0.75rem 1rem",
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem"
            }}
          >
            <input
              type="text"
              placeholder={activeThread.status === "closed" ? "This inquiry is closed" : "Type a message..."}
              disabled={activeThread.status === "closed" || sending}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "24px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "0.9rem",
                background: activeThread.status === "closed" ? "#f1f5f9" : "#ffffff"
              }}
            />

            <button
              type="submit"
              disabled={!replyText.trim() || activeThread.status === "closed" || sending}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: replyText.trim() ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" : "#cbd5e1",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: replyText.trim() ? "pointer" : "not-allowed",
                boxShadow: replyText.trim() ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "none",
                transition: "all 0.2s"
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        /* ────────────────── THREADS LIST VIEW ────────────────── */
        <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Header Card */}
          <div style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            borderRadius: "20px",
            padding: "1.5rem",
            color: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.3)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <MessageSquare size={24} style={{ color: "#a5b4fc" }} />
                  <span>Support Chat</span>
                </h2>
                <p style={{ fontSize: "0.82rem", color: "#c7d2fe", margin: "6px 0 0" }}>
                  Direct real-time inquiry messaging with O.G. Agency staff.
                </p>
              </div>

              <button
                onClick={() => setShowNewModal(true)}
                style={{
                  padding: "0.65rem 1rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "#ffffff",
                  color: "#312e81",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 14px rgba(255, 255, 255, 0.2)"
                }}
              >
                <Plus size={18} />
                <span>New Inquiry</span>
              </button>
            </div>
          </div>

          {/* Conversations Section */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Your Inquiries ({threads.length})
              </h3>
            </div>

            {threads.length === 0 ? (
              <div style={{
                background: "#ffffff",
                borderRadius: "18px",
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem"
                }}>
                  <Sparkles size={28} />
                </div>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
                  No active inquiries
                </h4>
                <p style={{ fontSize: "0.83rem", color: "#64748b", margin: "0 0 1.25rem" }}>
                  Have questions about your application or documents? Start a new chat thread with agency staff.
                </p>
                <button
                  onClick={() => setShowNewModal(true)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)"
                  }}
                >
                  <Plus size={18} />
                  <span>Start New Inquiry</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {threads.map((t) => {
                  const hasUnread = (t.unreadByUser || 0) > 0;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setActiveThread(t)}
                      style={{
                        background: hasUnread ? "#f0fdf4" : "#ffffff",
                        borderRadius: "16px",
                        padding: "1rem 1.1rem",
                        border: hasUnread ? "1.5px solid #86efac" : "1px solid #e2e8f0",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.03)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        transition: "all 0.2s"
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: hasUnread ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        flexShrink: 0
                      }}>
                        OG
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: "0.93rem",
                            fontWeight: hasUnread ? 800 : 700,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {t.subject}
                          </h4>
                          <span style={{ fontSize: "0.7rem", color: hasUnread ? "#16a34a" : "#94a3b8", fontWeight: 600 }}>
                            {formatDateLabel(t.lastMessageAt || t.createdAt)}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                          <p style={{
                            fontSize: "0.82rem",
                            color: hasUnread ? "#14532d" : "#64748b",
                            fontWeight: hasUnread ? 600 : 400,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {t.lastMessageBy === "user" ? "You: " : "Admin: "}
                            {t.lastMessageText || "No messages yet"}
                          </p>

                          {hasUnread && (
                            <span style={{
                              background: "#22c55e",
                              color: "#ffffff",
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              minWidth: "20px",
                              height: "20px",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0 6px"
                            }}>
                              {t.unreadByUser}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserDeleteChat(t.id);
                        }}
                        title="Delete Inquiry"
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#94a3b8",
                          padding: "6px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

            )}
          </div>
        </div>
      )}

      {/* ────────────────── NEW INQUIRY MODAL ────────────────── */}
      {showNewModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "1.5rem",
            width: "100%",
            maxWidth: "440px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <MessageSquare size={20} style={{ color: "#2563eb" }} />
                <span>Start New Inquiry</span>
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Inquiry Topic / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Passport Submission Query"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your question details here..."
                  value={newFirstMessage}
                  onChange={(e) => setNewFirstMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#475569",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 1.5,
                    padding: "0.8rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: creating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                  }}
                >
                  <Send size={16} />
                  <span>{creating ? "Sending..." : "Submit Inquiry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
