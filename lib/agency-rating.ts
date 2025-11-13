import { getDbInstance } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';

/**
 * Submit or update a rating for an agency
 */
export async function submitAgencyRating(
  agencyId: string,
  jobHunterId: string,
  rating: number
): Promise<void> {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Use a composite ID to prevent duplicate ratings
  const ratingId = `${agencyId}_${jobHunterId}`;

  try {
    const db = getDbInstance();
    const ratingRef = doc(db, COLLECTIONS.AGENCY_REVIEWS, ratingId);

    await setDoc(
      ratingRef,
      {
        agencyId,
        jobHunterId,
        rating,
        createdAt: serverTimestamp(),
        verified: false, // TODO: Set to true if user was actually hired by this agency
      },
      { merge: true }
    );

    // Note: Rating aggregation should be done via Cloud Function
    // For now, ratings are stored but not automatically aggregated
    // TODO: Implement Cloud Function to recalculate on agencyReviews write
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw new Error('Failed to submit rating. Please try again.');
  }
}

/**
 * Get user's existing rating for an agency
 */
export async function getUserRating(
  agencyId: string,
  jobHunterId: string
): Promise<number | null> {
  try {
    const db = getDbInstance();
    const ratingId = `${agencyId}_${jobHunterId}`;
    const ratingRef = doc(db, COLLECTIONS.AGENCY_REVIEWS, ratingId);
    const ratingDoc = await getDoc(ratingRef);

    if (ratingDoc.exists()) {
      return ratingDoc.data().rating;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }
}

/**
 * Recalculate agency's average rating from all reviews
 */
export async function recalculateAgencyRating(agencyId: string): Promise<void> {
  try {
    const db = getDbInstance();
    const reviewsRef = collection(db, COLLECTIONS.AGENCY_REVIEWS);
    const q = query(reviewsRef, where('agencyId', '==', agencyId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No ratings yet, set to 0
      const agencyRef = doc(db, COLLECTIONS.AGENCIES, agencyId);
      await setDoc(
        agencyRef,
        {
          rating: 0,
          reviewCount: 0,
        },
        { merge: true }
      );
      return;
    }

    // Calculate average
    let totalRating = 0;
    querySnapshot.forEach((doc) => {
      totalRating += doc.data().rating;
    });

    const averageRating = totalRating / querySnapshot.size;
    const reviewCount = querySnapshot.size;

    // Update agency document
    const agencyRef = doc(db, COLLECTIONS.AGENCIES, agencyId);
    await setDoc(
      agencyRef,
      {
        rating: Number(averageRating.toFixed(1)),
        reviewCount,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error recalculating rating:', error);
    throw new Error('Failed to update agency rating');
  }
}

/**
 * Get all ratings for an agency
 */
export async function getAgencyRatings(agencyId: string) {
  try {
    const db = getDbInstance();
    const reviewsRef = collection(db, COLLECTIONS.AGENCY_REVIEWS);
    const q = query(reviewsRef, where('agencyId', '==', agencyId));
    const querySnapshot = await getDocs(q);

    const ratings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ratings;
  } catch (error) {
    console.error('Error fetching agency ratings:', error);
    return [];
  }
}
