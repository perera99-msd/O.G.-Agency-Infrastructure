// admin-dashboard/src/components/JobsManager.tsx
// Advanced Job Manager — OG Agency Admin Dashboard
// Uses admin index.css design system exactly (no Tailwind)
// All modal/layout fixes are scoped locally in this file via the <JobsManagerStyles /> block
// so no other page or component is affected.

import { useState, useEffect, useMemo } from 'react';
import type { JobOpening } from '../types';
import {
  Plus, Edit3, Trash2, MapPin, DollarSign, Briefcase,
  X, Check, AlertCircle, Pin, PinOff, Calendar,
  TrendingUp, Clock, AlertTriangle, BarChart2,
  Search, Filter, RefreshCw, ChevronDown,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  "Bosnia","Cyprus","Germany","Israel","Jordan","Kuwait",
  "Malaysia","Oman","Qatar","Romania","Russia","Saudi Arabia","UAE",
];
const CATEGORIES = [
  "Construction","Garment","Healthcare","Hospitality",
  "Manufacturing","Engineering","Retail","Admin","Accounts","Other",
];
const GENDER_OPTIONS = ["Male", "Female", "No Preference"];

const DATE_RANGE_OPTIONS = [
  { label: "All time",   days: 0   },
  { label: "Last 7 days", days: 7  },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

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
  onAdd:    (job: Omit<JobOpening, 'id'>) => void;
  onUpdate: (id: string, job: Partial<JobOpening>) => void;
  onDelete: (id: string) => void;
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

// ─── Scoped local styles (kept inside this file only) ─────────────────────────
// Fixes: double-scroll modals, flat/hardcoded footer background, unclipped
// rounded corners, hard-locked 4-col KPI grid, filter bar wrap behaviour,
// and gives the "urgent" pin button a proper active/tinted state.
// Class names are prefixed `jm-` so they can never collide with or affect
// index.css rules used elsewhere in the dashboard.

function JobsManagerStyles() {
  return (
    <style>{`
      /* ---- Modal shell: single scroll region, clipped corners ---- */
      .jm-overlay {
        position: fixed;
        inset: 0;
        background:
          radial-gradient(at 50% 0%, rgba(30, 41, 59, 0.55) 0%, rgba(15, 23, 42, 0.72) 100%);
        backdrop-filter: blur(10px) saturate(120%);
        -webkit-backdrop-filter: blur(10px) saturate(120%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 500;
        padding: 24px;
        animation: jm-fadeIn 0.2s ease;
      }

      .jm-modal {
        background: rgba(255, 255, 255, 0.97);
        backdrop-filter: blur(30px) saturate(180%);
        -webkit-backdrop-filter: blur(30px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: var(--radius-xl, 24px);
        width: 100%;
        max-width: 540px;
        max-height: 88vh;
        box-shadow: 0 40px 80px -16px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.06);
        animation: jm-slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .jm-modal > form {
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
      }

      .jm-modal-header {
        padding: 22px 28px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        border-bottom: 1px solid var(--border);
        gap: 12px;
      }

      .jm-modal-title {
        font-size: 18px;
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.4px;
      }

      .jm-modal-close {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.05);
        border: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        transition: all 0.15s;
        flex-shrink: 0;
      }
      .jm-modal-close:hover {
        background: var(--red-bg);
        color: var(--red);
        border-color: var(--red-border);
      }

      .jm-modal-body {
        padding: 24px 28px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
      }

      .jm-modal-footer {
        padding: 18px 28px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        flex-shrink: 0;
      }

      @keyframes jm-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes jm-slideUp {
        from { opacity: 0; transform: translateY(20px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* ---- KPI grid: responsive instead of a hard 4-col lock ---- */
      .jm-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-bottom: 28px;
      }

      /* ---- Filter/search bar: clean wrap on narrow widths ---- */
      .jm-filters-row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }
      .jm-search-wrap {
        position: relative;
        flex: 1 1 240px;
        min-width: 200px;
      }

      @media (max-width: 860px) {
        .jm-search-wrap { flex-basis: 100%; }
      }

      .jm-adv-filters {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }
      @media (max-width: 900px) {
        .jm-adv-filters { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 520px) {
        .jm-adv-filters { grid-template-columns: 1fr; }
      }

      /* ---- Form section grids inside the modal ---- */
      .jm-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
      @media (max-width: 640px) {
        .jm-grid-3 { grid-template-columns: 1fr 1fr; }
      }

      .jm-benefit-grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      @media (max-width: 560px) {
        .jm-benefit-grid { grid-template-columns: 1fr; }
      }

      /* ---- Urgent pin button: filled state instead of just a color swap ---- */
      .jm-pin-btn {
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .jm-pin-btn.jm-pin-active {
        background: var(--blue-bg);
        border: 1px solid var(--blue-border);
        color: var(--blue) !important;
      }
      .jm-pin-btn.jm-pin-inactive {
        background: transparent;
        border: 1px solid transparent;
      }
      .jm-pin-btn:hover {
        transform: translateY(-1px);
      }
    `}</style>
  );
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
    <div className="card stat-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
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
    <div className="jm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="jm-modal" style={{ maxWidth: 420 }}>
        <div className="jm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--blue-bg)',
              border: '1px solid var(--blue-border)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Calendar size={16} style={{ color: 'var(--blue)' }} />
            </div>
            <h3 className="jm-modal-title">Extend Deadline</h3>
          </div>
          <button className="jm-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="jm-modal-body">
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
        <div className="jm-modal-footer">
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
  jobs, onAdd, onUpdate, onDelete,
}) => {

  // ── Modal state
  const [open, setOpen]           = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [extendJob, setExtendJob] = useState<JobOpening | null>(null);
  const [form, setForm]           = useState<Omit<JobOpening, 'id'>>({ ...emptyForm });

  // ── Stats state (from dedicated endpoint)
  const [stats, setStats]           = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Filter state
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCountry, setFilterCountry]   = useState('');
  const [filterUrgency, setFilterUrgency]   = useState<'all' | 'urgent' | 'normal'>('all');
  const [filterDateRange, setFilterDateRange] = useState(0); // days, 0 = all time
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      total:    j.length,
      active:   j.filter(x => x.active && !isExpired(x.deadline)).length,
      inactive: j.filter(x => !x.active).length,
      expired:  j.filter(x => isExpired(x.deadline)).length,
      urgent:   j.filter(x => x.isUrgent).length,
    };
  }

  // ── Filtered jobs (client-side, hybrid-ready)
  const filtered = useMemo(() => {
    let result = [...jobs];

    // Status
    if (filterStatus === 'active')   result = result.filter(j => j.active && !isExpired(j.deadline));
    if (filterStatus === 'inactive') result = result.filter(j => !j.active);
    if (filterStatus === 'expired')  result = result.filter(j => isExpired(j.deadline));

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
  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setOpen(true); };
  const openEdit   = (j: JobOpening) => {
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="animate-in">
      <JobsManagerStyles />

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
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Post Vacancy
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="jm-kpi-grid">
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
        <div className="jm-filters-row">

          {/* Search */}
          <div className="jm-search-wrap">
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
          <div className="jm-adv-filters">
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
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
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
      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Briefcase size={20} strokeWidth={1.5} /></div>
            <p className="empty-state-title">No vacancies found</p>
            <p className="empty-state-desc">Try adjusting your filters, or post a new vacancy.</p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 4 }}>
              <Plus size={13} strokeWidth={2.5} /> Post Vacancy
            </button>
          </div>
        ) : (
          filtered.map((job, i) => {
            const expired = isExpired(job.deadline);
            const days    = daysUntil(job.deadline);
            const expiringSoon = !expired && days <= 7;

            return (
              <div
                key={job.id}
                className="data-row"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  opacity: expired ? 0.65 : 1,
                  borderLeft: job.isUrgent ? '3px solid var(--blue)' : expired ? '3px solid var(--red)' : '3px solid transparent',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: expired ? 'var(--red-bg)' : job.isUrgent ? 'var(--blue-bg)' : 'var(--purple-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Briefcase size={16} strokeWidth={1.8} style={{
                    color: expired ? 'var(--red)' : job.isUrgent ? 'var(--blue)' : 'var(--purple)',
                  }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {job.title}
                    </p>
                    {job.isUrgent  && <span className="tag tag-blue">URGENT</span>}
                    {expired       && <span className="tag tag-red">EXPIRED</span>}
                    {!expired && !job.active && <span className="tag tag-neutral">Inactive</span>}
                    {!expired && job.active  && <span className="tag tag-green">Active</span>}
                    {expiringSoon  && <span className="tag tag-amber">Closes in {days}d</span>}
                    <span className="tag tag-neutral">{job.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                      <MapPin size={11} /> {job.country}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                      <DollarSign size={11} />
                      {job.salary?.min?.toLocaleString()} – {job.salary?.max?.toLocaleString()} {job.salary?.currency}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: expired ? 'var(--red)' : 'var(--text-muted)' }}>
                      <Clock size={11} />
                      {expired ? `Expired ${formatDate(job.deadline)}` : `Closes ${formatDate(job.deadline)}`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="data-row-actions">
                  {/* Pin / Unpin urgent */}
                  <button
                    className={`btn btn-ghost btn-icon jm-pin-btn ${job.isUrgent ? 'jm-pin-active' : 'jm-pin-inactive'}`}
                    title={job.isUrgent ? 'Remove urgent' : 'Mark as urgent'}
                    onClick={() => onUpdate(job.id, { isUrgent: !job.isUrgent })}
                    style={{ color: job.isUrgent ? 'var(--blue)' : 'var(--text-faint)' }}
                  >
                    {job.isUrgent ? <PinOff size={14} /> : <Pin size={14} />}
                  </button>

                  {/* Extend deadline */}
                  <button
                    className="btn btn-ghost btn-icon"
                    title="Extend deadline"
                    onClick={() => setExtendJob(job)}
                    style={{ color: 'var(--amber)' }}
                  >
                    <Calendar size={14} />
                  </button>

                  {/* Edit */}
                  <button
                    className="btn btn-ghost btn-icon"
                    title="Edit"
                    onClick={() => openEdit(job)}
                  >
                    <Edit3 size={14} strokeWidth={2} />
                  </button>

                  {/* Delete */}
                  <button
                    className="btn btn-danger btn-icon"
                    title="Delete"
                    onClick={() => setDeleteId(job.id)}
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })
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
        <div className="jm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}>
          <div className="jm-modal" style={{ maxWidth: 420 }}>
            <div className="jm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--red-bg)',
                  border: '1px solid var(--red-border)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <AlertCircle size={16} style={{ color: 'var(--red)' }} />
                </div>
                <h3 className="jm-modal-title">Delete Vacancy?</h3>
              </div>
              <button className="jm-modal-close" onClick={() => setDeleteId(null)}>×</button>
            </div>
            <div className="jm-modal-body">
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                This action cannot be undone. The listing will be removed from the public portal immediately.
              </p>
            </div>
            <div className="jm-modal-footer">
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
        <div className="jm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="jm-modal" style={{ maxWidth: 800, width: '90%' }}>
            <div className="jm-modal-header">
              <h3 className="jm-modal-title">{editId ? 'Edit Job Posting' : 'Post New Vacancy'}</h3>
              <button className="jm-modal-close" onClick={() => setOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="jm-modal-body">

                {/* 1 · Basic Info */}
                <section>
                  <SectionDivider>Basic Information</SectionDivider>
                  <div className="jm-grid-3" style={{ marginBottom: 16 }}>
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
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  <div className="jm-grid-3">
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
                        <div className="jm-benefit-grid">
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
              <div className="jm-modal-footer">
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