import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { submitPremiumPayment } from '@/lib/subscription-helpers';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Verify user is an agency
    const userDoc = await adminDb.collection('agencies').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Only agencies can submit payment' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      agencyId,
      amount,
      paymentMethod,
      paymentReference,
      proofImageUrl,
      notes,
    } = body;

    // Validate agency ID matches authenticated user
    if (agencyId !== uid) {
      return NextResponse.json(
        { error: 'Agency ID mismatch' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!amount || !paymentMethod || !paymentReference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Submit payment for verification
    const paymentId = await submitPremiumPayment({
      agencyId,
      amount,
      paymentMethod,
      paymentReference,
      proofImageUrl,
      notes,
    });

    return NextResponse.json({
      success: true,
      paymentId,
      message: 'Payment submitted for verification',
    });
  } catch (error: any) {
    console.error('Error submitting payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit payment' },
      { status: 500 }
    );
  }
}
