import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { logActivity } from './activity-logger';

/**
 * Triggered when a new application is created
 * Logs 'application_submitted' for the job hunter
 */
export const onApplicationCreatedActivity = functions.firestore
  .document('applications/{applicationId}')
  .onCreate(async (snapshot, context) => {
    try {
      const application = snapshot.data();
      const { applicationId } = context.params;
      const db = admin.firestore();

      // Get job hunter data
      const jobHunterDoc = await db.collection('jobHunters').doc(application.jobHunterId).get();
      const jobHunter = jobHunterDoc.data();

      // Get job data
      const jobDoc = await db.collection('jobs').doc(application.jobId).get();
      const job = jobDoc.data();

      const userName = jobHunter
        ? `${jobHunter.firstName || ''} ${jobHunter.lastName || ''}`.trim()
        : 'Unknown User';
      const jobTitle = job?.title || 'Unknown Job';

      await logActivity({
        userId: application.jobHunterId,
        userType: 'jobhunter',
        userName,
        activityType: 'application_submitted',
        title: 'Application Submitted',
        description: `Applied for "${jobTitle}"`,
        resourceType: 'application',
        resourceId: applicationId,
        metadata: { jobId: application.jobId, jobTitle },
      });
    } catch (error) {
      console.error('Error in onApplicationCreatedActivity:', error);
    }
  });

/**
 * Triggered when an application status changes
 * Logs 'application_status_changed' for the agency
 */
export const onApplicationStatusChangedActivity = functions.firestore
  .document('applications/{applicationId}')
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      const { applicationId } = context.params;

      // Only log if status actually changed
      if (beforeData.status === afterData.status) {
        return;
      }

      const db = admin.firestore();

      // Get job data to find agency
      const jobDoc = await db.collection('jobs').doc(afterData.jobId).get();
      const job = jobDoc.data();

      if (!job) return;

      // Get agency data
      const agencyDoc = await db.collection('agencies').doc(job.agencyId).get();
      const agency = agencyDoc.data();

      const agencyName = agency?.companyName || 'Unknown Agency';

      await logActivity({
        userId: job.agencyId,
        userType: 'agency',
        userName: agencyName,
        activityType: 'application_status_changed',
        title: 'Application Status Changed',
        description: `Changed application status from "${beforeData.status}" to "${afterData.status}" for "${job.title}"`,
        resourceType: 'application',
        resourceId: applicationId,
        metadata: {
          jobId: afterData.jobId,
          previousStatus: beforeData.status,
          newStatus: afterData.status,
          applicantId: afterData.jobHunterId,
        },
      });
    } catch (error) {
      console.error('Error in onApplicationStatusChangedActivity:', error);
    }
  });
