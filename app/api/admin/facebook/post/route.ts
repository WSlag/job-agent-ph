import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/collections';

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.jobagentph.com';

interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  country: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceRequired: number;
  category: string;
  isActive: boolean;
}

/**
 * Format a job posting for Facebook
 */
function formatJobForFacebook(job: Job, customMessage?: string): string {
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
    `[HIRING] ${job.title}`,
    '',
    `${job.companyName} is looking for ${job.title}!`,
  ];

  if (customMessage) {
    lines.push('', customMessage);
  }

  lines.push(
    '',
    `Location: ${job.location}, ${job.country}`,
  );

  if (salaryText) {
    lines.push(`Salary: ${salaryText}`);
  }

  lines.push(`Type: ${jobTypeDisplay}`);

  if (job.experienceRequired > 0) {
    lines.push(`Experience: ${job.experienceRequired}+ years`);
  }

  lines.push(
    '',
    'Apply now on JobAgentPH:',
    jobUrl,
    '',
    `#JobAgentPH #HiringNow #${countryTag}Jobs #${categoryTag}`,
  );

  return lines.join('\n');
}

/**
 * POST /api/admin/facebook/post
 * Post a job to Facebook Page
 */
export async function POST(request: NextRequest) {
  try {
    const { jobId, customMessage, adminId, adminName } = await request.json();

    // Validation
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    if (!adminId || !adminName) {
      return NextResponse.json(
        { error: 'Admin credentials required' },
        { status: 400 }
      );
    }

    // Check Facebook credentials
    if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN environment variables.' },
        { status: 500 }
      );
    }

    // Fetch the job
    const jobDoc = await adminDb.collection(COLLECTIONS.JOBS).doc(jobId).get();

    if (!jobDoc.exists) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const jobData = jobDoc.data() as Omit<Job, 'id'>;
    const job: Job = { id: jobDoc.id, ...jobData };

    // Check if job is active
    if (!job.isActive) {
      return NextResponse.json(
        { error: 'Cannot post inactive job to Facebook' },
        { status: 400 }
      );
    }

    // Format the post content
    const postContent = formatJobForFacebook(job, customMessage);
    const jobUrl = `${SITE_URL}/jobs/${job.id}`;

    // Post to Facebook
    const fbUrl = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`;

    const fbResponse = await fetch(fbUrl, {
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

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('Facebook API error:', fbData);

      // Log failed attempt
      await adminDb.collection(COLLECTIONS.FACEBOOK_POSTS).add({
        jobId: job.id,
        jobTitle: job.title,
        postContent,
        postedBy: adminId,
        postedByName: adminName,
        status: 'failed',
        error: fbData.error?.message || 'Failed to post to Facebook',
        createdAt: FieldValue.serverTimestamp(),
      });

      // Log audit action for failure
      await adminDb.collection(COLLECTIONS.AUDIT_LOGS).add({
        adminId,
        adminName,
        action: 'facebook_post_failed',
        resourceType: 'job',
        resourceId: job.id,
        details: {
          jobTitle: job.title,
          error: fbData.error?.message,
        },
        timestamp: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        { error: fbData.error?.message || 'Failed to post to Facebook' },
        { status: 500 }
      );
    }

    // Success - save record
    const postRecord = await adminDb.collection(COLLECTIONS.FACEBOOK_POSTS).add({
      jobId: job.id,
      jobTitle: job.title,
      facebookPostId: fbData.id,
      postContent,
      postedBy: adminId,
      postedByName: adminName,
      status: 'posted',
      postedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });

    // Log audit action for success
    await adminDb.collection(COLLECTIONS.AUDIT_LOGS).add({
      adminId,
      adminName,
      action: 'facebook_post_created',
      resourceType: 'job',
      resourceId: job.id,
      details: {
        jobTitle: job.title,
        facebookPostId: fbData.id,
        postRecordId: postRecord.id,
      },
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log(`Job "${job.title}" posted to Facebook successfully. Post ID: ${fbData.id}`);

    return NextResponse.json({
      success: true,
      message: 'Job posted to Facebook successfully',
      facebookPostId: fbData.id,
      postRecordId: postRecord.id,
    });

  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return NextResponse.json(
      {
        error: 'Failed to post to Facebook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/facebook/post
 * Get Facebook post history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const queryLimit = limitParam ? parseInt(limitParam, 10) : 50;

    let query = adminDb
      .collection(COLLECTIONS.FACEBOOK_POSTS)
      .orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.limit(queryLimit).get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postedAt: doc.data().postedAt?.toDate?.()?.toISOString() || null,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Facebook posts' },
      { status: 500 }
    );
  }
}
