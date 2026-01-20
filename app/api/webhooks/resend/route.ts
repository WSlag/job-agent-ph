import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/collections';
import crypto from 'crypto';

/**
 * Webhook endpoint to receive incoming emails from Resend
 * POST /api/webhooks/resend
 *
 * Setup in Resend Dashboard:
 * 1. Go to https://resend.com/webhooks
 * 2. Add webhook URL: https://www.jobagentph.com/api/webhooks/resend
 * 3. Select events: email.received (for inbound emails)
 * 4. Copy the signing secret and add to .env.local as RESEND_WEBHOOK_SECRET
 */

// Verify webhook signature from Resend
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('resend-signature');
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Verify signature in production
    if (webhookSecret && process.env.NODE_ENV === 'production') {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { type, data } = payload;

    console.log('Resend webhook received:', type);

    // Handle different webhook event types
    switch (type) {
      case 'email.received':
        // Inbound email received
        await handleInboundEmail(data);
        break;

      case 'email.delivered':
        // Update outreach log with delivered status
        await updateOutreachStatus(data, 'delivered');
        break;

      case 'email.opened':
        // Update outreach log with opened status
        await updateOutreachStatus(data, 'opened');
        break;

      case 'email.clicked':
        // Update outreach log with clicked status
        await updateOutreachStatus(data, 'clicked');
        break;

      case 'email.bounced':
        // Update outreach log with bounced status
        await updateOutreachStatus(data, 'bounced');
        break;

      case 'email.complained':
        // Update outreach log with complained status
        await updateOutreachStatus(data, 'complained');
        break;

      default:
        console.log('Unhandled webhook event type:', type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle inbound email (reply from agency)
 *
 * Resend email.received webhook payload structure:
 * - from: string (e.g., "Name <email@example.com>")
 * - to: string[] (array of recipient emails)
 * - subject: string
 * - text?: string (plain text body - may not be present)
 * - html?: string (HTML body - may not be present)
 */
async function handleInboundEmail(data: Record<string, unknown>) {
  try {
    // Log the full payload for debugging
    console.log('Inbound email data:', JSON.stringify(data, null, 2));

    // Extract fields with proper type handling
    const from = typeof data.from === 'string' ? data.from : '';
    const to = Array.isArray(data.to) ? data.to[0] : (typeof data.to === 'string' ? data.to : '');
    const subject = typeof data.subject === 'string' ? data.subject : '';
    const text = typeof data.text === 'string' ? data.text : null;
    const html = typeof data.html === 'string' ? data.html : null;

    // Extract email address from "Name <email@example.com>" format
    const fromEmail = from.match(/<(.+)>/)?.[1] || from;

    // Validate we have at least the from email
    if (!fromEmail) {
      console.log('No sender email found in inbound email, skipping');
      return;
    }

    let outreachId: string | null = null;
    let agencyName: string | null = null;

    // First, try to find outreach by sender email
    let outreachQuery = await adminDb
      .collection(COLLECTIONS.OUTREACH_LOGS)
      .where('recipientEmail', '==', fromEmail)
      .orderBy('sentAt', 'desc')
      .limit(1)
      .get();

    // If not found by email, try to match by subject (for "Re:" replies)
    if (outreachQuery.empty && subject) {
      // Remove "Re:", "RE:", "Fwd:", etc. prefixes and trim
      const cleanSubject = subject.replace(/^(Re:|RE:|Fwd:|FWD:|Fw:|FW:)\s*/gi, '').trim();

      // Search for outreach with matching subject patterns
      // The outreach subjects are:
      // - "Post Jobs FREE on JobAgentPH - Reach Thousands of Filipino Workers" (short)
      // - "Partner with JobAgentPH — Reach Thousands of Filipino Job Seekers" (standard)
      // - "Partnership Invitation — JobAgentPH Recruitment Platform" (formal)

      const subjectPatterns = [
        'Post Jobs FREE on JobAgentPH',
        'Partner with JobAgentPH',
        'Partnership Invitation'
      ];

      const matchesOutreachSubject = subjectPatterns.some(pattern =>
        cleanSubject.toLowerCase().includes(pattern.toLowerCase())
      );

      if (matchesOutreachSubject) {
        // Get recent outreach logs and find one that this could be a reply to
        const recentOutreach = await adminDb
          .collection(COLLECTIONS.OUTREACH_LOGS)
          .orderBy('sentAt', 'desc')
          .limit(50)
          .get();

        // Try to find a match by checking if this sender could have received an outreach
        for (const doc of recentOutreach.docs) {
          const data = doc.data();
          // Check if the fromEmail domain matches or is similar
          const senderDomain = fromEmail.split('@')[1];
          const recipientDomain = data.recipientEmail?.split('@')[1];

          if (senderDomain && recipientDomain && senderDomain === recipientDomain) {
            outreachQuery = { empty: false, docs: [doc] } as typeof outreachQuery;
            break;
          }
        }
      }
    }

    if (!outreachQuery.empty) {
      const outreachDoc = outreachQuery.docs[0];
      outreachId = outreachDoc.id;
      agencyName = outreachDoc.data().agencyName || null;

      // Update the outreach log to mark as replied
      await outreachDoc.ref.update({
        hasReply: true,
        lastReplyAt: FieldValue.serverTimestamp(),
      });
    }

    // Store the reply
    const replyData = {
      fromEmail,
      fromName: from.match(/^([^<]+)/)?.[1]?.trim() || fromEmail,
      toEmail: to,
      subject,
      textContent: text || null,
      htmlContent: html || null,
      outreachId,
      agencyName,
      receivedAt: FieldValue.serverTimestamp(),
      isRead: false,
    };

    await adminDb.collection(COLLECTIONS.OUTREACH_REPLIES).add(replyData);

    console.log(`Reply received from ${fromEmail}, linked to outreach: ${outreachId}`);
  } catch (error) {
    console.error('Error handling inbound email:', error);
    throw error;
  }
}

/**
 * Update outreach log status based on email events
 */
async function updateOutreachStatus(
  data: { email_id?: string; to?: string },
  status: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
) {
  try {
    const recipientEmail = data.to;
    if (!recipientEmail) return;

    // Find the most recent outreach to this email
    const outreachQuery = await adminDb
      .collection(COLLECTIONS.OUTREACH_LOGS)
      .where('recipientEmail', '==', recipientEmail)
      .orderBy('sentAt', 'desc')
      .limit(1)
      .get();

    if (!outreachQuery.empty) {
      const outreachDoc = outreachQuery.docs[0];
      const updateData: Record<string, unknown> = {
        [`events.${status}`]: true,
        [`events.${status}At`]: FieldValue.serverTimestamp(),
      };

      // Update the main status field based on priority
      const currentData = outreachDoc.data();
      const statusPriority = ['sent', 'delivered', 'opened', 'clicked'];
      const currentIndex = statusPriority.indexOf(currentData.emailStatus || 'sent');
      const newIndex = statusPriority.indexOf(status);

      if (newIndex > currentIndex || status === 'bounced' || status === 'complained') {
        updateData.emailStatus = status;
      }

      await outreachDoc.ref.update(updateData);
      console.log(`Updated outreach to ${recipientEmail} with status: ${status}`);
    }
  } catch (error) {
    console.error('Error updating outreach status:', error);
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({
    status: 'Resend webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}
