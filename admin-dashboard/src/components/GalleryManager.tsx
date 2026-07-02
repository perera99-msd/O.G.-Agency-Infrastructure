import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryItem } from '../types';
import { Plus, Edit3, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onAdd: (item: Omit<GalleryItem, 'id'> & { file?: File }) => void;
  onUpdate: (id: string, item: Partial<GalleryItem>) => void;
  onDelete: (id: string) => void;
}



type BatchItem = { id: string; title: string; imageUrl: string; file?: File };
const emptyForm: { category: GalleryItem['category']; dateAdded: string; items: BatchItem[] } = {
  category: 'Departure',
  dateAdded: new Date().toISOString().split('T')[0],
  items: [],
};

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  gallery, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [urlInput, setUrlInput] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = async (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    
    const newItems = await Promise.all(imageFiles.map(file => {
      return new Promise<BatchItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: crypto.randomUUID(),
            title: file.name.split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            imageUrl: e.target?.result as string,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    setForm(prev => ({ ...prev, items: [...prev.items, ...newItems] }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, dateAdded: new Date().toISOString().split('T')[0], items: [] });
    setUrlInput('');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    setOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditId(item.id);
    setForm({ category: item.category, dateAdded: item.dateAdded, items: [{ id: crypto.randomUUID(), title: item.title, imageUrl: item.imageUrl }] });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.items.length === 0) return;
    
    if (editId) {
      onUpdate(editId, { 
        title: form.items[0].title, 
        category: form.category, 
        imageUrl: form.items[0].imageUrl, 
        dateAdded: form.dateAdded 
      });
    } else {
      form.items.forEach(item => {
        if (!item.title) return;
        onAdd({
          title: item.title,
          category: form.category,
          imageUrl: item.imageUrl,
          dateAdded: form.dateAdded,
          file: item.file
        });
      });
    }
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
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={c} className={`filter-tab${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c}
              </motion.button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Upload Asset
          </motion.button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><ImageIcon size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No assets found</p>
            <p className="empty-state-desc">Upload your first gallery image or change the category filter.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div layout className="grid-3">
          <AnimatePresence mode='popLayout'>
            {filtered.map(item => (
              <motion.div 
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.9 },
                  hover: { y: -8, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18)" }
                }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
                whileHover="hover"
                key={item.id} 
                style={{ 
                  position: 'relative', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  height: '280px', 
                  cursor: 'pointer',
                  background: '#0f172a'
                }}
                onClick={() => openEdit(item)}
              >
                <motion.img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  variants={{
                    hover: { scale: 1.08, opacity: 0.85 }
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {/* Gradient Overlay */}
                <motion.div 
                  variants={{
                    initial: { opacity: 0.6 },
                    hover: { opacity: 1 }
                  }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 50%, transparent 100%)', pointerEvents: 'none' }} 
                />
                
                {/* Top Section */}
                <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', 
                    color: '#fff', fontSize: '11px', fontWeight: 700, padding: '6px 12px', 
                    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' 
                  }}>
                    {item.category}
                  </span>
                  
                  <motion.div 
                    variants={{
                      initial: { opacity: 0, x: 10 },
                      hover: { opacity: 1, x: 0 }
                    }}
                    style={{ display: 'flex', gap: '8px' }}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.95)', color: '#0f172a', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Edit3 size={15} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fecaca'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Trash2 size={15} strokeWidth={2.5} />
                    </button>
                  </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div 
                  variants={{
                    initial: { y: 15, opacity: 0.8 },
                    hover: { y: 0, opacity: 1 }
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}
                >
                  <h4 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.3 }} className="line-clamp-2">{item.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {item.dateAdded}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{editId ? 'Edit Gallery Asset' : 'Upload Assets'}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0', fontWeight: 500 }}>{editId ? 'Modify the details of your gallery image.' : 'Add stunning new photos to your gallery.'}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {/* Scrollable Form Body */}
                <div style={{ padding: '0 32px 32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minHeight: 0 }}>
                  
                  {/* Clean 2-Column Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Category</label>
                      <select className="field-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0', appearance: 'none', cursor: 'pointer' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'}>
                        <option>Departure</option>
                        <option>Workplace</option>
                        <option>Training</option>
                        <option>Embassy</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Date Recorded</label>
                      <input className="field-input" type="date" value={form.dateAdded} onChange={e => setForm({ ...form, dateAdded: e.target.value })} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Media Assets</label>
                    
                    {!editId && (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                          border: `2px dashed ${isDragging ? '#4f46e5' : '#cbd5e1'}`,
                          borderRadius: 16,
                          padding: form.items.length > 0 ? '16px' : '40px 24px',
                          textAlign: form.items.length > 0 ? 'left' : 'center',
                          cursor: 'pointer',
                          background: isDragging ? '#eef2ff' : '#f8fafc',
                          transition: 'all 0.25s ease',
                          marginBottom: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: form.items.length > 0 ? 'center' : 'flex-start',
                          flexDirection: form.items.length > 0 ? 'row' : 'column',
                          gap: form.items.length > 0 ? 12 : 12,
                        }}
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <div style={{ background: isDragging ? '#4f46e5' : '#ffffff', width: form.items.length > 0 ? 40 : 56, height: form.items.length > 0 ? 40 : 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                          <Upload size={form.items.length > 0 ? 20 : 26} style={{ color: isDragging ? '#ffffff' : '#64748b' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, color: '#0f172a', margin: 0, fontWeight: 700 }}>
                            {isDragging ? 'Drop files here!' : 'Click to upload'}
                          </p>
                          {form.items.length === 0 && (
                            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                              or drag and drop multiple files
                            </p>
                          )}
                        </div>
                        <input 
                          id="file-upload"
                          type="file" 
                          accept="image/*"
                          multiple
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </div>
                    )}

                    {!editId && form.items.length === 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                        <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>or paste url</span>
                        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                      </div>
                    )}
                    
                    {!editId && (
                      <div style={{ display: 'flex', gap: 12, marginBottom: form.items.length > 0 ? 16 : 24 }}>
                        <input className="field-input" type="url" placeholder="https://images.unsplash.com/..." value={urlInput} onChange={e => setUrlInput(e.target.value)} style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, flex: 1, borderRadius: 12, boxShadow: 'inset 0 0 0 1px #e2e8f0', transition: 'all 0.2s' }} onFocus={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5'} onBlur={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0'} />
                        <button type="button" onClick={() => { if (urlInput) { setForm(p => ({ ...p, items: [...p.items, { id: crypto.randomUUID(), title: 'Image from URL', imageUrl: urlInput }] })); setUrlInput(''); } }} style={{ padding: '0 20px', fontSize: 14, borderRadius: 12, background: '#f1f5f9', color: '#0f172a', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>Add URL</button>
                      </div>
                    )}

                    {form.items.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '220px', overflowY: 'auto', paddingRight: 6, margin: '0 -6px', padding: '0 6px' }}>
                        {form.items.map((item, index) => (
                          <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#ffffff', padding: '12px', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                            <img src={item.imageUrl} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} />
                            <div style={{ flex: 1 }}>
                              <input className="field-input" type="text" required value={item.title} onChange={e => {
                                const newItems = [...form.items];
                                newItems[index].title = e.target.value;
                                setForm(p => ({ ...p, items: newItems }));
                              }} placeholder="Add a descriptive caption..." style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 14, fontWeight: 500, color: '#0f172a', width: '100%', outline: 'none' }} />
                              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>Asset • {item.title ? item.title.length : 0} chars</div>
                            </div>
                            {!editId && (
                              <button type="button" onClick={() => setForm(p => ({ ...p, items: p.items.filter(x => x.id !== item.id) }))} style={{ background: '#f8fafc', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 10, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#94a3b8'; }}>
                                <Trash2 size={16} />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Footer */}
                <div style={{ padding: '24px 32px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 16, width: '100%', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                  <button type="button" onClick={() => setOpen(false)} style={{ padding: '12px 24px', background: 'transparent', color: '#64748b', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '12px 28px', background: '#0f172a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.25)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 20px -4px rgba(15, 23, 42, 0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(15, 23, 42, 0.25)'; }}>
                    {editId ? 'Save Changes' : 'Upload Asset(s)'}
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
