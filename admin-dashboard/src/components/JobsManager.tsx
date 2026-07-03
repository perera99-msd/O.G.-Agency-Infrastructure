// admin/components/JobsManager.tsx
// Uses the admin's own CSS design system (index.css) exactly —
// .card, .btn, .modal, .data-row, .filter-tabs, .field-input, var(--accent) etc.

import { useState } from 'react';
import type { JobOpening } from '../types';
import {
  Plus, Edit3, Trash2, MapPin, DollarSign,
  Briefcase, X, AlertCircle, Check,
} from 'lucide-react';

const COUNTRIES = [
  "Bosnia","Cyprus","Germany","Israel","Jordan","Kuwait",
  "Malaysia","Oman","Qatar","Romania","Russia","Saudi Arabia","UAE",
];
const CATEGORIES = [
  "Construction","Garment","Healthcare","Hospitality",
  "Manufacturing","Engineering","Retail","Admin","Accounts","Other",
];
const GENDER_OPTIONS = ["Male", "Female", "No Preference"];

interface JobsManagerProps {
  jobs: JobOpening[];
  onAdd: (job: Omit<JobOpening, 'id'>) => void;
  onUpdate: (id: string, job: Partial<JobOpening>) => void;
  onDelete: (id: string) => void;
}

const emptyForm: Omit<JobOpening, 'id'> = {
  title: '',
  country: COUNTRIES[0],
  category: CATEGORIES[0],
  salary: { min: 1000, max: 2000, currency: 'USD' },
  deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toISOString().split('T')[0],
  description: '',
  active: true,
  isUrgent: false,
  genderPreference: 'No Preference',
  ageRange: { min: 20, max: 50 },
  tags: [],
  requirements: [''],
  benefits: [],
};

