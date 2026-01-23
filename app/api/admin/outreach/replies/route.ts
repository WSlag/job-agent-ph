import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/collections';

/**
 * GET endpoint to retrieve outreach replies
 * GET /api/admin/outreach/replies
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = adminDb
      .collection(COLLECTIONS.OUTREACH_REPLIES)
      .orderBy('receivedAt', 'desc')
      .limit(limit);

    if (unreadOnly) {
      query = adminDb
        .collection(COLLECTIONS.OUTREACH_REPLIES)
        .where('isRead', '==', false)
        .orderBy('receivedAt', 'desc')
        .limit(limit);
    }

    const repliesSnapshot = await query.get();

    const replies = repliesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      receivedAt: doc.data().receivedAt?.toDate?.()?.toISOString() || null,
    }));

    // Get unread count
    const unreadSnapshot = await adminDb
      .collection(COLLECTIONS.OUTREACH_REPLIES)
      .where('isRead', '==', false)
      .count()
      .get();

    const unreadCount = unreadSnapshot.data().count;

    return NextResponse.json({ replies, unreadCount });
  } catch (error) {
    console.error('Error fetching outreach replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outreach replies' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to manually import replies
 * POST /api/admin/outreach/replies
 * Body: { replies: [{ fromEmail, fromName?, subject, textContent?, htmlContent? }] }
 */
export async function POST(request: NextRequest) {
  try {
    const { replies } = await request.json();

    if (!Array.isArray(replies) || replies.length === 0) {
      return NextResponse.json(
        { error: 'replies array is required' },
        { status: 400 }
      );
    }

    const results: Array<{ fromEmail: string; success: boolean; error?: string }> = [];

    for (const reply of replies) {
      try {
        const { fromEmail, fromName, subject, textContent, htmlContent } = reply;

        if (!fromEmail) {
          results.push({ fromEmail: 'unknown', success: false, error: 'fromEmail is required' });
          continue;
        }

        // Try to match to an outreach log
        let outreachId: string | null = null;
        let agencyName: string | null = null;

        const outreachQuery = await adminDb
          .collection(COLLECTIONS.OUTREACH_LOGS)
          .where('recipientEmail', '==', fromEmail)
          .get();

        if (!outreachQuery.empty) {
          const sortedDocs = outreachQuery.docs.sort((a, b) => {
            const aTime = a.data().sentAt?.toDate?.()?.getTime() || 0;
            const bTime = b.data().sentAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
          });

          const outreachDoc = sortedDocs[0];
          outreachId = outreachDoc.id;
          agencyName = outreachDoc.data().agencyName || null;

          // Update outreach log
          await outreachDoc.ref.update({
            hasReply: true,
            lastReplyAt: FieldValue.serverTimestamp(),
          });
        }

        // Check for duplicate (same fromEmail + subject)
        const existingReply = await adminDb
          .collection(COLLECTIONS.OUTREACH_REPLIES)
          .where('fromEmail', '==', fromEmail)
          .where('subject', '==', subject || '')
          .get();

        if (!existingReply.empty) {
          results.push({ fromEmail, success: false, error: 'Reply already exists' });
          continue;
        }

        // Store the reply
        await adminDb.collection(COLLECTIONS.OUTREACH_REPLIES).add({
          fromEmail,
          fromName: fromName || fromEmail,
          toEmail: 'outreach@lekiraepri.resend.app',
          subject: subject || '',
          textContent: textContent || null,
          htmlContent: htmlContent || null,
          outreachId,
          agencyName,
          receivedAt: FieldValue.serverTimestamp(),
          isRead: false,
        });

        results.push({ fromEmail, success: true });
      } catch (err) {
        results.push({
          fromEmail: reply.fromEmail || 'unknown',
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return NextResponse.json({
      imported: successCount,
      total: replies.length,
      results,
    });
  } catch (error) {
    console.error('Error importing replies:', error);
    return NextResponse.json(
      { error: 'Failed to import replies' },
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint to mark reply as read
 * PATCH /api/admin/outreach/replies?id=replyId
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const replyId = searchParams.get('id');

    if (!replyId) {
      return NextResponse.json(
        { error: 'Reply ID is required' },
        { status: 400 }
      );
    }

    const { isRead } = await request.json();

    await adminDb
      .collection(COLLECTIONS.OUTREACH_REPLIES)
      .doc(replyId)
      .update({ isRead: isRead ?? true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json(
      { error: 'Failed to update reply' },
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint to delete a reply
 * DELETE /api/admin/outreach/replies?id=replyId
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const replyId = searchParams.get('id');

    if (!replyId) {
      return NextResponse.json(
        { error: 'Reply ID is required' },
        { status: 400 }
      );
    }

    await adminDb
      .collection(COLLECTIONS.OUTREACH_REPLIES)
      .doc(replyId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}
