import { getDbInstance } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { UserActivity, UserActivityType, UserActivityCategory } from '@/types';
import { COLLECTIONS } from './collections';

export interface LogUserActivityParams {
  userId: string;
  userType: 'jobhunter' | 'agency';
  userName: string;
  activityType: UserActivityType;
  title: string;
  description: string;
  resourceType?: 'job' | 'application' | 'conversation' | 'profile' | 'subscription';
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export interface UserActivityFilters {
  userId?: string;
  userType?: 'jobhunter' | 'agency';
  activityType?: UserActivityType;
  category?: UserActivityCategory;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  limit?: number;
  startAfterDoc?: DocumentSnapshot;
}

export interface UserActivityStats {
  totalActivities: number;
  activitiesToday: number;
  mostActiveUsers: { userId: string; userName: string; count: number }[];
}

/**
 * Get the category for a given activity type
 */
export function getActivityCategory(type: UserActivityType): UserActivityCategory {
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
 * Log a user activity to Firestore
 */
export async function logUserActivity(params: LogUserActivityParams): Promise<void> {
  try {
    const db = getDbInstance();
    const category = getActivityCategory(params.activityType);

    const activity: Omit<UserActivity, 'id'> = {
      userId: params.userId,
      userType: params.userType,
      userName: params.userName,
      activityType: params.activityType,
      category,
      title: params.title,
      description: params.description,
      timestamp: new Date(),
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      metadata: params.metadata || {},
      ipAddress: params.ipAddress,
    };

    await addDoc(collection(db, COLLECTIONS.USER_ACTIVITIES), {
      ...activity,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw - activity logging should not break main operations
  }
}

/**
 * Get all user activities with filters (admin view, paginated)
 */
export async function getAllUserActivities(
  filters: UserActivityFilters = {}
): Promise<{ activities: UserActivity[]; lastDoc: DocumentSnapshot | null }> {
  try {
    const db = getDbInstance();
    const constraints: QueryConstraint[] = [];

    if (filters.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }

    if (filters.userType) {
      constraints.push(where('userType', '==', filters.userType));
    }

    if (filters.activityType) {
      constraints.push(where('activityType', '==', filters.activityType));
    }

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('timestamp', 'desc'));

    if (filters.startAfterDoc) {
      constraints.push(startAfter(filters.startAfterDoc));
    }

    const pageSize = filters.limit || 25;
    constraints.push(limit(pageSize));

    const q = query(collection(db, COLLECTIONS.USER_ACTIVITIES), ...constraints);
    const snapshot = await getDocs(q);

    let activities: UserActivity[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate(),
    })) as UserActivity[];

    // Apply date filters client-side
    if (filters.dateFrom) {
      activities = activities.filter((a) => a.timestamp >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      activities = activities.filter((a) => a.timestamp <= filters.dateTo!);
    }

    // Apply search filter client-side
    if (filters.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      activities = activities.filter(
        (a) =>
          a.userName.toLowerCase().includes(search) ||
          a.title.toLowerCase().includes(search) ||
          a.description.toLowerCase().includes(search)
      );
    }

    const lastDoc = snapshot.docs.length > 0
      ? snapshot.docs[snapshot.docs.length - 1]
      : null;

    return { activities, lastDoc };
  } catch (error) {
    console.error('Error getting user activities:', error);
    return { activities: [], lastDoc: null };
  }
}

/**
 * Get platform-wide activity stats for admin dashboard
 */
export async function getPlatformActivityStats(): Promise<UserActivityStats> {
  try {
    const db = getDbInstance();

    // Get total count (limited to recent 1000 for performance)
    const allQuery = query(
      collection(db, COLLECTIONS.USER_ACTIVITIES),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );
    const allSnapshot = await getDocs(allQuery);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const activities = allSnapshot.docs.map((d) => ({
      ...d.data(),
      timestamp: d.data().timestamp?.toDate(),
    }));

    const activitiesToday = activities.filter(
      (a) => a.timestamp && a.timestamp >= todayStart
    ).length;

    // Count by user
    const userCounts = new Map<string, { userName: string; count: number }>();
    activities.forEach((a: any) => {
      const existing = userCounts.get(a.userId);
      if (existing) {
        existing.count++;
      } else {
        userCounts.set(a.userId, { userName: a.userName, count: 1 });
      }
    });

    const mostActiveUsers = Array.from(userCounts.entries())
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalActivities: allSnapshot.size,
      activitiesToday,
      mostActiveUsers,
    };
  } catch (error) {
    console.error('Error getting platform activity stats:', error);
    return {
      totalActivities: 0,
      activitiesToday: 0,
      mostActiveUsers: [],
    };
  }
}

/**
 * Format activity type for display
 */
export function formatActivityType(type: UserActivityType): string {
  const typeMap: Record<UserActivityType, string> = {
    application_submitted: 'Application Submitted',
    application_withdrawn: 'Application Withdrawn',
    application_status_changed: 'Application Status Changed',
    job_saved: 'Job Saved',
    job_unsaved: 'Job Unsaved',
    job_posted: 'Job Posted',
    job_updated: 'Job Updated',
    job_deactivated: 'Job Deactivated',
    job_reactivated: 'Job Reactivated',
    profile_updated: 'Profile Updated',
    resume_uploaded: 'Resume Uploaded',
    agency_profile_updated: 'Agency Profile Updated',
    message_sent: 'Message Sent',
    message_sent_to_applicant: 'Message Sent to Applicant',
    account_created: 'Account Created',
    login: 'Login',
    featured_request_submitted: 'Featured Request Submitted',
    subscription_purchased: 'Subscription Purchased',
    notification_preferences_updated: 'Notification Preferences Updated',
  };
  return typeMap[type] || type;
}

/**
 * Get badge color for activity type
 */
export function getActivityBadgeColor(type: UserActivityType): string {
  switch (getActivityCategory(type)) {
    case 'application':
      return 'blue';
    case 'job':
      return 'green';
    case 'profile':
      return 'purple';
    case 'message':
      return 'yellow';
    case 'account':
      return 'gray';
    case 'subscription':
      return 'orange';
    default:
      return 'gray';
  }
}
