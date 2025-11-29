import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Scheduled function to clean up old notifications
 * Runs daily at 2 AM UTC
 * Deletes read notifications older than 30 days to keep database clean
 */
export const cleanupOldNotifications = functions.pubsub
  .schedule('0 2 * * *') // Run daily at 2 AM UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      console.log(`Starting notification cleanup for notifications older than ${thirtyDaysAgo.toISOString()}`);

      // Delete read notifications older than 30 days
      const oldNotificationsQuery = db
        .collection('notifications')
        .where('read', '==', true)
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .limit(500); // Process in batches of 500

      const snapshot = await oldNotificationsQuery.get();

      if (snapshot.empty) {
        console.log('No old notifications to clean up');
        return null;
      }

      // Delete in batches
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Successfully deleted ${snapshot.size} old notifications`);

      // If we deleted 500, there might be more - log a warning
      if (snapshot.size === 500) {
        console.warn('Deleted 500 notifications (batch limit). More old notifications may exist.');
      }

      return null;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      return null;
    }
  });
