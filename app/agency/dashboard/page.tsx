'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getAgencyJobs } from '@/lib/job-helpers'
import { getAgencyApplications } from '@/lib/application-helpers'
import { Job, JobApplication } from '@/types'
import Header from '@/components/layout/Header'
import JobCard from '@/components/jobs/JobCard'
import { Loader2, Briefcase, Users, Clock, CheckCircle } from 'lucide-react'

export default function AgencyDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)

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

      setJobs(jobsData)
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    )
  }

  const activeJobs = jobs.filter(job => job.isActive).length
  const totalApplications = applications.length
  const pendingApplications = applications.filter(app => app.status === 'pending').length
  const hiredCandidates = applications.filter(app => app.status === 'hired').length

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Dashboard</h1>
          <p className="text-gray-600">
            Manage your job postings and track applications
          </p>
        </div>

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
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/jobs/post')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Post New Job
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

        {/* Active Job Postings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
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
    </div>
  )
}
