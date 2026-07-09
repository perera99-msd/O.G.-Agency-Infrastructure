import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryItem } from '../types';
import { Plus, Edit3, Trash2, Image as ImageIcon, Upload, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onAdd: (item: Omit<GalleryItem, 'id'> & { file?: File }) => Promise<void>;
  onUpdate: (id: string, item: Partial<GalleryItem>) => void;
  onDelete: (id: string) => void;
  role?: 'super_user' | 'normal_user';
}

type BatchItem = { id: string; title: string; imageUrl: string; file?: File };

const emptyForm: { category: GalleryItem['category']; dateAdded: string; items: BatchItem[] } = {
  category: 'Departure',
  dateAdded: new Date().toISOString().split('T')[0],
  items: [],
};

type ToastType = { id: string; type: 'success' | 'error'; message: string };

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  gallery, onAdd, onUpdate, onDelete, role = 'super_user'
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [urlInput, setUrlInput] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the dropzone itself (not a child element)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  };

  const processFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) {
      showToast('error', 'No valid image files found. Please drop image files only.');
      return;
    }

    const newItems = await Promise.all(
      imageFiles.map(
        file =>
          new Promise<BatchItem>(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
              resolve({
                id: crypto.randomUUID(),
                title: file.name
                  .replace(/\.[^.]+$/, '')
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase()),
                imageUrl: e.target?.result as string,
                file: file,
              });
            };
            reader.onerror = () => {
              showToast('error', `Failed to read file: ${file.name}`);
            };
            reader.readAsDataURL(file);
          })
      )
    );

    setForm(prev => ({ ...prev, items: [...prev.items, ...newItems] }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    } else {
      showToast('error', 'No files detected in drop. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset so the same file can be selected again
    e.target.value = '';
  };

  // ── Modal open/close ──────────────────────────────────────────────────────
  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, dateAdded: new Date().toISOString().split('T')[0], items: [] });
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditId(item.id);
    setForm({
      category: item.category,
      dateAdded: item.dateAdded,
      items: [{ id: crypto.randomUUID(), title: item.title, imageUrl: item.imageUrl }],
    });
    setOpen(true);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.items.length === 0) {
      showToast('error', 'Please add at least one image before saving.');
      return;
    }

    setIsUploading(true);

    try {
      if (editId) {
        onUpdate(editId, {
          title: form.items[0].title,
          category: form.category,
          imageUrl: form.items[0].imageUrl,
          dateAdded: form.dateAdded,
        });
        showToast('success', 'Gallery item updated successfully.');
        setOpen(false);
      } else {
        const uploadPromises = form.items
          .filter(item => item.title.trim())
          .map(item =>
            onAdd({
              title: item.title,
              category: form.category,
              imageUrl: item.imageUrl,
              dateAdded: form.dateAdded,
              file: item.file,
            })
          );

        await Promise.all(uploadPromises);
        const count = uploadPromises.length;
        showToast('success', `${count} asset${count !== 1 ? 's' : ''} uploaded successfully!`);
        setOpen(false);
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast(
        'error',
        err instanceof Error
          ? `Upload failed: ${err.message}`
          : 'Upload failed. Check your Firebase Storage rules and try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['All', 'Departure', 'Workplace', 'Training', 'Embassy'];
  const filtered = gallery.filter(g => filter === 'All' || g.category === filter);

  return (
    <div className="animate-in">
      {/* ── Toast Notifications ── */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 12, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.15)',
                maxWidth: 340, minWidth: 260,
              }}
            >
              {toast.type === 'success'
                ? <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                : <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
              }
              <span style={{ fontSize: 14, fontWeight: 600, color: toast.type === 'success' ? '#15803d' : '#b91c1c', flex: 1 }}>
                {toast.message}
              </span>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Gallery</h2>
          <p className="page-subtitle">Manage departure moments, workplace photos, and embassy records.</p>
        </div>
        <div className="page-actions">
          <div className="filter-tabs">
            {categories.map(c => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={c}
                className={`filter-tab${filter === c ? ' active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </motion.button>
            ))}
          </div>
          {role === 'super_user' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              onClick={openCreate}
            >
              <Plus size={14} strokeWidth={2.5} /> Upload Asset
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Gallery Grid ── */}
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
          <AnimatePresence mode="popLayout">
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
                  hover: { y: -8, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)' },
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
                  background: '#0f172a',
                }}
                onClick={() => openEdit(item)}
              >
                <motion.img
                  src={item.imageUrl}
                  alt={item.title}
                  variants={{ hover: { scale: 1.08, opacity: 0.85 } }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Gradient Overlay */}
                <motion.div
                  variants={{ initial: { opacity: 0.6 }, hover: { opacity: 1 } }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Section */}
                <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                    color: '#fff', fontSize: '11px', fontWeight: 700, padding: '6px 12px',
                    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    {item.category}
                  </span>
                  {role === 'super_user' && (
                    <motion.div
                      variants={{ initial: { opacity: 0, x: 10 }, hover: { opacity: 1, x: 0 } }}
                      style={{ display: 'flex', gap: '8px' }}
                    >
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(item); }}
                        style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', color: '#0f172a', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Edit3 size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onDelete(item.id); }}
                        style={{ width: 34, height: 34, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fecaca'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Trash2 size={15} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Section */}
                <motion.div
                  variants={{ initial: { y: 15, opacity: 0.8 }, hover: { y: 0, opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}
                >
                  <h4 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.3 }} className="line-clamp-2">
                    {item.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {item.dateAdded}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Upload Modal Portal ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 1000,
                  display: 'grid',
                  placeItems: 'center',
                  padding: 24,
                }}
                onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', bounce: 0.35, duration: 0.4 }}
                  style={{
                    background: '#ffffff',
                    borderRadius: 24,
                    padding: 0,
                    maxHeight: 'calc(100vh - 48px)',
                    width: '100%',
                    maxWidth: 560,
                    border: 'none',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Modal Header */}
                  <div style={{ padding: '32px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fff', flexShrink: 0 }}>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                        {editId ? 'Edit Gallery Asset' : 'Upload Assets'}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0', fontWeight: 500 }}>
                        {editId ? 'Modify the details of your gallery image.' : 'Drag & drop or click to upload photos.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                    {/* Scrollable Body */}
                    <div style={{ padding: '0 32px 32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minHeight: 0 }}>

                      {/* Category + Date Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Category</label>
                          <select
                            className="field-input"
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value as GalleryItem['category'] })}
                            style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0', appearance: 'none', cursor: 'pointer' }}
                            onFocus={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5')}
                            onBlur={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0')}
                          >
                            <option>Departure</option>
                            <option>Workplace</option>
                            <option>Training</option>
                            <option>Embassy</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Date Recorded</label>
                          <input
                            className="field-input"
                            type="date"
                            value={form.dateAdded}
                            onChange={e => setForm({ ...form, dateAdded: e.target.value })}
                            style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontWeight: 500, color: '#0f172a', transition: 'all 0.2s', boxShadow: 'inset 0 0 0 1px #e2e8f0' }}
                            onFocus={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5')}
                            onBlur={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0')}
                          />
                        </div>
                      </div>

                      {/* ── Media Assets Section ── */}
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 12 }}>
                          Media Assets
                        </label>

                        {/* ── Drag & Drop Zone ── */}
                        {!editId && (
                          <div
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              border: `2.5px dashed ${isDragging ? '#4f46e5' : '#cbd5e1'}`,
                              borderRadius: 16,
                              padding: '36px 24px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              background: isDragging ? 'rgba(79,70,229,0.06)' : '#f8fafc',
                              transition: 'all 0.2s ease',
                              marginBottom: 16,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 12,
                              userSelect: 'none',
                            }}
                          >
                            <div style={{
                              width: 56, height: 56, borderRadius: '50%',
                              background: isDragging ? '#4f46e5' : '#ffffff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: isDragging ? '0 8px 24px rgba(79,70,229,0.35)' : '0 4px 12px rgba(0,0,0,0.07)',
                              transition: 'all 0.25s',
                            }}>
                              <Upload size={24} style={{ color: isDragging ? '#ffffff' : '#64748b', transition: 'color 0.2s' }} />
                            </div>
                            <div>
                              <p style={{ fontSize: 15, color: isDragging ? '#4f46e5' : '#0f172a', margin: 0, fontWeight: 700 }}>
                                {isDragging ? '🎯 Drop files here!' : 'Drag & drop images here'}
                              </p>
                              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                                or <span style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'underline' }}>click to browse</span> — supports multiple files
                              </p>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={handleFileChange}
                            />
                          </div>
                        )}

                        {/* URL Input (only shown when no files added yet or always available) */}
                        {!editId && form.items.length === 0 && (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                              <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>or paste url</span>
                              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                              <input
                                className="field-input"
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                                style={{ background: '#f8fafc', borderColor: 'transparent', padding: '12px 16px', fontSize: 14, flex: 1, borderRadius: 12, boxShadow: 'inset 0 0 0 1px #e2e8f0', transition: 'all 0.2s' }}
                                onFocus={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #4f46e5')}
                                onBlur={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #e2e8f0')}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (urlInput.trim()) {
                                      setForm(p => ({ ...p, items: [...p.items, { id: crypto.randomUUID(), title: 'Image from URL', imageUrl: urlInput.trim() }] }));
                                      setUrlInput('');
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (urlInput.trim()) {
                                    setForm(p => ({ ...p, items: [...p.items, { id: crypto.randomUUID(), title: 'Image from URL', imageUrl: urlInput.trim() }] }));
                                    setUrlInput('');
                                  }
                                }}
                                style={{ padding: '0 20px', fontSize: 14, borderRadius: 12, background: '#f1f5f9', color: '#0f172a', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
                              >
                                Add URL
                              </button>
                            </div>
                          </>
                        )}

                        {/* ── Queued Files List ── */}
                        {form.items.length > 0 && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '240px', overflowY: 'auto', paddingRight: 4, marginTop: 4 }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                                  {form.items.length} file{form.items.length !== 1 ? 's' : ''} ready to upload
                                </span>
                                {!editId && (
                                  <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, items: [] }))}
                                    style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
                                  >
                                    Clear all
                                  </button>
                                )}
                              </div>
                              {form.items.map((item, index) => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  key={item.id}
                                  style={{
                                    display: 'flex', gap: 14, alignItems: 'center',
                                    background: '#ffffff', padding: '10px 12px', borderRadius: 14,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
                                  }}
                                >
                                  <img
                                    src={item.imageUrl}
                                    alt=""
                                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                                    onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><rect width="52" height="52" fill="%23f1f5f9" rx="10"/></svg>'; }}
                                  />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <input
                                      className="field-input"
                                      type="text"
                                      required
                                      value={item.title}
                                      onChange={e => {
                                        const newItems = [...form.items];
                                        newItems[index] = { ...newItems[index], title: e.target.value };
                                        setForm(p => ({ ...p, items: newItems }));
                                      }}
                                      placeholder="Add a descriptive caption..."
                                      style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 14, fontWeight: 600, color: '#0f172a', width: '100%', outline: 'none' }}
                                    />
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {item.file ? `📁 ${item.file.name} · ${(item.file.size / 1024).toFixed(0)}KB` : '🔗 URL image'}
                                    </div>
                                  </div>
                                  {!editId && (
                                    <button
                                      type="button"
                                      onClick={() => setForm(p => ({ ...p, items: p.items.filter(x => x.id !== item.id) }))}
                                      style={{ background: '#f8fafc', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#94a3b8'; }}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </motion.div>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    </div>

                    {/* ── Modal Footer ── */}
                    <div style={{ padding: '20px 32px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 12, width: '100%', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        disabled={isUploading}
                        style={{ padding: '11px 22px', background: 'transparent', color: '#64748b', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', opacity: isUploading ? 0.5 : 1 }}
                        onMouseEnter={e => { if (!isUploading) e.currentTarget.style.background = '#e2e8f0'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading || form.items.length === 0}
                        style={{
                          padding: '11px 26px', background: isUploading ? '#64748b' : '#0f172a', color: '#fff',
                          borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', cursor: isUploading ? 'wait' : 'pointer',
                          boxShadow: '0 8px 16px -4px rgba(15,23,42,0.25)', transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: 8,
                          opacity: form.items.length === 0 ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!isUploading && form.items.length > 0) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(15,23,42,0.3)'; } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(15,23,42,0.25)'; }}
                      >
                        {isUploading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                        {isUploading
                          ? `Uploading${form.items.length > 1 ? ` ${form.items.length} files` : ''}…`
                          : editId ? 'Save Changes' : `Upload ${form.items.length > 0 ? form.items.length : ''} Asset${form.items.length !== 1 ? 's' : ''}`}
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
