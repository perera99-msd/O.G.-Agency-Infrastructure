/**
 * Applicant domain types for the O.G. Agency Customer PWA.
 * Mirrors the backend Firestore schema for candidates, applications,
 * documents, and visa processing stages.
 */

// ─── Core Applicant Profile ───────────────────────────────────────────────────

export interface ApplicantProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  destinationOfInterest?: string;
  assignedDestination?: string;
  status: 'new' | 'visa_processing' | 'document_attestation' | 'medical_check' | 'embassy_interview' | 'approved' | 'departed' | 'rejected';
  documentsUploaded: number;
  totalDocuments: number;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  // CV / resume
  cvUrl?: string | null;
  cvFileName?: string | null;
}

// ─── Visa Processing Stages ───────────────────────────────────────────────────

export type VisaStage = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
  estimatedDays?: number;
};

export interface ApplicationStatus {
  currentStage: string;
  progressPercentage: number;
  nextMilestone: string;
  updatedAt: string;
  stages: VisaStage[];
}

// ─── Document Management ──────────────────────────────────────────────────────

export type DocumentType =
  | 'passport'
  | 'cv'
  | 'photo'
  | 'medical_certificate'
  | 'police_clearance'
  | 'employment_contract'
  | 'visa_application'
  | 'flight_ticket'
  | 'other';

export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired';

export interface ApplicantDocument {
  id: string;
  type: DocumentType;
  title: string;
  description?: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number;
  mimeType?: string;
  status: DocumentStatus;
  uploadedAt?: string;
  verifiedAt?: string;
  expiresAt?: string;
  required: boolean;
  // For upload progress tracking
  progress?: number;
  error?: string;
}

export interface DocumentCategory {
  id: string;
  title: string;
  description: string;
  documents: ApplicantDocument[];
}

// ─── Job Application ──────────────────────────────────────────────────────────

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  country: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
