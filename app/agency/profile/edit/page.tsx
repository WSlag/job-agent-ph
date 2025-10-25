'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Agency } from '@/types'
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced'
import AgencyProfileEditForm from '@/components/profile/AgencyProfileEditForm'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditAgencyProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login')
      } else if (!userProfile || userProfile.userType !== 'agency') {
        router.push('/jobs')
      } else {
        setLoading(false)
      }
    }
  }, [user, userProfile, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderDesign1Enhanced hideSearch />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderDesign1Enhanced hideSearch />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold mb-4">{error}</p>
            <Link
              href="/agency/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDesign1Enhanced hideSearch />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/agency/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Agency Profile</h1>
          <p className="text-gray-600 mt-2">
            Update your agency information and contact details
          </p>
        </div>

        {/* Edit Form */}
        <AgencyProfileEditForm agency={userProfile as Agency} />
      </div>
    </div>
  )
}
