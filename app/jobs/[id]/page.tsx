'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { hasAppliedToJob } from '@/lib/application-helpers';
import { calculateJobMatch, getPlaceholderJobData } from '@/lib/placeholder-data';
import { trackJobView } from '@/lib/job-view-helpers';
import type { JobMatch, JobHunter } from '@/types';
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced';
import ApplicationModal from '@/components/applications/ApplicationModal';
import JobRequirementsList from '@/components/jobs/JobRequirementsList';
import JobBenefitsList from '@/components/jobs/JobBenefitsList';
import JobLocationMap from '@/components/jobs/JobLocationMap';
import SimilarJobsCarousel from '@/components/jobs/SimilarJobsCarousel';
import JobMatchBadge from '@/components/jobs/JobMatchBadge';
import AgencyInfoCard from '@/components/jobs/AgencyInfoCard';
import ScrollToTop from '@/components/ui/ScrollToTop';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Heart,
  Share2,
  ArrowLeft,
  Loader2,
  CheckCircle,
  MessageCircle,
  Home,
  ChevronRight,
  Star,
  Eye,
  Users,
  FileText,
  AlertCircle,
  Linkedin,
  Facebook,
  Twitter,
  MoreVertical,
  Instagram,
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userType } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [userProfile, setUserProfile] = useState<JobHunter | null>(null);
  const [isQuickApplying, setIsQuickApplying] = useState(false);

  useEffect(() => {
    loadJob();
  }, [params.id]);

  useEffect(() => {
    checkApplicationStatus();
  }, [params.id, user]);

  useEffect(() => {
    loadUserProfile();
  }, [user, userType]);

  useEffect(() => {
    // Check if job is saved
    if (params.id) {
      const saved = localStorage.getItem('savedJobs');
      if (saved) {
        const savedJobs = JSON.parse(saved);
        setIsSaved(savedJobs.includes(params.id));
      }
    }
  }, [params.id]);

  useEffect(() => {
    // Calculate job match for job hunters
    if (job && userProfile) {
      const match = calculateJobMatch(userProfile, job);
      setJobMatch(match);
    }
  }, [job, userProfile]);

  useEffect(() => {
    // Track job view
    if (job) {
      trackJobView(job.id, user?.uid);
    }
  }, [job, user]);

  const loadJob = async () => {
    try {
      const jobId = params.id as string;
      const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, jobId));

      if (jobDoc.exists()) {
        setJob({
          id: jobDoc.id,
          ...jobDoc.data(),
          postedAt: jobDoc.data().postedAt?.toDate() || new Date(),
        } as Job);
      }
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user || userType !== 'jobhunter') {
      setUserProfile(null);
      return;
    }

    try {
      const profileDoc = await getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, user.uid));
      if (profileDoc.exists()) {
        setUserProfile({
          id: profileDoc.id,
          ...profileDoc.data(),
        } as JobHunter);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkApplicationStatus = async () => {
    if (!user || userType !== 'jobhunter' || !params.id) return;

    setCheckingApplication(true);
    try {
      const applied = await hasAppliedToJob(params.id as string, user.uid);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      // Show login prompt
      setShowAuthPrompt(true);
    } else if (userType === 'jobhunter') {
      if (hasApplied) {
        // Navigate to applications page
        router.push('/profile/applications');
      } else {
        // Show application modal
        setShowApplicationModal(true);
      }
    } else {
      alert('Only job hunters can apply to jobs');
    }
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    setShowApplicationModal(false);
  };

  const handleQuickApply = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (userType !== 'jobhunter') {
      alert('Only job hunters can apply to jobs');
      return;
    }

    if (hasApplied) {
      router.push('/profile/applications');
      return;
    }

    // Check if user has a resume in their profile
    if (!userProfile?.resumeUrl) {
      alert('Please add a resume to your profile first or use the Apply Now button to upload one.');
      return;
    }

    setIsQuickApplying(true);

    try {
      // Import application helper
      const { createApplication } = await import('@/lib/application-helpers');

      // Create application with existing resume and empty cover letter
      await createApplication({
        jobId: job!.id,
        jobHunterId: user.uid,
        agencyId: job!.agencyId,
        jobTitle: job!.title,
        coverLetter: '', // Quick apply doesn't require cover letter
        resumeUrl: userProfile.resumeUrl,
      });

      setHasApplied(true);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting quick application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsQuickApplying(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.companyName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!job) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this job: ${job.title} at ${job.companyName}`);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct web sharing, so we'll copy the link
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied! You can now share it on Instagram.');
        setShowShareModal(false);
        return;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        setShowShareModal(false);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareModal(false);
    }
  };

  const handleMessageAgency = () => {
    if (!user) {
      setShowAuthPrompt(true);
    } else if (userType === 'jobhunter' && job) {
      router.push(`/messages?jobId=${job.id}&agencyId=${job.agencyId}`);
    } else {
      alert('Only job hunters can message agencies');
    }
  };

  const handleSaveJob = () => {
    if (!params.id) return;

    const saved = localStorage.getItem('savedJobs');
    let savedJobs: string[] = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      // Remove from saved jobs
      savedJobs = savedJobs.filter(id => id !== params.id);
      setIsSaved(false);
    } else {
      // Add to saved jobs
      savedJobs.push(params.id as string);
      setIsSaved(true);
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <HeaderDesign1Enhanced hideSearch />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <HeaderDesign1Enhanced hideSearch />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <button
            onClick={() => router.push('/jobs')}
            className="text-blue-600 hover:underline"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 pt-0 lg:pt-16 pb-24 lg:pb-8">
      <div className="hidden lg:block">
        <HeaderDesign1Enhanced hideSearch />
      </div>

      {/* Mobile Compact Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Save Button */}
            <button
              onClick={handleSaveJob}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all ${
                isSaved
                  ? 'text-red-600 border-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Heart size={18} className={isSaved ? 'fill-red-600' : ''} />
              <span className="text-sm font-medium">Save</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-8 pt-16 lg:pt-8">
        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-2 text-sm mb-6"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home size={16} />
            Home
          </button>
          <ChevronRight size={16} className="text-gray-400" />
          <button
            onClick={() => router.push('/jobs')}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Jobs
          </button>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {job.title}
          </span>
        </motion.nav>

        {/* Back Button - Desktop Only */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Job Image */}
              <div className="relative w-full h-48 md:h-64 bg-gray-200 overflow-hidden">
                {job.imageUrl && !imageError ? (
                  <Image
                    src={job.imageUrl}
                    alt={`${job.companyName} - ${job.title}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
                    <Briefcase size={96} className="text-white opacity-60" />
                  </div>
                )}

                {/* Featured Badge */}
                {job.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                      <Star size={16} className="fill-white" />
                      FEATURED
                    </span>
                  </div>
                )}

                {/* Job Type Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-blue-600 shadow-lg border border-blue-100">
                    {job.jobType.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* View Count */}
                {job.viewCount !== undefined && job.viewCount > 0 && (
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <Eye size={14} />
                      {job.viewCount} views
                    </span>
                  </div>
                )}
              </div>

              {/* Job Details */}
              <div className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 flex-1">{job.title}</h1>
                  {jobMatch && (
                    <JobMatchBadge match={jobMatch} />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xl text-gray-700 mb-2">
                  <Building2 size={24} />
                  {job.companyName}
                </div>

                {job.category && (
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      <Briefcase size={14} />
                      {job.category}
                    </span>
                  </div>
                )}

                {/* Job Info Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {job.location}, {job.country}
                      </p>
                    </div>
                  </div>

                  {salary && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <DollarSign size={20} className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-semibold text-green-600">{salary}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {job.experienceRequired === 0
                          ? 'No experience required'
                          : `${job.experienceRequired}+ years`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(job.postedAt))} ago
                      </p>
                    </div>
                  </div>

                  {job.applicationCount !== undefined && job.applicationCount > 0 && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users size={20} className="text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Applications</p>
                        <p className="font-medium">
                          {job.applicationCount} {job.applicationCount === 1 ? 'application' : 'applications'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.description.length > 300 && !expandedDescription
                      ? `${job.description.substring(0, 300)}...`
                      : job.description}
                  </div>
                  {job.description.length > 300 && (
                    <button
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors"
                    >
                      {expandedDescription ? 'Read Less' : 'Read More'}
                      <ChevronRight
                        size={16}
                        className={`transform transition-transform ${
                          expandedDescription ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Requirements Section */}
            {job.requirements && job.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <JobRequirementsList
                  requirements={job.requirements}
                  matchingRequirements={jobMatch?.matchingSkills}
                />
              </motion.div>
            )}

            {/* Benefits Section */}
            {job.benefits && job.benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <JobBenefitsList benefits={job.benefits} />
              </motion.div>
            )}

            {/* Additional Details Section */}
            {(job.contractDuration || job.vacancies !== undefined) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText size={24} className="text-blue-600" />
                  Additional Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {job.contractDuration && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={20} className="text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Contract Duration</p>
                        <p className="font-medium">{job.contractDuration}</p>
                      </div>
                    </div>
                  )}
                  {job.vacancies !== undefined && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users size={20} className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Open Positions</p>
                        <p className="font-medium">
                          {job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Agency Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <AgencyInfoCard agencyId={job.agencyId} onMessageClick={handleMessageAgency} />
            </motion.div>

            {/* Location Map Section */}
            {job.location && job.country && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <JobLocationMap
                  location={job.location}
                  country={job.country}
                  coordinates={job.coordinates}
                />
              </motion.div>
            )}

            {/* Similar Jobs Carousel */}
            {job.category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <SimilarJobsCarousel
                  currentJobId={job.id}
                  category={job.category}
                  country={job.country}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block col-span-1 lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 sticky top-24"
            >
              {hasApplied ? (
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-4 rounded-lg">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Application Submitted</span>
                  </div>
                  <button
                    onClick={() => router.push('/profile/applications')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Application
                  </button>

                  {/* Message Agency Button - Always Visible */}
                  <button
                    onClick={handleMessageAgency}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Message Agency
                  </button>
                </div>
              ) : (
                <div className="mb-4 space-y-3">
                  {/* Quick Apply Button - Only show if user has resume */}
                  {userProfile?.resumeUrl && (
                    <button
                      onClick={handleQuickApply}
                      disabled={checkingApplication || isQuickApplying}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {isQuickApplying ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Quick Apply
                        </>
                      )}
                    </button>
                  )}

                  {/* Apply Now Button */}
                  <button
                    onClick={handleApply}
                    disabled={checkingApplication || isQuickApplying}
                    className={`w-full ${
                      userProfile?.resumeUrl
                        ? 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {checkingApplication ? 'Checking...' : 'Apply Now'}
                  </button>

                  {/* Message Agency Button - Always Visible */}
                  <button
                    onClick={handleMessageAgency}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Message Agency
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSaveJob}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                    isSaved
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  <Heart size={20} className={isSaved ? 'fill-red-600' : ''} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-100 transition-all font-medium hover:scale-105"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Job Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Job Type:</span>
                    <span className="ml-2 font-medium">
                      {job.jobType.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location Type:</span>
                    <span className="ml-2 font-medium capitalize">
                      {job.locationType.replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Country:</span>
                    <span className="ml-2 font-medium">{job.country}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Share this job</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Share2 size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Share this job opportunity with your network
            </p>

            <div className="grid gap-3">
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center gap-3 bg-[#1877f2] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#0d65d9] transition-colors"
              >
                <Facebook size={24} />
                Share on Facebook
              </button>

              <button
                onClick={() => handleSocialShare('instagram')}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-colors"
              >
                <Instagram size={24} />
                Share on Instagram
              </button>

              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#1faa52] transition-colors"
              >
                <MessageCircle size={24} />
                Share on WhatsApp
              </button>

              <button
                onClick={() => handleSocialShare('copy')}
                className="flex items-center gap-3 bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Share2 size={24} />
                Copy Link
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Sign in to Apply</h2>
            <p className="text-gray-600 mb-6">
              You need to create an account or sign in to apply for this job.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(`/auth/signup?type=jobhunter&redirect=/jobs/${params.id}`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => router.push(`/auth/login?redirect=/jobs/${params.id}`)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && job && (
        <ApplicationModal
          jobId={job.id}
          agencyId={job.agencyId}
          jobTitle={job.title}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
        <div className="flex gap-3 max-w-lg mx-auto">
          {hasApplied ? (
            <button
              onClick={() => router.push('/profile/applications')}
              className="flex-1 bg-green-600 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              View Application
            </button>
          ) : (
            <>
              {/* Message to Agency Button */}
              <button
                onClick={handleMessageAgency}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3.5 rounded-lg font-semibold text-sm whitespace-nowrap hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                <span>Message Agency</span>
              </button>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={checkingApplication}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3.5 rounded-lg font-semibold text-sm whitespace-nowrap hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkingApplication ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Apply Now</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scroll to Top Component */}
      <ScrollToTop />
    </div>
  );
}
