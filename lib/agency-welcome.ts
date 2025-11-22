/**
 * Agency Welcome System
 * Sends welcome email and in-app message to new agency signups
 * Uses Firebase Admin SDK for server-side operations
 */

import { emailTemplates, sendEmail } from './email';
import { adminDb } from './firebase-admin';
import { COLLECTIONS } from './collections';
import { AGENCY_WELCOME_MESSAGE } from './welcome-messages';

/**
 * Send welcome message to newly registered agency
 * Includes both email and in-app message
 * Uses Admin SDK to bypass Firestore security rules
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
      console.log(`[Welcome] Email sent to ${data.email}`);
    } catch (emailError) {
      console.error('[Welcome] Failed to send welcome email:', emailError);
      // Continue even if email fails
    }

    // Send in-app welcome message
    try {
      // Create a system conversation for the welcome message
      const conversationId = `welcome_${data.agencyId}`;
      const conversationRef = adminDb
        .collection(COLLECTIONS.CONVERSATIONS)
        .doc(conversationId);

      // Check if welcome message already sent
      const existing = await conversationRef.get();
      if (!existing.exists) {
        // Create conversation using Admin SDK
        await conversationRef.set({
          jobId: null, // System message, not related to a job
          jobHunterId: null, // Not a job hunter conversation
          agencyId: data.agencyId,
          isSystemMessage: true,
          unreadCount: 1,
          [`unreadCount_${data.agencyId}`]: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Create welcome message using Admin SDK in the correct subcollection
        const messageRef = adminDb
          .collection(COLLECTIONS.CONVERSATIONS)
          .doc(conversationId)
          .collection(COLLECTIONS.MESSAGES)
          .doc(`${conversationId}_welcome`);

        await messageRef.set({
          conversationId,
          senderId: 'system',
          senderType: 'system',
          recipientId: data.agencyId,
          recipientType: 'agency',
          content: AGENCY_WELCOME_MESSAGE,
          read: false,
          timestamp: new Date(),
          createdAt: new Date(),
        });

        // Update conversation with lastMessage for preview
        await conversationRef.update({
          lastMessage: {
            content: AGENCY_WELCOME_MESSAGE.substring(0, 100),
            createdAt: new Date(),
            senderId: 'system',
            senderType: 'system',
          },
          updatedAt: new Date(),
        });

        results.messageSent = true;
        console.log(`[Welcome] In-app message sent to agency ${data.agencyId}`);
      } else {
        console.log(`[Welcome] Message already exists for agency ${data.agencyId}`);
        results.messageSent = true;
      }
    } catch (messageError) {
      console.error('[Welcome] Failed to send in-app welcome message:', messageError);
      // Continue even if message fails
    }

    return results;
  } catch (error) {
    console.error('[Welcome] Error in sendAgencyWelcome:', error);
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
      console.error('[Welcome] Failed to queue welcome message:', await response.text());
    }
  } catch (error) {
    console.error('[Welcome] Error queuing welcome message:', error);
    // Don't throw - welcome message is not critical
  }
}
