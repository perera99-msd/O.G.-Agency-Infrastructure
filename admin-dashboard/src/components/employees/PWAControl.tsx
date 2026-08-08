import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  Key,
  UserCheck,
  UserX,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Employee, Destination } from '../../types';

export interface PWACredential {
  id: string; // employeeId
  employeeId: string;
  employeeName: string;
  passportNumber: string;
  nicNumber?: string;
  countryApplied?: string;
  username: string;
  passwordHash: string; // raw or hashed password for user login
  status: 'active' | 'disabled';
  createdAt: string;
  lastLoginAt?: string;
}

interface Props {
  employees?: Employee[];
  destinations?: Destination[];
}

export const PWAControl: React.FC<Props> = ({
  employees = [],
  destinations = []
}) => {
  // Credentials from Firestore
  const [credentials, setCredentials] = useState<PWACredential[]>([]);
  const [loadingCreds, setLoadingCreds] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('');

  // Selected Employee for Credential Action
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<PWACredential | null>(null);
  const [deleteConfirmCred, setDeleteConfirmCred] = useState<PWACredential | null>(null);

  // Form Fields
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formStatus, setFormStatus] = useState<'active' | 'disabled'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time listener for pwa_credentials
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'pwa_credentials'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PWACredential, 'id'>)
        }));
        setCredentials(list);
        setLoadingCreds(false);
      },
      (err) => {
        console.error('Error fetching pwa_credentials:', err);
        setLoadingCreds(false);
      }
    );

    return () => unsub();
  }, []);

  // Flag Helper
  const renderFlag = (countryName?: string) => {
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

    if (typeof flagVal === 'string' && (flagVal.startsWith('http://') || flagVal.startsWith('https://') || flagVal.startsWith('/') || flagVal.startsWith('data:'))) {
      return (
        <img
          src={flagVal}
          alt={countryName}
          style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}
        />
      );
    }
    return <span style={{ marginRight: '4px' }}>{flagVal || '🌐'}</span>;
  };

  // Map employeeId -> PWACredential
  const credsMap = useMemo(() => {
    const map = new Map<string, PWACredential>();
    credentials.forEach(c => map.set(c.employeeId, c));
    return map;
  }, [credentials]);

  // Unique countries list
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => { if (e.countryApplied) set.add(e.countryApplied); });
    return Array.from(set);
  }, [employees]);

  // Filtered Employees with PWA status
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

    if (filterStatus) {
      if (filterStatus === 'has_cred') {
        list = list.filter(emp => credsMap.has(emp.id));
      } else if (filterStatus === 'no_cred') {
        list = list.filter(emp => !credsMap.has(emp.id));
      } else if (filterStatus === 'active') {
        list = list.filter(emp => credsMap.get(emp.id)?.status === 'active');
      } else if (filterStatus === 'disabled') {
        list = list.filter(emp => credsMap.get(emp.id)?.status === 'disabled');
      }
    }

    list.sort((a, b) => {
      const timeA = new Date(a.registeredAt || 0).getTime();
      const timeB = new Date(b.registeredAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  }, [employees, searchQuery, filterCountry, filterStatus, credsMap]);

  // Generate random strong password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@!';
    let pwd = '';
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  // Open Create Credential Modal
  const handleOpenCreateModal = (emp: Employee) => {
    setSelectedEmp(emp);
    const defaultUsername = (emp.passportNumber || emp.nicNumber || emp.fullName.replace(/\s+/g, '').toLowerCase()).toLowerCase();
    setFormUsername(defaultUsername);
    setFormPassword(generateRandomPassword());
    setFormStatus('active');
    setShowCreateModal(true);
  };

  // Save New Credential
  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !formUsername.trim() || !formPassword.trim()) return;

    setIsSubmitting(true);
    try {
      const credData: PWACredential = {
        id: selectedEmp.id,
        employeeId: selectedEmp.id,
        employeeName: selectedEmp.fullName,
        passportNumber: selectedEmp.passportNumber,
        nicNumber: selectedEmp.nicNumber || '',
        countryApplied: selectedEmp.countryApplied || '',
        username: formUsername.trim().toLowerCase(),
        passwordHash: formPassword.trim(),
        status: formStatus,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'pwa_credentials', selectedEmp.id), credData);
      showToast(`PWA Credential created for ${selectedEmp.fullName}!`);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating PWA credential:', err);
      alert('Failed to create PWA credential.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (cred: PWACredential) => {
    setShowEditModal(cred);
    setFormUsername(cred.username);
    setFormPassword(cred.passwordHash);
    setFormStatus(cred.status);
  };

  // Update Credential
  const handleUpdateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal || !formUsername.trim() || !formPassword.trim()) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'pwa_credentials', showEditModal.id), {
        username: formUsername.trim().toLowerCase(),
        passwordHash: formPassword.trim(),
        status: formStatus,
        lastUpdatedAt: new Date().toISOString()
      });

      showToast(`Credential updated for ${showEditModal.employeeName}!`);
      setShowEditModal(null);
    } catch (err) {
      console.error('Error updating PWA credential:', err);
      alert('Failed to update PWA credential.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Credential
  const handleDeleteCredential = async () => {
    if (!deleteConfirmCred) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'pwa_credentials', deleteConfirmCred.id));
      showToast(`Revoked PWA access for ${deleteConfirmCred.employeeName}`);
      setDeleteConfirmCred(null);
    } catch (err) {
      console.error('Error deleting PWA credential:', err);
      alert('Failed to revoke credential.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
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
          <h2 className="emp-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={24} style={{ color: 'var(--primary, #3b82f6)' }} />
            PWA Access Control
          </h2>
          <p className="emp-page-sub">
            Create, manage, and revoke login credentials for registered applicants to access the Mobile PWA App
          </p>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid var(--primary, #3b82f6)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Applicants</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{employees.length}</h3>
        </div>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Credentials</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: '#10b981' }}>
            {credentials.filter(c => c.status === 'active').length}
          </h3>
        </div>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Disabled Credentials</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: '#ef4444' }}>
            {credentials.filter(c => c.status === 'disabled').length}
          </h3>
        </div>
        <div className="emp-form-section" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderLeft: '4px solid #64748b' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Without Access</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', color: '#64748b' }}>
            {employees.length - credentials.length}
          </h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="emp-form-section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Search Box */}
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

          {/* Status Filter */}
          <div>
            <select
              className="emp-form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Credential Statuses</option>
              <option value="has_cred">Has PWA Credentials</option>
              <option value="no_cred">No Credentials Created</option>
              <option value="active">Status: Active</option>
              <option value="disabled">Status: Disabled</option>
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <select
              className="emp-form-control"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="">All Countries ({uniqueCountries.length})</option>
              {uniqueCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {(searchQuery || filterStatus || filterCountry) && (
            <div>
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => { setSearchQuery(''); setFilterStatus(''); setFilterCountry(''); }}
                style={{ height: '100%', display: 'inline-flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <X size={14} /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Employee Table with PWA Credential Actions */}
        {loadingCreds ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            Loading PWA credentials...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            No applicants found matching the current search & filter criteria.
          </div>
        ) : (
          <div className="emp-table-wrapper">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Passport</th>
                  <th>Destination</th>
                  <th>PWA Username</th>
                  <th>PWA Password</th>
                  <th>Access Status</th>
                  <th style={{ textAlign: 'right' }}>Credential Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const cred = credsMap.get(emp.id);
                  const hasCred = Boolean(cred);

                  return (
                    <tr key={emp.id} className="emp-table-row">
                      <td className="emp-table-name">
                        <div style={{ fontWeight: 600 }}>{emp.fullName}</div>
                        {emp.nicNumber && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            NIC: {emp.nicNumber}
                          </div>
                        )}
                      </td>
                      <td className="emp-mono">{emp.passportNumber || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {renderFlag(emp.countryApplied)}
                          <span>{emp.countryApplied || '—'}</span>
                        </div>
                      </td>
                      <td>
                        {hasCred ? (
                          <span className="emp-mono" style={{ color: 'var(--primary, #3b82f6)', fontWeight: 600 }}>
                            {cred?.username}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not Created</span>
                        )}
                      </td>
                      <td>
                        {hasCred ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span className="emp-mono" style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>
                              {cred?.passwordHash}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cred!.passwordHash, `pwd_${emp.id}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                              title="Copy Password"
                            >
                              {copiedText === `pwd_${emp.id}` ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td>
                        {hasCred ? (
                          cred?.status === 'active' ? (
                            <span className="emp-country-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <UserCheck size={13} /> Active
                            </span>
                          ) : (
                            <span className="emp-country-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <UserX size={13} /> Disabled
                            </span>
                          )
                        ) : (
                          <span className="emp-country-tag" style={{ background: 'rgba(148, 163, 184, 0.1)', color: '#64748b', fontWeight: 500 }}>
                            No Access
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {hasCred ? (
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              className="emp-btn-secondary"
                              onClick={() => handleOpenEditModal(cred!)}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="Edit Credentials"
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className="emp-btn-secondary"
                              onClick={() => setDeleteConfirmCred(cred!)}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="Revoke Access"
                            >
                              <Trash2 size={13} /> Revoke
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="emp-btn-primary"
                            onClick={() => handleOpenCreateModal(emp)}
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Plus size={13} /> Create Credentials
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Credential Modal */}
      {showCreateModal && selectedEmp && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={20} style={{ color: 'var(--primary, #3b82f6)' }} /> Create PWA Login Credentials
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Generating app access for <strong>{selectedEmp.fullName}</strong> ({selectedEmp.passportNumber})
            </p>

            <form onSubmit={handleCreateCredential}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="emp-label">App Username / Passport Number *</label>
                <input
                  type="text"
                  className="emp-form-control"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="emp-label" style={{ margin: 0 }}>Password *</label>
                  <button
                    type="button"
                    onClick={() => setFormPassword(generateRandomPassword())}
                    style={{ background: 'none', border: 'none', color: 'var(--primary, #3b82f6)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    Generate Random
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="emp-form-control"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    style={{ paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="emp-label">Initial Account Status</label>
                <select
                  className="emp-form-control"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'disabled')}
                >
                  <option value="active">Active (Can Login immediately)</option>
                  <option value="disabled">Disabled (Blocked from login)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="emp-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="emp-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Credential Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit2 size={20} style={{ color: 'var(--primary, #3b82f6)' }} /> Edit PWA Credentials
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Updating credentials for <strong>{showEditModal.employeeName}</strong>
            </p>

            <form onSubmit={handleUpdateCredential}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="emp-label">App Username</label>
                <input
                  type="text"
                  className="emp-form-control"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="emp-label" style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => setFormPassword(generateRandomPassword())}
                    style={{ background: 'none', border: 'none', color: 'var(--primary, #3b82f6)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    Generate Random
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="emp-form-control"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    style={{ paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="emp-label">Account Status</label>
                <select
                  className="emp-form-control"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'disabled')}
                >
                  <option value="active">Active (Can Login)</option>
                  <option value="disabled">Disabled (Access Blocked)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="emp-btn-secondary"
                  onClick={() => setShowEditModal(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="emp-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke / Delete Confirmation Modal */}
      {deleteConfirmCred && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <h3 style={{ margin: '0 0 0.75rem 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} /> Revoke PWA Access
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Are you sure you want to revoke app access for <strong>"{deleteConfirmCred.employeeName}"</strong>? This will permanently delete their login credentials.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => setDeleteConfirmCred(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="emp-btn-primary"
                onClick={handleDeleteCredential}
                style={{ background: '#ef4444', borderColor: '#ef4444' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Revoking...' : 'Revoke & Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
