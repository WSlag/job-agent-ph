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
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, listItemAnimation } from '@/lib/animations';

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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white border-b border-blue-700 relative overflow-hidden"
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 font-semibold text-xl"
            >
              <Users className="w-6 h-6 animate-bounce" />
              <span>Explore 300,000+ Jobs Now!</span>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Link
                href="/auth/login?type=jobseeker"
                className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full font-semibold text-base hover:bg-white/30 hover:scale-105 transition-all shadow-lg"
              >
                For Job Hunters
              </Link>
              <Link
                href="/auth/login?type=employer"
                className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full font-semibold text-base hover:bg-white/30 hover:scale-105 transition-all shadow-lg"
              >
                For Employers
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-4 md:pt-8 pb-8 md:pb-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <HeroCarousel />
        </motion.div>
      </section>

      {/* Search Bar Section - Sticky */}
      <div className="sticky top-[56px] md:top-[64px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-soft w-full left-0 right-0">
        <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Job Search Input */}
              <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-white rounded-xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all shadow-sm hover:shadow-md">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title or keywords"
                  className="flex-1 outline-none text-sm md:text-base text-gray-900 placeholder-gray-500 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-white rounded-xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all shadow-sm hover:shadow-md">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 outline-none text-sm md:text-base text-gray-900 placeholder-gray-500 bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Search Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl text-sm md:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Search
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-12"
          >
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Featured Job Opportunities</h2>
            <p className="text-sm md:text-base text-gray-600 px-4">Discover your next career move with top international employers</p>
          </motion.div>
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
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
              >
                {featuredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    variants={listItemAnimation}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
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
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold text-blue-600 flex items-center gap-1 shadow-lg border border-blue-100">
                        <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span className="hidden md:inline">{getTimeAgo(job.postedAt)}</span>
                        <span className="md:hidden">{getTimeAgo(job.postedAt).split(' ')[0]}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-2 left-2 bg-white/95 backdrop-blur-md p-1 md:p-2 rounded-full hover:bg-white transition-colors shadow-lg border border-gray-100"
                      >
                        <Bookmark className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                      </motion.button>
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
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 md:gap-2 group/btn"
                        >
                          <span className="hidden md:inline">View Details</span>
                          <span className="md:hidden">View</span>
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-2 md:px-4 border-2 border-blue-600 text-blue-600 rounded-lg md:rounded-xl text-xs md:text-base font-semibold hover:bg-blue-50 transition-all"
                        >
                          Save
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* View All Jobs Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mt-6 md:mt-12"
              >
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-xl hover:scale-105"
                >
                  View All Job Opportunities
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </motion.div>
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
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Job Agent PH?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing job hunting with innovative features designed for Filipino professionals
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={listItemAnimation}
                whileHover={{ y: -8, scale: 1.05 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl text-blue-600 mb-4 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all shadow-md group-hover:shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
        {/* Animated decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of Filipinos who found their dream jobs abroad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/jobs"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Browse All Jobs
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-700 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo size="md" showText={true} />
              </div>
              <p className="text-sm text-gray-600">
                Your trusted partner in finding international job opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Jobs</Link></li>
                <li><Link href="/auth/register" className="text-gray-600 hover:text-blue-600 transition-colors">Create Account</Link></li>
                <li><Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">My Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/employer" className="text-gray-600 hover:text-blue-600 transition-colors">Post a Job</Link></li>
                <li><Link href="/employer/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Employer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Job Agent PH. All rights reserved. Made with ❤️ for Filipinos.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
