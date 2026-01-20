import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { FieldValue } from 'firebase-admin/firestore';
import { OutreachBatch, OutreachBatchRecipient, OutreachMessageType } from '@/types';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const VALID_MESSAGE_TYPES: OutreachMessageType[] = ['short', 'standard', 'formal'];

interface BulkRecipient {
  recipientEmail: string;
  agencyName?: string;
  messageType?: OutreachMessageType;
}

/**
 * POST /api/admin/outreach/bulk
 * Creates a new outreach batch for bulk email sending
 */
export async function POST(request: NextRequest) {
  try {
    const { recipients, fileName, adminUserId, adminName, defaultMessageType } = await request.json();

    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (recipients.length > 500) {
      return NextResponse.json(
        { error: 'Maximum 500 recipients per batch' },
        { status: 400 }
      );
    }

    // Validate and prepare recipients
    const seenEmails = new Set<string>();
    const preparedRecipients: OutreachBatchRecipient[] = [];
    let skippedCount = 0;

    for (const recipient of recipients as BulkRecipient[]) {
      const email = (recipient.recipientEmail || '').trim().toLowerCase();
      const messageType = recipient.messageType || defaultMessageType || 'standard';

      // Skip invalid emails
      if (!email || !EMAIL_REGEX.test(email)) {
        skippedCount++;
        continue;
      }

      // Skip duplicates
      if (seenEmails.has(email)) {
        skippedCount++;
        continue;
      }

      // Skip invalid message types
      if (!VALID_MESSAGE_TYPES.includes(messageType as OutreachMessageType)) {
        skippedCount++;
        continue;
      }

      seenEmails.add(email);

      preparedRecipients.push({
        email,
        agencyName: (recipient.agencyName || '').trim() || undefined,
        messageType: messageType as OutreachMessageType,
        status: 'pending',
      });
    }

    if (preparedRecipients.length === 0) {
      return NextResponse.json(
        { error: 'No valid recipients found in the batch' },
        { status: 400 }
      );
    }

    // Create batch document
    const batch: Omit<OutreachBatch, 'id'> = {
      adminId: adminUserId || 'admin',
      adminName: adminName || 'Admin',
      fileName: fileName || 'upload.csv',
      totalRecipients: preparedRecipients.length,
      sentCount: 0,
      failedCount: 0,
      skippedCount: skippedCount,
      status: 'pending',
      defaultMessageType: defaultMessageType || 'standard',
      createdAt: new Date(),
      recipients: preparedRecipients,
      errors: [],
    };

    const docRef = await adminDb.collection(COLLECTIONS.OUTREACH_BATCHES).add({
      ...batch,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`[Outreach Bulk] Admin ${adminUserId} created batch ${docRef.id} with ${preparedRecipients.length} recipients`);

    return NextResponse.json({
      success: true,
      batchId: docRef.id,
      totalRecipients: preparedRecipients.length,
      skippedCount,
      message: `Batch created with ${preparedRecipients.length} recipients${skippedCount > 0 ? ` (${skippedCount} skipped)` : ''}`,
    });
  } catch (error) {
    console.error('Error creating outreach batch:', error);
    return NextResponse.json(
      {
        error: 'Failed to create outreach batch',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/outreach/bulk
 * Returns list of recent batches
 */
export async function GET() {
  try {
    const batchesSnapshot = await adminDb
      .collection(COLLECTIONS.OUTREACH_BATCHES)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const batches = batchesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
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
        completedAt: data.completedAt?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json({ batches });
  } catch (error) {
    console.error('Error fetching outreach batches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outreach batches' },
      { status: 500 }
    );
  }
}
