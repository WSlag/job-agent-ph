import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/admin/outreach/bulk/[batchId]
 * Returns the status of a specific batch
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;

    if (!batchId) {
      return NextResponse.json(
        { error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    const batchDoc = await adminDb
      .collection(COLLECTIONS.OUTREACH_BATCHES)
      .doc(batchId)
      .get();

    if (!batchDoc.exists) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    const data = batchDoc.data()!;
    const batch = {
      id: batchDoc.id,
      adminId: data.adminId,
      adminName: data.adminName,
      fileName: data.fileName,
      totalRecipients: data.totalRecipients,
      sentCount: data.sentCount,
      failedCount: data.failedCount,
      skippedCount: data.skippedCount,
      status: data.status,
      defaultMessageType: data.defaultMessageType,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      startedAt: data.startedAt?.toDate?.()?.toISOString() || null,
      completedAt: data.completedAt?.toDate?.()?.toISOString() || null,
      recipients: data.recipients || [],
      errors: data.errors || [],
    };

    return NextResponse.json({ batch });
  } catch (error) {
    console.error('Error fetching batch status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/outreach/bulk/[batchId]
 * Cancels a batch
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;

    if (!batchId) {
      return NextResponse.json(
        { error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    const batchRef = adminDb.collection(COLLECTIONS.OUTREACH_BATCHES).doc(batchId);
    const batchDoc = await batchRef.get();

    if (!batchDoc.exists) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    const data = batchDoc.data()!;

    // Only allow cancelling pending or processing batches
    if (data.status !== 'pending' && data.status !== 'processing') {
      return NextResponse.json(
        { error: 'Can only cancel pending or processing batches' },
        { status: 400 }
      );
    }

    await batchRef.update({
      status: 'cancelled',
      completedAt: FieldValue.serverTimestamp(),
    });

    console.log(`[Outreach Bulk] Batch ${batchId} cancelled`);

    return NextResponse.json({
      success: true,
      message: 'Batch cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling batch:', error);
    return NextResponse.json(
      { error: 'Failed to cancel batch' },
      { status: 500 }
    );
  }
}
