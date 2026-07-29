// src/hooks/useUploadProgress.ts
/**
 * Upload progress tracking hook for the O.G. Agency Customer PWA.
 * Tracks file upload progress using XMLHttpRequest for real-time
 * progress events, with fallback to fetch for environments where
 * XHR progress isn't available.
 *
 * Supports concurrent uploads, cancellation, and progress aggregation.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { getIdToken } from "@/lib/firebase/auth";
import type { ApiResponse, ApplicantDocument } from "@/types/applicant";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadState {
  progress: number; // 0-100
  status: "idle" | "uploading" | "success" | "error";
  error: string | null;
  uploadedFile: File | null;
  result: ApplicantDocument | null;
}

export interface UseUploadProgressReturn {
  // State
  uploads: Record<string, UploadState>;
  overallProgress: number;
  isUploading: boolean;
  hasError: boolean;

  // Actions
  uploadFile: (
    file: File,
    documentId: string,
    metadata?: Record<string, unknown>
  ) => Promise<ApplicantDocument>;
  cancelUpload: (documentId: string) => void;
  resetUpload: (documentId: string) => void;
  clearAll: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for large files

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUploadProgress(): UseUploadProgressReturn {
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});
  const xhrRefs = useRef<Record<string, XMLHttpRequest>>({});

  // Cleanup XHR refs on unmount
  useEffect(() => {
    return () => {
      Object.values(xhrRefs.current).forEach((xhr) => {
        if (xhr && xhr.readyState < 4) {
          xhr.abort();
        }
      });
      xhrRefs.current = {};
    };
  }, []);

  // Derived state
  const activeUploads = Object.values(uploads).filter(
    (u) => u.status === "uploading"
  );
  const isUploading = activeUploads.length > 0;
  const hasError = Object.values(uploads).some((u) => u.status === "error");

  const overallProgress =
    Object.values(uploads).length === 0
      ? 0
      : Math.round(
          Object.values(uploads).reduce((sum, u) => sum + u.progress, 0) /
            Object.values(uploads).length
        );

  // ─── Upload Function ──────────────────────────────────────────────────────

  const uploadFile = useCallback(
    async (
      file: File,
      documentId: string,
      metadata: Record<string, unknown> = {}
    ): Promise<ApplicantDocument> => {
      // Initialize upload state
      setUploads((prev) => ({
        ...prev,
        [documentId]: {
          progress: 0,
          status: "uploading",
          error: null,
          uploadedFile: file,
          result: null,
        },
      }));

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRefs.current[documentId] = xhr;

        // Build form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentId", documentId);

        // Append metadata
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
          );
        });

        // Get auth token
        getIdToken(true).then((token) => {
          if (token) {
            xhr.open(
              "POST",
              `${API_BASE_URL}/api/v1/pwa/documents/upload`,
              true
            );
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            // ─── Progress Event ──────────────────────────────────────────────
            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const progress = Math.round(
                  (event.loaded / event.total) * 100
                );
                setUploads((prev) => ({
                  ...prev,
                  [documentId]: {
                    ...prev[documentId],
                    progress,
                    status: "uploading",
                  },
                }));
              }
            });

            // ─── Load Event (Success) ────────────────────────────────────────
            xhr.addEventListener("load", () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const response = JSON.parse(xhr.responseText) as ApiResponse<ApplicantDocument>;
                  setUploads((prev) => ({
                    ...prev,
                    [documentId]: {
                      progress: 100,
                      status: "success",
                      error: null,
                      uploadedFile: file,
                      result: response.data || null,
                    },
                  }));
                  resolve(response.data || ({} as ApplicantDocument));
                } catch (parseError) {
                  const error = new Error("Failed to parse upload response");
                  setUploads((prev) => ({
                    ...prev,
                    [documentId]: {
                      ...prev[documentId],
                      status: "error",
                      error: error.message,
                    },
                  }));
                  reject(error);
                }
              } else {
                let errorMessage = `Upload failed (HTTP ${xhr.status})`;
                try {
                  const errorData = JSON.parse(xhr.responseText);
                  errorMessage = errorData.message || errorMessage;
                } catch {}
                setUploads((prev) => ({
                  ...prev,
                  [documentId]: {
                    ...prev[documentId],
                    status: "error",
                    error: errorMessage,
                  },
                }));
                reject(new Error(errorMessage));
              }
            });

            // ─── Error Event ─────────────────────────────────────────────────
            xhr.addEventListener("error", () => {
              const error = new Error("Network error during upload");
              setUploads((prev) => ({
                ...prev,
                [documentId]: {
                  ...prev[documentId],
                  status: "error",
                  error: error.message,
                },
              }));
              reject(error);
            });

            // ─── Abort Event ─────────────────────────────────────────────────
            xhr.addEventListener("abort", () => {
              setUploads((prev) => ({
                ...prev,
                [documentId]: {
                  ...prev[documentId],
                  status: "error",
                  error: "Upload cancelled",
                },
              }));
              reject(new Error("Upload cancelled"));
            });

            // ─── Timeout Event ───────────────────────────────────────────────
            xhr.addEventListener("timeout", () => {
              const error = new Error("Upload timed out");
              setUploads((prev) => ({
                ...prev,
                [documentId]: {
                  ...prev[documentId],
                  status: "error",
                  error: error.message,
                },
              }));
              reject(error);
            });

            xhr.timeout = 60000; // 60 second timeout
            xhr.send(formData);
          } else {
            const error = new Error("Unable to get auth token");
            setUploads((prev) => ({
              ...prev,
              [documentId]: {
                ...prev[documentId],
                status: "error",
                error: error.message,
              },
            }));
            reject(error);
          }
        });
      });
    },
    []
  );

  // ─── Cancel Upload ─────────────────────────────────────────────────────────

  const cancelUpload = useCallback((documentId: string) => {
    const xhr = xhrRefs.current[documentId];
    if (xhr && xhr.readyState < 4) {
      xhr.abort();
    }
    delete xhrRefs.current[documentId];
  }, []);

  // ─── Reset Upload State ────────────────────────────────────────────────────

  const resetUpload = useCallback((documentId: string) => {
    cancelUpload(documentId);
    setUploads((prev) => {
      const next = { ...prev };
      delete next[documentId];
      return next;
    });
  }, [cancelUpload]);

  // ─── Clear All ─────────────────────────────────────────────────────────────

  const clearAll = useCallback(() => {
    Object.keys(xhrRefs.current).forEach((id) => {
      const xhr = xhrRefs.current[id];
      if (xhr && xhr.readyState < 4) {
        xhr.abort();
      }
    });
    xhrRefs.current = {};
    setUploads({});
  }, []);

  return {
    uploads,
    overallProgress,
    isUploading,
    hasError,
    uploadFile,
    cancelUpload,
    resetUpload,
    clearAll,
  };
}
