import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createNotification, getAgencyData } from './helpers';
import { sendEmail } from '../email/send-email';

/**
 * Triggered when a new message is sent in a conversation
 * Notifies the recipient of the new message
 */
export const onMessageSent = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    try {
      const message = snapshot.data();
      const { conversationId } = context.params;

      console.log(`Processing new message in conversation: ${conversationId}`);

      // Get conversation data to find participants
      const db = admin.firestore();
      const conversationDoc = await db.collection('conversations').doc(conversationId).get();

      if (!conversationDoc.exists) {
        console.error('Conversation not found');
        return;
      }

      const conversation = conversationDoc.data();
      if (!conversation) {
        console.error('Conversation data is empty');
        return;
      }

      // Determine recipient (the one who didn't send the message)
      const participants = conversation.participants || [];
      const recipientId = participants.find((id: string) => id !== message.senderId);

      if (!recipientId) {
        console.error('Recipient not found in conversation participants');
        return;
      }

      // Get sender data
      const senderDoc = await db.collection('users').doc(message.senderId).get();
      const senderData = senderDoc.exists ? senderDoc.data() : null;

      // Check if sender is an agency user
      let senderName = 'Someone';
      if (senderData) {
        // If user has agencyId, get agency name
        if (senderData.agencyId) {
          const agencyData = await getAgencyData(senderData.agencyId);
          senderName = agencyData?.companyName || senderData.fullName || 'An agency';
        } else {
          senderName = senderData.fullName || 'A user';
        }
      }

      // Get recipient data for email
      const recipientDoc = await db.collection('users').doc(recipientId).get();
      const recipientData = recipientDoc.exists ? recipientDoc.data() : null;

      // Create notification for recipient
      await createNotification({
        userId: recipientId,
        type: 'message',
        title: 'New Message',
        message: `${senderName} sent you a message: "${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}"`,
        actionUrl: `/messages?conversationId=${conversationId}`,
      });

      // Send email to recipient if enabled
      if (recipientData?.email) {
        await sendEmail({
          recipientEmail: recipientData.email,
          recipientName: recipientData.fullName || 'User',
          userId: recipientId,
          type: 'message',
          title: 'New Message',
          message: `${senderName} sent you a message: "${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}"`,
          actionUrl: `/messages?conversationId=${conversationId}`,
        });
      }

      console.log(`Message notification sent to recipient: ${recipientId}`);
    } catch (error) {
      console.error('Error in onMessageSent:', error);
    }
  });