export const JobsManager: React.FC<JobsManagerProps> = ({
  jobs, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen]         = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState<Omit<JobOpening, 'id'>>({ ...emptyForm });
  const [filter, setFilter]     = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (j: JobOpening) => {
    setEditId(j.id);
    const { id, ...rest } = j;
    setForm({
      ...rest,
      tags:         rest.tags || [],
      requirements: rest.requirements?.length ? rest.requirements : [''],
      benefits:     rest.benefits || [],
      ageRange:     rest.ageRange || { min: 18, max: 60 },
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    const submission = {
      ...form,
      requirements: form.requirements?.filter(r => r.trim() !== '') || [],
      benefits:     form.benefits?.filter(b => b.title.trim() !== '' && b.description.trim() !== '') || [],
    };
    if (editId) onUpdate(editId, submission);
    else        onAdd(submission);
    setOpen(false);
  };

  // Requirements helpers
  const addReq    = () => setForm({ ...form, requirements: [...(form.requirements || []), ''] });
  const updateReq = (i: number, val: string) => {
    const arr = [...(form.requirements || [])]; arr[i] = val;
    setForm({ ...form, requirements: arr });
  };
  const removeReq = (i: number) => {
    const arr = [...(form.requirements || [])]; arr.splice(i, 1);
    setForm({ ...form, requirements: arr });
  };

  // Benefits helpers
  const addBen    = () => setForm({ ...form, benefits: [...(form.benefits || []), { title: '', description: '' }] });
  const updateBen = (i: number, field: 'title' | 'description', val: string) => {
    const arr = [...(form.benefits || [])]; arr[i] = { ...arr[i], [field]: val };
    setForm({ ...form, benefits: arr });
  };
  const removeBen = (i: number) => {
    const arr = [...(form.benefits || [])]; arr.splice(i, 1);
    setForm({ ...form, benefits: arr });
  };

  const filtered = jobs.filter(j =>
    filter === 'all' ? true : filter === 'active' ? j.active : !j.active
  );

  const counts = {
    all:      jobs.length,
    active:   jobs.filter(j => j.active).length,
    inactive: jobs.filter(j => !j.active).length,
  };

  return (
    <div className="animate-in">

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Job Openings</h2>
          <p className="page-subtitle">Post and manage employment vacancies across all destination corridors.</p>
        </div>
        <div className="page-actions">
          {/* Filter tabs */}
          <div className="filter-tabs">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button
                key={f}
                className={`filter-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}{' '}
                <span style={{ opacity: 0.6 }}>({counts[f]})</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Post Vacancy
          </button>
        </div>
      </div>

      {/* ── Job list ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={20} strokeWidth={1.5} />
            </div>
            <p className="empty-state-title">No vacancies found</p>
            <p className="empty-state-desc">
              Try changing the filter, or post a new vacancy.
            </p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 4 }}>
              <Plus size={13} strokeWidth={2.5} /> Post Vacancy
            </button>
          </div>
        ) : (
          filtered.map((job, i) => (
            <div
              key={job.id}
              className="data-row"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              {/* Icon */}
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: job.isUrgent ? 'var(--blue-bg)' : 'var(--purple-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Briefcase
                  size={16} strokeWidth={1.8}
                  style={{ color: job.isUrgent ? 'var(--blue)' : 'var(--purple)' }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {job.title}
                  </p>
                  {job.isUrgent && <span className="tag tag-blue">URGENT</span>}
                  <span className={`tag ${job.active ? 'tag-green' : 'tag-neutral'}`}>
                    {job.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="tag tag-neutral">{job.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {job.country}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                    <DollarSign size={11} />
                    {job.salary?.min?.toLocaleString()} – {job.salary?.max?.toLocaleString()} {job.salary?.currency}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Closes {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                    Gender: {job.genderPreference}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="data-row-actions">
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => openEdit(job)}
                  title="Edit"
                >
                  <Edit3 size={14} strokeWidth={2} />
                </button>
                <button
                  className="btn btn-danger btn-icon"
                  onClick={() => setDeleteId(job.id)}
                  title="Delete"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--red-bg)',
                  border: '1px solid var(--red-border)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <AlertCircle size={16} style={{ color: 'var(--red)' }} />
                </div>
                <h3 className="modal-title">Delete Vacancy?</h3>
              </div>
              <button className="modal-close" onClick={() => setDeleteId(null)}>×</button>
            </div>
            <div className="modal-body" style={{ gap: 0 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                This action cannot be undone. The listing will be removed from the public portal immediately.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ background: 'var(--red)', color: 'white' }}
                onClick={() => { onDelete(deleteId); setDeleteId(null); }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {open && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 800, width: '90%', maxHeight: '90vh', paddingTop: "250px" }}>

            {/* Modal header */}
            <div className="modal-header">
              <h3 className="modal-title">
                {editId ? 'Edit Job Posting' : 'Post New Vacancy'}
              </h3>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ overflowY: 'auto' }}>
              <div className="modal-body" style={{ gap: 28 }}>

                {/* ─ 1. Basic Info ─ */}
                <section>
                  <SectionDivider>Basic Information</SectionDivider>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="field-label">Job Title *</label>
                      <input
                        className="field-input"
                        type="text"
                        required
                        placeholder="e.g. Senior Industrial Welder"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Destination Country *</label>
                      <select
                        className="field-input"
                        value={form.country}
                        onChange={e => setForm({ ...form, country: e.target.value })}
                      >
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Industry Category *</label>
                      <select
                        className="field-input"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Application Deadline *</label>
                      <input
                        className="field-input"
                        type="date"
                        required
                        value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Toggle switches */}
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <Toggle
                      checked={form.active}
                      onChange={v => setForm({ ...form, active: v })}
                      label="Active / Published"
                      color="var(--green)"
                    />
                    <Toggle
                      checked={form.isUrgent}
                      onChange={v => setForm({ ...form, isUrgent: v })}
                      label="Mark as Urgent"
                      color="var(--blue)"
                    />
                  </div>
                </section>

                {/* ─ 2. Salary & Demographics ─ */}
                <section>
                  <SectionDivider>Salary & Demographics</SectionDivider>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div>
                      <label className="field-label">Min Salary *</label>
                      <input
                        className="field-input"
                        type="number"
                        required
                        value={form.salary.min}
                        onChange={e => setForm({ ...form, salary: { ...form.salary, min: Number(e.target.value) } })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Max Salary *</label>
                      <input
                        className="field-input"
                        type="number"
                        required
                        value={form.salary.max}
                        onChange={e => setForm({ ...form, salary: { ...form.salary, max: Number(e.target.value) } })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Currency *</label>
                      <input
                        className="field-input"
                        type="text"
                        required
                        value={form.salary.currency}
                        onChange={e => setForm({ ...form, salary: { ...form.salary, currency: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Gender Preference</label>
                      <select
                        className="field-input"
                        value={form.genderPreference}
                        onChange={e => setForm({ ...form, genderPreference: e.target.value })}
                      >
                        {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Min Age</label>
                      <input
                        className="field-input"
                        type="number"
                        value={form.ageRange?.min || ''}
                        onChange={e => setForm({ ...form, ageRange: { min: Number(e.target.value), max: form.ageRange?.max || 60 } })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Max Age</label>
                      <input
                        className="field-input"
                        type="number"
                        value={form.ageRange?.max || ''}
                        onChange={e => setForm({ ...form, ageRange: { min: form.ageRange?.min || 18, max: Number(e.target.value) } })}
                      />
                    </div>
                  </div>
                </section>

                {/* ─ 3. Description & Tags ─ */}
                <section>
                  <SectionDivider>Details & Tags</SectionDivider>
                  <div style={{ marginBottom: 14 }}>
                    <label className="field-label">Job Description *</label>
                    <textarea
                      className="field-input"
                      required
                      placeholder="Detailed job description..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      style={{ minHeight: 100, resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label className="field-label">Tags (comma separated)</label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="e.g. URGENT, GARMENT, EXPERIENCE PREFERRED"
                      value={(form.tags || []).join(', ')}
                      onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    />
                  </div>
                </section>

                {/* ─ 4. Requirements ─ */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <SectionDivider noMargin>Requirements</SectionDivider>
                    <button
                      type="button"
                      onClick={addReq}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                        background: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} strokeWidth={2.5} /> Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {form.requirements?.map((req, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="field-input"
                          type="text"
                          placeholder={`Requirement ${i + 1}`}
                          value={req}
                          onChange={e => updateReq(i, e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => removeReq(i)}
                          className="btn btn-danger btn-icon"
                          style={{ flexShrink: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {!form.requirements?.length && (
                      <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>No requirements added yet.</p>
                    )}
                  </div>
                </section>

                {/* ─ 5. Benefits ─ */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <SectionDivider noMargin>Benefits</SectionDivider>
                    <button
                      type="button"
                      onClick={addBen}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                        background: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} strokeWidth={2.5} /> Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {form.benefits?.map((ben, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <input
                            className="field-input"
                            type="text"
                            placeholder="Benefit title (e.g. Free Housing)"
                            value={ben.title}
                            onChange={e => updateBen(i, 'title', e.target.value)}
                          />
                          <input
                            className="field-input"
                            type="text"
                            placeholder="Short description"
                            value={ben.description}
                            onChange={e => updateBen(i, 'description', e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBen(i)}
                          className="btn btn-danger btn-icon"
                          style={{ flexShrink: 0, marginTop: 2 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {!form.benefits?.length && (
                      <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>No benefits added yet.</p>
                    )}
                  </div>
                </section>

              </div>

              {/* Modal footer */}
              <div
                className="modal-footer"
                style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid var(--border)' }}
              >
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={14} />
                  {editId ? 'Save Changes' : 'Post Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Small helper components ────────────────────────────────────────────────

function SectionDivider({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: noMargin ? 0 : 14,
      flex: noMargin ? 1 : undefined,
    }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {children}
      </h4>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

function Toggle({
  checked, onChange, label, color,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  color: string;
}) {
  return (
    <label
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onChange(!checked)}
    >
      <div style={{
        width: 40, height: 22, borderRadius: 999,
        background: checked ? color : 'var(--border-strong)',
        transition: 'background 0.2s',
        display: 'flex', alignItems: 'center',
        padding: '0 3px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
        }} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
    </label>
  );
}