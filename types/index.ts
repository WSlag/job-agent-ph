// User Types
export type UserType = 'jobhunter' | 'agency';

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
