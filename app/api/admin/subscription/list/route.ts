import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Verify user is an admin
    const adminDoc = await adminDb.collection('admins').doc(uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all subscriptions
    const subscriptionsSnapshot = await adminDb.collection('subscriptions').get();

    const subscriptions = await Promise.all(
      subscriptionsSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Fetch agency details
        let agency = null;
        try {
          const agencyDoc = await adminDb.collection('agencies').doc(data.agencyId).get();
          if (agencyDoc.exists) {
            const agencyData = agencyDoc.data();
            agency = {
              companyName: agencyData?.companyName || 'Unknown',
              email: agencyData?.email || 'N/A',
            };
          }
        } catch (error) {
          console.error(`Error fetching agency ${data.agencyId}:`, error);
        }

        return {
          id: doc.id,
          ...data,
          agency,
          startDate: data.startDate?.toDate?.() || data.startDate,
          endDate: data.endDate?.toDate?.() || data.endDate,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      subscriptions,
    });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
