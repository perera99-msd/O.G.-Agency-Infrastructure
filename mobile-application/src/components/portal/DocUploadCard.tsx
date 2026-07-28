// src/components/portal/DocUploadCard.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import { StatusBadge } from "./StatusBadge";
import type { ApplicantDocument, DocumentType } from "@/types/applicant";
import {
  UploadCloud,
  FileText,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface DocUploadCardProps {
  document: ApplicantDocument;
  onUpload?: (documentId: string, file: File) => void;
  onDelete?: (documentId: string) => void;
  onRemove?: (documentId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: "Passport",
  cv: "CV / Resume",
  photo: "Passport Photo",
  medical_certificate: "Medical Certificate",
  police_clearance: "Police Clearance",
  employment_contract: "Employment Contract",
  visa_application: "Visa Application",
  flight_ticket: "Flight Ticket",
  other: "Other Document",
};

const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  passport: "🛂",
  cv: "📄",
  photo: "📷",
  medical_certificate: "🏥",
  police_clearance: "📋",
  employment_contract: "📝",
  visa_application: "🛂",
  flight_ticket: "✈️",
  other: "📁",
};

const ACCEPTED_TYPES = {
  passport: ".pdf,.jpg,.jpeg,.png",
  cv: ".pdf,.doc,.docx",
  photo: ".jpg,.jpeg,.png",
  medical_certificate: ".pdf,.jpg,.jpeg,.png",
  police_clearance: ".pdf,.jpg,.jpeg,.png",
  employment_contract: ".pdf,.doc,.docx",
  visa_application: ".pdf,.jpg,.jpeg,.png",
  flight_ticket: ".pdf,.jpg,.jpeg,.png",
  other: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
};

export function DocUploadCard({
  document,
  onUpload,
  onDelete,
  onRemove,
  showActions = true,
  compact = false,
}: DocUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, uploadFile, cancelUpload, resetUpload } = useUploadProgress();

  const uploadState = uploads[document.id];
  const isUploading = uploadState?.status === "uploading";
  const progress = uploadState?.progress || 0;
  const uploadError = uploadState?.error || localError;

  const typeLabel = DOCUMENT_TYPE_LABELS[document.type] || document.title;
  const typeIcon = DOCUMENT_TYPE_ICONS[document.type] || "📁";
  const acceptedTypes = ACCEPTED_TYPES[document.type] || ".pdf,.doc,.docx,.jpg,.jpeg,.png";

  const handleFileSelect = useCallback(
    async (file: File) => {
      setLocalError(null);

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setLocalError(
          `File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`
        );
        return;
      }

      // Validate file type
      const allowedExtensions = acceptedTypes.split(",").map((ext) => ext.trim());
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExt || "")) {
        setLocalError(
          `Invalid file type. Accepted: ${allowedExtensions.join(", ")}`
        );
        return;
      }

      try {
        const result = await uploadFile(file, document.id, {
          documentType: document.type,
          title: document.title,
        });
        onUpload?.(document.id, file);
      } catch (error) {
        setLocalError(
          error instanceof Error ? error.message : "Upload failed"
        );
      }
    },
    [document, uploadFile, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    resetUpload(document.id);
    onRemove?.(document.id);
  }, [document.id, resetUpload, onRemove]);

  const handleDelete = useCallback(() => {
    if (window.confirm("Remove this document? This cannot be undone.")) {
      onDelete?.(document.id);
    }
  }, [document.id, onDelete]);

  const handleCancelUpload = useCallback(() => {
    cancelUpload(document.id);
  }, [document.id, cancelUpload]);

  const isUploaded = document.fileUrl && document.status !== "pending";

  return (
    <div
      className={`doc-upload-card ${isDragging ? "doc-upload-card--dragging" : ""} ${compact ? "doc-upload-card--compact" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Header */}
      <div className="doc-upload-card__header">
        <div className="doc-upload-card__type">
          <span className="doc-upload-card__icon">{typeIcon}</span>
          <div>
            <h3 className="doc-upload-card__title">{typeLabel}</h3>
            {document.description && (
              <p className="doc-upload-card__desc">{document.description}</p>
            )}
          </div>
        </div>
        {showActions && (
          <StatusBadge status={document.status} size="sm" />
        )}
      </div>

      {/* Upload Area */}
      {!isUploaded && !isUploading && (
        <div
          className="doc-upload-card__dropzone"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="doc-upload-card__input"
            aria-label={`Upload ${typeLabel}`}
          />
          <UploadCloud className="doc-upload-card__upload-icon" size={32} />
          <p className="doc-upload-card__dropzone-text">
            {isDragging
              ? "Release to upload"
              : `Click or drag to upload ${typeLabel.toLowerCase()}`}
          </p>
          <p className="doc-upload-card__dropzone-hint">
            Accepted: {acceptedTypes}
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="doc-upload-card__progress">
          <div className="doc-upload-card__progress-bar">
            <div
              className="doc-upload-card__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="doc-upload-card__progress-text">{progress}%</span>
          <button
            className="doc-upload-card__cancel-btn"
            onClick={handleCancelUpload}
            aria-label="Cancel upload"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Uploaded File Preview */}
      {isUploaded && !isUploading && (
        <div className="doc-upload-card__preview">
          <div className="doc-upload-card__file-info">
            <FileText className="doc-upload-card__file-icon" size={24} />
            <div className="doc-upload-card__file-details">
              <span className="doc-upload-card__file-name">
                {document.fileName || "Uploaded file"}
              </span>
              {document.fileSize && (
                <span className="doc-upload-card__file-size">
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
              {document.uploadedAt && (
                <span className="doc-upload-card__file-date">
                  Uploaded:{" "}
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {document.verifiedAt && (
            <div className="doc-upload-card__verified">
              <CheckCircle2 size={16} />
              Verified
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="doc-upload-card__error">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="doc-upload-card__actions">
          {!isUploading && isUploaded && (
            <button
              className="doc-upload-card__action-btn doc-upload-card__action--delete"
              onClick={handleDelete}
              aria-label={`Delete ${typeLabel}`}
            >
              <Trash2 size={16} />
              Remove
            </button>
          )}
          {!isUploading && !isUploaded && (
            <button
              className="doc-upload-card__action-btn doc-upload-card__action--remove"
              onClick={handleRemove}
              aria-label={`Remove ${typeLabel}`}
            >
              <Trash2 size={16} />
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
