import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createNotification } from './helpers';
import { sendEmail } from '../email/send-email';

/**
 * Cloud Function that triggers when an admin sends an individual message
 * Creates notifications for the recipient
 */
export const onAdminMessageSent = functions.firestore
  .document('adminConversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const { conversationId } = context.params;
    const messageData = snapshot.data();

    if (!messageData || messageData.senderType !== 'admin') {
      // Only process messages sent by admin
      return;
    }

    try {
      // Get the conversation to find the recipient
      const conversationDoc = await admin.firestore()
        .collection('adminConversations')
        .doc(conversationId)
        .get();

      if (!conversationDoc.exists) {
        console.error('Conversation not found');
        return;
      }

      const conversationData = conversationDoc.data();
      const recipientId = conversationData?.userId;

      if (!recipientId) {
        console.error('Recipient not found in conversation');
        return;
      }

      // Get admin details
      const adminDoc = await admin.firestore()
        .collection('admins')
        .doc(messageData.senderId)
        .get();

      const adminData = adminDoc.data();
      const adminName = adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Admin';

      // Create notification for recipient
      await createNotification({
        userId: recipientId,
        type: 'message',
        title: `New message from ${adminName}`,
        message: messageData.content.substring(0, 200) + (messageData.content.length > 200 ? '...' : ''),
        actionUrl: `/messages/admin/${conversationId}`,
      });

      // Get recipient details for email
      const userCollection = conversationData.userType === 'jobhunter' ? 'jobHunters' : 'agencies';
      const userDoc = await admin.firestore()
        .collection(userCollection)
        .doc(recipientId)
        .get();

      const userData = userDoc.data();

      // Send email notification
      if (userData?.email) {
        await sendEmail({
          userId: recipientId,
          type: 'message',
          title: `New message from ${adminName}`,
          message: messageData.content,
          actionUrl: `/messages/admin/${conversationId}`,
          recipientEmail: userData.email,
          recipientName: userData.name || userData.firstName || userData.companyName || 'User',
        });
      }

      console.log(`Admin message notification sent for conversation ${conversationId}`);

    } catch (error) {
      console.error('Error sending admin message notification:', error);
      throw error;
    }
  });

/**
 * Cloud Function that triggers when a bulk admin message is sent
 * Creates notifications for all recipients
 */
