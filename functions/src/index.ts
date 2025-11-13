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
  onFeaturedRequestCreated,
  onUserCreated,
} from './notifications/admin-notifications';

// Export rating aggregation function
export {
  onAgencyReviewWritten,
} from './ratings/aggregate-ratings';
