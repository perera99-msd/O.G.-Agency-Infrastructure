import React, { useEffect, useRef } from 'react';
import type { ContactMessage } from '../types';
import {
  CheckCheck,
  X,
  Trash2,
  Archive,
  Check,
  Mail,
  ArrowRight,
  Bell,
  MapPin,
  FileText,
} from 'lucide-react';

interface NotificationsDropdownProps {
  responses: ContactMessage[];
  onUpdateStatus: (id: string, status: ContactMessage['status']) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onViewAll: () => void;
  onClose: () => void;
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
  responses,
  onUpdateStatus,
  onMarkAllAsRead,
  onDelete,
  onViewAll,
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

  const unreadList = responses.filter((r) => r.status === 'new');
  const recentList = [...responses].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  ).slice(0, 8);

  return (
    <div
      ref={containerRef}
      className="animate-in"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: -8,
        width: 380,
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
          {unreadList.length > 0 && (
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
              {unreadList.length} unread
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {unreadList.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onMarkAllAsRead}
              title="Mark all as read"
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
          maxHeight: 360,
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
            const isUnread = item.status === 'new';
            return (
              <div
                key={item.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: isUnread ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  transition: 'background 0.15s ease',
                  position: 'relative',
                }}
              >
                {/* Avatar / Indicator */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: isUnread ? 'var(--accent-light)' : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14,
                      color: isUnread ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {(item.senderName || 'U').charAt(0).toUpperCase()}
                  </div>
                  {isUnread && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 0 2px var(--card-bg)',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: isUnread ? 800 : 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                      className="truncate"
                    >
                      {item.senderName}
                    </p>
                    <span style={{ fontSize: 10.5, color: 'var(--text-faint)', flexShrink: 0 }}>
                      {formatRelativeTime(item.submittedAt)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={10} /> {item.destinationOfInterest}
                    </span>
                    {item.cvFileName && (
                      <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 4px', borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <FileText size={10} /> CV
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      margin: '4px 0 0 0',
                      lineHeight: 1.3,
                    }}
                    className="truncate"
                  >
                    {item.message}
                  </p>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                  <button
                    type="button"
                    title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                    onClick={() => onUpdateStatus(item.id, isUnread ? 'replied' : 'new')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      color: isUnread ? '#22c55e' : 'var(--text-faint)',
                      borderRadius: 4,
                    }}
                  >
                    {isUnread ? <Check size={14} /> : <Mail size={14} />}
                  </button>

                  <button
                    type="button"
                    title="Archive"
                    onClick={() => onUpdateStatus(item.id, 'archived')}
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
                    onClick={() => onDelete(item.id)}
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
              </div>
            );
          })
        )}
      </div>

      {/* ── Dropdown Footer ── */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-raised)',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => {
            onViewAll();
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
          View All Notifications <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
