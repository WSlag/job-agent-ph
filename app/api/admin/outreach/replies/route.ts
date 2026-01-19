import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
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
