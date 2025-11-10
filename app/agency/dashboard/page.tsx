'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { getAgencyJobs } from '@/lib/job-helpers'
import { getAgencyApplications } from '@/lib/application-helpers'
import { Job, JobApplication } from '@/types'
import JobCard from '@/components/jobs/JobCard'
import { Loader2, Briefcase, Users, Clock, CheckCircle, UserCircle, Edit, Star, Home as HomeIcon, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Agency } from '@/types'
import FeaturedRequestModal from '@/components/modals/FeaturedRequestModal'
import AgencyDashboardHeader from '@/components/layout/AgencyDashboardHeader'

// Lazy load RecentMessagesWidget to improve initial load performance
const RecentMessagesWidget = dynamic(
  () => import('@/components/agency/RecentMessagesWidget'),
  {
    loading: () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
)

export default function AgencyDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [showFeaturedModal, setShowFeaturedModal] = useState(false)

  useEffect(() => {
    // Check authentication
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login')
      } else if (userProfile?.userType !== 'agency') {
        router.push('/jobs')
      } else {
        loadDashboardData()
      }
    }
  }, [user, userProfile, authLoading, router])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      // Load jobs and applications in parallel
      const [jobsData, applicationsData] = await Promise.all([
        getAgencyJobs(user.uid),
        getAgencyApplications(user.uid),
      ])

      // Pre-calculate applicant counts for all jobs (batch operation)
      // This eliminates N+1 queries from individual JobCard components
      const counts = jobsData.reduce((acc, job) => {
        acc[job.id] = applicationsData.filter(app => app.jobId === job.id).length
        return acc
      }, {} as Record<string, number>)

      setJobs(jobsData)
      setApplications(applicationsData)
      setApplicantCounts(counts)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20 pt-24">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    )
  }

  const activeJobs = jobs.filter(job => job.isActive).length
  const totalApplications = applications.length
  const pendingApplications = applications.filter(app => app.status === 'pending').length
  const hiredCandidates = applications.filter(app => app.status === 'hired').length

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true

    const search = searchQuery.toLowerCase()
    return (
      job.title.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search) ||
      job.category?.toLowerCase().includes(search) ||
      (job.companyName && job.companyName.toLowerCase().includes(search)) ||
      job.skills.some((skill) => skill.toLowerCase().includes(search))
    )
  })

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set('search', query);
    router.push(`/agency/dashboard?${params.toString()}`);
  };

  return (
    <>
      <AgencyDashboardHeader
        breadcrumbs={[
          { label: 'Dashboard' }
        ]}
        searchPlaceholder="Search your jobs..."
        onSearch={handleSearch}
        showPostJobButton={true}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-20 md:pt-32 pb-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Dashboard</h1>
          <p className="text-gray-600">
            Manage your job postings and track applications
          </p>
        </div>

        {/* Agency Profile Card */}
        {userProfile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <UserCircle size={48} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {(userProfile as Agency).companyName}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {(userProfile as Agency).contactPerson}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Email:</span> {userProfile.email}</p>
                    <p><span className="font-medium">Phone:</span> {(userProfile as Agency).phone}</p>
                    <p><span className="font-medium">Registration:</span> {(userProfile as Agency).registrationNumber}</p>
                  </div>
                </div>
              </div>
              <Link
                href="/agency/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                <Edit size={18} />
                Edit Profile
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{activeJobs}</p>
            <p className="text-xs text-gray-500 mt-1">out of {jobs.length} total</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
            <p className="text-xs text-gray-500 mt-1">across all jobs</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-gray-900">{pendingApplications}</p>
            <p className="text-xs text-gray-500 mt-1">awaiting action</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Hired</p>
            <p className="text-3xl font-bold text-gray-900">{hiredCandidates}</p>
            <p className="text-xs text-gray-500 mt-1">successful hires</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/jobs/post')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Briefcase size={20} />
              Post New Job
            </button>
            <button
              onClick={() => setShowFeaturedModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors flex items-center gap-2"
            >
              <Star size={20} />
              Request Featured Job
            </button>
            {pendingApplications > 0 && (
              <button
                onClick={() => {
                  // Navigate to the first job with pending applications
                  const firstJobWithPending = jobs.find(job => {
                    const jobApps = applications.filter(app => app.jobId === job.id)
                    return jobApps.some(app => app.status === 'pending')
                  })
                  if (firstJobWithPending) {
                    router.push(`/jobs/${firstJobWithPending.id}/applicants`)
                  }
                }}
                className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
              >
                Review Pending Applications
              </button>
            )}
          </div>
        </div>

        {/* Recent Messages Widget */}
        <div className="mb-8">
          <RecentMessagesWidget />
        </div>

        {/* Active Job Postings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Job Postings
              {searchQuery && (
                <span className="text-base font-normal text-gray-600 ml-2">
                  ({filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'} for "{searchQuery}")
                </span>
              )}
            </h2>
            {searchQuery && (
              <button
                onClick={() => router.push('/agency/dashboard')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} applicantCount={applicantCounts[job.id] || 0} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-6">
                No jobs match your search for "{searchQuery}". Try a different search term.
              </p>
              <button
                onClick={() => router.push('/agency/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Postings Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by creating your first job posting to attract candidates.
              </p>
              <button
                onClick={() => router.push('/jobs/post')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Request Modal */}
      <FeaturedRequestModal
        isOpen={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        onSuccess={() => {
          // Reload dashboard data to show updated status
          loadDashboardData()
        }}
      />
    </div>
    </>
  )
}
