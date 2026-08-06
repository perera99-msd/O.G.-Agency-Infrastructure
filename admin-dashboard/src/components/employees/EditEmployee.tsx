import { useState } from 'react';
import type { Employee } from '../../types';

const AGENCIES = ['OG Agency', 'Lanka Employment Agency', 'Future Careers', 'Global Placements', 'Colombo Recruitment'];
const COMPANIES_RUSSIA = ['RussMetal Corp', 'SiberiaConstruct', 'VolgaFactory', 'MosMachinery', 'Arctic Industries'];
const COMPANIES_ROMANIA = ['RomTechnica', 'BucharestConstruct', 'TransylvaniaGroup', 'DanubeWorks', 'CarpathinaFactory'];
const JOB_CATEGORIES = ['Factory Worker', 'Construction Worker', 'Welder', 'Electrician', 'Plumber', 'Mechanic', 'Driver', 'Security Guard', 'Cleaner', 'Caregiver', 'Hotel Staff', 'Agriculture', 'IT Technician', 'Other'];

interface Props {
  employees: Employee[];
  onUpdate: (id: string, data: Partial<Employee>) => Promise<void>;
}

export const EditEmployee: React.FC<Props> = ({ employees, onUpdate }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [locked, setLocked] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Employee>>({});

  const results = query.trim().length >= 2
    ? employees.filter(e => {
        const q = query.toLowerCase();
        return (
          (e.fullName || '').toLowerCase().includes(q) ||
          (e.passportNumber || '').toLowerCase().includes(q) ||
          (e.nicNumber || '').toLowerCase().includes(q)
        );
      })
    : [];

  const selectEmployee = (emp: Employee) => {
    setSelected(emp);
    setForm({ ...emp });
    setLocked(true);
    setSuccess('');
    setError('');
  };

  const handleChange = (field: keyof Employee, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await onUpdate(selected.id, form);
      setSuccess('Employee record updated successfully!');
      setLocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const companies = form.countryApplied === 'Russia' ? COMPANIES_RUSSIA : COMPANIES_ROMANIA;

  const Input: React.FC<{ label: string; field: keyof Employee; type?: string; disabled?: boolean }> = ({ label, field, type = 'text', disabled }) => (
    <div className="emp-form-group">
      <label>{label}</label>
      <input
        type={type}
        className="emp-form-control"
        value={String(form[field] ?? '')}
        onChange={e => handleChange(field, e.target.value)}
        disabled={disabled || locked}
      />
    </div>
  );

  const Select: React.FC<{ label: string; field: keyof Employee; options: string[] }> = ({ label, field, options }) => (
    <div className="emp-form-group">
      <label>{label}</label>
      <select
        className="emp-form-control"
        value={String(form[field] ?? '')}
        onChange={e => handleChange(field, e.target.value)}
        disabled={locked}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Edit Employee</h2>
          <p className="emp-page-sub">Search for an employee, then unlock the form to make changes</p>
        </div>
      </div>

      {/* Search */}
      {!selected && (
        <>
          <div className="emp-search-box-wrap">
            <div className="emp-search-icon">🔍</div>
            <input
              type="text"
              className="emp-search-input"
              placeholder="Search by name, passport, or NIC…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="emp-search-clear" onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          {query.length >= 2 && (
            results.length === 0 ? (
              <div className="emp-empty-state">
                <div className="emp-empty-icon">🔍</div>
                <p>No employees found for "<strong>{query}</strong>"</p>
              </div>
            ) : (
              <div className="emp-table-wrapper">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Name</th><th>Passport</th><th>Country</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((emp, i) => (
                      <tr key={emp.id} className="emp-table-row emp-clickable-row" onClick={() => selectEmployee(emp)}>
                        <td className="emp-table-num">{i + 1}</td>
                        <td className="emp-table-name">{emp.fullName}</td>
                        <td className="emp-mono">{emp.passportNumber}</td>
                        <td>{emp.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {emp.countryApplied}</td>
                        <td>
                          <button className="emp-action-btn emp-action-edit" onClick={e => { e.stopPropagation(); selectEmployee(emp); }}>
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {query.length < 2 && (
            <div className="emp-search-hint">
              <div className="emp-empty-icon">✏️</div>
              <p>Type at least 2 characters to find an employee to edit</p>
            </div>
          )}
        </>
      )}

      {/* Edit Form */}
      {selected && (
        <div className={`emp-edit-panel${locked ? ' emp-edit-locked' : ''}`}>
          <div className="emp-edit-toolbar">
            <div>
              <h3 className="emp-detail-name">{selected.fullName}</h3>
              <p className="emp-detail-sub">Passport: {selected.passportNumber}</p>
            </div>
            <div className="emp-edit-actions">
              <button className="emp-btn-outline" onClick={() => { setSelected(null); setQuery(''); }}>← Back</button>
              {locked
                ? <button className="emp-btn-primary" onClick={() => setLocked(false)}>🔓 Unlock to Edit</button>
                : (
                  <>
                    <button className="emp-btn-outline" onClick={() => { setLocked(true); setForm({ ...selected }); }}>🔒 Lock</button>
                    <button className="emp-btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : '💾 Save Changes'}
                    </button>
                  </>
                )
              }
            </div>
          </div>

          {locked && <div className="emp-locked-notice">🔒 Form is locked. Click "Unlock to Edit" to make changes.</div>}
          {error && <div className="emp-alert emp-alert-error">{error}</div>}
          {success && <div className="emp-alert emp-alert-success">{success}</div>}

          <div className={`emp-edit-fields${locked ? ' emp-fields-locked' : ''}`}>
            {/* Personal */}
            <div className="emp-form-section">
              <h3 className="emp-section-heading">Employee Details</h3>
              <div className="emp-form-grid">
                <Select label="Agency" field="sourceAgency" options={AGENCIES} />
                <Select label="Job Category" field="jobCategory" options={JOB_CATEGORIES} />
                <Select label="Company" field="company" options={companies} />
                <Input label="Passport Number" field="passportNumber" />
                <Input label="Passport Issued Date" field="passportIssuedDate" type="date" />
                <Input label="Passport Expire Date" field="passportExpireDate" type="date" />
                <div className="emp-form-group emp-full-width">
                  <label>Full Name</label>
                  <input type="text" className="emp-form-control" value={form.fullName || ''} onChange={e => handleChange('fullName', e.target.value)} disabled={locked} />
                </div>
                <Input label="Previous Passport Numbers" field="previousPassportNumbers" />
                <Input label="NIC Number" field="nicNumber" />
                <Input label="Date of Birth" field="dob" type="date" />
                <Input label="Age" field="age" type="number" />
                <Select label="Gender" field="gender" options={['Male', 'Female']} />
                <Select label="Civil Status" field="civilStatus" options={['Single', 'Married', 'Divorced', 'Widowed']} />
                <Input label="Race" field="race" />
                <Input label="Administrative District" field="adminDistrict" />
              </div>
            </div>

            {/* Contact */}
            <div className="emp-form-section">
              <h3 className="emp-section-heading">Contact & Location</h3>
              <div className="emp-form-grid">
                <div className="emp-form-group emp-full-width">
                  <label>Address</label>
                  <textarea rows={2} className="emp-form-control" value={form.address || ''} onChange={e => handleChange('address', e.target.value)} disabled={locked} />
                </div>
                <Input label="Postal Town" field="postalTown" />
                <Input label="Email" field="email" type="email" />
                <Input label="Phone 1" field="phone1" type="tel" />
                <Input label="Phone 2" field="phone2" type="tel" />
                <Input label="WhatsApp" field="whatsapp" type="tel" />
                <Input label="DS Division" field="dsDivision" />
                <Input label="GN Division" field="gnDivision" />
              </div>
            </div>

            {/* Family */}
            <div className="emp-form-section">
              <h3 className="emp-section-heading">Family & Trustee</h3>
              <div className="emp-form-grid">
                <Input label="Mother's Name" field="motherName" />
                <Input label="Mother's Phone" field="motherPhone" type="tel" />
                <Input label="Father's Name" field="fatherName" />
                <Input label="Father's Phone" field="fatherPhone" type="tel" />
                <Input label="Trustee Name" field="trusteeName" />
                <Select label="Trustee Relation" field="trusteeRelation" options={['Wife', 'Husband', 'Mother', 'Father', 'Brother', 'Sister', 'Son', 'Daughter', 'Other']} />
                <Input label="Trustee Phone" field="trusteePhone" type="tel" />
                <Input label="Trustee NIC" field="trusteeNIC" />
              </div>
            </div>

            {/* Banking */}
            <div className="emp-form-section">
              <h3 className="emp-section-heading">Banking Details</h3>
              <div className="emp-form-grid">
                <Input label="Bank Name" field="bankName" />
                <Input label="Bank Branch" field="bankBranch" />
                <Input label="Account Number" field="accountNumber" />
                <Input label="Account Holder Name" field="accountHolderName" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
