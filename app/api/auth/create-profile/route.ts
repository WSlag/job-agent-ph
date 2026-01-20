import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { RateLimits } from '@/lib/rate-limit';
import { COLLECTIONS } from '@/lib/collections';

/**
 * POST /api/auth/create-profile
 * Creates user profile documents using admin privileges
 * This bypasses client-side Firestore security rules
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await RateLimits.auth(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { idToken, userType, profileData } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing idToken' },
        { status: 400 }
      );
    }

    if (!userType || !['jobhunter', 'agency'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid userType' },
        { status: 400 }
      );
    }

    if (!profileData) {
      return NextResponse.json(
        { error: 'Missing profileData' },
        { status: 400 }
      );
    }

    // Verify the ID token
    console.log('[CreateProfile API] Verifying token...');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const phoneNumber = decodedToken.phone_number;

    console.log('[CreateProfile API] Token verified for user:', userId);

    // Check if user already exists
    const existingUser = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get();
    if (existingUser.exists) {
      console.log('[CreateProfile API] User already exists:', userId);
      return NextResponse.json(
        { error: 'User profile already exists' },
        { status: 409 }
      );
    }

    // Create base user document
    const userDoc: any = {
      phone: phoneNumber,
      userType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add legal acceptance fields
    if (profileData.termsAcceptedAt) {
      userDoc.termsAcceptedAt = new Date(profileData.termsAcceptedAt);
      userDoc.termsVersion = profileData.termsVersion;
      userDoc.privacyAcceptedAt = new Date(profileData.privacyAcceptedAt);
      userDoc.privacyVersion = profileData.privacyVersion;
    }

    // Add age verification for job hunters
    if (userType === 'jobhunter' && profileData.dateOfBirth) {
      userDoc.dateOfBirth = new Date(profileData.dateOfBirth);
      userDoc.ageVerified = profileData.ageVerified;
    }

    console.log('[CreateProfile API] Creating user document...');
    await adminDb.collection(COLLECTIONS.USERS).doc(userId).set(userDoc);

    // Create profile based on user type
    if (userType === 'jobhunter') {
      const jobHunterProfile = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        location: profileData.location,
        skills: profileData.skills || [],
        experience: profileData.experience || 0,
        phone: phoneNumber,
        userType,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
        ageVerified: profileData.ageVerified || false,
        termsAcceptedAt: profileData.termsAcceptedAt ? new Date(profileData.termsAcceptedAt) : null,
        termsVersion: profileData.termsVersion,
        privacyAcceptedAt: profileData.privacyAcceptedAt ? new Date(profileData.privacyAcceptedAt) : null,
        privacyVersion: profileData.privacyVersion,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('[CreateProfile API] Creating job hunter profile...');
      await adminDb.collection(COLLECTIONS.JOB_HUNTERS).doc(userId).set(jobHunterProfile);

      // Update display name in Firebase Auth
      await adminAuth.updateUser(userId, {
        displayName: `${profileData.firstName} ${profileData.lastName}`,
      });
    } else if (userType === 'agency') {
      const agencyProfile = {
        companyName: profileData.companyName,
        registrationNumber: profileData.registrationNumber,
        contactPerson: profileData.contactPerson,
        phone: phoneNumber || profileData.phone,
        address: profileData.address,
        userType,
        verified: false,
        termsAcceptedAt: profileData.termsAcceptedAt ? new Date(profileData.termsAcceptedAt) : null,
        termsVersion: profileData.termsVersion,
        privacyAcceptedAt: profileData.privacyAcceptedAt ? new Date(profileData.privacyAcceptedAt) : null,
        privacyVersion: profileData.privacyVersion,
        agencyTermsAcceptedAt: profileData.agencyTermsAcceptedAt ? new Date(profileData.agencyTermsAcceptedAt) : null,
        agencyTermsVersion: profileData.agencyTermsVersion,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('[CreateProfile API] Creating agency profile...');
      await adminDb.collection(COLLECTIONS.AGENCIES).doc(userId).set(agencyProfile);

      // Update display name in Firebase Auth
      await adminAuth.updateUser(userId, {
        displayName: profileData.companyName,
      });
    }

    console.log('[CreateProfile API] Profile created successfully for user:', userId);

    return NextResponse.json({
      success: true,
      userId,
      userType,
    });
  } catch (error) {
    console.error('[CreateProfile API] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
