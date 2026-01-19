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
  increment,
} from 'firebase/firestore';
import { getDbInstance } from './firebase';
import { COLLECTIONS } from './collections';
import {
  Subscription,
  SubscriptionPayment,
  SubscriptionPaymentWithDetails,
  JobPostingLimits,
  Agency,
} from '@/types';

/**
 * Get agency subscription by agency ID
 */
export async function getAgencySubscription(
  agencyId: string
): Promise<Subscription | null> {
  try {
    const db = getDbInstance();
    const subscriptionRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, agencyId);
    const subscriptionSnap = await getDoc(subscriptionRef);

    if (!subscriptionSnap.exists()) {
      return null;
    }

    const data = subscriptionSnap.data();
    return {
      id: subscriptionSnap.id,
      agencyId: data.agencyId,
      plan: data.plan,
      status: data.status,
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      autoRenew: data.autoRenew || false,
      lifetimeJobsPosted: data.lifetimeJobsPosted || 0,
      currentPeriodJobsPosted: data.currentPeriodJobsPosted || 0,
      lastPaymentDate: data.lastPaymentDate?.toDate(),
      lastPaymentAmount: data.lastPaymentAmount,
      lastPaymentReference: data.lastPaymentReference,
      lastPaymentMethod: data.lastPaymentMethod,
      currency: data.currency || 'PHP',
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      createdBy: data.createdBy,
      notes: data.notes,
    };
  } catch (error) {
    console.error('Error getting agency subscription:', error);
    throw error;
  }
}

/**
 * Check if agency can post a job
 */
export async function canPostJob(agencyId: string): Promise<{
  allowed: boolean;
  reason?: string;
  plan: 'free' | 'premium' | 'none';
  currentCount: number;
  limit: number;
}> {
  try {
    const subscription = await getAgencySubscription(agencyId);

    // No subscription = free tier with 0 posts
    if (!subscription) {
      return {
        allowed: true,
        plan: 'none',
        currentCount: 0,
        limit: 5,
        reason: 'No subscription found - will create free tier on first post',
      };
    }

    // Free tier check
    if (subscription.plan === 'free') {
      if (subscription.lifetimeJobsPosted >= 5) {
        return {
          allowed: false,
          reason: 'Free tier limit reached (5/5 lifetime posts). Upgrade to premium to post more jobs.',
          plan: 'free',
          currentCount: subscription.lifetimeJobsPosted,
          limit: 5,
        };
      }
      return {
        allowed: true,
        plan: 'free',
        currentCount: subscription.lifetimeJobsPosted,
        limit: 5,
      };
    }

    // Premium tier check
    if (subscription.plan === 'premium') {
      // Check if subscription is active
      if (subscription.status !== 'active') {
        return {
          allowed: false,
          reason: `Premium subscription ${subscription.status}. Please renew to continue posting jobs.`,
          plan: 'premium',
          currentCount: subscription.lifetimeJobsPosted,
          limit: -1, // unlimited
        };
      }

      // Check if subscription has expired
      if (subscription.endDate < new Date()) {
        return {
          allowed: false,
          reason: 'Premium subscription expired. Please renew to continue posting jobs.',
          plan: 'premium',
          currentCount: subscription.lifetimeJobsPosted,
          limit: -1,
        };
      }

      return {
        allowed: true,
        plan: 'premium',
        currentCount: subscription.lifetimeJobsPosted,
        limit: -1, // unlimited
      };
    }

    return {
      allowed: false,
      reason: 'Invalid subscription plan',
      plan: 'none',
      currentCount: 0,
      limit: 0,
    };
  } catch (error) {
    console.error('Error checking if can post job:', error);
    throw error;
  }
}

/**
 * Create initial free subscription for new agency
 */
