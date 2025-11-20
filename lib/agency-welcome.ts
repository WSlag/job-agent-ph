/**
 * Agency Welcome System
 * Sends welcome email and in-app message to new agency signups
 */

import { emailTemplates, sendEmail } from './email';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { getDbInstance } from './firebase';
import { COLLECTIONS } from './collections';
import { AGENCY_WELCOME_MESSAGE } from './welcome-messages';

/**
 * Send welcome message to newly registered agency
 * Includes both email and in-app message
 */
export async function sendAgencyWelcome(data: {
  agencyId: string;
  companyName: string;
  email: string;
  contactPerson: string;
}): Promise<{ emailSent: boolean; messageSent: boolean }> {
  const results = {
    emailSent: false,
    messageSent: false,
  };

  try {
    // Send welcome email
    try {
      const welcomeEmail = emailTemplates.agencyWelcome({
        companyName: data.companyName,
        email: data.email,
        contactPerson: data.contactPerson,
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
      const conversationId = `welcome_${data.agencyId}`;
      const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

      // Check if welcome message already sent
      const existing = await getDoc(conversationRef);
      if (!existing.exists()) {
        // Create conversation
        await setDoc(conversationRef, {
          jobId: null, // System message, not related to a job
          jobHunterId: null, // Not a job hunter conversation
          agencyId: data.agencyId,
          isSystemMessage: true,
          unreadCount: 1,
          [`unreadCount_${data.agencyId}`]: 1,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Create welcome message
        const messageRef = doc(db, COLLECTIONS.MESSAGES, `${conversationId}_welcome`);
        await setDoc(messageRef, {
          conversationId,
          senderId: 'system',
          senderType: 'system',
          recipientId: data.agencyId,
          recipientType: 'agency',
          content: AGENCY_WELCOME_MESSAGE,
          read: false,
          createdAt: Timestamp.now(),
        });

        results.messageSent = true;
        console.log(`Welcome message sent to agency ${data.agencyId}`);
      } else {
        console.log(`Welcome message already exists for agency ${data.agencyId}`);
        results.messageSent = true;
      }
    } catch (messageError) {
      console.error('Failed to send in-app welcome message:', messageError);
      // Continue even if message fails
    }

    return results;
  } catch (error) {
    console.error('Error in sendAgencyWelcome:', error);
    return results;
  }
}

/**
 * Queue welcome message for background processing
 * This can be called from client-side signup without blocking
 */
export async function queueAgencyWelcome(agencyId: string): Promise<void> {
  try {
    // Call server-side API to send welcome message
    const response = await fetch('/api/agency/welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agencyId }),
    });

    if (!response.ok) {
      console.error('Failed to queue welcome message:', await response.text());
    }
  } catch (error) {
    console.error('Error queuing welcome message:', error);
    // Don't throw - welcome message is not critical
  }
}
