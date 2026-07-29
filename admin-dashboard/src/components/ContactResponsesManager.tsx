import React, { useState } from 'react';
import type { ContactMessage } from '../types';
import {
  Trash2,
  MessageSquare,
  CheckCircle2,
  Archive,
  Mail,
  Phone,
  Globe2,
  FileText,
  Download,
  Search,
  X,
  Clock,
  MapPin,
  CreditCard,
  Star,
  ExternalLink,
  Eye,
  MessageCircle,
} from 'lucide-react';

interface ContactResponsesManagerProps {
  responses: ContactMessage[];
  onUpdateStatus: (id: string, status: ContactMessage['status']) => Promise<void> | void;
  onToggleBookmark?: (id: string, currentBookmarked?: boolean) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onAddReplySim: (msg: Omit<ContactMessage, 'id'>) => Promise<void> | void;
  role?: 'super_user' | 'normal_user';
}

const statusColor = (s: string) =>
  s === 'new' ? 'tag-red' : s === 'replied' ? 'tag-green' : 'tag-neutral';

const statusLabel = (s: string) =>
  s === 'new' ? 'New' : s === 'replied' ? 'Contacted' : 'Archived';

export const ContactResponsesManager: React.FC<ContactResponsesManagerProps> = ({
  responses,
  onUpdateStatus,
  onToggleBookmark,
  onDelete,
  onAddReplySim,
  role = 'super_user',
}) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'bookmarked' | 'archived'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfPreviewTitle, setPdfPreviewTitle] = useState<string>('CV Preview');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bookmarkedCount = responses.filter((r) => r.isBookmarked).length;

  const filtered = responses.filter((r) => {
    let matchesFilter = true;
    if (filter === 'new') matchesFilter = r.status === 'new';
    else if (filter === 'replied') matchesFilter = r.status === 'replied';
    else if (filter === 'archived') matchesFilter = r.status === 'archived';
    else if (filter === 'bookmarked') matchesFilter = !!r.isBookmarked;

    const matchesSearch =
      !searchQuery ||
      r.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.idNumber && r.idNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.destinationOfInterest.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const simulateInquiry = async () => {
    await onAddReplySim({
      senderName: 'Suresh Fernando',
      email: 'suresh.f@gmail.com',
      phone: '+94 77 888 9900',
      idType: 'NIC',
      idNumber: '987654321V',
      destinationOfInterest: 'Russia',
      message: 'I have 5 years experience as a heavy fleet mechanic. Can I schedule a verification test at your Colombo center?',
      submittedAt: new Date().toISOString(),
      status: 'new',
      isBookmarked: true,
      cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Suresh_Fernando_CV.pdf',
    });
  };

  const handleOpenPdf = (url: string, title: string) => {
    setPdfPreviewUrl(url);
    setPdfPreviewTitle(title);
  };

  const openPdfInNewTab = (url: string) => {
    if (url.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = url.split(',')[1];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        return;
      } catch (err) {
        console.error('Error opening Base64 PDF in new tab:', err);
      }
    }
    window.open(url, '_blank');
  };

  const handleDownloadPdf = (url: string, fileName?: string) => {
    const downloadName = fileName || 'Candidate_CV.pdf';
    if (url.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = url.split(',')[1];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return;
      } catch (err) {
        console.error('Error downloading Base64 PDF:', err);
      }
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="page-title">Candidate Inquiries & Tickets</h2>
          <p className="page-subtitle">Manage client inquiries, candidate CVs, and consultation requests</p>
        </div>
        <div className="page-actions">
          {role === 'super_user' && (
            <button className="btn btn-secondary" onClick={simulateInquiry}>
              + Add Sample Ticket
            </button>
          )}
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={20} style={{ color: 'var(--blue)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Total Tickets</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{responses.length}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>New Unread</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#ef4444', lineHeight: 1.1 }}>
              {responses.filter((r) => r.status === 'new').length}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Contacted</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#22c55e', lineHeight: 1.1 }}>
              {responses.filter((r) => r.status === 'replied').length}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--amber-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={20} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Bookmarked</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--amber)', lineHeight: 1.1 }}>{bookmarkedCount}</p>
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

      {/* ── Filters & Search Controls ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div className="filter-tabs">
          {(['all', 'new', 'replied', 'bookmarked', 'archived'] as const).map((f) => (
            <button
              key={f}
              className={`filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {f === 'bookmarked' && <Star size={12} style={{ color: 'var(--amber)', fill: filter === f ? 'var(--amber)' : 'none' }} />}
              {f === 'all'
                ? 'All'
                : f === 'bookmarked'
                ? 'Bookmarked'
                : statusLabel(f)}{' '}
              <span style={{ opacity: 0.65, fontSize: 11 }}>
                (
                {f === 'all'
                  ? responses.length
                  : f === 'bookmarked'
                  ? bookmarkedCount
                  : responses.filter((r) => r.status === f).length}
                )
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 240, maxWidth: 360, flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search candidate name, email, phone, ID..."
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

      {/* ── Main Split View ── */}
      <div className="content-split" style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(320px, 420px) 1fr' : '1fr', gap: 18 }}>
        {/* Left Column: Ticket List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-state-icon"><MessageSquare size={24} strokeWidth={1.5} /></div>
                <p className="empty-state-title">No tickets match criteria</p>
                <p className="empty-state-desc">{searchQuery ? 'Try adjusting your search query.' : 'There are no inquiries in this tab.'}</p>
              </div>
            </div>
          ) : (
            filtered.map((r) => {
              const isSel = selected?.id === r.id;
              return (
                <div
                  key={r.id}
                  className={`card card-clickable ${isSel ? 'active' : ''}`}
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    position: 'relative',
                    borderColor: isSel ? 'var(--accent)' : r.isBookmarked ? 'rgba(245, 158, 11, 0.4)' : undefined,
                    boxShadow: isSel ? '0 0 0 2px var(--accent-light)' : undefined,
                  }}
                  onClick={() => setSelected(r)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          flexShrink: 0,
                          background: 'var(--accent-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 15,
                          color: 'var(--accent)',
                        }}
                      >
                        {(r.senderName || 'U').charAt(0).toUpperCase()}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }} className="truncate">
                            {r.senderName}
                          </p>
                          <span className={`tag ${statusColor(r.status)}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                            {statusLabel(r.status)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={11} style={{ color: 'var(--accent)' }} /> {r.destinationOfInterest}
                          </span>

                          {r.idNumber && (
                            <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <CreditCard size={11} /> {r.idType}: {r.idNumber}
                            </span>
                          )}

                          {r.cvFileName && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#10b981',
                                background: 'rgba(16, 185, 129, 0.1)',
                                padding: '2px 6px',
                                borderRadius: 4,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <FileText size={11} /> CV Attached
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }} className="truncate">
                          {r.message}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ''}
                      </span>
                      {onToggleBookmark && (
                        <button
                          type="button"
                          title={r.isBookmarked ? 'Remove Bookmark' : 'Bookmark Inquiry'}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(r.id, r.isBookmarked);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            color: r.isBookmarked ? 'var(--amber)' : 'var(--text-faint)',
                          }}
                        >
                          <Star size={16} fill={r.isBookmarked ? 'var(--amber)' : 'none'} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Ticket Details */}
        {selected ? (
          <div className="card detail-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header / Main Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 20,
                    color: 'var(--accent)',
                  }}
                >
                  {(selected.senderName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{selected.senderName}</h3>
                    <span className={`tag ${statusColor(selected.status)}`}>{statusLabel(selected.status)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Submitted {selected.submittedAt ? new Date(selected.submittedAt).toLocaleString() : 'recently'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {onToggleBookmark && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => onToggleBookmark(selected.id, selected.isBookmarked)}
                    title={selected.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    style={{ padding: '8px 12px' }}
                  >
                    <Star size={15} fill={selected.isBookmarked ? 'var(--amber)' : 'none'} style={{ color: selected.isBookmarked ? 'var(--amber)' : 'inherit' }} />
                    {selected.isBookmarked ? 'Saved' : 'Bookmark'}
                  </button>
                )}
                <button
                  className="modal-close"
                  onClick={() => setSelected(null)}
                  style={{ fontSize: 20, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Inquiry to O.G. Agency&body=Dear ${selected.senderName},%0D%0A%0D%0AThank you for contacting O.G. Agency...`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', padding: '9px 16px', fontSize: 13 }}
                >
                  <Mail size={15} /> Email Candidate
                </a>
              )}

              {selected.phone && (
                <>
                  <a
                    href={`tel:${selected.phone}`}
                    className="btn btn-secondary"
                    style={{ textDecoration: 'none', padding: '9px 16px', fontSize: 13 }}
                  >
                    <Phone size={15} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(selected.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ textDecoration: 'none', padding: '9px 16px', fontSize: 13, color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </>
              )}
            </div>

            {/* Contact & Meta Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Email Address</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selected.email || 'Not Provided'}</p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Phone / Mobile</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.phone || 'Not Provided'}</p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Globe2 size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Target Destination</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{selected.destinationOfInterest || 'General'}</p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CreditCard size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Identity Identification</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {selected.idType || 'NIC'}: {selected.idNumber || 'N/A'}
                </p>
              </div>
            </div>

            {/* ── CV Document Section ── */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Candidate Curriculum Vitae (CV)</span>
                </div>
                {selected.cvFileName && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selected.cvFileName}</span>
                )}
              </div>

              {selected.cvUrl ? (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenPdf(selected.cvUrl!, `${selected.senderName}'s CV`)}
                    style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: 13 }}
                  >
                    <Eye size={15} /> View PDF Inline
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleDownloadPdf(selected.cvUrl!, selected.cvFileName || `${selected.senderName}_CV.pdf`)}
                    style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: 13 }}
                  >
                    <Download size={15} /> Download PDF
                  </button>
                </div>
              ) : selected.cvFileName ? (
                <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--amber)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} style={{ color: 'var(--amber)' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>File name: {selected.cvFileName}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>CV filename recorded, but download URL was not saved.</p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No CV attachment was uploaded with this inquiry.
                </div>
              )}
            </div>

            {/* Message Body */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>Inquiry Message</p>
              <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </p>
            </div>

            {/* Ticket Management Actions Toolbar */}
            {role === 'super_user' && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selected.status === 'new' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => onUpdateStatus(selected.id, 'replied')}
                      style={{ color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.4)', background: 'rgba(34, 197, 94, 0.08)' }}
                    >
                      <CheckCircle2 size={15} /> Mark as Contacted
                    </button>
                  )}

                  {selected.status !== 'archived' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => onUpdateStatus(selected.id, 'archived')}
                    >
                      <Archive size={15} /> Archive Ticket
                    </button>
                  )}

                  {selected.status === 'archived' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => onUpdateStatus(selected.id, 'new')}
                    >
                      <Clock size={15} /> Restore to New
                    </button>
                  )}
                </div>

                <button
                  className="btn btn-danger"
                  onClick={() => setDeleteConfirmId(selected.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Trash2 size={15} /> Delete Ticket
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ border: '2px dashed var(--border)', borderRadius: 16, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 350 }}>
            <MessageSquare size={36} strokeWidth={1.2} style={{ color: 'var(--text-faint)', marginBottom: 12 }} />
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No Ticket Selected</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 300 }}>
              Select an inquiry ticket from the left list to review details, preview attached CVs, or update processing status.
            </p>
          </div>
        )}
      </div>

      {/* ── Inline PDF Previewer Modal ── */}
      {pdfPreviewUrl && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1000 }}>
          <div className="modal" style={{ maxWidth: 850, width: '92vw', height: '85vh', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ padding: '16px 20px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} style={{ color: 'var(--accent)' }} />
                <h3 className="modal-title" style={{ fontSize: 16, fontWeight: 700 }}>{pdfPreviewTitle}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => openPdfInNewTab(pdfPreviewUrl)}
                  style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <ExternalLink size={13} /> Open in New Tab
                </button>
                <button
                  className="modal-close"
                  onClick={() => setPdfPreviewUrl(null)}
                  style={{ fontSize: 20, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ flex: 1, background: '#1e1e1e', position: 'relative' }}>
              <iframe
                src={pdfPreviewUrl}
                title="CV PDF Viewer"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal logout-confirmation">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Delete Inquiry Ticket?</h3>
                <p className="logout-confirmation-copy">
                  Are you sure you want to permanently delete this inquiry? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                  if (selected?.id === deleteConfirmId) {
                    setSelected(null);
                  }
                }}
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};