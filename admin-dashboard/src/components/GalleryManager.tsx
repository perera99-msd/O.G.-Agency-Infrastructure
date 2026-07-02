import { useState } from 'react';
import type { GalleryItem } from '../types';
import { Plus, Edit3, Trash2, Image as ImageIcon } from 'lucide-react';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onAdd: (item: Omit<GalleryItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<GalleryItem>) => void;
  onDelete: (id: string) => void;
}

const categoryColor = (c: string) => {
  const m: Record<string, string> = {
    Departure: 'tag-blue', Workplace: 'tag-green', Training: 'tag-purple', Embassy: 'tag-amber',
  };
  return m[c] ?? 'tag-neutral';
};

const emptyForm: { title: string; category: GalleryItem['category']; imageUrl: string; dateAdded: string } = {
  title: '', category: 'Departure',
  imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
  dateAdded: new Date().toISOString().split('T')[0],
};

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  gallery, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [filter, setFilter] = useState<string>('All');

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, dateAdded: new Date().toISOString().split('T')[0] });
    setOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditId(item.id);
    setForm({ title: item.title, category: item.category, imageUrl: item.imageUrl, dateAdded: item.dateAdded });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editId) onUpdate(editId, form);
    else onAdd(form);
    setOpen(false);
  };

  const categories = ['All', 'Departure', 'Workplace', 'Training', 'Embassy'];
  const filtered = gallery.filter(g => filter === 'All' || g.category === filter);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Gallery</h2>
          <p className="page-subtitle">Manage departure moments, workplace photos, and embassy records.</p>
        </div>
        <div className="page-actions">
          <div className="filter-tabs">
            {categories.map(c => (
              <button key={c} className={`filter-tab${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Upload Asset
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><ImageIcon size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No assets found</p>
            <p className="empty-state-desc">Upload your first gallery image or change the category filter.</p>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(item => (
            <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
              <div className="img-card-wrap" style={{ height: 180 }}>
                <img src={item.imageUrl} alt={item.title} />
                <div className="img-overlay" />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <span className={`tag ${categoryColor(item.category)}`} style={{ fontSize: 11, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', border: 'none' }}>
                    {item.category}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                  <button className="btn btn-icon" onClick={() => openEdit(item)}
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--text-secondary)', border: 'none', width: 28, height: 28 }}>
                    <Edit3 size={12} />
                  </button>
                  <button className="btn btn-icon" onClick={() => onDelete(item.id)}
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--red)', border: 'none', width: 28, height: 28 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }} className="line-clamp-2">{item.title}</p>
                <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>{item.dateAdded}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Gallery Item' : 'Upload New Asset'}</h3>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div>
                  <label className="field-label">Caption / Title *</label>
                  <input className="field-input" type="text" required placeholder="e.g. Batch 25 Departure at BIA" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="field-row">
                  <div>
                    <label className="field-label">Category</label>
                    <select className="field-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}>
                      <option>Departure</option>
                      <option>Workplace</option>
                      <option>Training</option>
                      <option>Embassy</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Date Recorded</label>
                    <input className="field-input" type="date" value={form.dateAdded} onChange={e => setForm({ ...form, dateAdded: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="field-label">Image URL *</label>
                  <input className="field-input" type="url" required placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                </div>
                {form.imageUrl && (
                  <div style={{ borderRadius: 8, overflow: 'hidden', height: 120, border: '1px solid var(--border)' }}>
                    <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
