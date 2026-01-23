import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/collections';
import { sendEmail } from '@/lib/email';

const EMAIL_FROM = process.env.EMAIL_FROM || 'contact@jobagentph.com';
const RESEND_INBOUND_EMAIL = process.env.RESEND_INBOUND_EMAIL;

function buildReplyHtml(message: string): string {
  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  return `<div style="font-family: sans-serif; max-width: 600px;">
  <p>${escapedMessage}</p>
  <br>
  <p style="color: #666; font-size: 14px;">
    Best regards,<br>
    JobAgentPH Team<br>
    <a href="https://www.jobagentph.com" style="color: #2563eb;">www.jobagentph.com</a>
  </p>
</div>`;
}

/**
 * POST /api/admin/outreach/replies/send
 * Sends a reply email to an agency and logs it.
 */
export async function POST(request: NextRequest) {
  try {
    const { toEmail, toName, subject, message, replyId } = await request.json();

    if (!toEmail || !message) {
      return NextResponse.json(
        { error: 'toEmail and message are required' },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: 'subject is required' },
        { status: 400 }
      );
    }

    const html = buildReplyHtml(message);

    const result = await sendEmail({
      from: EMAIL_FROM,
      to: toEmail,
      subject,
      html,
      text: message + '\n\nBest regards,\nJobAgentPH Team\nwww.jobagentph.com',
      replyTo: RESEND_INBOUND_EMAIL || EMAIL_FROM,
    });

    // Log the sent reply
    await adminDb.collection(COLLECTIONS.OUTREACH_SENT_REPLIES).add({
      toEmail,
      toName: toName || null,
      subject,
      message,
      replyId: replyId || null,
      messageId: result.messageId || null,
      sentAt: FieldValue.serverTimestamp(),
    });

    // Update the original reply doc with repliedAt timestamp
    if (replyId) {
      await adminDb
        .collection(COLLECTIONS.OUTREACH_REPLIES)
        .doc(replyId)
        .update({ repliedAt: FieldValue.serverTimestamp() });
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
