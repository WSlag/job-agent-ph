'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import {
  Search,
  MapPin,
  Globe,
  Building2,
  Users,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Star,
  Sparkles,
  Clock,
  DollarSign,
  UserCheck,
  Bookmark,
  Briefcase,
} from 'lucide-react';
import HeroCarousel from '@/components/ui/HeroCarousel';
import Logo from '@/components/ui/Logo';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      setLoading(true);
      const jobsRef = collection(db, COLLECTIONS.JOBS);
      const q = query(
        jobsRef,
        where('isActive', '==', true),
        orderBy('postedAt', 'desc'),
        limit(6)
      );

      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt?.toDate() || new Date(),
      })) as Job[];

      setFeaturedJobs(jobsData);
    } catch (error) {
      console.error('Error loading featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (location) params.append('location', location);
    window.location.href = `/jobs${params.toString() ? '?' + params.toString() : ''}`;
  };

  const formatSalary = (job: Job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    return `Up to ${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const categories = [
    { name: 'IT & Software', icon: '💻', count: 1250 },
    { name: 'Healthcare', icon: '🏥', count: 890 },
    { name: 'Engineering', icon: '⚙️', count: 670 },
    { name: 'Finance', icon: '💰', count: 540 },
    { name: 'Marketing', icon: '📱', count: 420 },
    { name: 'Education', icon: '📚', count: 380 },
  ];

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Direct Messaging',
      description: 'Connect directly with recruitment agencies',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Opportunities',
      description: 'Find jobs worldwide from top companies',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Verified Agencies',
      description: 'All agencies are verified and trusted',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Matching',
      description: 'Get personalized job recommendations',
    },
  ];

  return (
    <main className="min-h-screen bg-white w-full">
      {/* Top Banner - Non-sticky, disappears on scroll */}
      {/* Desktop View */}
      <div className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-semibold text-xl">
              <Users className="w-6 h-6" />
              <span>Explore 300,000+ Jobs Now!</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login?type=jobseeker"
                className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full font-semibold text-base hover:bg-white/30 transition-all"
              >
                For Job Hunters
              </Link>
              <Link
                href="/auth/login?type=employer"
                className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full font-semibold text-base hover:bg-white/30 transition-all"
              >
                For Employers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Simple Banner */}
      <div className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 py-4">
        <div className="px-4">
          <h1 className="text-2xl font-bold text-white text-center">
            Explore 100,000+ Jobs Now!
          </h1>
        </div>
      </div>

      {/* Navigation - Sticky */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <Logo size="sm" showText={true} />
              </div>

              {/* Navigation Links - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/jobs"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Find Jobs</span>
                </Link>
                <Link
                  href="/companies"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Companies</span>
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Resources</span>
                </Link>
              </div>
            </div>

            {/* Right Section - Search, Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Bar - Desktop only */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Post a Job Button */}
              <Link
                href="/post-job"
                className="hidden md:inline-flex bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                Post a Job
              </Link>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                U
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-4 md:pt-8 pb-8 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroCarousel />
        </div>
      </section>

      {/* Search Bar Section - Sticky */}
      <div className="sticky top-[56px] md:top-[64px] z-40 bg-white border-b border-gray-200 shadow-md w-full left-0 right-0">
        <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Job Search Input */}
              <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <input
                  type="text"
                  placeholder="Job title or keywords"
                  className="flex-1 outline-none text-sm md:text-base text-gray-900 placeholder-gray-500 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 outline-none text-sm md:text-base text-gray-900 placeholder-gray-500 bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Featured Job Opportunities</h2>
            <p className="text-sm md:text-base text-gray-600 px-4">Discover your next career move with top international employers</p>
          </div>
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading featured jobs...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No jobs available yet. Check back soon!</p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Job Image */}
                  <div className="relative h-32 md:h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                    {job.imageUrl ? (
                      <img
                        src={job.imageUrl}
                        alt={job.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <Briefcase className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold text-blue-600 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span className="hidden md:inline">{getTimeAgo(job.postedAt)}</span>
                      <span className="md:hidden">{getTimeAgo(job.postedAt).split(' ')[0]}</span>
                    </div>
                    <button className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 md:p-2 rounded-full hover:bg-white transition-colors">
                      <Bookmark className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="p-3 md:p-6">
                    {/* Job Type Badge */}
                    <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-semibold">
                        {job.jobType}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-semibold truncate">
                        {job.locationType}
                      </span>
                    </div>

                    {/* Job Title & Company */}
                    <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-xs md:text-base text-gray-600 font-medium mb-2 md:mb-3 flex items-center gap-1 md:gap-2 line-clamp-1">
                      <Building2 className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{job.companyName}</span>
                    </p>

                    {/* Description */}
                    <p className="hidden md:block text-sm text-gray-600 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Location & Salary */}
                    <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                      <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-sm text-gray-700">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-medium truncate">{job.location}, {job.country}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-sm text-gray-700">
                        <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                        <span className="font-semibold text-green-700 truncate">{formatSalary(job)}</span>
                      </div>
                    </div>

                    {/* Experience Required */}
                    <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-gray-500 mb-2 md:mb-4 pb-2 md:pb-4 border-b border-gray-100">
                      <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{job.experienceRequired} years experience</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 md:gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 md:gap-2 group"
                      >
                        <span className="hidden md:inline">View Details</span>
                        <span className="md:hidden">View</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <button className="px-2 md:px-4 border-2 border-blue-600 text-blue-600 rounded-lg md:rounded-xl text-xs md:text-base font-semibold hover:bg-blue-50 transition-all">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Jobs Button */}
            <div className="text-center mt-6 md:mt-12">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-xl"
              >
                View All Job Opportunities
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
            </>
          )}
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600">Explore opportunities in your field</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/jobs?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 hover:border-blue-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.count} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Job Agent PH?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing job hunting with innovative features designed for Filipino professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of Filipinos who found their dream jobs abroad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/jobs"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center gap-2"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo size="md" showText={true} className="[&_span]:!text-white [&_svg]:brightness-150" />
              </div>
              <p className="text-sm text-gray-400">
                Your trusted partner in finding international job opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/employer" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link href="/employer/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Job Agent PH. All rights reserved. Made with ❤️ for Filipinos.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
