import { useState } from 'react';
import type { JobOpening } from '../types';
import { Plus, Edit3, Trash2, MapPin, DollarSign, Briefcase } from 'lucide-react';

interface JobsManagerProps {
  jobs: JobOpening[];
  onAdd: (job: Omit<JobOpening, 'id'>) => void;
  onUpdate: (id: string, job: Partial<JobOpening>) => void;
  onDelete: (id: string) => void;
}

const emptyForm: {
  title: string; country: string; category: string;
  salary: string; positionsAvailable: number; status: 'active' | 'filled' | 'draft';
} = {
  title: '', country: 'Romania', category: 'Heavy Engineering',
  salary: '€1,500 / mo + Benefits', positionsAvailable: 10, status: 'active',
};

const statusColor = (s: string) =>
  s === 'active' ? 'tag-green' : s === 'filled' ? 'tag-blue' : 'tag-neutral';

export const JobsManager: React.FC<JobsManagerProps> = ({
  jobs, onAdd, onUpdate, onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [filter, setFilter] = useState<'all' | 'active' | 'filled' | 'draft'>('all');

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (j: JobOpening) => {
    setEditId(j.id);
    setForm({ title: j.title, country: j.country, category: j.category, salary: j.salary, positionsAvailable: j.positionsAvailable, status: j.status });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editId) onUpdate(editId, form);
    else onAdd(form);
    setOpen(false);
  };

  const filtered = jobs.filter(j => filter === 'all' || j.status === filter);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Job Openings</h2>
          <p className="page-subtitle">Post and manage employment vacancies across all corridors.</p>
        </div>
        <div className="page-actions">
          <div className="filter-tabs">
            {(['all', 'active', 'filled', 'draft'] as const).map(f => (
              <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}{' '}
                <span style={{ opacity: 0.6 }}>({f === 'all' ? jobs.length : jobs.filter(j => j.status === f).length})</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Post Vacancy
          </button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Briefcase size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No vacancies found</p>
            <p className="empty-state-desc">Try changing the filter, or post a new vacancy.</p>
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
                width: 38, height: 38, borderRadius: 9, background: 'var(--purple-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Briefcase size={16} strokeWidth={1.8} style={{ color: 'var(--purple)' }} />
              </div>

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</p>
                  <span className={`tag ${statusColor(job.status)}`}>{job.status}</span>
                  <span className="tag tag-neutral">{job.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {job.country}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                    <DollarSign size={11} /> {job.salary}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {job.positionsAvailable} positions
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="data-row-actions">
                <button className="btn btn-ghost btn-icon" onClick={() => openEdit(job)} title="Edit">
                  <Edit3 size={14} strokeWidth={2} />
                </button>
                <button className="btn btn-danger btn-icon" onClick={() => onDelete(job.id)} title="Delete">
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Job Posting' : 'Post New Vacancy'}</h3>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div>
                  <label className="field-label">Job Title *</label>
                  <input className="field-input" type="text" required placeholder="e.g. Senior Industrial Welder (MIG/TIG)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="field-row">
                  <div>
                    <label className="field-label">Destination Country</label>
                    <select className="field-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                      <option>Romania</option>
                      <option>Bosnia & Herzegovina</option>
                      <option>Russia</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Industry Sector</label>
                    <input className="field-input" type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="field-label">Salary & Benefits</label>
                  <input className="field-input" type="text" placeholder="e.g. €1,600 / mo + Free Accommodation" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                </div>
                <div className="field-row">
                  <div>
                    <label className="field-label">Positions Available</label>
                    <input className="field-input" type="number" value={form.positionsAvailable} onChange={e => setForm({ ...form, positionsAvailable: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="field-label">Status</label>
                    <select className="field-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                      <option value="active">Active</option>
                      <option value="filled">Filled</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Post Vacancy'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
