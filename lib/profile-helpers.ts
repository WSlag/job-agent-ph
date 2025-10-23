/**
 * Profile helper functions
 * Handles user profile updates for both job hunters and agencies
 */

import { db } from './firebase'
import { doc, updateDoc, Timestamp, collection, query, where, getDocs, writeBatch } from 'firebase/firestore'
import { Agency, JobHunter } from '@/types'

/**
 * Updates an agency profile
 * @param userId The agency user ID
 * @param data The agency profile data to update
 */
export async function updateAgencyProfile(
  userId: string,
  data: Partial<Omit<Agency, 'id' | 'email' | 'userType' | 'createdAt'>>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })

    // If company name is being updated, update all job postings with the new company name
    if (data.companyName) {
      const jobsRef = collection(db, 'jobs')
      const jobsQuery = query(jobsRef, where('agencyId', '==', userId))
      const jobsSnapshot = await getDocs(jobsQuery)

      if (!jobsSnapshot.empty) {
        const batch = writeBatch(db)
        jobsSnapshot.docs.forEach((jobDoc) => {
          batch.update(jobDoc.ref, { companyName: data.companyName })
        })
        await batch.commit()
      }
    }
  } catch (error) {
    console.error('Error updating agency profile:', error)
    throw new Error('Failed to update agency profile')
  }
}

/**
 * Updates a job hunter profile
 * @param userId The job hunter user ID
 * @param data The job hunter profile data to update
 */
export async function updateJobHunterProfile(
  userId: string,
  data: Partial<Omit<JobHunter, 'id' | 'email' | 'userType' | 'createdAt'>>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating job hunter profile:', error)
    throw new Error('Failed to update job hunter profile')
  }
}
