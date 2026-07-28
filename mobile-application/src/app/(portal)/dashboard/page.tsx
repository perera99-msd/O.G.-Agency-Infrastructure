// src/app/(portal)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProgressTracker } from "@/components/portal/ProgressTracker";
import { fetchCandidateProfile, fetchApplicationStatus } from "@/lib/api/client";
import { setSessionExpiry } from "@/lib/middleware";
import type { ApplicantProfile, ApplicationStatus } from "@/types/applicant";
import {
  User,
  FileText,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Calendar,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const MOCK_STAGES = [
  { id: "profile", title: "Profile Setup", description: "Complete your profile", status: "completed" as const, estimatedDays: 1 },
  { id: "documents", title: "Document Upload", description: "Upload required documents", status: "in_progress" as const, estimatedDays: 3 },
  { id: "attestation", title: "Document Attestation", description: "Government attestation", status: "pending" as const, estimatedDays: 7 },
  { id: "medical", title: "Medical Check", description: "Health examination", status: "pending" as const, estimatedDays: 5 },
  { id: "interview", title: "Embassy Interview", description: "Visa interview scheduling", status: "pending" as const, estimatedDays: 14 },
  { id: "departure", title: "Departure", description: "Travel preparation", status: "pending" as const, estimatedDays: 3 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionExpiry();
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileRes, statusRes] = await Promise.allSettled([
        fetchCandidateProfile(),
        fetchApplicationStatus(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value.success) {
        setProfile(profileRes.value.data || null);
      }
      if (statusRes.status === "fulfilled" && statusRes.value.success) {
        setAppStatus(statusRes.value.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const displayName = profile?.fullName || user?.displayName || user?.email || "Applicant";
  const displayEmail = profile?.email || user?.email || "";
  const displayStatus = profile?.status || "new";
  const docsUploaded = profile?.documentsUploaded || 0;
  const docsTotal = profile?.totalDocuments || 0;
  const docsProgress = docsTotal > 0 ? Math.round((docsUploaded / docsTotal) * 100) : 0;

  const stages = appStatus?.stages || MOCK_STAGES;
  const currentStage = appStatus?.currentStage || "documents";
  const progressPct = appStatus?.progressPercentage || docsProgress;

  return (
    <div className="dashboard-page">
      {/* ── Header ── */}
      <header className="dashboard-header">
        <div className="dashboard-header__greeting">
          <h1>Welcome back, {displayName.split(" ")[0]}!</h1>
          <p>Your visa application is being processed</p>
        </div>
        <button
          className="dashboard-header__logout"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* ── Profile Card ── */}
      <section className="dashboard-section">
        <div className="profile-card">
          <div className="profile-card__avatar">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={displayName} />
            ) : (
              <div className="profile-card__avatar-placeholder">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-card__info">
            <h2>{displayName}</h2>
            <p className="profile-card__email">{displayEmail}</p>
            {profile?.assignedDestination && (
              <div className="profile-card__destination">
                <MapPin size={16} />
                <span>Assigned: {profile.assignedDestination}</span>
              </div>
            )}
            <span className={`status-badge status-${displayStatus.replace("_", "-")}`}>
              {displayStatus.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          <Link href="/profile" className="profile-card__edit">
            <Settings size={20} />
          </Link>
        </div>
      </section>

      {/* ── Documents Progress ── */}
      <section className="dashboard-section">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Documents</h3>
            <Link href="/documents" className="dashboard-card__link">
              Manage all ({docsUploaded}/{docsTotal})
            </Link>
          </div>
          <div className="dashboard-card__content">
            <div className="progress-summary">
              <div className="progress-summary__bar">
                <div
                  className="progress-summary__fill"
                  style={{ width: `${docsProgress}%` }}
                />
              </div>
              <div className="progress-summary__stats">
                <span className="progress-summary__count">
                  {docsUploaded} of {docsTotal} documents uploaded
                </span>
                <span className="progress-summary__pct">{docsProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Application Progress ── */}
      <section className="dashboard-section">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Application Progress</h3>
            <span className="dashboard-card__progress-label">
              {Math.round(progressPct)}% complete
            </span>
          </div>
          <div className="dashboard-card__content">
            <ProgressTracker
              stages={stages}
              currentStageId={currentStage}
              orientation="vertical"
              compact={true}
            />
          </div>
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section className="dashboard-section">
        <h3 className="dashboard-section__title">Quick Actions</h3>
        <div className="quick-actions">
          <Link href="/documents" className="quick-action">
            <div className="quick-action__icon">
              <FileText size={24} />
            </div>
            <span>Upload Documents</span>
          </Link>
          <Link href="/profile" className="quick-action">
            <div className="quick-action__icon">
              <User size={24} />
            </div>
            <span>Edit Profile</span>
          </Link>
          <div className="quick-action">
            <div className="quick-action__icon">
              <Bell size={24} />
            </div>
            <span>Notifications</span>
          </div>
          <div className="quick-action">
            <div className="quick-action__icon">
              <Settings size={24} />
            </div>
            <span>Settings</span>
          </div>
        </div>
      </section>

      {/* ── Next Milestone ── */}
      {appStatus?.nextMilestone && (
        <section className="dashboard-section">
          <div className="milestone-card">
            <AlertCircle size={20} />
            <div>
              <h4>Next Milestone</h4>
              <p>{appStatus.nextMilestone}</p>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
