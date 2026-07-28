export interface Destination {
  id: string;
  country: string;
  region: string;
  flag?: string;
  heroImage: string;
  activeJobs: number;
  visaProcessingDays: number;
  featured: boolean;
  isActive: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  country: string;
  category: string;
  salary: { min: number; max: number; currency: string };
  deadline: string;
  description: string;
  isUrgent: boolean;
  genderPreference?: string;
  ageRange?: { min: number; max: number };
  tags?: string[];
  requirements?: string[];
  benefits?: { title: string; description: string }[];
  companyLogo?: string | null;
  active: boolean;
  postedAt?: string;
  positionsAvailable?: number;
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
  category: 'Visa & Legal' | 'Success Stories' | 'Industry News' | 'AI Generated';
  readTime: string;
  author: string;
  publishDate: string;
  excerpt: string;
  image?: string;
  sourceType?: 'manual' | 'ai';
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
  cvUrl?: string | null;
  cvFileName?: string | null;
}

export type TabType = 'overview' | 'destinations' | 'jobs' | 'gallery' | 'blogs' | 'responses' | 'profile';

export type AdminRole = 'super_user' | 'normal_user';

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
}
