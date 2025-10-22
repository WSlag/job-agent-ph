'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Briefcase, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface FeaturedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  country: string;
  salary?: string;
  jobType: string;
  imageUrl: string;
  description: string;
}

const featuredJobs: FeaturedJob[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    companyName: 'Tech Global Inc.',
    location: 'Singapore',
    country: 'Singapore',
    salary: 'SGD 8,000 - 12,000',
    jobType: 'Full-time',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
    description: 'Join our innovative team building next-gen solutions for global markets.',
  },
  {
    id: '2',
    title: 'Registered Nurse',
    companyName: 'HealthCare Plus',
    location: 'Dubai',
    country: 'UAE',
    salary: 'AED 6,000 - 9,000',
    jobType: 'Full-time',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop',
    description: 'Provide exceptional care in a world-class medical facility.',
  },
  {
    id: '3',
    title: 'Civil Engineer',
    companyName: 'Construction Masters',
    location: 'Toronto',
    country: 'Canada',
    salary: 'CAD 70,000 - 95,000',
    jobType: 'Full-time',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop',
    description: 'Design and oversee infrastructure projects in Canada\'s growing cities.',
  },
  {
    id: '4',
    title: 'Digital Marketing Manager',
    companyName: 'Creative Solutions Ltd.',
    location: 'London',
    country: 'United Kingdom',
    salary: 'GBP 45,000 - 65,000',
    jobType: 'Full-time',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    description: 'Lead digital campaigns for top brands across Europe.',
  },
  {
    id: '5',
    title: 'Hospitality Manager',
    companyName: 'Luxury Hotels International',
    location: 'Sydney',
    country: 'Australia',
    salary: 'AUD 65,000 - 85,000',
    jobType: 'Full-time',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
    description: 'Manage operations at our premium hospitality venues.',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredJobs.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredJobs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredJobs.length) % featuredJobs.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentJob = featuredJobs[currentSlide];

  return (
    <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentJob.imageUrl}
          alt={currentJob.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 md:gap-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 md:px-4 py-1 md:py-2 rounded-full mb-2 md:mb-6 font-medium text-xs md:text-sm">
              <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
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
                <span className="font-medium">{currentJob.location}</span>
              </div>
              {currentJob.salary && (
                <div className="flex items-center gap-1 md:gap-2 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg">
                  <DollarSign className="w-3 h-3 md:w-5 md:h-5" />
                  <span className="font-medium hidden md:inline">{currentJob.salary}</span>
                  <span className="font-medium md:hidden">{currentJob.salary.split(' ')[0]}</span>
                </div>
              )}
              <div className="flex items-center gap-1 md:gap-2 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg">
                <Clock className="w-3 h-3 md:w-5 md:h-5" />
                <span className="font-medium">{currentJob.jobType}</span>
              </div>
            </div>

            {/* Description - Hidden on Mobile */}
            <p className="hidden md:block text-lg text-gray-200 mb-8 leading-relaxed">
              {currentJob.description}
            </p>

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

      {/* Dot Indicators - Hidden on Mobile */}
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

      {/* Slide Counter */}
      <div className="absolute top-2 right-2 md:top-6 md:right-6 bg-black/30 backdrop-blur-sm text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
        {currentSlide + 1} / {featuredJobs.length}
      </div>
    </div>
  );
}
