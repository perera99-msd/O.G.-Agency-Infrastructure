import type { Employee } from '../../types';

interface Props {
  employees: Employee[];
  onNavigate?: (tab: 'emp-search' | 'emp-edit') => void;
}

const getCompletionPercent = (emp: Employee): number => {
  const tracking = emp.tracking || [];
  if (!tracking.length) return 0;
  const done = tracking.filter(t => t.completed).length;
  return Math.round((done / tracking.length) * 100);
};

const MedicalBadge: React.FC<{ status: Employee['medicalStatus'] }> = ({ status }) => {
  const s = status || 'pending';
  const map = {
    pass: 'emp-badge-pass',
    fail: 'emp-badge-fail',
    pending: 'emp-badge-pending',
  };
  const className = map[s] || 'emp-badge-pending';
  return <span className={`emp-badge ${className}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
};

const StatusBadge: React.FC<{ status: Employee['status'] }> = ({ status }) => {
  const s = status || 'active';
  return (
    <span className={`emp-badge ${s === 'active' ? 'emp-badge-active' : 'emp-badge-archived'}`}>
      {s === 'active' ? 'Active' : 'Archived'}
    </span>
  );
};

export const EmployeeStatus: React.FC<Props> = ({ employees, onNavigate }) => {
  const total = employees.length;
  const active = employees.filter(e => e.status === 'active').length;
  const medPass = employees.filter(e => e.medicalStatus === 'pass').length;
  const medFail = employees.filter(e => e.medicalStatus === 'fail').length;
  const medPending = employees.filter(e => e.medicalStatus === 'pending').length;
  const russia = employees.filter(e => e.countryApplied === 'Russia').length;
  const romania = employees.filter(e => e.countryApplied === 'Romania').length;

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Employee Status</h2>
          <p className="emp-page-sub">Overview of all registered employees and their progress</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="emp-stats-grid">
        <div className="emp-stat-card">
          <div className="emp-stat-label">Total Employees</div>
          <div className="emp-stat-value emp-stat-blue">{total}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Active</div>
          <div className="emp-stat-value emp-stat-green">{active}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Medical Pass</div>
          <div className="emp-stat-value emp-stat-green">{medPass}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Medical Fail</div>
          <div className="emp-stat-value emp-stat-red">{medFail}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Med. Pending</div>
          <div className="emp-stat-value emp-stat-amber">{medPending}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Russia 🇷🇺</div>
          <div className="emp-stat-value emp-stat-purple">{russia}</div>
        </div>
        <div className="emp-stat-card">
          <div className="emp-stat-label">Romania 🇷🇴</div>
          <div className="emp-stat-value emp-stat-purple">{romania}</div>
        </div>
      </div>

      {/* Employee Table */}
      {employees.length === 0 ? (
        <div className="emp-empty-state">
          <div className="emp-empty-icon">👤</div>
          <p>No employees registered yet.</p>
        </div>
      ) : (
        <div className="emp-table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passport</th>
                <th>Country</th>
                <th>Agency</th>
                <th>Job Category</th>
                <th>Medical</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const pct = getCompletionPercent(emp);
                return (
                  <tr key={emp.id} className="emp-table-row">
                    <td className="emp-table-num">{i + 1}</td>
                    <td>
                      <div className="emp-table-name">{emp.fullName}</div>
                      <div className="emp-table-sub">{emp.phone1 || emp.email || '—'}</div>
                    </td>
                    <td className="emp-mono">{emp.passportNumber}</td>
                    <td>
                      <span className="emp-country-tag">
                        {emp.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {emp.countryApplied}
                      </span>
                    </td>
                    <td>{emp.sourceAgency || '—'}</td>
                    <td>{emp.jobCategory || '—'}</td>
                    <td><MedicalBadge status={emp.medicalStatus} /></td>
                    <td><StatusBadge status={emp.status} /></td>
                    <td>
                      <div className="emp-progress-wrap">
                        <div className="emp-progress-bar">
                          <div className="emp-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="emp-progress-label">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="emp-action-btns">
                        <button className="emp-action-btn emp-action-edit" onClick={() => onNavigate?.('emp-edit')}>Edit</button>
                        <button className="emp-action-btn emp-action-view" onClick={() => onNavigate?.('emp-search')}>View</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
