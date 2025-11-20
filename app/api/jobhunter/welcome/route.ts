import { NextRequest, NextResponse } from 'next/server';
import { sendJobHunterWelcome } from '@/lib/jobhunter-welcome';
import { doc, getDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { JobHunter } from '@/types';

/**
 * API endpoint to send welcome email and message to new job hunter
 * POST /api/jobhunter/welcome
 */
export async function POST(request: NextRequest) {
  try {
    const { jobHunterId } = await request.json();

    if (!jobHunterId) {
      return NextResponse.json(
        { error: 'Job Hunter ID is required' },
        { status: 400 }
      );
    }

    // Get job hunter data from Firestore
    const db = getDbInstance();
    const jobHunterDoc = await getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, jobHunterId));

    if (!jobHunterDoc.exists()) {
      return NextResponse.json(
        { error: 'Job hunter not found' },
        { status: 404 }
      );
    }

    const jobHunterData = jobHunterDoc.data() as JobHunter;

    // Send welcome email and message
    const results = await sendJobHunterWelcome({
      jobHunterId,
      firstName: jobHunterData.firstName || 'Job Seeker',
      lastName: jobHunterData.lastName || '',
      email: jobHunterData.email,
    });

    return NextResponse.json({
      success: true,
      emailSent: results.emailSent,
      messageSent: results.messageSent,
    });
  } catch (error) {
    console.error('Error sending job hunter welcome:', error);
    return NextResponse.json(
      {
        error: 'Failed to send welcome message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