export async function createFreeSubscription(
  agencyId: string
): Promise<Subscription> {
  try {
    const db = getDbInstance();
    const now = new Date();
    const subscription: Subscription = {
      id: agencyId,
      agencyId,
      plan: 'free',
      status: 'active',
      startDate: now,
      endDate: new Date(now.getFullYear() + 100, 11, 31), // Far future date for free tier
      autoRenew: false,
      lifetimeJobsPosted: 0,
      currentPeriodJobsPosted: 0,
      currency: 'PHP',
      createdAt: now,
      updatedAt: now,
    };

    const subscriptionRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, agencyId);
    await setDoc(subscriptionRef, {
      ...subscription,
      startDate: Timestamp.fromDate(subscription.startDate),
      endDate: Timestamp.fromDate(subscription.endDate),
      createdAt: Timestamp.fromDate(subscription.createdAt),
      updatedAt: Timestamp.fromDate(subscription.updatedAt),
    });

    return subscription;
  } catch (error) {
    console.error('Error creating free subscription:', error);
    throw error;
  }
}

/**
 * Create premium subscription (after payment approval)
 */
export async function createPremiumSubscription(
  agencyId: string,
  paymentDetails: {
    paymentAmount: number;
    paymentReference: string;
    paymentMethod: string;
    adminId: string;
    notes?: string;
  }
): Promise<Subscription> {
  try {
    const db = getDbInstance();
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30); // 30 days from now

    // Get existing subscription to preserve lifetime job count
    const existing = await getAgencySubscription(agencyId);
    const lifetimeJobsPosted = existing?.lifetimeJobsPosted || 0;

    const subscription: Subscription = {
      id: agencyId,
      agencyId,
      plan: 'premium',
      status: 'active',
      startDate: now,
      endDate,
      autoRenew: false,
      lifetimeJobsPosted,
      currentPeriodJobsPosted: 0,
      lastPaymentDate: now,
      lastPaymentAmount: paymentDetails.paymentAmount,
      lastPaymentReference: paymentDetails.paymentReference,
      lastPaymentMethod: paymentDetails.paymentMethod as any,
      currency: 'PHP',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      createdBy: paymentDetails.adminId,
      notes: paymentDetails.notes,
    };

    const subscriptionRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, agencyId);
    await setDoc(subscriptionRef, {
      ...subscription,
      startDate: Timestamp.fromDate(subscription.startDate),
      endDate: Timestamp.fromDate(subscription.endDate),
      lastPaymentDate: Timestamp.fromDate(subscription.lastPaymentDate!),
      createdAt: Timestamp.fromDate(subscription.createdAt),
      updatedAt: Timestamp.fromDate(subscription.updatedAt),
    });

    return subscription;
  } catch (error) {
    console.error('Error creating premium subscription:', error);
    throw error;
  }
}

/**
 * Increment job count after successful job posting
 */
