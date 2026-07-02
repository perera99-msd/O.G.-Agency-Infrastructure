import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage } from './types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '1',
    country: 'Romania',
    region: 'European Union (Schengen Area)',
    heroImage: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&q=80&w=800',
    activeJobs: 24,
    visaProcessingDays: 45,
    featured: true,
  },
  {
    id: '2',
    country: 'Bosnia & Herzegovina',
    region: 'Southeast Europe',
    heroImage: 'https://images.unsplash.com/photo-1555990793-1122b5133b3a?auto=format&fit=crop&q=80&w=800',
    activeJobs: 18,
    visaProcessingDays: 30,
    featured: true,
  },
  {
    id: '3',
    country: 'Russia',
    region: 'Eurasia Industrial Hub',
    heroImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&q=80&w=800',
    activeJobs: 35,
    visaProcessingDays: 21,
    featured: true,
  },
];

export const INITIAL_JOBS: JobOpening[] = [
  { id: 'j1', title: 'Senior Industrial Welder (MIG/TIG)', country: 'Romania', category: 'Heavy Engineering', salary: '€1,600 / mo + Overtime', positionsAvailable: 12, status: 'active' },
  { id: 'j2', title: 'Precision CNC Machine Operator', country: 'Romania', category: 'Manufacturing', salary: '€1,500 / mo + Accommodation', positionsAvailable: 8, status: 'active' },
  { id: 'j3', title: 'Automated Garment Quality Controller', country: 'Bosnia & Herzegovina', category: 'Textiles', salary: '€1,200 / mo + Meals', positionsAvailable: 15, status: 'active' },
  { id: 'j4', title: 'Heavy Fleet Diesel Mechanic', country: 'Russia', category: 'Logistics & Transport', salary: '$1,800 / mo Net', positionsAvailable: 5, status: 'active' },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Bucharest Batch 24 Arrival at Otopeni Airport', category: 'Departure', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600', dateAdded: '2026-06-28' },
  { id: 'g2', title: 'Cluj-Napoca CNC Workshop Briefing', category: 'Workplace', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', dateAdded: '2026-06-25' },
  { id: 'g3', title: 'Colombo Technical Trade Assessment Day', category: 'Training', imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600', dateAdded: '2026-06-20' },
];

export const INITIAL_BLOGS: BlogPost[] = [
  { id: 'b1', title: 'Step-by-Step Document Attestation Guide for Romanian Work Visas', category: 'Visa & Legal', readTime: '6 min read', author: 'Legal Compliance Desk', publishDate: '2026-06-30', excerpt: 'Complete checklist of police clearance certificates, medical certifications, and Ministry of Labor clearances.' },
  { id: 'b2', title: 'European Garment Manufacturing: Safety Standards & Overtime Rates 2026', category: 'Industry News', readTime: '5 min read', author: 'European Dispatch Team', publishDate: '2026-06-24', excerpt: 'How EU labor protections guarantee standardized health benefits, paid holidays, and double pay for weekend shifts.' },
];

export const INITIAL_RESPONSES: ContactMessage[] = [
  { id: 'r1', senderName: 'Kasun Bandara', email: 'kasun.b@gmail.com', phone: '+94 77 123 4567', destinationOfInterest: 'Romania', message: 'I have 6 years of experience in MIG welding at Colombo Shipyard. Looking for Romanian industrial openings.', submittedAt: '2 mins ago', status: 'new' },
  { id: 'r2', senderName: 'Nuwan Perera', email: 'nuwan.p@yahoo.com', phone: '+94 71 987 6543', destinationOfInterest: 'Bosnia & Herzegovina', message: 'Could you clarify if accommodation is provided for textile operators in Sarajevo?', submittedAt: '1 hour ago', status: 'new' },
  { id: 'r3', senderName: 'Dimalsha Silva', email: 'dimalsha@company.lk', phone: '+94 76 555 1122', destinationOfInterest: 'Russia', message: 'We are looking to deploy a batch of 20 logistics drivers next month. Let us schedule a consultation.', submittedAt: 'Yesterday', status: 'replied' },
];
