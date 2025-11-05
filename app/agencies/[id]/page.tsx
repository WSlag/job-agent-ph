'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data - in production, fetch from Firestore
  const agency: Agency = {
    id: params.id as string,
    name: 'Global Manpower Services Inc.',
    description:
      'Leading recruitment agency specializing in healthcare and hospitality placements to the Middle East. With over 15 years of experience, we have successfully placed thousands of Filipino professionals in top international companies.',
    rating: 4.8,
    reviewCount: 342,
    isDMWVerified: true,
    isPOEALicensed: true,
    responseTime: '2-4 hours',
    placementsCount: 5420,
    yearsEstablished: 15,
    address: 'Makati City, Metro Manila',
    phone: '+63 2 8888 9999',
    email: 'info@globalmps.ph',
    website: 'www.globalmps.ph',
    specializations: ['Healthcare', 'Hospitality', 'Engineering', 'IT'],
    certifications: [
      'POEA Licensed (2024-2026)',
      'DMW Verified',
      'ISO 9001:2015 Certified',
      'PhilHealth Accredited',
    ],
    activeJobs: 45,
  };

  const activeJobs: Job[] = []; // Would load from Firestore

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
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white">
              {agency.logo ? (
                <img
                  src={agency.logo}
                  alt={agency.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-16 h-16 text-primary-600" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {agency.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < Math.floor(agency.rating)
                              ? 'text-gold-500'
                              : 'text-gray-300'
                          }
                          fill={i < Math.floor(agency.rating) ? '#FCD116' : 'none'}
                        />
                      ))}
                      <span className="text-sm font-semibold text-gray-700 ml-2">
                        {agency.rating} ({agency.reviewCount} reviews)
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
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <Link
                    href={`/messages?agencyId=${agency.id}`}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Message
                  </Link>
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
