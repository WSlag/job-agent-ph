import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Cloud Function to automatically recalculate agency ratings
 * Triggers when a rating is created, updated, or deleted
 */
export const onAgencyReviewWritten = functions.firestore
  .document('agencyReviews/{reviewId}')
  .onWrite(async (change, context) => {
    try {
      const reviewData = change.after.exists ? change.after.data() : null;
      const previousData = change.before.exists ? change.before.data() : null;

      // Get agency ID from the review (either new or old data)
      const agencyId = reviewData?.agencyId || previousData?.agencyId;

      if (!agencyId) {
        console.error('No agencyId found in review data');
        return null;
      }

      // Query all ratings for this agency
      const ratingsSnapshot = await admin
        .firestore()
        .collection('agencyReviews')
        .where('agencyId', '==', agencyId)
        .get();

      if (ratingsSnapshot.empty) {
        // No ratings left, set to 0
        await admin.firestore().collection('agencies').doc(agencyId).update({
          rating: 0,
          reviewCount: 0,
        });
        console.log(`Reset rating for agency ${agencyId} to 0`);
        return null;
      }

      // Calculate average rating
      let totalRating = 0;
      ratingsSnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
      });

      const averageRating = totalRating / ratingsSnapshot.size;
      const reviewCount = ratingsSnapshot.size;

      // Update agency document with new aggregated rating
      await admin.firestore().collection('agencies').doc(agencyId).update({
        rating: Number(averageRating.toFixed(1)),
        reviewCount,
      });

      console.log(
        `Updated rating for agency ${agencyId}: ${averageRating.toFixed(
          1
        )} (${reviewCount} reviews)`
      );

      return null;
    } catch (error) {
      console.error('Error aggregating ratings:', error);
      return null;
    }
  });
