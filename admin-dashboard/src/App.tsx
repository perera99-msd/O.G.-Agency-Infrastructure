import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BentoOverview } from './components/BentoOverview';
import { DestinationsManager } from './components/DestinationsManager';
import { JobsManager } from './components/JobsManager';
import { GalleryManager } from './components/GalleryManager';
import { BlogsManager } from './components/BlogsManager';
import { ContactResponsesManager } from './components/ContactResponsesManager';

import { db, storage } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType } from './types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_JOBS,
  INITIAL_GALLERY,
  INITIAL_BLOGS,
  INITIAL_RESPONSES,
} from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [responses, setResponses] = useState<ContactMessage[]>(INITIAL_RESPONSES);

  useEffect(() => {
    getDocs(collection(db, 'gallery'))
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
        if (data.length > 0) {
          setGallery(data);
        }
      })
      .catch(err => console.error('Error fetching gallery:', err));

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
  }, []);

  const unreadCount = responses.filter(r => r.status === 'new').length;

  // Destinations
  const addDest = (d: Omit<Destination, 'id'>) => setDestinations(p => [{ ...d, id: crypto.randomUUID() }, ...p]);
  const updateDest = (id: string, d: Partial<Destination>) => setDestinations(p => p.map(x => x.id === id ? { ...x, ...d } : x));
  const deleteDest = (id: string) => setDestinations(p => p.filter(x => x.id !== id));

  // Jobs
  const addJob = async (j: Omit<JobOpening, 'id'>) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer dev-mock-token' },
        body: JSON.stringify(j)
      });
      const json = await res.json();
      if (json.success) {
        setJobs(p => [json.data, ...p]);
      } else {
        alert(json.message || 'Failed to add job');
      }
    } catch (err) {
      console.error('Error adding job:', err);
    }
  };

  const updateJob = async (id: string, j: Partial<JobOpening>) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer dev-mock-token' },
        body: JSON.stringify(j)
      });
      const json = await res.json();
      if (json.success) {
        setJobs(p => p.map(x => x.id === id ? { ...x, ...j } : x));
      } else {
        alert(json.message || 'Failed to update job');
      }
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer dev-mock-token' }
      });
      const json = await res.json();
      if (json.success) {
        setJobs(p => p.filter(x => x.id !== id));
      } else {
        alert(json.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // Gallery
  const addGallery = async (g: Omit<GalleryItem, 'id'> & { file?: File }) => {
    try {
      let finalImageUrl = g.imageUrl;
      const id = crypto.randomUUID();

      if (g.file) {
        const storageRef = ref(storage, `gallery/${id}_${g.file.name}`);
        const snapshot = await uploadBytes(storageRef, g.file);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }
      
      const newItem: GalleryItem = { 
        id,
        title: g.title,
        category: g.category,
        imageUrl: finalImageUrl,
        dateAdded: g.dateAdded,
      };

      setGallery(p => [newItem, ...p]);
      await setDoc(doc(db, 'gallery', id), newItem);
    } catch (err) {
      console.error('Error adding gallery item:', err);
    }
  };
  
  const updateGallery = async (id: string, g: Partial<GalleryItem>) => {
    setGallery(p => p.map(x => x.id === id ? { ...x, ...g } : x));
    try {
      await updateDoc(doc(db, 'gallery', id), g);
    } catch(err) {
      console.error('Error updating gallery item:', err);
    }
  };
  
  const deleteGallery = async (id: string) => {
    const item = gallery.find(x => x.id === id);
    setGallery(p => p.filter(x => x.id !== id));
    
    try {
      await deleteDoc(doc(db, 'gallery', id));
      if (item && item.imageUrl.includes('firebasestorage.googleapis.com')) {
        const fileRef = ref(storage, item.imageUrl);
        await deleteObject(fileRef).catch(console.error);
      }
    } catch (err) {
      console.error('Error deleting gallery item:', err);
    }
  };

  // Blogs
  const addBlog = (b: Omit<BlogPost, 'id'>) => setBlogs(p => [{ ...b, id: crypto.randomUUID() }, ...p]);
  const updateBlog = (id: string, b: Partial<BlogPost>) => setBlogs(p => p.map(x => x.id === id ? { ...x, ...b } : x));
  const deleteBlog = (id: string) => setBlogs(p => p.filter(x => x.id !== id));

  // Responses
  const updateResponseStatus = (id: string, status: ContactMessage['status']) => setResponses(p => p.map(x => x.id === id ? { ...x, status } : x));
  const deleteResponse = (id: string) => setResponses(p => p.filter(x => x.id !== id));
  const addResponse = (m: Omit<ContactMessage, 'id'>) => setResponses(p => [{ ...m, id: crypto.randomUUID() }, ...p]);

  return (
    <div className="app-shell">
      <Navbar activeTab={activeTab} unreadCount={unreadCount} />
      <div className="app-body">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
        <main className="main-content">
          {activeTab === 'overview' && (
            <BentoOverview
              destinations={destinations} jobs={jobs} gallery={gallery}
              blogs={blogs} responses={responses} setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'destinations' && (
            <DestinationsManager destinations={destinations} onAdd={addDest} onUpdate={updateDest} onDelete={deleteDest} />
          )}
          {activeTab === 'jobs' && (
            <JobsManager jobs={jobs} onAdd={addJob} onUpdate={updateJob} onDelete={deleteJob} />
          )}
          {activeTab === 'gallery' && (
            <GalleryManager gallery={gallery} onAdd={addGallery} onUpdate={updateGallery} onDelete={deleteGallery} />
          )}
          {activeTab === 'blogs' && (
            <BlogsManager blogs={blogs} onAdd={addBlog} onUpdate={updateBlog} onDelete={deleteBlog} />
          )}
          {activeTab === 'responses' && (
            <ContactResponsesManager
              responses={responses} onUpdateStatus={updateResponseStatus}
              onDelete={deleteResponse} onAddReplySim={addResponse}
            />
          )}
        </main>
      </div>
    </div>
  );
}
