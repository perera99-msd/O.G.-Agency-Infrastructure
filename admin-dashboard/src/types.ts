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
  slug?: string;
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
  createdAt?: string;
  updatedAt?: string;
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
  category: 'Garment Factories' | 'Visa & Legal' | 'Market Trends' | 'Candidate Stories' | 'Automation & Tech' | string;
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

export type MedicalStatus = 'not_dated' | 'date_fixed' | 'pending' | 'pass' | 'fail';

export interface TrackingStep {
  step: string;
  completed: boolean;
  date: string | null;
  fileUrl: string | null;
}

export interface AdvancePayment {
  id: string;
  description: string;
  date: string;
  amount: number;
  paymentType: 'Bank Deposit' | 'Hand Over Money';
  receiptUrl?: string | null;
}

export interface AgentPayment {
  id: string;
  agentName: string;
  amount: number;
  receiptUrl?: string | null;
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
  trusteeDob?: string | null;
  // Children
  childrenDetails?: { childName: string; childAge: string }[];
  // Documents
  nicDocUrl?: string | null;
  nicDocName?: string | null;
  passportDocUrl?: string | null;
  passportDocName?: string | null;
  policeReportUrl?: string | null;
  policeReportName?: string | null;
  photoUrl?: string | null;
  photoDocName?: string | null;
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
  // Money Management
  totalAgreedAmount?: number;
  agreedAmountReceipt?: string | null;
  advances?: AdvancePayment[];
  agentPayments?: AgentPayment[];
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
  | 'admins'
  | 'emp-register'
  | 'emp-status'
  | 'emp-medical'
  | 'emp-user-docs'
  | 'emp-manage'
  | 'pwa-control'
  | 'pwa-inquiries';

export type AdminRole = 'super_user' | 'normal_user';

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  displayName?: string;
  photoUrl?: string;
}

export interface PWAChatThread {
  id: string;
  employeeId: string;
  fullName: string;
  passportNumber: string;
  subject: string;
  status: 'open' | 'replied' | 'closed';
  createdAt: string;
  lastMessageAt: string;
  lastMessageText: string;
  lastMessageBy: 'user' | 'admin';
  unreadByAdmin?: number;
  unreadByUser?: number;
  deletedByUser?: boolean;
}


