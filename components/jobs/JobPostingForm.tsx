'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createJob } from '@/lib/job-helpers'
import Button from '@/components/ui/Button'
import { Upload, X } from 'lucide-react'
import type { JobType, JobLocation } from '@/types'

interface FormData {
  title: string
  description: string
  companyName: string
  location: string
  country: string
  locationType: JobLocation
  jobType: JobType
  salaryMin: string
  salaryMax: string
  currency: string
  experienceRequired: string
  skills: string
  expiresAt: string
  imageFile: File | null
}

const COUNTRIES = [
  'Philippines',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Indonesia',
  'Japan',
  'South Korea',
  'Hong Kong',
  'Taiwan',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Other'
]

const CURRENCIES = [
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'KRW', name: 'South Korean Won' },
]

export default function JobPostingForm() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    companyName: userProfile?.companyName || '',
    location: '',
    country: 'Philippines',
    locationType: 'on-site',
    jobType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    currency: 'PHP',
    experienceRequired: '0',
    skills: '',
    expiresAt: '',
    imageFile: null,
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }

      setFormData((prev) => ({ ...prev, imageFile: file }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: null }))
    setImagePreview(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Job title is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Job description is required')
      }
      if (!formData.companyName.trim()) {
        throw new Error('Company name is required')
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required')
      }

      // Parse skills
      const skillsArray = formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      // Parse salary
      const salaryMin = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
      const salaryMax = formData.salaryMax ? parseFloat(formData.salaryMax) : undefined

      if (salaryMin && salaryMax && salaryMin > salaryMax) {
        throw new Error('Minimum salary cannot be greater than maximum salary')
      }

      // Create job
      const jobId = await createJob({
        agencyId: userProfile!.id,
        title: formData.title,
        description: formData.description,
        companyName: formData.companyName,
        location: formData.location,
        country: formData.country,
        locationType: formData.locationType,
        jobType: formData.jobType,
        salaryMin,
        salaryMax,
        currency: formData.currency,
        experienceRequired: parseInt(formData.experienceRequired, 10),
        skills: skillsArray,
        imageFile: formData.imageFile || undefined,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      })

      // Redirect to the job page
      router.push(`/jobs/${jobId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job posting')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Job Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          required
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your company name"
        />
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="Describe the job responsibilities, requirements, and benefits..."
        />
        <p className="mt-1 text-sm text-gray-500">
          Provide a detailed description of the role, responsibilities, and requirements
        </p>
      </div>

      {/* Location & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            City/Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Manila, Makati"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="country"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Type & Location Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            id="jobType"
            name="jobType"
            required
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-1">
            Work Location <span className="text-red-500">*</span>
          </label>
          <select
            id="locationType"
            name="locationType"
            required
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="on-site">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Salary Range (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salaryMin" className="block text-xs text-gray-600 mb-1">
              Minimum
            </label>
            <input
              type="number"
              id="salaryMin"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20000"
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-xs text-gray-600 mb-1">
              Maximum
            </label>
            <input
              type="number"
              id="salaryMax"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-xs text-gray-600 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Experience Required */}
      <div>
        <label htmlFor="experienceRequired" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience Required <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="experienceRequired"
          name="experienceRequired"
          required
          value={formData.experienceRequired}
          onChange={handleChange}
          min="0"
          max="50"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 3"
        />
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills (Optional)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., JavaScript, React, Node.js"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate multiple skills with commas
        </p>
      </div>

      {/* Job Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Image (Optional)
        </label>

        {!imagePreview ? (
          <div className="mt-2">
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center w-full px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload an image (max 5MB)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, or WEBP
                </p>
                <p className="text-xs text-blue-600 font-medium mt-2">
                  Recommended: 4" x 2.1" (1200 x 630 pixels) for best display
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="relative mt-2">
            <img
              src={imagePreview}
              alt="Job preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Expiration Date */}
      <div>
        <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
          Application Deadline (Optional)
        </label>
        <input
          type="date"
          id="expiresAt"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          Leave empty for no deadline
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Creating Job...' : 'Post Job'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
