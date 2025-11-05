'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Plane,
  Heart,
  Utensils,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Building2,
  Clock,
  Users,
  Shield,
  Calculator,
} from 'lucide-react';
import { Badge } from '@/components/ui';

interface Agency {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  isDMWVerified: boolean;
  responseTime: string;
  placementsCount: number;
  yearsEstablished: number;
}

interface JobDetailsBenefitsProps {
  benefits: string[];
  agency: Agency;
  jobLocation: { lat: number; lng: number; address: string };
  onCalculateCost: () => void;
}

/**
 * JobDetailsBenefits Component
 *
 * Part 2 of Job Details: Benefits + Agency Info + Map + Cost Calculator
 */
export default function JobDetailsBenefits({
  benefits,
  agency,
  jobLocation,
  onCalculateCost,
}: JobDetailsBenefitsProps) {
  const benefitIcons: Record<string, React.ReactNode> = {
    'Housing Allowance': <Home className="w-5 h-5" />,
    'Flight Tickets': <Plane className="w-5 h-5" />,
    'Health Insurance': <Heart className="w-5 h-5" />,
    'Meals Provided': <Utensils className="w-5 h-5" />,
    'Annual Leave': <Calendar className="w-5 h-5" />,
    'End of Service Benefits': <DollarSign className="w-5 h-5" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Benefits */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary-600" />
          Benefits & Perks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center">
                {benefitIcons[benefit] || <DollarSign className="w-5 h-5" />}
              </div>
              <span className="text-gray-900 font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agency Card */}
      <div className="bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary-600" />
          About the Agency
        </h2>

        <div className="bg-white rounded-xl p-6 shadow-md">
          {/* Agency Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {agency.logo ? (
                <img
                  src={agency.logo}
                  alt={agency.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10 text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {agency.name}
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
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
                  <span className="text-sm font-semibold text-gray-700 ml-1">
                    {agency.rating} ({agency.reviewCount} reviews)
                  </span>
                </div>
                {agency.isDMWVerified && (
                  <Badge variant="verified" size="sm" icon={<Shield size={14} />}>
                    DMW Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Agency Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-info-50 rounded-lg">
              <Clock className="w-6 h-6 text-info-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {agency.responseTime}
              </p>
              <p className="text-xs text-gray-600">Response Time</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <Users className="w-6 h-6 text-success-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {agency.placementsCount}+
              </p>
              <p className="text-xs text-gray-600">Successful Placements</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <Calendar className="w-6 h-6 text-warning-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {agency.yearsEstablished}
              </p>
              <p className="text-xs text-gray-600">Years Established</p>
            </div>
          </div>

          {/* View Full Profile Button */}
          <Link
            href={`/agencies/${agency.id}`}
            className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            View Full Agency Profile
          </Link>
        </div>
      </div>

      {/* Job Location Map */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary-600" />
          Job Location
        </h2>
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
          {/* Placeholder for map - would integrate with Google Maps or similar */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-purple-100">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">{jobLocation.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                Interactive map would load here
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          📍 {jobLocation.address}
        </p>
      </div>

      {/* Cost Calculator Card */}
      <div className="bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-success-600 text-white rounded-full flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Estimate Your Costs
            </h3>
            <p className="text-gray-700 mb-4">
              Calculate processing fees, visa costs, and other expenses before applying.
              Get a detailed breakdown tailored to this job.
            </p>
            <button
              onClick={onCalculateCost}
              className="bg-success-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-success-700 transition-colors inline-flex items-center gap-2"
            >
              <Calculator size={18} />
              Open Cost Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
