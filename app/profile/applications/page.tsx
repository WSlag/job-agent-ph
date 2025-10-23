'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeToJobHunterApplications } from '@/lib/application-helpers'
import { JobApplication, ApplicationStatus } from '@/types'
import Header from '@/components/layout/Header'
import ApplicationCard from '@/components/applications/ApplicationCard'
import { Loader2, Briefcase, Filter } from 'lucide-react'

export default function ApplicationsPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')

  useEffect(() => {
    // Check authentication
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login')
      } else if (userProfile?.userType !== 'jobhunter') {
        router.push('/jobs')
      }
    }
  }, [user, userProfile, authLoading, router])

  useEffect(() => {
    if (!user || userProfile?.userType !== 'jobhunter') return

    // Subscribe to real-time updates
    const unsubscribe = subscribeToJobHunterApplications(user.uid, (apps) => {
      setApplications(apps)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, userProfile])

  useEffect(() => {
    // Filter applications by status
    if (statusFilter === 'all') {
      setFilteredApplications(applications)
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter))
    }
  }, [applications, statusFilter])

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

  const getStatusCount = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status).length
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">
            Track the status of all your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
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
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <span className="text-sm text-gray-600 ml-auto">
              Showing {filteredApplications.length} of {applications.length} applications
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
                viewType="jobhunter"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No Applications Yet' : `No ${statusFilter} Applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all'
                ? 'Start applying to jobs to see your applications here.'
                : `You don't have any ${statusFilter} applications at the moment.`}
            </p>
            {statusFilter === 'all' && (
              <button
                onClick={() => router.push('/jobs')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
