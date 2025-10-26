// User Types
export type UserType = 'jobhunter' | 'agency' | 'admin';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobHunter extends User {
  firstName: string;
  lastName: string;
  phone?: string;
  location: string;
  skills: string[];
  experience: number; // years
  resumeUrl?: string;
  profileImageUrl?: string;
}

export interface Agency extends User {
  companyName: string;
  registrationNumber: string;
  contactPerson: string;
  phone: string;
  address: string;
  logoUrl?: string;
  verified: boolean;
}

export interface Admin extends User {
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'super_admin' | 'moderator';
}

// Job Types
export type JobType = 'full-time' | 'part-time' | 'contract';
export type JobLocation = 'remote' | 'hybrid' | 'on-site';

export interface Job {
  id: string;
  agencyId: string;
  title: string;
  description: string;
  tagline?: string; // Short summary for job cards (max 100 chars)
  companyName: string;
  location: string;
  country: string;
  locationType: JobLocation;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceRequired: number; // years
  skills: string[];
  imageUrl?: string;
  category?: string;
  postedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  // Featured job fields
  isFeatured: boolean;
  featuredPriority?: number; // 1-5, determines carousel order (1 = first)
  featuredRequestId?: string; // Links to FeaturedJobRequest
  featuredAt?: Date; // When job was featured
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: UserType;
  content: string;
  attachments?: string[];
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  jobId: string;
  jobHunterId: string;
  agencyId: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Application Types
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

export interface JobApplication {
  id: string;
  jobId: string;
  jobHunterId: string;
  agencyId: string;
  conversationId?: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface ApplicationWithDetails extends JobApplication {
  job?: Job;
  jobHunter?: JobHunter;
  agency?: Agency;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Featured Job Request Types
export type FeaturedRequestStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethod = 'bank_transfer' | 'gcash' | 'paymaya' | 'paypal' | 'other';

export interface FeaturedJobRequest {
  id: string;
  jobId: string;
  agencyId: string;
  status: FeaturedRequestStatus;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentAmount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedBy?: string; // Admin ID who approved/rejected
  reviewedAt?: Date;
  rejectionReason?: string;
  approvedPriority?: number; // Priority assigned when approved (1-5)
}

export interface FeaturedJobRequestWithDetails extends FeaturedJobRequest {
  job?: Job;
  agency?: Agency;
}
