import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { getDbInstance } from './firebase'
import { COLLECTIONS } from './collections'
import {
  FeaturedJobRequest,
  FeaturedJobRequestWithDetails,
  Job,
  Agency,
  PaymentMethod,
} from '@/types'
import { hasPremiumSubscription } from './subscription-helpers'

interface CreateFeaturedRequestParams {
  jobId: string
  agencyId: string
  paymentMethod: PaymentMethod
  paymentReference: string
  paymentAmount: number
  currency: string
  notes?: string
}

/**
 * Create a new featured job request
 * @param params Request creation parameters
 * @returns Promise with the created request ID
 */
export async function createFeaturedRequest(
  params: CreateFeaturedRequestParams
): Promise<string> {
  const {
    jobId,
    agencyId,
    paymentMethod,
    paymentReference,
    paymentAmount,
    currency,
    notes,
  } = params

  try {
    const db = getDbInstance();

    // PREMIUM CHECK: Verify agency has active premium subscription
    const isPremium = await hasPremiumSubscription(agencyId);
    if (!isPremium) {
      throw new Error(
        'Featured job placement requires an active Premium subscription. Please upgrade to Premium first.'
      );
    }

    // Check if job exists and belongs to agency
    const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, jobId))
    if (!jobDoc.exists()) {
      throw new Error('Job not found')
    }

    const jobData = jobDoc.data() as Job
    if (jobData.agencyId !== agencyId) {
      throw new Error('Job does not belong to this agency')
    }

    // Check if job is already featured
    if (jobData.isFeatured) {
      throw new Error('This job is already featured')
    }

    // Check if there's already a pending request for this job
    const existingRequestQuery = query(
      collection(db, COLLECTIONS.FEATURED_REQUESTS),
      where('jobId', '==', jobId),
      where('status', '==', 'pending')
    )
    const existingRequests = await getDocs(existingRequestQuery)

    if (!existingRequests.empty) {
      throw new Error('A pending featured request already exists for this job')
    }

    // Create the request
    const requestRef = doc(collection(db, COLLECTIONS.FEATURED_REQUESTS))
    const requestData: Omit<FeaturedJobRequest, 'id'> = {
      jobId,
      agencyId,
      status: 'pending',
      paymentMethod,
      paymentReference,
      paymentAmount,
      currency,
      notes: notes || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(requestRef, requestData)
    return requestRef.id
  } catch (error) {
    console.error('Error creating featured request:', error)
    throw error
  }
}

/**
 * Get all featured requests (optionally filtered by status)
 * @param status Optional status filter
 * @returns Promise with array of requests
 */
export async function getFeaturedRequests(
  status?: 'pending' | 'approved' | 'rejected'
): Promise<FeaturedJobRequestWithDetails[]> {
  try {
    const db = getDbInstance();
    const requestsRef = collection(db, COLLECTIONS.FEATURED_REQUESTS)
    let q = query(requestsRef, orderBy('createdAt', 'desc'))

    if (status) {
      q = query(requestsRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    }

    const querySnapshot = await getDocs(q)
    const requests: FeaturedJobRequestWithDetails[] = []

    for (const docSnapshot of querySnapshot.docs) {
      const requestData = { id: docSnapshot.id, ...docSnapshot.data() } as FeaturedJobRequest

      // Fetch related job
      let job: Job | undefined
      try {
        const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, requestData.jobId))
        if (jobDoc.exists()) {
          job = { id: jobDoc.id, ...jobDoc.data() } as Job
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      }

      // Fetch related agency
      let agency: Agency | undefined
      try {
        const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, requestData.agencyId))
        if (agencyDoc.exists()) {
          agency = { id: agencyDoc.id, ...agencyDoc.data() } as Agency
        }
      } catch (error) {
        console.error('Error fetching agency:', error)
      }

      requests.push({
        ...requestData,
        job,
        agency,
      })
    }

    return requests
  } catch (error) {
    console.error('Error fetching featured requests:', error)
    throw new Error('Failed to fetch featured requests')
  }
}

/**
 * Get featured requests for a specific agency
 * @param agencyId The agency ID
 * @returns Promise with array of requests
 */
export async function getAgencyFeaturedRequests(
  agencyId: string
): Promise<FeaturedJobRequest[]> {
  try {
    const db = getDbInstance();
    const requestsRef = collection(db, COLLECTIONS.FEATURED_REQUESTS)
    const q = query(
      requestsRef,
      where('agencyId', '==', agencyId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as FeaturedJobRequest)
    )
  } catch (error) {
    console.error('Error fetching agency featured requests:', error)
    throw new Error('Failed to fetch agency featured requests')
  }
}

