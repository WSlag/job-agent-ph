import { NextRequest, NextResponse } from 'next/server';
import { sendAgencyWelcome } from '@/lib/agency-welcome';
import { doc, getDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Agency } from '@/types';

/**
 * API endpoint to send welcome email and message to new agency
 * POST /api/agency/welcome
 */
export async function POST(request: NextRequest) {
  try {
    const { agencyId } = await request.json();

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      );
    }

    // Get agency data from Firestore
    const db = getDbInstance();
    const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, agencyId));

    if (!agencyDoc.exists()) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    const agencyData = agencyDoc.data() as Agency;

    // Send welcome email and message
    const results = await sendAgencyWelcome({
      agencyId,
      companyName: agencyData.companyName || 'Your Agency',
      email: agencyData.email,
      contactPerson: agencyData.contactPerson || agencyData.companyName || 'Recruiter',
    });

    return NextResponse.json({
      success: true,
      emailSent: results.emailSent,
      messageSent: results.messageSent,
    });
  } catch (error) {
    console.error('Error sending agency welcome:', error);
    return NextResponse.json(
      {
        error: 'Failed to send welcome message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
