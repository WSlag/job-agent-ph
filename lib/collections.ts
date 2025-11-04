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
];
