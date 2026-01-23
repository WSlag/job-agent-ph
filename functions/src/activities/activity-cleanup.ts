import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Scheduled function to clean up old user activities
 * Runs daily at 3 AM UTC
 * Deletes activities older than 1 year to manage storage
 */
export const cleanupOldActivities = functions.pubsub
  .schedule('0 3 * * *') // Run daily at 3 AM UTC
  .timeZone('UTC')
  .onRun(async () => {
    const db = admin.firestore();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    try {
      console.log(`Starting activity cleanup for activities older than ${oneYearAgo.toISOString()}`);

      let totalDeleted = 0;
      let hasMore = true;

      while (hasMore) {
        const oldActivitiesQuery = db
          .collection('userActivities')
          .where('timestamp', '<', admin.firestore.Timestamp.fromDate(oneYearAgo))
          .limit(500);

        const snapshot = await oldActivitiesQuery.get();

        if (snapshot.empty) {
          hasMore = false;
          break;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        totalDeleted += snapshot.size;

        // Stop if we got less than 500 (no more to delete)
        if (snapshot.size < 500) {
          hasMore = false;
        }
      }

      console.log(`Successfully deleted ${totalDeleted} old activities`);
      return null;
    } catch (error) {
      console.error('Error cleaning up old activities:', error);
      return null;
    }
  });
