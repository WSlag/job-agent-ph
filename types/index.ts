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
  profileCompleteness?: number;
  certificates?: string[];
  idDocumentUrl?: string;
}

export interface Agency extends User {
  companyName: string;
  registrationNumber: string;
  contactPerson: string;
  phone: string;
  address: string;
  logoUrl?: string;
  verified: boolean;
  responseTime?: string; // Expected response time (e.g., "2 hours", "1 day")
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
  category: string; // Job category (required)
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
  postedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  // Featured job fields
  isFeatured: boolean;
  featuredPriority?: number; // 1-5, determines carousel order (1 = first)
  featuredRequestId?: string; // Links to FeaturedJobRequest
  featuredAt?: Date; // When job was featured
  // Enhanced job details fields
  contractDuration?: string; // e.g., "2 years", "6 months"
  vacancies?: number; // Number of open positions
  requirements?: string[]; // Array of job requirements
  benefits?: string[]; // Array of benefits offered
  coordinates?: {
    lat: number;
    lng: number;
  };
  viewCount?: number; // Cached view count for performance
  applicationCount?: number; // Cached application count
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

// Job View Types (for analytics)
export interface JobView {
  id: string;
  jobId: string;
  userId?: string | null;
  viewedAt: Date;
  userAgent?: string;
  source?: string; // 'search', 'similar', 'direct', 'featured'
}

// Agency Stats Types
export interface AgencyStats {
  agencyId: string;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalHired: number;
  averageResponseTime: number; // in hours
  rating: number; // 1-5
  reviewCount: number;
  lastUpdated: Date;
}

export interface AgencyStatsData {
  rating: number;
  reviewCount: number;
  responseTime: string; // formatted string like "2 hours"
  totalPlacements: string; // formatted string like "1,500+"
  verificationBadge: boolean;
}

// Agency Review Types
export interface AgencyReview {
  id: string;
  agencyId: string;
  jobHunterId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  jobId?: string;
  verified: boolean; // Only from actually hired candidates
}

// Job Match Types
export interface JobMatch {
  percentage: number;
  matchingSkills: string[];
  missingSkills: string[];
}
