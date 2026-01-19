import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { emailTemplates, sendEmail } from '@/lib/email';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/collections';

/**
 * API endpoint to send outreach emails to recruitment agencies
 * POST /api/admin/outreach
 */
export async function POST(request: NextRequest) {
  try {
    const {
      recipientEmail,
      agencyName,
      messageType,
      adminUserId
    } = await request.json();

    // Validation
    if (!recipientEmail || !recipientEmail.trim()) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!messageType || !['short', 'standard', 'formal'].includes(messageType)) {
      return NextResponse.json(
        { error: 'Valid message type is required (short, standard, or formal)' },
        { status: 400 }
      );
    }

    // Generate outreach email
    const outreachEmail = emailTemplates.agencyOutreach({
      agencyName: agencyName?.trim() || '',
      recipientEmail: recipientEmail.trim(),
      messageType: messageType as 'short' | 'standard' | 'formal',
    });

    // Send email
    const result = await sendEmail(outreachEmail);

    // Log the outreach in Firestore for tracking
    const outreachLog = {
      recipientEmail: recipientEmail.trim(),
      agencyName: agencyName?.trim() || null,
      messageType,
      sentBy: adminUserId || 'admin',
      sentAt: FieldValue.serverTimestamp(),
      status: 'sent',
      messageId: result.messageId,
    };

    await adminDb.collection(COLLECTIONS.OUTREACH_LOGS || 'outreach_logs').add(outreachLog);

    console.log(`Outreach email sent successfully to ${recipientEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Outreach email sent successfully',
      messageId: result.messageId,
    });

  } catch (error) {
    console.error('Error sending outreach email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send outreach email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve outreach logs
 * GET /api/admin/outreach
 */
export async function GET() {
  try {
    const logsSnapshot = await adminDb
      .collection(COLLECTIONS.OUTREACH_LOGS || 'outreach_logs')
      .orderBy('sentAt', 'desc')
      .limit(100)
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      sentAt: doc.data().sentAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching outreach logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outreach logs' },
      { status: 500 }
    );
  }
}
