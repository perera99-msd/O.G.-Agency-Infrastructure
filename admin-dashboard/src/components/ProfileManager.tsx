import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  CheckCircle2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  Upload,
  Trash2,
  Phone,
  Briefcase,
  User,
  Key,
  Shield,
  Loader2,
} from 'lucide-react';
import { db } from '../firebase';
import type { AdminUser } from '../types';
import { compressImage } from '../imageCompressor';
import { AdminsManager } from './AdminsManager';


interface ProfileManagerProps {
  user: AdminUser;
}

const PREDEFINED_AVATARS = [
  { id: 'av1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=b6e3f4,c0aede', label: 'Executive Female' },
  { id: 'av2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=ffdfbf,ffd5dc', label: 'Executive Male' },
  { id: 'av3', url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=CyberAgent&backgroundColor=b6e3f4,d1d4f9', label: 'Cyber Bot' },
  { id: 'av4', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Aria&backgroundColor=ffdfbf,c0aede', label: 'Creative Director' },
  { id: 'av5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9,b6e3f4', label: 'Operations Lead' },
  { id: 'av6', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Ethan&backgroundColor=ffd5dc,b6e3f4', label: 'Tech Lead' },
  { id: 'av7', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Nova&backgroundColor=c0aede,ffd5dc', label: 'HR Specialist' },
  { id: 'av8', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phoenix&backgroundColor=b6e3f4,ffdfbf', label: '3D Hero' },
  { id: 'av9', url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Matrix&backgroundColor=ffd5dc,d1d4f9', label: 'AI Agent' },
  { id: 'av10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria&backgroundColor=ffdfbf,b6e3f4', label: 'Global Director' },
];

export function ProfileManager({ user }: ProfileManagerProps) {
  const [displayName, setDisplayName] = useState('');
  const [jobTitle, setJobTitle] = useState('Administrator');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const ref = doc(db, 'Admin_Users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.jobTitle) setJobTitle(data.jobTitle);
          if (data.phone) setPhone(data.phone);
          if (data.photoUrl) setPhotoUrl(data.photoUrl);
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, [user.uid]);

  const initials = (displayName || user.email || 'AD').slice(0, 2).toUpperCase();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const compressedBase64 = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.8 });
      setPhotoUrl(compressedBase64);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await setDoc(doc(db, 'Admin_Users', user.uid), {
        displayName: displayName.trim(),
        jobTitle: jobTitle.trim(),
        phone: phone.trim(),
        photoUrl: photoUrl.trim(),
        email: user.email,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-state">
        <Loader2 className="animate-spin" size={28} />
        <p>Loading profile details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="animate-in profile-page">
        <div className="page-header">
          <div>
            <h2 className="page-title">My Profile</h2>
            <p className="page-subtitle">Manage your admin identity, contact info, and operational profile.</p>
          </div>
        </div>

        <div className="profile-layout">
          {/* Left Column: Summary Card */}
          <aside className="card profile-summary">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {photoUrl ? <img src={photoUrl} alt="Profile Avatar" /> : <span className="avatar-initials">{initials}</span>}
              </div>
              <span className="profile-online-badge" title="Active Session" />
            </div>

            <div className="profile-user-info">
              <h3 className="profile-user-name">{displayName || 'Administrator'}</h3>
              <p className="profile-user-title">{jobTitle || 'Administrator'}</p>
              <div className="profile-role-badge">
                <ShieldCheck size={13} />
                <span>{user.role === 'super_user' ? 'Super Administrator' : 'Administrator'}</span>
              </div>
            </div>

            <div className="profile-meta-list">
              <div className="profile-meta-item">
                <Mail size={15} />
                <span className="meta-value">{user.email}</span>
              </div>
              {phone && (
                <div className="profile-meta-item">
                  <Phone size={15} />
                  <span className="meta-value">{phone}</span>
                </div>
              )}
            </div>

            <div className="profile-security-box">
              <div className="security-box-header">
                <Shield size={14} />
                <span>Security & Access</span>
              </div>
              <p className="security-box-text">256-Bit Encrypted Admin Session verified via Firebase Authentication.</p>
            </div>
          </aside>

          {/* Right Column: Profile Edit Form */}
          <form className="card profile-form" onSubmit={saveProfile}>
            <div className="profile-form-heading">
              <div className="heading-icon">
                <UserRound size={20} />
              </div>
              <div>
                <h3>Profile Details</h3>
                <p>Your authentication email is managed securely by Firebase.</p>
              </div>
            </div>

            {error && <div className="profile-error-alert">{error}</div>}

            <div className="profile-avatar-upload-row">
              <div className="upload-preview-thumb">
                {photoUrl ? <img src={photoUrl} alt="Avatar Preview" /> : initials}
              </div>
              <div className="upload-controls">
                <p className="upload-title">Profile Picture</p>
                <p className="upload-desc">Upload a high resolution JPEG/PNG, choose a preset avatar, or paste an image URL.</p>
                <div className="upload-btn-group">
                  <label className="btn btn-secondary upload-label">
                    <Upload size={14} />
                    {uploading ? 'Processing...' : 'Upload Custom Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} hidden />
                  </label>
                  {photoUrl && (
                    <button type="button" className="btn btn-danger-subtle" onClick={() => setPhotoUrl('')}>
                      <Trash2 size={14} />
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Animated 3D & Vector Avatars Selection Grid */}
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    ✨ Choose an Animated 3D Avatar:
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {PREDEFINED_AVATARS.map((av) => {
                      const isSelected = photoUrl === av.url;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setPhotoUrl(av.url)}
                          title={av.label}
                          className="avatar-preset-btn"
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            padding: 0,
                            overflow: 'hidden',
                            border: isSelected ? '2.5px solid var(--accent)' : '2px solid var(--border)',
                            boxShadow: isSelected
                              ? '0 0 0 4px var(--accent-light), 0 8px 20px rgba(99, 102, 241, 0.25)'
                              : '0 2px 8px rgba(0,0,0,0.04)',
                            transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            cursor: 'pointer',
                            background: 'var(--surface-raised)',
                            position: 'relative',
                          }}
                        >
                          <img src={av.url} alt={av.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Display Name</label>
                <div className="input-with-icon">
                  <User size={15} className="input-icon" />
                  <input
                    className="field-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Dawson"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Job Title / Designation</label>
                <div className="input-with-icon">
                  <Briefcase size={15} className="input-icon" />
                  <input
                    className="field-input"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Operations Director"
                  />
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Contact Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={15} className="input-icon" />
                  <input
                    className="field-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Image URL (Optional)</label>
                <div className="input-with-icon">
                  <Key size={15} className="input-icon" />
                  <input
                    className="field-input"
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="profile-form-footer">
              {saved && (
                <span className="profile-saved">
                  <CheckCircle2 size={16} /> Profile updated successfully
                </span>
              )}
              <button className="btn btn-primary save-btn" type="submit" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {user.role === 'super_user' && (
        <AdminsManager 
          currentUserUid={user.uid} 
        />
      )}
    </>
  );
}
