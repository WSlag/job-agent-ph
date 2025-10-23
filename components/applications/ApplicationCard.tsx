'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { COLLECTIONS } from '@/lib/collections'
import { JobApplication, Job, JobHunter, ApplicationStatus } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import {
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  FileText,
  MessageSquare,
  ExternalLink,
  User,
} from 'lucide-react'
import Badge from '@/components/ui/Badge'

interface ApplicationCardProps {
  application: JobApplication
  viewType: 'jobhunter' | 'agency'
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => void
}

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string; bgColor: string }> = {
  pending: { color: 'text-yellow-700', label: 'Pending', bgColor: 'bg-yellow-50 border-yellow-200' },
  reviewing: { color: 'text-blue-700', label: 'Under Review', bgColor: 'bg-blue-50 border-blue-200' },
  shortlisted: { color: 'text-purple-700', label: 'Shortlisted', bgColor: 'bg-purple-50 border-purple-200' },
  rejected: { color: 'text-red-700', label: 'Rejected', bgColor: 'bg-red-50 border-red-200' },
  hired: { color: 'text-green-700', label: 'Hired', bgColor: 'bg-green-50 border-green-200' },
}

export default function ApplicationCard({ application, viewType, onStatusChange }: ApplicationCardProps) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [jobHunter, setJobHunter] = useState<JobHunter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDetails()
  }, [application])

  const loadDetails = async () => {
    try {
      // Load job details
      const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, application.jobId))
      if (jobDoc.exists()) {
        setJob({
          id: jobDoc.id,
          ...jobDoc.data(),
          postedAt: jobDoc.data().postedAt?.toDate() || new Date(),
        } as Job)
      }

      // Load job hunter details if agency view
      if (viewType === 'agency') {
        const hunterDoc = await getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, application.jobHunterId))
        if (hunterDoc.exists()) {
          setJobHunter({
            id: hunterDoc.id,
            ...hunterDoc.data(),
            createdAt: hunterDoc.data().createdAt?.toDate() || new Date(),
            updatedAt: hunterDoc.data().updatedAt?.toDate() || new Date(),
          } as JobHunter)
        }
      }
    } catch (error) {
      console.error('Error loading details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewJob = () => {
    router.push(`/jobs/${application.jobId}`)
  }

  const handleViewConversation = () => {
    if (application.conversationId) {
      router.push(`/messages/${application.conversationId}`)
    }
  }

  const statusConfig = STATUS_CONFIG[application.status]

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 ${statusConfig.bgColor} hover:shadow-lg transition-shadow`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer" onClick={handleViewJob}>
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Building2 size={18} />
              <span className="font-medium">{job.companyName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{job.location}, {job.country}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color} bg-white border-2`}>
            {statusConfig.label}
          </div>
        </div>

        {/* Job Hunter Info (Agency View) */}
        {viewType === 'agency' && jobHunter && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <User size={20} className="text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {jobHunter.firstName} {jobHunter.lastName}
                </p>
                <p className="text-sm text-gray-600">{jobHunter.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {jobHunter.experience} years exp.
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {jobHunter.location}
              </span>
            </div>
            {jobHunter.skills && jobHunter.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {jobHunter.skills.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
                {jobHunter.skills.length > 5 && (
                  <span className="text-xs text-gray-500">+{jobHunter.skills.length - 5} more</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cover Letter Preview */}
        {application.coverLetter && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Cover Letter</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-3">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Application Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Applied {formatDistanceToNow(new Date(application.appliedAt))} ago</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {application.resumeUrl && (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <FileText size={16} />
              View Resume
              <ExternalLink size={14} />
            </a>
          )}

          {application.conversationId && (
            <button
              onClick={handleViewConversation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <MessageSquare size={16} />
              Message
            </button>
          )}

          <button
            onClick={handleViewJob}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium ml-auto"
          >
            <Briefcase size={16} />
            View Job
          </button>
        </div>

        {/* Status Changer (Agency View Only) */}
        {viewType === 'agency' && onStatusChange && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
