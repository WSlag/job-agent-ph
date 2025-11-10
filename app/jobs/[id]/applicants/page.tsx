'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { getDbInstance } from '@/lib/firebase'
import { COLLECTIONS } from '@/lib/collections'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeToJobApplications, updateApplicationStatus } from '@/lib/application-helpers'
import { JobApplication, Job, ApplicationStatus } from '@/types'
import ApplicationCard from '@/components/applications/ApplicationCard'
import { Loader2, Users, ArrowLeft, Briefcase, Filter } from 'lucide-react'

export default function JobApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')

  useEffect(() => {
    // Check authentication
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login')
      } else if (userProfile?.userType !== 'agency') {
        router.push('/jobs')
      } else {
        loadJob()
      }
    }
  }, [user, userProfile, authLoading, params.id, router])

  useEffect(() => {
    if (!user || userProfile?.userType !== 'agency' || !params.id) return

    // Subscribe to real-time updates for applications
    const unsubscribe = subscribeToJobApplications(params.id as string, (apps) => {
      setApplications(apps)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, userProfile, params.id])

  useEffect(() => {
    // Filter applications by status
    if (statusFilter === 'all') {
      setFilteredApplications(applications)
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter))
    }
  }, [applications, statusFilter])

  const loadJob = async () => {
    try {
      const jobId = params.id as string
      const db = getDbInstance()
      const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, jobId))

      if (jobDoc.exists()) {
        const jobData = {
          id: jobDoc.id,
          ...jobDoc.data(),
          postedAt: jobDoc.data().postedAt?.toDate() || new Date(),
        } as Job

        // Verify this job belongs to the current agency
        if (jobData.agencyId !== user?.uid) {
          router.push('/jobs')
          return
        }

        setJob(jobData)
      } else {
        router.push('/jobs')
      }
    } catch (error) {
      console.error('Error loading job:', error)
      router.push('/jobs')
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus)
      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('Error updating application status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  if (authLoading || loading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    )
  }

  const getStatusCount = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status).length
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase size={32} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600 mb-4">
                {job.companyName} • {job.location}, {job.country}
              </p>
              <button
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Job Posting →
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-4xl font-bold text-blue-600">{applications.length}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{getStatusCount('pending')}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">Reviewing</p>
            <p className="text-2xl font-bold text-blue-700">{getStatusCount('reviewing')}</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 mb-1">Shortlisted</p>
            <p className="text-2xl font-bold text-purple-700">{getStatusCount('shortlisted')}</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-700">{getStatusCount('rejected')}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Hired</p>
            <p className="text-2xl font-bold text-green-700">{getStatusCount('hired')}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Applicants</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <span className="text-sm text-gray-600 ml-auto">
              Showing {filteredApplications.length} of {applications.length} applicants
            </span>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                viewType="agency"
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No Applications Yet' : `No ${statusFilter} Applications`}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all'
                ? 'When job hunters apply to this position, they will appear here.'
                : `There are no ${statusFilter} applications for this job.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
