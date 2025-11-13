import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createNotification, getAdminUserIds, getAgencyData } from './helpers';
import { sendEmail } from '../email/send-email';

/**
 * Triggered when a new featured request is created
 * Notifies all admins about the new request
 */
export const onFeaturedRequestCreated = functions.firestore
  .document('featuredRequests/{requestId}')
  .onCreate(async (snapshot, context) => {
    try {
      const request = snapshot.data();
      const { requestId } = context.params;

      console.log(`Processing new featured request: ${requestId}`);

      // Get agency data
      const agency = await getAgencyData(request.agencyId);
      if (!agency) {
        console.error('Agency not found');
        return;
      }

      // Get all admin user IDs
      const adminIds = await getAdminUserIds();

      if (adminIds.length === 0) {
        console.warn('No admin users found');
        return;
      }

      // Create notification for each admin
      const notificationPromises = adminIds.map(async (adminId) => {
        await createNotification({
          userId: adminId,
          type: 'system',
          title: 'New Featured Request',
          message: `${agency.companyName || 'An agency'} has requested featured placement for a job`,
          actionUrl: `/admin/featured-requests?id=${requestId}`,
        });
      });

      await Promise.all(notificationPromises);

      // Optional: Send email to admins
      const db = admin.firestore();
      const emailPromises = adminIds.map(async (adminId) => {
        const adminDoc = await db.collection('users').doc(adminId).get();
        const adminData = adminDoc.exists ? adminDoc.data() : null;

        if (adminData?.email) {
          await sendEmail({
            recipientEmail: adminData.email,
            recipientName: adminData.fullName || 'Admin',
            userId: adminId,
            type: 'system',
            title: 'New Featured Request',
            message: `${agency.companyName || 'An agency'} has requested featured placement for a job`,
            actionUrl: `/admin/featured-requests?id=${requestId}`,
          });
        }
      });

      await Promise.all(emailPromises);

      console.log(`Featured request notification sent to ${adminIds.length} admin(s)`);
    } catch (error) {
      console.error('Error in onFeaturedRequestCreated:', error);
    }
  });

/**
 * Triggered when a new user is created
 * Notifies admins about new user registrations
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    console.log(`Processing new user registration: ${user.uid}`);

    // Get user data from Firestore (might not exist yet if they haven't completed profile)
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // Determine user type
    let userType = 'user';
    let userName = user.displayName || user.email || 'New user';

    if (userData) {
      if (userData.role === 'admin') {
        // Don't notify about admin creation
        return;
      }

      if (userData.agencyId) {
        userType = 'agency';
        const agencyData = await getAgencyData(userData.agencyId);
        userName = agencyData?.companyName || userData.fullName || userName;
      } else {
        userType = 'job hunter';
        userName = userData.fullName || userName;
      }
    }

    // Get all admin user IDs
    const adminIds = await getAdminUserIds();

    if (adminIds.length === 0) {
      console.warn('No admin users found');
      return;
    }

    // Create notification for each admin
    const notificationPromises = adminIds.map(async (adminId) => {
      await createNotification({
        userId: adminId,
        type: 'system',
        title: 'New User Registration',
        message: `${userName} has registered as a ${userType}`,
        actionUrl: `/admin/users?id=${user.uid}`,
      });
    });

    await Promise.all(notificationPromises);

    console.log(`New user notification sent to ${adminIds.length} admin(s)`);
  } catch (error) {
    console.error('Error in onUserCreated:', error);
  }
});
