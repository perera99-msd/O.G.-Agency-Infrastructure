// src/lib/api/client.ts
/**
 * API Client for the O.G. Agency Customer PWA.
 * Communicates with the Unified Backend (Node.js/Express) API.
 * Handles authentication via Firebase ID tokens, automatic retries,
 * and structured error responses.
 */

import { getIdToken } from "@/lib/firebase/auth";
import type {
  ApiResponse,
  ApplicantProfile,
  ApplicationStatus,
  ApplicantDocument,
  DocumentCategory,
  JobApplication,
  Notification,
  PaginatedResponse,
} from "@/types/applicant";

// ─── Configuration ───────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const DEFAULT_TIMEOUT = 15000; // 15 seconds

// ─── Error Handling ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── HTTP Client ─────────────────────────────────────────────────────────────

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    timeout = DEFAULT_TIMEOUT,
    skipAuth = false,
  } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Attach Firebase ID token if not skipped
  if (!skipAuth) {
    const token = await getIdToken(true);
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Build request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  // Handle non-OK responses
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // Response wasn't JSON
    }

    const message =
      errorData.message ||
      errorData.error ||
      `Request failed with status ${response.status}`;

    throw new ApiError(
      message,
      response.status,
      errorData.code,
      errorData.errors
    );
  }

  // Parse JSON response
  const data = (await response.json()) as T;
  return data;
}

// ─── API Endpoints ───────────────────────────────────────────────────────────

/**
 * GET /api/v1/pwa/profile
 * Retrieve the authenticated candidate's profile.
 */
export async function fetchCandidateProfile(): Promise<
  ApiResponse<ApplicantProfile>
> {
  return request<ApiResponse<ApplicantProfile>>("/api/v1/pwa/profile");
}

/**
 * GET /api/v1/pwa/status
 * Retrieve the candidate's visa processing status and milestones.
 */
export async function fetchApplicationStatus(): Promise<
  ApiResponse<ApplicationStatus>
> {
  return request<ApiResponse<ApplicationStatus>>("/api/v1/pwa/status");
}

/**
 * GET /api/v1/pwa/documents
 * Retrieve all documents for the candidate.
 */
export async function fetchDocuments(): Promise<
  ApiResponse<DocumentCategory[]>
> {
  return request<ApiResponse<DocumentCategory[]>>("/api/v1/pwa/documents");
}

/**
 * POST /api/v1/pwa/documents
 * Upload a document for the candidate.
 * Uses FormData for file upload.
 */
export async function uploadDocument(
  document: Partial<ApplicantDocument>,
  file?: File
): Promise<ApiResponse<ApplicantDocument>> {
  const formData = new FormData();

  // Append document metadata
  Object.entries(document).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    }
  });

  // Append file if provided
  if (file) {
    formData.append("file", file);
  }

  // Build headers without Content-Type (let browser set multipart boundary)
  const requestHeaders: Record<string, string> = {};
  const token = await getIdToken(true);
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/pwa/documents`,
    {
      method: "POST",
      headers: requestHeaders,
      body: formData,
      signal: controller.signal,
    }
  ).finally(() => clearTimeout(timeoutId));

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {}
    throw new ApiError(
      errorData.message || `Upload failed (${response.status})`,
      response.status,
      errorData.code,
      errorData.errors
    );
  }

  return (await response.json()) as ApiResponse<ApplicantDocument>;
}

/**
 * DELETE /api/v1/pwa/documents/:id
 * Delete a document.
 */
export async function deleteDocument(
  documentId: string
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>(`/api/v1/pwa/documents/${documentId}`, {
    method: "DELETE",
  });
}

/**
 * GET /api/v1/pwa/applications
 * Retrieve the candidate's job applications.
 */
export async function fetchApplications(): Promise<
  ApiResponse<JobApplication[]>
> {
  return request<ApiResponse<JobApplication[]>>("/api/v1/pwa/applications");
}

/**
 * GET /api/v1/pwa/notifications
 * Retrieve the candidate's notifications.
 */
export async function fetchNotifications(): Promise<
  ApiResponse<Notification[]>
> {
  return request<ApiResponse<Notification[]>>("/api/v1/pwa/notifications");
}

/**
 * POST /api/v1/pwa/notifications/read
 * Mark notifications as read.
 */
export async function markNotificationsRead(
  notificationIds: string[]
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>("/api/v1/pwa/notifications/read", {
    method: "POST",
    body: { notificationIds },
  });
}

/**
 * GET /api/v1/website/jobs
 * Retrieve all public jobs (for the candidate to browse and apply).
 */
export async function fetchPublicJobs(): Promise<
  ApiResponse<any[]>
> {
  return request<ApiResponse<any[]>>("/api/v1/website/jobs", {
    skipAuth: true,
  });
}

/**
 * POST /api/v1/pwa/applications
 * Apply for a job.
 */
export async function applyForJob(
  jobId: string,
  coverLetter?: string
): Promise<ApiResponse<JobApplication>> {
  return request<ApiResponse<JobApplication>>("/api/v1/pwa/applications", {
    method: "POST",
    body: { jobId, coverLetter },
  });
}

// ─── Health Check ────────────────────────────────────────────────────────────

/**
 * GET /api/health
 * Check if the backend API is reachable.
 */
export async function checkApiHealth(): Promise<
  ApiResponse<{ environment: string; timestamp: string }>
> {
  return request<ApiResponse<{ environment: string; timestamp: string }>>(
    "/api/health",
    { skipAuth: true }
  );
}

// ─── Export raw request for custom use ────────────────────────────────────────

export { request };
