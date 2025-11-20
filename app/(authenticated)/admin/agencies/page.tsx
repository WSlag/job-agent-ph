'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getAllAgencies, getAgencyVerificationStats, type AgencyVerificationStats } from '@/lib/agency-helpers'
import { Agency } from '@/types'
import AdminDashboardHeader from '@/components/layout/AdminDashboardHeader'
import AdminMobileHeader from '@/components/layout/AdminMobileHeader'
import Card from '@/components/ui/Card'
import AgencyVerificationModal from '@/components/admin/AgencyVerificationModal'
import { Search, Filter, Building2, CheckCircle, XCircle, FileText, Download, ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function AdminAgenciesPage() {
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([])
  const [stats, setStats] = useState<AgencyVerificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [certificationFilter, setCertificationFilter] = useState<'all' | 'complete' | 'incomplete'>('all')
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Check admin authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user || userProfile?.userType !== 'admin') {
        router.push('/admin/login')
      }
    }
  }, [user, userProfile, authLoading, router])

  // Load agencies and stats
  useEffect(() => {
    if (user && userProfile?.userType === 'admin') {
      loadData()
    }
  }, [user, userProfile])

  const loadData = async () => {
    try {
      setLoading(true)
      const [agenciesData, statsData] = await Promise.all([
        getAllAgencies({ limit: 500 }),
        getAgencyVerificationStats(),
      ])
      setAgencies(agenciesData)
      setFilteredAgencies(agenciesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading agencies:', error)
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...agencies]

    // Search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(agency =>
        agency.companyName?.toLowerCase().includes(lowerQuery) ||
        agency.registrationNumber?.toLowerCase().includes(lowerQuery) ||
        agency.contactPerson?.toLowerCase().includes(lowerQuery)
      )
    }

    // Verification filter
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(agency =>
        verificationFilter === 'verified' ? agency.verified : !agency.verified
      )
    }

    // Certification filter
    if (certificationFilter !== 'all') {
      filtered = filtered.filter(agency => {
        const hasBoth = !!agency.dmwLicenseUrl && !!agency.businessPermitUrl
        return certificationFilter === 'complete' ? hasBoth : !hasBoth
      })
    }

    setFilteredAgencies(filtered)
  }, [searchQuery, verificationFilter, certificationFilter, agencies])

  const handleVerificationChange = () => {
    loadData() // Reload data after verification change
    setSelectedAgency(null)
  }

  if (authLoading || loading) {
    return (
      <>
        <div className="hidden md:block">
          <AdminDashboardHeader />
        </div>
        <AdminMobileHeader title="Agencies" />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    )
  }

  if (!user || userProfile?.userType !== 'admin') {
    return null
  }

  return (
    <>
      <div className="hidden md:block">
        <AdminDashboardHeader />
      </div>
      <AdminMobileHeader title="Agencies" />

      <div className="min-h-screen bg-gray-50 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Agency Management
            </h1>
            <p className="mt-2 text-gray-600">
              View and verify agency certifications
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Agencies</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unverified</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.unverified}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Missing DMW</p>
                    <p className="text-2xl font-bold text-red-600">{stats.missingDmwLicense}</p>
                  </div>
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Missing Permit</p>
                    <p className="text-2xl font-bold text-red-600">{stats.missingBusinessPermit}</p>
                  </div>
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company name, registration, or contact person..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters (Desktop - always visible, Mobile - toggleable) */}
              <div className={`flex flex-col sm:flex-row gap-4 ${showFilters || 'max-lg:hidden'}`}>
                {/* Verification Status */}
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>

                {/* Certification Status */}
                <select
                  value={certificationFilter}
                  onChange={(e) => setCertificationFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Certifications</option>
                  <option value="complete">Complete Docs</option>
                  <option value="incomplete">Incomplete Docs</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredAgencies.length} of {agencies.length} agencies
            </div>
          </Card>

          {/* Agencies Table/Cards */}
          <Card>
            {filteredAgencies.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No agencies found</h3>
                <p className="text-gray-600">
                  {searchQuery || verificationFilter !== 'all' || certificationFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No agencies have registered yet'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Verification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Certifications
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAgencies.map((agency) => {
                        const hasDmw = !!agency.dmwLicenseUrl
                        const hasPermit = !!agency.businessPermitUrl
                        const hasAll = hasDmw && hasPermit

                        return (
                          <tr key={agency.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                {agency.logoUrl && (
                                  <Image
                                    src={agency.logoUrl}
                                    alt={agency.companyName}
                                    width={40}
                                    height={40}
                                    className="rounded-lg object-cover"
                                  />
                                )}
                                <div className="font-medium text-gray-900">{agency.companyName}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {agency.registrationNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{agency.contactPerson}</div>
                              <div className="text-sm text-gray-500">{agency.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {agency.verified ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1 w-fit">
                                  <CheckCircle className="w-4 h-4" />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center gap-1 w-fit">
                                  <XCircle className="w-4 h-4" />
                                  Unverified
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${hasDmw ? 'bg-green-500' : 'bg-red-500'}`} title={hasDmw ? 'DMW License uploaded' : 'DMW License missing'} />
                                <span className={`w-2 h-2 rounded-full ${hasPermit ? 'bg-green-500' : 'bg-red-500'}`} title={hasPermit ? 'Business Permit uploaded' : 'Business Permit missing'} />
                                <span className="text-sm text-gray-600">
                                  {hasAll ? 'Complete' : hasDmw || hasPermit ? 'Partial' : 'None'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedAgency(agency)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {filteredAgencies.map((agency) => {
                    const hasDmw = !!agency.dmwLicenseUrl
                    const hasPermit = !!agency.businessPermitUrl
                    const hasAll = hasDmw && hasPermit

                    return (
                      <div key={agency.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            {agency.logoUrl && (
                              <Image
                                src={agency.logoUrl}
                                alt={agency.companyName}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{agency.companyName}</h3>
                              <p className="text-sm text-gray-600">{agency.registrationNumber}</p>
                            </div>
                          </div>
                          {agency.verified ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Unverified
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 mb-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Contact:</span>
                            <span>{agency.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Phone:</span>
                            <span>{agency.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Certifications:</span>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${hasDmw ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className={`w-2 h-2 rounded-full ${hasPermit ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span>{hasAll ? 'Complete' : hasDmw || hasPermit ? 'Partial' : 'None'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedAgency(agency)}
                          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedAgency && (
        <AgencyVerificationModal
          agency={selectedAgency}
          isOpen={!!selectedAgency}
          onClose={() => setSelectedAgency(null)}
          onVerificationChange={handleVerificationChange}
        />
      )}
    </>
  )
}
