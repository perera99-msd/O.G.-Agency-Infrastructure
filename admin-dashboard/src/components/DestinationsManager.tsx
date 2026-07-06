import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Destination } from '../types';
import { Plus, Edit3, Trash2, Globe2, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationsManagerProps {
  destinations: Destination[];
  onAdd: (dest: Omit<Destination, 'id'>) => void;
  onUpdate: (id: string, dest: Partial<Destination>) => void;
  onDelete: (id: string) => void;
}

const emptyForm = {
  country: '',
  region: '',
  heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
  activeJobs: 10,
  visaProcessingDays: 30,
  featured: false,
};

export const DestinationsManager: React.FC<DestinationsManagerProps> = ({
  destinations, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (d: Destination) => {
    setEditId(d.id);
    setForm({
      country: d.country, region: d.region, heroImage: d.heroImage,
      activeJobs: d.activeJobs, visaProcessingDays: d.visaProcessingDays, featured: d.featured,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.country) return;
    if (editId) onUpdate(editId, form);
    else onAdd(form);
    setOpen(false);
  };

  return (
    <div className="animate-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Destinations</h2>
          <p className="page-subtitle">Manage international employment corridors and visa timelines.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Add Destination
          </button>
        </div>
      </div>

      {/* Grid */}
      {destinations.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Globe2 size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No destinations yet</p>
            <p className="empty-state-desc">Add your first employment corridor to get started.</p>
            <button className="btn btn-primary" style={{ marginTop: 4 }} onClick={openCreate}>
              <Plus size={14} /> Add Destination
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {destinations.map(d => (
            <div key={d.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Image */}
              <div className="img-card-wrap" style={{ height: 160 }}>
                <img src={d.heroImage} alt={d.country} />
                <div className="img-overlay" />
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                  <span className="tag tag-indigo" style={{ fontSize: 11, background: 'rgba(255,255,255,0.9)', color: 'var(--accent)', border: 'none', backdropFilter: 'blur(4px)' }}>
                    {d.region}
                  </span>
                  {d.featured && (
                    <span className="tag" style={{ fontSize: 11, background: 'rgba(255,255,255,0.9)', color: 'var(--amber)', border: 'none', backdropFilter: 'blur(4px)', gap: 4 }}>
                      <Star size={10} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                {/* Action buttons */}
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-icon"
                    onClick={() => openEdit(d)}
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--text-secondary)', border: 'none', width: 28, height: 28 }}
                    title="Edit"
                  >
                    <Edit3 size={12} strokeWidth={2} />
                  </button>
                  <button
                    className="btn btn-icon"
                    onClick={() => onDelete(d.id)}
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--red)', border: 'none', width: 28, height: 28 }}
                    title="Delete"
                  >
                    <Trash2 size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe2 size={15} strokeWidth={1.8} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{d.country}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px' }}>
                    <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 2 }}>Active Jobs</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{d.activeJobs}</p>
                  </div>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px' }}>
                    <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 2 }}>Visa Days</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{d.visaProcessingDays}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styled Popup Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            className="modal-overlay" 
            style={{ 
              background: 'rgba(15, 23, 42, 0.4)', 
              position: 'fixed', 
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000, 
              display: 'grid', 
              placeItems: 'center', 
              padding: 24,
              overflow: 'hidden'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              transition={{ type: 'spring', bounce: 0.35, duration: 0.4 }} 
              className="modal" 
              style={{ 
                background: '#ffffff', 
                borderRadius: 24, 
                padding: 0, 
                maxHeight: 'calc(100vh - 48px)', 
                width: '100%', 
                maxWidth: 540, 
                border: 'none', 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)'
              }}
            >
              {/* Sleek Header without border */}
              <div style={{ padding: '32px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fff', flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{editId ? 'Edit Destination' : 'New Destination'}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0', fontWeight: 500 }}>{editId ? 'Modify the details of this employment corridor.' : 'Add a new employment corridor to your system.'}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {/* Scrollable Form Body */}
                <div style={{ padding: '0 32px 32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Country Name *</label>
                    <input className="field-input" type="text" required placeholder="e.g. Poland, Hungary…" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Region / Jurisdiction</label>
                    <input className="field-input" type="text" placeholder="e.g. Central Europe (Schengen)" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Hero Image URL</label>
                    <input className="field-input" type="url" placeholder="https://images.unsplash.com/..." value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Active Jobs</label>
                      <input className="field-input" type="number" value={form.activeJobs} onChange={e => setForm({ ...form, activeJobs: Number(e.target.value) })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Visa Timeline (days)</label>
                      <input className="field-input" type="number" value={form.visaProcessingDays} onChange={e => setForm({ ...form, visaProcessingDays: Number(e.target.value) })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: 18, height: 18, accentColor: '#4f46e5', cursor: 'pointer' }} />
                    <label htmlFor="featured" style={{ fontSize: 14, color: '#334155', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>Feature on the public website landing page</label>
                  </div>
                </div>

                {/* Floating Footer */}
                <div style={{ padding: '24px 32px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 16, width: '100%', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                  <button type="button" onClick={() => setOpen(false)} style={{ padding: '12px 24px', background: 'transparent', color: '#64748b', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '12px 28px', background: '#0f172a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.25)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 20px -4px rgba(15, 23, 42, 0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(15, 23, 42, 0.25)'; }}>
                    {editId ? 'Save Changes' : 'Add Destination'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
