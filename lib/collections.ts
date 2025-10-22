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
  JOBS: 'jobs',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages', // subcollection under conversations
  APPLICATIONS: 'applications',
  SAVED_JOBS: 'savedJobs',
} as const;

// Helper to get collection paths
export const getCollectionPath = {
  users: () => COLLECTIONS.USERS,
  jobHunters: () => COLLECTIONS.JOB_HUNTERS,
  agencies: () => COLLECTIONS.AGENCIES,
  jobs: () => COLLECTIONS.JOBS,
  conversations: () => COLLECTIONS.CONVERSATIONS,
  messages: (conversationId: string) =>
    `${COLLECTIONS.CONVERSATIONS}/${conversationId}/${COLLECTIONS.MESSAGES}`,
  applications: () => COLLECTIONS.APPLICATIONS,
  savedJobs: (userId: string) =>
    `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.SAVED_JOBS}`,
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
];
