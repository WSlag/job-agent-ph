import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './collections';
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
