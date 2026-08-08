import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Employee, TrackingStep, AdvancePayment, AgentPayment } from '../../types';
import { compressImage } from '../../imageCompressor';
import {
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  User,
  Calendar,
  Briefcase,
  Printer,
  Save,
  FileCheck,
  Image as ImageIcon,
  Video,
  X,
  Sparkles,
  Globe,
  ExternalLink,
  Download,
  Plus,
  DollarSign,
  Wallet,
  Receipt
} from 'lucide-react';

interface Props {
  employees: Employee[];
  onNavigate?: (tab: any) => void;
  onUpdate?: (id: string, data: Partial<Employee>) => Promise<void>;
}

const getCountrySteps = (country: string) => {
  const dest = country || 'Destination';
  const isRussia = dest.toLowerCase() === 'russia';
  const isRomania = dest.toLowerCase() === 'romania';
  const adj = isRussia ? 'Russian' : isRomania ? 'Romanian' : dest;

  return [
    'Video Upload',
    'Photo Upload',
    'Medical Receipt',
    'Medical Report',
    'Apply the Company',
    'Invitation',
    `${adj} Agreement`,
    'English Agreement',
    `${adj} Embassy Process`,
    'Bureau Done',
    'Tickets',
  ];
};

export const COUNTRY_CODES: Record<string, string> = {
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

export const renderCountryFlagTag = (country: string) => {
  const code = COUNTRY_CODES[country?.toLowerCase()?.trim() || ''];
  return (
    <span
      className={`emp-country-tag ${country?.toLowerCase() === 'romania' ? 'emp-tag-romania' : 'emp-tag-russia'}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontWeight: 600 }}
    >
      {code ? (
        <img
          src={`https://flagcdn.com/w40/${code}.png`}
          alt={country}
          style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px', display: 'inline-block' }}
        />
      ) : (
        <Globe size={13} />
      )}
      <span>{country || 'Destination'}</span>
    </span>
  );
};

