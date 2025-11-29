import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  Timestamp,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getDbInstance } from './firebase';
import { DashboardStats, ActivityItem, RecentApplication, SavedJobPreview } from '@/types/dashboard';
import { JobHunter, Job } from '@/types';

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(profile: JobHunter | null | undefined): number {
  if (!profile) return 0;

  const requiredFields = {
    fullName: !!(profile.firstName && profile.lastName),
    location: !!profile.location,
    phone: !!profile.phone,
    skills: profile.skills && profile.skills.length > 0,
    experience: profile.experience !== undefined && profile.experience !== null,
    resume: !!profile.resumeUrl,
    profilePicture: !!profile.profileImageUrl,
  };

  const completed = Object.values(requiredFields).filter(Boolean).length;
  const total = Object.keys(requiredFields).length;

  return Math.round((completed / total) * 100);
}

/**
 * Get application statistics grouped by status
 */
export async function getApplicationStats(userId: string): Promise<DashboardStats['applications']> {
  const db = getDbInstance();
  const applicationsRef = collection(db, 'applications');
  const q = query(
    applicationsRef,
    where('jobHunterId', '==', userId),
    orderBy('appliedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const stats: DashboardStats['applications'] = {
    total: 0,
    pending: 0,
    reviewing: 0,
    interview: 0,
    offered: 0,
    rejected: 0,
    withdrawn: 0,
  };

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    stats.total++;
    const status = data.status as keyof typeof stats;
    if (status in stats) {
      stats[status]++;
    }
  });

  return stats;
}

/**
 * Get count of saved jobs
 */
export async function getSavedJobsCount(userId: string): Promise<number> {
  const db = getDbInstance();
  const savedJobsRef = collection(db, 'savedJobs', userId, 'jobs');
  const snapshot = await getDocs(savedJobsRef);
  return snapshot.size;
}

/**
 * Get recent applications (last 5)
 */
export async function getRecentApplications(userId: string): Promise<RecentApplication[]> {
  const db = getDbInstance();
  const applicationsRef = collection(db, 'applications');
  const q = query(
    applicationsRef,
    where('jobHunterId', '==', userId),
    orderBy('appliedAt', 'desc'),
    limit(5)
  );

  const snapshot = await getDocs(q);
  const applications: RecentApplication[] = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    // Fetch job details
    const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
    const jobData = jobDoc.data();

    applications.push({
      id: docSnap.id,
      jobId: data.jobId,
      jobTitle: jobData?.title || 'Unknown Position',
      companyName: jobData?.companyName || 'Unknown Company',
      status: data.status,
      appliedAt: data.appliedAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || data.appliedAt?.toDate() || new Date(),
    });
  }

  return applications;
}

/**
 * Get recent saved jobs (last 4)
 */
export async function getRecentSavedJobs(userId: string): Promise<SavedJobPreview[]> {
  const db = getDbInstance();
  const savedJobsRef = collection(db, 'savedJobs', userId, 'jobs');
  const q = query(savedJobsRef, orderBy('savedAt', 'desc'), limit(4));

  const snapshot = await getDocs(q);
  const savedJobs: SavedJobPreview[] = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    // Fetch job details
    const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
    const jobData = jobDoc.data();

    if (jobData) {
      savedJobs.push({
        id: docSnap.id,
        jobId: data.jobId,
        title: jobData.title || 'Unknown Position',
        companyName: jobData.companyName || 'Unknown Company',
        location: jobData.location || 'Location not specified',
        salaryRange: jobData.salaryMin && jobData.salaryMax ? {
          min: jobData.salaryMin,
          max: jobData.salaryMax,
          currency: jobData.currency || 'USD',
        } : undefined,
        savedAt: data.savedAt?.toDate() || new Date(),
      });
    }
  }

  return savedJobs;
}

/**
 * Aggregate recent activity from multiple sources (last 30 days)
 */
export async function getRecentActivity(userId: string): Promise<ActivityItem[]> {
  const db = getDbInstance();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

  const activities: ActivityItem[] = [];

  // Get recent applications
  const applicationsRef = collection(db, 'applications');
  const appsQuery = query(
    applicationsRef,
    where('jobHunterId', '==', userId),
    where('appliedAt', '>=', thirtyDaysAgoTimestamp),
    orderBy('appliedAt', 'desc'),
    limit(10)
  );

  const appsSnapshot = await getDocs(appsQuery);

  for (const docSnap of appsSnapshot.docs) {
    const data = docSnap.data();
    const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
    const jobData = jobDoc.data();

    activities.push({
      id: `app-${docSnap.id}`,
      type: 'application',
      title: `Applied to ${jobData?.title || 'a position'}`,
      description: `at ${jobData?.companyName || 'a company'}`,
      timestamp: data.appliedAt?.toDate() || new Date(),
      link: `/profile/applications`,
      metadata: {
        jobId: data.jobId,
        jobTitle: jobData?.title,
        companyName: jobData?.companyName,
        status: data.status,
      },
    });

    // Add status change activity if status was updated
    if (data.updatedAt && data.updatedAt.toDate() > data.appliedAt.toDate()) {
      activities.push({
        id: `status-${docSnap.id}`,
        type: 'status_change',
        title: `Application status changed`,
        description: `${jobData?.title || 'Your application'} is now ${data.status}`,
        timestamp: data.updatedAt.toDate(),
        link: `/profile/applications`,
        metadata: {
          jobId: data.jobId,
          jobTitle: jobData?.title,
          status: data.status,
        },
      });
    }
  }

  // Get recently saved jobs
  const savedJobsRef = collection(db, 'savedJobs', userId, 'jobs');
  const savedQuery = query(
    savedJobsRef,
    where('savedAt', '>=', thirtyDaysAgoTimestamp),
    orderBy('savedAt', 'desc'),
    limit(5)
  );

  const savedSnapshot = await getDocs(savedQuery);

  for (const docSnap of savedSnapshot.docs) {
    const data = docSnap.data();
    const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
    const jobData = jobDoc.data();

    activities.push({
      id: `saved-${docSnap.id}`,
      type: 'saved_job',
      title: `Saved ${jobData?.title || 'a job'}`,
      description: `at ${jobData?.companyName || 'a company'}`,
      timestamp: data.savedAt?.toDate() || new Date(),
      link: `/jobs/${data.jobId}`,
      metadata: {
        jobId: data.jobId,
        jobTitle: jobData?.title,
        companyName: jobData?.companyName,
      },
    });
  }

  // Sort all activities by timestamp (most recent first) and take top 10
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);
}

/**
 * Subscribe to applications with real-time updates
 */
export function subscribeToApplications(
  userId: string,
  callback: (stats: DashboardStats['applications']) => void
): () => void {
  const db = getDbInstance();
  const applicationsRef = collection(db, 'applications');
  const q = query(
    applicationsRef,
    where('jobHunterId', '==', userId),
    orderBy('appliedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const stats: DashboardStats['applications'] = {
      total: 0,
      pending: 0,
      reviewing: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0,
    };

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      stats.total++;
      const status = data.status as keyof typeof stats;
      if (status in stats) {
        stats[status]++;
      }
    });

    callback(stats);
  });
}

/**
 * Subscribe to saved jobs count with real-time updates
 */
export function subscribeToSavedJobs(
  userId: string,
  callback: (count: number) => void
): () => void {
  const db = getDbInstance();
  const savedJobsRef = collection(db, 'savedJobs', userId, 'jobs');

  return onSnapshot(savedJobsRef, (snapshot) => {
    callback(snapshot.size);
  });
}
