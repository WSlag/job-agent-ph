import { doc, getDoc, collection, query, where, getDocs, updateDoc, orderBy, limit as firestoreLimit, Timestamp } from 'firebase/firestore';
import { getDbInstance } from './firebase';
import { COLLECTIONS } from './collections';
import { logAdminAction } from './audit-helpers';
import type { Agency, AgencyStatsData } from '@/types';

/**
 * Format response time in hours to human-readable string
 */
function formatResponseTime(hours: number): string {
  if (hours < 1) return '< 1 hour';
  if (hours === 1) return '1 hour';
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? 's' : ''}`;
}

/**
 * Format placement count to human-readable string
 */
function formatPlacements(count: number): string {
  if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    const remainder = count % 1000;
    if (remainder > 0) {
      return `${thousands},${String(remainder).padStart(3, '0')}+`;
    }
    return `${thousands},000+`;
  }
  return count.toString();
}

/**
 * Get agency profile with statistics
 * Uses cached stats from agencyStats collection, falls back to placeholders
 */
export async function getAgencyWithStats(agencyId: string): Promise<{
  agency: Agency | null;
  stats: AgencyStatsData;
}> {
  try {
    const db = getDbInstance();
    // Fetch agency profile
    const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, agencyId));
    const agency = agencyDoc.exists()
      ? ({ id: agencyDoc.id, ...agencyDoc.data() } as Agency)
      : null;

    // Try to fetch cached stats
    const statsDoc = await getDoc(doc(db, COLLECTIONS.AGENCY_STATS, agencyId));

    if (statsDoc.exists()) {
      const data = statsDoc.data();
      return {
        agency,
        stats: {
          rating: data.rating || 4.8,
          reviewCount: data.reviewCount || 234,
          responseTime: formatResponseTime(data.averageResponseTime || 2),
          totalPlacements: formatPlacements(data.totalHired || 1500),
          verificationBadge: agency?.verified || false,
        },
      };
    }

    // Fallback to placeholder stats
    return {
      agency,
      stats: {
        rating: 4.8,
        reviewCount: 234,
        responseTime: '2 hours',
        totalPlacements: '1,500+',
        verificationBadge: agency?.verified || false,
      },
    };
  } catch (error) {
    console.error('Error fetching agency stats:', error);
    throw error;
  }
}

/**
 * Get count of active jobs for an agency
 */
export async function getAgencyJobCount(agencyId: string): Promise<number> {
  try {
    const db = getDbInstance();
    const q = query(
      collection(db, COLLECTIONS.JOBS),
      where('agencyId', '==', agencyId),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error counting agency jobs:', error);
    return 0;
  }
}

/**
 * Fetch all agencies with optional filters
 */
export interface GetAllAgenciesOptions {
  verificationStatus?: 'all' | 'verified' | 'unverified';
  hasDmwLicense?: boolean;
  hasBusinessPermit?: boolean;
  searchQuery?: string;
  limit?: number;
  orderByField?: 'createdAt' | 'companyName';
  orderDirection?: 'asc' | 'desc';
}

export async function getAllAgencies(options: GetAllAgenciesOptions = {}): Promise<Agency[]> {
  try {
    const db = getDbInstance();
    const {
      verificationStatus = 'all',
      hasDmwLicense,
      hasBusinessPermit,
      searchQuery,
      limit = 100,
      orderByField = 'createdAt',
      orderDirection = 'desc',
    } = options;

    // Build query
    let q = query(
      collection(db, COLLECTIONS.AGENCIES),
      orderBy(orderByField, orderDirection),
      firestoreLimit(limit)
    );

    // Add verification filter if specified
    if (verificationStatus !== 'all') {
      q = query(q, where('verified', '==', verificationStatus === 'verified'));
    }

    const snapshot = await getDocs(q);
    let agencies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Agency[];

    // Apply client-side filters (Firebase doesn't support filtering on undefined fields well)
    if (hasDmwLicense !== undefined) {
      agencies = agencies.filter(agency =>
        hasDmwLicense ? !!agency.dmwLicenseUrl : !agency.dmwLicenseUrl
      );
    }

    if (hasBusinessPermit !== undefined) {
      agencies = agencies.filter(agency =>
        hasBusinessPermit ? !!agency.businessPermitUrl : !agency.businessPermitUrl
      );
    }

    // Apply search query if provided
    if (searchQuery && searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      agencies = agencies.filter(agency =>
        agency.companyName?.toLowerCase().includes(lowerQuery) ||
        agency.registrationNumber?.toLowerCase().includes(lowerQuery) ||
        agency.contactPerson?.toLowerCase().includes(lowerQuery)
      );
    }

    return agencies;
  } catch (error) {
    console.error('Error fetching agencies:', error);
    throw error;
  }
}

/**
 * Verify an agency
 */
export async function verifyAgency(
  agencyId: string,
  adminId: string,
  notes?: string,
  overrideInfo?: { overrideReason: string; missingDocuments: string[] }
): Promise<void> {
  try {
    const db = getDbInstance();
    const agencyRef = doc(db, COLLECTIONS.AGENCIES, agencyId);

    // Get admin name for audit log
    const adminDoc = await getDoc(doc(db, COLLECTIONS.USERS, adminId));
    const adminName = adminDoc.exists() ? (adminDoc.data()?.name || 'Admin') : 'Admin';

    // Build update object
    const updateData: Record<string, unknown> = {
      verified: true,
      verifiedAt: Timestamp.now(),
      verifiedBy: adminId,
    };

    // Add override information if this is an override verification
    if (overrideInfo) {
      updateData.verificationOverride = {
        wasOverride: true,
        overrideReason: overrideInfo.overrideReason,
        missingDocuments: overrideInfo.missingDocuments,
        overrideAt: Timestamp.now(),
        overrideBy: adminId,
      };
    } else {
      // Clear any previous override info if verifying with complete docs
      updateData.verificationOverride = null;
    }

    await updateDoc(agencyRef, updateData);

    // Build audit log details
    const auditDetails: Record<string, unknown> = notes
      ? { notes }
      : { message: 'Agency verified' };

    if (overrideInfo) {
      auditDetails.documentOverride = true;
      auditDetails.overrideReason = overrideInfo.overrideReason;
      auditDetails.missingDocuments = overrideInfo.missingDocuments;
    }

    // Log to audit trail
    await logAdminAction({
      adminId,
      adminName,
      action: 'VERIFY_AGENCY',
      resourceType: 'agency',
      resourceId: agencyId,
      details: auditDetails,
    });
  } catch (error) {
    console.error('Error verifying agency:', error);
    throw error;
  }
}

/**
 * Revoke agency verification
 */
export async function revokeAgencyVerification(
  agencyId: string,
  adminId: string,
  reason?: string
): Promise<void> {
  try {
    const db = getDbInstance();
    const agencyRef = doc(db, COLLECTIONS.AGENCIES, agencyId);

    // Get admin name for audit log
    const adminDoc = await getDoc(doc(db, COLLECTIONS.USERS, adminId));
    const adminName = adminDoc.exists() ? (adminDoc.data()?.name || 'Admin') : 'Admin';

    await updateDoc(agencyRef, {
      verified: false,
      verifiedAt: null,
      verifiedBy: null,
    });

    // Log to audit trail
    await logAdminAction({
      adminId,
      adminName,
      action: 'UNVERIFY_AGENCY',
      resourceType: 'agency',
      resourceId: agencyId,
      details: reason ? { reason } : { message: 'Agency verification revoked' },
    });
  } catch (error) {
    console.error('Error revoking agency verification:', error);
    throw error;
  }
}

/**
 * Get agency verification statistics
 */
export interface AgencyVerificationStats {
  total: number;
  verified: number;
  unverified: number;
  missingDmwLicense: number;
  missingBusinessPermit: number;
  missingBothCertifications: number;
}

export async function getAgencyVerificationStats(): Promise<AgencyVerificationStats> {
  try {
    const db = getDbInstance();
    const snapshot = await getDocs(collection(db, COLLECTIONS.AGENCIES));

    const stats: AgencyVerificationStats = {
      total: snapshot.size,
      verified: 0,
      unverified: 0,
      missingDmwLicense: 0,
      missingBusinessPermit: 0,
      missingBothCertifications: 0,
    };

    snapshot.docs.forEach(doc => {
      const agency = doc.data() as Agency;

      if (agency.verified) {
        stats.verified++;
      } else {
        stats.unverified++;
      }

      const hasDmw = !!agency.dmwLicenseUrl;
      const hasPermit = !!agency.businessPermitUrl;

      if (!hasDmw) stats.missingDmwLicense++;
      if (!hasPermit) stats.missingBusinessPermit++;
      if (!hasDmw && !hasPermit) stats.missingBothCertifications++;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching agency verification stats:', error);
    throw error;
  }
}
