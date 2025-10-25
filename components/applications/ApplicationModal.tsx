'use client'

import { useState } from 'react'
import { X, Upload, FileText, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createApplication, uploadResume, hasAppliedToJob } from '@/lib/application-helpers'
import { getOrCreateConversation } from '@/lib/messaging-helpers'
import Button from '@/components/ui/Button'

interface ApplicationModalProps {
  jobId: string
  agencyId: string
  jobTitle: string
  onClose: () => void
  onSuccess?: () => void
}

export default function ApplicationModal({
  jobId,
  agencyId,
  jobTitle,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  const { user, userProfile } = useAuth()
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [useExistingResume, setUseExistingResume] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const existingResumeUrl = userProfile && 'resumeUrl' in userProfile ? userProfile.resumeUrl : undefined

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }

      setResumeFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userProfile) {
      setError('You must be logged in to apply')
      return
    }

    if (userProfile.userType !== 'jobhunter') {
      setError('Only job hunters can apply to jobs')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Check if already applied (first check)
      const alreadyApplied = await hasAppliedToJob(jobId, user.uid)
      if (alreadyApplied) {
        setError('You have already applied to this job')
        setLoading(false)
        return
      }

      // Upload resume if new file provided
      let resumeUrl = useExistingResume ? existingResumeUrl : undefined
      if (!useExistingResume && resumeFile) {
        resumeUrl = await uploadResume(resumeFile, user.uid)
      }

      // Create or get conversation
      const conversationId = await getOrCreateConversation(
        jobId,
        user.uid,
        agencyId
      )

      // Double-check before creating application (prevent race condition)
      const stillNotApplied = await hasAppliedToJob(jobId, user.uid)
      if (stillNotApplied) {
        setError('You have already applied to this job')
        setLoading(false)
        return
      }

      // Create application
      await createApplication({
        jobId,
        jobHunterId: user.uid,
        agencyId,
        coverLetter: coverLetter.trim() || undefined,
        resumeUrl,
        conversationId,
      })

      // Success
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err: any) {
      console.error('Error submitting application:', err)
      // Handle duplicate application error gracefully
      if (err.message && err.message.toLowerCase().includes('already applied')) {
        setError('You have already applied to this job')
      } else {
        setError(err.message || 'Failed to submit application. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
            <p className="text-sm text-gray-600 mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell the employer why you're a great fit for this position..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {coverLetter.length} characters
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Resume
            </label>

            {/* Existing Resume Option */}
            {existingResumeUrl && (
              <div className="mb-4">
                <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    checked={useExistingResume}
                    onChange={() => {
                      setUseExistingResume(true)
                      setResumeFile(null)
                    }}
                    className="h-4 w-4 text-blue-600"
                  />
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Use existing resume</p>
                    <p className="text-xs text-gray-500">From your profile</p>
                  </div>
                </label>
              </div>
            )}

            {/* Upload New Resume Option */}
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                checked={!useExistingResume}
                onChange={() => setUseExistingResume(false)}
                className="h-4 w-4 text-blue-600"
              />
              <Upload className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Upload new resume</p>
                <p className="text-xs text-gray-500">PDF or Word (Max 5MB)</p>
              </div>
            </label>

            {/* File Input */}
            {!useExistingResume && (
              <div className="mt-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {resumeFile && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              After submitting, you can message the employer directly to discuss your application.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (!useExistingResume && !resumeFile && !existingResumeUrl)}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
