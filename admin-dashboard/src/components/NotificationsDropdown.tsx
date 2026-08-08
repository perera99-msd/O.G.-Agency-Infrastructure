import React, { useEffect, useRef } from 'react';
import type { ContactMessage, TabType, PWAChatThread } from '../types';
import {
  CheckCheck,
  X,
  Trash2,
  Archive,
  Check,
  Mail,
  ArrowRight,
  Bell,
  MessageSquare,
  Globe
} from 'lucide-react';


interface NotificationsDropdownProps {
  responses: ContactMessage[];
  pwaChats?: PWAChatThread[];
  onUpdateStatus: (id: string, status: ContactMessage['status']) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onNavigate?: (tab: TabType) => void;
  onClose: () => void;
}

interface UnifiedNotification {
  id: string;
  type: 'contact' | 'pwa-inquiry';
  title: string;
  subtitle: string;
  message: string;
  timestamp: string;
  isUnread: boolean;
  rawContact?: ContactMessage;
  rawPwaChat?: PWAChatThread;
}

const formatRelativeTime = (isoString?: string): string => {
  if (!isoString) return 'Just now';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString();
  } catch {
    return 'Recently';
  }
};

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  responses = [],
  pwaChats = [],
  onUpdateStatus,
  onMarkAllAsRead,
  onDelete,
  onNavigate,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Build unified notification list from contact form responses + PWA chat threads
  const unifiedNotifications: UnifiedNotification[] = [
    ...responses.map((r): UnifiedNotification => ({
      id: `contact-${r.id}`,
      type: 'contact',
      title: r.senderName || 'Anonymous User',
      subtitle: r.destinationOfInterest ? `Interest: ${r.destinationOfInterest}` : 'Website Inquiry',
      message: r.message,
      timestamp: r.submittedAt,
      isUnread: r.status === 'new',
      rawContact: r,
    })),
    ...pwaChats.map((c): UnifiedNotification => ({
      id: `pwa-${c.id}`,
      type: 'pwa-inquiry',
      title: c.fullName || 'PWA Applicant',
      subtitle: `Passport: ${c.passportNumber} • ${c.subject}`,
      message: c.lastMessageText ? `${c.lastMessageBy === 'admin' ? 'You: ' : ''}${c.lastMessageText}` : 'No messages yet',
      timestamp: c.lastMessageAt || c.createdAt,
      isUnread: (c.unreadByAdmin || 0) > 0,
      rawPwaChat: c,
    })),
  ];

  // Sort by timestamp descending & slice most recent
  unifiedNotifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const unreadCount = unifiedNotifications.filter((n) => n.isUnread).length;
  const recentList = unifiedNotifications.slice(0, 10);

  const handleItemClick = (item: UnifiedNotification) => {
    onClose();
    if (item.type === 'pwa-inquiry') {
      onNavigate?.('pwa-inquiries');
    } else {
      onNavigate?.('responses');
    }
  };

  return (
    <div
      ref={containerRef}
      className="animate-in"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: -8,
        width: 390,
        maxWidth: '92vw',
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 16,
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22), 0 0 0 1px var(--border-strong)',
        zIndex: 99999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Dropdown Header ── */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-raised)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} style={{ color: 'var(--accent)' }} />
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Notifications</h4>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '2px 7px',
                borderRadius: 10,
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {responses.some(r => r.status === 'new') && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onMarkAllAsRead}
              title="Mark contact forms as read"
              style={{ padding: '4px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <CheckCheck size={13} /> Read all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
              borderRadius: 6,
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Notification List ── */}
      <div
        style={{
          maxHeight: 380,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {recentList.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p style={{ fontSize: 13, fontWeight: 600 }}>No notifications yet</p>
          </div>
        ) : (
          recentList.map((item) => {
            const isPwa = item.type === 'pwa-inquiry';
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: item.isUnread ? (isPwa ? 'rgba(99, 102, 241, 0.06)' : 'rgba(59, 130, 246, 0.05)') : 'transparent',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  transition: 'background 0.15s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Avatar / Type Indicator */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: isPwa
                        ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#ffffff',
                    }}
                  >
                    {item.title.charAt(0).toUpperCase()}
                  </div>
                  {item.isUnread && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 0 2px var(--surface)',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: item.isUnread ? 800 : 600,
                          color: 'var(--text-primary)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </p>
                      {/* Type Badge */}
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 4,
                          flexShrink: 0,
                          background: isPwa ? 'rgba(99, 102, 241, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                          color: isPwa ? 'var(--accent)' : '#2563eb',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        {isPwa ? <MessageSquare size={9} /> : <Globe size={9} />}
                        {isPwa ? 'PWA Chat' : 'Web Form'}
                      </span>
                    </div>

                    <span style={{ fontSize: 10.5, color: 'var(--text-faint)', flexShrink: 0 }}>
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: isPwa ? 'var(--accent)' : 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
                    {item.subtitle}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: item.isUnread ? 'var(--text-secondary)' : 'var(--text-muted)',
                      margin: '3px 0 0 0',
                      lineHeight: 1.3,
                      fontWeight: item.isUnread ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.message}
                  </p>
                </div>

                {/* Quick Actions for Contact Forms */}
                {item.rawContact && (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      title={item.isUnread ? 'Mark as Read' : 'Mark as Unread'}
                      onClick={() => onUpdateStatus(item.rawContact!.id, item.isUnread ? 'replied' : 'new')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: item.isUnread ? '#22c55e' : 'var(--text-faint)',
                        borderRadius: 4,
                      }}
                    >
                      {item.isUnread ? <Check size={14} /> : <Mail size={14} />}
                    </button>

                    <button
                      type="button"
                      title="Archive"
                      onClick={() => onUpdateStatus(item.rawContact!.id, 'archived')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: 'var(--text-faint)',
                        borderRadius: 4,
                      }}
                    >
                      <Archive size={13} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDelete(item.rawContact!.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: 'var(--text-faint)',
                        borderRadius: 4,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Dropdown Footer ── */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          onClick={() => {
            onNavigate?.('notifications');
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Web Inquiries <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={() => {
            onNavigate?.('pwa-inquiries');
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            fontWeight: 700,
            color: 'var(--accent)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          PWA Inquiries <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
