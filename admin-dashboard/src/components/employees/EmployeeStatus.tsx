import React, { useState, useEffect } from 'react';
import type { Employee, TrackingStep } from '../../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

interface Props {
  employees: Employee[];
  onNavigate?: (tab: 'emp-search' | 'emp-edit') => void;
  onUpdate?: (id: string, data: Partial<Employee>) => Promise<void>;
}

const getCountrySteps = (country: string) => {
  const isRussia = country?.toLowerCase() === 'russia';
  return [
    'Video Upload',
    'Photo Upload',
    'Medical Receipt',
    'Medical Report',
    'Apply the Company',
    'Invitation',
    isRussia ? 'Russian Agreement' : 'Romania Agreement',
    'English Agreement',
    isRussia ? 'Russian Embassy Process' : 'Romanian Embassy Process',
    'Bureau Done',
    'Tickets',
  ];
};

const getInitializeTracking = (employee: Employee): TrackingStep[] => {
  const steps = getCountrySteps(employee.countryApplied);
  const currentTracking = employee.tracking || [];
  const trackingMap = new Map(currentTracking.map(t => [t.step, t]));
  
  return steps.map(stepName => {
    const existing = trackingMap.get(stepName);
    if (existing) return existing;
    
    // Fallback/map from older tracking step names if any
    if (stepName === 'Medical Report') {
      const oldMed = trackingMap.get('Medical Examination');
      if (oldMed) return { step: 'Medical Report', completed: oldMed.completed, date: oldMed.date, fileUrl: oldMed.fileUrl };
    }
    if (stepName === 'Russian Embassy Process' || stepName === 'Romanian Embassy Process') {
      const oldEmb = trackingMap.get('Embassy Interview');
      if (oldEmb) return { step: stepName, completed: oldEmb.completed, date: oldEmb.date, fileUrl: oldEmb.fileUrl };
    }
    
    return {
      step: stepName,
      completed: false,
      date: null,
      fileUrl: null
    };
  });
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const getDaysActive = (registeredAt: string): string => {
  if (!registeredAt) return '—';
  try {
    const diffTime = Date.now() - new Date(registeredAt).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${Math.max(0, diffDays)} Days`;
  } catch {
    return '—';
  }
};

export const EmployeeStatus: React.FC<Props> = ({ employees, onNavigate: _onNavigate, onUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [currentTracking, setCurrentTracking] = useState<TrackingStep[]>([]);
  const [uploadingSteps, setUploadingSteps] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sync currentTracking when selectedEmployee updates
  useEffect(() => {
    if (selectedEmployee) {
      const latest = employees.find(e => e.id === selectedEmployee.id) || selectedEmployee;
      setCurrentTracking(getInitializeTracking(latest));
    } else {
      setCurrentTracking([]);
    }
  }, [selectedEmployee, employees]);

  // Search dynamically or when user types exact Passport/NIC
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length >= 5) {
      const match = employees.find(e => 
        e.passportNumber?.toLowerCase() === q ||
        e.nicNumber?.toLowerCase() === q
      );
      if (match) {
        setSelectedEmployee(match);
        setSearchError('');
      }
    }
  }, [searchQuery, employees]);

  const last10Employees = [...employees]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 10);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    const match = employees.find(e => 
      e.passportNumber?.toLowerCase() === q ||
      e.nicNumber?.toLowerCase() === q ||
      e.fullName?.toLowerCase().includes(q)
    );

    if (match) {
      setSelectedEmployee(match);
      setSearchError('');
    } else {
      setSearchError('No employee found matching passport, NIC, or name.');
    }
  };

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSearchQuery('');
    setSearchError('');
  };

  const toggleStepCompleted = (index: number) => {
    const updated = [...currentTracking];
    const isCompleted = !updated[index].completed;
    updated[index] = {
      ...updated[index],
      completed: isCompleted,
      date: isCompleted ? new Date().toISOString().split('T')[0] : null
    };
    setCurrentTracking(updated);
  };

  const handleFileChange = async (index: number, files: FileList | null) => {
    if (!files || !files.length || !selectedEmployee) return;
    const file = files[0];

    setUploadingSteps(prev => ({ ...prev, [index]: true }));

    try {
      const stepName = currentTracking[index].step;
      const cleanedStepName = stepName.replace(/[^a-zA-Z0-9]/g, '_');
      const storagePath = `employees/${selectedEmployee.id}/${cleanedStepName}_${file.name}`;
      const fileRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const updated = [...currentTracking];
      updated[index] = {
        ...updated[index],
        completed: true,
        fileUrl: downloadUrl,
        date: new Date().toISOString().split('T')[0]
      };
      setCurrentTracking(updated);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed. Please try again.');
    } finally {
      setUploadingSteps(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSaveProgress = async () => {
    if (!selectedEmployee) return;
    setIsSaving(true);
    try {
      await onUpdate?.(selectedEmployee.id, { tracking: currentTracking });
      setSaveToast('Progress updates saved successfully!');
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err) {
      console.error('Error saving progress:', err);
      alert('Failed to save progress updates.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Progress Calculations
  const docsUploadedCount = currentTracking.filter(t => t.fileUrl).length;
  const pendingStepsCount = currentTracking.filter(t => !t.completed).length;
  const totalSteps = currentTracking.length;
  const completionPercentage = totalSteps > 0 ? Math.round((currentTracking.filter(t => t.completed).length / totalSteps) * 100) : 0;

  return (
    <div className="emp-page emp-status-wrapper">
      <div className="emp-page-header emp-no-print">
        <div>
          <h2 className="emp-page-title">Employee Status & Migration Tracking</h2>
          <p className="emp-page-sub">Track documents and progress of registered employees</p>
        </div>
      </div>

      {saveToast && (
        <div className="notification-toast emp-no-print">
          <span>{saveToast}</span>
          <button onClick={() => setSaveToast(null)} style={{ color: 'white', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* 1. Recently Registered Employees Table */}
      <div className="emp-form-section emp-no-print">
        <h3 className="emp-section-heading">Recently Registered (Last 10 Employees)</h3>
        {last10Employees.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No employees registered yet.</p>
        ) : (
          <div className="emp-table-wrapper">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Passport</th>
                  <th>Country</th>
                  <th>Job Order</th>
                  <th>Registered Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {last10Employees.map((emp) => (
                  <tr key={emp.id} className="emp-table-row emp-clickable-row" onClick={() => handleSelectEmployee(emp)}>
                    <td className="emp-table-name">{emp.fullName}</td>
                    <td className="emp-mono">{emp.passportNumber}</td>
                    <td>
                      <span className={`emp-country-tag ${emp.countryApplied?.toLowerCase() === 'romania' ? 'emp-tag-romania' : 'emp-tag-russia'}`}>
                        {emp.countryApplied === 'Russia' ? '🇷🇺' : '🇷🇴'} {emp.countryApplied}
                      </span>
                    </td>
                    <td>{emp.jobCategory || emp.company || '—'}</td>
                    <td>{formatDate(emp.registeredAt)}</td>
                    <td>
                      <span className={`emp-badge ${emp.status === 'active' ? 'emp-badge-pass' : 'emp-badge-fail'}`}>
                        {emp.status === 'active' ? 'Registered' : 'Archived'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Search Box */}
      <form onSubmit={handleSearchSubmit} className="emp-search-box-wrap emp-no-print" style={{ marginBottom: '2rem' }}>
        <div className="emp-search-icon">🔍</div>
        <input
          type="text"
          className="emp-search-input"
          placeholder="Search Employee (NIC, Passport, or Name)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button type="button" className="emp-search-clear" onClick={() => { setSearchQuery(''); setSearchError(''); }}>✕</button>
        )}
      </form>
      {searchError && <p className="emp-no-print" style={{ color: 'var(--red)', marginTop: '-1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>{searchError}</p>}

      {/* 3. Selected Employee Tracking Info */}
      {selectedEmployee && (
        <>
          {/* Progress Overview Card */}
          <div className="emp-progress-card emp-no-print">
            <div className="emp-progress-header">
              <span className="emp-progress-title">Overall Migration Progress</span>
              <span className="emp-progress-percentage">{completionPercentage}%</span>
            </div>
            <div className="emp-progress-bar-container">
              <div className="emp-progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <div className="emp-stats-row">
              <div className="emp-stat-card-lite">
                <div className="label">Docs Uploaded</div>
                <div className="value">{docsUploadedCount}</div>
              </div>
              <div className="emp-stat-card-lite">
                <div className="label">Pending Steps</div>
                <div className="value">{pendingStepsCount}</div>
              </div>
            </div>
          </div>

          {/* Employee Profile details */}
          <div className="emp-form-section emp-no-print">
            <h3 className="emp-section-heading">Employee Profile</h3>
            <div className="emp-details-grid">
              <div className="emp-detail-item">
                <span className="emp-detail-label">Employee Name</span>
                <span className="emp-detail-value" style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedEmployee.fullName}
                </span>
                <span className={`emp-country-tag ${selectedEmployee.countryApplied?.toLowerCase() === 'romania' ? 'emp-tag-romania' : 'emp-tag-russia'}`} style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                  {selectedEmployee.countryApplied === 'Russia' ? '🇷🇺 Russia' : '🇷🇴 Romania'}
                </span>
              </div>
              <div className="emp-detail-item">
                <span className="emp-detail-label">Passport No.</span>
                <span className="emp-detail-value emp-mono">{selectedEmployee.passportNumber}</span>
              </div>
              <div className="emp-detail-item">
                <span className="emp-detail-label">Registration Date</span>
                <span className="emp-detail-value">{formatDate(selectedEmployee.registeredAt)}</span>
              </div>
              <div className="emp-detail-item">
                <span className="emp-detail-label">Days Active</span>
                <span className="emp-detail-value active">{getDaysActive(selectedEmployee.registeredAt)}</span>
              </div>
              <div className="emp-detail-item">
                <span className="emp-detail-label">Expected Job Order</span>
                <span className="emp-detail-value">{selectedEmployee.jobCategory || selectedEmployee.company || '—'}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Checklist */}
          <div className="emp-form-section emp-no-print">
            <h3 className="emp-section-heading">{selectedEmployee.countryApplied} Migration Checklist</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Upload documents and mark checkboxes when steps are completed. This will be used for filtering.
            </p>

            <div className="emp-checklist-grid">
              {currentTracking.map((step, idx) => (
                <div key={idx} className={`emp-checklist-card ${step.completed ? 'completed' : ''}`}>
                  <div className="emp-checklist-header">
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => toggleStepCompleted(idx)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                    />
                    <span className="emp-checklist-label" onClick={() => toggleStepCompleted(idx)}>{step.step}</span>
                  </div>

                  <input
                    type="file"
                    onChange={(e) => handleFileChange(idx, e.target.files)}
                    className={step.fileUrl ? 'file-uploaded' : ''}
                    disabled={uploadingSteps[idx]}
                  />

                  {uploadingSteps[idx] && (
                    <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center' }}>
                      Uploading file...
                    </div>
                  )}

                  {!uploadingSteps[idx] && step.fileUrl ? (
                    <div className="emp-file-ok">
                      <a href={step.fileUrl} target="_blank" rel="noreferrer">✓ View Document</a>
                    </div>
                  ) : (
                    !uploadingSteps[idx] && <div className="emp-file-missing">No file uploaded</div>
                  )}
                </div>
              ))}
            </div>

            <div className="emp-actions-row">
              <button className="emp-btn-secondary" onClick={handlePrint}>Print Application Form</button>
              <button className="emp-btn-primary" onClick={handleSaveProgress} disabled={isSaving}>
                {isSaving ? 'Saving Updates...' : 'Save Progress Updates'}
              </button>
            </div>
          </div>

          {/* 4. Print-Only Container */}
          <div id="printableDetail" className="print-only" style={{ display: 'none' }}>
            <div style={{ color: '#000', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
              <h1 style={{ fontSize: '24px', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
                O.G. Agency — Employee Migration Record
              </h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <div>
                  <p style={{ margin: '8px 0' }}><strong>Full Name:</strong> {selectedEmployee.fullName}</p>
                  <p style={{ margin: '8px 0' }}><strong>Passport Number:</strong> {selectedEmployee.passportNumber}</p>
                  <p style={{ margin: '8px 0' }}><strong>NIC Number:</strong> {selectedEmployee.nicNumber || '—'}</p>
                  <p style={{ margin: '8px 0' }}><strong>Country Applied:</strong> {selectedEmployee.countryApplied}</p>
                </div>
                <div>
                  <p style={{ margin: '8px 0' }}><strong>Registration Date:</strong> {formatDate(selectedEmployee.registeredAt)}</p>
                  <p style={{ margin: '8px 0' }}><strong>Days Active:</strong> {getDaysActive(selectedEmployee.registeredAt)}</p>
                  <p style={{ margin: '8px 0' }}><strong>Job Order No.:</strong> {selectedEmployee.jobCategory || selectedEmployee.company || '—'}</p>
                  <p style={{ margin: '8px 0' }}><strong>Contact Info:</strong> {selectedEmployee.phone1 || selectedEmployee.email || '—'}</p>
                </div>
              </div>

              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '15px' }}>
                Migration Checklist Progress Summary
              </h2>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #000', textAlign: 'left' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Migration Step</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Status</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Updated Date</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Document Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTracking.map((step, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{step.step}</td>
                      <td style={{ padding: '10px', color: step.completed ? 'green' : 'red', fontWeight: 'bold' }}>
                        {step.completed ? '✓ Completed' : '✗ Pending'}
                      </td>
                      <td style={{ padding: '10px' }}>{step.date ? formatDate(step.date) : '—'}</td>
                      <td style={{ padding: '10px' }}>
                        {step.fileUrl ? 'Yes (Uploaded)' : 'No File'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #000', height: '40px' }}></div>
                  <p style={{ marginTop: '5px', fontSize: '12px' }}>Authorized Signature</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #000', height: '40px' }}></div>
                  <p style={{ marginTop: '5px', fontSize: '12px' }}>Date printed: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
