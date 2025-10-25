'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { hasAppliedToJob } from '@/lib/application-helpers';
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced';
import ApplicationModal from '@/components/applications/ApplicationModal';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
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

  useEffect(() => {
    loadJob();
  }, [params.id]);

  useEffect(() => {
    checkApplicationStatus();
  }, [params.id, user]);

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
      }
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
    <div className="min-h-screen bg-gray-50 pt-16">
      <HeaderDesign1Enhanced hideSearch />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
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

                {/* Job Type Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-blue-600 shadow-lg border border-blue-100">
                    {job.jobType.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

                <div className="flex items-center gap-2 text-xl text-gray-700 mb-6">
                  <Building2 size={24} />
                  {job.companyName}
                </div>

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
                    {job.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              {hasApplied ? (
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-4 rounded-lg mb-3">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Application Submitted</span>
                  </div>
                  <button
                    onClick={() => router.push('/profile/applications')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Application
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={checkingApplication}
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingApplication ? 'Checking...' : 'Apply Now'}
                </button>
              )}

              {/* Message Agency Button - Full Width for Job Hunters */}
              {userType === 'jobhunter' && (
                <button
                  onClick={handleMessageAgency}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-colors mb-3 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Message Agency
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSaveJob}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isSaved
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} className={isSaved ? 'fill-red-600' : ''} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
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
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
