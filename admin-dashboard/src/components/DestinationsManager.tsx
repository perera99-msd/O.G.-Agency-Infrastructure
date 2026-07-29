import { useState, useRef } from 'react';
import type { Destination, AdminRole } from '../types';
import { Plus, Edit3, Trash2, Globe2, Star, Upload } from 'lucide-react';

interface DestinationsManagerProps {
  destinations: Destination[];
  onAdd: (dest: Omit<Destination, 'id'> & { file?: File }) => void;
  onUpdate: (id: string, dest: Partial<Destination> & { file?: File }) => void;
  onDelete: (id: string) => void;
  role?: AdminRole;
}

const emptyForm: {
  country: string; region: string; flag: string; heroImage: string; activeJobs: number; visaProcessingDays: number; featured: boolean; isActive: boolean; file?: File;
} = {
  country: '',
  region: '',
  flag: '',
  heroImage: '',
  activeJobs: 10,
  visaProcessingDays: 30,
  featured: false,
  isActive: true,
};

export const DestinationsManager: React.FC<DestinationsManagerProps> = ({
  destinations, onAdd, onUpdate, onDelete, role = 'super_user'
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveConfirmData, setSaveConfirmData] = useState<{ id: string; form: typeof emptyForm } | null>(null);

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      setIsDragging(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) setForm(p => ({ ...p, file, heroImage: URL.createObjectURL(file) }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) setForm(p => ({ ...p, file, heroImage: URL.createObjectURL(file) }));
    }
    e.target.value = '';
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (d: Destination) => {
    setEditId(d.id);
    setForm({
      country: d.country, region: d.region, flag: d.flag || '', heroImage: d.heroImage || '',
      activeJobs: d.activeJobs, visaProcessingDays: d.visaProcessingDays, featured: d.featured, isActive: d.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.country) return;
    if (editId) {
      // Prompt confirmation overlay for editing existing corridors
      setSaveConfirmData({ id: editId, form: { ...form } });
    } else {
      // Proceed immediately for adding new corridors
      onAdd(form);
      setOpen(false);
    }
  };

  const handleConfirmSave = () => {
    if (saveConfirmData) {
      onUpdate(saveConfirmData.id, saveConfirmData.form);
      setSaveConfirmData(null);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="animate-in">
        <div className="page-header">
          <div>
            <h2 className="page-title">Destinations</h2>
            <p className="page-subtitle">Manage international employment corridors and visa timelines.</p>
          </div>
          {role === 'super_user' && (
            <div className="page-actions">
              <button className="btn btn-primary" onClick={openCreate}>
                <Plus size={14} strokeWidth={2.5} /> Add Destination
              </button>
            </div>
          )}
        </div>

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
                <div className="img-card-wrap" style={{ height: 160, position: 'relative' }}>
                  <img src={d.heroImage} alt={d.country} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                    <span className="tag tag-indigo" style={{ fontSize: 11, background: 'rgba(255,255,255,0.9)', color: 'var(--accent)', border: 'none', backdropFilter: 'blur(4px)' }}>
                      {d.region}
                    </span>
                    <span className={`tag ${d.isActive ? 'tag-green' : 'tag-neutral'}`} style={{ fontSize: 11, background: 'rgba(255,255,255,0.9)', border: 'none', backdropFilter: 'blur(4px)' }}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {d.featured && (
                      <span className="tag" style={{ fontSize: 11, background: 'rgba(255,255,255,0.9)', color: 'var(--amber)', border: 'none', backdropFilter: 'blur(4px)', gap: 4 }}>
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                  {role === 'super_user' && (
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-icon"
                        onClick={() => openEdit(d)}
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => setDeleteConfirmId(d.id)}
                        style={{ color: 'var(--red)', background: 'var(--red-bg)', border: '1px solid var(--red-border)' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{d.country}</p>
                  </div>
                  <div className="grid-2" style={{ gap: 8 }}>
                    <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 2 }}>Active Jobs</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{d.activeJobs}</p>
                    </div>
                    <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 2 }}>Visa Days</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>{d.visaProcessingDays}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{editId ? 'Edit Destination' : 'Add Destination'}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  {editId ? 'Update details for this location.' : 'Add a new employment corridor to your catalog.'}
                </p>
              </div>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Country Name *</label>
                    <input className="field-input" type="text" required placeholder="e.g. Poland" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Region / Jurisdiction</label>
                    <input className="field-input" type="text" placeholder="e.g. Central Europe" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Flag (Emoji or URL)</label>
                  <input className="field-input" type="text" placeholder="e.g. 🇵🇱 or /flags/poland.png" value={form.flag} onChange={e => setForm({ ...form, flag: e.target.value })} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label className="field-label">Hero Image</label>
                  <div
                    onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2.5px dashed ${isDragging ? '#4f46e5' : '#cbd5e1'}`, borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer',
                      background: form.heroImage ? `url(${form.heroImage}) center/cover no-repeat` : (isDragging ? 'rgba(79,70,229,0.06)' : '#f8fafc'),
                      transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, userSelect: 'none', position: 'relative', overflow: 'hidden'
                    }}
                  >
                    {form.heroImage && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />}
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', background: isDragging ? '#4f46e5' : '#ffffff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDragging ? '0 8px 24px rgba(79,70,229,0.35)' : '0 4px 12px rgba(0,0,0,0.07)',
                      zIndex: 1
                    }}>
                      <Upload size={20} style={{ color: isDragging ? '#ffffff' : '#64748b' }} />
                    </div>
                    <div style={{ zIndex: 1 }}>
                      <p style={{ fontSize: 14, color: form.heroImage ? '#fff' : (isDragging ? '#4f46e5' : '#0f172a'), margin: 0, fontWeight: 700 }}>
                        {isDragging ? 'Drop image here!' : (form.heroImage ? 'Click or drop to replace image' : 'Drag & drop hero image')}
                      </p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  </div>
                  <input
                    className="field-input"
                    type="url"
                    placeholder="Or paste an image URL (https://...)"
                    value={form.file ? '' : form.heroImage}
                    onChange={e => setForm({ ...form, file: undefined, heroImage: e.target.value })}
                    style={{ borderRadius: 12, marginTop: 8 }}
                  />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Active Jobs Counter</label>
                    <input className="field-input" type="number" min={0} value={form.activeJobs} onChange={e => setForm({ ...form, activeJobs: Number(e.target.value) })} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Visa Processing (Days)</label>
                    <input className="field-input" type="number" min={1} value={form.visaProcessingDays} onChange={e => setForm({ ...form, visaProcessingDays: Number(e.target.value) })} />
                  </div>
                </div>

                <div className="checkbox-row">
                  <input type="checkbox" id="dest-featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <label htmlFor="dest-featured" className="field-label" style={{ marginBottom: 0 }}>Featured on homepage</label>
                </div>
                <div className="checkbox-row">
                  <input type="checkbox" id="dest-active" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  <label htmlFor="dest-active" className="field-label" style={{ marginBottom: 0 }}>Active destination</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Destination'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 100000 }}>
          <div className="modal logout-confirmation" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Delete Destination?</h3>
                <p className="logout-confirmation-copy" style={{ marginTop: 8 }}>
                  Are you sure you want to permanently delete <strong>{destinations.find(d => d.id === deleteConfirmId)?.country}</strong>? This will remove all associated job counter metadata and clear any files. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (deleteConfirmId) {
                    onDelete(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }
                }}
              >
                Delete Destination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Save Edits Confirmation Modal ── */}
      {saveConfirmData && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 100000 }}>
          <div className="modal logout-confirmation" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Save Destination Changes?</h3>
                <p className="logout-confirmation-copy" style={{ marginTop: 8 }}>
                  Are you sure you want to save your updates for <strong>{saveConfirmData.form.country}</strong>? These changes will go live instantly on the O.G. Agency website.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSaveConfirmData(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmSave}
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
