import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage } from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_JOBS,
  INITIAL_GALLERY,
  INITIAL_BLOGS,
  INITIAL_RESPONSES,
} from '../mockData';
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

/** Rejects after `ms` milliseconds – prevents Firestore from hanging forever */
function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms / 1000}s. Check your Firestore security rules.`)), ms)
    ),
  ]);
}

/**
 * Compresses and resizes an image in the browser using Canvas API.
 * Outputs a base64 JPEG string stored directly in Firestore.
 * No Firebase Storage or external service needed — 100% free.
 * Output size: ~100–250KB (well within Firestore's 1MB document limit).
 */
function compressImageToBase64(file: File, maxPx = 1200, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Scale down if larger than maxPx on either dimension
      if (width > maxPx || height > maxPx) {
        if (width > height) {
          height = Math.round((height / width) * maxPx);
          width = maxPx;
        } else {
          width = Math.round((width / height) * maxPx);
          height = maxPx;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}


export interface AdminContextType {
  destinations: Destination[];
  jobs: JobOpening[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  responses: ContactMessage[];
  unreadCount: number;

  addDest: (d: Omit<Destination, 'id'>) => Promise<void>;
  updateDest: (id: string, d: Partial<Destination>) => Promise<void>;
  deleteDest: (id: string) => Promise<void>;

  addJob: (j: Omit<JobOpening, 'id'>) => Promise<void>;
  updateJob: (id: string, j: Partial<JobOpening>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;

  addGallery: (g: Omit<GalleryItem, 'id'> & { file?: File }) => Promise<void>;
  updateGallery: (id: string, g: Partial<GalleryItem>) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;

  addBlog: (b: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlog: (id: string, b: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  updateResponseStatus: (id: string, status: ContactMessage['status']) => void;
  deleteResponse: (id: string) => void;
  addResponse: (m: Omit<ContactMessage, 'id'>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [responses, setResponses] = useState<ContactMessage[]>(INITIAL_RESPONSES);

  // ── Real-time Firestore listeners ─────────────────────────────────────────

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'gallery'),
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
        if (data.length > 0) setGallery(data);
      },
      err => console.error('Gallery listener error:', err),
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'destinations'),
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Destination));
        if (data.length > 0) setDestinations(data);
      },
      err => console.error('Destinations listener error:', err),
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'jobs'),
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JobOpening));
        if (data.length > 0) setJobs(data);
      },
      err => console.error('Jobs listener error:', err),
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'blogs'),
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
        if (data.length > 0) setBlogs(data);
      },
      err => console.error('Blogs listener error:', err),
    );
    return unsub;
  }, []);

  // responses — real-time, ordered newest first
  useEffect(() => {
    const q = query(collection(db, 'responses'), orderBy('submittedAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
        setResponses(data);
      },
      err => console.error('Responses listener error:', err),
    );
    return unsub;
  }, []);

  const unreadCount = responses.filter(r => r.status === 'new').length;

  // ── Destinations ──────────────────────────────────────────────────────────

  const addDest = async (d: Omit<Destination, 'id'>) => {
    const id = crypto.randomUUID();
    const newDest: Destination = { ...d, id };
    setDestinations(p => [newDest, ...p]);
    try {
      await withTimeout(setDoc(doc(db, 'destinations', id), newDest), 10000);
    } catch (err) {
      console.error('Error saving destination:', err);
    }
  };

  const updateDest = async (id: string, d: Partial<Destination>) => {
    setDestinations(p => p.map(x => x.id === id ? { ...x, ...d } : x));
    try {
      await withTimeout(updateDoc(doc(db, 'destinations', id), d), 10000);
    } catch (err) {
      console.error('Error updating destination:', err);
    }
  };

  const deleteDest = async (id: string) => {
    setDestinations(p => p.filter(x => x.id !== id));
    try {
      await withTimeout(deleteDoc(doc(db, 'destinations', id)), 10000);
    } catch (err) {
      console.error('Error deleting destination:', err);
    }
  };

  // ── Jobs ──────────────────────────────────────────────────────────────────

  const addJob = async (j: Omit<JobOpening, 'id'>) => {
    const id = crypto.randomUUID();
    const newJob: JobOpening = { ...j, id };
    setJobs(p => [newJob, ...p]);
    try {
      await withTimeout(setDoc(doc(db, 'jobs', id), newJob), 10000);
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const updateJob = async (id: string, j: Partial<JobOpening>) => {
    setJobs(p => p.map(x => x.id === id ? { ...x, ...j } : x));
    try {
      await withTimeout(updateDoc(doc(db, 'jobs', id), j), 10000);
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const deleteJob = async (id: string) => {
    setJobs(p => p.filter(x => x.id !== id));
    try {
      await withTimeout(deleteDoc(doc(db, 'jobs', id)), 10000);
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // ── Gallery ───────────────────────────────────────────────────────────────

  const addGallery = async (g: Omit<GalleryItem, 'id'> & { file?: File }) => {
    let finalImageUrl = g.imageUrl;
    const id = crypto.randomUUID();

    if (g.file) {
      // Compress & resize in browser, store base64 in Firestore (100% free, no Storage needed)
      finalImageUrl = await compressImageToBase64(g.file);
    }

    const newItem: GalleryItem = {
      id,
      title: g.title,
      category: g.category,
      imageUrl: finalImageUrl,
      dateAdded: g.dateAdded,
    };

    setGallery(p => [newItem, ...p]);
    await withTimeout(setDoc(doc(db, 'gallery', id), newItem), 10000);
  };

  const updateGallery = async (id: string, g: Partial<GalleryItem>) => {
    setGallery(p => p.map(x => x.id === id ? { ...x, ...g } : x));
    try {
      await withTimeout(updateDoc(doc(db, 'gallery', id), g), 10000);
    } catch (err) {
      console.error('Error updating gallery item:', err);
    }
  };

  const deleteGallery = async (id: string) => {
    setGallery(p => p.filter(x => x.id !== id));
    try {
      await withTimeout(deleteDoc(doc(db, 'gallery', id)), 10000);
      // Cloudinary images are retained; use Cloudinary Admin API to purge if needed
    } catch (err) {
      console.error('Error deleting gallery item:', err);
    }
  };

  // ── Blogs ─────────────────────────────────────────────────────────────────

  const addBlog = async (b: Omit<BlogPost, 'id'>) => {
    const id = crypto.randomUUID();
    const newBlog: BlogPost = { ...b, id };
    setBlogs(p => [newBlog, ...p]);
    try {
      await withTimeout(setDoc(doc(db, 'blogs', id), newBlog), 10000);
    } catch (err) {
      console.error('Error saving blog:', err);
    }
  };

  const updateBlog = async (id: string, b: Partial<BlogPost>) => {
    setBlogs(p => p.map(x => x.id === id ? { ...x, ...b } : x));
    try {
      await withTimeout(updateDoc(doc(db, 'blogs', id), b), 10000);
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  const deleteBlog = async (id: string) => {
    setBlogs(p => p.filter(x => x.id !== id));
    try {
      await withTimeout(deleteDoc(doc(db, 'blogs', id)), 10000);
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  // ── Responses ─────────────────────────────────────────────────────────────

  const updateResponseStatus = (id: string, status: ContactMessage['status']) => setResponses(p => p.map(x => x.id === id ? { ...x, status } : x));
  const deleteResponse = (id: string) => setResponses(p => p.filter(x => x.id !== id));
  const addResponse = (m: Omit<ContactMessage, 'id'>) => setResponses(p => [{ ...m, id: crypto.randomUUID() }, ...p]);

  const value = {
    destinations, jobs, gallery, blogs, responses, unreadCount,
    addDest, updateDest, deleteDest,
    addJob, updateJob, deleteJob,
    addGallery, updateGallery, deleteGallery,
    addBlog, updateBlog, deleteBlog,
    updateResponseStatus, deleteResponse, addResponse
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
