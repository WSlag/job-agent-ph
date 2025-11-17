import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createNotification } from './helpers';
import { sendEmail } from '../email/send-email';

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
 */
export const onJobMatchingSavedSearch = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    const { jobId } = context.params;
    const jobData = snapshot.data();

    if (!jobData) return;

    try {
      // Query for job hunters with saved searches that match this job
      // This assumes you have a 'savedSearches' collection or field
      const jobHuntersSnapshot = await admin.firestore()
        .collection('jobHunters')
        .where('isActive', '==', true)
        .get();

      const notificationPromises: Promise<void>[] = [];

      for (const docSnap of jobHuntersSnapshot.docs) {
        const jobHunter = docSnap.data();

        // Check if this job matches the job hunter's preferences
        // This is a simplified check - you can make it more sophisticated
        const matchesPreferences = checkJobMatchesPreferences(jobData, jobHunter);

        if (matchesPreferences) {
          const agencyDoc = await admin.firestore()
            .collection('agencies')
            .doc(jobData.agencyId)
            .get();
          const agencyData = agencyDoc.data();
          const agencyName = agencyData?.companyName || 'An agency';

          // Create targeted notification
          const notificationPromise = createNotification({
            userId: docSnap.id,
            type: 'job_match',
            title: 'Job Matches Your Preferences!',
            message: `"${jobData.title}" at ${agencyName} matches your saved search criteria`,
            actionUrl: `/jobs/${jobId}`,
          });

          notificationPromises.push(notificationPromise);
        }
      }

      await Promise.all(notificationPromises);

    } catch (error) {
      console.error('Error processing saved search matches:', error);
    }
  });

/**
 * Helper function to check if a job matches a job hunter's preferences
 */
function checkJobMatchesPreferences(jobData: any, jobHunterData: any): boolean {
  // Implement your matching logic here
  // For example:
  // - Check if job type matches preferred types
  // - Check if location is in preferred areas
  // - Check if salary range matches expectations
  // - Check if skills/requirements match job hunter's skills

  // For now, return false to prevent spamming (you should implement real logic)
  return false;

  // Example implementation:
  /*
  if (jobHunterData.preferredJobTypes?.includes(jobData.type)) {
    return true;
  }
  if (jobHunterData.preferredLocations?.includes(jobData.location)) {
    return true;
  }
  if (jobHunterData.skills?.some((skill: string) =>
    jobData.requiredSkills?.includes(skill))) {
    return true;
  }
  return false;
  */
}