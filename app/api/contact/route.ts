import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { validateEmail, validateMessage, sanitizeString, checkRateLimit } from '@/lib/validation';

// Generate reference number for tracking
function generateReferenceNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CNT-${date}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate subject
    if (subject.trim().length < 3) {
      return NextResponse.json(
        { error: 'Subject must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate message
    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
      return NextResponse.json(
        { error: messageValidation.error || 'Invalid message' },
        { status: 400 }
      );
    }

    // Rate limiting: Check if email has submitted too many times recently
    const rateLimitKey = `contact_${email.toLowerCase()}`;
    const rateLimitCheck = checkRateLimit(rateLimitKey, 5, 60 * 60); // 5 submissions per hour

    if (!rateLimitCheck.allowed) {
      const timeUntilReset = Math.max(0, rateLimitCheck.resetAt - Date.now());
      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${Math.ceil(timeUntilReset / 60000)} minutes.`,
        },
        { status: 429 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedSubject = sanitizeString(subject, 200);
    const sanitizedMessage = messageValidation.sanitized;

    // Generate reference number
    const referenceNumber = generateReferenceNumber();

    // Get client IP for logging (optional)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Prepare contact data
    const contactData = {
      name: sanitizedName,
      email: email.toLowerCase().trim(),
      subject: sanitizedSubject,
      message: sanitizedMessage,
      referenceNumber,
      status: 'new' as const,
      ipAddress: ip,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in Firestore
    try {
      await adminDb.collection('contacts').add(contactData);
      console.log('Contact form submission stored in Firestore:', referenceNumber);

      // Return success response
      return NextResponse.json(
        {
          success: true,
          message: 'Your message has been saved successfully!',
          referenceNumber,
        },
        { status: 200 }
      );
    } catch (firestoreError) {
      console.error('Error storing in Firestore:', firestoreError);
      return NextResponse.json(
        {
          error: 'Failed to save your message. Please try again or contact us directly at contact@jobagentph.com',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