const getInitializeTracking = (employee: Employee): TrackingStep[] => {
  const steps = getCountrySteps(employee.countryApplied);
  const currentTracking = employee.tracking || [];
  const trackingMap = new Map(currentTracking.map(t => [t.step, t]));

  return steps.map(stepName => {
    const existing = trackingMap.get(stepName);
    if (existing) return existing;

    // Migration logic for legacy hardcoded step names
    if (stepName.includes('Agreement') && stepName !== 'English Agreement') {
      const legacy = trackingMap.get('Romania Agreement') || trackingMap.get('Russian Agreement');
      if (legacy) return { ...legacy, step: stepName };
    }
    if (stepName.includes('Embassy Process')) {
      const legacy = trackingMap.get('Romanian Embassy Process') || trackingMap.get('Russian Embassy Process');
      if (legacy) return { ...legacy, step: stepName };
    }

    if (stepName === 'Medical Report') {
      const oldMed = trackingMap.get('Medical Examination');
      if (oldMed) return { step: 'Medical Report', completed: oldMed.completed, date: oldMed.date, fileUrl: oldMed.fileUrl };
    }
    if (stepName.includes('Embassy Process')) {
      const oldEmb = trackingMap.get('Embassy Interview');
      if (oldEmb) return { step: stepName, completed: oldEmb.completed, date: oldEmb.date, fileUrl: oldEmb.fileUrl };
    }
    if (stepName === 'Bureau Done') {
      const oldBur = trackingMap.get('Bureau Registration');
      if (oldBur) return { step: 'Bureau Done', completed: oldBur.completed, date: oldBur.date, fileUrl: oldBur.fileUrl };
    }

    return {
      step: stepName,
      completed: false,
      date: null,
      fileUrl: null,
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
      year: 'numeric',
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

const getFileTypeIcon = (stepName: string) => {
  const name = stepName.toLowerCase();
  if (name.includes('video')) return <Video size={16} style={{ color: '#8b5cf6' }} />;
  if (name.includes('photo') || name.includes('picture')) return <ImageIcon size={16} style={{ color: '#06b6d4' }} />;
  return <FileText size={16} style={{ color: '#3b82f6' }} />;
};

const AGENT_OPTIONS = [
  'Abiman kurunagala',
  'dilhara',
  'Dilhara',
  'Kelum',
  'Nadila',
  'Nimesh',
  'NISAL',
  'PRABU',
  'UPUL',
  'Vimukthi',
];

export const EmployeeStatus: React.FC<Props> = ({ employees, onUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTracking, setCurrentTracking] = useState<TrackingStep[]>([]);
  const [uploadingSteps, setUploadingSteps] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<{ url: string; title: string } | null>(null);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string } | null>(null);

  // Money Management States
  const [totalAgreedAmount, setTotalAgreedAmount] = useState<number>(0);
  const [advances, setAdvances] = useState<AdvancePayment[]>([]);
  const [agentPayments, setAgentPayments] = useState<AgentPayment[]>([]);

  const [newAdvance, setNewAdvance] = useState<Partial<AdvancePayment>>({});
  const [newAgentPayment, setNewAgentPayment] = useState<Partial<AgentPayment>>({});

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const advanceReceiptRef = useRef<HTMLInputElement | null>(null);
  const agentReceiptRef = useRef<HTMLInputElement | null>(null);

  // Sync currentTracking when selectedEmployee updates
  useEffect(() => {
    if (employees.length === 1 && selectedEmployee?.id !== employees[0].id) {
      setSelectedEmployee(employees[0]);
    } else if (employees.length === 0) {
      setSelectedEmployee(null);
    }
  }, [employees, selectedEmployee?.id]);

  useEffect(() => {
    if (selectedEmployee) {
      const latest = employees.find(e => e.id === selectedEmployee.id) || selectedEmployee;
      setCurrentTracking(getInitializeTracking(latest));
      setTotalAgreedAmount(latest.totalAgreedAmount || 0);
      setAdvances(latest.advances || []);
      setAgentPayments(latest.agentPayments || []);
      setNewAdvance({});
      setNewAgentPayment({});
    } else {
      setCurrentTracking([]);
      setTotalAgreedAmount(0);
      setAdvances([]);
      setAgentPayments([]);
    }
  }, [selectedEmployee, employees]);

  const displayedEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return [...employees]
        .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
        .slice(0, 10);
    }
    return employees.filter(
      e =>
        e.passportNumber?.toLowerCase().includes(q) ||
        e.nicNumber?.toLowerCase().includes(q) ||
        e.fullName?.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
  };

  const toggleStepCompleted = async (index: number) => {
    const updated = [...currentTracking];
    const isCompleted = !updated[index].completed;
    updated[index] = {
      ...updated[index],
      completed: isCompleted,
      date: isCompleted ? new Date().toISOString().split('T')[0] : null,
    };
    setCurrentTracking(updated);

    if (selectedEmployee) {
      try {
        await onUpdate?.(selectedEmployee.id, { tracking: updated });
      } catch (err) {
        console.error('Failed to auto-save tracking step status', err);
      }
    }
  };

  const deleteFirebaseFile = async () => {
    // In Base64 mode, we don't need to delete anything from Storage.
    // The data will just be overwritten or removed from the Firestore document when saved.
    return Promise.resolve();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        compressImage(file, { maxWidth: 1400, maxHeight: 1000, quality: 0.8, maxSizeKB: 800 })
          .then(resolve)
          .catch(reject);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      }
    });
  };

  const handleFileChange = async (index: number, files: FileList | null) => {
    if (!files || !files.length || !selectedEmployee) return;
    const file = files[0];

    if (!file.type.startsWith('image/') && file.size > 900 * 1024) {
      setAlertModal({ title: 'File Too Large', message: 'PDF file is too large. Please keep it under 900KB to avoid storage limits.' });
      return;
    }

    setUploadingSteps(prev => ({ ...prev, [index]: true }));

    try {
      const stepObj = currentTracking[index];
      const stepName = stepObj.step;

      const base64Url = await fileToBase64(file);

      const updated = [...currentTracking];
      updated[index] = {
        ...updated[index],
        completed: true,
        fileUrl: base64Url,
        date: new Date().toISOString().split('T')[0],
      };
      setCurrentTracking(updated);
      setSaveToast(`Document uploaded for "${stepName}"`);
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err) {
      console.error('Upload failed:', err);
      setAlertModal({ title: 'Upload Failed', message: 'File upload failed. Please try again.' });
    } finally {
      setUploadingSteps(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDeleteFile = (index: number) => {
    const stepObj = currentTracking[index];
    if (!stepObj.fileUrl) return;
    setDeleteConfirmIdx(index);
  };

  const confirmDeleteFile = async () => {
    if (deleteConfirmIdx === null) return;
    const index = deleteConfirmIdx;
    const stepObj = currentTracking[index];

    setUploadingSteps(prev => ({ ...prev, [index]: true }));
    setDeleteConfirmIdx(null);

    try {
      await deleteFirebaseFile();
      const updated = [...currentTracking];
      updated[index] = {
        ...updated[index],
        fileUrl: null,
        completed: false,
        date: null,
      };
      setCurrentTracking(updated);
      setSaveToast(`Deleted document for "${stepObj.step}"`);
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      setAlertModal({ title: 'Delete Failed', message: 'Failed to delete document from storage.' });
    } finally {
      setUploadingSteps(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleOpenDocument = (url: string, title: string) => {
    setPreviewUrl({ url, title });
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
        setSaveToast('Document downloaded successfully!');
        setTimeout(() => setSaveToast(null), 3000);
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
      setSaveToast('Document download started!');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleSaveProgress = async () => {
    if (!selectedEmployee) return;
    setIsSaving(true);
    try {
      await onUpdate?.(selectedEmployee.id, {
        tracking: currentTracking,
        totalAgreedAmount,
        advances,
        agentPayments
      });
      setSaveToast('Progress & Money Management saved successfully!');
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err) {
      console.error('Error saving tracking progress:', err);
      setAlertModal({ title: 'Save Failed', message: 'Failed to save progress updates. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenericFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        compressImage(file, { maxWidth: 1400, maxHeight: 1000, quality: 0.8, maxSizeKB: 800 })
          .then(resolve)
          .catch(reject);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      }
    });
  };

  const addAdvance = () => {
    if (!newAdvance.amount) return;
    setAdvances([...advances, {
      id: Date.now().toString(),
      description: newAdvance.description || '',
      date: newAdvance.date || new Date().toISOString().split('T')[0],
      amount: Number(newAdvance.amount),
      paymentType: newAdvance.paymentType || 'Hand Over Money',
      receiptUrl: newAdvance.receiptUrl || null
    } as AdvancePayment]);
    setNewAdvance({});
  };

  const addAgentPayment = () => {
    if (!newAgentPayment.amount || !newAgentPayment.agentName) return;
    setAgentPayments([...agentPayments, {
      id: Date.now().toString(),
      agentName: newAgentPayment.agentName,
      amount: Number(newAgentPayment.amount),
      receiptUrl: newAgentPayment.receiptUrl || null
    } as AgentPayment]);
    setNewAgentPayment({});
  };

  const handlePrint = () => {
    window.print();
  };

  // Progress Calculations
  const totalSteps = currentTracking.length;
  const completedStepsCount = currentTracking.filter(t => t.completed).length;
  const docsUploadedCount = currentTracking.filter(t => t.fileUrl).length;
  const pendingStepsCount = totalSteps - completedStepsCount;
  const completionPercentage = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="emp-page emp-status-wrapper">
      {/* Toast Notification */}
      {saveToast && (
        <div className="notification-toast emp-no-print">
          <Sparkles size={16} />
          <span>{saveToast}</span>
          <button onClick={() => setSaveToast(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="emp-page-header emp-no-print">
        <h2 className="emp-page-title">Customer Status & Migration Tracking</h2>
        <p className="emp-page-sub">Monitor customer migration milestones, verify documents, and manage secure uploads</p>
      </div>

      {/* 1. Customer Directory Table & Search (Hidden if only 1 employee passed in) */}
      {employees.length !== 1 && (
        <div className="emp-form-section emp-no-print" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="emp-section-heading" style={{ margin: '0 0 4px 0' }}>
              {searchQuery ? `Search Results (${displayedEmployees.length})` : 'Recently Registered Customers'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
              Select a customer row below to view full migration progress and manage documents
            </p>
          </div>

          {/* Integrated Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', minWidth: '300px', flex: '0 1 340px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="emp-search-input"
              placeholder="Search by Name, Passport, or NIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px', paddingRight: searchQuery ? '32px' : '12px', height: '40px', fontSize: '0.88rem' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {displayedEmployees.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '2.5rem 1.5rem', textAlign: 'center', background: 'var(--surface-light)', borderRadius: 'var(--radius-md)' }}>
            <User size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>{searchQuery ? `No customers matching "${searchQuery}"` : 'No customers registered yet.'}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem' }}>Try searching with a different name, passport number, or NIC.</p>
          </div>
        ) : (
          <div className="emp-table-wrapper">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Passport No.</th>
                  <th>Destination</th>
                  <th>Job Category</th>
                  <th>Registered Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((emp) => {
                  const isSelected = selectedEmployee?.id === emp.id;
                  return (
                    <tr
                      key={emp.id}
                      className={`emp-table-row emp-clickable-row${isSelected ? ' selected-row' : ''}`}
                      onClick={() => handleSelectEmployee(emp)}
                    >
                      <td className="emp-table-name" style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                            {emp.photoUrl ? (
                              <img src={emp.photoUrl} alt={emp.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              emp.fullName ? emp.fullName.charAt(0).toUpperCase() : 'C'
                            )}
                          </div>
                          {emp.fullName}
                        </div>
                      </td>
                      <td className="emp-mono">{emp.passportNumber}</td>
                      <td>
                        {renderCountryFlagTag(emp.countryApplied)}
                      </td>
                      <td>{emp.jobCategory || emp.company || '—'}</td>
                      <td>{formatDate(emp.registeredAt)}</td>
                      <td>
                        <span className={`emp-badge ${emp.status === 'active' ? 'emp-badge-pass' : 'emp-badge-fail'}`}>
                          {emp.status === 'active' ? 'Active' : 'Archived'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* 2. Selected Customer Migration Workspace */}
      {selectedEmployee ? (
        <>
          {/* Employee Header Summary Banner */}
          <div className="emp-status-hero-card emp-no-print">
            <div className="emp-status-hero-header">
              <div className="emp-status-hero-left">
                <div className="emp-status-avatar" style={{ overflow: 'hidden', padding: 0 }}>
                  {selectedEmployee.photoUrl ? (
                    <img src={selectedEmployee.photoUrl} alt={selectedEmployee.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    selectedEmployee.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="emp-status-name">{selectedEmployee.fullName}</h3>
                  <div className="emp-status-meta-row">
                    <span className="emp-status-meta-item">
                      <User size={13} /> {selectedEmployee.passportNumber}
                    </span>
                    <span className="emp-status-meta-item" style={{ padding: 0, background: 'none' }}>
                      {renderCountryFlagTag(selectedEmployee.countryApplied)}
                    </span>
                    <span className="emp-status-meta-item">
                      <Briefcase size={13} /> {selectedEmployee.jobCategory || selectedEmployee.company || 'Standard'}
                    </span>
                    <span className="emp-status-meta-item">
                      <Calendar size={13} /> Registered: {formatDate(selectedEmployee.registeredAt)}
                    </span>
                  </div>
                </div>
              </div>
              {employees.length > 1 && (
                <button
                  type="button"
                  className="emp-btn-outline"
                  onClick={() => setSelectedEmployee(null)}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                >
                  Deselect Customer
                </button>
              )}
            </div>
          </div>

          {/* Migration Progress Analytics Dashboard */}
          <div className="emp-progress-analytics-card emp-no-print">
            <div className="emp-analytics-grid">
              {/* Ring / Percentage Chart */}
              <div className="emp-analytics-main">
                <div className="emp-percentage-ring">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${completionPercentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">{completionPercentage}%</text>
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>Overall Migration Progress</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {completionPercentage === 100
                      ? '🎉 All migration steps and documents are completed!'
                      : `${completedStepsCount} of ${totalSteps} migration steps completed`}
                  </p>
                </div>
              </div>

              {/* Stat Metric Tiles */}
              <div className="emp-analytics-tiles">
                <div className="emp-metric-tile">
                  <div className="metric-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="metric-value">{completedStepsCount} / {totalSteps}</div>
                    <div className="metric-label">Completed Steps</div>
                  </div>
                </div>

                <div className="emp-metric-tile">
                  <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <FileCheck size={18} />
                  </div>
                  <div>
                    <div className="metric-value">{docsUploadedCount}</div>
                    <div className="metric-label">Uploaded Documents</div>
                  </div>
                </div>

                <div className="emp-metric-tile">
                  <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="metric-value">{pendingStepsCount}</div>
                    <div className="metric-label">Pending Milestones</div>
                  </div>
                </div>

                <div className="emp-metric-tile">
                  <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="metric-value">{getDaysActive(selectedEmployee.registeredAt)}</div>
                    <div className="metric-label">Days Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Migration Checklist Grid */}
          <div className="emp-form-section emp-no-print">
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 className="emp-section-heading" style={{ margin: '0 0 4px 0' }}>
                {selectedEmployee.countryApplied} Migration Checklist
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Upload verification documents, replace existing files, or toggle step completion.
              </p>
            </div>

            {/* Checklist Grid */}
            <div className="emp-checklist-grid-redesigned">
              {currentTracking.map((stepObj, idx) => {
                const isUploading = uploadingSteps[idx];

                return (
                  <div
                    key={idx}
                    className={`emp-checklist-card-modern ${stepObj.completed ? 'is-completed' : ''}`}
                  >
                    {/* Top Row: Index + Title + Checkbox */}
                    <div className="emp-step-card-header">
                      <div className="emp-step-card-title-group">
                        <span className="emp-step-number">{String(idx + 1).padStart(2, '0')}</span>
                        <span className="emp-step-title">{stepObj.step}</span>
                      </div>

                      <input
                        type="checkbox"
                        checked={stepObj.completed}
                        onChange={() => toggleStepCompleted(idx)}
                        className="emp-step-checkbox"
                        title="Toggle completion"
                      />
                    </div>

                    {/* Middle Row: Status Badge & Upload info */}
                    <div className="emp-step-card-body">
                      {stepObj.step === 'Video Upload' ? (
                        <div className="emp-step-file-empty">
                          <button
                            type="button"
                            className="emp-upload-dropzone-btn"
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed', background: 'transparent' }}
                            title="Cloudflare integration pending"
                          >
                            <Video size={14} /> Cloudflare Config Pending (MP4)
                          </button>
                        </div>
                      ) : isUploading ? (
                        <div className="emp-step-loading">
                          <RefreshCw size={14} className="spin-icon" /> Uploading file to Firebase...
                        </div>
                      ) : stepObj.fileUrl ? (
                        <div className="emp-step-file-active">
                          <div className="emp-file-pill">
                            {getFileTypeIcon(stepObj.step)}
                            <span className="file-name" title={stepObj.step}>Document Uploaded</span>
                          </div>

                          <div className="emp-file-actions">
                            <button
                              type="button"
                              className="emp-action-btn view"
                              onClick={() => handleOpenDocument(stepObj.fileUrl!, stepObj.step)}
                              title="View Document"
                            >
                              <Eye size={13} /> View
                            </button>

                            <button
                              type="button"
                              className="emp-action-btn replace"
                              onClick={() => fileInputRefs.current[idx]?.click()}
                              title="Replace Document"
                            >
                              <RefreshCw size={13} /> Replace
                            </button>

                            <button
                              type="button"
                              className="emp-action-btn delete"
                              onClick={() => handleDeleteFile(idx)}
                              title="Delete Document"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="emp-step-file-empty">
                          <button
                            type="button"
                            className="emp-upload-dropzone-btn"
                            onClick={() => fileInputRefs.current[idx]?.click()}
                          >
                            <Upload size={14} /> Upload File (PDF/Image)
                          </button>
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => { fileInputRefs.current[idx] = el; }}
                        type="file"
                        accept="image/*,application/pdf,video/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(idx, e.target.files)}
                      />
                    </div>

                    {/* Bottom Row: Completion Date */}
                    {stepObj.date && (
                      <div className="emp-step-card-footer">
                        <span>Updated: {formatDate(stepObj.date)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* 4. Money Management Section */}
          <div className="emp-form-section emp-no-print" style={{ marginTop: '2rem' }}>
            <h3 className="emp-section-heading" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={18} /> Money Management
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {/* Total Agreed & Due */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', padding: '0.5rem 0' }}>
                <div style={{ flex: '1 1 250px', maxWidth: '400px' }}>
                  <label className="emp-label">Total Agreed Amount (Rs.)</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="e.g. 500000"
                    value={totalAgreedAmount || ''}
                    onChange={(e) => setTotalAgreedAmount(Number(e.target.value))}
                  />
                </div>

                <div style={{ textAlign: 'right', flex: '1 1 200px' }}>
                  <label className="emp-label" style={{ textAlign: 'right' }}>Total Due Amount (Rs.)</label>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#6366f1', lineHeight: 1.2 }}>
                    {Math.max(
                      0,
                      totalAgreedAmount -
                      advances.reduce((acc, a) => acc + (a.amount || 0), 0) -
                      agentPayments.reduce((acc, a) => acc + (a.amount || 0), 0)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Advances Collected */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={16} /> Advances Collected
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {advances.map((adv, idx) => (
                    <div key={adv.id || idx} style={{ background: 'var(--surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: '1 1 200px' }}>
                        <div style={{ fontWeight: 600 }}>{adv.description || `Advance ${idx + 1}`}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{adv.date} • {adv.paymentType}</div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>Rs. {adv.amount.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {adv.receiptUrl && (
                          <button type="button" className="emp-action-btn view" onClick={() => handleOpenDocument(adv.receiptUrl!, adv.description)}>
                            <Receipt size={13} /> Receipt
                          </button>
                        )}
                        <button type="button" className="emp-action-btn delete" onClick={() => setAdvances(advances.filter(a => a.id !== adv.id))}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Advance Form - Clean Inline Layout */}
                  <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.2fr auto', gap: '1rem', alignItems: 'end' }}>
                      <div>
                        <label className="emp-label">Advance (Description / Date)</label>
                        <input type="text" className="field-input" placeholder="e.g. Initial Deposit - 12 Oct" value={newAdvance.description || ''} onChange={e => setNewAdvance({ ...newAdvance, description: e.target.value })} />
                      </div>
                      <div>
                        <label className="emp-label">Payment Type</label>
                        <select className="field-input" value={newAdvance.paymentType || 'Hand Over Money'} onChange={e => setNewAdvance({ ...newAdvance, paymentType: e.target.value as any })}>
                          <option value="Hand Over Money">Hand Over Money</option>
                          <option value="Bank Deposit">Bank Deposit</option>
                        </select>
                      </div>
                      <div>
                        <label className="emp-label">Amount (Rs.)</label>
                        <input type="number" className="field-input" placeholder="0" value={newAdvance.amount || ''} onChange={e => setNewAdvance({ ...newAdvance, amount: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="emp-label">Transfer Receipt</label>
                        <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} ref={advanceReceiptRef} onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const b64 = await handleGenericFileUpload(e.target.files[0]);
                              setNewAdvance({ ...newAdvance, receiptUrl: b64 });
                            } catch (err) {
                              setAlertModal({ title: 'Error', message: 'Failed to upload receipt.' });
                            }
                          }
                        }} />
                        {newAdvance.receiptUrl ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '42px', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)' }}>
                            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}><CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Attached</span>
                            <button type="button" className="emp-action-btn replace" onClick={() => advanceReceiptRef.current?.click()} title="Change File"><RefreshCw size={12} /></button>
                          </div>
                        ) : (
                          <button type="button" className="emp-upload-dropzone-btn" onClick={() => advanceReceiptRef.current?.click()} style={{ padding: '8px', fontSize: '13px', width: '100%', height: '42px', justifyContent: 'center' }}>
                            <Upload size={14} /> Attach File
                          </button>
                        )}
                      </div>
                      <div>
                        <button type="button" className="emp-btn-primary" onClick={addAdvance} disabled={!newAdvance.amount} style={{ height: '42px', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                          <Plus size={14} /> Add Advance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Payments */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> Agent Payments
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {agentPayments.length === 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>No agent payments recorded yet.</div>
                  )}
                  {agentPayments.map((pay, idx) => (
                    <div key={pay.id || idx} style={{ background: 'var(--surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: '1 1 200px' }}>
                        <div style={{ fontWeight: 600 }}>{pay.agentName}</div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f43f5e' }}>Rs. {pay.amount.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {pay.receiptUrl && (
                          <button type="button" className="emp-action-btn view" onClick={() => handleOpenDocument(pay.receiptUrl!, pay.agentName + ' Receipt')}>
                            <Receipt size={13} /> Receipt
                          </button>
                        )}
                        <button type="button" className="emp-action-btn delete" onClick={() => setAgentPayments(agentPayments.filter(a => a.id !== pay.id))}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Agent Payment Form - Clean Inline Layout */}
                  <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr auto', gap: '1rem', alignItems: 'end' }}>
                      <div>
                        <label className="emp-label">Agent / Receiver</label>
                        <select className="field-input" value={newAgentPayment.agentName || ''} onChange={e => setNewAgentPayment({ ...newAgentPayment, agentName: e.target.value })}>
                          <option value="">Select Agent...</option>
                          {AGENT_OPTIONS.map(agent => (
                            <option key={agent} value={agent}>{agent}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="emp-label">Amount Given (Rs.)</label>
                        <input type="number" className="field-input" placeholder="0" value={newAgentPayment.amount || ''} onChange={e => setNewAgentPayment({ ...newAgentPayment, amount: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="emp-label">Transfer Receipt</label>
                        <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} ref={agentReceiptRef} onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const b64 = await handleGenericFileUpload(e.target.files[0]);
                              setNewAgentPayment({ ...newAgentPayment, receiptUrl: b64 });
                            } catch (err) {
                              setAlertModal({ title: 'Error', message: 'Failed to upload receipt.' });
                            }
                          }
                        }} />
                        {newAgentPayment.receiptUrl ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '42px', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)' }}>
                            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}><CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Attached</span>
                            <button type="button" className="emp-action-btn replace" onClick={() => agentReceiptRef.current?.click()} title="Change File"><RefreshCw size={12} /></button>
                          </div>
                        ) : (
                          <button type="button" className="emp-upload-dropzone-btn" onClick={() => agentReceiptRef.current?.click()} style={{ padding: '8px', fontSize: '13px', width: '100%', height: '42px', justifyContent: 'center' }}>
                            <Upload size={14} /> Attach File
                          </button>
                        )}
                      </div>
                      <div>
                        <button type="button" className="emp-btn-primary" onClick={addAgentPayment} disabled={!newAgentPayment.amount || !newAgentPayment.agentName} style={{ height: '42px', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                          <Plus size={14} /> Add Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Bottom Page Actions (After Money Management) */}
          <div className="emp-no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button className="emp-btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '10px 20px', fontSize: '14px' }}>
              <Printer size={16} /> Print Record
            </button>
            <button className="emp-btn-primary" onClick={handleSaveProgress} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '10px 24px', fontSize: '14px' }}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </>
      ) : employees.length !== 1 ? (
        <div className="emp-empty-state emp-no-print">
          <FileText size={48} className="emp-empty-icon" />
          <h3 className="emp-empty-title">No Customer Selected</h3>
          <p className="emp-empty-sub">
            Select any registered customer from the table above or search by Passport/NIC to view their migration checklist and uploaded documents.
          </p>
        </div>
      ) : null}

      {/* ── Inline Document Previewer Modal ── */}
      {previewUrl && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1000 }} onClick={() => setPreviewUrl(null)}>
          <div className="modal" style={{ maxWidth: 850, width: '92vw', height: '85vh', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '16px 20px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} style={{ color: 'var(--accent)' }} />
                <h3 className="modal-title" style={{ fontSize: 16, fontWeight: 700 }}>{previewUrl.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => openDocumentInNewTab(previewUrl.url)}
                  style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <ExternalLink size={13} /> Open in New Tab
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDownloadDocument(previewUrl.url, previewUrl.title)}
                  style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={13} /> Download
                </button>
                <button
                  className="modal-close"
                  onClick={() => setPreviewUrl(null)}
                  style={{ fontSize: 20, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, background: '#1e1e1e', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewUrl.url.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewUrl.url}
                  title="PDF Viewer"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <img
                  src={previewUrl.url}
                  alt="Document Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmIdx !== null && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1000 }}>
          <div className="modal logout-confirmation">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Delete Document?</h3>
                <p className="logout-confirmation-copy">
                  Are you sure you want to delete the uploaded document for "{currentTracking[deleteConfirmIdx]?.step}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmIdx(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDeleteFile}
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Alert / Error Modal ── */}
      {alertModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1000 }}>
          <div className="modal logout-confirmation">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{alertModal.title}</h3>
                <p className="logout-confirmation-copy">
                  {alertModal.message}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setAlertModal(null)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Printable Application Form (A4 Printable Only) ── */}
      {selectedEmployee && (
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
              {selectedEmployee.photoUrl ? (
                <img src={selectedEmployee.photoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <td className="pf-val">{selectedEmployee.sourceAgency || ''}</td>
                <td className="pf-label">Expected Post</td>
                <td className="pf-val">{selectedEmployee.jobCategory || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Country</td>
                <td className="pf-val">{selectedEmployee.countryApplied || ''}</td>
                <td className="pf-label">Company</td>
                <td className="pf-val">{selectedEmployee.company || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Expected Institution(s)</td>
                <td colSpan={3} className="pf-val">
                  {selectedEmployee.expectedInstitutions && selectedEmployee.expectedInstitutions.length > 0
                    ? selectedEmployee.expectedInstitutions.map((inst, i) => `${i + 1}. ${inst}`).join('   |   ')
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
                <td colSpan={3} className="pf-val" style={{ fontWeight: 600 }}>{selectedEmployee.fullName || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">2. NIC No</td>
                <td className="pf-val">{selectedEmployee.nicNumber || ''}</td>
                <td className="pf-label">Date of Birth</td>
                <td className="pf-val">{selectedEmployee.dob || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">3. Age</td>
                <td className="pf-val">{selectedEmployee.age !== undefined && selectedEmployee.age !== null ? selectedEmployee.age : ''}</td>
                <td className="pf-label">Gender</td>
                <td className="pf-val">{selectedEmployee.gender || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">4. Civil Status</td>
                <td className="pf-val">{selectedEmployee.civilStatus || ''}</td>
                <td className="pf-label">Race</td>
                <td className="pf-val">{selectedEmployee.race || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">5. Passport No</td>
                <td className="pf-val" style={{ fontWeight: 600, letterSpacing: '0.5px' }}>{selectedEmployee.passportNumber || ''}</td>
                <td className="pf-label">Prev. Passport(s)</td>
                <td className="pf-val">{selectedEmployee.previousPassportNumbers || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">6. PP Issued Date</td>
                <td className="pf-val">{selectedEmployee.passportIssuedDate || ''}</td>
                <td className="pf-label">PP Expire Date</td>
                <td className="pf-val">{selectedEmployee.passportExpireDate || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">7. Children</td>
                <td className="pf-val">
                  {selectedEmployee.childrenDetails && selectedEmployee.childrenDetails.length > 0
                    ? selectedEmployee.childrenDetails.length
                    : ''}
                </td>
                <td className="pf-label">Children Age(s)</td>
                <td className="pf-val">
                  {selectedEmployee.childrenDetails && selectedEmployee.childrenDetails.length > 0
                    ? selectedEmployee.childrenDetails.map(c => c.childAge).filter(Boolean).join(', ')
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
                <td colSpan={3} className="pf-val">{selectedEmployee.address || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Postal Town</td>
                <td className="pf-val">{selectedEmployee.postalTown || ''}</td>
                <td className="pf-label">Email</td>
                <td className="pf-val">{selectedEmployee.email || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">9. Telephone (1)</td>
                <td className="pf-val">{selectedEmployee.phone1 || ''}</td>
                <td className="pf-label">Telephone (2)</td>
                <td className="pf-val">{selectedEmployee.phone2 || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">WhatsApp No</td>
                <td className="pf-val">{selectedEmployee.whatsapp || ''}</td>
                <td className="pf-label">District</td>
                <td className="pf-val">{selectedEmployee.adminDistrict || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">DS Division</td>
                <td className="pf-val">{selectedEmployee.dsDivision || ''}</td>
                <td className="pf-label">GN Division</td>
                <td className="pf-val">{selectedEmployee.gnDivision || ''}</td>
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
                  {selectedEmployee.education === 'etc'
                    ? selectedEmployee.educationOther || ''
                    : selectedEmployee.education || ''}
                </td>
                <td className="pf-label">Exp in Sri Lanka</td>
                <td className="pf-val">{selectedEmployee.expSriLanka || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">Period (SL)</td>
                <td className="pf-val">{selectedEmployee.periodSriLanka || ''}</td>
                <td className="pf-label">Been Abroad?</td>
                <td className="pf-val">{selectedEmployee.abroadBefore || ''}</td>
              </tr>
              {selectedEmployee.abroadBefore === 'yes' && (
                <tr>
                  <td className="pf-label">Abroad Country</td>
                  <td className="pf-val">{selectedEmployee.abroadCountry || ''}</td>
                  <td className="pf-label">Period (Abroad)</td>
                  <td className="pf-val">{selectedEmployee.periodAbroad || ''}</td>
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
                <td className="pf-val">{selectedEmployee.motherName || ''}</td>
                <td className="pf-label">Mother Tel</td>
                <td className="pf-val">{selectedEmployee.motherPhone || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">12. Father Name</td>
                <td className="pf-val">{selectedEmployee.fatherName || ''}</td>
                <td className="pf-label">Father Tel</td>
                <td className="pf-val">{selectedEmployee.fatherPhone || ''}</td>
              </tr>
            </tbody>
          </table>

          {/* Children Details (if any) */}
          {selectedEmployee.childrenDetails && selectedEmployee.childrenDetails.length > 0 && (
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
                {selectedEmployee.childrenDetails.map((c, i) => (
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
                <td className="pf-val">{selectedEmployee.trusteeName || ''}</td>
                <td className="pf-label">Relation</td>
                <td className="pf-val">{selectedEmployee.trusteeRelation || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">14. Trustee NIC</td>
                <td className="pf-val">{selectedEmployee.trusteeNIC || ''}</td>
                <td className="pf-label">Trustee DOB</td>
                <td className="pf-val">{selectedEmployee.trusteeDob || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">15. Trustee Tel</td>
                <td className="pf-val">{selectedEmployee.trusteePhone || ''}</td>
                <td className="pf-label">Trustee Address</td>
                <td className="pf-val">{selectedEmployee.trusteeAddress || ''}</td>
              </tr>
            </tbody>
          </table>

          {/* Section G: Banking Details */}
          <table className="pf-table">
            <tbody>
              <tr><td colSpan={4} className="pf-section-title">Section G — Banking Details</td></tr>
              <tr>
                <td className="pf-label">16. Bank Name</td>
                <td className="pf-val">{selectedEmployee.bankName || ''}</td>
                <td className="pf-label">Branch</td>
                <td className="pf-val">{selectedEmployee.bankBranch || ''}</td>
              </tr>
              <tr>
                <td className="pf-label">17. Account No</td>
                <td className="pf-val">{selectedEmployee.accountNumber || ''}</td>
                <td className="pf-label">Account Holder</td>
                <td className="pf-val">{selectedEmployee.accountHolderName || ''}</td>
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
