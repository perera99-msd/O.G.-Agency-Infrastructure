import React, { useState, useMemo } from 'react';
import type { Employee, MedicalStatus, Destination } from '../../types';
import { Search, X, Calendar, RotateCcw, CheckCircle2, AlertCircle, Clock, HelpCircle, Save } from 'lucide-react';

interface Props {
  employees: Employee[];
  destinations?: Destination[];
  onUpdate: (id: string, updates: Partial<Employee>) => Promise<void>;
}

export const MedicalManagement: React.FC<Props> = ({ employees, destinations = [], onUpdate }) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [medCenter, setMedCenter] = useState<Record<string, string>>({});
  const [medDate, setMedDate] = useState<Record<string, string>>({});
  const [medNotes, setMedNotes] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Helper to compute effective medical status
  const getEffectiveStatus = (emp: Employee): MedicalStatus => {
    if (emp.medicalStatus === 'pass') return 'pass';
    if (emp.medicalStatus === 'fail') return 'fail';
    
    // Check medicalDate override
    const targetDateStr = medDate[emp.id] ?? emp.medicalDate;
    if (!targetDateStr) return 'not_dated';

    const todayStr = new Date().toISOString().split('T')[0];
    if (targetDateStr <= todayStr) {
      return 'pending'; // Date has arrived/passed, awaiting pass/fail result
    }
    return 'date_fixed'; // Date is fixed in the future
  };

  // Helper to get text emoji for dropdown options
  const getFlagEmoji = (countryName: string) => {
    if (!countryName) return '🌐';
    const dest = destinations.find(d => d.country.toLowerCase() === countryName.toLowerCase());
    if (dest?.flag && !dest.flag.startsWith('http') && !dest.flag.startsWith('/') && !dest.flag.startsWith('data:')) {
      return dest.flag;
    }
    const lower = countryName.toLowerCase();
    if (lower.includes('russia')) return '🇷🇺';
    if (lower.includes('romania')) return '🇷🇴';
    if (lower.includes('qatar')) return '🇶🇦';
    if (lower.includes('dubai') || lower.includes('uae')) return '🇦🇪';
    if (lower.includes('kuwait')) return '🇰🇼';
    if (lower.includes('saudi')) return '🇸🇦';
    return '🌐';
  };

  // Flag helper for rendering in table cells
  const renderFlag = (countryName: string) => {
    if (!countryName) return <span style={{ marginRight: '4px' }}>🌐</span>;
    const dest = destinations.find(d => d.country.toLowerCase() === countryName.toLowerCase());
    
    let flagVal = dest?.flag;
    if (!flagVal) {
      flagVal = getFlagEmoji(countryName);
    }

    if (flagVal.startsWith('http://') || flagVal.startsWith('https://') || flagVal.startsWith('/') || flagVal.startsWith('data:')) {
      return (
        <img
          src={flagVal}
          alt={countryName}
          style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}
        />
      );
    }

    return <span style={{ marginRight: '4px' }}>{flagVal}</span>;
  };

  // Sorting & Filtering (Recents 1st)
  const processedEmployees = useMemo(() => {
    let list = [...employees];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(emp =>
        (emp.fullName && emp.fullName.toLowerCase().includes(q)) ||
        (emp.passportNumber && emp.passportNumber.toLowerCase().includes(q)) ||
        (emp.nicNumber && emp.nicNumber.toLowerCase().includes(q)) ||
        (emp.phone1 && emp.phone1.includes(q))
      );
    }

    // Filter by Country
    if (filterCountry) {
      list = list.filter(emp => emp.countryApplied === filterCountry);
    }

    // Filter by Medical Status
    if (filterStatus) {
      list = list.filter(emp => getEffectiveStatus(emp) === filterStatus);
    }

    // Sort Recents 1st
    list.sort((a, b) => {
      const timeA = new Date(a.lastUpdatedAt || a.registeredAt || 0).getTime();
      const timeB = new Date(b.lastUpdatedAt || b.registeredAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  }, [employees, searchQuery, filterCountry, filterStatus, medDate]);

  // Counts
  const totalCount = employees.length;
  const countNotDated = employees.filter(e => getEffectiveStatus(e) === 'not_dated').length;
  const countDateFixed = employees.filter(e => getEffectiveStatus(e) === 'date_fixed').length;
  const countPending = employees.filter(e => getEffectiveStatus(e) === 'pending').length;
  const countPass = employees.filter(e => getEffectiveStatus(e) === 'pass').length;
  const countFail = employees.filter(e => getEffectiveStatus(e) === 'fail').length;

  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => { if (e.countryApplied) set.add(e.countryApplied); });
    return Array.from(set);
  }, [employees]);

  // Helper to update employee checklist step
  const updateMedicalChecklist = (emp: Employee, completed: boolean, dateVal?: string | null) => {
    const currentTracking = emp.tracking ? [...emp.tracking] : [];
    // Find medical examination step (index 1 or step matching "Medical")
    const stepIdx = currentTracking.findIndex(t => t.step.toLowerCase().includes('medical'));
    if (stepIdx !== -1) {
      currentTracking[stepIdx] = {
        ...currentTracking[stepIdx],
        completed,
        date: dateVal !== undefined ? dateVal : (completed ? new Date().toISOString().split('T')[0] : null),
      };
    } else {
      currentTracking.push({
        step: 'Medical Examination',
        completed,
        date: dateVal !== undefined ? dateVal : (completed ? new Date().toISOString().split('T')[0] : null),
        fileUrl: null,
      });
    }
    return currentTracking;
  };

  // Actions
  const handleSaveDate = async (emp: Employee) => {
    const newDate = medDate[emp.id] ?? emp.medicalDate ?? '';
    const center = medCenter[emp.id] ?? emp.medicalCenter ?? '';
    const notes = medNotes[emp.id] ?? emp.medicalNotes ?? '';

    if (!newDate) return;

    setUpdating(emp.id);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const newStatus: MedicalStatus = newDate <= todayStr ? 'pending' : 'date_fixed';
      
      // Auto update Migration Checklist ("Medical Examination" checked)
      const newTracking = updateMedicalChecklist(emp, true, newDate);

      await onUpdate(emp.id, {
        medicalStatus: newStatus,
        medicalDate: newDate,
        medicalCenter: center,
        medicalNotes: notes,
        tracking: newTracking,
      });
    } catch (err) {
      console.error('Failed to save date:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusUpdate = async (emp: Employee, status: MedicalStatus) => {
    setUpdating(emp.id);
    try {
      const center = medCenter[emp.id] ?? emp.medicalCenter ?? '';
      const date = medDate[emp.id] ?? emp.medicalDate ?? '';
      const notes = medNotes[emp.id] ?? emp.medicalNotes ?? '';

      let newTracking = emp.tracking;
      if (status === 'pass') {
        newTracking = updateMedicalChecklist(emp, true, date || new Date().toISOString().split('T')[0]);
      }

      await onUpdate(emp.id, {
        medicalStatus: status,
        medicalCenter: center,
        medicalDate: date,
        medicalNotes: notes,
        ...(newTracking && { tracking: newTracking }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleReschedule = async (emp: Employee) => {
    setUpdating(emp.id);
    try {
      // Reset to not_dated, clear date, uncheck checklist
      const newTracking = updateMedicalChecklist(emp, false, null);
      
      // Reset local inputs
      setMedDate(prev => ({ ...prev, [emp.id]: '' }));

      await onUpdate(emp.id, {
        medicalStatus: 'not_dated',
        medicalDate: '',
        tracking: newTracking,
      });
    } catch (err) {
      console.error('Failed to reschedule:', err);
    } finally {
      setUpdating(null);
    }
  };

  const renderBadge = (status: MedicalStatus) => {
    switch (status) {
      case 'pass':
        return <span className="emp-badge emp-badge-lg emp-badge-pass" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={13} /> Pass</span>;
      case 'fail':
        return <span className="emp-badge emp-badge-lg emp-badge-fail" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={13} /> Fail</span>;
      case 'pending':
        return <span className="emp-badge emp-badge-lg emp-badge-pending" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> Pending</span>;
      case 'date_fixed':
        return <span className="emp-badge emp-badge-lg" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> Date Fixed</span>;
      case 'not_dated':
      default:
        return <span className="emp-badge emp-badge-lg" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><HelpCircle size={13} /> Not Dated</span>;
    }
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Medical Management</h2>
          <p className="emp-page-sub">Schedule dates, verify medical statuses, update checklists, and track results</p>
        </div>
      </div>

      {/* Medical Stats */}
      <div className="emp-stats-grid" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Total Customers</div>
          <div className="emp-stat-value emp-stat-blue">{totalCount}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Not Dated</div>
          <div className="emp-stat-value" style={{ color: '#64748b' }}>{countNotDated}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Date Fixed 📅</div>
          <div className="emp-stat-value" style={{ color: '#0284c7' }}>{countDateFixed}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Pending ⏳</div>
          <div className="emp-stat-value emp-stat-amber">{countPending}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Passed ✅</div>
          <div className="emp-stat-value emp-stat-green">{countPass}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Failed ❌</div>
          <div className="emp-stat-value emp-stat-red">{countFail}</div>
        </div>
      </div>

      {/* Unified Search & Filters */}
      <div className="emp-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div className="emp-search-box-wrap" style={{ flex: '1 1 280px', margin: 0, position: 'relative' }}>
            <Search size={16} className="emp-search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="emp-search-input"
              placeholder="Search by customer name, passport, NIC..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px', paddingRight: searchQuery ? '32px' : '12px', height: '40px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Country Filter */}
          <div style={{ flex: '0 1 200px' }}>
            <select className="emp-form-control" value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ height: '40px' }}>
              <option value="">All Countries</option>
              {uniqueCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ flex: '0 1 200px' }}>
            <select className="emp-form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ height: '40px' }}>
              <option value="">All Medical Statuses</option>
              <option value="not_dated">Not Dated</option>
              <option value="date_fixed">Date Fixed</option>
              <option value="pending">Pending</option>
              <option value="pass">Passed</option>
              <option value="fail">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {processedEmployees.length === 0 ? (
        <div className="emp-empty-state">
          <div className="emp-empty-icon">🏥</div>
          <p>{employees.length === 0 ? 'No customers registered yet.' : 'No customers match the selected search & filters.'}</p>
        </div>
      ) : (
        <div className="emp-table-wrapper">
          <table className="emp-table emp-medical-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name & Contact</th>
                <th>Passport</th>
                <th>Country</th>
                <th>Job Category</th>
                <th>Medical Status</th>
                <th>Medical Center</th>
                <th>Exam Date</th>
                <th>Actions</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {processedEmployees.map((emp, i) => {
                const effectiveStatus = getEffectiveStatus(emp);
                const currentCenter = medCenter[emp.id] ?? (emp.medicalCenter || '');
                const currentDate = medDate[emp.id] ?? (emp.medicalDate || '');
                const dateChanged = currentDate !== (emp.medicalDate || '');

                return (
                  <React.Fragment key={emp.id}>
                    <tr className={`emp-table-row${detailId === emp.id ? ' emp-row-expanded' : ''}`}>
                      <td className="emp-table-num">{i + 1}</td>
                      <td>
                        <div className="emp-table-name" style={{ fontWeight: 600 }}>{emp.fullName}</div>
                        <div className="emp-table-sub" style={{ fontSize: '0.8rem', color: '#64748b' }}>{emp.phone1 || '—'}</div>
                      </td>
                      <td className="emp-mono">{emp.passportNumber}</td>
                      <td>
                        <span className="emp-country-tag">
                          {renderFlag(emp.countryApplied)} {emp.countryApplied}
                        </span>
                      </td>
                      <td>{emp.jobCategory || '—'}</td>
                      <td>
                        {renderBadge(effectiveStatus)}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="emp-form-control emp-inline-input"
                          placeholder="Center name…"
                          value={currentCenter}
                          onChange={e => setMedCenter(prev => ({ ...prev, [emp.id]: e.target.value }))}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="date"
                            className="emp-form-control emp-inline-input"
                            value={currentDate}
                            onChange={e => setMedDate(prev => ({ ...prev, [emp.id]: e.target.value }))}
                          />
                          {dateChanged && (
                            <button
                              className="emp-btn-primary"
                              title="Save Date & Update Checklist"
                              onClick={() => handleSaveDate(emp)}
                              disabled={updating === emp.id}
                              style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                            >
                              <Save size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="emp-med-btn-group" style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap' }}>
                          {/* Set/Save Date Button if date entered but not saved */}
                          {!dateChanged && currentDate && effectiveStatus === 'not_dated' && (
                            <button
                              className="emp-med-btn"
                              style={{ background: '#0284c7', color: 'white' }}
                              disabled={updating === emp.id}
                              onClick={() => handleSaveDate(emp)}
                            >
                              Fix Date
                            </button>
                          )}

                          {/* Pass Button */}
                          <button
                            className={`emp-med-btn emp-med-btn-pass${effectiveStatus === 'pass' ? ' active' : ''}`}
                            disabled={updating === emp.id}
                            onClick={() => handleStatusUpdate(emp, 'pass')}
                          >
                            Pass
                          </button>

                          {/* Fail Button */}
                          <button
                            className={`emp-med-btn emp-med-btn-fail${effectiveStatus === 'fail' ? ' active' : ''}`}
                            disabled={updating === emp.id}
                            onClick={() => handleStatusUpdate(emp, 'fail')}
                          >
                            Fail
                          </button>

                          {/* Reschedule option if Failed */}
                          {effectiveStatus === 'fail' && (
                            <button
                              className="emp-med-btn"
                              style={{ background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', gap: '3px' }}
                              disabled={updating === emp.id}
                              onClick={() => handleReschedule(emp)}
                              title="Reschedule Medical Exam"
                            >
                              <RotateCcw size={12} /> Reschedule
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className="emp-action-btn emp-action-view"
                          onClick={() => setDetailId(detailId === emp.id ? null : emp.id)}
                        >
                          {detailId === emp.id ? 'Hide' : 'Notes'}
                        </button>
                      </td>
                    </tr>

                    {/* Notes Expanded Row */}
                    {detailId === emp.id && (
                      <tr className="emp-notes-row">
                        <td colSpan={10}>
                          <div className="emp-notes-panel" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '8px 0' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155', display: 'block', marginBottom: '6px' }}>
                              Medical Notes for {emp.fullName}
                            </label>
                            <textarea
                              className="emp-form-control"
                              rows={3}
                              placeholder="Enter medical notes, clinic findings, or observation details…"
                              value={medNotes[emp.id] ?? (emp.medicalNotes || '')}
                              onChange={e => setMedNotes(prev => ({ ...prev, [emp.id]: e.target.value }))}
                              style={{ width: '100%', marginBottom: '8px' }}
                            />
                            <button
                              className="emp-btn-primary"
                              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                              onClick={() => handleStatusUpdate(emp, effectiveStatus)}
                              disabled={updating === emp.id}
                            >
                              {updating === emp.id ? 'Saving…' : 'Save Notes'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
