// User Types
export type UserType = 'jobhunter' | 'agency' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  status?: UserStatus; // Default: 'active'
  createdAt: Date;
  updatedAt: Date;
  // Suspension fields
  suspendedAt?: Date;
  suspendedBy?: string; // Admin ID
  suspensionReason?: string;
  suspensionExpiry?: Date; // For temporary suspensions
  // Deletion fields
  deletedAt?: Date;
  deletedBy?: string; // Admin ID
  // Legal compliance fields
  dateOfBirth?: Date; // For age verification (job seekers)
  ageVerified?: boolean; // Confirmed 18+ years old
  termsAcceptedAt?: Date; // When user accepted Terms of Service
  termsVersion?: string; // Version of terms accepted
  privacyAcceptedAt?: Date; // When user accepted Privacy Policy
  privacyVersion?: string; // Version of privacy policy accepted
}

export interface JobHunter extends User {
  firstName: string;
  lastName: string;
  phone?: string;
  location: string;
  skills: string[];
  experience: number; // years
  age?: number; // User's age (18-100)
  resumeUrl?: string;
  profileImageUrl?: string;
  profileCompleteness?: number;
  certificates?: string[];
  idDocumentUrl?: string;

  // Job Preferences for intelligent matching
  preferredCountries?: string[]; // Array of country codes/names
  preferredCategories?: string[]; // Array of job categories
  preferredJobTypes?: JobType[]; // 'full-time' | 'part-time' | 'contract'
  preferredLocationType?: JobLocation[]; // 'remote' | 'hybrid' | 'on-site'
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  jobMatchNotifications?: boolean; // Enable/disable job match notifications (default: true)
}

// Certification File Type (for multi-file uploads)
export interface CertificationFile {
  url: string; // Download URL from Firebase Storage
  fileName: string; // Original filename for display
  uploadedAt: Date; // Upload timestamp
  fileType: string; // MIME type (application/pdf, image/jpeg, etc.)
  fileSize: number; // Size in bytes
  storagePath: string; // Full path for deletion (agency-certifications/{id}/...)
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
  description?: string; // About Us section - agency description
  bio?: string; // Alias for description (for backward compatibility)
  specializations?: string[]; // Array of specialization areas (e.g., "Healthcare", "IT", "Construction")
  certifications?: string[]; // Array of additional certifications/licenses (optional)
  // Mandatory certification documents (LEGACY - kept for backward compatibility)
  /** @deprecated Use dmwLicenseFiles instead. Will be removed in future release. */
  dmwLicenseUrl?: string; // DMW (Department of Migrant Workers) License document URL
  /** @deprecated Use businessPermitFiles instead. Will be removed in future release. */
  businessPermitUrl?: string; // Business Permit document URL
  // New multi-file certification fields
  dmwLicenseFiles?: CertificationFile[]; // Array of DMW License documents (supports multiple files)
  businessPermitFiles?: CertificationFile[]; // Array of Business Permit documents (supports multiple files)
  // Agency-specific legal compliance fields
  agencyTermsAcceptedAt?: Date; // When agency accepted Agency Terms
  agencyTermsVersion?: string; // Version of agency terms accepted
  agencyTermsAcceptedIP?: string; // IP address when terms were accepted
  // Subscription fields
  subscriptionId?: string;
  subscriptionPlan?: 'free' | 'premium';
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | 'suspended';
  subscriptionExpiry?: Date;
  lifetimeJobsPosted?: number;
  // Pricing explainer tracking
  pricingExplainerSeen?: boolean;
  pricingExplainerSeenAt?: Date;
  // Verification override tracking (when verified with missing documents)
  verificationOverride?: {
    wasOverride: boolean;
    overrideReason: string;
    missingDocuments: string[];
    overrideAt: Date;
    overrideBy: string;
  };
}

export interface Admin extends User {
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'super_admin' | 'moderator';
  permissions?: Permission[]; // Granular permissions
}

// Permission Types
export enum Permission {
  // User Management
  VIEW_USERS = 'VIEW_USERS',
  MANAGE_USERS = 'MANAGE_USERS',
  SUSPEND_USERS = 'SUSPEND_USERS',
  DELETE_USERS = 'DELETE_USERS',

