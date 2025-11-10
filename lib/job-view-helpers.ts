import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getDbInstance } from './firebase';
import { COLLECTIONS } from './collections';

/**
 * Track a job view for analytics
 * @param jobId The ID of the job being viewed
 * @param userId Optional user ID if authenticated
 * @param source Where the user came from ('search', 'similar', 'direct', 'featured')
 */
export async function trackJobView(
  jobId: string,
  userId?: string,
  source?: string
): Promise<void> {
  try {
    const db = getDbInstance();
    // Build the document data conditionally
    const viewData: any = {
      jobId,
      viewedAt: Timestamp.now(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : null,
      source: source || 'direct',
    };

    // Only include userId if it's actually provided (for authenticated users)
    if (userId) {
      viewData.userId = userId;
    }

    await addDoc(collection(db, COLLECTIONS.JOB_VIEWS), viewData);
  } catch (error) {
    // Don't throw - tracking shouldn't break the app
    console.error('Error tracking job view:', error);
  }
}

/**
 * Get total view count for a job
 * @param jobId The ID of the job
 * @returns The number of views
 */
export async function getJobViewCount(jobId: string): Promise<number> {
  try {
    const db = getDbInstance();
    const q = query(
      collection(db, COLLECTIONS.JOB_VIEWS),
      where('jobId', '==', jobId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting view count:', error);
    return 0;
  }
}
