import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export notification functions
export {
  onApplicationCreated,
  onApplicationStatusChanged,
} from './notifications/application-notifications';

export {
  onMessageSent,
} from './notifications/message-notifications';

export {
  onJobCreated,
  onJobFeatured,
  onJobMatchingSavedSearch,
} from './notifications/job-notifications';

export {
  onFeaturedRequestCreated,
  onUserCreated,
} from './notifications/admin-notifications';

export {
  onAdminMessageSent,
  onAdminBulkMessageSent,
  onUserReplyToAdmin,
} from './notifications/admin-message-notifications';

// Export rating aggregation function
export {
  onAgencyReviewWritten,
} from './ratings/aggregate-ratings';

// Export cleanup functions
export {
  cleanupOldNotifications,
} from './cleanup/notification-cleanup';