  // Job Management
  VIEW_JOBS = 'VIEW_JOBS',
  MANAGE_JOBS = 'MANAGE_JOBS',
  HOLD_JOBS = 'HOLD_JOBS',
  DELETE_JOBS = 'DELETE_JOBS',

  // Featured Jobs
  VIEW_FEATURED_REQUESTS = 'VIEW_FEATURED_REQUESTS',
  APPROVE_FEATURED_REQUESTS = 'APPROVE_FEATURED_REQUESTS',
  MANAGE_FEATURED_JOBS = 'MANAGE_FEATURED_JOBS',

  // Settings & System
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',

  // Messaging
  SEND_MESSAGES = 'SEND_MESSAGES',
  SEND_BULK_MESSAGES = 'SEND_BULK_MESSAGES',

  // Facebook Cross-posting
  POST_TO_FACEBOOK = 'POST_TO_FACEBOOK',

  // User Activities
  VIEW_USER_ACTIVITIES = 'VIEW_USER_ACTIVITIES',
}

// Job Types
export type JobType = 'full-time' | 'part-time' | 'contract';
export type JobLocation = 'remote' | 'hybrid' | 'on-site';
export type JobStatus = 'active' | 'on-hold' | 'deleted';

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
  isActive: boolean; // Kept for backward compatibility
  status?: JobStatus; // New status field (default: 'active')
  // Job moderation fields
  onHoldReason?: string;
  onHoldAt?: Date;
  onHoldBy?: string; // Admin ID
  deletedAt?: Date;
  deletedBy?: string; // Admin ID
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

// Audit Log Types
export type AuditAction =
  // Job actions
  | 'job_created' | 'job_updated' | 'job_deleted' | 'job_held' | 'job_unheld'
  // User actions
  | 'user_suspended' | 'user_unsuspended' | 'user_deleted'
  // Agency actions
  | 'VERIFY_AGENCY' | 'UNVERIFY_AGENCY'
  // Featured job actions
  | 'featured_request_approved' | 'featured_request_rejected' | 'featured_job_removed'
  // Message actions
  | 'message_sent_bulk' | 'message_sent_individual'
  // Settings actions
  | 'settings_updated'
  // Permission actions
  | 'permissions_updated'
  // Subscription actions
  | 'subscription_approved' | 'subscription_rejected'
  // Facebook cross-posting actions
  | 'facebook_post_created' | 'facebook_post_failed';

export type AuditResourceType = 'job' | 'user' | 'agency' | 'jobhunter' | 'featured_request' | 'message' | 'settings' | 'admin';

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string; // For quick display
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  resourceName?: string; // Human-readable name of the resource (e.g., job title, user name)
  details: Record<string, any>; // Additional context (e.g., reason, old values, new values)
  timestamp: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuditLogWithAdmin extends AuditLog {
  admin?: Admin;
}

// Admin Message Types
export type AdminMessageType = 'individual' | 'bulk';
export type AdminMessageStatus = 'draft' | 'sending' | 'sent' | 'failed';
export type RecipientType = 'jobhunter' | 'agency' | 'all';

export interface AdminMessage {
  id: string;
  adminId: string;
  adminName: string;
  messageType: AdminMessageType;
  subject?: string;
  content: string;
  recipientType: RecipientType;
  recipientIds: string[]; // Array of user IDs
  status: AdminMessageStatus;
  sentAt?: Date;
  scheduledFor?: Date; // For scheduled messages
  createdAt: Date;
  updatedAt: Date;
  // Statistics
  deliveredCount?: number;
  readCount?: number;
  failedCount?: number;
  // For tracking read status
  readBy?: { [userId: string]: Date };
  // For filtering recipients
  filters?: RecipientFilters;
}

export interface RecipientFilters {
  userType?: RecipientType;
  location?: string[];
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  activityStatus?: 'active' | 'inactive' | 'all';
  // For job hunters
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  // For agencies
  verified?: boolean;
  specializations?: string[];
}

