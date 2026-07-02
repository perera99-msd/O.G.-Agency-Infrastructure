import { useState } from 'react';
import type { ContactMessage } from '../types';
import {
  Trash2, MessageSquare, CheckCircle2, Archive, Mail, Phone, Send, Globe2,
} from 'lucide-react';

interface ContactResponsesManagerProps {
  responses: ContactMessage[];
  onUpdateStatus: (id: string, status: ContactMessage['status']) => void;
  onDelete: (id: string) => void;
  onAddReplySim: (msg: Omit<ContactMessage, 'id'>) => void;
}

const statusColor = (s: string) =>
  s === 'new' ? 'tag-red' : s === 'replied' ? 'tag-green' : 'tag-neutral';

export const ContactResponsesManager: React.FC<ContactResponsesManagerProps> = ({
  responses, onUpdateStatus, onDelete, onAddReplySim,
}) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState('');

  const filtered = responses.filter(r => filter === 'all' || r.status === filter);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply || !selected) return;
    onUpdateStatus(selected.id, 'replied');
    setReply('');
    setSelected(null);
  };

  const simulateInquiry = () => {
    onAddReplySim({
      senderName: 'Suresh Fernando',
      email: 'suresh.f@gmail.com',
      phone: '+94 77 888 9900',
      destinationOfInterest: 'Russia',
      message: 'I have 5 years experience as a heavy fleet mechanic. Can I schedule a verification test at your Colombo center?',
      submittedAt: 'Just now',
      status: 'new',
    });
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Contact Inquiries</h2>
          <p className="page-subtitle">Consultation requests submitted through the website contact portal.</p>
        </div>
        <div className="page-actions">
          <div className="filter-tabs">
            {(['all', 'new', 'replied', 'archived'] as const).map(f => (
              <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}{' '}
                <span style={{ opacity: 0.6 }}>
                  ({f === 'all' ? responses.length : responses.filter(r => r.status === f).length})
                </span>
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={simulateInquiry}>+ Simulate</button>
        </div>
      </div>

      <div className="content-split">
        {/* Left: list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon"><MessageSquare size={20} strokeWidth={1.5} /></div>
                <p className="empty-state-title">No inquiries</p>
                <p className="empty-state-desc">No messages in this category yet.</p>
              </div>
            </div>
          ) : (
            filtered.map(r => (
              <div
                key={r.id}
                className="card"
                style={{
                  padding: '16px 18px',
                  cursor: 'pointer',
                  border: selected?.id === r.id ? '1.5px solid var(--accent)' : undefined,
                  background: selected?.id === r.id ? 'rgba(99,102,241,0.03)' : undefined,
                  transition: 'all 0.15s',
                }}
                onClick={() => setSelected(r)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 1, minWidth: 0 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, color: 'var(--accent)',
                    }}>
                      {r.senderName.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.senderName}</p>
                        <span className={`tag ${statusColor(r.status)}`}>{r.status}</span>
                        <span className="tag tag-indigo" style={{ fontSize: 10.5 }}>{r.destinationOfInterest}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }} className="truncate">"{r.message}"</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{r.submittedAt}</span>
                    <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
                      {r.status === 'new' && (
                        <button className="btn btn-ghost btn-icon" onClick={() => onUpdateStatus(r.id, 'replied')} title="Mark replied" style={{ color: 'var(--green)' }}>
                          <CheckCircle2 size={14} strokeWidth={2} />
                        </button>
                      )}
                      {r.status !== 'archived' && (
                        <button className="btn btn-ghost btn-icon" onClick={() => onUpdateStatus(r.id, 'archived')} title="Archive">
                          <Archive size={14} strokeWidth={2} />
                        </button>
                      )}
                      <button className="btn btn-danger btn-icon" onClick={() => { onDelete(r.id); if (selected?.id === r.id) setSelected(null); }} title="Delete">
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: detail panel */}
        {selected ? (
          <div className="detail-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>Inquiry Detail</p>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16, color: 'var(--accent)', flexShrink: 0,
                }}>
                  {selected.senderName.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.senderName}</p>
                  <span className={`tag ${statusColor(selected.status)}`} style={{ marginTop: 3, display: 'inline-flex' }}>{selected.status}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { Icon: Mail, label: 'Email', val: selected.email },
                  { Icon: Phone, label: 'Phone', val: selected.phone },
                  { Icon: Globe2, label: 'Destination', val: selected.destinationOfInterest },
                ].map(({ Icon, label, val }) => (
                  <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px', gridColumn: label === 'Destination' ? 'span 2' : 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <Icon size={11} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
                      <p style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{label}</p>
                    </div>
                    <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>{val}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 13px' }}>
                <p style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Message</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>"{selected.message}"</p>
              </div>
            </div>

            {/* Quick reply */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Quick Reply</p>
              <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <textarea
                  className="field-input"
                  rows={3}
                  required
                  placeholder={`Hi ${selected.senderName}, regarding your inquiry…`}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  style={{ resize: 'none' }}
                />
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={13} strokeWidth={2} /> Send Reply
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="detail-panel" style={{ border: '1.5px dashed var(--border)' }}>
            <div className="detail-panel-empty">
              <MessageSquare size={28} strokeWidth={1.2} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 13, fontWeight: 500 }}>Select an inquiry to view details and reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
