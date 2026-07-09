import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BentoOverview } from './components/BentoOverview';
import { DestinationsManager } from './components/DestinationsManager';
import { JobsManager } from './components/JobsManager';
import { GalleryManager } from './components/GalleryManager';
import { BlogsManager } from './components/BlogsManager';
import { ContactResponsesManager } from './components/ContactResponsesManager';
import { LoginPage } from './components/LoginPage';

import { db, auth } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { compressImage } from './imageCompressor';

import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType, AdminUser } from './types';
import {
  INITIAL_GALLERY,
  INITIAL_BLOGS,
  INITIAL_RESPONSES,
} from './mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [responses, setResponses] = useState<ContactMessage[]>(INITIAL_RESPONSES);

  const handleLogin = () => {
    // This is called by LoginPage after successful signInWithEmailAndPassword.
    // The actual state update will happen in onAuthStateChanged below.
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          // Fetch user role from Firestore Admin_Users collection
          const userDocRef = doc(db, 'Admin_Users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let role: AdminUser['role'] = 'normal_user'; // default role
          if (userDoc.exists()) {
            role = userDoc.data().role as AdminUser['role'];
          }

          console.log("Firebase UID:", user.uid);
          console.log("Document Exists:", userDoc.exists());
          if (userDoc.exists()) {
            console.log("Document Data:", userDoc.data());
          }
          console.log("Assigned Role:", role);

          setCurrentUser({
            uid: user.uid,
            email: user.email || '',
            role: role
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsLoggedIn(false);
          setCurrentUser(null);
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
    // Fetch Gallery
    getDocs(collection(db, 'gallery'))
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
        if (data.length > 0) {
          setGallery(data);
        }
      })
      .catch(err => console.error('Error fetching gallery:', err));

    // Fetch Destinations
    getDocs(collection(db, 'destinations'))
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        if (data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(err => console.error('Error fetching destinations:', err));

    // Fetch jobs from backend API
    fetch('http://localhost:5000/api/v1/admin/jobs', {
      headers: {
        'Authorization': 'Bearer dev-mock-token'
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setJobs(json.data || []);
        }
      })
      .catch(err => console.error('Error fetching jobs:', err));

    // Fetch Blogs
    getDocs(collection(db, 'blogs'))
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        if (data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(err => console.error('Error fetching blogs:', err));
  }, []);

  const unreadCount = responses.filter(r => r.status === 'new').length;

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
      activeJobs: d.activeJobs,
      visaProcessingDays: d.visaProcessingDays,
      featured: d.featured,
      heroImage: finalImageUrl,
    };

    setDestinations(p => [newDest, ...p]);
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

    setDestinations(p => p.map(x => x.id === id ? { ...x, ...updatedData } : x));
    try {
      await updateDoc(doc(db, 'destinations', id), updatedData);
    } catch (err) {
      console.error('Error updating destination:', err);
    }
  };

  const deleteDest = async (id: string) => {
    setDestinations(p => p.filter(x => x.id !== id));
    try {
      await deleteDoc(doc(db, 'destinations', id));
    } catch (err) {
      console.error('Error deleting destination:', err);
    }
  };

  // Jobs
  const addJob = async (j: Omit<JobOpening, 'id'>) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev-mock-token'
        },
        body: JSON.stringify(j)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setJobs(p => [json.data, ...p]);
      }
    } catch (err) {
      console.error('Error adding job via API:', err);
      setJobs(p => [{ ...j, id: crypto.randomUUID() }, ...p]);
    }
  };

  const updateJob = async (id: string, j: Partial<JobOpening>) => {
    try {
      await fetch(`http://localhost:5000/api/v1/admin/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev-mock-token'
        },
        body: JSON.stringify(j)
      });
      setJobs(p => p.map(x => x.id === id ? { ...x, ...j } : x));
    } catch (err) {
      console.error('Error updating job via API:', err);
      setJobs(p => p.map(x => x.id === id ? { ...x, ...j } : x));
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/v1/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer dev-mock-token'
        }
      });
      setJobs(p => p.filter(x => x.id !== id));
    } catch (err) {
      console.error('Error deleting job via API:', err);
      setJobs(p => p.filter(x => x.id !== id));
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

    setGallery(p => [newItem, ...p]);
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

    setGallery(p => p.map(x => x.id === id ? { ...x, ...updatedData } : x));
    try {
      await updateDoc(doc(db, 'gallery', id), updatedData);
    } catch (err) {
      console.error('Error updating gallery item:', err);
    }
  };

  const deleteGallery = async (id: string) => {
    setGallery(p => p.filter(x => x.id !== id));
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
    };

    setBlogs(p => [newBlog, ...p]);
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

    setBlogs(p => p.map(x => x.id === id ? { ...x, ...updatedData } : x));
    try {
      await updateDoc(doc(db, 'blogs', id), updatedData);
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  const deleteBlog = async (id: string) => {
    setBlogs(p => p.filter(x => x.id !== id));
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  // Responses
  const updateResponseStatus = (id: string, status: ContactMessage['status']) => setResponses(p => p.map(x => x.id === id ? { ...x, status } : x));
  const deleteResponse = (id: string) => setResponses(p => p.filter(x => x.id !== id));
  const addResponse = (m: Omit<ContactMessage, 'id'>) => setResponses(p => [{ ...m, id: crypto.randomUUID() }, ...p]);

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Navbar activeTab={activeTab} unreadCount={unreadCount} onLogout={handleLogout} />
      <div className="app-body">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} role={currentUser.role} />
        <main className="main-content">
          {activeTab === 'overview' && (
            <BentoOverview
              destinations={destinations} jobs={jobs} gallery={gallery}
              blogs={blogs} responses={responses} setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'destinations' && (
            <DestinationsManager destinations={destinations} onAdd={addDest} onUpdate={updateDest} onDelete={deleteDest} role={currentUser.role} />
          )}
          {activeTab === 'jobs' && (
            <JobsManager jobs={jobs} onAdd={addJob} onUpdate={updateJob} onDelete={deleteJob} role={currentUser.role} />
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
        </main>
      </div>
    </div>
  );
}
