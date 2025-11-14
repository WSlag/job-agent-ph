import { getDbInstance } from './firebase';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
  orderBy,
  QueryConstraint,
} from 'firebase/firestore';
import { Job, JobStatus } from '@/types';
import { COLLECTIONS } from './collections';

export interface JobFilters {
  status?: JobStatus;
  agencyId?: string;
  category?: string;
  searchQuery?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Put a job on hold
 * @param jobId - Job ID to hold
 * @param adminId - Admin ID performing the action
 * @param reason - Reason for holding the job
 */
export async function holdJob(
  jobId: string,
  adminId: string,
  reason: string
): Promise<void> {
  try {
    const db = getDbInstance();
    const jobRef = doc(db, COLLECTIONS.JOBS, jobId);

    await updateDoc(jobRef, {
      status: 'on-hold' as JobStatus,
      isActive: false, // For backward compatibility
      onHoldReason: reason,
      onHoldAt: Timestamp.now(),
      onHoldBy: adminId,
    });
  } catch (error) {
    console.error('Error holding job:', error);
    throw new Error('Failed to hold job');
  }
}

/**
 * Remove a job from hold (activate it)
 * @param jobId - Job ID to unhold
 * @param adminId - Admin ID performing the action
 */
export async function unholdJob(
  jobId: string,
  adminId: string
): Promise<void> {
  try {
    const db = getDbInstance();
    const jobRef = doc(db, COLLECTIONS.JOBS, jobId);

    await updateDoc(jobRef, {
      status: 'active' as JobStatus,
      isActive: true, // For backward compatibility
      onHoldReason: null,
      onHoldAt: null,
      onHoldBy: null,
    });
  } catch (error) {
    console.error('Error unholding job:', error);
    throw new Error('Failed to unhold job');
  }
}

/**
 * Soft delete a job (marks as deleted but keeps data)
 * @param jobId - Job ID to delete
 * @param adminId - Admin ID performing the action
 */
export async function softDeleteJob(
  jobId: string,
  adminId: string
): Promise<void> {
  try {
    const db = getDbInstance();
    const jobRef = doc(db, COLLECTIONS.JOBS, jobId);

    await updateDoc(jobRef, {
      status: 'deleted' as JobStatus,
      isActive: false, // For backward compatibility
      deletedAt: Timestamp.now(),
      deletedBy: adminId,
      isFeatured: false, // Remove from featured if it was featured
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job');
  }
}

/**
 * Permanently delete a job (hard delete - super admin only)
 * @param jobId - Job ID to delete permanently
 * @param adminId - Admin ID performing the action
 */
export async function permanentlyDeleteJob(
  jobId: string,
  adminId: string
): Promise<void> {
  try {
    const db = getDbInstance();
    await deleteDoc(doc(db, COLLECTIONS.JOBS, jobId));
  } catch (error) {
    console.error('Error permanently deleting job:', error);
    throw new Error('Failed to permanently delete job');
  }
}

/**
 * Get jobs with admin filters for management
 * @param filters - Filters to apply
 * @returns Array of jobs with details
 */
export async function getAdminJobs(filters: JobFilters = {}): Promise<Job[]> {
  try {
    const db = getDbInstance();
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters.agencyId) {
      constraints.push(where('agencyId', '==', filters.agencyId));
    }

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    // Order by posted date (newest first)
    constraints.push(orderBy('postedAt', 'desc'));

    const q = query(collection(db, COLLECTIONS.JOBS), ...constraints);
    const snapshot = await getDocs(q);

    let jobs: Job[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      postedAt: doc.data().postedAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
      featuredAt: doc.data().featuredAt?.toDate(),
      onHoldAt: doc.data().onHoldAt?.toDate(),
      deletedAt: doc.data().deletedAt?.toDate(),
    })) as Job[];

    // Apply client-side filters (for complex queries)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    if (filters.dateFrom) {
      jobs = jobs.filter((job) => job.postedAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      jobs = jobs.filter((job) => job.postedAt <= filters.dateTo!);
    }

    return jobs;
  } catch (error) {
    console.error('Error getting admin jobs:', error);
    return [];
  }
}

/**
 * Get job statistics for admin dashboard
 */
export interface JobStats {
  total: number;
  active: number;
  onHold: number;
  deleted: number;
  featured: number;
}

export async function getJobStats(): Promise<JobStats> {
  try {
    const db = getDbInstance();
    const jobsSnapshot = await getDocs(collection(db, COLLECTIONS.JOBS));

    const stats: JobStats = {
      total: jobsSnapshot.size,
      active: 0,
      onHold: 0,
      deleted: 0,
      featured: 0,
    };

    jobsSnapshot.forEach((doc) => {
      const job = doc.data();
      const status = job.status || (job.isActive ? 'active' : 'deleted');

      switch (status) {
        case 'active':
          stats.active++;
          break;
        case 'on-hold':
          stats.onHold++;
          break;
        case 'deleted':
          stats.deleted++;
          break;
      }

      if (job.isFeatured && job.isActive) {
        stats.featured++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting job stats:', error);
    return {
      total: 0,
      active: 0,
      onHold: 0,
      deleted: 0,
      featured: 0,
    };
  }
}

/**
 * Bulk hold multiple jobs
 * @param jobIds - Array of job IDs to hold
 * @param adminId - Admin ID performing the action
 * @param reason - Reason for holding the jobs
 */
export async function bulkHoldJobs(
  jobIds: string[],
  adminId: string,
  reason: string
): Promise<void> {
  try {
    const updates = jobIds.map((jobId) => holdJob(jobId, adminId, reason));
    await Promise.all(updates);
  } catch (error) {
    console.error('Error bulk holding jobs:', error);
    throw new Error('Failed to bulk hold jobs');
  }
}

/**
 * Bulk unhold multiple jobs
 * @param jobIds - Array of job IDs to unhold
 * @param adminId - Admin ID performing the action
 */
export async function bulkUnholdJobs(
  jobIds: string[],
  adminId: string
): Promise<void> {
  try {
    const updates = jobIds.map((jobId) => unholdJob(jobId, adminId));
    await Promise.all(updates);
  } catch (error) {
    console.error('Error bulk unholding jobs:', error);
    throw new Error('Failed to bulk unhold jobs');
  }
}

/**
 * Bulk delete multiple jobs
 * @param jobIds - Array of job IDs to delete
 * @param adminId - Admin ID performing the action
 */
export async function bulkDeleteJobs(
  jobIds: string[],
  adminId: string
): Promise<void> {
  try {
    const updates = jobIds.map((jobId) => softDeleteJob(jobId, adminId));
    await Promise.all(updates);
  } catch (error) {
    console.error('Error bulk deleting jobs:', error);
    throw new Error('Failed to bulk delete jobs');
  }
}
