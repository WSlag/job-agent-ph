'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { updateJob } from '@/lib/job-helpers'
import { uploadFile } from '@/lib/storage-helpers'
import Button from '@/components/ui/Button'
import { Upload, X } from 'lucide-react'
import type { Job, JobType, JobLocation } from '@/types'

interface JobEditFormProps {
  job: Job
}

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

export default function JobEditForm({ job }: JobEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(job.imageUrl || null)

  const [formData, setFormData] = useState<FormData>({
    title: job.title,
    description: job.description,
    companyName: job.companyName,
    location: job.location,
    country: job.country,
    locationType: job.locationType,
    jobType: job.jobType,
    salaryMin: job.salaryMin?.toString() || '',
    salaryMax: job.salaryMax?.toString() || '',
    currency: job.currency,
    experienceRequired: job.experienceRequired.toString(),
    skills: job.skills.join(', '),
    expiresAt: job.expiresAt ? (() => {
      try {
        // Handle Firebase Timestamp or Date object
        const date = job.expiresAt.toDate ? job.expiresAt.toDate() : new Date(job.expiresAt);
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    })() : '',
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
    setImagePreview(job.imageUrl || null)
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

      // Upload new image if changed
      let imageUrl = job.imageUrl
      if (formData.imageFile) {
        imageUrl = await uploadFile(formData.imageFile, `jobs/${job.agencyId}/${job.id}/${formData.imageFile.name}`)
      }

      // Update job
      await updateJob(job.id, {
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
        imageUrl,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      })

      // Redirect to the job page
      router.push(`/jobs/${job.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job posting')
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

      {/* Job Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Job Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
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

      {/* Job Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Location & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            City/Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Manila, Dubai, Singapore"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
            Job Type *
          </label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div>
          <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-2">
            Work Location *
          </label>
          <select
            id="locationType"
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="on-site">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Salary Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
            Min Salary
          </label>
          <input
            type="number"
            id="salaryMin"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="e.g., 30000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
            Max Salary
          </label>
          <input
            type="number"
            id="salaryMax"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="e.g., 50000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Experience & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="experienceRequired" className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience Required *
          </label>
          <input
            type="number"
            id="experienceRequired"
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
            Expires At (Optional)
          </label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills * (comma-separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., JavaScript, React, Node.js"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Job Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Image (Optional)
        </label>
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {imagePreview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Job preview"
                className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <label
              htmlFor="imageFile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-medium"
            >
              <Upload className="w-4 h-4" />
              Change Image
            </label>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <label htmlFor="imageFile" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload job image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              <p className="text-xs text-blue-600 font-medium mt-2">
                Recommended: 5.3" x 3" (16:9 ratio) for best display
              </p>
            </label>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="flex-1"
        >
          {loading ? 'Updating...' : 'Update Job Posting'}
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
