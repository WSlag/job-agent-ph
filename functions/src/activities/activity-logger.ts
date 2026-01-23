import * as admin from 'firebase-admin';

export type UserActivityType =
  | 'application_submitted'
  | 'application_withdrawn'
  | 'job_saved'
  | 'job_unsaved'
  | 'profile_updated'
  | 'resume_uploaded'
  | 'message_sent'
  | 'account_created'
  | 'login'
  | 'job_posted'
  | 'job_updated'
  | 'job_deactivated'
  | 'job_reactivated'
  | 'application_status_changed'
  | 'message_sent_to_applicant'
  | 'agency_profile_updated'
  | 'featured_request_submitted'
  | 'subscription_purchased'
  | 'notification_preferences_updated';

export type UserActivityCategory =
  | 'application' | 'job' | 'profile' | 'message' | 'account' | 'subscription';

export interface LogActivityParams {
  userId: string;
  userType: 'jobhunter' | 'agency';
  userName: string;
  activityType: UserActivityType;
  title: string;
  description: string;
  resourceType?: 'job' | 'application' | 'conversation' | 'profile' | 'subscription';
  resourceId?: string;
  metadata?: Record<string, any>;
}

function getActivityCategory(type: UserActivityType): UserActivityCategory {
  const categoryMap: Record<UserActivityType, UserActivityCategory> = {
    application_submitted: 'application',
    application_withdrawn: 'application',
    application_status_changed: 'application',
    job_saved: 'job',
    job_unsaved: 'job',
    job_posted: 'job',
    job_updated: 'job',
    job_deactivated: 'job',
    job_reactivated: 'job',
    profile_updated: 'profile',
    resume_uploaded: 'profile',
    agency_profile_updated: 'profile',
    message_sent: 'message',
    message_sent_to_applicant: 'message',
    account_created: 'account',
    login: 'account',
    featured_request_submitted: 'subscription',
    subscription_purchased: 'subscription',
    notification_preferences_updated: 'account',
  };
  return categoryMap[type] || 'account';
}

/**
 * Log a user activity to the userActivities collection (server-side)
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const db = admin.firestore();
    const category = getActivityCategory(params.activityType);

    await db.collection('userActivities').add({
      userId: params.userId,
      userType: params.userType,
      userName: params.userName,
      activityType: params.activityType,
      category,
      title: params.title,
      description: params.description,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      resourceType: params.resourceType || null,
      resourceId: params.resourceId || null,
      metadata: params.metadata || {},
    });

    console.log(`Activity logged: ${params.activityType} for user ${params.userId}`);
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging should not break the triggering operation
  }
}
