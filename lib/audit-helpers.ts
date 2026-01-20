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
  doc,
  getDoc,
} from 'firebase/firestore';
import { AuditLog, AuditAction, AuditResourceType } from '@/types';
import { COLLECTIONS } from './collections';

export interface LogAdminActionParams {
  adminId: string;
  adminName: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilters {
  adminId?: string;
  action?: AuditAction;
  resourceType?: AuditResourceType;
  resourceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

/**
 * Log an admin action to the audit log
 * @param params - Action parameters to log
 */
export async function logAdminAction(
  params: LogAdminActionParams
): Promise<void> {
  try {
    const db = getDbInstance();
    const auditLog: Omit<AuditLog, 'id'> = {
      adminId: params.adminId,
      adminName: params.adminName,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      details: params.details || {},
      timestamp: new Date(),
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    };

    await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
      ...auditLog,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw error - audit logging should not break the main operation
  }
}

/**
 * Helper function to fetch resource name from Firestore
 * @param resourceType - Type of the resource
 * @param resourceId - ID of the resource
 * @returns Human-readable name of the resource
 */
async function fetchResourceName(
  resourceType: AuditResourceType,
  resourceId: string
): Promise<string | undefined> {
  try {
    const db = getDbInstance();
    let collectionName: string;
    let nameField: string;

    // Determine which collection to query based on resource type
    switch (resourceType) {
      case 'job':
        collectionName = COLLECTIONS.JOBS;
        nameField = 'title';
        break;
      case 'user':
        collectionName = COLLECTIONS.USERS;
        nameField = 'name';
        break;
      case 'agency':
        collectionName = COLLECTIONS.AGENCIES;
        nameField = 'agencyName';
        break;
      case 'jobhunter':
        collectionName = COLLECTIONS.JOB_HUNTERS;
        nameField = 'name';
        break;
      case 'featured_request':
        collectionName = COLLECTIONS.FEATURED_REQUESTS;
        // For featured requests, we'll fetch the job title
        const featuredDoc = await getDoc(doc(db, collectionName, resourceId));
        if (featuredDoc.exists()) {
          const jobId = featuredDoc.data()?.jobId;
          if (jobId) {
            const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, jobId));
            return jobDoc.exists() ? jobDoc.data()?.title : undefined;
          }
        }
        return undefined;
      case 'settings':
      case 'admin':
        // These don't have meaningful names to display
        return undefined;
      default:
        return undefined;
    }

    // Fetch the document
    const docRef = doc(db, collectionName, resourceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()?.[nameField];
    }

    return undefined;
  } catch (error) {
    console.error(`Error fetching resource name for ${resourceType}:${resourceId}:`, error);
    return undefined;
  }
}

/**
 * Get audit logs with filters
 * @param filters - Filters to apply
 * @returns Array of audit logs
 */
