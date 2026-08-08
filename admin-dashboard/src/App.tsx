import { useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BentoOverview } from './components/BentoOverview';
import { DestinationsManager } from './components/DestinationsManager';
import { JobsManager } from './components/JobsManager';
import { GalleryManager } from './components/GalleryManager';
import { BlogsManager } from './components/BlogsManager';
import { ContactResponsesManager } from './components/ContactResponsesManager';
import { NotificationsCenter } from './components/NotificationsCenter';
import { LoginPage } from './components/LoginPage';
import { ProfileManager } from './components/ProfileManager';
import { RegisterEmployee } from './components/employees/RegisterEmployee';
import { EmployeeStatus } from './components/employees/EmployeeStatus';

import { MedicalManagement } from './components/employees/MedicalManagement';
import { UserDocuments } from './components/employees/UserDocuments';
import { CustomerManager } from './components/employees/CustomerManager';
import { PWAControl } from './components/employees/PWAControl';

import { db, auth, storage } from './firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { compressImage } from './imageCompressor';

import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType, AdminUser, Employee, MedicalStatus } from './types';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_EXPIRY_KEY = 'og_admin_session_expires_at';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const formatSubmittedAt = (value: unknown): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function') {
    return (value as any).toDate().toISOString();
  }
  return new Date().toISOString();
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [responses, setResponses] = useState<ContactMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [accessError, setAccessError] = useState('');
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const inactivityTimerRef = useRef<number | null>(null);

  const handleLogin = () => {
    // Auth state transitions are driven by onAuthStateChanged.
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem(SESSION_EXPIRY_KEY);
      await signOut(auth);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return import.meta.env.DEV
        ? { Authorization: 'Bearer dev-mock-token' }
        : {};
    }

    try {
      const token = await firebaseUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error('Error getting auth token:', error);
      return import.meta.env.DEV
        ? { Authorization: 'Bearer dev-mock-token' }
        : {};
    }
  };

  const requestLogout = () => setLogoutConfirmationOpen(true);

  const verifyAdminSession = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (import.meta.env.DEV) {
          return { uid: firebaseUser.uid, email: firebaseUser.email || '', role: 'super_user' as const };
        }
        throw new Error('This account is not authorized to access the admin dashboard.');
      }
      const payload = await response.json();
      if (!payload.success || !payload.data) throw new Error('Unable to verify administrator access.');
      return payload.data as AdminUser;
    } catch (err) {
      if (import.meta.env.DEV) {
        return { uid: firebaseUser.uid, email: firebaseUser.email || '', role: 'super_user' as const };
      }
      throw err;
    }
  };

  const fetchJobs = async () => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/jobs`, {
        headers: authHeaders,
      });
      const json = await res.json();
      if (json.success) {
        setJobs(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const expiresAt = Number(sessionStorage.getItem(SESSION_EXPIRY_KEY) || 0);
          if (expiresAt && expiresAt <= Date.now()) {
            sessionStorage.removeItem(SESSION_EXPIRY_KEY);
            await signOut(auth);
            return;
          }
          const session = await verifyAdminSession(user);
          setCurrentUser({ uid: session.uid, email: session.email || user.email || '', role: 'super_user' });
          setIsLoggedIn(true);
          setAccessError('');
        } catch (error) {
          console.error('Admin authorization failed:', error);
          setIsLoggedIn(false);
          setCurrentUser(null);
          setAccessError(error instanceof Error ? error.message : 'Unable to verify administrator access.');
          await signOut(auth);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubProfile = onSnapshot(doc(db, 'Admin_Users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            displayName: data.displayName || prev.displayName,
            photoUrl: data.photoUrl || prev.photoUrl,
          };
        });
      }
    });
    return () => unsubProfile();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubDestinations = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      const data = snapshot.docs.map((snapshotDoc) => {
        const payload = snapshotDoc.data() as Partial<Destination>;
        return {
          id: snapshotDoc.id,
          country: payload.country || '',
          region: payload.region || '',
          flag: payload.flag || '',
          heroImage: payload.heroImage || '',
          activeJobs: typeof payload.activeJobs === 'number' ? payload.activeJobs : 0,
          visaProcessingDays: typeof payload.visaProcessingDays === 'number' ? payload.visaProcessingDays : 0,
          featured: !!payload.featured,
          isActive: typeof payload.isActive === 'boolean' ? payload.isActive : true,
        } as Destination;
      });
      setDestinations(data);
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const data = snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() } as GalleryItem));
      setGallery(data);
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const data = snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() } as BlogPost));
      setBlogs(data);
    });

    const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('submittedAt', 'desc'));
    const unsubInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
      const data = snapshot.docs.map((snapshotDoc) => {
        const payload = snapshotDoc.data() as any;
        return {
          id: snapshotDoc.id,
          senderName: payload.name || payload.senderName || 'Unknown',
          email: payload.email || '',
          phone: payload.phone || payload.mobile || '',
          destinationOfInterest: payload.destinationOfInterest || payload.country || 'General Inquiry',
          message: payload.message || '',
          submittedAt: formatSubmittedAt(payload.submittedAt),
          status: payload.status || 'new',
          isBookmarked: !!payload.isBookmarked,
          idType: payload.idType || 'NIC',
          idNumber: payload.idNumber || 'N/A',
          cvUrl: payload.cvUrl || null,
          cvFileName: payload.cvFileName || null,
        } as ContactMessage;
      });
      setResponses(data);
    });

    fetchJobs();

    // Employees listener (Firestore)
    const unsubEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const data = snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() } as Employee));
      setEmployees(data);
    });

    return () => {
      unsubDestinations();
      unsubGallery();
      unsubBlogs();
      unsubInquiries();
      unsubEmployees();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = window.setTimeout(() => {
        sessionStorage.removeItem(SESSION_EXPIRY_KEY);
        signOut(auth).catch((err) => console.error('Auto logout failed:', err));
      }, INACTIVITY_TIMEOUT_MS);
      sessionStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + INACTIVITY_TIMEOUT_MS));
    };

    const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const expiresAt = Number(sessionStorage.getItem(SESSION_EXPIRY_KEY) || 0);
        if (expiresAt && expiresAt <= Date.now()) {
          signOut(auth).catch((err) => console.error('Session expiry logout failed:', err));
        } else {
          resetTimer();
        }
      }
    };
    events.forEach((event) => window.addEventListener(event, resetTimer));
    document.addEventListener('visibilitychange', handleVisibility);
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      document.removeEventListener('visibilitychange', handleVisibility);
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isLoggedIn]);

  const unreadCount = responses.filter(r => r.status === 'new').length;
  const activeDestinations = useMemo(
    () => destinations.filter((destination) => destination.isActive),
    [destinations]
  );
  const destinationsWithLiveCounts = useMemo(() => destinations.map((destination) => ({
    ...destination,
    activeJobs: jobs.filter((job) => job.country === destination.country && job.active && new Date(job.deadline) >= new Date()).length,
  })), [destinations, jobs]);

  // Universal Storage Asset Cleanup
  const deleteStorageAsset = async (fileUrl?: string | null) => {
    if (!fileUrl || typeof fileUrl !== 'string') return;
    if (fileUrl.includes('firebasestorage.googleapis.com') || fileUrl.startsWith('gs://')) {
      try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
      } catch (err) {
        console.warn('Storage asset cleanup skipped or already removed:', err);
      }
    }
  };

  // Destinations
  const addDest = async (d: Omit<Destination, 'id'> & { file?: File }) => {
    const id = crypto.randomUUID();
    let finalImageUrl = d.heroImage || '';

    if (d.file) {
      finalImageUrl = await compressImage(d.file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.75,
        maxSizeKB: 500,
      });
    }

    const newDest: Destination = {
      id,
      country: d.country,
      region: d.region,
      flag: d.flag,
      activeJobs: d.activeJobs,
      visaProcessingDays: d.visaProcessingDays,
      featured: d.featured,
      isActive: d.isActive,
      heroImage: finalImageUrl,
    };

    try {
      await setDoc(doc(db, 'destinations', id), newDest);
    } catch (err) {
      console.error('Error adding destination:', err);
    }
  };

  const updateDest = async (id: string, d: Partial<Destination> & { file?: File }) => {
    let finalImageUrl = d.heroImage;

    if (d.file) {
      finalImageUrl = await compressImage(d.file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.75,
        maxSizeKB: 500,
      });
    }

    const updatedData = { ...d };
    delete updatedData.file;
    if (finalImageUrl !== undefined) {
      updatedData.heroImage = finalImageUrl;
    }

    try {
      await updateDoc(doc(db, 'destinations', id), updatedData);
    } catch (err) {
      console.error('Error updating destination:', err);
    }
  };

  const deleteDest = async (id: string) => {
    try {
      const dest = destinations.find((item) => item.id === id);
      if (dest?.heroImage) {
        await deleteStorageAsset(dest.heroImage);
      }
      await deleteDoc(doc(db, 'destinations', id));
    } catch (err) {
      console.error('Error deleting destination:', err);
    }
  };

  // Jobs
  const addJob = async (j: Omit<JobOpening, 'id'>) => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(j)
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Failed to create job.');
      }
      await fetchJobs();
    } catch (err) {
      console.error('Error adding job via API:', err);
    }
  };

  const updateJob = async (id: string, j: Partial<JobOpening>) => {
    try {
      const authHeaders = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/api/v1/admin/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(j)
      });
      await fetchJobs();
    } catch (err) {
      console.error('Error updating job via API:', err);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const authHeaders = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/api/v1/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      await fetchJobs();
    } catch (err) {
      console.error('Error deleting job via API:', err);
    }
  };

  // Gallery
  const addGallery = async (g: Omit<GalleryItem, 'id'> & { file?: File }) => {
    const id = crypto.randomUUID();
    let finalUrl = g.imageUrl || '';

    if (g.file) {
      finalUrl = await compressImage(g.file, {
        maxWidth: 1400,
        maxHeight: 1000,
        quality: 0.8,
        maxSizeKB: 800,
      });
    }

    const newItem: GalleryItem = {
      id,
      title: g.title,
      category: g.category,
      dateAdded: g.dateAdded || new Date().toISOString().split('T')[0],
      imageUrl: finalUrl,
    };

    try {
      await setDoc(doc(db, 'gallery', id), newItem);
    } catch (err) {
      console.error('Error adding gallery item:', err);
    }
  };

  const updateGallery = async (id: string, g: Partial<GalleryItem> & { file?: File }) => {
    let finalUrl = g.imageUrl;

    if (g.file) {
      finalUrl = await compressImage(g.file, {
        maxWidth: 1400,
        maxHeight: 1000,
        quality: 0.8,
        maxSizeKB: 800,
      });
    }

    const updatedData = { ...g };
    delete updatedData.file;
    if (finalUrl !== undefined) {
      updatedData.imageUrl = finalUrl;
    }

    try {
      await updateDoc(doc(db, 'gallery', id), updatedData);
    } catch (err) {
      console.error('Error updating gallery item:', err);
    }
  };

  const deleteGallery = async (id: string) => {
    try {
      const item = gallery.find((g) => g.id === id);
      if (item?.imageUrl) {
        await deleteStorageAsset(item.imageUrl);
      }
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      console.error('Error deleting gallery item:', err);
    }
  };

  // Blogs
  const addBlog = async (b: Omit<BlogPost, 'id'> & { file?: File }) => {
    const id = crypto.randomUUID();
    let finalImageUrl = b.image || '';

    if (b.file) {
      finalImageUrl = await compressImage(b.file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.75,
        maxSizeKB: 500,
      });
    }

    const newBlog: BlogPost = {
      id,
      title: b.title,
      category: b.category,
      publishDate: b.publishDate || new Date().toISOString().split('T')[0],
      readTime: b.readTime || '3 min read',
      excerpt: b.excerpt,
      image: finalImageUrl,
      author: b.author || 'Admin Team',
      sourceType: b.sourceType || (b.category === 'AI Generated' ? 'ai' : 'manual'),
    };

    try {
      await setDoc(doc(db, 'blogs', id), newBlog);
    } catch (err) {
      console.error('Error adding blog:', err);
    }
  };

  const updateBlog = async (id: string, b: Partial<BlogPost> & { file?: File }) => {
    let finalImageUrl = b.image;

    if (b.file) {
      finalImageUrl = await compressImage(b.file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.75,
        maxSizeKB: 500,
      });
    }

    const updatedData = { ...b };
    delete updatedData.file;
    if (finalImageUrl !== undefined) {
      updatedData.image = finalImageUrl;
    }

    try {
      await updateDoc(doc(db, 'blogs', id), updatedData);
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const blog = blogs.find((b) => b.id === id);
      if (blog?.image) {
        await deleteStorageAsset(blog.image);
      }
      await deleteDoc(doc(db, 'blogs', id));
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  // Responses
  const updateResponseStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const toggleResponseBookmark = async (id: string, currentBookmarked?: boolean) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { isBookmarked: !currentBookmarked });
    } catch (error) {
      console.error('Error toggling inquiry bookmark:', error);
    }
  };

  const deleteResponse = async (id: string) => {
    try {
      const resp = responses.find((r) => r.id === id);
      if (resp?.cvUrl) {
        await deleteStorageAsset(resp.cvUrl);
      }
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const markAllResponsesAsRead = async () => {
    const unreadList = responses.filter((r) => r.status === 'new');
    for (const item of unreadList) {
      try {
        await updateDoc(doc(db, 'inquiries', item.id), { status: 'replied' });
      } catch (err) {
        console.error('Error marking response as read:', err);
      }
    }
  };

  const addResponse = async (m: Omit<ContactMessage, 'id'>) => {
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'inquiries', id), {
        name: m.senderName,
        email: m.email,
        phone: m.phone,
        destinationOfInterest: m.destinationOfInterest,
        message: m.message,
        submittedAt: new Date().toISOString(),
        status: m.status,
        isBookmarked: !!m.isBookmarked,
        cvUrl: m.cvUrl || null,
        cvFileName: m.cvFileName || null,
      });
      await fetchJobs();
    } catch (err) {
      console.error('Error adding response:', err);
    }
  };

  // Employee handlers — write directly to Firestore (same as destinations, gallery, blogs)
  const addEmployee = async (data: Record<string, unknown>) => {
    // Try to create via backend API (enforces duplicate checks). Fallback to direct Firestore write on failure.
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success) return;
        // otherwise fallthrough to client write
      }
    } catch (err) {
      console.warn('API createEmployee failed, falling back to client write', err);
    }

    const id = crypto.randomUUID();
    const defaultTracking = [
      { step: 'Application Submitted', completed: false, date: null, fileUrl: null },
      { step: 'Medical Examination',   completed: false, date: null, fileUrl: null },
      { step: 'Visa Application',      completed: false, date: null, fileUrl: null },
      { step: 'Embassy Interview',     completed: false, date: null, fileUrl: null },
      { step: 'Flight Booking',        completed: false, date: null, fileUrl: null },
      { step: 'Departure',             completed: false, date: null, fileUrl: null },
    ];

    const newEmployee = {
      // Explicit document & detail placeholders
      nicDocUrl: data.nicDocUrl || null,
      nicDocName: data.nicDocName || null,
      passportDocUrl: data.passportDocUrl || null,
      passportDocName: data.passportDocName || null,
      policeReportUrl: data.policeReportUrl || null,
      policeReportName: data.policeReportName || null,
      photoUrl: data.photoDocUrl || data.photoUrl || null,
      photoDocName: data.photoDocName || null,
      trusteeDob: data.trusteeDob || null,
      childrenDetails: data.childrenDetails || [],
      ...data,
      id,
      medicalStatus: 'not_dated',
      tracking: defaultTracking,
      status: 'active',
      registeredAt: new Date().toISOString(),
      registeredBy: currentUser?.email || 'admin',
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: currentUser?.email || 'admin',
    };

    await setDoc(doc(db, 'employees', id), newEmployee);
  };

  const deleteEmployeeApi = async (id: string) => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/employees/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) {
        throw new Error('API delete failed');
      }
    } catch (err) {
      console.error('deleteEmployeeApi error:', err);
      throw err;
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      const { id: _id, ...rest } = data as Employee;
      void _id;
      await updateDoc(doc(db, 'employees', id), {
        ...rest,
        lastUpdatedAt: new Date().toISOString(),
        lastUpdatedBy: currentUser?.email || 'admin',
      });
    } catch (err) {
      console.error('updateEmployee error:', err);
      throw err;
    }
  };

  const updateEmployeeMedical = async (id: string, status: MedicalStatus, center?: string, date?: string, notes?: string) => {
    try {
      await updateDoc(doc(db, 'employees', id), {
        medicalStatus: status,
        ...(center !== undefined && { medicalCenter: center }),
        ...(date !== undefined && { medicalDate: date }),
        ...(notes !== undefined && { medicalNotes: notes }),
        lastUpdatedAt: new Date().toISOString(),
        lastUpdatedBy: currentUser?.email || 'admin',
      });
    } catch (err) {
      console.error('updateEmployeeMedical error:', err);
      throw err;
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={handleLogin} initialError={accessError} />;
  }

  return (
    <div className="dashboard-stage">
      <div className="app-shell premium-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} role={currentUser.role} onLogout={requestLogout} />
        <div className="app-main-wrapper">
          <Navbar
            activeTab={activeTab}
            unreadCount={unreadCount}
            responses={responses}
            onUpdateStatus={updateResponseStatus}
            onMarkAllAsRead={markAllResponsesAsRead}
            onDeleteResponse={deleteResponse}
            onNavigate={setActiveTab}
            onProfile={() => setActiveTab('profile')}
            userInitials={(currentUser.displayName || currentUser.email || 'AD').slice(0, 2).toUpperCase()}
            userPhotoUrl={currentUser.photoUrl}
          />
          <main className="main-content">
            {activeTab === 'overview' && (
              <BentoOverview
                destinations={destinationsWithLiveCounts} jobs={jobs} gallery={gallery}
                blogs={blogs} responses={responses} setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'destinations' && (
              <DestinationsManager destinations={destinationsWithLiveCounts} onAdd={addDest} onUpdate={updateDest} onDelete={deleteDest} role={currentUser.role} />
            )}
            {activeTab === 'jobs' && (
              <JobsManager
                jobs={jobs}
                onAdd={addJob}
                onUpdate={updateJob}
                onDelete={deleteJob}
                role={currentUser.role}
                availableDestinations={activeDestinations.map((destination) => destination.country)}
              />
            )}
            {activeTab === 'gallery' && (
              <GalleryManager gallery={gallery} onAdd={addGallery} onUpdate={updateGallery} onDelete={deleteGallery} role={currentUser.role} />
            )}
            {activeTab === 'blogs' && (
              <BlogsManager blogs={blogs} onAdd={addBlog} onUpdate={updateBlog} onDelete={deleteBlog} role={currentUser.role} />
            )}
            {activeTab === 'responses' && (
              <ContactResponsesManager
                responses={responses}
                onUpdateStatus={updateResponseStatus}
                onToggleBookmark={toggleResponseBookmark}
                onDelete={deleteResponse}
                onAddReplySim={addResponse}
                role={currentUser.role}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsCenter
                responses={responses}
                onUpdateStatus={updateResponseStatus}
                onMarkAllAsRead={markAllResponsesAsRead}
                onDelete={deleteResponse}
                role={currentUser.role}
              />
            )}
            {activeTab === 'profile' && <ProfileManager user={currentUser} />}

            {/* Employee Management Tabs */}
            {activeTab === 'emp-register' && (
              <RegisterEmployee
                destinations={destinations}
                onRegister={addEmployee}
                onSuccess={() => setActiveTab('emp-status')}
              />
            )}
            {activeTab === 'emp-status' && (
              <EmployeeStatus
                employees={employees}
                onNavigate={(tab) => setActiveTab(tab)}
                onUpdate={updateEmployee}
              />
            )}
            {activeTab === 'emp-manage' && (
              <CustomerManager
                employees={employees}
                currentUser={currentUser}
                addEmployee={addEmployee}
                updateEmployee={updateEmployee}
                updateEmployeeMedical={updateEmployeeMedical}
                deleteEmployeeApi={deleteEmployeeApi}
              />
            )}

            {activeTab === 'emp-medical' && (
              <MedicalManagement
                employees={employees}
                destinations={destinations}
                onUpdate={updateEmployee}
              />
            )}
            {activeTab === 'emp-user-docs' && (
              <UserDocuments
                employees={employees}
                destinations={destinations}
                onUpdate={updateEmployee}
              />
            )}
            {activeTab === 'pwa-control' && (
              <PWAControl
                employees={employees}
                destinations={destinations}
              />
            )}
          </main>
        </div>
        {logoutConfirmationOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="modal logout-confirmation">
              <div className="modal-header">
                <div><h3 id="logout-title" className="modal-title">Log out of the dashboard?</h3><p className="logout-confirmation-copy">Your current admin session will end on this device.</p></div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setLogoutConfirmationOpen(false)}>Stay signed in</button>
                <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
