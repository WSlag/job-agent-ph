import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createNotification, sendPushNotification } from './helpers';
import { sendEmail } from '../email/send-email';
import { findMatchingJobHunters, JobData } from './job-matching';

/**
 * Cloud Function that triggers when a new job is created
 * Sends notifications to relevant job hunters based on their preferences
 */
export const onJobCreated = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    const { jobId } = context.params;
    const jobData = snapshot.data();

    if (!jobData) {
      console.error('No job data found');
      return;
    }

    try {
      // Get the agency that posted the job
      const agencyDoc = await admin.firestore()
        .collection('agencies')
        .doc(jobData.agencyId)
        .get();
      const agencyData = agencyDoc.data();
      const agencyName = agencyData?.companyName || 'An agency';

      // Query for job hunters who should receive this notification
      // For now, we'll notify all active job hunters
      // In production, you might want to filter based on preferences, location, skills, etc.
      const jobHuntersSnapshot = await admin.firestore()
        .collection('jobHunters')
        .where('isActive', '==', true)
        .limit(100) // Limit to prevent excessive notifications
        .get();

      const notificationPromises: Promise<void>[] = [];

      for (const docSnap of jobHuntersSnapshot.docs) {
        const jobHunter = docSnap.data();

        // Create notification for each matching job hunter
        const notificationPromise = createNotification({
          userId: docSnap.id,
          type: 'job_match',
          title: 'New Job Match!',
          message: `${agencyName} posted "${jobData.title}" - ${jobData.type} in ${jobData.location}`,
          actionUrl: `/jobs/${jobId}`,
        });

        notificationPromises.push(notificationPromise);

        // Send email notification if enabled
        if (jobHunter.email) {
          const emailPromise = sendEmail({
            userId: docSnap.id,
            type: 'job_match',
            title: 'New Job Match!',
            message: `${agencyName} posted "${jobData.title}" - ${jobData.type} in ${jobData.location}`,
            actionUrl: `/jobs/${jobId}`,
            recipientEmail: jobHunter.email,
            recipientName: jobHunter.name || 'Job Hunter',
          });
          notificationPromises.push(emailPromise);
        }
      }

      // Execute all notifications in parallel
      await Promise.all(notificationPromises);

      console.log(`Successfully sent job notifications for job ${jobId} to ${jobHuntersSnapshot.size} job hunters`);

    } catch (error) {
      console.error('Error sending job notifications:', error);
      throw error;
    }
  });

/**
 * Cloud Function that triggers when a job is featured
 * Sends notifications to job hunters about featured jobs
 */
export const onJobFeatured = functions.firestore
  .document('jobs/{jobId}')
  .onUpdate(async (change, context) => {
    const { jobId } = context.params;
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Only trigger if the job is being featured (not un-featured)
    if (!beforeData?.isFeatured && afterData?.isFeatured) {
      try {
        const agencyDoc = await admin.firestore()
          .collection('agencies')
          .doc(afterData.agencyId)
          .get();
        const agencyData = agencyDoc.data();
        const agencyName = agencyData?.companyName || 'An agency';

        // Query for active job hunters
        const jobHuntersSnapshot = await admin.firestore()
          .collection('jobHunters')
          .where('isActive', '==', true)
          .limit(50) // Smaller limit for featured jobs
          .get();

        const notificationPromises: Promise<void>[] = [];

        for (const docSnap of jobHuntersSnapshot.docs) {
          const jobHunter = docSnap.data();

          // Create notification
          const notificationPromise = createNotification({
            userId: docSnap.id,
            type: 'job_match',
            title: 'Featured Job Alert!',
            message: `Check out this featured position: "${afterData.title}" at ${agencyName}`,
            actionUrl: `/jobs/${jobId}`,
          });

          notificationPromises.push(notificationPromise);

          // Send email if enabled
          if (jobHunter.email) {
            const emailPromise = sendEmail({
              userId: docSnap.id,
              type: 'job_match',
              title: 'Featured Job Alert!',
              message: `Check out this featured position: "${afterData.title}" at ${agencyName}`,
              actionUrl: `/jobs/${jobId}`,
              recipientEmail: jobHunter.email,
              recipientName: jobHunter.name || 'Job Hunter',
            });
            notificationPromises.push(emailPromise);
          }
        }

        await Promise.all(notificationPromises);

        console.log(`Successfully sent featured job notifications for job ${jobId}`);

      } catch (error) {
        console.error('Error sending featured job notifications:', error);
      }
    }
  });

/**
 * Cloud Function that triggers when a job matches a job hunter's saved search
 * This is a more targeted notification based on user preferences
 * Uses intelligent matching algorithm with weighted scoring
 */
export const onJobMatchingSavedSearch = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    const { jobId } = context.params;
    const jobData = snapshot.data();

    if (!jobData) return;

    try {
      // Use intelligent matching algorithm to find job hunters
      const matches = await findMatchingJobHunters(jobData as JobData, 60, 50);

      if (matches.length === 0) {
        console.log(`No matching job hunters found for job ${jobId}`);
        return;
      }

      console.log(`Found ${matches.length} matching job hunters for job ${jobId}`);

      // Get agency data once
      const agencyDoc = await admin.firestore()
        .collection('agencies')
        .doc(jobData.agencyId)
        .get();
      const agencyData = agencyDoc.data();
      const agencyName = agencyData?.companyName || 'An agency';

      const notificationPromises: Promise<void>[] = [];

      for (const match of matches) {
        const matchPercent = Math.round(match.matchScore.totalScore);
        const title = 'Perfect Job Match!';
        const message = `"${jobData.title}" at ${agencyName} matches your preferences (${matchPercent}% match)`;

        // Create in-app notification
        const notificationPromise = createNotification({
          userId: match.hunterId,
          type: 'job_match',
          title,
          message,
          actionUrl: `/jobs/${jobId}`,
        });
        notificationPromises.push(notificationPromise);

        // Send push notification
        const pushPromise = sendPushNotification(
          match.hunterId,
          title,
          message,
          `/jobs/${jobId}`
        );
        notificationPromises.push(pushPromise);

        // Send email if enabled (email helper checks granular preferences)
        if (match.hunterData.email) {
          const emailPromise = sendEmail({
            recipientEmail: match.hunterData.email,
            recipientName: `${match.hunterData.firstName || ''} ${match.hunterData.lastName || ''}`.trim() || 'Job Hunter',
            userId: match.hunterId,
            type: 'job_match',
            title,
            message,
            actionUrl: `/jobs/${jobId}`,
          });
          notificationPromises.push(emailPromise);
        }
      }

      await Promise.all(notificationPromises);
      console.log(`Sent ${matches.length} job match notifications for job ${jobId}`);

    } catch (error) {
      console.error('Error processing saved search matches:', error);
    }
  });