import { useState, useMemo } from 'react';
import type { Employee } from '../../types';

const AGENCIES = ['OG Agency', 'Lanka Employment Agency', 'Future Careers', 'Global Placements', 'Colombo Recruitment'];
const JOB_CATEGORIES = ['Factory Worker', 'Construction Worker', 'Welder', 'Electrician', 'Plumber', 'Mechanic', 'Driver', 'Security Guard', 'Cleaner', 'Caregiver', 'Hotel Staff', 'Agriculture', 'IT Technician', 'Other'];

interface Props {
  employees: Employee[];
}

interface Filters {
  country: string;
  status: string;
  medicalStatus: string;
  agency: string;
  jobCategory: string;
  search: string;
}

const defaultFilters: Filters = {
  country: '',
  status: '',
  medicalStatus: '',
  agency: '',
  jobCategory: '',
  search: '',
};

export const FilterSystem: React.FC<Props> = ({ employees }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [applied, setApplied] = useState<Filters>(defaultFilters);

  const filtered = useMemo(() => {
    return employees.filter(emp => {
      const q = applied.search.toLowerCase();
      if (applied.country && emp.countryApplied !== applied.country) return false;
      if (applied.status && emp.status !== applied.status) return false;
      if (applied.medicalStatus && emp.medicalStatus !== applied.medicalStatus) return false;
      if (applied.agency && emp.sourceAgency !== applied.agency) return false;
      if (applied.jobCategory && emp.jobCategory !== applied.jobCategory) return false;
      if (q && !(
        (emp.fullName || '').toLowerCase().includes(q) ||
        (emp.passportNumber || '').toLowerCase().includes(q) ||
        (emp.nicNumber || '').toLowerCase().includes(q)
      )) return false;
      return true;
    });
  }, [employees, applied]);

  const applyFilters = () => setApplied({ ...filters });
  const resetFilters = () => { setFilters(defaultFilters); setApplied(defaultFilters); };

  const hasFilters = Object.values(applied).some(Boolean);

  const exportCSV = () => {
    const headers = ['Name', 'Passport', 'NIC', 'Country', 'Agency', 'Job Category', 'Medical Status', 'Status', 'Phone 1', 'Email', 'Registered At'];
    const rows = filtered.map(e => [
      e.fullName,
      e.passportNumber,
      e.nicNumber || '',
      e.countryApplied,
      e.sourceAgency || '',
      e.jobCategory || '',
      e.medicalStatus,
      e.status,
      e.phone1 || '',
      e.email || '',
      e.registeredAt ? new Date(e.registeredAt).toLocaleDateString() : '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_filtered_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Filter System</h2>
          <p className="emp-page-sub">Apply multiple filters to find specific employees</p>
        </div>
        {hasFilters && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="emp-btn-outline" onClick={exportCSV}>📥 Export CSV</button>
            <button className="emp-btn-outline emp-btn-danger" onClick={resetFilters}>✕ Clear Filters</button>
          </div>
        )}
      </div>

      {/* Filter Card */}
      <div className="emp-filter-card">
        <div className="emp-filter-grid">
          <div className="emp-form-group">
            <label>Search</label>
            <input
              type="text"
              className="emp-form-control"
              placeholder="Name, passport, NIC…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <div className="emp-form-group">
            <label>Country</label>
            <select className="emp-form-control" value={filters.country} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}>
              <option value="">All Countries</option>
              <option value="Russia">🇷🇺 Russia</option>
              <option value="Romania">🇷🇴 Romania</option>
            </select>
          </div>
          <div className="emp-form-group">
            <label>Status</label>
            <select className="emp-form-control" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="emp-form-group">
            <label>Medical Status</label>
            <select className="emp-form-control" value={filters.medicalStatus} onChange={e => setFilters(f => ({ ...f, medicalStatus: e.target.value }))}>
              <option value="">All Medical</option>
              <option value="pending">Pending</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
          <div className="emp-form-group">
            <label>Agency</label>
            <select className="emp-form-control" value={filters.agency} onChange={e => setFilters(f => ({ ...f, agency: e.target.value }))}>
              <option value="">All Agencies</option>
              {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="emp-form-group">
            <label>Job Category</label>
            <select className="emp-form-control" value={filters.jobCategory} onChange={e => setFilters(f => ({ ...f, jobCategory: e.target.value }))}>
              <option value="">All Categories</option>
              {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="emp-filter-actions">
          <button className="emp-btn-primary" onClick={applyFilters}>Apply Filters</button>
          <button className="emp-btn-outline" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasFilters && (
        <div className="emp-filter-tags">
          {applied.search && <span className="emp-filter-tag">Search: "{applied.search}" <button onClick={() => { setFilters(f => ({ ...f, search: '' })); setApplied(f => ({ ...f, search: '' })); }}>✕</button></span>}
          {applied.country && <span className="emp-filter-tag">Country: {applied.country} <button onClick={() => { setFilters(f => ({ ...f, country: '' })); setApplied(f => ({ ...f, country: '' })); }}>✕</button></span>}
          {applied.status && <span className="emp-filter-tag">Status: {applied.status} <button onClick={() => { setFilters(f => ({ ...f, status: '' })); setApplied(f => ({ ...f, status: '' })); }}>✕</button></span>}
          {applied.medicalStatus && <span className="emp-filter-tag">Medical: {applied.medicalStatus} <button onClick={() => { setFilters(f => ({ ...f, medicalStatus: '' })); setApplied(f => ({ ...f, medicalStatus: '' })); }}>✕</button></span>}
          {applied.agency && <span className="emp-filter-tag">Agency: {applied.agency} <button onClick={() => { setFilters(f => ({ ...f, agency: '' })); setApplied(f => ({ ...f, agency: '' })); }}>✕</button></span>}
          {applied.jobCategory && <span className="emp-filter-tag">Category: {applied.jobCategory} <button onClick={() => { setFilters(f => ({ ...f, jobCategory: '' })); setApplied(f => ({ ...f, jobCategory: '' })); }}>✕</button></span>}
        </div>
      )}

      {/* Results */}
      <div className="emp-filter-results-header">
        <span>{filtered.length} employee{filtered.length !== 1 ? 's' : ''} found</span>
        {filtered.length > 0 && <button className="emp-btn-outline" onClick={exportCSV}>📥 Export {filtered.length} records</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="emp-empty-state">
          <div className="emp-empty-icon">🔽</div>
          <p>{hasFilters ? 'No employees match the selected filters.' : 'No employees registered yet.'}</p>
        </div>
      ) : (
        <div className="emp-table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passport</th>
                <th>NIC</th>
                <th>Country</th>
                <th>Agency</th>
                <th>Category</th>
                <th>Medical</th>
                <th>Status</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <tr key={emp.id} className="emp-table-row">
                  <td className="emp-table-num">{i + 1}</td>
                  <td>
                    <div className="emp-table-name">{emp.fullName}</div>
                    <div className="emp-table-sub">{emp.email || ''}</div>
                  </td>
                  <td className="emp-mono">{emp.passportNumber}</td>
                  <td className="emp-mono">{emp.nicNumber || '—'}</td>
                  <td><span className="emp-country-tag">{emp.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {emp.countryApplied}</span></td>
                  <td>{emp.sourceAgency || '—'}</td>
                  <td>{emp.jobCategory || '—'}</td>
                  <td>
                    <span className={`emp-badge ${emp.medicalStatus === 'pass' ? 'emp-badge-pass' : emp.medicalStatus === 'fail' ? 'emp-badge-fail' : 'emp-badge-pending'}`}>
                      {emp.medicalStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`emp-badge ${emp.status === 'active' ? 'emp-badge-active' : 'emp-badge-archived'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>{emp.phone1 || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
