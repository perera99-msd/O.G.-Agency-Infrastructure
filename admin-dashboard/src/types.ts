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
  content?: string;
  image?: string;
  sourceType?: 'manual' | 'ai';
}

export interface ContactMessage {
  id: string;
  senderName: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  destinationOfInterest: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'replied' | 'archived';
  isBookmarked?: boolean;
  cvUrl?: string | null;
  cvFileName?: string | null;
}

export type MedicalStatus = 'pending' | 'pass' | 'fail';

export interface TrackingStep {
  step: string;
  completed: boolean;
  date: string | null;
  fileUrl: string | null;
}

export interface Employee {
  id: string;
  // Personal
  fullName: string;
  passportNumber: string;
  passportIssuedDate: string;
  passportExpireDate: string;
  previousPassportNumbers?: string;
  nicNumber?: string;
  dob?: string;
  age?: number | null;
  gender?: string;
  civilStatus?: string;
  race?: string;
  adminDistrict?: string;
  // Employment
  countryApplied: string;
  sourceAgency?: string;
  jobCategory?: string;
  company?: string;
  expectedInstitutions?: string[];
  // Contact
  address?: string;
  postalTown?: string;
  email?: string;
  phone1?: string;
  phone2?: string;
  whatsapp?: string;
  dsDivision?: string;
  gnDivision?: string;
  // Education
  education?: string;
  educationOther?: string;
  expSriLanka?: string;
  periodSriLanka?: string;
  abroadBefore?: string;
  expAbroad?: string;
  periodAbroad?: string;
  abroadCountry?: string;
  // Family
  motherName?: string;
  motherPhone?: string;
  fatherName?: string;
  fatherPhone?: string;
  // Trustee
  trusteeName?: string;
  trusteeRelation?: string;
  trusteeAddress?: string;
  trusteePhone?: string;
  trusteeNIC?: string;
  // Banking
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  accountHolderName?: string;
  // Medical
  medicalStatus: MedicalStatus;
  medicalCenter?: string;
  medicalDate?: string;
  medicalNotes?: string;
  // Tracking
  tracking?: TrackingStep[];
  // Meta
  status: 'active' | 'archived';
  registeredAt: string;
  registeredBy?: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
}

export type TabType =
  | 'overview'
  | 'destinations'
  | 'jobs'
  | 'gallery'
  | 'blogs'
  | 'responses'
  | 'notifications'
  | 'profile'
  | 'emp-register'
  | 'emp-status'
  | 'emp-search'
  | 'emp-edit'
  | 'emp-filter'
  | 'emp-medical';

export type AdminRole = 'super_user' | 'normal_user';

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  displayName?: string;
  photoUrl?: string;
}
