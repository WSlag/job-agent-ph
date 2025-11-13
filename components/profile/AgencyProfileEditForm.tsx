'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { updateAgencyProfile } from '@/lib/profile-helpers'
import { uploadFile } from '@/lib/storage-helpers'
import Button from '@/components/ui/Button'
import { Upload, X, Building2 } from 'lucide-react'
import type { Agency } from '@/types'
import Image from 'next/image'

interface AgencyProfileEditFormProps {
  agency: Agency
}

interface FormData {
  companyName: string
  registrationNumber: string
  contactPerson: string
  phone: string
  address: string
  responseTime: string
  logoFile: File | null
}

export default function AgencyProfileEditForm({ agency }: AgencyProfileEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(agency.logoUrl || null)

  const [formData, setFormData] = useState<FormData>({
    companyName: agency.companyName || '',
    registrationNumber: agency.registrationNumber || '',
    contactPerson: agency.contactPerson || '',
    phone: agency.phone || '',
    address: agency.address || '',
    responseTime: agency.responseTime || '',
    logoFile: null,
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo size must be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }

      setFormData((prev) => ({ ...prev, logoFile: file }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logoFile: null }))
    setLogoPreview(agency.logoUrl || null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validation
      if (!formData.companyName.trim()) {
        throw new Error('Company name is required')
      }
      if (!formData.registrationNumber.trim()) {
        throw new Error('Registration number is required')
      }
      if (!formData.contactPerson.trim()) {
        throw new Error('Contact person is required')
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone number is required')
      }
      if (!formData.address.trim()) {
        throw new Error('Address is required')
      }

      // Upload new logo if changed
      let logoUrl = agency.logoUrl
      if (formData.logoFile) {
        logoUrl = await uploadFile(
          formData.logoFile,
          `company-logos/${agency.id}/${formData.logoFile.name}`
        )
      }

      // Update profile
      await updateAgencyProfile(agency.id, {
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        address: formData.address,
        responseTime: formData.responseTime || undefined,
        logoUrl,
      })

      // Redirect to dashboard
      router.push('/agency/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Company Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo (Optional)
        </label>
        <input
          type="file"
          id="logoFile"
          name="logoFile"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
        {logoPreview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <div className="w-48 h-48 relative rounded-lg border border-gray-300 overflow-hidden bg-gray-100">
                <Image
                  src={logoPreview}
                  alt="Company logo preview"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                title="Remove logo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <label
              htmlFor="logoFile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-medium"
            >
              <Upload className="w-4 h-4" />
              Change Logo
            </label>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <label htmlFor="logoFile" className="cursor-pointer">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload company logo</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </label>
          </div>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Registration Number */}
      <div>
        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Registration Number *
        </label>
        <input
          type="text"
          id="registrationNumber"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Contact Person */}
      <div>
        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
          Contact Person *
        </label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+63 XXX XXX XXXX"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Office Address *
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Response Time */}
      <div>
        <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700 mb-2">
          Expected Response Time (Optional)
        </label>
        <select
          id="responseTime"
          name="responseTime"
          value={formData.responseTime}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select response time</option>
          <option value="Within 1 hour">Within 1 hour</option>
          <option value="1-2 hours">1-2 hours</option>
          <option value="2-4 hours">2-4 hours</option>
          <option value="4-8 hours">4-8 hours</option>
          <option value="Within 1 day">Within 1 day</option>
          <option value="1-2 days">1-2 days</option>
          <option value="2-3 days">2-3 days</option>
          <option value="3-5 days">3-5 days</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Set your typical response time to help job hunters know when to expect a reply
        </p>
      </div>

      {/* Email (Read-only) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address (Cannot be changed)
        </label>
        <input
          type="email"
          id="email"
          value={agency.email}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="flex-1"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/agency/dashboard')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
