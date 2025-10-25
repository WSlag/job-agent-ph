'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import JobPostingForm from '@/components/jobs/JobPostingForm'
import Card from '@/components/ui/Card'
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced'

export default function PostJobPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user is logged in and is an agency
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else if (userProfile?.userType !== 'agency') {
        router.push('/jobs')
      } else {
        setIsAuthorized(true)
      }
    }
  }, [user, userProfile, loading, router])

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <HeaderDesign1Enhanced hideSearch />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-gray-600">
            Fill out the details below to create a job posting for candidates
          </p>
        </div>

        <Card>
          <JobPostingForm />
        </Card>
      </div>
    </div>
  )
}
