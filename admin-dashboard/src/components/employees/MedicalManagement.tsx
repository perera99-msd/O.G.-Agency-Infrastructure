import { useState } from 'react';
import type { Employee, MedicalStatus } from '../../types';

interface Props {
  employees: Employee[];
  onUpdateMedical: (id: string, status: MedicalStatus, center?: string, date?: string, notes?: string) => Promise<void>;
}

export const MedicalManagement: React.FC<Props> = ({ employees, onUpdateMedical }) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [medCenter, setMedCenter] = useState<Record<string, string>>({});
  const [medDate, setMedDate] = useState<Record<string, string>>({});
  const [medNotes, setMedNotes] = useState<Record<string, string>>({});
  const [filterCountry, setFilterCountry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const totalPass = employees.filter(e => e.medicalStatus === 'pass').length;
  const totalFail = employees.filter(e => e.medicalStatus === 'fail').length;
  const totalPending = employees.filter(e => e.medicalStatus === 'pending').length;

  const filtered = employees.filter(emp => {
    if (filterCountry && emp.countryApplied !== filterCountry) return false;
    if (filterStatus && emp.medicalStatus !== filterStatus) return false;
    return true;
  });

  const handleStatusUpdate = async (emp: Employee, status: MedicalStatus) => {
    setUpdating(emp.id);
    try {
      await onUpdateMedical(
        emp.id,
        status,
        medCenter[emp.id],
        medDate[emp.id],
        medNotes[emp.id],
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Medical Management</h2>
          <p className="emp-page-sub">Manage and update medical examination results for all employees</p>
        </div>
      </div>

      {/* Medical Stats */}
      <div className="emp-stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Total Employees</div>
          <div className="emp-stat-value emp-stat-blue">{employees.length}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Pending</div>
          <div className="emp-stat-value emp-stat-amber">{totalPending}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Passed ✅</div>
          <div className="emp-stat-value emp-stat-green">{totalPass}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Failed ❌</div>
          <div className="emp-stat-value emp-stat-red">{totalFail}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Pass Rate</div>
          <div className="emp-stat-value emp-stat-green">
            {employees.length > 0 ? Math.round((totalPass / employees.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="emp-filter-card" style={{ marginBottom: '1.5rem' }}>
        <div className="emp-filter-grid">
          <div className="emp-form-group">
            <label>Country</label>
            <select className="emp-form-control" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
              <option value="">All Countries</option>
              <option value="Russia">🇷🇺 Russia</option>
              <option value="Romania">🇷🇴 Romania</option>
            </select>
          </div>
          <div className="emp-form-group">
            <label>Medical Status</label>
            <select className="emp-form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="emp-empty-state">
          <div className="emp-empty-icon">🏥</div>
          <p>{employees.length === 0 ? 'No employees registered yet.' : 'No employees match the selected filters.'}</p>
        </div>
      ) : (
        <div className="emp-table-wrapper">
          <table className="emp-table emp-medical-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passport</th>
                <th>Country</th>
                <th>Job Category</th>
                <th>Current Status</th>
                <th>Medical Center</th>
                <th>Exam Date</th>
                <th>Actions</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <>
                  <tr key={emp.id} className={`emp-table-row${detailId === emp.id ? ' emp-row-expanded' : ''}`}>
                    <td className="emp-table-num">{i + 1}</td>
                    <td>
                      <div className="emp-table-name">{emp.fullName}</div>
                      <div className="emp-table-sub">{emp.phone1 || '—'}</div>
                    </td>
                    <td className="emp-mono">{emp.passportNumber}</td>
                    <td><span className="emp-country-tag">{emp.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {emp.countryApplied}</span></td>
                    <td>{emp.jobCategory || '—'}</td>
                    <td>
                      <span className={`emp-badge emp-badge-lg ${emp.medicalStatus === 'pass' ? 'emp-badge-pass' : emp.medicalStatus === 'fail' ? 'emp-badge-fail' : 'emp-badge-pending'}`}>
                        {emp.medicalStatus === 'pass' ? '✅ Pass' : emp.medicalStatus === 'fail' ? '❌ Fail' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="emp-form-control emp-inline-input"
                        placeholder="Center name…"
                        value={medCenter[emp.id] ?? (emp.medicalCenter || '')}
                        onChange={e => setMedCenter(prev => ({ ...prev, [emp.id]: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="emp-form-control emp-inline-input"
                        value={medDate[emp.id] ?? (emp.medicalDate || '')}
                        onChange={e => setMedDate(prev => ({ ...prev, [emp.id]: e.target.value }))}
                      />
                    </td>
                    <td>
                      <div className="emp-med-btn-group">
                        <button
                          className={`emp-med-btn emp-med-btn-pass${emp.medicalStatus === 'pass' ? ' active' : ''}`}
                          disabled={updating === emp.id}
                          onClick={() => handleStatusUpdate(emp, 'pass')}
                        >
                          {updating === emp.id ? '…' : 'Pass'}
                        </button>
                        <button
                          className={`emp-med-btn emp-med-btn-fail${emp.medicalStatus === 'fail' ? ' active' : ''}`}
                          disabled={updating === emp.id}
                          onClick={() => handleStatusUpdate(emp, 'fail')}
                        >
                          {updating === emp.id ? '…' : 'Fail'}
                        </button>
                        <button
                          className="emp-med-btn emp-med-btn-pending"
                          disabled={updating === emp.id || emp.medicalStatus === 'pending'}
                          onClick={() => handleStatusUpdate(emp, 'pending')}
                        >
                          Reset
                        </button>
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
                  {detailId === emp.id && (
                    <tr key={`${emp.id}-notes`} className="emp-notes-row">
                      <td colSpan={10}>
                        <div className="emp-notes-panel">
                          <label>Medical Notes for {emp.fullName}</label>
                          <textarea
                            className="emp-form-control"
                            rows={3}
                            placeholder="Enter medical notes, observations, or remarks…"
                            value={medNotes[emp.id] ?? (emp.medicalNotes || '')}
                            onChange={e => setMedNotes(prev => ({ ...prev, [emp.id]: e.target.value }))}
                          />
                          <button
                            className="emp-btn-primary"
                            style={{ marginTop: '0.75rem' }}
                            onClick={() => handleStatusUpdate(emp, emp.medicalStatus)}
                            disabled={updating === emp.id}
                          >
                            {updating === emp.id ? 'Saving…' : 'Save Notes'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
