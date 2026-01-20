/**
 * Firestore Collection Names and Paths
 *
 * Collections Structure:
 * - users/{userId}
 * - jobHunters/{userId} (extends users)
 * - agencies/{userId} (extends users)
 * - jobs/{jobId}
 * - conversations/{conversationId}
 *   - messages/{messageId} (subcollection)
 * - applications/{applicationId}
 * - savedJobs/{userId}/jobs/{jobId}
 * - settings/{settingId}
 */

export const COLLECTIONS = {
  USERS: 'users',
  JOB_HUNTERS: 'jobHunters',
  AGENCIES: 'agencies',
  ADMINS: 'admins',
  JOBS: 'jobs',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages', // subcollection under conversations
  APPLICATIONS: 'applications',
  SAVED_JOBS: 'savedJobs',
  FEATURED_REQUESTS: 'featuredRequests',
  JOB_VIEWS: 'jobViews', // For analytics
  AGENCY_STATS: 'agencyStats', // Cached agency statistics
  AGENCY_REVIEWS: 'agencyReviews', // Agency ratings and reviews
  NOTIFICATIONS: 'notifications', // User notifications
  AUDIT_LOGS: 'auditLogs', // Admin action audit logs
  SETTINGS: 'settings', // Platform settings
  CONTACTS: 'contacts', // Contact form submissions
  ADMIN_CONVERSATIONS: 'adminConversations', // Admin-user conversations
  ADMIN_MESSAGES: 'adminMessages', // Bulk admin messages
  SUBSCRIPTIONS: 'subscriptions', // Agency subscriptions
  SUBSCRIPTION_PAYMENTS: 'subscriptionPayments', // Subscription payment records
  JOB_POSTING_LIMITS: 'jobPostingLimits', // System configuration for limits and pricing
  OUTREACH_LOGS: 'outreachLogs', // Admin outreach email logs
  OUTREACH_REPLIES: 'outreachReplies', // Incoming replies to outreach emails
  OUTREACH_BATCHES: 'outreachBatches', // Bulk outreach email batches
  FACEBOOK_POSTS: 'facebookPosts', // Facebook cross-posting records
} as const;

// Helper to get collection paths
export const getCollectionPath = {
  users: () => COLLECTIONS.USERS,
  jobHunters: () => COLLECTIONS.JOB_HUNTERS,
  agencies: () => COLLECTIONS.AGENCIES,
  admins: () => COLLECTIONS.ADMINS,
  jobs: () => COLLECTIONS.JOBS,
  conversations: () => COLLECTIONS.CONVERSATIONS,
  messages: (conversationId: string) =>
    `${COLLECTIONS.CONVERSATIONS}/${conversationId}/${COLLECTIONS.MESSAGES}`,
  applications: () => COLLECTIONS.APPLICATIONS,
  savedJobs: (userId: string) =>
    `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.SAVED_JOBS}`,
  featuredRequests: () => COLLECTIONS.FEATURED_REQUESTS,
  jobViews: () => COLLECTIONS.JOB_VIEWS,
  agencyStats: () => COLLECTIONS.AGENCY_STATS,
  agencyReviews: () => COLLECTIONS.AGENCY_REVIEWS,
  notifications: () => COLLECTIONS.NOTIFICATIONS,
  auditLogs: () => COLLECTIONS.AUDIT_LOGS,
  settings: () => COLLECTIONS.SETTINGS,
  contacts: () => COLLECTIONS.CONTACTS,
  adminConversations: () => COLLECTIONS.ADMIN_CONVERSATIONS,
  adminMessages: () => COLLECTIONS.ADMIN_MESSAGES,
  subscriptions: () => COLLECTIONS.SUBSCRIPTIONS,
  subscriptionPayments: () => COLLECTIONS.SUBSCRIPTION_PAYMENTS,
  jobPostingLimits: () => COLLECTIONS.JOB_POSTING_LIMITS,
  outreachLogs: () => COLLECTIONS.OUTREACH_LOGS,
  outreachReplies: () => COLLECTIONS.OUTREACH_REPLIES,
  outreachBatches: () => COLLECTIONS.OUTREACH_BATCHES,
  facebookPosts: () => COLLECTIONS.FACEBOOK_POSTS,
};

// Firestore indexes needed (create in Firebase Console)
export const REQUIRED_INDEXES = [
  {
    collection: 'jobs',
    fields: [
      { field: 'isActive', order: 'DESCENDING' },
      { field: 'postedAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'jobs',
    fields: [
      { field: 'country', order: 'ASCENDING' },
      { field: 'postedAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'jobs',
    fields: [
      { field: 'isFeatured', order: 'DESCENDING' },
      { field: 'featuredPriority', order: 'ASCENDING' },
    ],
  },
  {
    collection: 'conversations',
    fields: [
      { field: 'jobHunterId', order: 'ASCENDING' },
      { field: 'updatedAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'conversations',
    fields: [
      { field: 'agencyId', order: 'ASCENDING' },
      { field: 'updatedAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'featuredRequests',
    fields: [
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'featuredRequests',
    fields: [
      { field: 'agencyId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'notifications',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'auditLogs',
    fields: [
      { field: 'adminId', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'auditLogs',
    fields: [
      { field: 'resourceType', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'auditLogs',
    fields: [
      { field: 'action', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'subscriptions',
    fields: [
      { field: 'agencyId', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'endDate', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'subscriptions',
    fields: [
      { field: 'status', order: 'ASCENDING' },
      { field: 'endDate', order: 'ASCENDING' },
    ],
  },
  {
    collection: 'subscriptionPayments',
    fields: [
      { field: 'agencyId', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'subscriptionPayments',
    fields: [
      { field: 'subscriptionId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'subscriptionPayments',
    fields: [
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'jobs',
    fields: [
      { field: 'agencyId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
];
