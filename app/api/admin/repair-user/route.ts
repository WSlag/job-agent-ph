import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { hasPermission } from '@/lib/permission-helpers';
import { Admin, Permission } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, userType, profileData = {} } = body;

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'userId and userType are required' },
        { status: 400 }
      );
    }

    if (!['jobhunter', 'agency', 'admin'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid userType. Must be: jobhunter, agency, or admin' },
        { status: 400 }
      );
    }

    // Verify admin authentication
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify session and get admin user
    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get admin profile
    const adminDoc = await adminDb
      .collection(COLLECTIONS.ADMINS)
      .doc(decodedClaims.uid)
      .get();

    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 403 }
      );
    }

    const admin = { id: adminDoc.id, ...adminDoc.data() } as Admin;

    // Check permission
    if (!hasPermission(admin, Permission.MANAGE_USERS)) {
      return NextResponse.json(
        { error: 'Unauthorized: MANAGE_USERS permission required' },
        { status: 403 }
      );
    }

    // Step 1: Verify user exists in Firebase Auth
    let authUser;
    try {
      authUser = await adminAuth.getUser(userId);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'User not found in Firebase Authentication' },
          { status: 404 }
        );
      }
      throw error;
    }

    const email = authUser.email || '';
    const now = new Date();
    const createdDocuments: string[] = [];
    const skippedDocuments: string[] = [];

    // Step 2: Create or check base users document
    const usersDocRef = adminDb.collection(COLLECTIONS.USERS).doc(userId);
    const usersDoc = await usersDocRef.get();

    if (usersDoc.exists) {
      skippedDocuments.push('users (already exists)');
    } else {
      const baseUserData: any = {
        email,
        userType,
        createdAt: now,
        updatedAt: now,
      };

      // Add optional fields if provided
      if (profileData.termsAcceptedAt) {
        baseUserData.termsAcceptedAt = profileData.termsAcceptedAt;
        baseUserData.termsVersion = profileData.termsVersion || '1.0';
      }
      if (profileData.privacyAcceptedAt) {
        baseUserData.privacyAcceptedAt = profileData.privacyAcceptedAt;
        baseUserData.privacyVersion = profileData.privacyVersion || '1.0';
      }

      await usersDocRef.set(baseUserData);
      createdDocuments.push('users');
    }

    // Step 3: Create role-specific document
    let roleCollection: string;
    let roleDocData: any;

    if (userType === 'jobhunter') {
      roleCollection = COLLECTIONS.JOB_HUNTERS;

      // Check if already exists
      const existingDoc = await adminDb.collection(roleCollection).doc(userId).get();
      if (existingDoc.exists) {
        skippedDocuments.push('jobHunters (already exists)');
      } else {
        roleDocData = {
          email,
          userType,
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          bio: profileData.bio || '',
          skills: profileData.skills || [],
          experience: profileData.experience || [],
          education: profileData.education || [],
          certifications: profileData.certifications || [],
          resume: profileData.resume || null,
          profilePicture: profileData.profilePicture || null,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };

        if (profileData.dateOfBirth) {
          roleDocData.dateOfBirth = profileData.dateOfBirth;
          roleDocData.ageVerified = profileData.ageVerified || false;
        }

        await adminDb.collection(roleCollection).doc(userId).set(roleDocData);
        createdDocuments.push('jobHunters');
      }
    } else if (userType === 'agency') {
      roleCollection = COLLECTIONS.AGENCIES;

      // Check if already exists
      const existingDoc = await adminDb.collection(roleCollection).doc(userId).get();
      if (existingDoc.exists) {
        skippedDocuments.push('agencies (already exists)');
      } else {
        // Extract company name from email or use provided data
        const companyName = profileData.companyName ||
          email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim();

        roleDocData = {
          email,
          userType,
          companyName,
          contactPerson: profileData.contactPerson || '',
          description: profileData.description || '',
          website: profileData.website || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          logoUrl: profileData.logoUrl || null,
          verified: false,
          isVerified: false,
          verificationStatus: 'unverified',
          certifications: profileData.certifications || [],
          ratings: [],
          averageRating: 0,
          totalRatings: 0,
          jobsPosted: [],
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };

        await adminDb.collection(roleCollection).doc(userId).set(roleDocData);
        createdDocuments.push('agencies');
      }
    } else if (userType === 'admin') {
      roleCollection = COLLECTIONS.ADMINS;

      // Check if already exists
      const existingDoc = await adminDb.collection(roleCollection).doc(userId).get();
      if (existingDoc.exists) {
        skippedDocuments.push('admins (already exists)');
      } else {
        roleDocData = {
          email,
          userType,
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          role: profileData.role || 'moderator',
          permissions: profileData.permissions || [],
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };

        await adminDb.collection(roleCollection).doc(userId).set(roleDocData);
        createdDocuments.push('admins');
      }
    }

    // Step 4: Create audit log (using Admin SDK)
    try {
      await adminDb.collection(COLLECTIONS.AUDIT_LOGS).add({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'user_repaired',
        resourceType: 'user',
        resourceId: userId,
        details: {
          userType,
          createdDocuments,
          skippedDocuments,
          email,
        },
        timestamp: now,
        ipAddress: null,
        userAgent: null,
      });
    } catch (auditError) {
      console.error('[Repair User] Audit log failed:', auditError);
      // Don't fail the repair if audit logging fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'User repaired successfully',
      userId,
      email,
      userType,
      createdDocuments,
      skippedDocuments,
      timestamp: now.toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Repair User] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
