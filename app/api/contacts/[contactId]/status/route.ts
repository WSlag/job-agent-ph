import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    // Verify admin authentication
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decodedClaim;
    try {
      decodedClaim = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminDoc = await adminDb.collection(COLLECTIONS.ADMINS).doc(decodedClaim.uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['new', 'in_progress', 'resolved', 'spam'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: new, in_progress, resolved, spam' },
        { status: 400 }
      );
    }

    // Get contact ID from params
    const { contactId } = await params;

    // Update contact status
    await adminDb.collection(COLLECTIONS.CONTACTS).doc(contactId).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Contact marked as ${status}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json(
      {
        error: 'Failed to update contact status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use PATCH to update status.' },
    { status: 405 }
  );
}