/**
 * Approve a featured job request
 * @param requestId The request ID
 * @param priority The carousel priority (1-5)
 * @param adminId The admin ID approving the request
 */
export async function approveFeaturedRequest(
  requestId: string,
  priority: number,
  adminId: string
): Promise<void> {
  if (priority < 1 || priority > 5) {
    throw new Error('Priority must be between 1 and 5')
  }

  try {
    const db = getDbInstance();
    // Get the request
    const requestDoc = await getDoc(doc(db, COLLECTIONS.FEATURED_REQUESTS, requestId))
    if (!requestDoc.exists()) {
      throw new Error('Featured request not found')
    }

    const requestData = requestDoc.data() as FeaturedJobRequest

    // Update the request status
    await updateDoc(doc(db, COLLECTIONS.FEATURED_REQUESTS, requestId), {
      status: 'approved',
      reviewedBy: adminId,
      reviewedAt: new Date(),
      approvedPriority: priority,
      updatedAt: new Date(),
    })

    // Update the job to mark as featured
    await updateDoc(doc(db, COLLECTIONS.JOBS, requestData.jobId), {
      isFeatured: true,
      featuredPriority: priority,
      featuredRequestId: requestId,
      featuredAt: new Date(),
    })
  } catch (error) {
    console.error('Error approving featured request:', error)
    throw new Error('Failed to approve featured request')
  }
}

/**
 * Reject a featured job request
 * @param requestId The request ID
 * @param reason Rejection reason
 * @param adminId The admin ID rejecting the request
 */
export async function rejectFeaturedRequest(
  requestId: string,
  reason: string,
  adminId: string
): Promise<void> {
  try {
    const db = getDbInstance();
    await updateDoc(doc(db, COLLECTIONS.FEATURED_REQUESTS, requestId), {
      status: 'rejected',
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason: reason,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error rejecting featured request:', error)
    throw new Error('Failed to reject featured request')
  }
}

/**
 * Remove a job from featured carousel
 * @param jobId The job ID
 */
export async function removeFeaturedJob(jobId: string): Promise<void> {
  try {
    const db = getDbInstance();
    await updateDoc(doc(db, COLLECTIONS.JOBS, jobId), {
      isFeatured: false,
      featuredPriority: null,
      featuredRequestId: null,
    })
  } catch (error) {
    console.error('Error removing featured job:', error)
    throw new Error('Failed to remove featured job')
  }
}

/**
 * Update featured job priority
 * @param jobId The job ID
 * @param newPriority The new priority (1-5)
 */
export async function updateFeaturedPriority(
  jobId: string,
  newPriority: number
): Promise<void> {
  if (newPriority < 1 || newPriority > 5) {
    throw new Error('Priority must be between 1 and 5')
  }

  try {
    const db = getDbInstance();
    await updateDoc(doc(db, COLLECTIONS.JOBS, jobId), {
      featuredPriority: newPriority,
    })
  } catch (error) {
    console.error('Error updating featured priority:', error)
    throw new Error('Failed to update featured priority')
  }
}

/**
 * Get all featured jobs ordered by priority
 * @returns Promise with array of featured jobs
 */
export async function getFeaturedJobs(): Promise<Job[]> {
  try {
    const db = getDbInstance();
    const jobsRef = collection(db, COLLECTIONS.JOBS)
    const q = query(
      jobsRef,
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      orderBy('featuredPriority', 'asc'),
      limit(5) // Maximum 5 featured jobs
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Job))
  } catch (error) {
    console.error('Error fetching featured jobs:', error)
    throw new Error('Failed to fetch featured jobs')
  }
}

/**
 * Check if agency can request featured job (max slots available)
 * @returns Promise with boolean and message
 */
export async function canRequestFeaturedJob(): Promise<{ canRequest: boolean; message: string }> {
  try {
    const featuredJobs = await getFeaturedJobs()

    if (featuredJobs.length >= 5) {
      return {
        canRequest: false,
        message: 'All featured job slots are currently filled. Please try again later.',
      }
    }

    return {
      canRequest: true,
      message: `${5 - featuredJobs.length} featured job slot(s) available.`,
    }
  } catch (error) {
    console.error('Error checking featured job availability:', error)
    return {
      canRequest: false,
      message: 'Unable to check availability. Please try again.',
    }
  }
}
