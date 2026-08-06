import { useState, useRef } from 'react';

const AGENCIES = ['OG Agency', 'Lanka Employment Agency', 'Future Careers', 'Global Placements', 'Colombo Recruitment'];
const COMPANIES_RUSSIA = ['RussMetal Corp', 'SiberiaConstruct', 'VolgaFactory', 'MosMachinery', 'Arctic Industries'];
const COMPANIES_ROMANIA = ['RomTechnica', 'BucharestConstruct', 'TransylvaniaGroup', 'DanubeWorks', 'CarpathinaFactory'];
const JOB_CATEGORIES = ['Factory Worker', 'Construction Worker', 'Welder', 'Electrician', 'Plumber', 'Mechanic', 'Driver', 'Security Guard', 'Cleaner', 'Caregiver', 'Hotel Staff', 'Agriculture', 'IT Technician', 'Other'];

interface Props {
  onRegister: (data: Record<string, unknown>) => Promise<void>;
  onSuccess?: () => void;
}

export const RegisterEmployee: React.FC<Props> = ({ onRegister, onSuccess }) => {
  const [selectedCountry, setSelectedCountry] = useState<'Russia' | 'Romania' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [registeredName, setRegisteredName] = useState<string | null>(null); // success state
  const [abroadBefore, setAbroadBefore] = useState('no');
  const [showEduOther, setShowEduOther] = useState(false);
  const [institutions, setInstitutions] = useState<string[]>(['']);
  const formRef = useRef<HTMLFormElement>(null);

  const loadingSteps = [
    'Validating form data',
    'Preparing employee record',
    'Saving to Firebase',
    'Finalising registration',
  ];

  const selectCountry = (country: 'Russia' | 'Romania') => {
    setSelectedCountry(country);
    setShowForm(true);
    setError('');
    setRegisteredName(null);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return String(age);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || !selectedCountry) return;
    setError('');
    setRegisteredName(null);
    setLoading(true);
    setLoadingStep(0);

    // Collect all form fields
    const fd = new FormData(formRef.current);
    const data: Record<string, unknown> = {};
    fd.forEach((val, key) => { data[key] = val; });

    // Manually set country and institutions (not captured by FormData correctly)
    data.countryApplied = selectedCountry;
    data.expectedInstitutions = institutions.filter(Boolean);

    // Age from the readonly field
    const ageEl = document.getElementById('reg-age') as HTMLInputElement;
    if (ageEl?.value) data.age = Number(ageEl.value);

    // Step animation
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, loadingSteps.length - 1));
    }, 600);

    try {
      await onRegister(data);

      clearInterval(stepInterval);
      setLoadingStep(loadingSteps.length - 1);
      await new Promise(r => setTimeout(r, 500));

      // Show success card — do NOT immediately switch tabs (causes blank page)
      setLoading(false);
      setRegisteredName(String(data.fullName || 'Employee'));
      setShowForm(false);
      setSelectedCountry(null);
      setInstitutions(['']);
      setAbroadBefore('no');
      setShowEduOther(false);
      setError('');
      formRef.current?.reset();
    } catch (err) {
      clearInterval(stepInterval);
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Registration failed. Please check your Firebase connection.');
    }
  };

  const companies = selectedCountry === 'Russia' ? COMPANIES_RUSSIA : COMPANIES_ROMANIA;

  return (
    <div className="emp-page">
      {/* Loading Overlay */}
      {loading && (
        <div className="emp-overlay">
          <div className="emp-overlay-card">
            <div className="emp-dna-loader">
              <div className="emp-dna-ring" />
              <div className="emp-dna-ring" />
              <div className="emp-dna-ring" />
              <div className="emp-dna-core" />
            </div>
            <div className="emp-overlay-title">Registering Employee</div>
            <div className="emp-overlay-sub">Please wait while we save employee information to Firebase…</div>
            <ul className="emp-step-list">
              {loadingSteps.map((step, i) => (
                <li key={step} className={i < loadingStep ? 'done' : i === loadingStep ? 'active' : ''}>
                  <span className="emp-step-dot" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">Register New Employee</h2>
          <p className="emp-page-sub">Select a destination country, fill in all details, and save directly to Firebase</p>
        </div>
      </div>

      {error && <div className="emp-alert emp-alert-error">{error}</div>}

      {/* ── SUCCESS CARD (replaces form after registration) ── */}
      {registeredName && (
        <div className="emp-success-card">
          <div className="emp-success-icon">🎉</div>
          <h3 className="emp-success-title">Employee Registered!</h3>
          <p className="emp-success-sub">
            <strong>{registeredName}</strong> has been successfully saved to Firebase.
          </p>
          <div className="emp-success-actions">
            <button
              className="emp-btn-outline"
              onClick={() => {
                setRegisteredName(null);
                setError('');
              }}
            >
              ➕ Register Another
            </button>
            <button
              className="emp-btn-primary"
              onClick={() => onSuccess?.()}
            >
              📋 View All Employees
            </button>
          </div>
        </div>
      )}
      {/* Country Selection — only show when no success card is active */}
      {!registeredName && <div className="emp-country-grid">
        <button
          type="button"
          className={`emp-country-btn${selectedCountry === 'Russia' ? ' selected' : ''}`}
          onClick={() => selectCountry('Russia')}
        >
          <div className="emp-flag-circle">
            <svg viewBox="0 0 9 6" width="100%" height="100%" preserveAspectRatio="none">
              <rect fill="#fff" width="9" height="2" />
              <rect fill="#0039a6" y="2" width="9" height="2" />
              <rect fill="#d52b1e" y="4" width="9" height="2" />
            </svg>
          </div>
          <span>Russia 🇷🇺</span>
        </button>

        <button
          type="button"
          className={`emp-country-btn${selectedCountry === 'Romania' ? ' selected' : ''}`}
          onClick={() => selectCountry('Romania')}
        >
          <div className="emp-flag-circle">
            <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="none">
              <rect fill="#002B7F" width="1" height="2" />
              <rect fill="#FCD116" x="1" width="1" height="2" />
              <rect fill="#CE1126" x="2" width="1" height="2" />
            </svg>
          </div>
            <span>Romania 🇷🇴</span>
        </button>
      </div>}

      {showForm && selectedCountry && (
        <form ref={formRef} onSubmit={handleSubmit} className="emp-form">
          <input type="hidden" name="countryApplied" value={selectedCountry} />

          {/* 1. Employee Details */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Employee Details</h3>
            <div className="emp-form-grid">
              <div className="emp-form-group">
                <label>Selecting Agency</label>
                <select className="emp-form-control" name="sourceAgency" required>
                  <option value="">Select Agency</option>
                  {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="emp-form-group">
                <label>Expected Job Category</label>
                <select className="emp-form-control" name="jobCategory" required>
                  <option value="">Select Category</option>
                  {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="emp-form-group">
                <label>Selecting Company</label>
                <select className="emp-form-control" name="company" required>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="emp-form-group">
                <label>Passport Number <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="text" className="emp-form-control" name="passportNumber" required />
              </div>
              <div className="emp-form-group">
                <label>Passport Issued Date</label>
                <input type="date" className="emp-form-control" name="passportIssuedDate" required />
              </div>
              <div className="emp-form-group">
                <label>Passport Expire Date</label>
                <input type="date" className="emp-form-control" name="passportExpireDate" required />
              </div>
              <div className="emp-form-group emp-full-width">
                <label>Name in Full (as in passport) <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="text" className="emp-form-control" name="fullName" required />
              </div>
              <div className="emp-form-group">
                <label>Previous Passport Numbers</label>
                <input type="text" className="emp-form-control" name="previousPassportNumbers" />
              </div>
              <div className="emp-form-group">
                <label>NIC Number</label>
                <input type="text" className="emp-form-control" name="nicNumber" />
              </div>
              <div className="emp-form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="emp-form-control"
                  name="dob"
                  onChange={e => {
                    const ageEl = document.getElementById('reg-age') as HTMLInputElement;
                    if (ageEl) ageEl.value = calculateAge(e.target.value);
                  }}
                />
              </div>
              <div className="emp-form-group">
                <label>Age (auto-calculated)</label>
                <input id="reg-age" type="number" className="emp-form-control" name="age" readOnly style={{ background: 'rgba(99,102,241,0.05)' }} />
              </div>
              <div className="emp-form-group">
                <label>Gender</label>
                <select className="emp-form-control" name="gender">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="emp-form-group">
                <label>Civil Status</label>
                <select className="emp-form-control" name="civilStatus">
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="emp-form-group">
                <label>Race</label>
                <input type="text" className="emp-form-control" name="race" />
              </div>
              <div className="emp-form-group">
                <label>Administrative District</label>
                <input type="text" className="emp-form-control" name="adminDistrict" />
              </div>
            </div>
          </div>

          {/* 2. Contact & Location */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Contact & Location Details</h3>
            <div className="emp-form-grid">
              <div className="emp-form-group emp-full-width">
                <label>Address</label>
                <textarea rows={2} className="emp-form-control" name="address" />
              </div>
              <div className="emp-form-group">
                <label>Postal Town</label>
                <input type="text" className="emp-form-control" name="postalTown" />
              </div>
              <div className="emp-form-group">
                <label>Email Address</label>
                <input type="email" className="emp-form-control" name="email" />
              </div>
              <div className="emp-form-group">
                <label>Telephone Number (1)</label>
                <input type="tel" className="emp-form-control" name="phone1" />
              </div>
              <div className="emp-form-group">
                <label>Telephone Number (2)</label>
                <input type="tel" className="emp-form-control" name="phone2" />
              </div>
              <div className="emp-form-group">
                <label>WhatsApp Number</label>
                <input type="tel" className="emp-form-control" name="whatsapp" />
              </div>
              <div className="emp-form-group">
                <label>DS Division</label>
                <input type="text" className="emp-form-control" name="dsDivision" />
              </div>
              <div className="emp-form-group">
                <label>GN Division</label>
                <input type="text" className="emp-form-control" name="gnDivision" />
              </div>
            </div>
          </div>

          {/* 3. Education & Experience */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Education & Experience</h3>
            <div className="emp-form-grid">
              <div className="emp-form-group">
                <label>Education Qualification</label>
                <select
                  className="emp-form-control"
                  name="education"
                  onChange={e => setShowEduOther(e.target.value === 'etc')}
                >
                  <option value="">Select Qualification</option>
                  <option value="O/L">O/L</option>
                  <option value="A/L">A/L</option>
                  <option value="Degree">Degree</option>
                  <option value="etc">etc (Manual Entry)</option>
                </select>
                {showEduOther && (
                  <input
                    type="text"
                    className="emp-form-control"
                    name="educationOther"
                    placeholder="Enter qualification manually"
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
              </div>
              <div className="emp-form-group">
                <label>Experience in Sri Lanka</label>
                <input type="text" className="emp-form-control" name="expSriLanka" />
              </div>
              <div className="emp-form-group">
                <label>Period (Sri Lanka)</label>
                <input type="text" className="emp-form-control" name="periodSriLanka" placeholder="e.g. 2 Years" />
              </div>
              <div className="emp-form-group">
                <label>Been Abroad Before?</label>
                <select
                  className="emp-form-control"
                  name="abroadBefore"
                  value={abroadBefore}
                  onChange={e => setAbroadBefore(e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {abroadBefore === 'yes' && (
                <>
                  <div className="emp-form-group">
                    <label>Experience Abroad</label>
                    <input type="text" className="emp-form-control" name="expAbroad" />
                  </div>
                  <div className="emp-form-group">
                    <label>Period (Abroad)</label>
                    <input type="text" className="emp-form-control" name="periodAbroad" placeholder="e.g. 3 Years" />
                  </div>
                  <div className="emp-form-group">
                    <label>Abroad Country</label>
                    <input type="text" className="emp-form-control" name="abroadCountry" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4. Job & Family */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Job & Family Information</h3>
            <div className="emp-institutions-list">
              {institutions.map((val, i) => (
                <div key={i} className="emp-form-group">
                  <label>Expected Institution {i + 1}</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="emp-form-control"
                      value={val}
                      onChange={e => {
                        const updated = [...institutions];
                        updated[i] = e.target.value;
                        setInstitutions(updated);
                      }}
                    />
                    {institutions.length > 1 && (
                      <button
                        type="button"
                        className="emp-remove-btn"
                        onClick={() => setInstitutions(institutions.filter((_, idx) => idx !== i))}
                      >✕</button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => setInstitutions([...institutions, ''])}
              >
                + Add Institution
              </button>
            </div>
            <div className="emp-form-grid" style={{ marginTop: '1.5rem' }}>
              <div className="emp-form-group">
                <label>Mother's Name</label>
                <input type="text" className="emp-form-control" name="motherName" />
              </div>
              <div className="emp-form-group">
                <label>Mother's Telephone</label>
                <input type="tel" className="emp-form-control" name="motherPhone" />
              </div>
              <div className="emp-form-group">
                <label>Father's Name</label>
                <input type="text" className="emp-form-control" name="fatherName" />
              </div>
              <div className="emp-form-group">
                <label>Father's Telephone</label>
                <input type="tel" className="emp-form-control" name="fatherPhone" />
              </div>
            </div>
          </div>

          {/* 5. Trustee Details */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Trustee Details</h3>
            <div className="emp-form-grid">
              <div className="emp-form-group">
                <label>Trustee Name</label>
                <input type="text" className="emp-form-control" name="trusteeName" />
              </div>
              <div className="emp-form-group">
                <label>Trustee Relation</label>
                <select className="emp-form-control" name="trusteeRelation">
                  <option value="">Select Relation</option>
                  <option value="Wife">Wife</option>
                  <option value="Husband">Husband</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="emp-form-group emp-full-width">
                <label>Trustee Address</label>
                <textarea rows={2} className="emp-form-control" name="trusteeAddress" />
              </div>
              <div className="emp-form-group">
                <label>Trustee Telephone</label>
                <input type="tel" className="emp-form-control" name="trusteePhone" />
              </div>
              <div className="emp-form-group">
                <label>Trustee NIC Number</label>
                <input type="text" className="emp-form-control" name="trusteeNIC" />
              </div>
            </div>
          </div>

          {/* 6. Banking Details */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Banking Details</h3>
            <div className="emp-form-grid">
              <div className="emp-form-group">
                <label>Bank Name</label>
                <input type="text" className="emp-form-control" name="bankName" />
              </div>
              <div className="emp-form-group">
                <label>Bank Branch</label>
                <input type="text" className="emp-form-control" name="bankBranch" />
              </div>
              <div className="emp-form-group">
                <label>Account Number</label>
                <input type="text" className="emp-form-control" name="accountNumber" />
              </div>
              <div className="emp-form-group">
                <label>Account Holder Name</label>
                <input type="text" className="emp-form-control" name="accountHolderName" />
              </div>
            </div>
          </div>

          <div className="emp-form-actions">
            <button
              type="button"
              className="emp-btn-outline"
              onClick={() => { setShowForm(false); setSelectedCountry(null); setError(''); }}
            >
              Cancel
            </button>
            <button type="submit" className="emp-btn-primary">
              💾 Register Employee to Firebase
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
