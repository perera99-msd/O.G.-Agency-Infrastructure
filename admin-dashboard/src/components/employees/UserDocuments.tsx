import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  where
} from 'firebase/firestore';
import { Check, X, Download, AlertCircle, MessageSquare } from 'lucide-react';
import type { Employee } from '../../types';

interface UserSubmission {
  id: string;
  employeeId: string;
  employeeName: string;
  passportNumber: string;
  stepName: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const UserDocuments: React.FC = () => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingSub, setRejectingSub] = useState<UserSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Real-time listener for pending submissions
  useEffect(() => {
    const q = query(
      collection(db, 'user_submissions'),
      where('status', '==', 'pending')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserSubmission, 'id'>)
      }) as UserSubmission);
      
      // Sort by submittedAt descending
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      
      setSubmissions(list);
      setLoading(false);
    }, (err) => {
      console.error("Firestore submissions listener error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleApprove = async (sub: UserSubmission) => {
    const confirmed = window.confirm(`Approve "${sub.stepName}" for ${sub.employeeName}? This will update their checklist.`);
    if (!confirmed) return;

    try {
      // 1. Fetch employee
      const empRef = doc(db, 'employees', sub.employeeId);
      const empSnap = await getDoc(empRef);
      if (!empSnap.exists()) {
        alert("Employee not found in database.");
        return;
      }
      
      const empData = empSnap.data() as Employee;
      const updatedTracking = (empData.tracking || []).map(step => {
        if (step.step === sub.stepName) {
          return {
            ...step,
            completed: true,
            fileUrl: sub.fileUrl,
            date: new Date().toISOString().split('T')[0],
            comment: "" // clear rejection comments
          };
        }
        return step;
      });

      // 2. Update employee's tracking checklist
      await updateDoc(empRef, { tracking: updatedTracking });

      // 3. Mark submission as approved
      await updateDoc(doc(db, 'user_submissions', sub.id), {
        status: 'approved'
      });

      alert("Document approved successfully and checklist updated!");
    } catch (err) {
      console.error("Approve document error:", err);
      alert("Failed to approve document.");
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingSub || !rejectReason.trim()) return;

    setIsSubmittingReject(true);
    try {
      // Mark submission as rejected and save rejection comment/reason
      await updateDoc(doc(db, 'user_submissions', rejectingSub.id), {
        status: 'rejected',
        comment: rejectReason.trim()
      });

      // Also clear the fileUrl and completion status in employee's checklist
      const empRef = doc(db, 'employees', rejectingSub.employeeId);
      const empSnap = await getDoc(empRef);
      if (empSnap.exists()) {
        const empData = empSnap.data() as Employee;
        const updatedTracking = (empData.tracking || []).map(step => {
          if (step.step === rejectingSub.stepName) {
            return {
              ...step,
              completed: false,
              fileUrl: null,
              date: null,
              comment: rejectReason.trim()
            };
          }
          return step;
        });
        await updateDoc(empRef, { tracking: updatedTracking });
      }

      alert("Document rejected. Request sent to applicant mobile app.");
      setRejectingSub(null);
      setRejectReason('');
    } catch (err) {
      console.error("Reject document error:", err);
      alert("Failed to reject document.");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  if (loading) {
    return (
      <div className="emp-page" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading submitted documents...</p>
      </div>
    );
  }

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h2 className="emp-page-title">User Document Submissions</h2>
          <p className="emp-page-sub">Review documents uploaded by applicants via the mobile application</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="emp-form-section" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <AlertCircle size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No pending document submissions found.</p>
        </div>
      ) : (
        <div className="emp-form-section">
          <div className="emp-table-wrapper">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Passport</th>
                  <th>Document Type</th>
                  <th>Submitted At</th>
                  <th>Submitted File</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="emp-table-row">
                    <td className="emp-table-name">{sub.employeeName}</td>
                    <td className="emp-mono">{sub.passportNumber}</td>
                    <td>
                      <span className="emp-country-tag">{sub.stepName}</span>
                    </td>
                    <td>{formatDate(sub.submittedAt)}</td>
                    <td>
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="emp-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <Download size={14} />
                        Download File
                      </a>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(sub)}
                          className="emp-btn-primary"
                          style={{ background: 'var(--green)', borderColor: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingSub(sub)}
                          className="emp-btn-secondary"
                          style={{ borderColor: 'var(--red)', color: 'var(--red)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Comment Modal */}
      {rejectingSub && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 17, 21, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleRejectSubmit} className="emp-form-section" style={{ width: '90%', maxWidth: '500px', margin: 0, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="emp-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
              Reject Document Submission
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Please enter the reason for rejecting <strong>{rejectingSub.employeeName}</strong>&apos;s submission for <strong>{rejectingSub.stepName}</strong>. This request message will show in their mobile application.
            </p>

            <div className="emp-form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="emp-label">Rejection Reason / Comments</label>
              <textarea
                className="emp-form-control"
                style={{ width: '100%', height: '120px', resize: 'none', padding: '0.75rem' }}
                placeholder="e.g. The photo uploaded was blurry. Please upload a high resolution scan of your passport page."
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => { setRejectingSub(null); setRejectReason(''); }}
                className="emp-btn-secondary"
                disabled={isSubmittingReject}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="emp-btn-primary"
                style={{ background: 'var(--red)', borderColor: 'var(--red)' }}
                disabled={isSubmittingReject || !rejectReason.trim()}
              >
                {isSubmittingReject ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
