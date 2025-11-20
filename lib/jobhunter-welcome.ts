/**
 * Job Hunter Welcome System
 * Sends welcome email and in-app message to new job hunter signups
 */

import { emailTemplates, sendEmail } from './email';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { getDbInstance } from './firebase';
import { COLLECTIONS } from './collections';
import { JOBHUNTER_WELCOME_MESSAGE } from './welcome-messages';

/**
 * Send welcome message to newly registered job hunter
 * Includes both email and in-app message
 */
export async function sendJobHunterWelcome(data: {
  jobHunterId: string;
  firstName: string;
  lastName: string;
  email: string;
}): Promise<{ emailSent: boolean; messageSent: boolean }> {
  const results = {
    emailSent: false,
    messageSent: false,
  };

  try {
    // Send welcome email
    try {
      const welcomeEmail = emailTemplates.jobHunterWelcome({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      await sendEmail(welcomeEmail);
      results.emailSent = true;
      console.log(`Welcome email sent to ${data.email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if email fails
    }

    // Send in-app welcome message
    try {
      const db = getDbInstance();

      // Create a system conversation for the welcome message
      const conversationId = `welcome_${data.jobHunterId}`;
      const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

      // Check if welcome message already sent
      const existing = await getDoc(conversationRef);
      if (!existing.exists()) {
        // Create conversation
        await setDoc(conversationRef, {
          jobId: null, // System message, not related to a job
          jobHunterId: data.jobHunterId,
          agencyId: null, // Not an agency conversation
          isSystemMessage: true,
          unreadCount: 1,
          [`unreadCount_${data.jobHunterId}`]: 1,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Create welcome message
        const messageRef = doc(db, COLLECTIONS.MESSAGES, `${conversationId}_welcome`);
        await setDoc(messageRef, {
          conversationId,
          senderId: 'system',
          senderType: 'system',
          recipientId: data.jobHunterId,
          recipientType: 'jobhunter',
          content: JOBHUNTER_WELCOME_MESSAGE,
          read: false,
          createdAt: Timestamp.now(),
        });

        results.messageSent = true;
        console.log(`Welcome message sent to job hunter ${data.jobHunterId}`);
      } else {
        console.log(`Welcome message already exists for job hunter ${data.jobHunterId}`);
        results.messageSent = true;
      }
    } catch (messageError) {
      console.error('Failed to send in-app welcome message:', messageError);
      // Continue even if message fails
    }

    return results;
  } catch (error) {
    console.error('Error in sendJobHunterWelcome:', error);
    return results;
  }
}

/**
 * Queue welcome message for background processing
 * This can be called from client-side signup without blocking
 */
export async function queueJobHunterWelcome(jobHunterId: string): Promise<void> {
  try {
    // Call server-side API to send welcome message
    const response = await fetch('/api/jobhunter/welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobHunterId }),
    });

    if (!response.ok) {
      console.error('Failed to queue welcome message:', await response.text());
    }
  } catch (error) {
    console.error('Error queuing welcome message:', error);
    // Don't throw - welcome message is not critical
  }
}
