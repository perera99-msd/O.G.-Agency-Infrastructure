import { useState } from 'react';
import type { Destination } from '../types';
import { Plus, Edit3, Trash2, Globe2, Star, Upload } from 'lucide-react';

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
    <>
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
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 480, background: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0, alignItems: 'flex-start' }}>
              <div>
                <h3 className="modal-title" style={{ fontSize: 22 }}>{editId ? 'Edit Destination' : 'Add Destination'}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--accent)', marginTop: 4, fontWeight: 500 }}>
                  {editId ? 'Update details for this location.' : 'Add a new employment corridor to your catalog.'}
                </p>
              </div>
              <button className="modal-close" onClick={() => setOpen(false)} style={{ borderRadius: '50%', background: 'var(--bg)', border: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ gap: 20 }}>
                <div className="field-row">
                  <div>
                    <label className="field-label">Country Name *</label>
                    <input className="field-input" type="text" required placeholder="e.g. Poland" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={{ borderRadius: 12 }} />
                  </div>
                  <div>
                    <label className="field-label">Region / Jurisdiction</label>
                    <input className="field-input" type="text" placeholder="e.g. Central Europe" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ borderRadius: 12 }} />
                  </div>
                </div>

                <div>
                  <label className="field-label">Hero Image URL</label>
                  <input className="field-input" type="url" placeholder="https://images.unsplash.com/..." value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} style={{ borderRadius: 12 }} />
                </div>

                <div className="field-row">
                  <div>
                    <label className="field-label">Active Jobs</label>
                    <input className="field-input" type="number" value={form.activeJobs} onChange={e => setForm({ ...form, activeJobs: Number(e.target.value) })} style={{ borderRadius: 12 }} />
                  </div>
                  <div>
                    <label className="field-label">Visa Timeline (days)</label>
                    <input className="field-input" type="number" value={form.visaProcessingDays} onChange={e => setForm({ ...form, visaProcessingDays: Number(e.target.value) })} style={{ borderRadius: 12 }} />
                  </div>
                </div>

                <div className="checkbox-row">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <label htmlFor="featured" className="checkbox-label">Feature on the public website landing page</label>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 8, justifyContent: 'center', gap: 16 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} style={{ color: 'var(--text-secondary)', fontWeight: 600, padding: '10px 24px' }}>Cancel</button>
                <button type="submit" className="btn" style={{ background: '#0f172a', color: 'white', padding: '10px 24px', borderRadius: 12, flex: 1, justifyContent: 'center' }}>{editId ? 'Save Changes' : 'Add Destination'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
