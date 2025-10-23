import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { createDocument } from './firestore-helpers'
import type { Job, JobType, JobLocation } from '@/types'

interface CreateJobParams {
  agencyId: string
  title: string
  description: string
  companyName: string
  location: string
  country: string
  locationType: JobLocation
  jobType: JobType
  salaryMin?: number
  salaryMax?: number
  currency: string
  experienceRequired: number
  skills: string[]
  imageFile?: File
  expiresAt?: Date
}

/**
 * Creates a new job posting with optional image upload
 * @param params Job creation parameters
 * @returns Promise with the created job ID
 */
export async function createJob(params: CreateJobParams): Promise<string> {
  const {
    agencyId,
    title,
    description,
    companyName,
    location,
    country,
    locationType,
    jobType,
    salaryMin,
    salaryMax,
    currency,
    experienceRequired,
    skills,
    imageFile,
    expiresAt,
  } = params

  // Upload image if provided
  let imageUrl: string | undefined

  if (imageFile) {
    try {
      const timestamp = Date.now()
      const filename = `${timestamp}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const storageRef = ref(storage, `jobs/${agencyId}/${filename}`)

      const snapshot = await uploadBytes(storageRef, imageFile)
      imageUrl = await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.error('Error uploading job image:', error)
      throw new Error('Failed to upload job image')
    }
  }

  // Prepare job data
  const now = new Date()

  const jobData: any = {
    agencyId,
    title: title.trim(),
    description: description.trim(),
    companyName: companyName.trim(),
    location: location.trim(),
    country,
    locationType,
    jobType,
    currency,
    experienceRequired,
    skills,
    postedAt: now,
    isActive: true,
  }

  // Only add optional fields if they have values (not undefined)
  if (salaryMin !== undefined) jobData.salaryMin = salaryMin
  if (salaryMax !== undefined) jobData.salaryMax = salaryMax
  if (imageUrl !== undefined) jobData.imageUrl = imageUrl
  if (expiresAt !== undefined) jobData.expiresAt = expiresAt

  try {
    // Create job document in Firestore
    const jobId = await createDocument('jobs', undefined, jobData)
    return jobId
  } catch (error) {
    console.error('Error creating job:', error)
    throw new Error('Failed to create job posting')
  }
}

/**
 * Updates an existing job posting
 * @param jobId The ID of the job to update
 * @param updates Partial job data to update
 */
export async function updateJob(
  jobId: string,
  updates: Partial<Omit<Job, 'id' | 'agencyId' | 'postedAt'>>
): Promise<void> {
  const { updateDocument } = await import('./firestore-helpers')

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  try {
    await updateDocument('jobs', jobId, updateData)
  } catch (error) {
    console.error('Error updating job:', error)
    throw new Error('Failed to update job posting')
  }
}

/**
 * Deactivates a job posting (soft delete)
 * @param jobId The ID of the job to deactivate
 */
export async function deactivateJob(jobId: string): Promise<void> {
  await updateJob(jobId, { isActive: false })
}

/**
 * Activates a previously deactivated job posting
 * @param jobId The ID of the job to activate
 */
export async function activateJob(jobId: string): Promise<void> {
  await updateJob(jobId, { isActive: true })
}

/**
 * Deletes a job posting permanently
 * @param jobId The ID of the job to delete
 */
export async function deleteJob(jobId: string): Promise<void> {
  const { deleteDocument } = await import('./firestore-helpers')

  try {
    await deleteDocument('jobs', jobId)
  } catch (error) {
    console.error('Error deleting job:', error)
    throw new Error('Failed to delete job posting')
  }
}

/**
 * Gets all active jobs for a specific agency
 * @param agencyId The agency ID
 * @returns Promise with array of jobs
 */
export async function getAgencyJobs(agencyId: string): Promise<Job[]> {
  const { queryDocuments } = await import('./firestore-helpers')
  const { where } = await import('firebase/firestore')

  try {
    const jobs = await queryDocuments<Job>(
      'jobs',
      [where('agencyId', '==', agencyId)],
      100
    )
    return jobs
  } catch (error) {
    console.error('Error fetching agency jobs:', error)
    throw new Error('Failed to fetch agency jobs')
  }
}

/**
 * Checks if a job posting has expired
 * @param job The job to check
 * @returns boolean indicating if the job has expired
 */
export function isJobExpired(job: Job): boolean {
  if (!job.expiresAt) return false
  return new Date() > new Date(job.expiresAt)
}

/**
 * Formats salary range for display
 * @param salaryMin Minimum salary
 * @param salaryMax Maximum salary
 * @param currency Currency code
 * @returns Formatted salary string
 */
export function formatSalaryRange(
  salaryMin?: number,
  salaryMax?: number,
  currency = 'PHP'
): string {
  if (!salaryMin && !salaryMax) {
    return 'Negotiable'
  }

  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  if (salaryMin && salaryMax) {
    return `${formatter.format(salaryMin)} - ${formatter.format(salaryMax)}`
  } else if (salaryMin) {
    return `From ${formatter.format(salaryMin)}`
  } else if (salaryMax) {
    return `Up to ${formatter.format(salaryMax)}`
  }

  return 'Negotiable'
}
