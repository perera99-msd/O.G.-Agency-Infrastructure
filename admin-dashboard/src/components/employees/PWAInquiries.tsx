import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import { db } from '../../firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  orderBy,
  increment
} from 'firebase/firestore';
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  CheckCheck,
  X,
  Trash2
} from 'lucide-react';

import type { PWAChatThread } from '../../types';

interface PWAChatMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

export const PWAInquiries: React.FC = () => {
  const [threads, setThreads] = useState<PWAChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<PWAChatThread | null>(null);
  const [messages, setMessages] = useState<PWAChatMessage[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'replied' | 'closed'>('all');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Listen for all PWA chat threads
  useEffect(() => {
    const q = query(collection(db, 'pwa_chats'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<PWAChatThread, 'id'>)
      }));

      list.sort((a, b) => new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime());
      setThreads(list);

      if (activeThread) {
        const updated = list.find((t) => t.id === activeThread.id);
        if (updated) setActiveThread(updated);
      }
    }, (err) => {
      console.error('Error listening to pwa_chats:', err);
    });

    return () => unsub();
  }, [activeThread?.id]);

  // 2. Listen for messages in active thread
  useEffect(() => {
    if (!activeThread?.id) {
      setMessages([]);
      return;
    }

    // Reset unreadByAdmin when opened
    if (activeThread.unreadByAdmin && activeThread.unreadByAdmin > 0) {
      updateDoc(doc(db, 'pwa_chats', activeThread.id), {
        unreadByAdmin: 0
      }).catch(err => console.error('Reset unreadByAdmin error:', err));
    }

    const messagesQuery = query(
      collection(db, 'pwa_chats', activeThread.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<PWAChatMessage, 'id'>)
      }));
      setMessages(msgs);
    }, (err) => {
      console.error('Error listening to messages:', err);
    });

    return () => unsub();
  }, [activeThread?.id]);

  // Send admin reply
  const handleSendReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    setSending(true);
    const textToSend = replyText.trim();
    setReplyText('');

    try {
      const now = new Date().toISOString();

      // Add to messages subcollection
      await addDoc(collection(db, 'pwa_chats', activeThread.id, 'messages'), {
        sender: 'admin',
        senderName: 'Agency Staff',
        text: textToSend,
        timestamp: now,
        read: false
      });

      // Update parent doc (reset deletedByUser to false so it re-appears on mobile if hidden)
      await updateDoc(doc(db, 'pwa_chats', activeThread.id), {
        lastMessageAt: now,
        lastMessageText: textToSend,
        lastMessageBy: 'admin',
        status: 'replied',
        deletedByUser: false,
        unreadByUser: increment(1)
      });
    } catch (err) {
      console.error('Error sending admin reply:', err);
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  // Permanently delete thread from both Admin and Mobile
  const handleAdminDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to permanently delete this chat thread? It will be removed for both Admin and Applicant.')) return;
    try {
      await deleteDoc(doc(db, 'pwa_chats', chatId));
      if (activeThread?.id === chatId) {
        setActiveThread(null);
      }
    } catch (err) {
      console.error('Error deleting chat thread:', err);
      alert('Failed to delete chat thread.');
    }
  };


  // Change status (open/replied/closed)
  const handleStatusChange = async (newStatus: 'open' | 'replied' | 'closed') => {
    if (!activeThread) return;
    try {
      await updateDoc(doc(db, 'pwa_chats', activeThread.id), {
        status: newStatus
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Filtered threads
  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      t.passportNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalUnreadCount = threads.reduce((acc, t) => acc + (t.unreadByAdmin || 0), 0);
  const openCount = threads.filter(t => t.status === 'open').length;
  const repliedCount = threads.filter(t => t.status === 'replied').length;

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return formatTime(isoString);
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="emp-page">
      
      {/* Admin Page Header (Matching Admin Theme) */}
      <div className="emp-page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="emp-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={24} style={{ color: 'var(--accent, #6366f1)' }} />
            <span>PWA Customer Inquiries</span>
          </h2>
          <p className="emp-page-sub">
            Real-time inquiry messaging with applicants logged into the Mobile PWA app
          </p>
        </div>
      </div>

      {/* Admin Stats Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid var(--accent, #6366f1)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Conversations</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{threads.length}</h3>
        </div>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid var(--red, #ef4444)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Unread Messages</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: 'var(--red, #ef4444)' }}>{totalUnreadCount}</h3>
        </div>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid var(--amber, #f59e0b)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Open</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: 'var(--amber, #f59e0b)' }}>{openCount}</h3>
        </div>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid var(--green, #10b981)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Replied Threads</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: 'var(--green, #10b981)' }}>{repliedCount}</h3>
        </div>
      </div>

      {/* Two Panel Workspace */}
      <div style={{ display: 'flex', gap: '1.25rem', height: 'calc(100vh - 320px)', minHeight: '500px' }}>
        
        {/* LEFT PANEL: Threads List */}
        <div style={{
          width: '380px',
          background: 'var(--surface, #ffffff)',
          borderRadius: 'var(--radius, 14px)',
          border: '1px solid var(--border, rgba(15, 23, 42, 0.07))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--glass-shadow)'
        }}>
          {/* Search & Filter Top Bar */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--surface-raised, #fafbfc)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search name, passport, topic..."
                className="emp-form-control"
                style={{ paddingLeft: '36px', width: '100%', fontSize: '0.85rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg, #f3f5f9)', padding: '4px', borderRadius: 'var(--radius-sm, 10px)' }}>
              {(['all', 'open', 'replied', 'closed'] as const).map((st) => {
                const isActive = filterStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isActive ? 'var(--accent, #6366f1)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      boxShadow: isActive ? '0 2px 6px rgba(99, 102, 241, 0.25)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Threads List Container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredThreads.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No inquiry threads found matching filters.
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isActive = activeThread?.id === t.id;
                const hasUnread = (t.unreadByAdmin || 0) > 0;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveThread(t)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm, 10px)',
                      background: isActive
                        ? 'var(--accent-light, rgba(99, 102, 241, 0.08))'
                        : hasUnread
                        ? 'var(--red-bg, rgba(239, 68, 68, 0.08))'
                        : 'var(--surface, #ffffff)',
                      border: isActive
                        ? '1.5px solid var(--accent, #6366f1)'
                        : hasUnread
                        ? '1px solid var(--red-border, rgba(239, 68, 68, 0.22))'
                        : '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.15s'
                    }}
                  >
                    {/* User Avatar */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: hasUnread
                        ? 'linear-gradient(135deg, var(--red) 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}>
                      {t.fullName ? t.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    {/* Thread Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: hasUnread ? 800 : 700,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {t.fullName}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: hasUnread ? 'var(--red)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {formatDateLabel(t.lastMessageAt || t.createdAt)}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.subject}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{
                          margin: 0,
                          fontSize: '0.78rem',
                          color: hasUnread ? 'var(--red)' : 'var(--text-muted)',
                          fontWeight: hasUnread ? 600 : 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '190px'
                        }}>
                          {t.lastMessageBy === 'admin' ? 'You: ' : ''}
                          {t.lastMessageText || 'No message'}
                        </p>

                        {hasUnread && (
                          <span style={{
                            background: 'var(--red, #ef4444)',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            minWidth: '18px',
                            height: '18px',
                            borderRadius: '9px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 5px'
                          }}>
                            {t.unreadByAdmin}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      title="Delete Thread"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdminDeleteChat(t.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-faint)',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* RIGHT PANEL: Active Chat Screen */}
        <div style={{
          flex: 1,
          background: 'var(--surface, #ffffff)',
          borderRadius: 'var(--radius, 14px)',
          border: '1px solid var(--border, rgba(15, 23, 42, 0.07))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--glass-shadow)'
        }}>
          {activeThread ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Chat Top Bar Header */}
              <div style={{
                padding: '0.9rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface-raised, #fafbfc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    {activeThread.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {activeThread.fullName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{
                        background: 'var(--accent-light)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ShieldCheck size={12} />
                        Passport: {activeThread.passportNumber}
                      </span>

                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Topic: <b style={{ color: 'var(--text-primary)' }}>{activeThread.subject}</b>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Dropdown Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</label>
                  <select
                    value={activeThread.status}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-sm, 10px)',
                      border: '1px solid var(--border-strong)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      outline: 'none',
                      background: activeThread.status === 'open' ? 'var(--amber-bg)' : activeThread.status === 'replied' ? 'var(--green-bg)' : 'var(--surface-raised)',
                      color: activeThread.status === 'open' ? 'var(--amber)' : activeThread.status === 'replied' ? 'var(--green)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    type="button"
                    title="Permanently Delete Thread"
                    onClick={() => handleAdminDeleteChat(activeThread.id)}
                    style={{
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-sm, 10px)',
                      border: '1px solid var(--red-border, rgba(239, 68, 68, 0.22))',
                      background: 'var(--red-bg, rgba(239, 68, 68, 0.08))',
                      color: 'var(--red, #ef4444)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>


              {/* Messages Body */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                background: 'var(--bg, #f3f5f9)'
              }}>
                <div style={{
                  alignSelf: 'center',
                  background: 'var(--surface, #ffffff)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm, 10px)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  boxShadow: 'var(--glass-shadow)'
                }}>
                  Conversation started on {new Date(activeThread.createdAt).toLocaleString()}
                </div>

                {messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAdmin ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        padding: '0.75rem 1.1rem',
                        borderRadius: isAdmin ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isAdmin
                          ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)'
                          : 'var(--surface, #ffffff)',
                        color: isAdmin ? '#ffffff' : 'var(--text-primary)',
                        border: isAdmin ? 'none' : '1px solid var(--border)',
                        boxShadow: isAdmin ? '0 3px 10px rgba(99, 102, 241, 0.25)' : 'var(--glass-shadow)',
                        fontSize: '0.9rem',
                        lineHeight: '1.45',
                        wordBreak: 'break-word'
                      }}>
                        {!isAdmin && (
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '3px' }}>
                            {activeThread.fullName} ({activeThread.passportNumber})
                          </div>
                        )}
                        {msg.text}
                      </div>

                      <div style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginTop: '3px',
                        padding: '0 4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {isAdmin && <CheckCheck size={14} style={{ color: 'var(--accent)' }} />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Admin Reply Input Bar */}
              <form
                onSubmit={handleSendReply}
                style={{
                  padding: '1rem 1.25rem',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--surface, #ffffff)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <input
                  type="text"
                  placeholder="Type an official reply to candidate..."
                  disabled={sending}
                  className="emp-form-control"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.1rem',
                    borderRadius: '24px',
                    fontSize: '0.9rem'
                  }}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '24px',
                    background: replyText.trim() ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)' : 'var(--border)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: replyText.trim() ? '0 4px 14px rgba(99, 102, 241, 0.3)' : 'none',
                    transition: 'all 0.2s',
                    border: 'none'
                  }}
                >
                  <Send size={16} />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: '1rem',
              padding: '2rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--surface-raised, #fafbfc)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <MessageSquare size={32} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  Select an inquiry conversation
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Click any candidate thread on the left list to view chat history and reply.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
