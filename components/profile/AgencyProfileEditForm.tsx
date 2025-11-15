'use client'

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { updateAgencyProfile } from '@/lib/profile-helpers'
import { uploadFile } from '@/lib/storage-helpers'
import Button from '@/components/ui/Button'
import { Upload, X, Building2, Plus } from 'lucide-react'
import type { Agency } from '@/types'
import Image from 'next/image'
import Chip, { ChipGroup } from '@/components/ui/Chip'

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
  description: string
  specializations: string[]
  certifications: string[]
  newSpecialization: string
  newCertification: string
}

export default function AgencyProfileEditForm({ agency }: AgencyProfileEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(agency.logoUrl || null)

  const [formData, setFormData] = useState<FormData>({
    companyName: agency.companyName || '',
    registrationNumber: agency.registrationNumber || '',
    contactPerson: agency.contactPerson || '',
    phone: agency.phone || '',
    address: agency.address || '',
    responseTime: agency.responseTime || '',
    logoFile: null,
    description: agency.description || agency.bio || '',
    specializations: agency.specializations || [],
    certifications: agency.certifications || [],
    newSpecialization: '',
    newCertification: '',
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

  // Handle adding specialization on Enter key
  const handleSpecializationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = formData.newSpecialization.trim()
      if (value && !formData.specializations.includes(value)) {
        if (formData.specializations.length >= 10) {
          setError('Maximum 10 specializations allowed')
          return
        }
        setFormData((prev) => ({
          ...prev,
          specializations: [...prev.specializations, value],
          newSpecialization: '',
        }))
        setError(null)
      }
    }
  }

  // Remove specialization
  const removeSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== spec),
    }))
  }

  // Add new certification
  const addCertification = () => {
    if (formData.certifications.length >= 15) {
      setError('Maximum 15 certifications allowed')
      return
    }
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ''],
    }))
    setError(null)
  }

  // Update certification at index
  const updateCertification = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => (i === index ? value : cert)),
    }))
  }

  // Remove certification at index
  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
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

      // Prepare update data - only include defined values
      const updateData: Partial<Agency> = {
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        address: formData.address,
        logoUrl,
      }

      // Add optional fields only if they have values
      if (formData.responseTime) {
        updateData.responseTime = formData.responseTime
      }

      if (formData.description.trim()) {
        updateData.description = formData.description.trim()
        updateData.bio = formData.description.trim() // For backward compatibility
      }

      if (formData.specializations.length > 0) {
        updateData.specializations = formData.specializations
      }

      const filteredCerts = formData.certifications.filter(c => c.trim())
      if (filteredCerts.length > 0) {
        updateData.certifications = filteredCerts
      }

      // Update profile
      await updateAgencyProfile(agency.id, updateData)

      // Show success message
      setSuccess(true)
      setLoading(false)

      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        router.push('/agency/dashboard')
      }, 1500)
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

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Profile updated successfully! Redirecting to dashboard...</span>
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
                  sizes="192px"
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

      {/* About Us / Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          About Your Agency (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          maxLength={1000}
          placeholder="Tell job seekers about your agency, your mission, expertise, and what makes you unique..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/1000 characters
        </p>
      </div>

      {/* Specializations */}
      <div>
        <label htmlFor="newSpecialization" className="block text-sm font-medium text-gray-700 mb-2">
          Specializations (Optional)
        </label>
        <input
          type="text"
          id="newSpecialization"
          name="newSpecialization"
          value={formData.newSpecialization}
          onChange={handleChange}
          onKeyDown={handleSpecializationKeyDown}
          placeholder="Type a specialization and press Enter (e.g., Healthcare, IT, Construction)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Add up to 10 specializations. Press Enter to add each one.
        </p>
        {formData.specializations.length > 0 && (
          <div className="mt-3">
            <ChipGroup gap="sm">
              {formData.specializations.map((spec, idx) => (
                <Chip
                  key={idx}
                  label={spec}
                  variant="primary"
                  removable
                  onRemove={() => removeSpecialization(spec)}
                />
              ))}
            </ChipGroup>
          </div>
        )}
      </div>

      {/* Certifications & Licenses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certifications & Licenses (Optional)
        </label>
        <div className="space-y-2">
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={cert}
                onChange={(e) => updateCertification(idx, e.target.value)}
                placeholder={`Certification ${idx + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeCertification(idx)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Remove certification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCertification}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Certification
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Add up to 15 certifications or licenses (e.g., ISO Certified, POEA Licensed)
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
