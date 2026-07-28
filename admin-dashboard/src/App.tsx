import { useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BentoOverview } from './components/BentoOverview';
import { DestinationsManager } from './components/DestinationsManager';
import { JobsManager } from './components/JobsManager';
import { GalleryManager } from './components/GalleryManager';
import { BlogsManager } from './components/BlogsManager';
import { ContactResponsesManager } from './components/ContactResponsesManager';
import { LoginPage } from './components/LoginPage';
import { ProfileManager } from './components/ProfileManager';

import { db, auth } from './firebase';
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
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { compressImage } from './imageCompressor';

import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType, AdminUser } from './types';

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
          // Firebase proves identity; the backend proves administrator access.
          // Do not grant dashboard access from a client-readable Firestore role.
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
          cvUrl: payload.cvUrl || null,
          cvFileName: payload.cvFileName || null,
        } as ContactMessage;
      });
      setResponses(data);
    });

    fetchJobs();

    return () => {
      unsubDestinations();
      unsubGallery();
      unsubBlogs();
      unsubInquiries();
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

  // Gallery — images compressed client-side and stored as base64 in Firestore
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

  const deleteResponse = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
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
        cvUrl: m.cvUrl || null,
        cvFileName: m.cvFileName || null,
      });
      await fetchJobs();
    } catch (err) {
      console.error('Error adding job via API:', err);
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
          <Navbar activeTab={activeTab} unreadCount={unreadCount} onProfile={() => setActiveTab('profile')} userInitials={(currentUser.email || 'AD').slice(0, 2).toUpperCase()} />
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
                responses={responses} onUpdateStatus={updateResponseStatus}
                onDelete={deleteResponse} onAddReplySim={addResponse} role={currentUser.role}
              />
            )}
            {activeTab === 'profile' && <ProfileManager user={currentUser} />}
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
