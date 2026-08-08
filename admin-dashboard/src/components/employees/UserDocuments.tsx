import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../../firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  where
} from 'firebase/firestore';
import {
  Search,
  X,
  Check,
  Download,
  AlertCircle,
  Eye,
  RefreshCw,
  Trash2,
  Upload,
  User,
  FileText,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import type { Employee, Destination } from '../../types';
import { compressImage } from '../../imageCompressor';

interface UserSubmission {
  id: string;
  employeeId: string;
  employeeName: string;
  passportNumber: string;
  stepName: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

interface Props {
  employees?: Employee[];
  destinations?: Destination[];
  onUpdate?: (id: string, updates: Partial<Employee>) => Promise<void>;
}

interface DocumentItem {
  id: string; // key
  title: string;
  type: 'basic' | 'checklist';
  fieldKey?: keyof Employee;
  stepIndex?: number;
  fileUrl?: string | null;
  fileName?: string | null;
  updatedAt?: string | null;
}

const formatDate = (dateString?: string | null): string => {
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

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

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

export const UserDocuments: React.FC<Props> = ({
  employees = [],
  destinations = [],
  onUpdate
}) => {
  // Mobile Submissions State
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [rejectingSub, setRejectingSub] = useState<UserSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // User Document Hub State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  // File Operation State
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string } | null>(null);

  // Hidden File Input Refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time listener for pending submissions
  useEffect(() => {
    const q = query(
      collection(db, 'user_submissions'),
      where('status', '==', 'pending')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserSubmission, 'id'>)
      }) as UserSubmission);

      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setSubmissions(list);
      setLoadingSubs(false);
    }, (err) => {
      console.error("Firestore submissions listener error:", err);
      setLoadingSubs(false);
    });

    return () => unsub();
  }, []);

  // Flag Helper
  const renderFlag = (countryName: string) => {
    if (!countryName) return <span style={{ marginRight: '4px' }}>🌐</span>;
    const dest = destinations.find(d => d.country.toLowerCase() === countryName.toLowerCase());
    let flagVal = dest?.flag;

    if (!flagVal) {
      const lower = countryName.toLowerCase();
      if (lower.includes('russia')) flagVal = '🇷🇺';
      else if (lower.includes('romania')) flagVal = '🇷🇴';
      else if (lower.includes('qatar')) flagVal = '🇶🇦';
      else if (lower.includes('dubai') || lower.includes('uae')) flagVal = '🇦🇪';
      else if (lower.includes('kuwait')) flagVal = '🇰🇼';
      else if (lower.includes('saudi')) flagVal = '🇸🇦';
      else flagVal = '🌐';
    }

    if (flagVal.startsWith('http://') || flagVal.startsWith('https://') || flagVal.startsWith('/') || flagVal.startsWith('data:')) {
      return (
        <img
          src={flagVal}
          alt={countryName}
          style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}
        />
      );
    }
    return <span style={{ marginRight: '4px' }}>{flagVal}</span>;
  };

  // Filtered & Sorted Employees (Recents 1st)
  const filteredEmployees = useMemo(() => {
    let list = [...employees];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(emp =>
        (emp.fullName && emp.fullName.toLowerCase().includes(q)) ||
        (emp.passportNumber && emp.passportNumber.toLowerCase().includes(q)) ||
        (emp.nicNumber && emp.nicNumber.toLowerCase().includes(q)) ||
        (emp.phone1 && emp.phone1.includes(q))
      );
    }

    if (filterCountry) {
      list = list.filter(emp => emp.countryApplied === filterCountry);
    }

    list.sort((a, b) => {
      const timeA = new Date(a.lastUpdatedAt || a.registeredAt || 0).getTime();
      const timeB = new Date(b.lastUpdatedAt || b.registeredAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  }, [employees, searchQuery, filterCountry]);

  // Unique countries list
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => { if (e.countryApplied) set.add(e.countryApplied); });
    return Array.from(set);
  }, [employees]);

  // Currently Selected Employee
  const selectedEmployee = useMemo(() => {
    if (!selectedEmpId) return null;
    return employees.find(e => e.id === selectedEmpId) || null;
  }, [employees, selectedEmpId]);

  // Compute all documents for selected employee
  const selectedEmployeeDocs = useMemo(() => {
    if (!selectedEmployee) return [];
    const docs: DocumentItem[] = [];

    // 1. Basic Documents from Registration
    docs.push({
      id: 'basic_nic',
      title: 'NIC Document',
      type: 'basic',
      fieldKey: 'nicDocUrl',
      fileUrl: selectedEmployee.nicDocUrl,
      fileName: selectedEmployee.nicDocName || 'NIC Card / Document'
    });

    docs.push({
      id: 'basic_passport',
      title: 'Passport Document',
      type: 'basic',
      fieldKey: 'passportDocUrl',
      fileUrl: selectedEmployee.passportDocUrl,
      fileName: selectedEmployee.passportDocName || 'Passport Copy'
    });

    docs.push({
      id: 'basic_police',
      title: 'Police Clearance Report',
      type: 'basic',
      fieldKey: 'policeReportUrl',
      fileUrl: selectedEmployee.policeReportUrl,
      fileName: selectedEmployee.policeReportName || 'Police Report'
    });

    docs.push({
      id: 'basic_photo',
      title: 'Applicant Photograph',
      type: 'basic',
      fieldKey: 'photoUrl',
      fileUrl: selectedEmployee.photoUrl,
      fileName: selectedEmployee.photoDocName || 'Passport Photo'
    });

    // 2. Migration Checklist Documents
    const defaultSteps = getCountrySteps(selectedEmployee.countryApplied || '');
    const currentTracking = selectedEmployee.tracking || [];

    defaultSteps.forEach((stepName, idx) => {
      const foundStep = currentTracking.find(t => t.step === stepName) || currentTracking[idx];
      docs.push({
        id: `checklist_${idx}`,
        title: `Checklist #${idx + 1}: ${stepName}`,
        type: 'checklist',
        stepIndex: idx,
        fileUrl: foundStep?.fileUrl || null,
        fileName: foundStep?.step || stepName,
        updatedAt: foundStep?.date || null
      });
    });

    return docs;
  }, [selectedEmployee]);

  const basicDocs = useMemo(() => selectedEmployeeDocs.filter(d => d.type === 'basic'), [selectedEmployeeDocs]);
  const checklistDocs = useMemo(() => selectedEmployeeDocs.filter(d => d.type === 'checklist'), [selectedEmployeeDocs]);

  // Count uploaded docs for an employee
  const getDocCountForEmp = (emp: Employee) => {
    let count = 0;
    if (emp.nicDocUrl) count++;
    if (emp.passportDocUrl) count++;
    if (emp.policeReportUrl) count++;
    if (emp.photoUrl) count++;
    if (emp.tracking) {
      count += emp.tracking.filter(t => t.fileUrl).length;
    }
    return count;
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        compressImage(file, { maxWidth: 1400, maxHeight: 1000, quality: 0.8, maxSizeKB: 800 })
          .then(resolve)
          .catch(reject);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      }
    });
  };

  // File Replace / Upload Handler
  const handleFileChange = async (docItem: DocumentItem, files: FileList | null) => {
    if (!files || !files.length || !selectedEmployee || !onUpdate) return;
    const file = files[0];

    if (!file.type.startsWith('image/') && file.size > 900 * 1024) {
      setAlertModal({ title: 'File Too Large', message: 'PDF file is too large. Please keep it under 900KB to avoid storage limits.' });
      return;
    }

    setUploadingDocId(docItem.id);

    try {
      const base64Url = await fileToBase64(file);

      if (docItem.type === 'basic' && docItem.fieldKey) {
        // Update basic employee doc field
        const updatePayload: Partial<Employee> = {
          [docItem.fieldKey]: base64Url
        };
        if (docItem.fieldKey === 'nicDocUrl') updatePayload.nicDocName = file.name;
        if (docItem.fieldKey === 'passportDocUrl') updatePayload.passportDocName = file.name;
        if (docItem.fieldKey === 'policeReportUrl') updatePayload.policeReportName = file.name;
        if (docItem.fieldKey === 'photoUrl') updatePayload.photoDocName = file.name;

        await onUpdate(selectedEmployee.id, updatePayload);
      } else if (docItem.type === 'checklist' && docItem.stepIndex !== undefined) {
        // Update tracking checklist step
        const defaultSteps = getCountrySteps(selectedEmployee.countryApplied || '');
        const currentTracking = [...(selectedEmployee.tracking || [])];

        // Ensure array is populated up to stepIndex
        while (currentTracking.length < defaultSteps.length) {
          const idx = currentTracking.length;
          currentTracking.push({
            step: defaultSteps[idx],
            completed: false,
            date: null,
            fileUrl: null
          });
        }

        currentTracking[docItem.stepIndex] = {
          ...currentTracking[docItem.stepIndex],
          completed: true,
          fileUrl: base64Url,
          date: new Date().toISOString().split('T')[0]
        };

        await onUpdate(selectedEmployee.id, { tracking: currentTracking });
      }

      showToast(`Document updated successfully for "${docItem.title}"`);
    } catch (err) {
      console.error('Doc upload error:', err);
      setAlertModal({ title: 'Upload Failed', message: 'Failed to upload document. Please try again.' });
    } finally {
      setUploadingDocId(null);
    }
  };

  // Delete File Handler
  const confirmDeleteFile = async () => {
    if (!deleteConfirmDoc || !selectedEmployee || !onUpdate) return;
    const docItem = deleteConfirmDoc;
    setUploadingDocId(docItem.id);
    setDeleteConfirmDoc(null);

    try {
      if (docItem.type === 'basic' && docItem.fieldKey) {
        await onUpdate(selectedEmployee.id, { [docItem.fieldKey]: null });
      } else if (docItem.type === 'checklist' && docItem.stepIndex !== undefined) {
        const currentTracking = [...(selectedEmployee.tracking || [])];
        if (currentTracking[docItem.stepIndex]) {
          currentTracking[docItem.stepIndex] = {
            ...currentTracking[docItem.stepIndex],
            fileUrl: null,
            completed: false,
            date: null
          };
          await onUpdate(selectedEmployee.id, { tracking: currentTracking });
        }
      }
      showToast(`Deleted document for "${docItem.title}"`);
    } catch (err) {
      console.error('Delete document error:', err);
      setAlertModal({ title: 'Delete Failed', message: 'Failed to delete document.' });
    } finally {
      setUploadingDocId(null);
    }
  };

  // Download File Handler
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
        showToast('Document downloaded successfully!');
      } catch (err) {
        console.error('Download error:', err);
      }
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Document download started!');
    }
  };

  // Open in New Tab Handler
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
        console.error('Error opening document in new tab:', err);
      }
    }
    window.open(url, '_blank');
  };

  // Approve Mobile Submission
  const handleApprove = async (sub: UserSubmission) => {
    const confirmed = window.confirm(`Approve "${sub.stepName}" for ${sub.employeeName}? This will update their documents.`);
    if (!confirmed) return;

    try {
      const empRef = doc(db, 'employees', sub.employeeId);
      const empSnap = await getDoc(empRef);
      if (!empSnap.exists()) {
        alert("Customer not found in database.");
        return;
      }

      const empData = empSnap.data() as Employee;
      const lowerStep = sub.stepName.toLowerCase();
      const updates: Partial<Employee> = {};

      if (lowerStep.includes('nic') || sub.stepName === 'nicDocUrl') {
        updates.nicDocUrl = sub.fileUrl;
        updates.nicDocName = sub.fileName;
      } else if (lowerStep.includes('passport') || sub.stepName === 'passportDocUrl') {
        updates.passportDocUrl = sub.fileUrl;
        updates.passportDocName = sub.fileName;
      } else if (lowerStep.includes('police') || sub.stepName === 'policeReportUrl') {
        updates.policeReportUrl = sub.fileUrl;
        updates.policeReportName = sub.fileName;
      } else if (lowerStep.includes('photo') || lowerStep.includes('photograph') || sub.stepName === 'photoUrl') {
        updates.photoUrl = sub.fileUrl;
        updates.photoDocName = sub.fileName;
      } else {
        // Update Migration Checklist Step
        const updatedTracking = (empData.tracking || []).map(step => {
          if (step.step === sub.stepName || step.step.toLowerCase() === lowerStep) {
            return {
              ...step,
              completed: true,
              fileUrl: sub.fileUrl,
              date: new Date().toISOString().split('T')[0],
              comment: ""
            };
          }
          return step;
        });
        updates.tracking = updatedTracking;
      }

      await updateDoc(empRef, updates);
      await updateDoc(doc(db, 'user_submissions', sub.id), { status: 'approved' });
      showToast("Document approved successfully and employee file updated!");
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve document.");
    }
  };

  // Reject Mobile Submission
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingSub || !rejectReason.trim()) return;

    setIsSubmittingReject(true);
    try {
      await updateDoc(doc(db, 'user_submissions', rejectingSub.id), {
        status: 'rejected',
        comment: rejectReason.trim()
      });

      const empRef = doc(db, 'employees', rejectingSub.employeeId);
      const empSnap = await getDoc(empRef);
      if (empSnap.exists()) {
        const empData = empSnap.data() as Employee;
        const updatedTracking = (empData.tracking || []).map(step => {
          if (step.step === rejectingSub.stepName) {
            return {
              ...step,
              completed: false,
              fileUrl: null,
              date: null,
              comment: rejectReason.trim()
            };
          }
          return step;
        });
        await updateDoc(empRef, { tracking: updatedTracking });
      }

      showToast("Document rejected. Request sent to applicant mobile app.");
      setRejectingSub(null);
      setRejectReason('');
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject document.");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  return (
    <div className="emp-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text-primary, #0f172a)',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color, #e2e8f0)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--green, #10b981)' }} />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">User Document Center</h2>
          <p className="emp-page-sub">Central hub to search users, inspect registration documents, manage migration checklist files, and review mobile submissions</p>
        </div>
      </div>

      {/* Section 1: User Search & Selection */}
      <div className="emp-form-section" style={{ marginBottom: '2rem' }}>
        <h3 className="emp-section-heading" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} /> Search & Select Applicant
        </h3>

        {/* Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Name, Passport, NIC..."
              className="emp-form-control"
              style={{ paddingLeft: '36px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div>
            <select
              className="emp-form-control"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="">All Countries ({uniqueCountries.length})</option>
              {uniqueCountries.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || filterCountry) && (
            <div>
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => { setSearchQuery(''); setFilterCountry(''); }}
                style={{ height: '100%', display: 'inline-flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <X size={14} /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Employee Cards Grid (Recents 1st, default top 6 or search results) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {searchQuery || filterCountry ? `Matching Applicants (${filteredEmployees.length})` : 'Recent Applicants (Select one to view documents)'}
            </span>
          </div>

          {filteredEmployees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No applicants found matching search criteria.
            </div>
          ) : (
            <div className="emp-table-wrapper">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Passport Number</th>
                    <th>NIC Number</th>
                    <th>Destination Country</th>
                    <th>Uploaded Documents</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.slice(0, searchQuery || filterCountry ? 12 : 6).map((emp) => {
                    const isSelected = selectedEmpId === emp.id;
                    const docCount = getDocCountForEmp(emp);

                    return (
                      <tr
                        key={emp.id}
                        className="emp-table-row"
                        onClick={() => setSelectedEmpId(emp.id)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(59, 130, 246, 0.05)' : undefined
                        }}
                      >
                        <td className="emp-table-name" style={{ fontWeight: isSelected ? 700 : undefined }}>
                          {emp.fullName}
                        </td>
                        <td className="emp-mono">{emp.passportNumber || '—'}</td>
                        <td className="emp-mono">{emp.nicNumber || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {renderFlag(emp.countryApplied)}
                            <span>{emp.countryApplied || '—'}</span>
                          </div>
                        </td>
                        <td>
                          <span className="emp-country-tag" style={{ background: docCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: docCount > 0 ? '#10b981' : '#64748b' }}>
                            <FileText size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            {docCount} Uploaded
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className={isSelected ? "emp-btn-primary" : "emp-btn-secondary"}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmpId(emp.id);
                            }}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Selected Employee Documents Manager (100% same UI as Migration Checklist) */}
      {selectedEmployee ? (
        <div className="emp-form-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="emp-section-heading" style={{ margin: 0 }}>
                  Documents for: <span style={{ color: 'var(--primary, #3b82f6)' }}>{selectedEmployee.fullName}</span>
                </h3>
                {renderFlag(selectedEmployee.countryApplied)}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Passport: <strong>{selectedEmployee.passportNumber}</strong> | NIC: <strong>{selectedEmployee.nicNumber || 'N/A'}</strong> | Registered: {formatDate(selectedEmployee.registeredAt)}
              </p>
            </div>

            <button
              type="button"
              className="emp-btn-secondary"
              onClick={() => setSelectedEmpId(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <X size={14} /> Close Documents View
            </button>
          </div>

          {/* Section A: Registration Documents */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(99, 102, 241, 0.15)' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontSize: '1.05rem', fontWeight: 700 }}>
                <ShieldCheck size={20} /> Initial Registration Documents ({basicDocs.length})
              </h4>
              <span className="emp-country-tag" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 700 }}>
                {basicDocs.filter(d => d.fileUrl).length} / {basicDocs.length} Uploaded
              </span>
            </div>

            {/* Card Grid View for Registration Documents */}
            <div className="emp-checklist-grid-redesigned" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {basicDocs.map((docItem) => {
                const isUploading = uploadingDocId === docItem.id;
                const hasFile = Boolean(docItem.fileUrl);

                return (
                  <div
                    key={docItem.id}
                    className={`emp-checklist-card-modern ${hasFile ? 'is-completed' : ''}`}
                    style={{ border: hasFile ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.2)', background: 'var(--card-bg, #ffffff)' }}
                  >
                    {/* Top Header */}
                    <div className="emp-step-card-header" style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '0.65rem 0.85rem' }}>
                      <div className="emp-step-card-title-group">
                        <span className="emp-step-number" style={{ background: '#6366f1', color: '#ffffff', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                          REG
                        </span>
                        <span className="emp-step-title" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{docItem.title}</span>
                      </div>

                      {hasFile ? (
                        <CheckCircle2 size={18} style={{ color: 'var(--green, #10b981)' }} />
                      ) : (
                        <AlertCircle size={18} style={{ color: 'var(--text-muted, #94a3b8)', opacity: 0.5 }} />
                      )}
                    </div>

                    {/* Body / File Actions */}
                    <div className="emp-step-card-body">
                      {isUploading ? (
                        <div className="emp-step-loading">
                          <RefreshCw size={14} className="spin-icon" /> Uploading file to storage...
                        </div>
                      ) : hasFile ? (
                        <div className="emp-step-file-active">
                          <div className="emp-file-pill" style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#4f46e5' }}>
                            <FileText size={14} />
                            <span className="file-name" title={docItem.fileName || docItem.title}>
                              {docItem.fileName || 'Document Uploaded'}
                            </span>
                          </div>

                          <div className="emp-file-actions">
                            <button
                              type="button"
                              className="emp-action-btn view"
                              onClick={() => setPreviewDoc({ url: docItem.fileUrl!, title: docItem.title })}
                              title="View Document"
                            >
                              <Eye size={13} /> View
                            </button>

                            <button
                              type="button"
                              className="emp-action-btn replace"
                              onClick={() => fileInputRefs.current[docItem.id]?.click()}
                              title="Replace Document"
                            >
                              <RefreshCw size={13} /> Replace
                            </button>

                            <button
                              type="button"
                              className="emp-action-btn delete"
                              onClick={() => setDeleteConfirmDoc(docItem)}
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
                            style={{ borderColor: 'rgba(99, 102, 241, 0.3)', color: '#6366f1' }}
                            onClick={() => fileInputRefs.current[docItem.id]?.click()}
                          >
                            <Upload size={14} /> Upload File (PDF/Image)
                          </button>
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => { fileInputRefs.current[docItem.id] = el; }}
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(docItem, e.target.files)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Migration Checklist Documents */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(59, 130, 246, 0.15)' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary, #3b82f6)', fontSize: '1.05rem', fontWeight: 700 }}>
                <FileCheck size={20} /> Migration & Tracking Checklist Documents ({checklistDocs.length} Steps)
              </h4>
              <span className="emp-country-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 700 }}>
                {checklistDocs.filter(d => d.fileUrl).length} / {checklistDocs.length} Completed
              </span>
            </div>

            {/* Card Grid View for Migration Checklist Documents */}
            <div className="emp-checklist-grid-redesigned">
              {checklistDocs.map((docItem) => {
                const isUploading = uploadingDocId === docItem.id;
                const hasFile = Boolean(docItem.fileUrl);

                return (
                  <div
                    key={docItem.id}
                    className={`emp-checklist-card-modern ${hasFile ? 'is-completed' : ''}`}
                  >
                    {/* Top Header */}
                    <div className="emp-step-card-header">
                      <div className="emp-step-card-title-group">
                        <span className="emp-step-number">
                          STEP {(docItem.stepIndex ?? 0) + 1}
                        </span>
                        <span className="emp-step-title">{docItem.title.replace(/^Checklist #\d+:\s*/, '')}</span>
                      </div>

                      {hasFile ? (
                        <CheckCircle2 size={18} style={{ color: 'var(--green, #10b981)' }} />
                      ) : (
                        <AlertCircle size={18} style={{ color: 'var(--text-muted, #94a3b8)', opacity: 0.5 }} />
                      )}
                    </div>

                    {/* Body / File Actions */}
                    <div className="emp-step-card-body">
                      {isUploading ? (
                        <div className="emp-step-loading">
                          <RefreshCw size={14} className="spin-icon" /> Uploading file to storage...
                        </div>
                      ) : hasFile ? (
                        <div className="emp-step-file-active">
                          <div className="emp-file-pill">
                            <FileText size={14} />
                            <span className="file-name" title={docItem.fileName || docItem.title}>
                              {docItem.fileName || 'Document Uploaded'}
                            </span>
                          </div>

                          <div className="emp-file-actions">
                            <button
                              type="button"
                              className="emp-action-btn view"
                              onClick={() => setPreviewDoc({ url: docItem.fileUrl!, title: docItem.title })}
                              title="View Document"
                            >
                              <Eye size={13} /> View
                            </button>

                            <button
                              type="button"
                              className="emp-action-btn replace"
                              onClick={() => fileInputRefs.current[docItem.id]?.click()}
                              title="Replace Document"
                            >
                              <RefreshCw size={13} /> Replace
                            </button>

                            <button
                              type="button"
                              className="emp-action-btn delete"
                              onClick={() => setDeleteConfirmDoc(docItem)}
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
                            onClick={() => fileInputRefs.current[docItem.id]?.click()}
                          >
                            <Upload size={14} /> Upload File (PDF/Image)
                          </button>
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => { fileInputRefs.current[docItem.id] = el; }}
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(docItem, e.target.files)}
                      />
                    </div>

                    {/* Footer */}
                    {docItem.updatedAt && (
                      <div className="emp-step-card-footer">
                        <span>Updated: {formatDate(docItem.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="emp-form-section" style={{ textAlign: 'center', padding: '2.5rem 1rem', marginBottom: '2rem', background: 'var(--card-bg, #ffffff)', borderRadius: '10px' }}>
          <User size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.5 }} />
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>No Applicant Selected</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Select an applicant card above to view, upload, replace, or delete their documents.
          </p>
        </div>
      )}

      {/* Section 3: Mobile Document Submissions (Pending Approvals) */}
      <div className="emp-form-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 className="emp-section-heading" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} /> Mobile App Submissions (Pending Review)
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Review documents submitted directly by applicants via their mobile application
            </p>
          </div>
          {submissions.length > 0 && (
            <span className="emp-country-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 700 }}>
              {submissions.length} Pending
            </span>
          )}
        </div>

        {loadingSubs ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading mobile submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <AlertCircle size={28} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No pending mobile document submissions found.</p>
          </div>
        ) : (
          <div className="emp-table-wrapper">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Passport</th>
                  <th>Document Step</th>
                  <th>Submitted Date</th>
                  <th>File</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="emp-table-row">
                    <td className="emp-table-name">{sub.employeeName}</td>
                    <td className="emp-mono">{sub.passportNumber}</td>
                    <td>
                      <span className="emp-country-tag">{sub.stepName}</span>
                    </td>
                    <td>{formatDateTime(sub.submittedAt)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ url: sub.fileUrl, title: `${sub.employeeName} - ${sub.stepName}` })}
                        className="emp-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} />
                        View File
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleApprove(sub)}
                          className="emp-btn-primary"
                          style={{ background: 'var(--green, #10b981)', borderColor: 'var(--green, #10b981)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingSub(sub)}
                          className="emp-btn-secondary"
                          style={{ borderColor: 'var(--red, #ef4444)', color: 'var(--red, #ef4444)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document View/Preview Modal (Same logic as Status page) */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--header-bg, #f8fafc)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {previewDoc.title}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="emp-btn-secondary"
                  onClick={() => openDocumentInNewTab(previewDoc.url)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  title="Open in new tab"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </button>
                <button
                  type="button"
                  className="emp-btn-primary"
                  onClick={() => handleDownloadDocument(previewDoc.url, previewDoc.title)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  title="Download File"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#090d16' }}>
              {previewDoc.url.includes('application/pdf') || previewDoc.url.endsWith('.pdf') ? (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.title}
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '6px' }}
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '6px' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--red, #ef4444)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} /> Delete Document
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Are you sure you want to delete the document for <strong>"{deleteConfirmDoc.title}"</strong>? This will remove the file attachment.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => setDeleteConfirmDoc(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="emp-btn-primary"
                onClick={confirmDeleteFile}
                style={{ background: 'var(--red, #ef4444)', borderColor: 'var(--red, #ef4444)' }}
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} style={{ color: 'var(--primary, #3b82f6)' }} /> {alertModal.title}
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {alertModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="emp-btn-primary"
                onClick={() => setAlertModal(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Comment Modal for Mobile Submission */}
      {rejectingSub && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--red, #ef4444)' }}>
              Reject Submission
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Rejecting document <strong>"{rejectingSub.stepName}"</strong> for {rejectingSub.employeeName}. Please provide a reason for the applicant.
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="emp-label">Rejection Reason / Comment *</label>
                <textarea
                  className="emp-form-control"
                  rows={4}
                  required
                  placeholder="e.g. Image is blurry or document is expired..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="emp-btn-secondary"
                  onClick={() => setRejectingSub(null)}
                  disabled={isSubmittingReject}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="emp-btn-primary"
                  style={{ background: 'var(--red, #ef4444)', borderColor: 'var(--red, #ef4444)' }}
                  disabled={isSubmittingReject}
                >
                  {isSubmittingReject ? 'Rejecting...' : 'Reject & Notify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
