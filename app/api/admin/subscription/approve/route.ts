import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { createPremiumSubscription } from '@/lib/subscription-helpers';
import { logAdminAction } from '@/lib/audit-helpers';

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

    const adminData = adminDoc.data();
    const adminName = adminData?.name || adminData?.email || 'Admin';

    // Parse request body
    const body = await request.json();
    const { paymentId, agencyId, notes } = body;

    if (!paymentId || !agencyId) {
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

    // Create premium subscription
    const subscription = await createPremiumSubscription(agencyId, {
      paymentAmount: paymentData!.amount,
      paymentReference: paymentData!.paymentReference,
      paymentMethod: paymentData!.paymentMethod,
      adminId: uid,
      notes: notes || paymentData!.notes,
    });

    // Update payment status
    await paymentRef.update({
      status: 'completed',
      processedAt: new Date(),
      processedBy: uid,
      updatedAt: new Date(),
    });

    // Create audit log
    await logAdminAction({
      adminId: uid,
      adminName,
      action: 'subscription_approved',
      resourceType: 'agency',
      resourceId: agencyId,
      details: {
        paymentId,
        amount: paymentData!.amount,
        paymentMethod: paymentData!.paymentMethod,
        subscriptionEndDate: subscription.endDate,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Premium subscription activated',
    });
  } catch (error: any) {
    console.error('Error approving subscription payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve payment' },
      { status: 500 }
    );
  }
}
