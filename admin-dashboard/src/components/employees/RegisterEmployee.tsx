import { useState, useRef, useEffect } from 'react';
import type { Destination } from '../../types';
import { Settings, Check, Globe } from 'lucide-react';

const AGENCIES = ['OG Agency', 'Lanka Employment Agency', 'Future Careers', 'Global Placements', 'Colombo Recruitment'];
const COMPANIES_RUSSIA = ['RussMetal Corp', 'SiberiaConstruct', 'VolgaFactory', 'MosMachinery', 'Arctic Industries'];
const COMPANIES_ROMANIA = ['RomTechnica', 'BucharestConstruct', 'TransylvaniaGroup', 'DanubeWorks', 'CarpathinaFactory'];
const JOB_CATEGORIES = ['Factory Worker', 'Construction Worker', 'Welder', 'Electrician', 'Plumber', 'Mechanic', 'Driver', 'Security Guard', 'Cleaner', 'Caregiver', 'Hotel Staff', 'Agriculture', 'IT Technician', 'Other'];

const COUNTRY_CODES: Record<string, string> = {
  'russia': 'ru',
  'romania': 'ro',
  'jordan': 'jo',
  'israel': 'il',
  'saudi arabia': 'sa',
  'uae': 'ae',
  'united arab emirates': 'ae',
  'kuwait': 'kw',
  'qatar': 'qa',
  'oman': 'om',
  'bahrain': 'bh',
  'japan': 'jp',
  'south korea': 'kr',
  'singapore': 'sg',
  'malaysia': 'my',
  'maldives': 'mv',
  'seychelles': 'sc',
  'uk': 'gb',
  'united kingdom': 'gb',
  'usa': 'us',
  'united states': 'us',
  'canada': 'ca',
  'australia': 'au',
  'new zealand': 'nz',
  'poland': 'pl',
  'germany': 'de',
  'italy': 'it',
  'france': 'fr',
  'spain': 'es',
  'portugal': 'pt',
  'cyprus': 'cy',
  'greece': 'gr',
  'sri lanka': 'lk',
  'india': 'in',
};

interface Props {
  destinations?: Destination[];
  onRegister: (data: Record<string, unknown>) => Promise<void>;
  onSuccess?: () => void;
  // Edit mode support
  mode?: 'create' | 'edit';
  initialData?: Record<string, unknown> | null;
  onUpdate?: (id: string, data: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
}

const STORAGE_KEY = 'og_admin_customer_display_countries';

export const RegisterEmployee: React.FC<Props> = (props) => {
  const { 
    destinations = [], 
    onRegister, 
    onSuccess,
    mode = 'create',
    initialData = null,
    onUpdate,
    onCancel
  } = props;

  // Available countries from DB (fallback to Russia & Romania if empty)
  const availableCountries = destinations.length > 0
    ? destinations.map(d => d.country)
    : ['Russia', 'Romania'];

  // Load configured display countries from localStorage, default to Russia & Romania
  const [displayCountries, setDisplayCountries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['Russia', 'Romania'];
  });

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState<string[]>(displayCountries);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [registeredName, setRegisteredName] = useState<string | null>(null);
  const [abroadBefore, setAbroadBefore] = useState('no');
  const [showEduOther, setShowEduOther] = useState(false);
  const [institutions, setInstitutions] = useState<string[]>(['']);
  const [children, setChildren] = useState<{ childName: string; childAge: string }[]>([]);
  const [pendingConfirmData, setPendingConfirmData] = useState<Record<string, unknown> | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const nicDocRef = useRef<HTMLInputElement>(null);
  const passportDocRef = useRef<HTMLInputElement>(null);
  const policeReportDocRef = useRef<HTMLInputElement>(null);
  const photoDocRef = useRef<HTMLInputElement>(null);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const loadingSteps = [
    'Validating form data',
    'Preparing customer record',
    'Saving customer record',
    'Finalising registration',
  ];

  const handleOpenConfig = () => {
    setTempSelectedCountries(displayCountries);
    setIsConfiguring(true);
  };

  const handleToggleCountry = (country: string) => {
    setTempSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleSaveConfig = () => {
    const finalCountries = tempSelectedCountries.length > 0 ? tempSelectedCountries : availableCountries.slice(0, 2);
    setDisplayCountries(finalCountries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCountries));
    setIsConfiguring(false);
  };

