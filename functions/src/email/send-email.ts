import { Resend } from 'resend';
import { generateEmailTemplate } from './templates';
import { EmailNotificationData } from '../types/notification';
import { hasEmailNotificationsEnabled } from '../notifications/helpers';

// Lazy initialization of Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Maps notification types to preference keys
 */
function getPreferenceType(notificationType: string): 'applicationUpdates' | 'newMessages' | 'jobMatches' | 'interviewReminders' | 'systemAlerts' | undefined {
  switch (notificationType) {
    case 'application_update':
      return 'applicationUpdates';
    case 'message':
      return 'newMessages';
    case 'job_match':
      return 'jobMatches';
    case 'interview':
      return 'interviewReminders';
    case 'system':
    case 'document':
      return 'systemAlerts';
    default:
      return undefined;
  }
}

/**
 * Sends an email notification using Resend
 */
export async function sendEmail(data: EmailNotificationData): Promise<void> {
  try {
    // Map notification type to preference type
    const preferenceType = getPreferenceType(data.type);

    // Check if user has email notifications enabled for this specific type
    const emailEnabled = await hasEmailNotificationsEnabled(data.userId, preferenceType);

    if (!emailEnabled) {
      console.log(`Email notifications disabled for user ${data.userId} (type: ${data.type})`);
      return;
    }

    // Get Resend client (will be null if API key not configured)
    const resend = getResendClient();
    if (!resend) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return;
    }

    // Generate email template
    const template = generateEmailTemplate(
      data.recipientName,
      data.title,
      data.message,
      data.type,
      data.actionUrl
    );

    // Send email via Resend
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Job Agent PH <notifications@jobagent.ph>',
      to: data.recipientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Email sent to ${data.recipientEmail}:`, response);
  } catch (error) {
    // Log error but don't throw - we don't want email failures to break notifications
    console.error('Error sending email:', error);
  }
}
