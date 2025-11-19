import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { validateEmail, validateMessage, sanitizeString, checkRateLimit } from '@/lib/validation';
import { COLLECTIONS } from '@/lib/collections';
import { FieldValue } from 'firebase-admin/firestore';

// Generate reference number for tracking
function generateReferenceNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CNT-${date}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    let currentUser = null;
    let userType = null;
    const sessionCookie = request.cookies.get('session')?.value;

    if (sessionCookie) {
      try {
        const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie, true);
        currentUser = decodedClaim;

        // Get user type from database
        const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(decodedClaim.uid).get();
        if (userDoc.exists) {
          userType = userDoc.data()?.role || null;
        }
      } catch (error) {
        // Session invalid, continue as unauthenticated
        console.log('Session verification failed, proceeding as unauthenticated');
      }
    }

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
      userId: currentUser?.uid || null,
      userType: userType || 'guest',
      ipAddress: ip,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in Firestore
    try {
      // Save contact form submission
      const contactRef = await adminDb.collection(COLLECTIONS.CONTACTS).add(contactData);
      console.log('Contact form submission stored in Firestore:', referenceNumber);

      // If user is authenticated, create an admin conversation
      if (currentUser) {
        try {
          // Get all admin users
          const adminsSnapshot = await adminDb.collection(COLLECTIONS.USERS)
            .where('role', '==', 'admin')
            .limit(1)
            .get();

          if (!adminsSnapshot.empty) {
            const adminId = adminsSnapshot.docs[0].id;

            // Create admin conversation
            const conversationData = {
              adminId,
              userId: currentUser.uid,
              userType: userType || 'jobhunter',
              contactRef: contactRef.id,
              referenceNumber,
              lastMessage: {
                id: '',
                content: `[Contact Form: ${sanitizedSubject}] ${sanitizedMessage.substring(0, 100)}...`,
                senderId: currentUser.uid,
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

            // Add the first message to the conversation
            const messageData = {
              content: `Subject: ${sanitizedSubject}\n\n${sanitizedMessage}\n\nReference: ${referenceNumber}`,
              senderId: currentUser.uid,
              senderType: 'user',
              createdAt: FieldValue.serverTimestamp(),
              read: false,
              metadata: {
                isContactForm: true,
                referenceNumber,
                contactId: contactRef.id,
              },
            };

            const messageRef = await adminDb
              .collection(COLLECTIONS.ADMIN_CONVERSATIONS)
              .doc(conversationRef.id)
              .collection('messages')
              .add(messageData);

            // Update lastMessage with message ID
            await conversationRef.update({
              'lastMessage.id': messageRef.id,
            });

            // Create notification for admin
            await adminDb.collection(COLLECTIONS.NOTIFICATIONS).add({
              userId: adminId,
              type: 'contact_form',
              title: 'New Contact Form Submission',
              message: `${sanitizedName} submitted a contact form: ${sanitizedSubject}`,
              referenceNumber,
              conversationId: conversationRef.id,
              read: false,
              createdAt: FieldValue.serverTimestamp(),
            });

            console.log('Admin conversation created for authenticated user:', currentUser.uid);
          }
        } catch (conversationError) {
          // Log error but don't fail the contact submission
          console.error('Error creating admin conversation:', conversationError);
        }
      }

      // Return success response
      return NextResponse.json(
        {
          success: true,
          message: currentUser
            ? 'Your message has been sent to our admin team. You can track the conversation in your messages.'
            : 'Your message has been saved successfully!',
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
