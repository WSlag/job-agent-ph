import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { logActivity } from './activity-logger';

/**
 * Triggered when a new job is created
 * Logs 'job_posted' for the agency
 */
export const onJobCreatedActivity = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    try {
      const job = snapshot.data();
      const { jobId } = context.params;
      const db = admin.firestore();

      // Get agency data
      const agencyDoc = await db.collection('agencies').doc(job.agencyId).get();
      const agency = agencyDoc.data();

      const agencyName = agency?.companyName || 'Unknown Agency';

      await logActivity({
        userId: job.agencyId,
        userType: 'agency',
        userName: agencyName,
        activityType: 'job_posted',
        title: 'Job Posted',
        description: `Posted new job "${job.title}" in ${job.country || job.location || 'Unknown location'}`,
        resourceType: 'job',
        resourceId: jobId,
        metadata: {
          jobTitle: job.title,
          category: job.category,
          country: job.country,
          jobType: job.jobType,
        },
      });
    } catch (error) {
      console.error('Error in onJobCreatedActivity:', error);
    }
  });

/**
 * Triggered when a job is updated
 * Logs 'job_updated', 'job_deactivated', or 'job_reactivated' for the agency
 */
export const onJobUpdatedActivity = functions.firestore
  .document('jobs/{jobId}')
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      const { jobId } = context.params;
      const db = admin.firestore();

      // Get agency data
      const agencyDoc = await db.collection('agencies').doc(afterData.agencyId).get();
      const agency = agencyDoc.data();
      const agencyName = agency?.companyName || 'Unknown Agency';

      // Determine activity type
      let activityType: 'job_updated' | 'job_deactivated' | 'job_reactivated' = 'job_updated';
      let title = 'Job Updated';
      let description = `Updated job "${afterData.title}"`;

      if (beforeData.isActive === true && afterData.isActive === false) {
        activityType = 'job_deactivated';
        title = 'Job Deactivated';
        description = `Deactivated job "${afterData.title}"`;
      } else if (beforeData.isActive === false && afterData.isActive === true) {
        activityType = 'job_reactivated';
        title = 'Job Reactivated';
        description = `Reactivated job "${afterData.title}"`;
      } else if (
        beforeData.title === afterData.title &&
        beforeData.isActive === afterData.isActive &&
        beforeData.status === afterData.status
      ) {
        // No meaningful change for activity tracking
        return;
      }

      await logActivity({
        userId: afterData.agencyId,
        userType: 'agency',
        userName: agencyName,
        activityType,
        title,
        description,
        resourceType: 'job',
        resourceId: jobId,
        metadata: { jobTitle: afterData.title },
      });
    } catch (error) {
      console.error('Error in onJobUpdatedActivity:', error);
    }
  });