export const onAdminBulkMessageSent = functions.firestore
  .document('adminMessages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const { messageId } = context.params;
    const messageData = snapshot.data();

    if (!messageData || messageData.messageType !== 'bulk') {
      // Only process bulk messages
      return;
    }

    try {
      const { recipientIds, subject, content, recipientType } = messageData;

      // Process recipients in batches to avoid timeout
      const batchSize = 50;
      const batches = [];

      for (let i = 0; i < recipientIds.length; i += batchSize) {
        batches.push(recipientIds.slice(i, i + batchSize));
      }

      let successCount = 0;
      let failedCount = 0;

      for (const batch of batches) {
        const promises = batch.map(async (recipientId: string) => {
          try {
            // Create notification
            await createNotification({
              userId: recipientId,
              type: 'system',
              title: subject || 'New Message from Admin',
              message: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
              actionUrl: `/messages/admin/bulk/${messageId}`,
            });

            // Get recipient details for email
            const userCollection = recipientType === 'jobhunter' ? 'jobHunters' :
                                   recipientType === 'agency' ? 'agencies' :
                                   'users';

            // Try to find user in the appropriate collection
            let userData: any = null;
            let recipientEmail = '';
            let recipientName = '';

            if (userCollection === 'users' || recipientType === 'all') {
              // Try jobHunters first
              const jobHunterDoc = await admin.firestore()
                .collection('jobHunters')
                .doc(recipientId)
                .get();

              if (jobHunterDoc.exists) {
                userData = jobHunterDoc.data();
                recipientEmail = userData?.email || '';
                recipientName = userData ? `${userData.firstName} ${userData.lastName}` : 'User';
              } else {
                // Try agencies
                const agencyDoc = await admin.firestore()
                  .collection('agencies')
                  .doc(recipientId)
                  .get();

                if (agencyDoc.exists) {
                  userData = agencyDoc.data();
                  recipientEmail = userData?.email || '';
                  recipientName = userData?.companyName || 'Agency';
                }
              }
            } else {
              const userDoc = await admin.firestore()
                .collection(userCollection)
                .doc(recipientId)
                .get();

              if (userDoc.exists) {
                userData = userDoc.data();
                recipientEmail = userData?.email || '';
                recipientName = userCollection === 'jobHunters'
                  ? userData ? `${userData.firstName} ${userData.lastName}` : 'Job Hunter'
                  : userData?.companyName || 'Agency';
              }
            }

            // Send email if available
            if (recipientEmail) {
              await sendEmail({
                userId: recipientId,
                type: 'system',
                title: subject || 'New Message from Admin',
                message: content,
                actionUrl: `/messages/admin/bulk/${messageId}`,
                recipientEmail,
                recipientName,
              });
            }

            successCount++;
          } catch (error) {
            console.error(`Failed to send notification to ${recipientId}:`, error);
            failedCount++;
          }
        });

        // Wait for batch to complete
        await Promise.all(promises);
      }

      // Update message statistics
      await admin.firestore()
        .collection('adminMessages')
        .doc(messageId)
        .update({
          status: 'sent',
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
          deliveredCount: successCount,
          failedCount: failedCount,
        });

      console.log(`Bulk message ${messageId} sent to ${successCount} recipients (${failedCount} failed)`);

    } catch (error) {
      console.error('Error processing bulk message:', error);

      // Update status to failed
      await admin.firestore()
        .collection('adminMessages')
        .doc(messageId)
        .update({
          status: 'failed',
        });

      throw error;
    }
  });

/**
 * Cloud Function that triggers when a user replies to an admin
 * Creates notification for the admin
 */
export const onUserReplyToAdmin = functions.firestore
  .document('adminConversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const { conversationId } = context.params;
    const messageData = snapshot.data();

    if (!messageData || messageData.senderType !== 'user') {
      // Only process messages sent by users
      return;
    }

    try {
      // Get the conversation to find the admin
      const conversationDoc = await admin.firestore()
        .collection('adminConversations')
        .doc(conversationId)
        .get();

      if (!conversationDoc.exists) {
        console.error('Conversation not found');
        return;
      }

      const conversationData = conversationDoc.data();
      const adminId = conversationData?.adminId;
      const userId = conversationData?.userId;
      const userType = conversationData?.userType;

      if (!adminId || !userId) {
        console.error('Admin or user not found in conversation');
        return;
      }

      // Get user details
      const userCollection = userType === 'jobhunter' ? 'jobHunters' : 'agencies';
      const userDoc = await admin.firestore()
        .collection(userCollection)
        .doc(userId)
        .get();

      const userData = userDoc.data();
      const userName = userType === 'jobhunter'
        ? userData ? `${userData.firstName} ${userData.lastName}` : 'Job Hunter'
        : userData?.companyName || 'Agency';

      // Create notification for admin
      await createNotification({
        userId: adminId,
        type: 'message',
        title: `New reply from ${userName}`,
        message: messageData.content.substring(0, 200) + (messageData.content.length > 200 ? '...' : ''),
        actionUrl: `/admin/messages/${userId}`,
      });

      // Get admin details for email
      const adminDoc = await admin.firestore()
        .collection('admins')
        .doc(adminId)
        .get();

      const adminData = adminDoc.data();

      // Send email notification to admin
      if (adminData?.email) {
        await sendEmail({
          userId: adminId,
          type: 'message',
          title: `New reply from ${userName}`,
          message: messageData.content,
          actionUrl: `/admin/messages/${userId}`,
          recipientEmail: adminData.email,
          recipientName: `${adminData.firstName} ${adminData.lastName}`,
        });
      }

      console.log(`User reply notification sent to admin ${adminId}`);

    } catch (error) {
      console.error('Error sending user reply notification:', error);
      throw error;
    }
  });