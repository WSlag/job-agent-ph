import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { logActivity } from './activity-logger';

/**
 * Triggered when a new message is sent in a conversation
 * Logs 'message_sent' for the sender
 */
export const onMessageSentActivity = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    try {
      const message = snapshot.data();
      const { conversationId } = context.params;
      const db = admin.firestore();

      // Get conversation data
      const conversationDoc = await db.collection('conversations').doc(conversationId).get();
      const conversation = conversationDoc.data();

      if (!conversation) return;

      const senderId = message.senderId;
      const senderType = message.senderType as 'jobhunter' | 'agency';

      // Get sender name
      let userName = 'Unknown User';
      if (senderType === 'agency') {
        const agencyDoc = await db.collection('agencies').doc(senderId).get();
        const agency = agencyDoc.data();
        userName = agency?.companyName || 'Unknown Agency';
      } else {
        const userDoc = await db.collection('jobHunters').doc(senderId).get();
        const user = userDoc.data();
        userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown User';
      }

      const activityType = senderType === 'agency' ? 'message_sent_to_applicant' : 'message_sent';

      await logActivity({
        userId: senderId,
        userType: senderType,
        userName,
        activityType,
        title: senderType === 'agency' ? 'Message Sent to Applicant' : 'Message Sent',
        description: `Sent a message in conversation`,
        resourceType: 'conversation',
        resourceId: conversationId,
        metadata: {
          conversationId,
          messagePreview: message.content?.substring(0, 50) || '',
        },
      });
    } catch (error) {
      console.error('Error in onMessageSentActivity:', error);
    }
  });
