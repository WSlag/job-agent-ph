import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { emailTemplates, sendEmail } from '@/lib/email';
import { COLLECTIONS } from '@/lib/collections';
import { FieldValue } from 'firebase-admin/firestore';
import { OutreachBatchRecipient } from '@/types';

// Number of emails to process per batch
const BATCH_SIZE = 10;
// Delay between emails in milliseconds
const DELAY_BETWEEN_EMAILS = 150;

/**
 * Helper function to delay execution
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/admin/outreach/bulk/[batchId]/process
 * Processes the next batch of emails
 */
export async function POST(
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

    // Check if batch is in a processable state
    if (data.status === 'completed' || data.status === 'cancelled') {
      return NextResponse.json({
        success: true,
        message: `Batch is already ${data.status}`,
        sentCount: data.sentCount,
        failedCount: data.failedCount,
        status: data.status,
      });
    }

    // Update status to processing if pending
    if (data.status === 'pending') {
      await batchRef.update({
        status: 'processing',
        startedAt: FieldValue.serverTimestamp(),
      });
    }

    const recipients: OutreachBatchRecipient[] = data.recipients || [];

    // Find pending recipients
    const pendingIndices: number[] = [];
    recipients.forEach((recipient, index) => {
      if (recipient.status === 'pending' && pendingIndices.length < BATCH_SIZE) {
        pendingIndices.push(index);
      }
    });

    if (pendingIndices.length === 0) {
      // No more pending recipients, mark as completed
      await batchRef.update({
        status: 'completed',
        completedAt: FieldValue.serverTimestamp(),
      });

      console.log(`[Outreach Bulk] Batch ${batchId} completed: ${data.sentCount} sent, ${data.failedCount} failed`);

      return NextResponse.json({
        success: true,
        message: 'Batch completed',
        sentCount: data.sentCount,
        failedCount: data.failedCount,
        status: 'completed',
      });
    }

    // Process emails
    let sentCount = data.sentCount || 0;
    let failedCount = data.failedCount || 0;
    const errors = data.errors || [];

    for (const index of pendingIndices) {
      const recipient = recipients[index];

      try {
        // Generate email
        const outreachEmail = emailTemplates.agencyOutreach({
          agencyName: recipient.agencyName || '',
          recipientEmail: recipient.email,
          messageType: recipient.messageType,
        });

        // Send email
        const result = await sendEmail(outreachEmail);

        // Update recipient status
        recipients[index] = {
          ...recipient,
          status: 'sent',
          messageId: result.messageId,
          sentAt: new Date(),
        };

        sentCount++;

        // Also log to outreachLogs for individual tracking
        await adminDb.collection(COLLECTIONS.OUTREACH_LOGS).add({
          recipientEmail: recipient.email,
          agencyName: recipient.agencyName || null,
          messageType: recipient.messageType,
          sentBy: data.adminId,
          sentAt: FieldValue.serverTimestamp(),
          status: 'sent',
          messageId: result.messageId,
          batchId: batchId,
        });

        console.log(`[Outreach Bulk] Sent to ${recipient.email}`);
      } catch (err: any) {
        // Mark as failed
        const errorMessage = err?.message || 'Failed to send email';

        recipients[index] = {
          ...recipient,
          status: 'failed',
          error: errorMessage,
        };

        failedCount++;
        errors.push({
          email: recipient.email,
          error: errorMessage,
          timestamp: new Date(),
        });

        console.error(`[Outreach Bulk] Failed to send to ${recipient.email}:`, errorMessage);
      }

      // Delay between emails to avoid rate limiting
      if (pendingIndices.indexOf(index) < pendingIndices.length - 1) {
        await delay(DELAY_BETWEEN_EMAILS);
      }
    }

    // Check if all done
    const remainingPending = recipients.filter((r) => r.status === 'pending').length;
    const newStatus = remainingPending === 0 ? 'completed' : 'processing';

    // Update batch
    const updateData: Record<string, any> = {
      recipients,
      sentCount,
      failedCount,
      errors,
      status: newStatus,
    };

    if (newStatus === 'completed') {
      updateData.completedAt = FieldValue.serverTimestamp();
      console.log(`[Outreach Bulk] Batch ${batchId} completed: ${sentCount} sent, ${failedCount} failed`);
    }

    await batchRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: `Processed ${pendingIndices.length} emails`,
      sentCount,
      failedCount,
      remainingCount: remainingPending,
      status: newStatus,
    });
  } catch (error) {
    console.error('Error processing batch:', error);
    return NextResponse.json(
      {
        error: 'Failed to process batch',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
