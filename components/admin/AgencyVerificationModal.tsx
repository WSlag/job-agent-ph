'use client'

import { useState } from 'react'
import { Agency } from '@/types'
import { verifyAgency, revokeAgencyVerification } from '@/lib/agency-helpers'
import { useAuth } from '@/contexts/AuthContext'
import { X, CheckCircle, XCircle, Download, FileText, Shield, Building2, User, Phone, MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'

interface AgencyVerificationModalProps {
  agency: Agency
  isOpen: boolean
  onClose: () => void
  onVerificationChange: () => void
}

export default function AgencyVerificationModal({
  agency,
  isOpen,
  onClose,
  onVerificationChange,
}: AgencyVerificationModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleVerify = async () => {
    if (!user?.uid) return

    setLoading(true)
    setError(null)

    try {
      await verifyAgency(agency.id, user.uid, notes.trim() || undefined)
      onVerificationChange()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify agency')
    } finally {
      setLoading(false)
    }
  }

  const handleUnverify = async () => {
    if (!user?.uid) return

    setLoading(true)
    setError(null)

    try {
      await revokeAgencyVerification(agency.id, user.uid, notes.trim() || undefined)
      onVerificationChange()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke verification')
    } finally {
      setLoading(false)
    }
  }

  const hasDmwLicense = !!agency.dmwLicenseUrl
  const hasBusinessPermit = !!agency.businessPermitUrl
  const hasAllCertifications = hasDmwLicense && hasBusinessPermit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Agency Verification</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Agency Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {agency.logoUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={agency.logoUrl}
                    alt={agency.companyName}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{agency.companyName}</h3>
                  {agency.verified ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Unverified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Registration:</span>
                    <span>{agency.registrationNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Contact:</span>
                    <span>{agency.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span>{agency.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Address:</span>
                    <span className="truncate">{agency.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certification Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Certification Documents
            </h3>

            <div className="space-y-4">
              {/* DMW License */}
              <div className={`border rounded-lg p-4 ${hasDmwLicense ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-8 h-8 ${hasDmwLicense ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">DMW License</h4>
                      <p className="text-sm text-gray-600">Department of Migrant Workers License</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDmwLicense ? (
                      <>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Uploaded
                        </span>
                        <a
                          href={agency.dmwLicenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Download DMW License"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Missing
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Permit */}
              <div className={`border rounded-lg p-4 ${hasBusinessPermit ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-8 h-8 ${hasBusinessPermit ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Permit</h4>
                      <p className="text-sm text-gray-600">Valid Business Permit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasBusinessPermit ? (
                      <>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Uploaded
                        </span>
                        <a
                          href={agency.businessPermitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Download Business Permit"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Missing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!hasAllCertifications && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This agency is missing required certification documents.
                  Verification should only be granted when all documents are uploaded and validated.
                </p>
              </div>
            )}
          </div>

          {/* Notes/Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes {agency.verified ? '(Reason for revoking)' : '(Optional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder={agency.verified ? "Provide a reason for revoking verification..." : "Add any notes about this verification..."}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            {agency.verified ? (
              <button
                onClick={handleUnverify}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {loading ? 'Revoking...' : 'Revoke Verification'}
              </button>
            ) : (
              <button
                onClick={handleVerify}
                disabled={loading || !hasAllCertifications}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={!hasAllCertifications ? 'All certifications must be uploaded before verification' : ''}
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? 'Verifying...' : 'Verify Agency'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
