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
  doc,
  getDoc,
} from 'firebase/firestore';
import { Job, FacebookPost, FacebookPostStatus } from '@/types';
import { COLLECTIONS } from './collections';

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.jobagentph.com';

/**
 * Format a job posting for Facebook
 */
export function formatJobForFacebook(job: Job, customMessage?: string): string {
  const jobUrl = `${SITE_URL}/jobs/${job.id}`;

  // Format salary if available
  let salaryText = '';
  if (job.salaryMin || job.salaryMax) {
    if (job.salaryMin && job.salaryMax) {
      salaryText = `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      salaryText = `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    } else if (job.salaryMax) {
      salaryText = `Up to ${job.currency} ${job.salaryMax.toLocaleString()}`;
    }
  }

  // Format job type for display
  const jobTypeDisplay = job.jobType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');

  // Build hashtags
  const countryTag = job.country.replace(/\s+/g, '');
  const categoryTag = job.category.replace(/\s+/g, '');

  // Build the post content
  const lines: string[] = [
    `🚨 [HIRING] ${job.title}`,
    '',
    `${job.companyName} is looking for ${job.title}!`,
  ];

  if (customMessage) {
    lines.push('', customMessage);
  }

  lines.push(
    '',
    `📍 Location: ${job.location}, ${job.country}`,
  );

  if (salaryText) {
    lines.push(`💰 Salary: ${salaryText}`);
  }

  lines.push(`📋 Type: ${jobTypeDisplay}`);

  if (job.experienceRequired > 0) {
    lines.push(`💼 Experience: ${job.experienceRequired}+ years`);
  }

  lines.push(
    '',
    '✅ Apply now on JobAgentPH:',
    jobUrl,
    '',
    `#JobAgentPH #HiringNow #${countryTag}Jobs #${categoryTag}`,
  );

  return lines.join('\n');
}

/**
 * Post a job to Facebook Page
 */
export async function postJobToFacebook(
  job: Job,
  customMessage?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_ACCESS_TOKEN) {
    return {
      success: false,
      error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.',
    };
  }

  const postContent = formatJobForFacebook(job, customMessage);
  const jobUrl = `${SITE_URL}/jobs/${job.id}`;

  try {
    // Facebook Graph API endpoint for posting to page feed
    const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: postContent,
        link: jobUrl,
        access_token: FACEBOOK_PAGE_ACCESS_TOKEN,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', data);
      return {
        success: false,
        error: data.error?.message || 'Failed to post to Facebook',
      };
    }

    return {
      success: true,
      postId: data.id,
    };
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create a Facebook post record in Firestore
 */
export async function createFacebookPostRecord(params: {
  jobId: string;
  jobTitle: string;
  postContent: string;
  postedBy: string;
  postedByName: string;
  status: FacebookPostStatus;
  facebookPostId?: string;
  error?: string;
}): Promise<string> {
  const db = getDbInstance();

  const record: Omit<FacebookPost, 'id'> = {
    jobId: params.jobId,
    jobTitle: params.jobTitle,
    postContent: params.postContent,
    postedBy: params.postedBy,
    postedByName: params.postedByName,
    status: params.status,
    facebookPostId: params.facebookPostId,
    error: params.error,
    postedAt: params.status === 'posted' ? new Date() : undefined,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.FACEBOOK_POSTS), {
    ...record,
    postedAt: params.status === 'posted' ? Timestamp.now() : null,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Get Facebook posts with optional filters
 */
export async function getFacebookPosts(filters?: {
  jobId?: string;
  status?: FacebookPostStatus;
  limit?: number;
}): Promise<FacebookPost[]> {
  const db = getDbInstance();
  const constraints = [];

  if (filters?.jobId) {
    constraints.push(where('jobId', '==', filters.jobId));
  }

  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  if (filters?.limit) {
    constraints.push(limit(filters.limit));
  }

  const q = query(collection(db, COLLECTIONS.FACEBOOK_POSTS), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    postedAt: doc.data().postedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as FacebookPost[];
}

/**
 * Check if a job has already been posted to Facebook
 */
export async function isJobPostedToFacebook(jobId: string): Promise<boolean> {
  const posts = await getFacebookPosts({ jobId, status: 'posted' });
  return posts.length > 0;
}

/**
 * Get a job by ID
 */
export async function getJobById(jobId: string): Promise<Job | null> {
  const db = getDbInstance();
  const jobRef = doc(db, COLLECTIONS.JOBS, jobId);
  const jobSnap = await getDoc(jobRef);

  if (!jobSnap.exists()) {
    return null;
  }

  return {
    id: jobSnap.id,
    ...jobSnap.data(),
    postedAt: jobSnap.data().postedAt?.toDate(),
    expiresAt: jobSnap.data().expiresAt?.toDate(),
  } as Job;
}

/**
 * Get active jobs that haven't been posted to Facebook
 */
export async function getUnpostedActiveJobs(): Promise<Job[]> {
  const db = getDbInstance();

  // Get all active jobs
  const jobsQuery = query(
    collection(db, COLLECTIONS.JOBS),
    where('isActive', '==', true),
    orderBy('postedAt', 'desc'),
    limit(100)
  );

  const jobsSnapshot = await getDocs(jobsQuery);
  const jobs = jobsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    postedAt: doc.data().postedAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
  })) as Job[];

  // Get all posted job IDs
  const postedJobIds = new Set<string>();
  const postsQuery = query(
    collection(db, COLLECTIONS.FACEBOOK_POSTS),
    where('status', '==', 'posted')
  );
  const postsSnapshot = await getDocs(postsQuery);
  postsSnapshot.docs.forEach((doc) => {
    postedJobIds.add(doc.data().jobId);
  });

  // Filter out already posted jobs
  return jobs.filter((job) => !postedJobIds.has(job.id));
}
