export interface Destination {
  id: string;
  country: string;
  region: string;
  heroImage: string;
  activeJobs: number;
  visaProcessingDays: number;
  featured: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  country: string;
  category: string;
  salary: string;
  positionsAvailable: number;
  status: 'active' | 'filled' | 'draft';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Departure' | 'Workplace' | 'Training' | 'Embassy';
  imageUrl: string;
  dateAdded: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Visa & Legal' | 'Success Stories' | 'Industry News';
  readTime: string;
  author: string;
  publishDate: string;
  excerpt: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  email: string;
  phone: string;
  destinationOfInterest: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'replied' | 'archived';
}

export type TabType = 'overview' | 'destinations' | 'jobs' | 'gallery' | 'blogs' | 'responses';
