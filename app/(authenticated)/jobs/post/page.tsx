'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import JobPostingForm from '@/components/jobs/JobPostingForm'
import Card from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import AgencyDashboardHeader from '@/components/layout/AgencyDashboardHeader'
import MobileNativeHeader from '@/components/layout/MobileNativeHeader'

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
      <>
        <div className="hidden md:block">
          <AgencyDashboardHeader />
        </div>
        <MobileNativeHeader
          title="Post New Job"
          onBack={() => router.back()}
        />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <AgencyDashboardHeader />
      </div>
      <MobileNativeHeader
        title="Post New Job"
        onBack={() => router.back()}
      />
      <div className="min-h-screen bg-gray-50 py-8 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 relative z-10">
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
    </>
  )
}
