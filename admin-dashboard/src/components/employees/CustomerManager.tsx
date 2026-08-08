import React, { useMemo, useState } from 'react';
import { RegisterEmployee } from './RegisterEmployee';
import { EmployeeStatus, renderCountryFlagTag } from './EmployeeStatus';
import type { Employee, AdminUser } from '../../types';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { 
  Search, Filter, X, Printer, Edit2, Trash2, Eye, CheckCircle2, Download, UserRound, AlertTriangle, Briefcase, Calendar, MapPin, Mail, Phone, UserCheck, CreditCard, Award, HeartHandshake, ShieldCheck, GraduationCap, Building2, Users, FileCode2, ExternalLink
} from 'lucide-react';

interface Props {
  employees: Employee[];
  currentUser: AdminUser | null;
  addEmployee: (data: Record<string, unknown>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  updateEmployeeMedical: (id: string, status: any, center?: string, date?: string, notes?: string) => Promise<void>;
  deleteEmployeeApi?: (id: string) => Promise<void>;
}

interface Filters {
  country: string;
  status: string;
  medicalStatus: string;
  agency: string;
  jobCategory: string;
}

const defaultFilters: Filters = { country: '', status: '', medicalStatus: '', agency: '', jobCategory: '' };

export const CustomerManager: React.FC<Props> = ({ employees, updateEmployee, deleteEmployeeApi }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'tracking' | 'edit'>('details');
  
  const [confirmDelete, setConfirmDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview Modal for attached docs
  const [previewDocUrl, setPreviewDocUrl] = useState<{ url: string; name: string } | null>(null);

  // Dynamic Filter Options based on database records
  const uniqueCountries = useMemo(() => Array.from(new Set(employees.map(e => e.countryApplied).filter(Boolean))).sort(), [employees]);
  const uniqueAgencies = useMemo(() => Array.from(new Set(employees.map(e => e.sourceAgency).filter(Boolean))).sort(), [employees]);
  const uniqueCategories = useMemo(() => Array.from(new Set(employees.map(e => e.jobCategory).filter(Boolean))).sort(), [employees]);

  // Filter Logic
  const filtered = useMemo(() => {
    let result = [...employees].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
    
    if (filters.country) result = result.filter(e => e.countryApplied === filters.country);
    if (filters.status) result = result.filter(e => e.status === filters.status);
    if (filters.medicalStatus) result = result.filter(e => e.medicalStatus === filters.medicalStatus);
    if (filters.agency) result = result.filter(e => e.sourceAgency === filters.agency);
    if (filters.jobCategory) result = result.filter(e => e.jobCategory === filters.jobCategory);

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(e => 
        (e.fullName || '').toLowerCase().includes(q) ||
        (e.passportNumber || '').toLowerCase().includes(q) ||
        (e.nicNumber || '').toLowerCase().includes(q) ||
        (e.phone1 || '').includes(q)
      );
    }
    return result;
  }, [employees, query, filters]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const resetFilters = () => setFilters(defaultFilters);

  // Actions
  const openView = (emp: Employee, tab: 'details' | 'tracking' | 'edit' = 'details', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelected(emp);
    setActiveModalTab(tab);
    setShowModal(true);
  };

  const handleToggleActive = async (emp: Employee, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await updateEmployee(emp.id, { status: emp.status === 'active' ? 'archived' : 'active' });
    } catch (err) {
      console.error('Failed to toggle status', err);
      alert('Failed to update status.');
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      if (deleteEmployeeApi) {
        await deleteEmployeeApi(confirmDelete.id);
      } else {
        await deleteDoc(doc(db, 'employees', confirmDelete.id));
      }
      setIsDeleting(false);
      if (selected?.id === confirmDelete.id) {
        setSelected(null);
        setShowModal(false);
      }
      setConfirmDelete(null);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete customer.');
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Passport', 'NIC', 'Country', 'Agency', 'Job Category', 'Medical Status', 'Status', 'Phone 1', 'Email', 'Registered At'];
    const rows = filtered.map(e => [
      e.fullName, e.passportNumber, e.nicNumber || '', e.countryApplied, e.sourceAgency || '', 
      e.jobCategory || '', e.medicalStatus, e.status === 'active' ? 'Active' : 'Disabled', e.phone1 || '', e.email || '', 
      e.registeredAt ? new Date(e.registeredAt).toLocaleDateString() : ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openDocumentInNewTab = (url: string) => {
    if (url.startsWith('data:')) {
      try {
        const [header, base64Data] = url.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return;
      } catch (err) {
        console.error('Error opening Base64 document in new tab:', err);
      }
    }
    window.open(url, '_blank');
  };

  const handleDownloadDocument = (url: string, title: string) => {
    if (url.startsWith('data:')) {
      try {
        const [header] = url.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        const extension = mimeType.includes('pdf') ? 'pdf' : mimeType.includes('png') ? 'png' : 'jpg';
        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error('Error downloading document:', err);
      }
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getProgressString = (emp: Employee) => {
    if (!emp.tracking || emp.tracking.length === 0) return '0/0';
    const completed = emp.tracking.filter(t => t.completed).length;
    return `${completed}/${emp.tracking.length}`;
  };

  const CardSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.25rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{icon}</div>
        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
      </div>
      {children}
    </div>
  );

  const InfoGridItem: React.FC<{ label: string; value?: string | number | null; icon?: React.ReactNode; fullWidth?: boolean }> = ({ label, value, icon, fullWidth }) => (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'span 1', marginBottom: '0.5rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: value ? '#0f172a' : '#94a3b8' }}>
        {value !== null && value !== undefined && value !== '' ? String(value) : '—'}
      </div>
    </div>
  );

  const DocCard: React.FC<{ label: string; url?: string | null; name?: string | null }> = ({ label, url, name }) => (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: url ? '#0f172a' : '#94a3b8', wordBreak: 'break-all' }}>
          {name || (url ? 'Attached Document' : 'Not Uploaded')}
        </div>
      </div>
      {url ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            className="emp-btn-outline" 
            onClick={() => setPreviewDocUrl({ url, name: name || label })}
            style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}
          >
            <Eye size={12} /> View
          </button>
          <button 
            type="button" 
            className="emp-btn-outline" 
            onClick={() => handleDownloadDocument(url, name || label)}
            style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}
          >
            <Download size={12} /> Download
          </button>
        </div>
      ) : (
        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No file attached</span>
      )}
    </div>
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="emp-page-title">Customer Manager</h2>
          <p className="emp-page-sub">Comprehensive hub to search, filter, edit, print, and track all customers.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="emp-btn-outline" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Unified Search & Filter Bar */}
      <div className="emp-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="emp-search-box-wrap" style={{ flex: '1 1 300px', margin: 0 }}>
            <div className="emp-search-icon"><Search size={16} /></div>
            <input
              type="text"
              className="emp-search-input"
              placeholder="Search by name, passport, NIC, or phone..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <button className="emp-search-clear" onClick={() => setQuery('')}><X size={14} /></button>}
          </div>
          <button 
            className={`emp-btn-outline ${showFilters || hasActiveFilters ? 'emp-btn-primary' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Filter size={16} /> {hasActiveFilters ? 'Filters Active' : 'Advanced Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="emp-filter-grid" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="emp-form-group">
              <label>Country</label>
              <select className="emp-form-control" value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })}>
                <option value="">All Countries</option>
                {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="emp-form-group">
              <label>Status</label>
              <select className="emp-form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Disabled</option>
              </select>
            </div>
            <div className="emp-form-group">
              <label>Medical</label>
              <select className="emp-form-control" value={filters.medicalStatus} onChange={e => setFilters({ ...filters, medicalStatus: e.target.value })}>
                <option value="">All Medical</option>
                <option value="not_dated">Not Dated</option>
                <option value="date_fixed">Date Fixed</option>
                <option value="pending">Pending</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            </div>
            <div className="emp-form-group">
              <label>Agency</label>
              <select className="emp-form-control" value={filters.agency} onChange={e => setFilters({ ...filters, agency: e.target.value })}>
                <option value="">All Agencies</option>
                {uniqueAgencies.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="emp-form-group">
              <label>Job Category</label>
              <select className="emp-form-control" value={filters.jobCategory} onChange={e => setFilters({ ...filters, jobCategory: e.target.value })}>
                <option value="">All Categories</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="emp-btn-outline" onClick={resetFilters} style={{ color: 'var(--red)', borderColor: 'var(--red)', width: '100%' }}>Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="emp-table-wrapper">
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filtered.length}</strong> customer{filtered.length !== 1 ? 's' : ''} (Sorted by Most Recent)
        </div>
        <table className="emp-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Passport No.</th>
              <th>Destination</th>
              <th>Job Category</th>
              <th>Progress</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="emp-empty-icon" style={{ marginBottom: '1rem', fontSize: '2rem' }}>🔍</div>
                  <p>No customers match your criteria.</p>
                </td>
              </tr>
            )}
            {filtered.map(emp => (
              <tr key={emp.id} className="emp-table-row emp-clickable-row" onClick={() => openView(emp, 'details')}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.fullName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered: {new Date(emp.registeredAt).toLocaleDateString()}</div>
                </td>
                <td className="emp-mono">{emp.passportNumber}</td>
                <td>
                  {renderCountryFlagTag(emp.countryApplied)}
                </td>
                <td>{emp.jobCategory || emp.company || '—'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                      <div style={{ 
                        height: '100%', 
                        background: 'var(--accent)', 
                        width: `${emp.tracking && emp.tracking.length > 0 ? (emp.tracking.filter(t => t.completed).length / emp.tracking.length) * 100 : 0}%` 
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{getProgressString(emp)}</span>
                  </div>
                </td>
                <td>
                  <span className={`emp-badge ${emp.status === 'active' ? 'emp-badge-pass' : 'emp-badge-fail'}`}>
                    {emp.status === 'active' ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                    <button className="emp-btn-outline" onClick={(e) => openView(emp, 'details', e)} title="View Customer Details">
                      <Eye size={14} />
                    </button>
                    <button className="emp-btn-outline" onClick={(e) => handleToggleActive(emp, e)} title={emp.status === 'active' ? 'Disable Customer' : 'Enable Customer'}>
                      {emp.status === 'active' ? <X size={14} /> : <CheckCircle2 size={14} />}
                    </button>
                    <button className="emp-btn-outline" onClick={(e) => openView(emp, 'tracking', e)} title="Migration Workspace">
                      <CheckCircle2 size={14} />
                    </button>
                    <button className="emp-btn-outline" onClick={(e) => openView(emp, 'edit', e)} title="Edit Customer" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                      <Edit2 size={14} />
                    </button>
                    <button className="emp-btn-danger" onClick={(e) => { e.stopPropagation(); setConfirmDelete(emp); }} disabled={isDeleting} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Tabbed 360-Degree Modal */}
      {showModal && selected && (
        <div className="modal-overlay emp-no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '95%', maxWidth: '1200px', height: '90vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: 0, overflow: 'hidden', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', border: '1px solid #e2e8f0' }}>
            
            {/* Modal Top Header */}
            <div style={{ padding: '1.25rem 1.75rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}>
                  {selected.photoUrl ? (
                    <img src={selected.photoUrl} alt={selected.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    selected.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{selected.fullName}</h3>
                    <span className={`emp-badge ${selected.status === 'active' ? 'emp-badge-pass' : 'emp-badge-fail'}`}>
                      {selected.status === 'active' ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span>Passport: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{selected.passportNumber}</strong></span>
                    <span>Destination: <strong>{renderCountryFlagTag(selected.countryApplied)}</strong></span>
                    <span>Job: <strong style={{ color: '#0f172a' }}>{selected.jobCategory || selected.company || '—'}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button className="emp-btn-outline" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Printer size={15} /> Print Application
                </button>
                <button 
                  className="emp-btn-danger" 
                  onClick={() => { setShowModal(false); setSelected(null); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  title="Close Modal"
                >
                  <X size={16} /> Close
                </button>
              </div>
            </div>

            {/* Modal Tab Navigation Bar */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 1.75rem', display: 'flex', gap: '1.5rem' }}>
              <button 
                onClick={() => setActiveModalTab('details')}
                style={{
                  padding: '1rem 0.25rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeModalTab === 'details' ? '3px solid var(--accent)' : '3px solid transparent',
                  color: activeModalTab === 'details' ? 'var(--accent)' : '#64748b',
                  fontWeight: activeModalTab === 'details' ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <UserRound size={16} /> Registration Summary
              </button>

              <button 
                onClick={() => setActiveModalTab('tracking')}
                style={{
                  padding: '1rem 0.25rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeModalTab === 'tracking' ? '3px solid var(--accent)' : '3px solid transparent',
                  color: activeModalTab === 'tracking' ? 'var(--accent)' : '#64748b',
                  fontWeight: activeModalTab === 'tracking' ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle2 size={16} /> Migration & Tracking Workspace
              </button>

              <button 
                onClick={() => setActiveModalTab('edit')}
                style={{
                  padding: '1rem 0.25rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeModalTab === 'edit' ? '3px solid var(--accent)' : '3px solid transparent',
                  color: activeModalTab === 'edit' ? 'var(--accent)' : '#64748b',
                  fontWeight: activeModalTab === 'edit' ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Edit2 size={16} /> Edit Customer Details
              </button>
            </div>

            {/* Modal Body Tab Content (SOLID OPAQUE LIGHT GREY BACKGROUND) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', background: '#f8fafc' }}>
              
              {/* TAB 1: REGISTRATION SUMMARY (FULLY EXPANDED WITH ALL DB FIELDS + DOCS) */}
              {activeModalTab === 'details' && (
                <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
                  
                  {/* 1. Personal Information */}
                  <CardSection title="Personal Information" icon={<UserCheck size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <InfoGridItem label="Full Name" value={selected.fullName} icon={<UserRound size={13} />} />
                      <InfoGridItem label="Passport Number" value={selected.passportNumber} icon={<CreditCard size={13} />} />
                      <InfoGridItem label="Passport Issued Date" value={selected.passportIssuedDate} icon={<Calendar size={13} />} />
                      <InfoGridItem label="Passport Expire Date" value={selected.passportExpireDate} icon={<Calendar size={13} />} />
                      <InfoGridItem label="Previous Passport Nos." value={selected.previousPassportNumbers} icon={<CreditCard size={13} />} />
                      <InfoGridItem label="NIC Number" value={selected.nicNumber} icon={<ShieldCheck size={13} />} />
                      <InfoGridItem label="Date of Birth" value={selected.dob} icon={<Calendar size={13} />} />
                      <InfoGridItem label="Age" value={selected.age} />
                      <InfoGridItem label="Gender" value={selected.gender} />
                      <InfoGridItem label="Civil Status" value={selected.civilStatus} />
                      <InfoGridItem label="Race / Religion" value={selected.race} />
                      <InfoGridItem label="Administrative District" value={selected.adminDistrict} icon={<MapPin size={13} />} />
                    </div>
                  </CardSection>

                  {/* 2. Employment Details */}
                  <CardSection title="Employment & Destination" icon={<Briefcase size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <InfoGridItem label="Destination Country" value={selected.countryApplied} icon={<MapPin size={13} />} />
                      <InfoGridItem label="Recruitment Agency" value={selected.sourceAgency} icon={<HeartHandshake size={13} />} />
                      <InfoGridItem label="Job Category" value={selected.jobCategory} icon={<Briefcase size={13} />} />
                      <InfoGridItem label="Company Name" value={selected.company} icon={<Building2 size={13} />} />
                      <InfoGridItem label="Expected Institutions" value={selected.expectedInstitutions?.join(', ')} fullWidth />
                    </div>
                  </CardSection>

                  {/* 3. Contact Info */}
                  <CardSection title="Contact Information" icon={<Phone size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <InfoGridItem label="Address" value={selected.address} icon={<MapPin size={13} />} fullWidth />
                      <InfoGridItem label="Postal Town" value={selected.postalTown} icon={<MapPin size={13} />} />
                      <InfoGridItem label="Email Address" value={selected.email} icon={<Mail size={13} />} />
                      <InfoGridItem label="Primary Phone" value={selected.phone1} icon={<Phone size={13} />} />
                      <InfoGridItem label="Secondary Phone" value={selected.phone2} icon={<Phone size={13} />} />
                      <InfoGridItem label="WhatsApp Number" value={selected.whatsapp} icon={<Phone size={13} />} />
                      <InfoGridItem label="DS Division" value={selected.dsDivision} />
                      <InfoGridItem label="GN Division" value={selected.gnDivision} />
                    </div>
                  </CardSection>

                  {/* 4. Education & Work Experience */}
                  <CardSection title="Education & Experience" icon={<GraduationCap size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <InfoGridItem label="Education Level" value={selected.education} />
                      <InfoGridItem label="Education (Other)" value={selected.educationOther} />
                      <InfoGridItem label="Sri Lanka Experience" value={selected.expSriLanka} />
                      <InfoGridItem label="Sri Lanka Exp. Period" value={selected.periodSriLanka} />
                      <InfoGridItem label="Abroad Exp. Before" value={selected.abroadBefore} />
                      <InfoGridItem label="Abroad Experience Details" value={selected.expAbroad} />
                      <InfoGridItem label="Abroad Exp. Period" value={selected.periodAbroad} />
                      <InfoGridItem label="Abroad Country" value={selected.abroadCountry} />
                    </div>
                  </CardSection>

                  {/* 5. Family, Trustee & Children */}
                  <CardSection title="Family & Trustee Details" icon={<Award size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <InfoGridItem label="Mother's Name" value={selected.motherName} />
                      <InfoGridItem label="Mother's Phone" value={selected.motherPhone} />
                      <InfoGridItem label="Father's Name" value={selected.fatherName} />
                      <InfoGridItem label="Father's Phone" value={selected.fatherPhone} />
                      <InfoGridItem label="Trustee Name" value={selected.trusteeName} />
                      <InfoGridItem label="Trustee Relation" value={selected.trusteeRelation} />
                      <InfoGridItem label="Trustee Address" value={selected.trusteeAddress} />
                      <InfoGridItem label="Trustee Phone" value={selected.trusteePhone} />
                      <InfoGridItem label="Trustee NIC" value={selected.trusteeNIC} />
                      <InfoGridItem label="Trustee DOB" value={selected.trusteeDob} />
                      
                      {selected.childrenDetails && selected.childrenDetails.length > 0 && (
                        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={14} /> Children Details ({selected.childrenDetails.length})
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {selected.childrenDetails.map((child, idx) => (
                              <div key={idx} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                                Child {idx + 1}: <strong>{child.childName}</strong> (Age: {child.childAge})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardSection>

                  {/* 6. Banking Details */}
                  <CardSection title="Banking Information" icon={<CreditCard size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <InfoGridItem label="Bank Name" value={selected.bankName} />
                      <InfoGridItem label="Bank Branch" value={selected.bankBranch} />
                      <InfoGridItem label="Account Number" value={selected.accountNumber} />
                      <InfoGridItem label="Account Holder Name" value={selected.accountHolderName} />
                    </div>
                  </CardSection>

                  {/* 7. Document Attachments */}
                  <CardSection title="Uploaded Document Attachments" icon={<FileCode2 size={20} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      <DocCard label="NIC Document" url={selected.nicDocUrl} name={selected.nicDocName} />
                      <DocCard label="Passport Copy" url={selected.passportDocUrl} name={selected.passportDocName} />
                      <DocCard label="Police Clearance" url={selected.policeReportUrl} name={selected.policeReportName} />
                      <DocCard label="Passport Photo" url={selected.photoUrl} name={selected.photoDocName} />
                      <DocCard label="Agreed Amount Receipt" url={selected.agreedAmountReceipt} name="Agreed Receipt" />
                    </div>
                  </CardSection>

                </div>
              )}

              {/* TAB 2: MIGRATION TRACKING WORKSPACE */}
              {activeModalTab === 'tracking' && (
                <div className="emp-status-right-column" style={{ maxWidth: '1100px', margin: '0 auto', background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <EmployeeStatus 
                    employees={[selected]} 
                    onNavigate={() => {}} 
                    onUpdate={async (id, data) => {
                      try {
                        await updateEmployee(id, data as Partial<Employee>);
                        setSelected(prev => prev ? ({ ...prev, ...data } as Employee) : prev);
                      } catch (err) {
                        console.error('Failed saving tracking', err);
                        alert('Failed to save tracking updates');
                      }
                    }} 
                  />
                </div>
              )}

              {/* TAB 3: EDIT FORM */}
              {activeModalTab === 'edit' && (
                <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 className="emp-section-heading" style={{ margin: 0 }}>Edit Customer Details</h3>
                      <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0 }}>
                        Update original registration record for <strong>{selected.fullName}</strong>.
                      </p>
                    </div>
                    <button className="emp-btn-outline" onClick={() => setActiveModalTab('details')}>
                      Cancel & Return
                    </button>
                  </div>
                  <RegisterEmployee
                    destinations={[]}
                    mode="edit"
                    initialData={selected as unknown as Record<string, unknown>}
                    onRegister={async () => {}}
                    onCancel={() => setActiveModalTab('details')}
                    onUpdate={async (id: string, data: Record<string, unknown>) => {
                      try {
                        await updateEmployee(id, data as Partial<Employee>);
                        const updated = { ...selected, ...data } as Employee;
                        setSelected(updated);
                        setActiveModalTab('details');
                      } catch (err) {
                        console.error('Update failed', err);
                        alert('Failed to update customer');
                      }
                    }}
                  />
                </div>
              )}

            </div>

            {/* Modal Bottom Footer */}
            <div style={{ padding: '1rem 1.75rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="emp-btn-outline" onClick={() => { setShowModal(false); setSelected(null); }}>
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="modal-content" style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <AlertTriangle size={32} />
            </div>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Confirm Deletion</h3>
            <p style={{ color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Are you sure you want to delete customer <strong>{confirmDelete.fullName}</strong>? This action cannot be undone and will permanently remove all records.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="emp-btn-outline" 
                onClick={() => setConfirmDelete(null)} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                disabled={isDeleting}
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: '#ef4444', 
                  color: '#ffffff', 
                  border: 'none', 
                  padding: '12px 18px', 
                  borderRadius: '10px', 
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Lightroom Preview Modal */}
      {previewDocUrl && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }} onClick={() => setPreviewDocUrl(null)}>
          <div style={{ background: '#ffffff', width: '90%', maxWidth: '850px', height: '85vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1rem 1.5rem', background: '#0f172a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode2 size={18} style={{ color: 'var(--accent)' }} />
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'white' }}>{previewDocUrl.name}</h4>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                  type="button"
                  onClick={() => openDocumentInNewTab(previewDocUrl.url)} 
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={14} /> Open in New Tab
                </button>
                <button 
                  type="button"
                  onClick={() => handleDownloadDocument(previewDocUrl.url, previewDocUrl.name)} 
                  style={{ background: 'var(--accent)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download
                </button>
                <button onClick={() => setPreviewDocUrl(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'auto' }}>
              {previewDocUrl.url.startsWith('data:application/pdf') || previewDocUrl.url.toLowerCase().endsWith('.pdf') ? (
                <iframe src={previewDocUrl.url} title={previewDocUrl.name} style={{ width: '100%', height: '100%', border: 'none', background: 'white' }} />
              ) : (
                <img src={previewDocUrl.url} alt={previewDocUrl.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Universal Hidden Printable Template Container for window.print() */}
      {selected && (
        <div className="print-only-application">
          {/* Header with photo */}
          <div className="pf-header">
            <div className="pf-header-left">
              <div style={{ width: '60px', height: '60px', border: '2px solid #000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', margin: '0 auto' }}>LOGO</div>
            </div>
            <div className="pf-header-center">
              <h2>OG AGENCY (PVT) LTD</h2>
              <p>Foreign Employment Agency License No. 2751</p>
              <h3>Official Candidate Application Form</h3>
            </div>
            <div className="pf-photo">
              {selected.photoUrl ? (
                <img src={selected.photoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>Passport<br />Photo</span>
              )}
            </div>
          </div>

          {/* Section A: Agency & Job Info */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section A — Agency &amp; Job Information</td></tr>
              <tr>
                <td className="pf-label">Agent Name</td>
                <td className="pf-val">{selected.sourceAgency || ''}</td>
                <td className="pf-label">Expected Post</td>
                <td className="pf-val">{selected.jobCategory || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Country</td>
                <td className="pf-val">{selected.countryApplied || ''}</td>
                <td className="pf-label">Company</td>
                <td className="pf-val">{selected.company || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Expected Institution(s)</td>
                <td colSpan={3} className="pf-val">
                  {selected.expectedInstitutions && selected.expectedInstitutions.length > 0
                    ? selected.expectedInstitutions.map((inst, i) => `${i + 1}. ${inst}`).join('   |   ')
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section B: Personal Details */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section B — Personal Details</td></tr>
              <tr>
                <td className="pf-label">1. Full Name</td>
                <td colSpan={3} className="pf-val" style={{ fontWeight: 600 }}>{selected.fullName || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">2. NIC No</td>
                <td className="pf-val">{selected.nicNumber || ''}</td>
                <td className="pf-label">Date of Birth</td>
                <td className="pf-val">{selected.dob || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">3. Age</td>
                <td className="pf-val">{selected.age !== undefined && selected.age !== null ? selected.age : ''}</td>
                <td className="pf-label">Gender</td>
                <td className="pf-val">{selected.gender || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">4. Civil Status</td>
                <td className="pf-val">{selected.civilStatus || ''}</td>
                <td className="pf-label">Race</td>
                <td className="pf-val">{selected.race || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">5. Passport No</td>
                <td className="pf-val" style={{ fontWeight: 600, letterSpacing: '0.5px' }}>{selected.passportNumber || ''}</td>
                <td className="pf-label">Prev. Passport(s)</td>
                <td className="pf-val">{selected.previousPassportNumbers || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">6. PP Issued Date</td>
                <td className="pf-val">{selected.passportIssuedDate || ''}</td>
                <td className="pf-label">PP Expire Date</td>
                <td className="pf-val">{selected.passportExpireDate || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">7. Children</td>
                <td className="pf-val">
                  {selected.childrenDetails && selected.childrenDetails.length > 0
                    ? selected.childrenDetails.length
                    : ''}
                </td>
                <td className="pf-label">Children Age(s)</td>
                <td className="pf-val">
                  {selected.childrenDetails && selected.childrenDetails.length > 0
                    ? selected.childrenDetails.map(c => c.childAge).filter(Boolean).join(', ')
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section C: Contact & Location */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section C — Contact &amp; Location</td></tr>
              <tr>
                <td className="pf-label">8. Address</td>
                <td colSpan={3} className="pf-val">{selected.address || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Postal Town</td>
                <td className="pf-val">{selected.postalTown || ''}</td>
                <td className="pf-label">Email</td>
                <td className="pf-val">{selected.email || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">9. Telephone (1)</td>
                <td className="pf-val">{selected.phone1 || ''}</td>
                <td className="pf-label">Telephone (2)</td>
                <td className="pf-val">{selected.phone2 || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">WhatsApp No</td>
                <td className="pf-val">{selected.whatsapp || ''}</td>
                <td className="pf-label">District</td>
                <td className="pf-val">{selected.adminDistrict || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">DS Division</td>
                <td className="pf-val">{selected.dsDivision || ''}</td>
                <td className="pf-label">GN Division</td>
                <td className="pf-val">{selected.gnDivision || ''}</td>
              </tr>
            </tbody>
          </table>

          <div className="page-break-before"></div>

          {/* Section D: Education & Experience */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section D — Education &amp; Experience</td></tr>
              <tr>
                <td className="pf-label">10. Ed. Qualification</td>
                <td className="pf-val">
                  {selected.education === 'etc'
                    ? selected.educationOther || ''
                    : selected.education || ''}
                </td>
                <td className="pf-label">Exp in Sri Lanka</td>
                <td className="pf-val">{selected.expSriLanka || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Period (SL)</td>
                <td className="pf-val">{selected.periodSriLanka || ''}</td>
                <td className="pf-label">Been Abroad?</td>
                <td className="pf-val">{selected.abroadBefore || ''}</td>
              </tr>
              {selected.abroadBefore === 'yes' && (
                <tr>
                  <td className="pf-label">Abroad Country</td>
                  <td className="pf-val">{selected.abroadCountry || ''}</td>
                  <td className="pf-label">Period (Abroad)</td>
                  <td className="pf-val">{selected.periodAbroad || ''}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Section E: Family Information */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section E — Family Information</td></tr>
              <tr>
                <td className="pf-label">11. Mother Name</td>
                <td className="pf-val">{selected.motherName || ''}</td>
                <td className="pf-label">Mother Tel</td>
                <td className="pf-val">{selected.motherPhone || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">12. Father Name</td>
                <td className="pf-val">{selected.fatherName || ''}</td>
                <td className="pf-label">Father Tel</td>
                <td className="pf-val">{selected.fatherPhone || ''}</td>
              </tr>
            </tbody>
          </table>

          {/* Children Details (if any) */}
          {selected.childrenDetails && selected.childrenDetails.length > 0 && (
            <table className="pf-exp-table">
              <thead>
                <tr><th colSpan={3} style={{ textAlign: 'left' }}>Children Details</th></tr>
                <tr>
                  <th>#</th>
                  <th>Child Name</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {selected.childrenDetails.map((c, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{c.childName}</td>
                    <td>{c.childAge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Section F: Trustee Details */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section F — Trustee / Guardian Details</td></tr>
              <tr>
                <td className="pf-label">13. Trustee Name</td>
                <td className="pf-val">{selected.trusteeName || ''}</td>
                <td className="pf-label">Relation</td>
                <td className="pf-val">{selected.trusteeRelation || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">14. Trustee NIC</td>
                <td className="pf-val">{selected.trusteeNIC || ''}</td>
                <td className="pf-label">Trustee DOB</td>
                <td className="pf-val">{selected.trusteeDob || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">15. Trustee Tel</td>
                <td className="pf-val">{selected.trusteePhone || ''}</td>
                <td className="pf-label">Trustee Address</td>
                <td className="pf-val">{selected.trusteeAddress || ''}</td>
              </tr>
            </tbody>
          </table>

          {/* Section G: Banking Details */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section G — Banking Details</td></tr>
              <tr>
                <td className="pf-label">16. Bank Name</td>
                <td className="pf-val">{selected.bankName || ''}</td>
                <td className="pf-label">Branch</td>
                <td className="pf-val">{selected.bankBranch || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">17. Account No</td>
                <td className="pf-val">{selected.accountNumber || ''}</td>
                <td className="pf-label">Account Holder</td>
                <td className="pf-val">{selected.accountHolderName || ''}</td>
              </tr>
            </tbody>
          </table>

          {/* Disclaimer & Signature */}
          <div className="pf-disclaimer">
            <p style={{ margin: '0 0 4px 0' }}>
              I hereby declare that the above information is true and correct to the best of my knowledge. I agree to abide by the terms and conditions of OG Agency.
            </p>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              *After job selection, the Agency will proceed with visa and related processing. If the Job Seeker withdraws or refuses the job offer, refunds will be made only after deducting all incurred expenses.*
            </p>
          </div>

          <div className="pf-signature" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', marginTop: '40px', gap: '20px' }}>
            <div style={{ alignSelf: 'end' }}>
              <div style={{ borderBottom: '1px dotted #000', margin: '0 auto 5px auto', width: '80%' }}></div>
              <strong>Applicant Signature</strong><br />
              <span style={{ fontSize: '10px' }}>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <div style={{ width: '80px', height: '80px', border: '1px dashed #000', borderRadius: '50%', margin: '0 auto 5px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '10px' }}>SEAL</div>
              <strong>Agency Seal</strong>
            </div>
            <div style={{ alignSelf: 'end' }}>
              <div style={{ borderBottom: '1px dotted #000', margin: '0 auto 5px auto', width: '80%' }}></div>
              <strong>Authorized Officer</strong><br />
              <span style={{ fontSize: '10px' }}>Date: __________________</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
