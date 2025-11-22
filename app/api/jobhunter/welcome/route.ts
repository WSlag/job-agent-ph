import { NextRequest, NextResponse } from 'next/server';
import { sendJobHunterWelcome } from '@/lib/jobhunter-welcome';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { RateLimits } from '@/lib/rate-limit';
import { JobHunter } from '@/types';

/**
 * SECURE: API endpoint to send welcome email and message to new job hunter
 * POST /api/jobhunter/welcome
 *
 * Security:
 * - Requires authenticated session
 * - Users can only trigger welcome for themselves
 * - Rate limited to prevent abuse
 * - Idempotent (won't send duplicates)
 */
export async function POST(request: NextRequest) {
  // 1. Rate limiting (prevent abuse)
  const rateLimitResponse = await RateLimits.auth(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 2. Verify user is authenticated
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 3. Verify and decode session
    let decodedClaim;
    try {
      decodedClaim = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // 4. Get jobHunterId from request
    const { jobHunterId } = await request.json();

    if (!jobHunterId) {
      return NextResponse.json(
        { error: 'Job Hunter ID is required' },
        { status: 400 }
      );
    }

    // 5. Verify ownership (user can only trigger welcome for themselves)
    if (decodedClaim.uid !== jobHunterId) {
      console.warn(`[Security] User ${decodedClaim.uid} attempted to trigger welcome for ${jobHunterId}`);
      return NextResponse.json(
        { error: 'You can only request welcome message for yourself' },
        { status: 403 }
      );
    }

    // 6. Check if welcome already sent (idempotency)
    const conversationId = `welcome_${jobHunterId}`;
    const existingConversation = await adminDb
      .collection(COLLECTIONS.CONVERSATIONS)
      .doc(conversationId)
      .get();

    if (existingConversation.exists) {
      console.log(`[Welcome] Message already sent to job hunter ${jobHunterId}`);
      return NextResponse.json({
        success: true,
        message: 'Welcome message already sent',
        alreadySent: true,
        emailSent: true,
        messageSent: true,
      });
    }

    // 7. Get job hunter data using Admin SDK
    const jobHunterDoc = await adminDb
      .collection(COLLECTIONS.JOB_HUNTERS)
      .doc(jobHunterId)
      .get();

    if (!jobHunterDoc.exists) {
      return NextResponse.json(
        { error: 'Job hunter profile not found' },
        { status: 404 }
      );
    }

    const jobHunterData = jobHunterDoc.data() as JobHunter;

    // 8. Send welcome email and message using Admin SDK
    const results = await sendJobHunterWelcome({
      jobHunterId,
      firstName: jobHunterData.firstName || 'Job Seeker',
      lastName: jobHunterData.lastName || '',
      email: jobHunterData.email,
    });

    // 9. Log success
    console.log(`[Welcome] Sent to job hunter ${jobHunterId} (${jobHunterData.email})`);

    return NextResponse.json({
      success: true,
      emailSent: results.emailSent,
      messageSent: results.messageSent,
    });

  } catch (error) {
    console.error('[Welcome] Error sending job hunter welcome:', error);
    return NextResponse.json(
      {
        error: 'Failed to send welcome message',
        details: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : 'Unknown error')
          : 'Please try again later'
      },
      { status: 500 }
    );
  }
}
