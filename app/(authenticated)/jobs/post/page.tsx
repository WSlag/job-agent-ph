'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import JobPostingForm from '@/components/jobs/JobPostingForm'
import Card from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import AgencyDashboardHeader from '@/components/layout/AgencyDashboardHeader'
import MobileNativeHeader from '@/components/layout/MobileNativeHeader'
import { isAgencyProfileComplete, getAgencyMissingDocuments } from '@/lib/profile-helpers'
import { canPostJob } from '@/lib/subscription-helpers'
import { Agency } from '@/types'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import JobLimitBanner from '@/components/subscription/JobLimitBanner'

export default function PostJobPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [profileIncomplete, setProfileIncomplete] = useState(false)
  const [missingDocuments, setMissingDocuments] = useState<string[]>([])
  const [subscriptionCheck, setSubscriptionCheck] = useState<{
    allowed: boolean;
    reason?: string;
    plan: 'free' | 'premium' | 'none';
    currentCount: number;
    limit: number;
  } | null>(null)

  useEffect(() => {
    // Check if user is logged in and is an agency
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login')
      } else if (userProfile?.userType !== 'agency') {
        router.push('/jobs')
      } else {
        checkAuthorization()
      }
    }
  }, [user, userProfile, authLoading, router])

  const checkAuthorization = async () => {
    if (!user) return

    const agency = userProfile as Agency
    const isComplete = isAgencyProfileComplete(agency)

    if (!isComplete) {
      setProfileIncomplete(true)
      setIsAuthorized(false)
      return
    }

    // Check for missing documents (non-blocking reminder)
    const missing = getAgencyMissingDocuments(agency)
    setMissingDocuments(missing)

    // Check subscription limits
    try {
      const subCheck = await canPostJob(user.uid)
      setSubscriptionCheck(subCheck)

      if (!subCheck.allowed) {
        setIsAuthorized(false)
        setProfileIncomplete(false)
      } else {
        setIsAuthorized(true)
        setProfileIncomplete(false)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      setIsAuthorized(true) // Allow posting if check fails
    }
  }

  // Show loading state
  if (authLoading) {
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

  // Show profile incomplete warning (only for truly required fields: companyName, contactPerson, phone)
  if (profileIncomplete) {
    const agency = userProfile as Agency
    const missingRequired = []
    if (!agency.companyName?.trim()) missingRequired.push('Company Name')
    if (!agency.contactPerson?.trim()) missingRequired.push('Contact Person')
    if (!agency.phone?.trim()) missingRequired.push('Phone Number')

    return (
      <>
        <div className="hidden md:block">
          <AgencyDashboardHeader />
        </div>
        <MobileNativeHeader
          title="Post New Job"
          onBack={() => router.back()}
        />
        <div className="min-h-screen bg-gray-50 py-8 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
            <Card>
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Basic Info Required
                </h2>
                <p className="text-gray-600 mb-6">
                  Please add the following to your profile before posting jobs:
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    {missingRequired.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/agency/profile/edit"
                    className="inline-block w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Complete Profile
                  </Link>
                  <button
                    onClick={() => router.back()}
                    className="block w-full md:w-auto md:inline-block px-6 py-3 text-gray-700 font-medium"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </>
    )
  }

  // Show subscription limit reached if not authorized due to subscription
  if (!isAuthorized && subscriptionCheck && !subscriptionCheck.allowed) {
    return (
      <>
        <div className="hidden md:block">
          <AgencyDashboardHeader />
        </div>
        <MobileNativeHeader
          title="Post New Job"
          onBack={() => router.back()}
        />
        <div className="min-h-screen bg-gray-50 py-8 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
            <Card>
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Job Posting Limit Reached
                </h2>
                <p className="text-gray-600 mb-6">
                  {subscriptionCheck.reason}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Upgrade to Premium</h3>
                  <div className="text-left space-y-2 text-sm text-gray-700 mb-4">
                    <p>✓ Unlimited job postings</p>
                    <p>✓ Access to featured job placements</p>
                    <p>✓ Priority support</p>
                    <p className="font-semibold text-blue-600 mt-3">Only ₱5,000/month</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/agency/subscription"
                    className="inline-block w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade to Premium
                  </Link>
                  <button
                    onClick={() => router.back()}
                    className="block w-full md:w-auto md:inline-block px-6 py-3 text-gray-700 font-medium"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </>
    )
  }

  // Show job posting form if authorized
  if (!isAuthorized) {
    return null
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

          {/* Missing documents reminder */}
          {missingDocuments.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Please upload the following documents as soon as possible:
                  </p>
                  <ul className="text-sm text-amber-700 list-disc list-inside mt-1 space-y-0.5">
                    {missingDocuments.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                  <Link
                    href="/agency/profile/edit"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                  >
                    Go to Profile Settings →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Subscription limit banner */}
          {subscriptionCheck && (
            <JobLimitBanner
              currentCount={subscriptionCheck.currentCount}
              limit={subscriptionCheck.limit}
              plan={subscriptionCheck.plan}
            />
          )}

          <Card>
            <JobPostingForm />
          </Card>
        </div>
      </div>
    </>
  )
}
