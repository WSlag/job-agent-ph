import * as functions from 'firebase-functions';
import { createNotification, getUserData, getAgencyData, getJobData } from './helpers';
import { sendEmail } from '../email/send-email';

/**
 * Triggered when a new application is created
 * Notifies the agency that a job hunter has applied
 */
export const onApplicationCreated = functions.firestore
  .document('applications/{applicationId}')
  .onCreate(async (snapshot, context) => {
    try {
      const application = snapshot.data();
      const { applicationId } = context.params;

      console.log(`Processing new application: ${applicationId}`);

      // Get job hunter data
      const jobHunter = await getUserData(application.userId);
      if (!jobHunter) {
        console.error('Job hunter not found');
        return;
      }

      // Get job data
      const job = await getJobData(application.jobId);
      if (!job) {
        console.error('Job not found');
        return;
      }

      // Get agency data
      const agency = await getAgencyData(job.agencyId);
      if (!agency) {
        console.error('Agency not found');
        return;
      }

      // Create notification for agency
      await createNotification({
        userId: agency.userId, // Agency user ID
        type: 'application_update',
        title: 'New Application Received',
        message: `${jobHunter.fullName || 'A job hunter'} has applied for ${job.title}`,
        actionUrl: `/agency/applications?id=${applicationId}`,
      });

      // Send email to agency if enabled
      if (agency.email) {
        await sendEmail({
          recipientEmail: agency.email,
          recipientName: agency.companyName || 'Agency',
          userId: agency.userId,
          type: 'application_update',
          title: 'New Application Received',
          message: `${jobHunter.fullName || 'A job hunter'} has applied for ${job.title}`,
          actionUrl: `/agency/applications?id=${applicationId}`,
        });
      }

      console.log(`Application notification sent to agency: ${agency.userId}`);
    } catch (error) {
      console.error('Error in onApplicationCreated:', error);
    }
  });

/**
 * Triggered when an application status changes
 * Notifies the job hunter about status updates
 */
export const onApplicationStatusChanged = functions.firestore
  .document('applications/{applicationId}')
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      const { applicationId } = context.params;

      // Check if status actually changed
      if (beforeData.status === afterData.status) {
        return;
      }

      console.log(`Application ${applicationId} status changed: ${beforeData.status} -> ${afterData.status}`);

      // Get job hunter data
      const jobHunter = await getUserData(afterData.userId);
      if (!jobHunter) {
        console.error('Job hunter not found');
        return;
      }

      // Get job data
      const job = await getJobData(afterData.jobId);
      if (!job) {
        console.error('Job not found');
        return;
      }

      // Get agency data
      const agency = await getAgencyData(job.agencyId);
      if (!agency) {
        console.error('Agency not found');
        return;
      }

      // Determine notification type and message
      let notificationType: 'application_update' | 'interview' = 'application_update';
      let title = 'Application Status Updated';
      let message = '';

      switch (afterData.status) {
        case 'accepted':
          title = 'Application Accepted!';
          message = `Your application for ${job.title} at ${agency.companyName || 'the company'} has been accepted!`;
          break;
        case 'rejected':
          title = 'Application Update';
          message = `Your application for ${job.title} has been updated.`;
          break;
        case 'interview':
          notificationType = 'interview';
          title = 'Interview Scheduled!';
          message = `You've been invited for an interview for ${job.title} at ${agency.companyName || 'the company'}!`;
          break;
        case 'reviewing':
          title = 'Application Under Review';
          message = `Your application for ${job.title} is being reviewed by ${agency.companyName || 'the company'}.`;
          break;
        default:
          title = 'Application Status Updated';
          message = `Your application for ${job.title} has been updated to ${afterData.status}.`;
      }

      // Create notification for job hunter
      await createNotification({
        userId: afterData.userId,
        type: notificationType,
        title,
        message,
        actionUrl: `/applications/${applicationId}`,
      });

      // Send email to job hunter if enabled
      if (jobHunter.email) {
        await sendEmail({
          recipientEmail: jobHunter.email,
          recipientName: jobHunter.fullName || 'Job Hunter',
          userId: afterData.userId,
          type: notificationType,
          title,
          message,
          actionUrl: `/applications/${applicationId}`,
        });
      }

      console.log(`Status change notification sent to job hunter: ${afterData.userId}`);
    } catch (error) {
      console.error('Error in onApplicationStatusChanged:', error);
    }
  });
