import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BentoOverview } from './components/BentoOverview';
import { DestinationsManager } from './components/DestinationsManager';
import { JobsManager } from './components/JobsManager';
import { GalleryManager } from './components/GalleryManager';
import { BlogsManager } from './components/BlogsManager';
import { ContactResponsesManager } from './components/ContactResponsesManager';

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
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [responses, setResponses] = useState<ContactMessage[]>(INITIAL_RESPONSES);

  const unreadCount = responses.filter(r => r.status === 'new').length;

  // Destinations
  const addDest = (d: Omit<Destination, 'id'>) => setDestinations(p => [{ ...d, id: Date.now().toString() }, ...p]);
  const updateDest = (id: string, d: Partial<Destination>) => setDestinations(p => p.map(x => x.id === id ? { ...x, ...d } : x));
  const deleteDest = (id: string) => setDestinations(p => p.filter(x => x.id !== id));

  // Jobs
  const addJob = (j: Omit<JobOpening, 'id'>) => setJobs(p => [{ ...j, id: 'j-' + Date.now() }, ...p]);
  const updateJob = (id: string, j: Partial<JobOpening>) => setJobs(p => p.map(x => x.id === id ? { ...x, ...j } : x));
  const deleteJob = (id: string) => setJobs(p => p.filter(x => x.id !== id));

  // Gallery
  const addGallery = (g: Omit<GalleryItem, 'id'>) => setGallery(p => [{ ...g, id: 'g-' + Date.now() }, ...p]);
  const updateGallery = (id: string, g: Partial<GalleryItem>) => setGallery(p => p.map(x => x.id === id ? { ...x, ...g } : x));
  const deleteGallery = (id: string) => setGallery(p => p.filter(x => x.id !== id));

  // Blogs
  const addBlog = (b: Omit<BlogPost, 'id'>) => setBlogs(p => [{ ...b, id: 'b-' + Date.now() }, ...p]);
  const updateBlog = (id: string, b: Partial<BlogPost>) => setBlogs(p => p.map(x => x.id === id ? { ...x, ...b } : x));
  const deleteBlog = (id: string) => setBlogs(p => p.filter(x => x.id !== id));

  // Responses
  const updateResponseStatus = (id: string, status: ContactMessage['status']) => setResponses(p => p.map(x => x.id === id ? { ...x, status } : x));
  const deleteResponse = (id: string) => setResponses(p => p.filter(x => x.id !== id));
  const addResponse = (m: Omit<ContactMessage, 'id'>) => setResponses(p => [{ ...m, id: 'r-' + Date.now() }, ...p]);

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
