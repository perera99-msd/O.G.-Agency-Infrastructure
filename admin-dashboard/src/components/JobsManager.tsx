// admin-dashboard/src/components/JobsManager.tsx
// Advanced Job Manager — OG Agency Admin Dashboard
// Uses admin index.css design system exactly (no Tailwind)
// All modal/layout fixes are scoped locally in this file via the <JobsManagerStyles /> block
// so no other page or component is affected.

import { useState, useEffect, useMemo } from 'react';
import type { JobOpening } from '../types';
import {
  Plus, Edit3, Trash2, Briefcase,
  X, Check, AlertCircle, Pin, PinOff, Calendar,
  TrendingUp, AlertTriangle, BarChart2,
  Search, Filter, RefreshCw, ChevronDown,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Construction", "Garment", "Healthcare", "Hospitality",
  "Manufacturing", "Engineering", "Retail", "Admin", "Accounts", "Other",
];
const GENDER_OPTIONS = ["Male", "Female", "No Preference"];

const DATE_RANGE_OPTIONS = [
  { label: "All time", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

const emptyForm: Omit<JobOpening, 'id'> = {
  title: '',
  country: '',
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  urgent: number;
}

interface JobsManagerProps {
  jobs: JobOpening[];
  onAdd: (job: Omit<JobOpening, 'id'>) => void;
  onUpdate: (id: string, job: Partial<JobOpening>) => void;
  onDelete: (id: string) => void;
  role?: 'super_user' | 'normal_user';
  availableDestinations: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpired(deadline: string) {
  return new Date(deadline) < new Date();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}



// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: noMargin ? 0 : 14, flex: noMargin ? 1 : undefined }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {children}
      </h4>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

function Toggle({ checked, onChange, label, color }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; color: string;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onChange(!checked)}>
      <div style={{
        width: 40, height: 22, borderRadius: 999,
        background: checked ? color : 'var(--border-strong)',
        transition: 'background 0.2s',
        display: 'flex', alignItems: 'center', padding: '0 3px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)', flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
        }} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
    </label>
  );
}

function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string;
}) {
  return (
    <div className="card stat-card card-clickable" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <div className="stat-icon-wrap" style={{ background: color + '18', border: `1px solid ${color}30` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p className="stat-label">{label}</p>
        <p className="stat-value" style={{ fontSize: 26, color: 'var(--text-primary)' }}>{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

function ExtendModal({ job, onConfirm, onClose }: {
  job: JobOpening; onConfirm: (newDeadline: string) => void; onClose: () => void;
}) {
  const [date, setDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--blue-bg)',
              border: '1px solid var(--blue-border)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Calendar size={16} style={{ color: 'var(--blue)' }} />
            </div>
            <h3 className="modal-title">Extend Deadline</h3>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
            Current deadline: <strong style={{ color: 'var(--text-primary)' }}>{formatDate(job.deadline)}</strong>
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 0 }}>
            Set a new closing date for <strong style={{ color: 'var(--text-primary)' }}>{job.title}</strong>
          </p>
          <div>
            <label className="field-label">New Deadline *</label>
            <input
              className="field-input"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => { if (date) onConfirm(date); }}
          >
            <Check size={14} /> Extend
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const JobsManager: React.FC<JobsManagerProps> = ({
  jobs, onAdd, onUpdate, onDelete, role = 'super_user', availableDestinations
}) => {

  // ── Modal state
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [extendJob, setExtendJob] = useState<JobOpening | null>(null);
  const [form, setForm] = useState<Omit<JobOpening, 'id'>>({ ...emptyForm });

  // ── Stats state (from dedicated endpoint)
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'urgent' | 'normal'>('all');
  const [filterDateRange, setFilterDateRange] = useState(0); // days, 0 = all time
  const [filtersOpen, setFiltersOpen] = useState(false);

  const countryOptions = useMemo(() => {
    const fromJobs = jobs.map((job) => job.country).filter(Boolean);
    return Array.from(new Set([...availableDestinations, ...fromJobs])).sort((a, b) => a.localeCompare(b));
  }, [availableDestinations, jobs]);

  // ── Fetch stats from dedicated endpoint
  const fetchStats = () => {
    setStatsLoading(true);
    fetch('http://localhost:5000/api/v1/admin/jobs/stats', {
      headers: { Authorization: 'Bearer dev-mock-token' },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) setStats(json.data);
        else {
          // Fallback: calculate from local jobs array until endpoint is ready
          setStats(calcLocalStats(jobs));
        }
      })
      .catch(() => setStats(calcLocalStats(jobs)))
      .finally(() => setStatsLoading(false));
  };

  useEffect(() => { fetchStats(); }, [jobs]);

  function calcLocalStats(j: JobOpening[]): Stats {
    return {
      total: j.length,
      active: j.filter(x => x.active && !isExpired(x.deadline)).length,
      inactive: j.filter(x => !x.active).length,
      expired: j.filter(x => isExpired(x.deadline)).length,
      urgent: j.filter(x => x.isUrgent).length,
    };
  }

  // ── Filtered jobs (client-side, hybrid-ready)
  const filtered = useMemo(() => {
    let result = [...jobs];

    // Status
    if (filterStatus === 'active') result = result.filter(j => j.active && !isExpired(j.deadline));
    if (filterStatus === 'inactive') result = result.filter(j => !j.active);
    if (filterStatus === 'expired') result = result.filter(j => isExpired(j.deadline));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.country.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filterCategory) result = result.filter(j => j.category === filterCategory);

    // Country
    if (filterCountry) result = result.filter(j => j.country === filterCountry);

    // Urgency
    if (filterUrgency === 'urgent') result = result.filter(j => j.isUrgent);
    if (filterUrgency === 'normal') result = result.filter(j => !j.isUrgent);

    // Date range (posted within N days)
    if (filterDateRange > 0) {
      const cutoff = Date.now() - filterDateRange * 24 * 60 * 60 * 1000;
      result = result.filter(j => new Date(j.deadline).getTime() > cutoff);
    }

    // Urgent always first
    result.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return 0;
    });

    return result;
  }, [jobs, search, filterStatus, filterCategory, filterCountry, filterUrgency, filterDateRange]);

  const activeFilterCount = [
    filterCategory, filterCountry,
    filterUrgency !== 'all' ? 'x' : '',
    filterDateRange > 0 ? 'x' : '',
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch('');
    setFilterStatus('all');
    setFilterCategory('');
    setFilterCountry('');
    setFilterUrgency('all');
    setFilterDateRange(0);
  };

  // ── Form handlers
  const openCreate = () => {
    if (!availableDestinations.length) return;
    setEditId(null);
    setForm({ ...emptyForm, country: availableDestinations[0] });
    setOpen(true);
  };
  const openEdit = (j: JobOpening) => {
    setEditId(j.id);
    const { id, ...rest } = j;
    setForm({
      ...rest,
      tags: rest.tags || [],
      requirements: rest.requirements?.length ? rest.requirements : [''],
      benefits: rest.benefits || [],
      ageRange: rest.ageRange || { min: 18, max: 60 },
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.country) return;
    const submission = {
      ...form,
      requirements: form.requirements?.filter(r => r.trim() !== '') || [],
      benefits: form.benefits?.filter(b => b.title.trim() !== '' && b.description.trim() !== '') || [],
    };
    if (editId) onUpdate(editId, submission);
    else onAdd(submission);
    setOpen(false);
  };

  // Requirements helpers
  const addReq = () => setForm({ ...form, requirements: [...(form.requirements || []), ''] });
  const updateReq = (i: number, val: string) => {
    const arr = [...(form.requirements || [])]; arr[i] = val;
    setForm({ ...form, requirements: arr });
  };
  const removeReq = (i: number) => {
    const arr = [...(form.requirements || [])]; arr.splice(i, 1);
    setForm({ ...form, requirements: arr });
  };

  // Benefits helpers
  const addBen = () => setForm({ ...form, benefits: [...(form.benefits || []), { title: '', description: '' }] });
  const updateBen = (i: number, field: 'title' | 'description', val: string) => {
    const arr = [...(form.benefits || [])]; arr[i] = { ...arr[i], [field]: val };
    setForm({ ...form, benefits: arr });
  };
  const removeBen = (i: number) => {
    const arr = [...(form.benefits || [])]; arr.splice(i, 1);
    setForm({ ...form, benefits: arr });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="animate-in">

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Job Openings</h2>
          <p className="page-subtitle">Post, moderate, and manage all employment vacancies.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={fetchStats}
            title="Refresh stats"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          {role === 'super_user' && (
            <button className="btn btn-primary" onClick={openCreate} disabled={!availableDestinations.length}>
              <Plus size={14} strokeWidth={2.5} /> Post Vacancy
            </button>
          )}
        </div>
      </div>

      {!availableDestinations.length && (
        <div className="card" style={{ padding: '12px 14px', marginBottom: 16, borderColor: 'var(--amber-border)', background: 'var(--amber-bg)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            No active destinations found. Create and activate a destination first, then you can post jobs.
          </p>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <KpiCard
          icon={<Briefcase size={18} />}
          label="Total Listings"
          value={statsLoading ? '—' : (stats?.total ?? 0)}
          sub="all time"
          color="var(--accent)"
        />
        <KpiCard
          icon={<TrendingUp size={18} />}
          label="Active Jobs"
          value={statsLoading ? '—' : (stats?.active ?? 0)}
          sub="live on portal"
          color="var(--green)"
        />
        <KpiCard
          icon={<AlertTriangle size={18} />}
          label="Expired"
          value={statsLoading ? '—' : (stats?.expired ?? 0)}
          sub="past deadline"
          color="var(--red)"
        />
        <KpiCard
          icon={<BarChart2 size={18} />}
          label="Urgent"
          value={statsLoading ? '—' : (stats?.urgent ?? 0)}
          sub="pinned to top"
          color="var(--blue)"
        />
      </div>

      {/* ── Search & Filters bar ── */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <Search size={14} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-faint)',
            }} />
            <input
              className="field-input"
              type="text"
              placeholder="Search by title, category, country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, marginBottom: 0 }}
            />
          </div>

          {/* Status tabs */}
          <div className="filter-tabs">
            {(['all', 'active', 'inactive', 'expired'] as const).map(s => (
              <button
                key={s}
                className={`filter-tab${filterStatus === s ? ' active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Advanced filters toggle */}
          <button
            className={`btn ${filtersOpen ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFiltersOpen(v => !v)}
            style={{ gap: 6 }}
          >
            <Filter size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                background: 'var(--red)', color: 'white',
                borderRadius: 999, fontSize: 10, fontWeight: 700,
                padding: '1px 6px', marginLeft: 2,
              }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={12} style={{ transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {activeFilterCount > 0 && (
            <button className="btn btn-ghost" onClick={resetFilters} style={{ fontSize: 12 }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Advanced filter row */}
        {filtersOpen && (
          <div className="grid-4" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div>
              <label className="field-label">Category</label>
              <select
                className="field-input"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Country</label>
              <select
                className="field-input"
                value={filterCountry}
                onChange={e => setFilterCountry(e.target.value)}
              >
                <option value="">All countries</option>
                {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Urgency</label>
              <select
                className="field-input"
                value={filterUrgency}
                onChange={e => setFilterUrgency(e.target.value as 'all' | 'urgent' | 'normal')}
              >
                <option value="all">All</option>
                <option value="urgent">Urgent only</option>
                <option value="normal">Non-urgent</option>
              </select>
            </div>
            <div>
              <label className="field-label">Date Posted</label>
              <select
                className="field-input"
                value={filterDateRange}
                onChange={e => setFilterDateRange(Number(e.target.value))}
              >
                {DATE_RANGE_OPTIONS.map(o => (
                  <option key={o.days} value={o.days}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Results count ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing <span style={{ color: 'var(--text-primary)' }}>{filtered.length}</span> of{' '}
          <span style={{ color: 'var(--text-primary)' }}>{jobs.length}</span> vacancies
        </p>
      </div>

      {/* ── Job list ── */}
      {filtered.length === 0 ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="empty-state">
            <div className="empty-state-icon"><Briefcase size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No vacancies found</p>
            <p className="empty-state-desc">Try adjusting your filters, or post a new vacancy.</p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 4 }}>
              <Plus size={13} strokeWidth={2.5} /> Post Vacancy
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-3" style={{ gap: 20 }}>
          {filtered.map((job) => {
            const expired = isExpired(job.deadline);
            const days = daysUntil(job.deadline);
            const expiringSoon = !expired && days <= 7;

            return (
              <div
                key={job.id}
                className="card card-clickable"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: job.isUrgent ? '4px solid var(--blue)' : expired ? '4px solid var(--red)' : '4px solid var(--accent)',
                  padding: '20px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  background: 'var(--surface)',
                  opacity: expired ? 0.75 : 1,
                }}
              >
                {/* Card Header: Country, Urgency & Status Tags */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{job.country}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {job.isUrgent && <span className="tag tag-blue" style={{ fontSize: 9, padding: '1px 5px' }}>URGENT</span>}
                    {expired ? (
                      <span className="tag tag-red" style={{ fontSize: 9, padding: '1px 5px' }}>EXPIRED</span>
                    ) : job.active ? (
                      <span className="tag tag-green" style={{ fontSize: 9, padding: '1px 5px' }}>ACTIVE</span>
                    ) : (
                      <span className="tag tag-neutral" style={{ fontSize: 9, padding: '1px 5px' }}>INACTIVE</span>
                    )}
                  </div>
                </div>

                {/* Job Title & Category */}
                <div style={{ flex: 1, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
                    {job.title}
                  </h4>
                  <span className="tag tag-neutral" style={{ fontSize: 10, padding: '2px 6px' }}>{job.category}</span>

                  <p className="line-clamp-2" style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.4 }}>
                    {job.description || "No description provided."}
                  </p>
                </div>

                {/* Salary & Deadline details */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)' }}>SALARY</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--green)' }}>
                      {job.salary?.min?.toLocaleString()} – {job.salary?.max?.toLocaleString()} {job.salary?.currency}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)' }}>DEADLINE</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: expired ? 'var(--red)' : expiringSoon ? 'var(--amber)' : 'var(--text-secondary)' }}>
                      {expired ? `Closed ${formatDate(job.deadline)}` : `${formatDate(job.deadline)}`}
                    </span>
                  </div>

                  {/* Metadata highlights (Age limit, Gender, Tags) */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {job.genderPreference && job.genderPreference !== 'No Preference' && (
                      <span style={{ fontSize: 10, background: 'rgba(99, 102, 241, 0.05)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                        {job.genderPreference}
                      </span>
                    )}
                    {job.ageRange && (
                      <span style={{ fontSize: 10, background: 'rgba(59, 130, 246, 0.05)', color: 'var(--blue)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                        Age: {job.ageRange.min}-{job.ageRange.max}
                      </span>
                    )}
                    {job.requirements && job.requirements.length > 0 && (
                      <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.05)', color: 'var(--green)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                        {job.requirements.length} Req{job.requirements.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Action buttons */}
                {role === 'super_user' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    <button
                      className="btn btn-ghost btn-icon"
                      title={job.isUrgent ? 'Remove urgent' : 'Mark as urgent'}
                      onClick={() => onUpdate(job.id, { isUrgent: !job.isUrgent })}
                      style={{ color: job.isUrgent ? 'var(--blue)' : 'var(--text-faint)', width: 32, height: 32 }}
                    >
                      {job.isUrgent ? <PinOff size={13} /> : <Pin size={13} />}
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      title="Extend deadline"
                      onClick={() => setExtendJob(job)}
                      style={{ color: 'var(--amber)', width: 32, height: 32 }}
                    >
                      <Calendar size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      title="Edit"
                      onClick={() => openEdit(job)}
                      style={{ width: 32, height: 32 }}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      className="btn btn-icon"
                      title="Delete"
                      onClick={() => setDeleteId(job.id)}
                      style={{ color: 'var(--red)', background: 'var(--red-bg)', border: '1px solid var(--red-border)', width: 32, height: 32 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* ── Extend Deadline Modal ── */}
      {extendJob && (
        <ExtendModal
          job={extendJob}
          onConfirm={newDeadline => {
            onUpdate(extendJob.id, { deadline: newDeadline });
            setExtendJob(null);
          }}
          onClose={() => setExtendJob(null)}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}>
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
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                This action cannot be undone. The listing will be removed from the public portal immediately.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
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
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal" style={{ maxWidth: 800, width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Job Posting' : 'Post New Vacancy'}</h3>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {/* 1 · Basic Info */}
                <section>
                  <SectionDivider>Basic Information</SectionDivider>
                  <div className="grid-3" style={{ marginBottom: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="field-label">Job Title *</label>
                      <input className="field-input" type="text" required
                        placeholder="e.g. Senior Industrial Welder"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Destination Country *</label>
                      <select className="field-input" value={form.country}
                        onChange={e => setForm({ ...form, country: e.target.value })}>
                        {Array.from(new Set([form.country, ...availableDestinations].filter(Boolean))).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Industry Category *</label>
                      <select className="field-input" value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Application Deadline *</label>
                      <input className="field-input" type="date" required value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <Toggle checked={form.active} onChange={v => setForm({ ...form, active: v })}
                      label="Active / Published" color="var(--green)" />
                    <Toggle checked={form.isUrgent} onChange={v => setForm({ ...form, isUrgent: v })}
                      label="Mark as Urgent" color="var(--blue)" />
                  </div>
                </section>

                {/* 2 · Salary & Demographics */}
                <section>
                  <SectionDivider>Salary & Demographics</SectionDivider>
                  <div className="grid-3">
                    <div>
                      <label className="field-label">Min Salary *</label>
                      <input className="field-input" type="number" required value={form.salary.min}
                        onChange={e => setForm({ ...form, salary: { ...form.salary, min: Number(e.target.value) } })} />
                    </div>
                    <div>
                      <label className="field-label">Max Salary *</label>
                      <input className="field-input" type="number" required value={form.salary.max}
                        onChange={e => setForm({ ...form, salary: { ...form.salary, max: Number(e.target.value) } })} />
                    </div>
                    <div>
                      <label className="field-label">Currency *</label>
                      <input className="field-input" type="text" required value={form.salary.currency}
                        onChange={e => setForm({ ...form, salary: { ...form.salary, currency: e.target.value } })} />
                    </div>
                    <div>
                      <label className="field-label">Gender Preference</label>
                      <select className="field-input" value={form.genderPreference}
                        onChange={e => setForm({ ...form, genderPreference: e.target.value })}>
                        {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Min Age</label>
                      <input className="field-input" type="number" value={form.ageRange?.min || ''}
                        onChange={e => setForm({ ...form, ageRange: { min: Number(e.target.value), max: form.ageRange?.max || 60 } })} />
                    </div>
                    <div>
                      <label className="field-label">Max Age</label>
                      <input className="field-input" type="number" value={form.ageRange?.max || ''}
                        onChange={e => setForm({ ...form, ageRange: { min: form.ageRange?.min || 18, max: Number(e.target.value) } })} />
                    </div>
                  </div>
                </section>

                {/* 3 · Description & Tags */}
                <section>
                  <SectionDivider>Details & Tags</SectionDivider>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label className="field-label">Job Description *</label>
                      <textarea className="field-input" required placeholder="Detailed job description..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        style={{ minHeight: 100, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label className="field-label">Tags (comma separated)</label>
                      <input className="field-input" type="text"
                        placeholder="e.g. URGENT, GARMENT, EXPERIENCE PREFERRED"
                        value={(form.tags || []).join(', ')}
                        onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      />
                    </div>
                  </div>
                </section>

                {/* 4 · Requirements */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <SectionDivider noMargin>Requirements</SectionDivider>
                    <button type="button" onClick={addReq} style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
                      fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)',
                      border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8,
                      padding: '5px 12px', cursor: 'pointer', flexShrink: 0, marginLeft: 12,
                    }}>
                      <Plus size={12} strokeWidth={2.5} /> Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {form.requirements?.map((req, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input className="field-input" type="text" style={{ flex: 1 }}
                          placeholder={`Requirement ${i + 1}`} value={req}
                          onChange={e => updateReq(i, e.target.value)} />
                        <button type="button" onClick={() => removeReq(i)}
                          className="btn btn-danger btn-icon" style={{ flexShrink: 0 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {!form.requirements?.length && (
                      <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>No requirements added yet.</p>
                    )}
                  </div>
                </section>

                {/* 5 · Benefits */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <SectionDivider noMargin>Benefits</SectionDivider>
                    <button type="button" onClick={addBen} style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
                      fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)',
                      border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8,
                      padding: '5px 12px', cursor: 'pointer', flexShrink: 0, marginLeft: 12,
                    }}>
                      <Plus size={12} strokeWidth={2.5} /> Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {form.benefits?.map((ben, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div className="grid-2" style={{ flex: 1, gap: 8 }}>
                          <input className="field-input" type="text"
                            placeholder="Benefit title (e.g. Free Housing)"
                            value={ben.title} onChange={e => updateBen(i, 'title', e.target.value)} />
                          <input className="field-input" type="text"
                            placeholder="Short description"
                            value={ben.description} onChange={e => updateBen(i, 'description', e.target.value)} />
                        </div>
                        <button type="button" onClick={() => removeBen(i)}
                          className="btn btn-danger btn-icon" style={{ flexShrink: 0, marginTop: 2 }}>
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
              <div className="modal-footer">
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

    </>
  );
};