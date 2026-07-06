import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage } from './types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '1',
    country: 'Qatar',
    region: 'Middle East',
    heroImage: 'https://images.unsplash.com/photo-1549813069-f95e44d7f498?w=800&q=80',
    activeJobs: 24,
    visaProcessingDays: 14,
    featured: true,
  },
  {
    id: '2',
    country: 'Saudi Arabia',
    region: 'Middle East',
    heroImage: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80',
    activeJobs: 18,
    visaProcessingDays: 21,
    featured: true,
  },
  {
    id: '3',
    country: 'UAE',
    region: 'Middle East',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    activeJobs: 31,
    visaProcessingDays: 10,
    featured: false,
  },
];

export const INITIAL_JOBS: JobOpening[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_BLOGS: BlogPost[] = [];

export const INITIAL_RESPONSES: ContactMessage[] = [
  {
    id: '1',
    senderName: 'Arun Thapa',
    email: 'arun.thapa@email.com',
    phone: '+977-9841234567',
    destinationOfInterest: 'Qatar',
    message: 'I am interested in construction jobs in Qatar. Please provide more details.',
    submittedAt: '2026-07-01T08:30:00Z',
    status: 'new',
  },
  {
    id: '2',
    senderName: 'Sunita Rai',
    email: 'sunita.rai@email.com',
    phone: '+977-9857654321',
    destinationOfInterest: 'UAE',
    message: 'Looking for housekeeping opportunities in UAE. What documents are needed?',
    submittedAt: '2026-07-03T14:15:00Z',
    status: 'new',
  },
];
