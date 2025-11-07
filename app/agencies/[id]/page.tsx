'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, getDocs, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Building2,
  Star,
  Shield,
  MapPin,
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Briefcase,
  CheckCircle2,
  Award,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { Badge, StatCard, StatCardGrid, Timeline } from '@/components/ui';
import { Job } from '@/types';

interface Agency {
  id: string;
  name: string;
  logo?: string;
  coverImage?: string;
  description: string;
  rating: number;
  reviewCount: number;
  isDMWVerified: boolean;
  isPOEALicensed: boolean;
  responseTime: string;
  placementsCount: number;
  yearsEstablished: number;
  address: string;
  phone: string;
  email: string;
  website?: string;
  specializations: string[];
  certifications: string[];
  activeJobs: number;
}

/**
 * Agency Profile Page
 *
 * Comprehensive agency information with verification badges
 * Shows statistics, certifications, active jobs, and reviews
 */
export default function AgencyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userType } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the job ID if navigated from job details
  const fromJobId = searchParams.get('fromJob');

  useEffect(() => {
    const loadAgencyData = async () => {
      try {
        setLoading(true);
        const agencyId = params.id as string;

        // Fetch agency profile from Firestore
        const agencyDoc = await getDoc(doc(db, COLLECTIONS.USERS, agencyId));

        if (!agencyDoc.exists()) {
          setError('Agency not found');
          return;
        }

        const agencyData = agencyDoc.data();

        // Check if this is actually an agency
        if (agencyData.userType !== 'agency') {
          setError('This is not an agency profile');
          return;
        }

        // Map Firestore data to Agency interface
        const agencyName = agencyData.companyName || agencyData.displayName || 'Agency Profile';
        setAgency({
          id: agencyDoc.id,
          name: agencyName,
          description: agencyData.description || agencyData.bio || 'No description available',
          rating: agencyData.rating || 0,
          reviewCount: agencyData.reviewCount || 0,
          isDMWVerified: agencyData.isDMWVerified ?? false,
          isPOEALicensed: agencyData.isPOEALicensed ?? false,
          responseTime: agencyData.responseTime || 'Not available',
          placementsCount: agencyData.placementsCount || 0,
          yearsEstablished: agencyData.yearsEstablished || new Date().getFullYear() - (agencyData.createdAt?.toDate()?.getFullYear() || new Date().getFullYear()),
          address: agencyData.address || agencyData.location || 'Not specified',
          phone: agencyData.phone || 'Not available',
          email: agencyData.email || '',
          website: agencyData.website,
          specializations: agencyData.specializations || [],
          certifications: agencyData.certifications || [],
          activeJobs: 0, // Will be updated from jobs query
          logo: agencyData.logoUrl,
          coverImage: agencyData.coverImage,
        });

        // Fetch active jobs posted by this agency
        const jobsQuery = query(
          collection(db, COLLECTIONS.JOBS),
          where('agencyId', '==', agencyId),
          where('status', '==', 'open'),
          firestoreLimit(10)
        );

        const jobsSnapshot = await getDocs(jobsQuery);
        const jobs: Job[] = jobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Job));

        setActiveJobs(jobs);

        // Update agency active jobs count
        if (agency) {
          setAgency({ ...agency, activeJobs: jobs.length });
        }

      } catch (err) {
        console.error('Error loading agency data:', err);
        setError('Failed to load agency information');
        toast.error('Failed to load agency information');
      } finally {
        setLoading(false);
      }
    };

    loadAgencyData();
  }, [params.id]);

  const handleMessage = () => {
    if (!user) {
      // Redirect to login with preserved context
      const loginParams = new URLSearchParams({
        redirect: '/messages',
        agencyId: params.id as string
      });
      router.push(`/auth/login?${loginParams.toString()}`);
    } else if (userType === 'jobhunter') {
      // Navigate to messages with agency ID
      router.push(`/messages?agencyId=${params.id}`);
    } else {
      toast.error('Only job hunters can message agencies');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Agency not found'}</h2>
          <p className="text-gray-600 mb-4">The agency you're looking for doesn't exist or has been removed.</p>
          <Link href="/companies" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse all agencies
          </Link>
        </div>
      </div>
    );
  }

  const deploymentTimeline = [
    {
      id: '1',
      title: 'Application Submitted',
      date: '2024-01-15',
      status: 'completed' as const,
      details: 'Initial application received and reviewed',
    },
    {
      id: '2',
      title: 'Interview & Assessment',
      date: '2024-01-20',
      status: 'completed' as const,
      details: 'Passed initial interview and skills assessment',
    },
    {
      id: '3',
      title: 'Medical Examination',
      date: '2024-01-25',
      status: 'completed' as const,
      details: 'Medical clearance obtained',
    },
    {
      id: '4',
      title: 'Job Order Processing',
      date: '2024-02-01',
      status: 'in_progress' as const,
      details: 'Documents being processed by employer',
    },
    {
      id: '5',
      title: 'Visa Application',
      date: 'TBD',
      status: 'pending' as const,
      details: 'Awaiting job order approval',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => {
              if (fromJobId) {
                router.push(`/jobs/${fromJobId}`);
              } else {
                router.back();
              }
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{fromJobId ? 'Back to Job' : 'Back'}</span>
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary-600 to-purple-600 overflow-hidden">
        {agency.coverImage ? (
          <img
            src={agency.coverImage}
            alt={agency.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-600"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Agency Header */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white">
              {agency.logo ? (
                <img
                  src={agency.logo}
                  alt={agency.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
                    {agency.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(agency.rating)
                              ? 'text-gold-500'
                              : 'text-gray-300'
                          }
                          fill={i < Math.floor(agency.rating) ? '#FCD116' : 'none'}
                        />
                      ))}
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-2">
                        {agency.reviewCount > 0 ? `${agency.rating} (${agency.reviewCount} ${agency.reviewCount === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {agency.isDMWVerified && (
                      <Badge variant="verified" size="md" icon={<Shield size={16} />}>
                        DMW Verified
                      </Badge>
                    )}
                    {agency.isPOEALicensed && (
                      <Badge variant="success" size="md" icon={<CheckCircle2 size={16} />}>
                        POEA Licensed
                      </Badge>
                    )}
                    <Badge variant="info" size="md">
                      {agency.activeJobs} Active Jobs
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={handleMessage}
                    className="flex-1 sm:flex-initial bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Message</span>
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-600" />
                  {agency.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-600" />
                  {agency.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary-600" />
                  {agency.email}
                </div>
                {agency.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-primary-600" />
                    <a
                      href={`https://${agency.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {agency.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatCardGrid cols={4} className="mb-6">
          <StatCard
            icon={<Clock />}
            value={agency.responseTime}
            label="Response Time"
            variant="info"
            size="md"
          />
          <StatCard
            icon={<Users />}
            value={`${agency.placementsCount}+`}
            label="Successful Placements"
            variant="success"
            size="md"
          />
          <StatCard
            icon={<Calendar />}
            value={`${agency.yearsEstablished}`}
            label="Years Established"
            variant="warning"
            size="md"
          />
          <StatCard
            icon={<Briefcase />}
            value={`${agency.activeJobs}`}
            label="Active Jobs"
            variant="primary"
            size="md"
          />
        </StatCardGrid>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-700 leading-relaxed">{agency.description}</p>
            </div>

            {/* Specializations */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary-600" />
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {agency.specializations.map((spec) => (
                  <Badge key={spec} variant="primary" size="md">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
                Certifications & Licenses
              </h2>
              <div className="space-y-3">
                {agency.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-success-50 border border-success-200 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Jobs */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary-600" />
                  Active Job Openings ({agency.activeJobs})
                </h2>
                <Link
                  href={`/jobs?agency=${agency.id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View All
                </Link>
              </div>
              <p className="text-gray-600">
                Browse all active job openings from this agency
              </p>
            </div>
          </div>

          {/* Right Column - Timeline & Reviews */}
          <div className="space-y-6">
            {/* Average Deployment Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-info-600" />
                Typical Process
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Average deployment timeline for this agency
              </p>
              <Timeline steps={deploymentTimeline} currentStep={3} />
            </div>

            {/* Success Rate */}
            <div className="bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Success Rate
              </h3>
              <p className="text-4xl font-bold text-success-700 mb-2">94%</p>
              <p className="text-sm text-gray-700">
                Of applicants successfully deployed within 3 months
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
