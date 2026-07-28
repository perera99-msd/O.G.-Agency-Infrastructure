import React, { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { ShieldCheck, Plus, Edit2, Trash2, Mail, Loader2, Shield, AlertTriangle, KeyRound } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface AdminUserRow {
  uid: string;
  email: string;
  displayName?: string;
  jobTitle?: string;
  role: string;
  createdAt?: string;
}

export const AdminsManager: React.FC<{ currentUserUid: string }> = ({ currentUserUid }) => {
  const [admins, setAdmins] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRow | null>(null);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formRole, setFormRole] = useState('admin');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        setError(data.message || 'Failed to fetch admins');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset email sent to ${email}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to send reset email');
    }
  };

  const handleDelete = async (uid: string) => {
    if (uid === currentUserUid) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this admin? This cannot be undone.")) return;
    
    try {
      setActionLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${uid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting admin");
    } finally {
      setActionLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAdmin(null);
    setFormEmail('');
    setFormPassword('');
    setFormName('');
    setFormTitle('');
    setFormRole('admin');
    setShowModal(true);
  };

  const openEditModal = (admin: AdminUserRow) => {
    setEditingAdmin(admin);
    setFormEmail(admin.email);
    setFormPassword('');
    setFormName(admin.displayName || '');
    setFormTitle(admin.jobTitle || '');
    setFormRole(admin.role || 'admin');
    setShowModal(true);
  };

  const saveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (editingAdmin) {
        const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${editingAdmin.uid}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ role: formRole })
        });
        if (!res.ok) throw new Error((await res.json()).message);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            email: formEmail, 
            password: formPassword, 
            displayName: formName, 
            jobTitle: formTitle,
            role: formRole
          })
        });
        if (!res.ok) throw new Error((await res.json()).message);
      }
      setShowModal(false);
      await fetchAdmins();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save admin");
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    return (name || email || 'AD').substring(0, 2).toUpperCase();
  };

  return (
    <div className="card" style={{ marginTop: 24, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-header-left">
          <div className="section-header-icon" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="section-header-title">Administrator Management</h3>
            <p className="section-header-desc">Manage access, roles, and password resets for team members.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={14} /> Add Admin
        </button>
      </div>

      {error && <div className="profile-error-alert" style={{ margin: '16px 24px 0' }}>{error}</div>}

      {/* Content */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={22} className="animate-spin" style={{ margin: '0 auto 10px', display: 'block' }} />
          <p style={{ fontSize: 13 }}>Loading administrators...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ShieldCheck size={20} /></div>
          <p className="empty-state-title">No administrators found</p>
          <p className="empty-state-desc">Add your first admin team member.</p>
        </div>
      ) : (
        <div>
          {admins.map(a => (
            <div key={a.uid} className="data-row" style={{ padding: '14px 24px' }}>
              <div className="avatar avatar-md avatar-subtle">
                {getInitials(a.displayName, a.email)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{a.displayName || 'Unknown'}</span>
                  {a.role === 'super_user' && (
                    <span className="tag tag-indigo" style={{ fontSize: 10, padding: '1px 6px' }}>
                      <Shield size={9} /> Super
                    </span>
                  )}
                  {a.uid === currentUserUid && (
                    <span className="tag tag-green" style={{ fontSize: 10, padding: '1px 6px' }}>You</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Mail size={11} /> {a.email || '—'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>• {a.jobTitle || 'Administrator'}</span>
                </div>
              </div>
              
              <div className="data-row-actions">
                <button className="btn btn-secondary btn-icon" title="Send Password Reset" onClick={() => handleResetPassword(a.email)}>
                  <KeyRound size={14} />
                </button>
                <button className="btn btn-secondary btn-icon" title="Edit Role" onClick={() => openEditModal(a)}>
                  <Edit2 size={14} />
                </button>
                {a.uid !== currentUserUid && (
                  <button className="btn btn-icon" style={{ color: 'var(--red)', background: 'var(--red-bg)', border: '1px solid var(--red-border)' }} title="Delete Admin" onClick={() => handleDelete(a.uid)} disabled={actionLoading}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingAdmin ? 'Edit Administrator' : 'Add New Administrator'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={saveAdmin} className="modal-body">
              {!editingAdmin && (
                <>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Email Address *</label>
                      <input className="field-input" type="email" required value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="admin@company.com" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Initial Password *</label>
                      <input className="field-input" type="password" required minLength={6} value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Min. 6 characters" />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Display Name *</label>
                      <input className="field-input" type="text" required value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Job Title</label>
                      <input className="field-input" type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Operations Manager" />
                    </div>
                  </div>
                </>
              )}
              
              <div className="field-group">
                <label className="field-label">Account Role</label>
                <select className="field-input" value={formRole} onChange={e => setFormRole(e.target.value)}>
                  <option value="admin">Administrator (Standard)</option>
                  <option value="super_user">Super Administrator</option>
                </select>
                <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={11} />
                  Super Administrators can manage other admin accounts.
                </p>
              </div>
              
              <div className="modal-footer" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : editingAdmin ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
