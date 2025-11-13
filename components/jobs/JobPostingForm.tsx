'use client'

import { useState, FormEvent, ChangeEvent, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createJob } from '@/lib/job-helpers'
import Button from '@/components/ui/Button'
import { Upload, X, Info, AlertCircle, HelpCircle } from 'lucide-react'
import type { JobType, JobLocation } from '@/types'
import FieldHint from './FieldHint'
import FormSectionHeader from './FormSectionHeader'
import HelpTooltip from '@/components/onboarding/HelpTooltip'
import { JOB_FORM_HINTS, JOB_FORM_TOOLTIPS, CHARACTER_LIMITS, VALIDATION_MESSAGES } from '@/lib/job-form-hints'
import { getCategoryNames } from '@/lib/categories'
import CountryCombobox from '@/components/ui/CountryCombobox'

interface FormData {
  title: string
  description: string
  tagline: string
  companyName: string
  category: string
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
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'EUR', name: 'Euro' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'TWD', name: 'Taiwan Dollar' },
  { code: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', name: 'Omani Rial' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'ILS', name: 'Israeli Shekel' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
]

export default function JobPostingForm() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [salaryError, setSalaryError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    tagline: '',
    companyName: (userProfile && 'companyName' in userProfile) ? userProfile.companyName : '',
    category: '',
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

  // Computed values
  const skillsCount = useMemo(() => {
    return formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0).length
  }, [formData.skills])

  const titleCharCount = formData.title.length
  const descriptionCharCount = formData.description.length

  // Real-time salary validation
  useMemo(() => {
    const min = formData.salaryMin ? parseFloat(formData.salaryMin) : null
    const max = formData.salaryMax ? parseFloat(formData.salaryMax) : null

    if (min !== null && min < 0) {
      setSalaryError(VALIDATION_MESSAGES.salaryInvalid)
    } else if (max !== null && max < 0) {
      setSalaryError(VALIDATION_MESSAGES.salaryInvalid)
    } else if (min !== null && max !== null && min > max) {
      setSalaryError(VALIDATION_MESSAGES.salaryMinGreaterThanMax)
    } else {
      setSalaryError(null)
    }
  }, [formData.salaryMin, formData.salaryMax])

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
      if (!formData.category) {
        throw new Error('Category is required')
      }

      // Parse skills
      const skillsArray = formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      // Parse salary
      const salaryMin = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
      const salaryMax = formData.salaryMax ? parseFloat(formData.salaryMax) : undefined

      // Validate salary range
      if (salaryMin !== undefined && salaryMin < 0) {
        throw new Error('Minimum salary cannot be negative')
      }
      if (salaryMax !== undefined && salaryMax < 0) {
        throw new Error('Maximum salary cannot be negative')
      }
      if (salaryMin && salaryMin > 100000000) {
        throw new Error('Minimum salary is unrealistically high')
      }
      if (salaryMax && salaryMax > 100000000) {
        throw new Error('Maximum salary is unrealistically high')
      }
      if (salaryMin && salaryMax && salaryMin > salaryMax) {
        throw new Error('Minimum salary cannot be greater than maximum salary')
      }

      // Create job
      const jobId = await createJob({
        agencyId: userProfile!.id,
        title: formData.title,
        description: formData.description,
        tagline: formData.tagline.trim() || undefined,
        companyName: formData.companyName,
        category: formData.category,
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
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Required fields are marked with <span className="text-red-500">*</span>
            </h4>
            <p className="text-sm text-blue-700">
              Provide detailed, accurate information to attract qualified candidates. Jobs with complete information get 3x more applications.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Job Details Section */}
      <FormSectionHeader
        title="Job Details"
        subtitle="Basic information about the position"
      />

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
        <FieldHint>{JOB_FORM_HINTS.title}</FieldHint>
        <p className="text-xs text-gray-400 mt-1">
          {titleCharCount}/{CHARACTER_LIMITS.title.max} characters
          {titleCharCount < CHARACTER_LIMITS.title.min && (
            <span className="text-yellow-600 ml-1">
              (minimum {CHARACTER_LIMITS.title.min} characters)
            </span>
          )}
        </p>
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
        <FieldHint type="info">{JOB_FORM_HINTS.companyName}</FieldHint>
      </div>

      {/* Job Tagline */}
      <div>
        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
          Job Tagline
        </label>
        <input
          type="text"
          id="tagline"
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Drive marketing campaigns for international brands"
        />
        <p className="mt-1 text-sm text-gray-500">
          A short, catchy summary (max 100 characters) that appears on job cards. Leave empty to use first sentence of description.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formData.tagline.length}/100 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Job Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {getCategoryNames().map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName}
            </option>
          ))}
        </select>
        <FieldHint>Choose the category that best matches this position. This helps candidates find your job.</FieldHint>
      </div>

      {/* Job Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          <HelpTooltip
            title={JOB_FORM_TOOLTIPS.description.title}
            content={
              <div dangerouslySetInnerHTML={{ __html: JOB_FORM_TOOLTIPS.description.content }} />
            }
          >
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help" />
          </HelpTooltip>
        </div>
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
        <FieldHint>{JOB_FORM_HINTS.description}</FieldHint>
        <p className="text-xs text-gray-400 mt-1">
          {descriptionCharCount}/{CHARACTER_LIMITS.description.max} characters
          {descriptionCharCount < CHARACTER_LIMITS.description.min && (
            <span className="text-yellow-600 ml-1">
              (minimum {CHARACTER_LIMITS.description.min} characters)
            </span>
          )}
        </p>
      </div>

      {/* Location & Work Type Section */}
      <FormSectionHeader
        title="Location & Work Type"
        subtitle="Where and how the work will be performed"
      />

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
          <FieldHint>{JOB_FORM_HINTS.location}</FieldHint>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <CountryCombobox
            value={formData.country}
            onChange={(value) => setFormData({ ...formData, country: value ?? '' })}
            required
          />
          <FieldHint>{JOB_FORM_HINTS.country}</FieldHint>
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
          <FieldHint>{JOB_FORM_HINTS.employmentType}</FieldHint>
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
          <FieldHint>{JOB_FORM_HINTS.workLocation}</FieldHint>
        </div>
      </div>

      {/* Compensation Section */}
      <FormSectionHeader
        title="Compensation"
        subtitle="Salary information (recommended for attracting qualified candidates)"
      />

      {/* Salary Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Jobs with salary ranges get 40% more applications. Be transparent to attract qualified candidates faster.
          </p>
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Salary Range (Optional)
          </label>
          <HelpTooltip
            title={JOB_FORM_TOOLTIPS.salary.title}
            content={
              <div dangerouslySetInnerHTML={{ __html: JOB_FORM_TOOLTIPS.salary.content }} />
            }
          >
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help" />
          </HelpTooltip>
        </div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
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
        {salaryError && (
          <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{salaryError}</span>
          </div>
        )}
        <FieldHint type="tip">{JOB_FORM_HINTS.salary}</FieldHint>
      </div>

      {/* Requirements Section */}
      <FormSectionHeader
        title="Requirements"
        subtitle="Experience and skills needed for this position"
      />

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
        <FieldHint type="tip">{JOB_FORM_HINTS.experience}</FieldHint>
      </div>

      {/* Skills */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Required Skills (Optional)
          </label>
          <HelpTooltip
            title={JOB_FORM_TOOLTIPS.skills.title}
            content={
              <div dangerouslySetInnerHTML={{ __html: JOB_FORM_TOOLTIPS.skills.content }} />
            }
          >
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help" />
          </HelpTooltip>
        </div>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., JavaScript, React, Node.js"
        />
        <FieldHint>{JOB_FORM_HINTS.skills}</FieldHint>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">
            {skillsCount > 0 && (
              <span>
                {skillsCount} skill{skillsCount !== 1 ? 's' : ''} added
                {skillsCount > 50 && <span className="text-red-600 ml-1">(maximum 50)</span>}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Media & Deadline Section */}
      <FormSectionHeader
        title="Media & Deadline"
        subtitle="Optional enhancements for your job posting"
      />

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
                  Recommended: 5.3" x 3" (16:9 ratio) for best display
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
              className="w-full h-80 object-cover rounded-lg"
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
        <FieldHint type="tip">{JOB_FORM_HINTS.image}</FieldHint>
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
        <FieldHint>{JOB_FORM_HINTS.deadline}</FieldHint>
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
