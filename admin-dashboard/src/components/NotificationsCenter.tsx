import React, { useState } from 'react';
import type { ContactMessage } from '../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  Archive,
  Search,
  X,
  Trash2,
  CheckCheck,
  MapPin,
  FileText,
  CreditCard,
  Mail,
  Calendar,
  Check,
} from 'lucide-react';

interface NotificationsCenterProps {
  responses: ContactMessage[];
  onUpdateStatus: (id: string, status: ContactMessage['status']) => Promise<void> | void;
  onMarkAllAsRead: () => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  role?: 'super_user' | 'normal_user';
}

type DateFilter = 'all' | 'today' | 'week' | 'month';
type StatusFilter = 'all' | 'unread' | 'read' | 'archived';

const isToday = (dateString?: string): boolean => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const isThisWeek = (dateString?: string): boolean => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

const isThisMonth = (dateString?: string): boolean => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  responses,
  onUpdateStatus,
  onMarkAllAsRead,
  onDelete,
  role = 'super_user',
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering Logic
  const filtered = responses.filter((r) => {
    // Status Filter
    let matchesStatus = true;
    if (statusFilter === 'unread') matchesStatus = r.status === 'new';
    else if (statusFilter === 'read') matchesStatus = r.status === 'replied';
    else if (statusFilter === 'archived') matchesStatus = r.status === 'archived';

    // Date Filter
    let matchesDate = true;
    if (dateFilter === 'today') matchesDate = isToday(r.submittedAt);
    else if (dateFilter === 'week') matchesDate = isThisWeek(r.submittedAt);
    else if (dateFilter === 'month') matchesDate = isThisMonth(r.submittedAt);

    // Search Filter
    const matchesSearch =
      !searchQuery ||
      r.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.idNumber && r.idNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.destinationOfInterest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  });

  // Bulk Selection Controls
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkMarkRead = async () => {
    for (const id of selectedIds) {
      await onUpdateStatus(id, 'replied');
    }
    setSelectedIds([]);
  };

  const handleBulkArchive = async () => {
    for (const id of selectedIds) {
      await onUpdateStatus(id, 'archived');
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await onDelete(id);
    }
    setSelectedIds([]);
  };

  const unreadCount = responses.filter((r) => r.status === 'new').length;

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="page-title">Notification Center</h2>
          <p className="page-subtitle">Real-time alerts, candidate inquiries, and system notifications</p>
        </div>
        <div className="page-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={onMarkAllAsRead} style={{ gap: 6 }}>
              <CheckCheck size={16} /> Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} style={{ color: 'var(--blue)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Total Alerts</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{responses.length}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Unread</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#ef4444', lineHeight: 1.1 }}>{unreadCount}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Read / Processed</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#22c55e', lineHeight: 1.1 }}>
              {responses.filter((r) => r.status === 'replied').length}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Archive size={20} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Archived</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-muted)', lineHeight: 1.1 }}>
              {responses.filter((r) => r.status === 'archived').length}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Controls Bar ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status Tabs */}
          <div className="filter-tabs">
            {(['all', 'unread', 'read', 'archived'] as const).map((s) => (
              <button
                key={s}
                className={`filter-tab${statusFilter === s ? ' active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all'
                  ? 'All'
                  : s === 'unread'
                  ? 'Unread'
                  : s === 'read'
                  ? 'Read'
                  : 'Archived'}{' '}
                <span style={{ opacity: 0.65, fontSize: 11 }}>
                  (
                  {s === 'all'
                    ? responses.length
                    : s === 'unread'
                    ? unreadCount
                    : s === 'read'
                    ? responses.filter((r) => r.status === 'replied').length
                    : responses.filter((r) => r.status === 'archived').length}
                  )
                </span>
              </button>
            ))}
          </div>

          {/* Date Filter Tabs */}
          <div className="filter-tabs">
            {(['all', 'today', 'week', 'month'] as const).map((d) => (
              <button
                key={d}
                className={`filter-tab${dateFilter === d ? ' active' : ''}`}
                onClick={() => setDateFilter(d)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <Calendar size={12} />
                {d === 'all'
                  ? 'All Time'
                  : d === 'today'
                  ? 'Today'
                  : d === 'week'
                  ? 'This Week'
                  : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: 240, maxWidth: 360, flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notification text, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 34px 9px 36px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              fontSize: 13,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Bulk Actions Toolbar ── */}
      {selectedIds.length > 0 && (
        <div
          className="animate-in"
          style={{
            padding: '12px 18px',
            background: 'var(--accent-light)',
            border: '1px solid var(--accent)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
              {selectedIds.length} notification{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-secondary" onClick={handleBulkMarkRead} style={{ fontSize: 12, padding: '6px 12px' }}>
              <CheckCheck size={14} /> Mark as Read
            </button>
            <button className="btn btn-secondary" onClick={handleBulkArchive} style={{ fontSize: 12, padding: '6px 12px' }}>
              <Archive size={14} /> Archive Selected
            </button>
            {role === 'super_user' && (
              <button className="btn btn-danger" onClick={handleBulkDelete} style={{ fontSize: 12, padding: '6px 12px' }}>
                <Trash2 size={14} /> Delete Selected
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => setSelectedIds([])} style={{ fontSize: 12, padding: '6px 10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Notifications Table / List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-state-icon"><Bell size={24} strokeWidth={1.5} /></div>
              <p className="empty-state-title">No notifications match criteria</p>
              <p className="empty-state-desc">{searchQuery ? 'Try adjusting your search query.' : 'There are no notifications in this view.'}</p>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header Controls */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                  onChange={toggleSelectAll}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                Select All ({filtered.length})
              </label>

              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                Showing {filtered.length} alert{filtered.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* List Rows */}
            {filtered.map((r) => {
              const isUnread = r.status === 'new';
              const isSelected = selectedIds.includes(r.id);

              return (
                <div
                  key={r.id}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    background: isSelected
                      ? 'rgba(59, 130, 246, 0.08)'
                      : isUnread
                      ? 'rgba(59, 130, 246, 0.03)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    transition: 'background 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectId(r.id)}
                    style={{ accentColor: 'var(--accent)', marginTop: 4, cursor: 'pointer' }}
                  />

                  {/* Avatar */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: isUnread ? 'var(--accent-light)' : 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 16,
                      color: isUnread ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {(r.senderName || 'U').charAt(0).toUpperCase()}
                  </div>

                  {/* Info Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: isUnread ? 800 : 600, color: 'var(--text-primary)', margin: 0 }}>
                          {r.senderName}
                        </p>
                        {isUnread && (
                          <span className="tag tag-red" style={{ fontSize: 9.5, padding: '1px 6px' }}>Unread</span>
                        )}
                      </div>

                      <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11} /> {r.destinationOfInterest}
                      </span>
                      {r.idNumber && (
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'monospace' }}>
                          <CreditCard size={11} /> {r.idType}: {r.idNumber}
                        </span>
                      )}
                      {r.cvFileName && (
                        <span style={{ fontSize: 11, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FileText size={11} /> CV Attached
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                      {r.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onUpdateStatus(r.id, isUnread ? 'replied' : 'new')}
                      style={{ padding: '6px 10px', fontSize: 12 }}
                      title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                    >
                      {isUnread ? <Check size={13} /> : <Mail size={13} />}
                      {isUnread ? 'Mark Read' : 'Mark Unread'}
                    </button>

                    {r.status !== 'archived' && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => onUpdateStatus(r.id, 'archived')}
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        title="Archive"
                      >
                        <Archive size={13} />
                      </button>
                    )}

                    {role === 'super_user' && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onDelete(r.id)}
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
