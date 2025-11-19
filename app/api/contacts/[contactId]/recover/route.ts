import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
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

    // Get contact ID from params
    const { contactId } = await params;

    // Get contact document
    const contactDoc = await adminDb.collection(COLLECTIONS.CONTACTS).doc(contactId).get();
    if (!contactDoc.exists) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const contact = contactDoc.data();
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact data is invalid' },
        { status: 400 }
      );
    }

    // Check if contact has a userId (authenticated user)
    if (!contact.userId) {
      return NextResponse.json(
        { error: 'Contact is not from an authenticated user. Use convert API for guest users.' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    if (contact.conversationId) {
      return NextResponse.json(
        { error: 'Conversation already linked to this contact' },
        { status: 400 }
      );
    }

    // Check if a conversation already exists for this user
    const existingConvQuery = await adminDb
      .collection(COLLECTIONS.ADMIN_CONVERSATIONS)
      .where('userId', '==', contact.userId)
      .where('contactRef', '==', contactId)
      .limit(1)
      .get();

    let conversationId: string;

    if (!existingConvQuery.empty) {
      // Conversation exists, just link it
      conversationId = existingConvQuery.docs[0].id;
      console.log('Found existing conversation:', conversationId);
    } else {
      // Create new conversation for authenticated user
      const conversationData = {
        adminId: decodedClaim.uid,
        userId: contact.userId,
        userType: contact.userType === 'guest' ? 'jobhunter' : contact.userType,
        contactRef: contactId,
        referenceNumber: contact.referenceNumber,
        lastMessage: {
          id: '',
          content: `[Contact Form: ${contact.subject}] ${contact.message.substring(0, 100)}...`,
          senderId: contact.userId,
          senderType: 'user',
          createdAt: FieldValue.serverTimestamp(),
          read: false,
        },
        unreadCount: 0,
        unreadCount_admin: 1,
        unreadCount_user: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const conversationRef = await adminDb.collection(COLLECTIONS.ADMIN_CONVERSATIONS).add(conversationData);
      conversationId = conversationRef.id;

      // Add the first message to the conversation
      const messageData = {
        content: `Subject: ${contact.subject}\n\n${contact.message}\n\nReference: ${contact.referenceNumber}`,
        senderId: contact.userId,
        senderType: 'user',
        createdAt: FieldValue.serverTimestamp(),
        timestamp: FieldValue.serverTimestamp(),
        read: false,
        metadata: {
          isContactForm: true,
          referenceNumber: contact.referenceNumber,
          contactId: contactId,
        },
      };

      const messageRef = await adminDb
        .collection(COLLECTIONS.ADMIN_CONVERSATIONS)
        .doc(conversationId)
        .collection('messages')
        .add(messageData);

      // Update conversation with message ID
      await conversationRef.update({
        'lastMessage.id': messageRef.id,
      });

      console.log('Created new conversation:', conversationId);
    }

    // Update contact with conversation ID
    await adminDb.collection(COLLECTIONS.CONTACTS).doc(contactId).update({
      conversationId,
      status: contact.status === 'new' ? 'in_progress' : contact.status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        conversationId,
        message: 'Conversation recovered successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recovering conversation:', error);
    return NextResponse.json(
      {
        error: 'Failed to recover conversation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
