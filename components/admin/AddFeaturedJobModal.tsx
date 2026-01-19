'use client'

import { useState, useEffect } from 'react'
import { Job } from '@/types'
import {
  addFeaturedJob,
  getAvailableJobsForFeaturing,
  getFeaturedJobs,
} from '@/lib/featured-job-helpers'
import { useAuth } from '@/contexts/AuthContext'
import {
  X,
  Search,
  Loader2,
  Star,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AddFeaturedJobModalProps {
  isOpen: boolean
  onClose: () => void
  onJobAdded: () => void
  currentFeaturedCount: number
}

export default function AddFeaturedJobModal({
  isOpen,
  onClose,
  onJobAdded,
  currentFeaturedCount,
}: AddFeaturedJobModalProps) {
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<number>(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usedPriorities, setUsedPriorities] = useState<number[]>([])

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      loadJobs()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [availableJobs, featuredJobs] = await Promise.all([
        getAvailableJobsForFeaturing(searchQuery),
        getFeaturedJobs(),
      ])
      setJobs(availableJobs)
      const priorities = featuredJobs.map((j) => j.featuredPriority || 0)
      setUsedPriorities(priorities)

      const availablePriority = getNextAvailablePriority(priorities)
      setSelectedPriority(availablePriority)
    } catch (err) {
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async () => {
    try {
      const availableJobs = await getAvailableJobsForFeaturing(searchQuery)
      setJobs(availableJobs)
    } catch (err) {
      console.error('Error loading jobs:', err)
    }
  }

  const getNextAvailablePriority = (used: number[]): number => {
    for (let i = 1; i <= 5; i++) {
      if (!used.includes(i)) return i
    }
    return 1
  }

  const handleAddJob = async () => {
    if (!selectedJob || !user?.uid) return

    setAdding(true)
    setError(null)

    try {
      const priority = selectedPriority || getNextAvailablePriority(usedPriorities)
      await addFeaturedJob(selectedJob.id, priority, user.uid)

      toast.success(
        `"${selectedJob.title}" added to featured carousel at position ${priority}`
      )

      setSelectedJob(null)
      setSearchQuery('')

      onJobAdded()
      onClose()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add job to featured'
      setError(message)
      toast.error(message)
    } finally {
      setAdding(false)
    }
  }

  const handleClose = () => {
    if (adding) return
    setSelectedJob(null)
    setSearchQuery('')
    setError(null)
    onClose()
  }

  const formatSalary = (job: Job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable'
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    }
    if (job.salaryMin) return `${job.currency} ${job.salaryMin.toLocaleString()}+`
    return `${job.currency} ${job.salaryMax?.toLocaleString()}`
  }

  if (!isOpen) return null

  const availableSlots = 5 - currentFeaturedCount

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Featured Job</h2>
              <p className="text-sm text-gray-500">
                {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={adding}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={36} />
              <p className="text-gray-600">Loading available jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="text-gray-300 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Jobs Available
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'No jobs match your search. Try a different search term.'
                  : 'All active jobs are already featured or no active jobs exist.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Building2 size={14} />
                        <span>{job.companyName}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>
                            {job.location}, {job.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>{formatSalary(job)}</span>
                        </div>
                      </div>
                    </div>
                    {selectedJob?.id === job.id && (
                      <CheckCircle className="text-blue-600 flex-shrink-0" size={24} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Priority Selection */}
          {selectedJob && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Carousel Position
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((p) => {
                  const isUsed = usedPriorities.includes(p)
                  const isSelected = selectedPriority === p
                  return (
                    <button
                      key={p}
                      onClick={() => !isUsed && setSelectedPriority(p)}
                      disabled={isUsed}
                      className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isUsed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={isUsed ? 'Position already taken' : `Position ${p}`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Position 1 appears first in the carousel. Grayed positions are already
                taken.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
          <div className="text-sm text-gray-600">
            {selectedJob ? (
              <span>
                Selected: <strong>{selectedJob.title}</strong>
              </span>
            ) : (
              <span>Select a job to add to featured</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              disabled={adding}
              className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddJob}
              disabled={adding || !selectedJob}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {adding ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Adding...
                </>
              ) : (
                <>
                  <Star size={16} />
                  Add to Featured
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
