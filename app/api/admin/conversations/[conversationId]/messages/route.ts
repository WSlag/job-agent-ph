import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
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
    const { content, adminId, adminName } = body;

    if (!content || !adminId) {
      return NextResponse.json(
        { error: 'Content and adminId are required' },
        { status: 400 }
      );
    }

    // Get conversation ID from params
    const { conversationId } = await params;

    // Verify conversation exists and belongs to this admin
    const conversationDoc = await adminDb.collection(COLLECTIONS.ADMIN_CONVERSATIONS).doc(conversationId).get();
    if (!conversationDoc.exists) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const conversationData = conversationDoc.data();
    if (conversationData?.adminId !== decodedClaim.uid) {
      return NextResponse.json(
        { error: 'Unauthorized to access this conversation' },
        { status: 403 }
      );
    }

    // Create the message
    const messageData = {
      conversationId,
      senderId: adminId,
      senderType: 'admin',
      content,
      timestamp: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      read: false,
    };

    const messageRef = await adminDb
      .collection(COLLECTIONS.ADMIN_CONVERSATIONS)
      .doc(conversationId)
      .collection('messages')
      .add(messageData);

    // Update conversation with last message and increment unread count for user
    const lastMessageData = {
      id: messageRef.id,
      content,
      senderId: adminId,
      senderType: 'admin',
      createdAt: FieldValue.serverTimestamp(),
      read: false,
    };

    await adminDb.collection(COLLECTIONS.ADMIN_CONVERSATIONS).doc(conversationId).update({
      lastMessage: lastMessageData,
      unreadCount_user: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        messageId: messageRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