export async function getAdminAuditLogs(
  filters: AuditLogFilters = {}
): Promise<AuditLog[]> {
  try {
    const db = getDbInstance();
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.adminId) {
      constraints.push(where('adminId', '==', filters.adminId));
    }

    if (filters.action) {
      constraints.push(where('action', '==', filters.action));
    }

    if (filters.resourceType) {
      constraints.push(where('resourceType', '==', filters.resourceType));
    }

    if (filters.resourceId) {
      constraints.push(where('resourceId', '==', filters.resourceId));
    }

    // Order by timestamp (newest first)
    constraints.push(orderBy('timestamp', 'desc'));

    // Limit results
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = query(collection(db, COLLECTIONS.AUDIT_LOGS), ...constraints);
    const snapshot = await getDocs(q);

    let logs: AuditLog[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as AuditLog[];

    // Apply date filters (client-side due to Firestore limitations)
    if (filters.dateFrom) {
      logs = logs.filter((log) => log.timestamp >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      logs = logs.filter((log) => log.timestamp <= filters.dateTo!);
    }

    // Fetch resource names for all logs
    const logsWithNames = await Promise.all(
      logs.map(async (log) => {
        const resourceName = await fetchResourceName(log.resourceType, log.resourceId);
        return {
          ...log,
          resourceName,
        };
      })
    );

    return logsWithNames;
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
}

/**
 * Get audit history for a specific resource
 * @param resourceType - Type of resource
 * @param resourceId - ID of the resource
 * @returns Array of audit logs for the resource
 */
export async function getResourceAuditHistory(
  resourceType: AuditResourceType,
  resourceId: string
): Promise<AuditLog[]> {
  try {
    const db = getDbInstance();
    const q = query(
      collection(db, COLLECTIONS.AUDIT_LOGS),
      where('resourceType', '==', resourceType),
      where('resourceId', '==', resourceId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as AuditLog[];
  } catch (error) {
    console.error('Error getting resource audit history:', error);
    return [];
  }
}

/**
 * Get recent admin activity (last 24 hours)
 * @param limit - Max number of logs to return
 * @returns Array of recent audit logs
 */
export async function getRecentAdminActivity(
  limitCount: number = 50
): Promise<AuditLog[]> {
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  return getAdminAuditLogs({
    dateFrom: yesterday,
    limit: limitCount,
  });
}

/**
 * Get admin activity stats
 */
export interface AdminActivityStats {
  totalActions: number;
  actionsLast24Hours: number;
  actionsLast7Days: number;
  topActions: { action: AuditAction; count: number }[];
  topAdmins: { adminId: string; adminName: string; count: number }[];
}

export async function getAdminActivityStats(): Promise<AdminActivityStats> {
  try {
    const allLogs = await getAdminAuditLogs({ limit: 1000 });

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Count actions in time periods
    const actionsLast24Hours = allLogs.filter(
      (log) => log.timestamp >= last24Hours
    ).length;

    const actionsLast7Days = allLogs.filter(
      (log) => log.timestamp >= last7Days
    ).length;

    // Count by action type
    const actionCounts = new Map<AuditAction, number>();
    allLogs.forEach((log) => {
      actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1);
    });

    const topActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Count by admin
    const adminCounts = new Map<
      string,
      { adminId: string; adminName: string; count: number }
    >();
    allLogs.forEach((log) => {
      const existing = adminCounts.get(log.adminId);
      if (existing) {
        existing.count++;
      } else {
        adminCounts.set(log.adminId, {
          adminId: log.adminId,
          adminName: log.adminName,
          count: 1,
        });
      }
    });

    const topAdmins = Array.from(adminCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalActions: allLogs.length,
      actionsLast24Hours,
      actionsLast7Days,
      topActions,
      topAdmins,
    };
  } catch (error) {
    console.error('Error getting admin activity stats:', error);
    return {
      totalActions: 0,
      actionsLast24Hours: 0,
      actionsLast7Days: 0,
      topActions: [],
      topAdmins: [],
    };
  }
}

/**
 * Format audit action for display
 */
export function formatAuditAction(action: AuditAction): string {
  const actionMap: Record<AuditAction, string> = {
    job_created: 'Created Job',
    job_updated: 'Updated Job',
    job_deleted: 'Deleted Job',
    job_held: 'Put Job on Hold',
    job_unheld: 'Removed Job from Hold',
    user_suspended: 'Suspended User',
    user_unsuspended: 'Unsuspended User',
    user_deleted: 'Deleted User',
    VERIFY_AGENCY: 'Verified Agency',
    UNVERIFY_AGENCY: 'Revoked Agency Verification',
    featured_request_approved: 'Approved Featured Request',
    featured_request_rejected: 'Rejected Featured Request',
    featured_job_removed: 'Removed Featured Job',
    message_sent_bulk: 'Sent Bulk Message',
    message_sent_individual: 'Sent Individual Message',
    settings_updated: 'Updated Settings',
    permissions_updated: 'Updated Permissions',
    subscription_approved: 'Approved Subscription',
    subscription_rejected: 'Rejected Subscription',
    facebook_post_created: 'Posted Job to Facebook',
    facebook_post_failed: 'Facebook Post Failed',
  };

  return actionMap[action] || action;
}

/**
 * Get action color/badge for UI display
 */
export function getActionBadgeColor(action: AuditAction): string {
  if (action.includes('deleted') || action.includes('rejected')) {
    return 'red';
  }
  if (action.includes('suspended') || action.includes('held')) {
    return 'yellow';
  }
  if (action.includes('approved') || action.includes('unsuspended') || action.includes('unheld')) {
    return 'green';
  }
  if (action.includes('updated')) {
    return 'blue';
  }
  return 'gray';
}
