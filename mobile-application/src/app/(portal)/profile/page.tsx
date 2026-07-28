// src/app/(portal)/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchCandidateProfile } from "@/lib/api/client";
import type { ApplicantProfile } from "@/types/applicant";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle2,
  Shield,
  Fingerprint,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const COUNTRIES = [
  "Sri Lanka", "India", "Pakistan", "Bangladesh", "Nepal",
  "Romania", "Bosnia", "Russia", "Germany", "Cyprus",
  "Qatar", "UAE", "Saudi Arabia", "Kuwait", "Oman",
  "Malaysia", "Jordan", "Israel",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    destinationOfInterest: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetchCandidateProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          dateOfBirth: res.data.dateOfBirth || "",
          nationality: res.data.nationality || "",
          destinationOfInterest: res.data.destinationOfInterest || "",
        });
      } else if (user) {
        // Fallback to Firebase user data
        setFormData({
          fullName: user.displayName || "",
          email: user.email || "",
          phone: "",
          dateOfBirth: "",
          nationality: "",
          destinationOfInterest: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // In a full implementation, this would call the API to update the profile
      // await updateCandidateProfile(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Profile updated successfully!");
      setProfile((prev) => prev ? { ...prev, ...formData } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // ── Security / Lock Settings ──────────────────────────────────────────
  const [showPinForm, setShowPinForm] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);

  useEffect(() => {
    // Refresh biometric state when profile loads
    import("@/lib/localAuth").then(({ isBiometricEnabled, checkBiometricSupport }) => {
      const enabled = isBiometricEnabled();
      setBiometricEnabled(enabled);
      if (enabled) {
        checkBiometricSupport().then((support) => {
          setBiometricAvailable(support.available);
          setBiometricType(support.type || "");
        });
      } else {
        setBiometricAvailable(false);
        setBiometricType("");
      }
    });
  }, []);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (!/^\d{4,6}$/.test(newPin)) {
      setPinError("PIN must be 4-6 digits.");
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinError("PINs don't match.");
      return;
    }

    // Change PIN via local auth - directly set new PIN (no old PIN required for security settings)
    import("@/lib/localAuth").then(({ setPin }) => {
      const success = setPin(newPin);
      if (success) {
        setPinSuccess("PIN updated successfully!");
        setNewPin("");
        setConfirmNewPin("");
        setShowPinForm(false);
      } else {
        setPinError("Failed to update PIN. Please try again.");
      }
    });
  };

  const handleToggleBiometric = async () => {
    const { setBiometricEnabled, isBiometricEnabled, checkBiometricSupport, createBiometricCredential } = await import("@/lib/localAuth");
    const currentlyEnabled = isBiometricEnabled();

    if (!currentlyEnabled) {
      // Enabling biometric - check support first
      const support = await checkBiometricSupport();
      if (!support.available) {
        setPinError("Biometric authentication is not available on this device.");
        return;
      }
      // Create credential
      const success = await createBiometricCredential(user?.uid || "user");
      if (success) {
        setBiometricEnabled(true);
        setBiometricAvailable(true);
        setPinSuccess("Biometric login enabled!");
      } else {
        setPinError("Failed to enable biometric login. Please try again.");
      }
    } else {
      // Disabling biometric
      setBiometricEnabled(false);
      setBiometricAvailable(false);
      setPinSuccess("Biometric login disabled.");
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading__spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  const statusLabel = profile?.status
    ? profile.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "New Applicant";

  return (
    <div className="profile-page">
      {/* ── Header ── */}
      <header className="profile-header">
        <Link href="/dashboard" className="profile-header__back">
          <ArrowLeft size={20} />
        </Link>
        <h1>My Profile</h1>
      </header>

      {/* ── Profile Overview ── */}
      <section className="profile-section">
        <div className="profile-overview">
          <div className="profile-overview__avatar">
            <User size={48} />
          </div>
          <div className="profile-overview__info">
            <h2>{formData.fullName || "Not set"}</h2>
            <p className="profile-overview__email">{formData.email}</p>
            <div className="profile-overview__meta">
              {profile?.assignedDestination && (
                <span className="profile-overview__item">
                  <MapPin size={16} />
                  {profile.assignedDestination}
                </span>
              )}
              {profile?.createdAt && (
                <span className="profile-overview__item">
                  <Calendar size={16} />
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <span className={`status-badge status-${profile?.status?.replace("_", "-") || "new"}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </section>

      {/* ── Document Summary ── */}
      {profile && (
        <section className="profile-section">
          <div className="profile-doc-summary">
            <div className="profile-doc-summary__item">
              <FileText size={20} />
              <div>
                <span className="profile-doc-summary__count">
                  {profile.documentsUploaded}/{profile.totalDocuments}
                </span>
                <span className="profile-doc-summary__label">Documents</span>
              </div>
            </div>
            {profile.cvUrl && (
              <div className="profile-doc-summary__item">
                <FileText size={20} />
                <div>
                  <span className="profile-doc-summary__label">CV Uploaded</span>
                  <span className="profile-doc-summary__value">
                    {profile.cvFileName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Edit Form ── */}
      <section className="profile-section">
        <h2 className="profile-section__title">Edit Profile</h2>

        {error && (
          <div className="profile-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="profile-success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form__grid">
            {/* Full Name */}
            <div className="profile-form__group">
              <label className="profile-form__label">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="profile-form__input"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="profile-form__group">
              <label className="profile-form__label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="profile-form__input"
                placeholder="Enter your email"
                disabled
              />
              <p className="profile-form__hint">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="profile-form__group">
              <label className="profile-form__label">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="profile-form__input"
                placeholder="+94 70 123 4567"
              />
            </div>

            {/* Date of Birth */}
            <div className="profile-form__group">
              <label className="profile-form__label">
                <Calendar size={16} />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="profile-form__input"
              />
            </div>

            {/* Nationality */}
            <div className="profile-form__group">
              <label className="profile-form__label">
                <Globe size={16} />
                Nationality
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                className="profile-form__select"
              >
                <option value="">Select nationality</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination of Interest */}
            <div className="profile-form__group">
              <label className="profile-form__label">
                <MapPin size={16} />
                Destination of Interest
              </label>
              <select
                value={formData.destinationOfInterest}
                onChange={(e) =>
                  handleChange("destinationOfInterest", e.target.value)
                }
                className="profile-form__select"
              >
                <option value="">Select destination</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="profile-form__submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="profile-form__spinner" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </section>

      {/* ── Account Actions ── */}
      <section className="profile-section">
        <h2 className="profile-section__title">Account</h2>
        <div className="profile-account">
          <button
            className="profile-account__btn profile-account__btn--logout"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </section>

      {/* ── Security Settings ── */}
      <section className="profile-section">
        <h2 className="profile-section__title">Security</h2>

        {/* Biometric Toggle */}
        <div className="dashboard-card" style={{ marginBottom: "1rem" }}>
          <div className="dashboard-card__header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent-color)",
              }}>
                <Fingerprint size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Biometric Login</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {biometricAvailable
                    ? `Use ${biometricType === "face" ? "Face ID" : "fingerprint"} to unlock`
                    : biometricEnabled
                    ? "Biometric enabled"
                    : "Not available on this device"}
                </p>
              </div>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: 48, height: 24 }}>
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={handleToggleBiometric}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: biometricEnabled ? "var(--accent-color)" : "var(--bg-tertiary)",
                  borderRadius: 24, transition: "0.3s",
                }}
              >
                <span
                  style={{
                    position: "absolute", content: '""', height: 18, width: 18,
                    left: biometricEnabled ? 26 : 4, bottom: 3,
                    backgroundColor: "white", borderRadius: "50%", transition: "0.3s",
                  }}
                />
              </span>
            </label>
          </div>
        </div>

        {/* Change PIN */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent-color)",
              }}>
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>App PIN</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  Change your 4-6 digit app PIN
                </p>
              </div>
            </div>
          </div>

          {pinError && (
            <div className="dashboard-error" style={{ marginBottom: "1rem" }}>
              <AlertCircle size={16} />
              <span>{pinError}</span>
            </div>
          )}
          {pinSuccess && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem",
              background: "var(--success-bg)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "var(--radius-md)",
              marginBottom: "1rem", color: "var(--success-color)", fontSize: "0.875rem",
            }}>
              <CheckCircle2 size={16} /> {pinSuccess}
            </div>
          )}

          {!showPinForm ? (
            <button
              onClick={() => setShowPinForm(true)}
              style={{
                width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)", background: "var(--bg-tertiary)",
                color: "var(--text-primary)", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500,
              }}
            >
              Change PIN
            </button>
          ) : (
            <form onSubmit={handleChangePin}>
              <div className="profile-form__grid" style={{ marginBottom: "1rem" }}>
                <div className="profile-form__group">
                  <label className="profile-form__label">
                    <Lock size={16} />
                    New PIN (4-6 digits)
                  </label>
                  <input
                    type={showCurrentPin ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    className="profile-form__input"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter new PIN"
                    autoFocus
                  />
                </div>
                <div className="profile-form__group">
                  <label className="profile-form__label">
                    <Shield size={16} />
                    Confirm New PIN
                  </label>
                  <input
                    type={showCurrentPin ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    className="profile-form__input"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="Confirm new PIN"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="submit"
                  className="profile-form__submit"
                  style={{ flex: 1 }}
                  disabled={!newPin || !confirmNewPin}
                >
                  <Save size={16} />
                  Update PIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPinForm(false);
                    setNewPin("");
                    setConfirmNewPin("");
                    setPinError("");
                  }}
                  style={{
                    flex: 1, padding: "0.75rem", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)", background: "transparent",
                    color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.875rem",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
