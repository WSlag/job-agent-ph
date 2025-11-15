'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Star, Clock, Users, CheckCircle, Loader2 } from 'lucide-react';
import { getAgencyWithStats } from '@/lib/agency-helpers';
import type { Agency, AgencyStatsData } from '@/types';
import Image from 'next/image';

interface AgencyInfoCardProps {
  agencyId: string;
  jobId?: string;
}

export default function AgencyInfoCard({ agencyId, jobId }: AgencyInfoCardProps) {
  const router = useRouter();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [stats, setStats] = useState<AgencyStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAgencyData = useCallback(async () => {
    try {
      const data = await getAgencyWithStats(agencyId);
      setAgency(data.agency);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading agency data:', error);
    } finally {
      setLoading(false);
    }
  }, [agencyId]);

  useEffect(() => {
    loadAgencyData();
  }, [loadAgencyData]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Building2 className="text-blue-600" size={24} />
          About the Agency
        </h2>
        <div className="text-center py-8">
          <Building2 className="text-gray-300 mx-auto mb-3" size={48} />
          <p className="text-gray-600">Agency information unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Building2 className="text-blue-600" size={24} />
        About the Agency
      </h2>

      <div className="space-y-4">
        {/* Agency Logo & Name */}
        <div className="flex items-center gap-4">
          {agency.logoUrl ? (
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={agency.logoUrl}
                alt={agency.companyName}
                fill
                sizes="64px"
                priority
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="text-blue-600" size={32} />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{agency.companyName}</h3>
            {stats?.verificationBadge && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle size={16} />
                <span>DMW Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Star className="text-yellow-500 fill-yellow-500" size={18} />
              <span className="font-bold text-gray-900">{stats?.rating?.toFixed(1) ?? 'N/A'}</span>
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="text-blue-600" size={18} />
              <span className="font-bold text-gray-900">{stats?.responseTime ?? 'N/A'}</span>
            </div>
            <p className="text-xs text-gray-600">Response time</p>
          </div>

          <div className="col-span-2 text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="text-purple-600" size={18} />
              <span className="font-bold text-gray-900">{stats?.totalPlacements ?? 'N/A'}</span>
            </div>
            <p className="text-xs text-gray-600">Successful placements</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              const url = jobId
                ? `/agencies/${agencyId}?fromJob=${jobId}`
                : `/agencies/${agencyId}`;
              router.push(url);
            }}
            className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Agency Profile
          </button>
        </div>
      </div>
    </div>
  );
}
