import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { emailTemplates, sendEmail } from '@/lib/email';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/collections';

/**
 * API endpoint to send a reply to a contact form submission
 * POST /api/contacts/[contactId]/reply
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const { contactId } = await params;
    const { message, adminUserId } = await request.json();

    // Validation
    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Get contact details from Firestore
    const contactRef = adminDb.collection(COLLECTIONS.CONTACTS).doc(contactId);
    const contactDoc = await contactRef.get();

    if (!contactDoc.exists) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const contactData = contactDoc.data();
    if (!contactData) {
      return NextResponse.json(
        { error: 'Contact data is invalid' },
        { status: 500 }
      );
    }

    // Prepare reply data
    const replyId = `reply_${Date.now()}`;
    const reply = {
      id: replyId,
      message: message.trim(),
      sentBy: adminUserId || 'admin',
      sentAt: new Date().toISOString(),
      status: 'sent' as 'sent' | 'failed',
    };

    // Send email using Resend
    try {
      const replyEmail = emailTemplates.contactReply({
        recipientName: contactData.name || 'there',
        recipientEmail: contactData.email,
        replyMessage: message.trim(),
        originalSubject: contactData.subject || 'Your inquiry',
        referenceNumber: contactData.referenceNumber || contactId,
      });

      await sendEmail(replyEmail);
      console.log(`Reply email sent successfully to ${contactData.email} for contact ${contactId}`);
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      reply.status = 'failed';

      // Update contact with failed reply
      await contactRef.update({
        replies: FieldValue.arrayUnion(reply),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        {
          error: 'Failed to send email',
          details: emailError instanceof Error ? emailError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Update contact document with reply
    await contactRef.update({
      replies: FieldValue.arrayUnion(reply),
      status: 'resolved', // Mark as resolved after replying
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      reply,
      message: 'Reply sent successfully',
    });

  } catch (error) {
    console.error('Error sending contact reply:', error);
    return NextResponse.json(
      {
        error: 'Failed to send reply',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
