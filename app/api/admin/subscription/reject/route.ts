import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { createAuditLog } from '@/lib/audit-helpers';

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

    // Verify user is an admin
    const adminDoc = await adminDb.collection('admins').doc(uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { paymentId, agencyId, rejectionReason } = body;

    if (!paymentId || !agencyId || !rejectionReason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the payment document
    const paymentRef = adminDb.collection('subscriptionPayments').doc(paymentId);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const paymentData = paymentDoc.data();

    if (paymentData!.status !== 'pending') {
      return NextResponse.json(
        { error: 'Payment already processed' },
        { status: 400 }
      );
    }

    // Update payment status to rejected
    await paymentRef.update({
      status: 'failed',
      rejectionReason,
      processedAt: new Date(),
      processedBy: uid,
      updatedAt: new Date(),
    });

    // Create audit log
    await createAuditLog({
      adminId: uid,
      action: 'subscription_rejected',
      resourceType: 'agency',
      resourceId: agencyId,
      resourceName: `Payment ${paymentId}`,
      details: {
        paymentId,
        amount: paymentData!.amount,
        paymentMethod: paymentData!.paymentMethod,
        rejectionReason,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment rejected',
    });
  } catch (error: any) {
    console.error('Error rejecting subscription payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject payment' },
      { status: 500 }
    );
  }
}
