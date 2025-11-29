export interface DashboardStats {
  applications: {
    total: number;
    pending: number;
    reviewing: number;
    interview: number;
    offered: number;
    rejected: number;
    withdrawn: number;
  };
  messages: {
    total: number;
    unread: number;
    conversations: number;
  };
  savedJobs: {
    total: number;
  };
  profileCompletion: number; // 0-100
}

export interface ActivityItem {
  id: string;
  type: 'application' | 'message' | 'saved_job' | 'profile_update' | 'status_change';
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
  metadata?: {
    jobId?: string;
    jobTitle?: string;
    companyName?: string;
    status?: string;
    conversationId?: string;
    agencyName?: string;
    [key: string]: any;
  };
}

export interface RecentApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface RecentConversation {
  id: string;
  agencyId: string;
  agencyName: string;
  jobId?: string;
  jobTitle?: string;
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: Date;
  };
  unreadCount: number;
}

export interface SavedJobPreview {
  id: string;
  jobId: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  savedAt: Date;
}

export interface MatchedJobPreview {
  id: string;
  title: string;
  companyName: string;
  location: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}
