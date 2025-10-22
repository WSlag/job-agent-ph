'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  MessageCircle,
  Heart,
  Share2,
} from 'lucide-react';
import { Job } from '@/types';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onMessage?: (jobId: string) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, onSave, onMessage, isSaved = false }: JobCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [imageError, setImageError] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave(job.id);
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage(job.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.companyName}`,
          url: window.location.origin + `/jobs/${job.id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;

    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }

    if (job.salaryMin) {
      return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    }

    return `${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  const salary = formatSalary();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        {job.imageUrl && !imageError ? (
          <Image
            src={job.imageUrl}
            alt={`${job.companyName} - ${job.title}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
            <Briefcase size={64} className="text-white opacity-60 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}

        {/* Job Type Badge */}
        <div className="absolute top-3 right-3 animate-slide-up">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-lg border border-blue-100">
            {job.jobType.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100"
          aria-label={saved ? 'Unsave job' : 'Save job'}
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${saved ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Job Details Section */}
      <div className="p-5">
        {/* Job Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Company Name */}
        <p className="text-lg text-gray-700 font-medium mb-3">
          {job.companyName}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">
            {job.location}, {job.country}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {job.locationType.replace('-', ' ')}
            </span>
          </span>
        </div>

        {/* Salary */}
        {salary && (
          <div className="flex items-center text-gray-600 mb-2">
            <DollarSign size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm font-semibold text-green-600">
              {salary}
            </span>
          </div>
        )}

        {/* Experience */}
        <div className="flex items-center text-gray-600 mb-3">
          <Briefcase size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">
            {job.experienceRequired === 0
              ? 'No experience required'
              : `${job.experienceRequired}+ years experience`}
          </span>
        </div>

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Posted Date */}
        <div className="flex items-center text-gray-500 text-xs mb-4">
          <Clock size={14} className="mr-1" />
          <span>
            Posted {formatDistanceToNow(new Date(job.postedAt))} ago
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleMessage}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
          >
            <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
            Message Agency
          </button>

          <button
            onClick={handleShare}
            className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md flex items-center justify-center group/share"
            aria-label="Share job"
          >
            <Share2 size={18} className="group-hover/share:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
