// src/app/(portal)/documents/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DocUploadCard } from "@/components/portal/DocUploadCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { fetchDocuments, deleteDocument } from "@/lib/api/client";
import type { ApplicantDocument, DocumentCategory, DocumentType } from "@/types/applicant";
import {
  FileText,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const REQUIRED_DOCUMENTS: { type: DocumentType; title: string; description: string }[] = [
  { type: "passport", title: "Passport", description: "Valid passport with at least 6 months validity" },
  { type: "photo", title: "Passport Photo", description: "Recent passport-sized photo (white background)" },
  { type: "cv", title: "CV / Resume", description: "Updated CV with work experience" },
  { type: "medical_certificate", title: "Medical Certificate", description: "Completed medical examination report" },
  { type: "police_clearance", title: "Police Clearance", description: "Police clearance certificate from country of residence" },
  { type: "employment_contract", title: "Employment Contract", description: "Signed job offer or contract" },
];

const OPTIONAL_DOCUMENTS: { type: DocumentType; title: string; description: string }[] = [
  { type: "visa_application", title: "Visa Application Form", description: "Completed visa application" },
  { type: "flight_ticket", title: "Flight Ticket", description: "Confirmed flight itinerary" },
];

export default function DocumentsPage() {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const res = await fetchDocuments();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpload = (documentId: string, file: File) => {
    // Refresh document list after upload
    loadDocuments();
  };

  const handleDelete = async (documentId: string) => {
    setActionLoading(documentId);
    try {
      await deleteDocument(documentId);
      loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = (documentId: string) => {
    // Remove from local state (for pending documents not yet uploaded)
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        documents: cat.documents.filter((d) => d.id !== documentId),
      }))
    );
  };

  // Build document list from categories or use defaults
  const allDocuments: ApplicantDocument[] =
    categories.length > 0
      ? categories.flatMap((cat) => cat.documents)
      : [];

  const uploadedCount = allDocuments.filter(
    (d) => d.status === "uploaded" || d.status === "verified"
  ).length;
  const verifiedCount = allDocuments.filter((d) => d.status === "verified").length;
  const totalCount = REQUIRED_DOCUMENTS.length + OPTIONAL_DOCUMENTS.length;

  if (isLoading) {
    return (
      <div className="documents-loading">
        <div className="documents-loading__spinner" />
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="documents-page">
      {/* ── Header ── */}
      <header className="documents-header">
        <Link href="/dashboard" className="documents-header__back">
          <ArrowLeft size={20} />
        </Link>
        <div className="documents-header__title">
          <h1>My Documents</h1>
          <p>Upload and manage your required documents</p>
        </div>
      </header>

      {/* ── Summary ── */}
      <section className="documents-summary">
        <div className="summary-card">
          <div className="summary-card__icon">
            <FileText size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__count">{uploadedCount}/{totalCount}</span>
            <span className="summary-card__label">Documents uploaded</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card__icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__count">{verifiedCount}</span>
            <span className="summary-card__label">Documents verified</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card__icon">
            <Upload size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__count">{totalCount - uploadedCount}</span>
            <span className="summary-card__label">Remaining to upload</span>
          </div>
        </div>
      </section>

      {error && (
        <div className="documents-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Required Documents ── */}
      <section className="documents-section">
        <h2 className="documents-section__title">
          Required Documents
          <span className="documents-section__subtitle">
            These documents are mandatory for your application
          </span>
        </h2>
        <div className="documents-grid">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const existing = allDocuments.find((d) => d.type === doc.type);
            const document: ApplicantDocument = existing || {
              id: `req-${doc.type}`,
              type: doc.type,
              title: doc.title,
              description: doc.description,
              status: "pending",
              required: true,
            };

            return (
              <DocUploadCard
                key={doc.type}
                document={document}
                onUpload={handleUpload}
                onDelete={handleDelete}
                onRemove={handleRemove}
                showActions={!!existing}
                compact={false}
              />
            );
          })}
        </div>
      </section>

      {/* ── Optional Documents ── */}
      <section className="documents-section">
        <h2 className="documents-section__title">
          Optional Documents
          <span className="documents-section__subtitle">
            Additional documents that may speed up your application
          </span>
        </h2>
        <div className="documents-grid">
          {OPTIONAL_DOCUMENTS.map((doc) => {
            const existing = allDocuments.find((d) => d.type === doc.type);
            const document: ApplicantDocument = existing || {
              id: `opt-${doc.type}`,
              type: doc.type,
              title: doc.title,
              description: doc.description,
              status: "pending",
              required: false,
            };

            return (
              <DocUploadCard
                key={doc.type}
                document={document}
                onUpload={handleUpload}
                onDelete={handleDelete}
                onRemove={handleRemove}
                showActions={!!existing}
                compact={false}
              />
            );
          })}
        </div>
      </section>

      {/* ── Uploaded Documents Table ── */}
      {allDocuments.length > 0 && (
        <section className="documents-section">
          <h2 className="documents-section__title">All Uploaded Documents</h2>
          <div className="documents-table-container">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allDocuments
                  .filter((d) => d.fileUrl)
                  .map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="documents-table__file">
                          <FileText size={16} />
                          <span>{doc.fileName || doc.title}</span>
                        </div>
                      </td>
                      <td>{doc.type.replace("_", " ")}</td>
                      <td>
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                      <td>
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <button
                          className="documents-table__delete-btn"
                          onClick={() => handleDelete(doc.id)}
                          disabled={actionLoading === doc.id}
                          aria-label={`Delete ${doc.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