export interface AdminConversation {
  id: string;
  adminId: string;
  userId: string;
  userType: 'jobhunter' | 'agency' | 'guest';
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderType: 'admin' | 'user';
    createdAt: Date;
    read: boolean;
  };
  unreadCount: number;
  unreadCount_admin?: number;
  unreadCount_user?: number;
  createdAt: Date;
  updatedAt: Date;
  // Optional properties added for UI display
  adminName?: string;
  userName?: string;
  // Guest user properties (for contact form submissions)
  guestName?: string;
  guestEmail?: string;
  contactRef?: string;
  referenceNumber?: string;
}

export interface AdminMessageThread {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'admin' | 'user';
  content: string;
  timestamp: Date;
  read: boolean;
  readAt?: Date;
}

// Subscription Types
export type SubscriptionPlan = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'suspended';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Subscription {
  id: string;
  agencyId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  lifetimeJobsPosted: number;
  currentPeriodJobsPosted: number;
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  lastPaymentReference?: string;
  lastPaymentMethod?: PaymentMethod;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  notes?: string;
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  agencyId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  status: PaymentStatus;
  periodStart: Date;
  periodEnd: Date;
  proofImageUrl?: string;
  processedAt?: Date;
  processedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  rejectionReason?: string;
}

export interface SubscriptionPaymentWithDetails extends SubscriptionPayment {
  agency?: Agency;
  subscription?: Subscription;
}

export interface JobPostingLimits {
  id: string;
  freeTierLimit: number;
  premiumTierLimit: number;
  premiumMonthlyPrice: number;
  premiumCurrency: string;
  featuredJobBasePrice: number;
  updatedAt: Date;
  updatedBy?: string;
}

// Outreach Batch Types (for bulk email outreach)
export type OutreachBatchStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
export type OutreachMessageType = 'short' | 'standard' | 'formal';
export type OutreachRecipientStatus = 'pending' | 'sent' | 'failed' | 'skipped';

export interface OutreachBatchRecipient {
  email: string;
  agencyName?: string;
  messageType: OutreachMessageType;
  status: OutreachRecipientStatus;
  messageId?: string;
  error?: string;
  sentAt?: Date;
}

export interface OutreachBatch {
  id: string;
  adminId: string;
  adminName?: string;
  fileName: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  skippedCount: number;
  status: OutreachBatchStatus;
  defaultMessageType: OutreachMessageType;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  recipients: OutreachBatchRecipient[];
  errors: Array<{
    email: string;
    error: string;
    timestamp: Date;
  }>;
}

export interface ParsedCSVRow {
  recipientEmail: string;
  agencyName?: string;
  messageType: OutreachMessageType;
  isValid: boolean;
  validationError?: string;
}

// Facebook Cross-posting Types
export type FacebookPostStatus = 'pending' | 'posted' | 'failed';

export interface FacebookPost {
  id: string;
  jobId: string;
  jobTitle: string;
  facebookPostId?: string;
  status: FacebookPostStatus;
  postContent: string;
  postedAt?: Date;
  postedBy: string;
  postedByName: string;
  error?: string;
  createdAt: Date;
}

// User Activity Types
export type UserActivityType =
  // Job Hunter actions
  | 'application_submitted'
  | 'application_withdrawn'
  | 'job_saved'
  | 'job_unsaved'
  | 'profile_updated'
  | 'resume_uploaded'
  | 'message_sent'
  | 'account_created'
  | 'login'
  // Agency actions
  | 'job_posted'
  | 'job_updated'
  | 'job_deactivated'
  | 'job_reactivated'
  | 'application_status_changed'
  | 'message_sent_to_applicant'
  | 'agency_profile_updated'
  | 'featured_request_submitted'
  | 'subscription_purchased'
  // Shared
  | 'notification_preferences_updated';

export type UserActivityCategory =
  | 'application' | 'job' | 'profile' | 'message' | 'account' | 'subscription';

export interface UserActivity {
  id: string;
  userId: string;
  userType: 'jobhunter' | 'agency';
  userName: string;
  activityType: UserActivityType;
  category: UserActivityCategory;
  title: string;
  description: string;
  timestamp: Date;
  resourceType?: 'job' | 'application' | 'conversation' | 'profile' | 'subscription';
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}
