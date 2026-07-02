import { useState } from 'react';
import type { BlogPost } from '../types';
import { Plus, Edit3, Trash2, FileText, Clock, User } from 'lucide-react';

interface BlogsManagerProps {
  blogs: BlogPost[];
  onAdd: (blog: Omit<BlogPost, 'id'>) => void;
  onUpdate: (id: string, blog: Partial<BlogPost>) => void;
  onDelete: (id: string) => void;
}

const categoryColor = (c: string) => {
  const m: Record<string, string> = {
    'Visa & Legal': 'tag-blue',
    'Success Stories': 'tag-green',
    'Industry News': 'tag-purple',
  };
  return m[c] ?? 'tag-neutral';
};

const emptyForm: {
  title: string; category: BlogPost['category']; readTime: string;
  author: string; publishDate: string; excerpt: string;
} = {
  title: '', category: 'Visa & Legal', readTime: '5 min read',
  author: 'Legal Compliance Desk',
  publishDate: new Date().toISOString().split('T')[0],
  excerpt: '',
};

export const BlogsManager: React.FC<BlogsManagerProps> = ({
  blogs, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, publishDate: new Date().toISOString().split('T')[0] });
    setOpen(true);
  };

  const openEdit = (b: BlogPost) => {
    setEditId(b.id);
    setForm({ title: b.title, category: b.category, readTime: b.readTime, author: b.author, publishDate: b.publishDate, excerpt: b.excerpt });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editId) onUpdate(editId, form);
    else onAdd(form);
    setOpen(false);
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Blogs & News</h2>
          <p className="page-subtitle">Publish visa guidelines, industry news, and success stories.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Publish Article
          </button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No articles yet</p>
            <p className="empty-state-desc">Publish your first editorial article to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {blogs.map(blog => (
            <div key={blog.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <span className={`tag ${categoryColor(blog.category)}`}>{blog.category}</span>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => openEdit(blog)} title="Edit">
                    <Edit3 size={14} strokeWidth={2} />
                  </button>
                  <button className="btn btn-danger btn-icon" onClick={() => onDelete(blog.id)} title="Delete">
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, letterSpacing: '-0.2px' }}>
                  {blog.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }} className="line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                paddingTop: 12, borderTop: '1px solid var(--border)',
                fontSize: 12, color: 'var(--text-muted)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <User size={11} /> {blog.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {blog.readTime}
                </span>
                <span style={{ marginLeft: 'auto', fontWeight: 500 }}>{blog.publishDate}</span>
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
              <h3 className="modal-title">{editId ? 'Edit Article' : 'New Article'}</h3>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div>
                  <label className="field-label">Headline *</label>
                  <input className="field-input" type="text" required placeholder="e.g. Navigating Romanian Medical Clearances in 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="field-row">
                  <div>
                    <label className="field-label">Category</label>
                    <select className="field-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}>
                      <option value="Visa & Legal">Visa & Legal</option>
                      <option value="Success Stories">Success Stories</option>
                      <option value="Industry News">Industry News</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Read Time</label>
                    <input className="field-input" type="text" placeholder="5 min read" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} />
                  </div>
                </div>
                <div className="field-row">
                  <div>
                    <label className="field-label">Author / Division</label>
                    <input className="field-input" type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label">Publication Date</label>
                    <input className="field-input" type="date" value={form.publishDate} onChange={e => setForm({ ...form, publishDate: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="field-label">Excerpt / Summary *</label>
                  <textarea
                    className="field-input"
                    rows={4}
                    required
                    placeholder="Brief summary of the article content…"
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