export async function incrementJobCount(agencyId: string): Promise<void> {
  try {
    const db = getDbInstance();
    const subscriptionRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, agencyId);
    const subscriptionSnap = await getDoc(subscriptionRef);

    if (!subscriptionSnap.exists()) {
      // Create free subscription if doesn't exist
      await createFreeSubscription(agencyId);
    }

    await updateDoc(subscriptionRef, {
      lifetimeJobsPosted: increment(1),
      currentPeriodJobsPosted: increment(1),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error incrementing job count:', error);
    throw error;
  }
}

/**
 * Check if agency has active premium subscription (for featured jobs)
 */
export async function hasPremiumSubscription(
  agencyId: string
): Promise<boolean> {
  try {
    const subscription = await getAgencySubscription(agencyId);

    if (!subscription) return false;
    if (subscription.plan !== 'premium') return false;
    if (subscription.status !== 'active') return false;
    if (subscription.endDate < new Date()) return false;

    return true;
  } catch (error) {
    console.error('Error checking premium subscription:', error);
    return false;
  }
}

/**
 * Get job posting limits configuration
 */
export async function getJobPostingLimits(): Promise<JobPostingLimits> {
  try {
    const db = getDbInstance();
    const limitsRef = doc(db, COLLECTIONS.JOB_POSTING_LIMITS, 'default');
    const limitsSnap = await getDoc(limitsRef);

    if (!limitsSnap.exists()) {
      // Return default values if not configured
      return {
        id: 'default',
        freeTierLimit: 2,
        premiumTierLimit: -1, // unlimited
        premiumMonthlyPrice: 5000,
        premiumCurrency: 'PHP',
        featuredJobBasePrice: 1000,
        updatedAt: new Date(),
      };
    }

    const data = limitsSnap.data();
    return {
      id: limitsSnap.id,
      freeTierLimit: data.freeTierLimit,
      premiumTierLimit: data.premiumTierLimit,
      premiumMonthlyPrice: data.premiumMonthlyPrice,
      premiumCurrency: data.premiumCurrency,
      featuredJobBasePrice: data.featuredJobBasePrice,
      updatedAt: data.updatedAt?.toDate() || new Date(),
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error('Error getting job posting limits:', error);
    throw error;
  }
}

/**
 * Create payment submission for premium upgrade
 */
export async function submitPremiumPayment(params: {
  agencyId: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  proofImageUrl?: string;
  notes?: string;
}): Promise<string> {
  try {
    const db = getDbInstance();
    const now = new Date();
    const periodStart = now;
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const subscription = await getAgencySubscription(params.agencyId);
    const subscriptionId = subscription?.id || params.agencyId;

    const payment: Omit<SubscriptionPayment, 'id'> = {
      subscriptionId,
      agencyId: params.agencyId,
      amount: params.amount,
      currency: 'PHP',
      paymentMethod: params.paymentMethod as any,
      paymentReference: params.paymentReference,
      status: 'pending',
      periodStart,
      periodEnd,
      proofImageUrl: params.proofImageUrl,
      createdAt: now,
      updatedAt: now,
      notes: params.notes,
    };

    const paymentRef = doc(collection(db, COLLECTIONS.SUBSCRIPTION_PAYMENTS));
    await setDoc(paymentRef, {
      ...payment,
      periodStart: Timestamp.fromDate(periodStart),
      periodEnd: Timestamp.fromDate(periodEnd),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    return paymentRef.id;
  } catch (error) {
    console.error('Error submitting premium payment:', error);
    throw error;
  }
}

/**
 * Get agency payment history
 */
export async function getAgencyPaymentHistory(
  agencyId: string
): Promise<SubscriptionPayment[]> {
  try {
    const db = getDbInstance();
    const q = query(
      collection(db, COLLECTIONS.SUBSCRIPTION_PAYMENTS),
      where('agencyId', '==', agencyId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        subscriptionId: data.subscriptionId,
        agencyId: data.agencyId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        status: data.status,
        periodStart: data.periodStart?.toDate() || new Date(),
        periodEnd: data.periodEnd?.toDate() || new Date(),
        proofImageUrl: data.proofImageUrl,
        processedAt: data.processedAt?.toDate(),
        processedBy: data.processedBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        notes: data.notes,
        rejectionReason: data.rejectionReason,
      };
    });
  } catch (error) {
    console.error('Error getting agency payment history:', error);
    throw error;
  }
}

/**
 * Get pending payment submissions (for admin)
 */
export async function getPendingPayments(): Promise<
  SubscriptionPaymentWithDetails[]
> {
  try {
    const db = getDbInstance();
    const q = query(
      collection(db, COLLECTIONS.SUBSCRIPTION_PAYMENTS),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const payments = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const payment: SubscriptionPayment = {
          id: docSnap.id,
          subscriptionId: data.subscriptionId,
          agencyId: data.agencyId,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          paymentReference: data.paymentReference,
          status: data.status,
          periodStart: data.periodStart?.toDate() || new Date(),
          periodEnd: data.periodEnd?.toDate() || new Date(),
          proofImageUrl: data.proofImageUrl,
          processedAt: data.processedAt?.toDate(),
          processedBy: data.processedBy,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          notes: data.notes,
          rejectionReason: data.rejectionReason,
        };

        // Get agency details
        const agencyRef = doc(db, COLLECTIONS.AGENCIES, data.agencyId);
        const agencySnap = await getDoc(agencyRef);
        let agency: Agency | undefined;

        if (agencySnap.exists()) {
          const agencyData = agencySnap.data();
          agency = {
            id: agencySnap.id,
            ...agencyData,
            createdAt: agencyData.createdAt?.toDate() || new Date(),
            updatedAt: agencyData.updatedAt?.toDate() || new Date(),
          } as Agency;
        }

        return {
          ...payment,
          agency,
        };
      })
    );

    return payments;
  } catch (error) {
    console.error('Error getting pending payments:', error);
    throw error;
  }
}
