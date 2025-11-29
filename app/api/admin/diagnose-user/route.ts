import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/collections';
import { hasPermission } from '@/lib/permission-helpers';
import { Admin, Permission } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get email from query parameter
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
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

    // Initialize diagnostic report
    const diagnosticReport: any = {
      email,
      timestamp: new Date().toISOString(),
      auth: {
        exists: false,
        data: null,
      },
      firestore: {
        users: {
          exists: false,
          data: null,
        },
        jobHunters: {
          exists: false,
          data: null,
        },
        agencies: {
          exists: false,
          data: null,
        },
        admins: {
          exists: false,
          data: null,
        },
      },
      issues: [],
      recommendations: [],
    };

    // Step 1: Check Firebase Authentication
    let authUser;
    try {
      authUser = await adminAuth.getUserByEmail(email);
      diagnosticReport.auth.exists = true;
      diagnosticReport.auth.data = {
        uid: authUser.uid,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        disabled: authUser.disabled,
        creationTime: authUser.metadata.creationTime,
        lastSignInTime: authUser.metadata.lastSignInTime,
        providerData: authUser.providerData,
      };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        diagnosticReport.issues.push('User does not exist in Firebase Authentication');
        diagnosticReport.recommendations.push('Create user via signup process or Firebase console');
      } else {
        diagnosticReport.issues.push(`Error checking Auth: ${error.message}`);
      }

      return NextResponse.json(diagnosticReport, { status: 200 });
    }

    const userId = authUser.uid;

    // Step 2: Check Firestore users collection
    const usersDoc = await adminDb
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .get();

    if (usersDoc.exists) {
      diagnosticReport.firestore.users.exists = true;
      diagnosticReport.firestore.users.data = usersDoc.data();
    } else {
      diagnosticReport.issues.push('Missing base user document in users collection');
      diagnosticReport.recommendations.push('Create users/{userId} document with basic profile info');
    }

    // Step 3: Check all role-specific collections
    const jobHuntersDoc = await adminDb
      .collection(COLLECTIONS.JOB_HUNTERS)
      .doc(userId)
      .get();

    if (jobHuntersDoc.exists) {
      diagnosticReport.firestore.jobHunters.exists = true;
      diagnosticReport.firestore.jobHunters.data = jobHuntersDoc.data();
    }

    const agenciesDoc = await adminDb
      .collection(COLLECTIONS.AGENCIES)
      .doc(userId)
      .get();

    if (agenciesDoc.exists) {
      diagnosticReport.firestore.agencies.exists = true;
      diagnosticReport.firestore.agencies.data = agenciesDoc.data();
    }

    const adminsDoc = await adminDb
      .collection(COLLECTIONS.ADMINS)
      .doc(userId)
      .get();

    if (adminsDoc.exists) {
      diagnosticReport.firestore.admins.exists = true;
      diagnosticReport.firestore.admins.data = adminsDoc.data();
    }

    // Step 4: Analyze and provide recommendations
    const roleDocCount = [
      jobHuntersDoc.exists,
      agenciesDoc.exists,
      adminsDoc.exists,
    ].filter(Boolean).length;

    if (roleDocCount === 0) {
      diagnosticReport.issues.push('No role-specific profile found (jobHunters, agencies, or admins)');
      diagnosticReport.recommendations.push('User is orphaned in Auth - create Firestore profile documents');
      diagnosticReport.recommendations.push('Run repair script with appropriate userType');
    } else if (roleDocCount > 1) {
      diagnosticReport.issues.push('User has multiple role profiles - data inconsistency detected');
      diagnosticReport.recommendations.push('Review and delete incorrect role profiles');
    }

    // Determine likely user type
    if (usersDoc.exists) {
      const userData = usersDoc.data();
      diagnosticReport.detectedUserType = userData?.userType || 'unknown';
    } else if (roleDocCount === 1) {
      if (jobHuntersDoc.exists) diagnosticReport.detectedUserType = 'jobhunter';
      if (agenciesDoc.exists) diagnosticReport.detectedUserType = 'agency';
      if (adminsDoc.exists) diagnosticReport.detectedUserType = 'admin';
    }

    // Summary
    diagnosticReport.summary = {
      isOrphaned: diagnosticReport.auth.exists && roleDocCount === 0,
      isIncomplete: diagnosticReport.auth.exists && (!usersDoc.exists || roleDocCount === 0),
      isInconsistent: roleDocCount > 1,
      canRepair: diagnosticReport.auth.exists && roleDocCount === 0,
    };

    return NextResponse.json(diagnosticReport, { status: 200 });
  } catch (error: any) {
    console.error('[Diagnose User] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
