'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import JobPostingForm from '@/components/jobs/JobPostingForm'
import Card from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import AgencyDashboardHeader from '@/components/layout/AgencyDashboardHeader'
import MobileNativeHeader from '@/components/layout/MobileNativeHeader'
import { isAgencyProfileComplete } from '@/lib/profile-helpers'
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

    // Check if profile is complete with certifications
    const agency = userProfile as Agency
    const isComplete = isAgencyProfileComplete(agency)

    if (!isComplete) {
      setProfileIncomplete(true)
      setIsAuthorized(false)
      return
    }

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

  // Show profile incomplete warning
  if (profileIncomplete) {
    const agency = userProfile as Agency
    const missingCertifications = []
    // Check both new multi-file format and legacy single-file format
    const hasDmwLicense = (agency.dmwLicenseFiles && agency.dmwLicenseFiles.length > 0) || Boolean(agency.dmwLicenseUrl)
    const hasBusinessPermit = (agency.businessPermitFiles && agency.businessPermitFiles.length > 0) || Boolean(agency.businessPermitUrl)

    if (!hasDmwLicense) missingCertifications.push('DMW License')
    if (!hasBusinessPermit) missingCertifications.push('Business Permit')

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
                  Profile Incomplete
                </h2>
                <p className="text-gray-600 mb-6">
                  You need to complete your agency profile before posting jobs.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Missing Required Certifications:
                  </p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    {missingCertifications.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                    {!agency.logoUrl && <li>Company Logo</li>}
                    {!agency.companyName?.trim() && <li>Company Name</li>}
                    {!agency.registrationNumber?.trim() && <li>Registration Number</li>}
                    {!agency.contactPerson?.trim() && <li>Contact Person</li>}
                    {!agency.phone?.trim() && <li>Phone Number</li>}
                    {!agency.address?.trim() && <li>Address</li>}
                  </ul>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/agency/profile/edit?reason=certifications"
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
