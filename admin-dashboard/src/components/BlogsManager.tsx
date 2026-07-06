import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { BlogPost } from '../types';
import { Plus, Edit3, Trash2, FileText, Clock, User, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogsManagerProps {
  blogs: BlogPost[];
  onAdd: (blog: Omit<BlogPost, 'id'> & { file?: File }) => void;
  onUpdate: (id: string, blog: Partial<BlogPost> & { file?: File }) => void;
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
  author: string; publishDate: string; excerpt: string; image: string; file?: File;
} = {
  title: '', category: 'Visa & Legal', readTime: '5 min read',
  author: 'Legal Compliance Desk',
  publishDate: new Date().toISOString().split('T')[0],
  excerpt: '',
  image: '',
};

export const BlogsManager: React.FC<BlogsManagerProps> = ({
  blogs, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (file.type.startsWith('image/')) setForm(p => ({ ...p, file, image: URL.createObjectURL(file) }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) setForm(p => ({ ...p, file, image: URL.createObjectURL(file) }));
    }
    e.target.value = '';
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, publishDate: new Date().toISOString().split('T')[0] });
    setOpen(true);
  };

  const openEdit = (b: BlogPost) => {
    setEditId(b.id);
    setForm({ title: b.title, category: b.category, readTime: b.readTime, author: b.author, publishDate: b.publishDate, excerpt: b.excerpt, image: b.image || '' });
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

              {blog.image && (
                <div style={{ width: '100%', height: 140, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                  <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
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
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{editId ? 'Edit Article' : 'New Article'}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0', fontWeight: 500 }}>{editId ? 'Update the content and metadata of this post.' : 'Publish a new editorial article or industry update.'}</p>
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
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Headline *</label>
                    <input className="field-input" type="text" required placeholder="e.g. Navigating Romanian Medical Clearances in 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Category</label>
                      <select className="field-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0', appearance: 'none', cursor: 'pointer' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'}>
                        <option value="Visa & Legal">Visa & Legal</option>
                        <option value="Success Stories">Success Stories</option>
                        <option value="Industry News">Industry News</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Read Time</label>
                      <input className="field-input" type="text" placeholder="5 min read" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Author / Division</label>
                      <input className="field-input" type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Publication Date</label>
                      <input className="field-input" type="date" value={form.publishDate} onChange={e => setForm({ ...form, publishDate: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Cover Image</label>
                    <div
                      onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2.5px dashed ${isDragging ? '#4f46e5' : '#cbd5e1'}`, borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer',
                        background: form.image ? `url(${form.image}) center/cover no-repeat` : (isDragging ? 'rgba(79,70,229,0.06)' : '#f8fafc'),
                        transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, userSelect: 'none', position: 'relative', overflow: 'hidden'
                      }}
                    >
                      {form.image && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />}
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%', background: isDragging ? '#4f46e5' : '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDragging ? '0 8px 24px rgba(79,70,229,0.35)' : '0 4px 12px rgba(0,0,0,0.07)',
                        zIndex: 1
                      }}>
                        <Upload size={20} style={{ color: isDragging ? '#ffffff' : '#64748b' }} />
                      </div>
                      <div style={{ zIndex: 1 }}>
                        <p style={{ fontSize: 14, color: form.image ? '#fff' : (isDragging ? '#4f46e5' : '#0f172a'), margin: 0, fontWeight: 700 }}>
                          {isDragging ? 'Drop image here!' : (form.image ? 'Click or drop to replace image' : 'Drag & drop cover image')}
                        </p>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Excerpt / Summary *</label>
                    <textarea
                      className="field-input"
                      rows={4}
                      required
                      placeholder="Brief summary of the article content…"
                      value={form.excerpt}
                      onChange={e => setForm({ ...form, excerpt: e.target.value })}
                      style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0', resize: 'vertical' }}
                      onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'}
                      onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'}
                    />
                  </div>
                </div>

                {/* Floating Footer */}
                <div style={{ padding: '24px 32px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 16, width: '100%', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                  <button type="button" onClick={() => setOpen(false)} style={{ padding: '12px 24px', background: 'transparent', color: '#64748b', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '12px 28px', background: '#0f172a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.25)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 20px -4px rgba(15, 23, 42, 0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(15, 23, 42, 0.25)'; }}>
                    {editId ? 'Save Changes' : 'Publish'}
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
