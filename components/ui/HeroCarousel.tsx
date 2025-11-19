'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Briefcase, DollarSign, Clock, ArrowRight, Star } from 'lucide-react';
import { useFeaturedJobs } from '@/hooks/useFeaturedJobs';
import HeroCarouselSkeleton from './HeroCarouselSkeleton';
import { Job } from '@/types';

export default function HeroCarousel() {
  const pathname = usePathname();
  const { featuredJobs, loading, error } = useFeaturedJobs();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Only render on homepage
  if (pathname !== '/') {
    return null;
  }

  // Auto-advance carousel
  useEffect(() => {
    if (featuredJobs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredJobs.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [featuredJobs.length]);

  // Reset to first slide when featured jobs change
  useEffect(() => {
    setCurrentSlide(0);
  }, [featuredJobs]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredJobs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredJobs.length) % featuredJobs.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Helper to format number consistently (avoid locale-based hydration mismatch)
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatSalary = (job: Job): string => {
    if (!job.salaryMin && !job.salaryMax) return '';

    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${formatNumber(job.salaryMin)} - ${formatNumber(job.salaryMax)}`;
    }

    if (job.salaryMin) {
      return `${job.currency} ${formatNumber(job.salaryMin)}+`;
    }

    return `${job.currency} ${formatNumber(job.salaryMax!)}`;
  };

  // Show loading skeleton
  if (loading) {
    return <HeroCarouselSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <p className="text-xl md:text-2xl font-semibold mb-2">Failed to load featured jobs</p>
          <p className="text-sm md:text-base opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (featuredJobs.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-2xl">
            <Star className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Featured Jobs Coming Soon</h2>
            <p className="text-base md:text-lg opacity-90 mb-6">
              We're currently curating the best job opportunities for you. Check back soon!
            </p>
            <Link
              href="/jobs"
              className="inline-block bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentJob = featuredJobs[currentSlide];
  const salary = formatSalary(currentJob);

  return (
    <div className="relative z-0 w-full h-[300px] md:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {currentJob.imageUrl ? (
          <Image
            src={currentJob.imageUrl}
            alt={currentJob.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 md:gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm text-white px-2 md:px-4 py-1 md:py-2 rounded-full mb-2 md:mb-6 font-medium text-xs md:text-sm shadow-lg">
              <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              <span className="hidden md:inline">Featured Opportunity</span>
              <span className="md:hidden">Featured</span>
            </div>

            {/* Job Title */}
            <h1 className="text-xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-4 leading-tight">
              {currentJob.title}
            </h1>

            {/* Company Name */}
            <p className="text-sm md:text-2xl text-blue-200 font-semibold mb-2 md:mb-6">
              {currentJob.companyName}
            </p>

            {/* Job Details */}
            <div className="flex flex-wrap gap-1 md:gap-4 mb-2 md:mb-6 text-white text-xs md:text-base">
              <div className="flex items-center gap-1 md:gap-2 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg">
                <MapPin className="w-3 h-3 md:w-5 md:h-5" />
                <span className="font-medium">
                  {currentJob.location}, {currentJob.country}
                </span>
              </div>
              {salary && (
                <div className="flex items-center gap-1 md:gap-2 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg">
                  <DollarSign className="w-3 h-3 md:w-5 md:h-5" />
                  <span className="font-medium hidden md:inline">{salary}</span>
                  <span className="font-medium md:hidden">{salary.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              )}
              <div className="flex items-center gap-1 md:gap-2 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg">
                <Clock className="w-3 h-3 md:w-5 md:h-5" />
                <span className="font-medium capitalize">{currentJob.jobType.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Description - Hidden on Mobile */}
            {(currentJob.tagline || currentJob.description) && (
              <p className="hidden md:block text-lg text-gray-200 mb-8 leading-relaxed line-clamp-2">
                {currentJob.tagline || currentJob.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              <Link
                href={`/jobs/${currentJob.id}`}
                className="bg-blue-600 text-white px-4 md:px-8 py-2 md:py-4 rounded-full text-xs md:text-base font-semibold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-1 md:gap-2 group/btn"
              >
                <span className="hidden md:inline">View Job Details</span>
                <span className="md:hidden">View Details</span>
                <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="bg-white/10 backdrop-blur-sm border border-white md:border-2 text-white px-4 md:px-8 py-2 md:py-4 rounded-full text-xs md:text-base font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center gap-1 md:gap-2"
              >
                <span className="hidden md:inline">Browse All Jobs</span>
                <span className="md:hidden">Browse Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on Mobile */}
      {featuredJobs.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dot Indicators - Hidden on Mobile */}
      {featuredJobs.length > 1 && (
        <div className="hidden md:flex absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 gap-1.5 md:gap-3">
          {featuredJobs.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all border-0 outline-none focus:outline-none ${
                index === currentSlide
                  ? 'w-4 md:w-12 bg-blue-600'
                  : 'w-1.5 md:w-3 bg-white/50 hover:bg-white/80'
              } h-1.5 md:h-3 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-2 right-2 md:top-6 md:right-6 bg-black/30 backdrop-blur-sm text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
        {currentSlide + 1} / {featuredJobs.length}
      </div>
    </div>
  );
}