  const selectCountry = (country: string) => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
      setShowForm(false);
    } else {
      setSelectedCountry(country);
      setShowForm(true);
    }
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

    const fd = new FormData(formRef.current);
    const data: Record<string, unknown> = {};
    fd.forEach((val, key) => { data[key] = val; });

    data.countryApplied = selectedCountry;
    data.expectedInstitutions = institutions.filter(Boolean);
    data.childrenDetails = children.filter(c => c.childName.trim() || c.childAge.trim());

    const ageEl = document.getElementById('reg-age') as HTMLInputElement;
    if (ageEl?.value) data.age = Number(ageEl.value);

    // Read documents if selected
    try {
      if (nicDocRef.current?.files?.[0]) {
        data.nicDocName = nicDocRef.current.files[0].name;
        data.nicDocUrl = await readFileAsDataURL(nicDocRef.current.files[0]);
      }
      if (passportDocRef.current?.files?.[0]) {
        data.passportDocName = passportDocRef.current.files[0].name;
        data.passportDocUrl = await readFileAsDataURL(passportDocRef.current.files[0]);
      }
      if (policeReportDocRef.current?.files?.[0]) {
        data.policeReportName = policeReportDocRef.current.files[0].name;
        data.policeReportUrl = await readFileAsDataURL(policeReportDocRef.current.files[0]);
      }
      if (photoDocRef.current?.files?.[0]) {
        data.photoDocName = photoDocRef.current.files[0].name;
        data.photoDocUrl = await readFileAsDataURL(photoDocRef.current.files[0]);
      }
    } catch (err) {
      console.error('Error reading document files:', err);
    }

    setPendingConfirmData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmRegister = async () => {
    if (!pendingConfirmData) return;
    setShowConfirmModal(false);
    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, loadingSteps.length - 1));
    }, 600);


    try {
      if (mode === 'edit' && initialData && onUpdate) {
        const id = String(initialData.id || initialData['uid'] || '');
        if (!id) throw new Error('Missing id for edit mode.');
        await onUpdate(id, pendingConfirmData);
      } else {
        await onRegister(pendingConfirmData);
      }

      clearInterval(stepInterval);
      setLoadingStep(loadingSteps.length - 1);
      await new Promise(r => setTimeout(r, 500));

      setLoading(false);
      setRegisteredName(String(pendingConfirmData.fullName || 'Customer'));
      setShowForm(false);
      setSelectedCountry(null);
      setInstitutions(['']);
      setChildren([]);
      setAbroadBefore('no');
      setShowEduOther(false);
      setError('');
      setPendingConfirmData(null);
      formRef.current?.reset();
    } catch (err) {
      clearInterval(stepInterval);
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Registration failed. Please check your network connection.');
    }
  };

  // Populate form when in edit mode with `initialData`
  useEffect(() => {
    if (!initialData) return;
    try {
      const idCountry = String(initialData.countryApplied || '');
      if (idCountry) {
        setSelectedCountry(idCountry);
        setShowForm(true);
      }
      const inst = Array.isArray(initialData.expectedInstitutions) ? initialData.expectedInstitutions : (initialData.expectedInstitutions ? [String(initialData.expectedInstitutions)] : ['']);
      setInstitutions(inst as string[]);
      const ch = Array.isArray(initialData.childrenDetails) ? initialData.childrenDetails : [];
      setChildren(ch as { childName: string; childAge: string }[]);

      // Pre-fill basic inputs when formRef is available
      setTimeout(() => {
        const formEl = formRef.current;
        if (!formEl) return;
        Object.keys(initialData).forEach((key) => {
          try {
            const el = (formEl.elements as any)[key] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined;
            if (el) el.value = String((initialData as any)[key] ?? '');
          } catch {}
        });
      }, 50);
    } catch (e) {
      // ignore
    }
  }, [initialData]);

  // Predefined company suggestions based on country
  const companySuggestions = selectedCountry === 'Russia'
    ? COMPANIES_RUSSIA
    : selectedCountry === 'Romania'
    ? COMPANIES_ROMANIA
    : [];

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
            <div className="emp-overlay-title">Registering Customer</div>
            <div className="emp-overlay-sub">Please wait while we save customer information…</div>
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

      <div className="emp-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="emp-page-title">Register New Customer</h2>
          <p className="emp-page-sub">Select a destination country and fill in all details to register a new customer</p>
        </div>
        {!registeredName && (
          <button
            type="button"
            className="emp-btn-outline"
            onClick={handleOpenConfig}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
          >
            <Settings size={16} />
            Configure Display Countries
          </button>
        )}
      </div>

      {error && <div className="emp-alert emp-alert-error">{error}</div>}

      {/* ── COUNTRY CONFIGURATION MODAL / PANEL ── */}
      {isConfiguring && (
        <div className="emp-card" style={{ marginBottom: '1.5rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Select Countries to Display on Load</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From available database destinations</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {availableCountries.map(countryName => {
              const isChecked = tempSelectedCountries.includes(countryName);
              return (
                <label
                  key={countryName}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.8rem',
                    border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isChecked ? 'rgba(99,102,241,0.08)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCountry(countryName)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontWeight: isChecked ? 600 : 400 }}>{countryName}</span>
                </label>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="emp-btn-outline" onClick={() => setIsConfiguring(false)}>
              Cancel
            </button>
            <button type="button" className="emp-btn-primary" onClick={handleSaveConfig} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} /> Save Selection
            </button>
          </div>
        </div>
      )}

      {/* ── SUCCESS CARD (replaces form after registration) ── */}
      {registeredName && (
        <div className="emp-success-card">
          <div className="emp-success-icon">🎉</div>
          <h3 className="emp-success-title">Customer Registered!</h3>
          <p className="emp-success-sub">
            <strong>{registeredName}</strong> has been successfully registered.
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
              📋 View All Customers
            </button>
          </div>
        </div>
      )}

      {/* Country Selection Buttons (Hidden in edit mode) */}
      {!registeredName && !isConfiguring && mode !== 'edit' && (
        <div className="emp-country-grid">
          {Array.from(new Set([...displayCountries, ...(selectedCountry ? [selectedCountry] : [])])).map(countryName => {
            const destObj = destinations.find(d => d.country.toLowerCase() === countryName.toLowerCase());
            const isSelected = selectedCountry === countryName;
            const countryCode = COUNTRY_CODES[countryName.toLowerCase()];

            return (
              <button
                key={countryName}
                type="button"
                className={`emp-country-btn${isSelected ? ' selected' : ''}`}
                style={{ backgroundImage: `url(${destObj?.heroImage || ''})` }}
                onClick={() => selectCountry(countryName)}
              >
                <div className="emp-country-btn-overlay"></div>
                {isSelected && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: '#10b981', color: 'white', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
                <div className="emp-country-btn-content">
                  <div className="emp-flag-circle">
                    {countryCode ? (
                      <img 
                        src={`https://flagcdn.com/w80/${countryCode}.png`}
                        alt={`${countryName} flag`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <Globe size={24} />
                      </div>
                    )}
                  </div>
                  <span className="emp-country-name">{countryName}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showForm && selectedCountry && !isConfiguring && (
        <form ref={formRef} onSubmit={handleSubmit} className="emp-form">
          <input type="hidden" name="countryApplied" value={selectedCountry} />

          {/* 1. Customer Details */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Customer Details</h3>
            <div className="emp-form-grid">
              <div className="emp-form-group">
                <label>Selecting Agency <span style={{ color: 'var(--red)' }}>*</span></label>
                <select className="emp-form-control" name="sourceAgency" required>
                  <option value="">Select Agency</option>
                  {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="emp-form-group">
                <label>Expected Job Category <span style={{ color: 'var(--red)' }}>*</span></label>
                <select className="emp-form-control" name="jobCategory" required>
                  <option value="">Select Category</option>
                  {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="emp-form-group">
                <label>Selecting Company <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  type="text"
                  className="emp-form-control"
                  name="company"
                  list="company-list"
                  placeholder="Type or select company"
                  required
                />
                <datalist id="company-list">
                  {companySuggestions.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="emp-form-group">
                <label>Passport Number <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="text" className="emp-form-control" name="passportNumber" required />
              </div>
              <div className="emp-form-group">
                <label>Passport Issued Date <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="date" className="emp-form-control" name="passportIssuedDate" required />
              </div>
              <div className="emp-form-group">
                <label>Passport Expire Date <span style={{ color: 'var(--red)' }}>*</span></label>
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
                <label>Date of Birth <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  type="date"
                  className="emp-form-control"
                  name="dob"
                  required
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
                <label>Gender <span style={{ color: 'var(--red)' }}>*</span></label>
                <select className="emp-form-control" name="gender" required>
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
              <div className="emp-form-group">
                <label>Trustee DOB</label>
                <input type="date" className="emp-form-control" name="trusteeDob" />
              </div>
            </div>
          </div>

          {/* 6. Children & Responsible Party */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Children & Responsible Party</h3>
            <div className="emp-institutions-list">
              {children.map((child, i) => (
                <div key={i} className="emp-form-grid" style={{ marginBottom: '0.75rem', alignItems: 'center' }}>
                  <div className="emp-form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Child Name #{i + 1}</label>
                    <input
                      type="text"
                      className="emp-form-control"
                      value={child.childName}
                      placeholder="Full Name"
                      onChange={e => {
                        const updated = [...children];
                        updated[i].childName = e.target.value;
                        setChildren(updated);
                      }}
                    />
                  </div>
                  <div className="emp-form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Age</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="emp-form-control"
                        value={child.childAge}
                        placeholder="e.g. 10"
                        onChange={e => {
                          const updated = [...children];
                          updated[i].childAge = e.target.value;
                          setChildren(updated);
                        }}
                      />
                      <button
                        type="button"
                        className="emp-remove-btn"
                        onClick={() => setChildren(children.filter((_, idx) => idx !== i))}
                      >✕</button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => setChildren([...children, { childName: '', childAge: '' }])}
              >
                + Add More Children
              </button>
            </div>
          </div>

          {/* 7. Document Upload */}
          <div className="emp-form-section">
            <h3 className="emp-section-heading">Document Upload</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
              Upload required documents (PDF or JPG/PNG).
            </p>
            <div className="emp-form-grid">
              <div className="emp-form-group">
                <label>NIC Document</label>
                <input type="file" ref={nicDocRef} accept=".pdf,image/*" className="emp-form-control" />
              </div>
              <div className="emp-form-group">
                <label>Passport Document</label>
                <input type="file" ref={passportDocRef} accept=".pdf,image/*" className="emp-form-control" />
              </div>
              <div className="emp-form-group">
                <label>Police Report</label>
                <input type="file" ref={policeReportDocRef} accept=".pdf,image/*" className="emp-form-control" />
              </div>
              <div className="emp-form-group">
                <label>Photo (Passport Size)</label>
                <input type="file" ref={photoDocRef} accept="image/*" className="emp-form-control" />
              </div>
            </div>
          </div>

          {/* 8. Banking Details */}
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
              onClick={onCancel || (() => { setShowForm(false); setSelectedCountry(null); setError(''); })}
            >
              Cancel
            </button>
            <button type="submit" className="emp-btn-primary">
              {mode === 'edit' ? 'Update Customer Details' : 'Register Customer'}
            </button>
          </div>
        </form>
      )}

      {/* Registration Confirmation Modal */}
      {showConfirmModal && pendingConfirmData && (
        <div className="modal-backdrop emp-no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent)' }}>
                {mode === 'edit' ? 'Confirm Customer Update' : 'Confirm Customer Registration'}
              </h3>
              <button onClick={() => setShowConfirmModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {mode === 'edit' ? 'Please review the updated information before saving changes.' : 'Please review the registration summary below before creating the customer record.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', background: 'var(--surface-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div><strong>Full Name:</strong> {String(pendingConfirmData.fullName || '—')}</div>
              <div><strong>Passport No:</strong> {String(pendingConfirmData.passportNumber || '—')}</div>
              <div><strong>Country Applied:</strong> {String(pendingConfirmData.countryApplied || '—')}</div>
              <div><strong>Job Category:</strong> {String(pendingConfirmData.jobCategory || '—')}</div>
              <div><strong>Agency:</strong> {String(pendingConfirmData.sourceAgency || '—')}</div>
              <div><strong>Company:</strong> {String(pendingConfirmData.company || '—')}</div>
              <div><strong>NIC Number:</strong> {String(pendingConfirmData.nicNumber || '—')}</div>
              <div><strong>Phone (1):</strong> {String(pendingConfirmData.phone1 || '—')}</div>
              <div><strong>WhatsApp:</strong> {String(pendingConfirmData.whatsapp || '—')}</div>
              <div><strong>Trustee Name:</strong> {String(pendingConfirmData.trusteeName || '—')}</div>
              <div><strong>Children Count:</strong> {Array.isArray(pendingConfirmData.childrenDetails) ? pendingConfirmData.childrenDetails.length : 0}</div>
              <div><strong>Documents Attached:</strong> {[pendingConfirmData.nicDocName, pendingConfirmData.passportDocName, pendingConfirmData.policeReportName, pendingConfirmData.photoDocName].filter(Boolean).length} files</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="emp-btn-outline" onClick={() => setShowConfirmModal(false)}>
                Back to Edit
              </button>
              <button type="button" className="emp-btn-primary" onClick={handleConfirmRegister}>
                {mode === 'edit' ? 'Confirm & Update Record' : 'Confirm & Create Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
