import { useState } from 'react';
import type { Employee } from '../../types';

interface Props {
  employees: Employee[];
}

export const SearchEmployee: React.FC<Props> = ({ employees }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [copying, setCopying] = useState<string | null>(null);

  const results = query.trim().length >= 2
    ? employees.filter(e => {
        const q = query.toLowerCase();
        return (
          (e.fullName || '').toLowerCase().includes(q) ||
          (e.passportNumber || '').toLowerCase().includes(q) ||
          (e.nicNumber || '').toLowerCase().includes(q) ||
          (e.phone1 || '').includes(q) ||
          (e.phone2 || '').includes(q) ||
          (e.whatsapp || '').includes(q)
        );
      })
    : [];

  const copyField = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(key);
      setTimeout(() => setCopying(null), 1500);
    } catch { /* ignore */ }
  };

  const DetailField: React.FC<{ label: string; value?: string | number | null; copyKey?: string }> = ({ label, value, copyKey }) => (
    <div className="emp-detail-field">
      <label>{label}</label>
      <div className="emp-detail-field-row">
        <span>{value || '—'}</span>
        {copyKey && value && (
          <button className="emp-copy-mini" onClick={() => copyField(String(value), copyKey)} title="Copy">
            {copying === copyKey ? '✓' : '⧉'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Search Employee</h2>
          <p className="emp-page-sub">Search by name, passport number, NIC, or phone number</p>
        </div>
      </div>

      <div className="emp-search-box-wrap">
        <div className="emp-search-icon">🔍</div>
        <input
          type="text"
          className="emp-search-input"
          placeholder="Search by name, passport, NIC, or phone…"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          autoFocus
        />
        {query && (
          <button className="emp-search-clear" onClick={() => { setQuery(''); setSelected(null); }}>✕</button>
        )}
      </div>

      {/* Results table */}
      {query.length >= 2 && !selected && (
        <div className="emp-search-results">
          {results.length === 0 ? (
            <div className="emp-empty-state">
              <div className="emp-empty-icon">🔍</div>
              <p>No employees found matching "<strong>{query}</strong>"</p>
            </div>
          ) : (
            <div className="emp-table-wrapper">
              <p className="emp-results-count">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Passport</th>
                    <th>NIC</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Medical</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((emp, i) => (
                    <tr key={emp.id} className="emp-table-row emp-clickable-row" onClick={() => setSelected(emp)}>
                      <td className="emp-table-num">{i + 1}</td>
                      <td className="emp-table-name">{emp.fullName}</td>
                      <td className="emp-mono">{emp.passportNumber}</td>
                      <td className="emp-mono">{emp.nicNumber || '—'}</td>
                      <td>{emp.phone1 || '—'}</td>
                      <td>{emp.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {emp.countryApplied}</td>
                      <td>
                        <span className={`emp-badge ${emp.medicalStatus === 'pass' ? 'emp-badge-pass' : emp.medicalStatus === 'fail' ? 'emp-badge-fail' : 'emp-badge-pending'}`}>
                          {emp.medicalStatus}
                        </span>
                      </td>
                      <td>
                        <button className="emp-action-btn emp-action-view" onClick={e => { e.stopPropagation(); setSelected(emp); }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="emp-detail-panel" id="printableDetail">
          <div className="emp-detail-panel-header">
            <div>
              <h3 className="emp-detail-name">{selected.fullName}</h3>
              <p className="emp-detail-sub">
                {selected.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {selected.countryApplied} &nbsp;·&nbsp;
                <span className={`emp-badge ${selected.medicalStatus === 'pass' ? 'emp-badge-pass' : selected.medicalStatus === 'fail' ? 'emp-badge-fail' : 'emp-badge-pending'}`}>
                  Medical: {selected.medicalStatus}
                </span>
              </p>
            </div>
            <div className="emp-detail-actions">
              <button className="emp-btn-outline emp-no-print" onClick={() => window.print()}>🖨️ Print</button>
              <button className="emp-btn-outline emp-no-print" onClick={() => setSelected(null)}>← Back</button>
            </div>
          </div>

          <div className="emp-detail-section">
            <div className="emp-detail-section-header">
              <h4>Personal Information</h4>
              <button className="emp-copy-mini" onClick={() => copyField(`${selected.fullName} | Passport: ${selected.passportNumber} | NIC: ${selected.nicNumber}`, 'personal')}>
                {copying === 'personal' ? '✓' : '⧉'}
              </button>
            </div>
            <div className="emp-detail-grid">
              <DetailField label="Full Name" value={selected.fullName} copyKey="fullName" />
              <DetailField label="Passport Number" value={selected.passportNumber} copyKey="passport" />
              <DetailField label="NIC Number" value={selected.nicNumber} copyKey="nic" />
              <DetailField label="Date of Birth" value={selected.dob} />
              <DetailField label="Age" value={selected.age} />
              <DetailField label="Gender" value={selected.gender} />
              <DetailField label="Civil Status" value={selected.civilStatus} />
              <DetailField label="Race" value={selected.race} />
              <DetailField label="Admin District" value={selected.adminDistrict} />
              <DetailField label="Passport Issued" value={selected.passportIssuedDate} />
              <DetailField label="Passport Expires" value={selected.passportExpireDate} />
              <DetailField label="Prev. Passports" value={selected.previousPassportNumbers} />
            </div>
          </div>

          <div className="emp-detail-section">
            <div className="emp-detail-section-header"><h4>Contact & Location</h4></div>
            <div className="emp-detail-grid">
              <DetailField label="Address" value={selected.address} />
              <DetailField label="Postal Town" value={selected.postalTown} />
              <DetailField label="Email" value={selected.email} copyKey="email" />
              <DetailField label="Phone 1" value={selected.phone1} copyKey="phone1" />
              <DetailField label="Phone 2" value={selected.phone2} copyKey="phone2" />
              <DetailField label="WhatsApp" value={selected.whatsapp} copyKey="whatsapp" />
              <DetailField label="DS Division" value={selected.dsDivision} />
              <DetailField label="GN Division" value={selected.gnDivision} />
            </div>
          </div>

          <div className="emp-detail-section">
            <div className="emp-detail-section-header"><h4>Employment Details</h4></div>
            <div className="emp-detail-grid">
              <DetailField label="Country Applied" value={selected.countryApplied} />
              <DetailField label="Agency" value={selected.sourceAgency} />
              <DetailField label="Job Category" value={selected.jobCategory} />
              <DetailField label="Company" value={selected.company} />
              <DetailField label="Expected Institutions" value={(selected.expectedInstitutions || []).join(', ')} />
            </div>
          </div>

          <div className="emp-detail-section">
            <div className="emp-detail-section-header"><h4>Education & Experience</h4></div>
            <div className="emp-detail-grid">
              <DetailField label="Education" value={selected.education === 'etc' ? selected.educationOther : selected.education} />
              <DetailField label="Sri Lanka Exp." value={selected.expSriLanka} />
              <DetailField label="Period (SL)" value={selected.periodSriLanka} />
              <DetailField label="Been Abroad" value={selected.abroadBefore === 'yes' ? 'Yes' : 'No'} />
              {selected.abroadBefore === 'yes' && (
                <>
                  <DetailField label="Abroad Country" value={selected.abroadCountry} />
                  <DetailField label="Abroad Exp." value={selected.expAbroad} />
                  <DetailField label="Period (Abroad)" value={selected.periodAbroad} />
                </>
              )}
            </div>
          </div>

          <div className="emp-detail-section">
            <div className="emp-detail-section-header"><h4>Family & Trustee</h4></div>
            <div className="emp-detail-grid">
              <DetailField label="Mother's Name" value={selected.motherName} />
              <DetailField label="Mother's Phone" value={selected.motherPhone} copyKey="motherPhone" />
              <DetailField label="Father's Name" value={selected.fatherName} />
              <DetailField label="Father's Phone" value={selected.fatherPhone} copyKey="fatherPhone" />
              <DetailField label="Trustee Name" value={selected.trusteeName} />
              <DetailField label="Trustee Relation" value={selected.trusteeRelation} />
              <DetailField label="Trustee Phone" value={selected.trusteePhone} copyKey="trusteePhone" />
              <DetailField label="Trustee NIC" value={selected.trusteeNIC} />
            </div>
          </div>

          {/* Tracking */}
          {selected.tracking && selected.tracking.length > 0 && (
            <div className="emp-detail-section">
              <div className="emp-detail-section-header"><h4>Progress Tracking</h4></div>
              <div className="emp-tracking-grid">
                {selected.tracking.map((step, i) => (
                  <div key={i} className={`emp-track-item${step.completed ? ' emp-track-completed' : ''}`}>
                    <div className="emp-track-indicator">{step.completed ? '✅' : '⏳'}</div>
                    <div>
                      <div className="emp-track-step-name">{step.step}</div>
                      {step.date && <div className="emp-track-date">{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="emp-detail-section">
            <div className="emp-detail-section-header"><h4>Registration Meta</h4></div>
            <div className="emp-detail-grid">
              <DetailField label="Registered At" value={selected.registeredAt ? new Date(selected.registeredAt).toLocaleString() : '—'} />
              <DetailField label="Registered By" value={selected.registeredBy} />
              <DetailField label="Last Updated" value={selected.lastUpdatedAt ? new Date(selected.lastUpdatedAt).toLocaleString() : '—'} />
              <DetailField label="Updated By" value={selected.lastUpdatedBy} />
            </div>
          </div>
        </div>
      )}

      {query.length < 2 && !selected && (
        <div className="emp-search-hint">
          <div className="emp-empty-icon">🔎</div>
          <p>Type at least 2 characters to search employees</p>
        </div>
      )}
    </div>
  );
};
