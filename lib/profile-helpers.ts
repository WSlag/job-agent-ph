/**
 * Profile helper functions
 * Handles user profile updates for both job hunters and agencies
 */

import { getDbInstance } from './firebase'
import { doc, updateDoc, Timestamp, collection, query, where, getDocs, writeBatch } from 'firebase/firestore'
import { Agency, JobHunter } from '@/types'
import { COLLECTIONS } from './collections'

/**
 * Updates an agency profile
 * @param userId The agency user ID
 * @param data The agency profile data to update
 */
export async function updateAgencyProfile(
  userId: string,
  data: Partial<Omit<Agency, 'id' | 'email' | 'userType' | 'createdAt'>>
): Promise<void> {
  try {
    const db = getDbInstance();
    const agencyRef = doc(db, COLLECTIONS.AGENCIES, userId)
    await updateDoc(agencyRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })

    // If company name is being updated, update all job postings with the new company name
    if (data.companyName) {
      const jobsRef = collection(db, 'jobs')
      const jobsQuery = query(jobsRef, where('agencyId', '==', userId))
      const jobsSnapshot = await getDocs(jobsQuery)

      if (!jobsSnapshot.empty) {
        const batch = writeBatch(db)
        jobsSnapshot.docs.forEach((jobDoc) => {
          batch.update(jobDoc.ref, { companyName: data.companyName })
        })
        await batch.commit()
      }
    }
  } catch (error) {
    console.error('Error updating agency profile:', error)
    throw new Error('Failed to update agency profile')
  }
}

/**
 * Updates a job hunter profile
 * @param userId The job hunter user ID
 * @param data The job hunter profile data to update
 */
export async function updateJobHunterProfile(
  userId: string,
  data: Partial<Omit<JobHunter, 'id' | 'email' | 'userType' | 'createdAt'>>
): Promise<void> {
  try {
    const db = getDbInstance();
    const jobHunterRef = doc(db, COLLECTIONS.JOB_HUNTERS, userId)
    await updateDoc(jobHunterRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating job hunter profile:', error)
    throw new Error('Failed to update job hunter profile')
  }
}

/**
 * Checks if an agency profile has the minimum required fields to post a job.
 * Only companyName, contactPerson, and phone are mandatory for posting.
 * Logo, DMW License, and Business Permit are recommended but not blocking.
 * @param agency The agency profile to check
 * @returns true if minimum required fields are present, false otherwise
 */
export function isAgencyProfileComplete(agency: Agency): boolean {
  return Boolean(
    agency.companyName?.trim() &&
    agency.contactPerson?.trim() &&
    agency.phone?.trim()
  )
}

/**
 * Checks if an agency has uploaded recommended documents (logo, DMW, permit).
 * Used to show reminders on the job posting page.
 */
export function getAgencyMissingDocuments(agency: Agency): string[] {
  const missing: string[] = []

  if (!agency.logoUrl) missing.push('Company Logo')

  const hasDmwLicense =
    (agency.dmwLicenseFiles && agency.dmwLicenseFiles.length > 0) ||
    Boolean(agency.dmwLicenseUrl)
  if (!hasDmwLicense) missing.push('DMW License')

  const hasBusinessPermit =
    (agency.businessPermitFiles && agency.businessPermitFiles.length > 0) ||
    Boolean(agency.businessPermitUrl)
  if (!hasBusinessPermit) missing.push('Business Permit')

  return missing
}

/**
 * Gets a detailed profile completion status for an agency.
 * Includes both required (for posting) and recommended (documents) fields.
 * @param agency The agency profile to check
 * @returns Object with missing fields and completion status
 */
export function getAgencyProfileCompletionStatus(agency: Agency): {
  isComplete: boolean
  missingFields: string[]
  missingDocuments: string[]
  completionPercentage: number
} {
  // Check DMW License (either new multi-file or legacy single URL)
  const hasDmwLicense =
    (agency.dmwLicenseFiles && agency.dmwLicenseFiles.length > 0) ||
    Boolean(agency.dmwLicenseUrl)

  // Check Business Permit (either new multi-file or legacy single URL)
  const hasBusinessPermit =
    (agency.businessPermitFiles && agency.businessPermitFiles.length > 0) ||
    Boolean(agency.businessPermitUrl)

  // Required fields (minimum to post jobs)
  const requiredFields = [
    { key: 'companyName', label: 'Company Name', value: agency.companyName },
    { key: 'contactPerson', label: 'Contact Person', value: agency.contactPerson },
    { key: 'phone', label: 'Phone', value: agency.phone },
  ]

  // Recommended fields (not blocking, but should be completed)
  const recommendedFields = [
    { key: 'registrationNumber', label: 'Registration Number', value: agency.registrationNumber },
    { key: 'address', label: 'Address', value: agency.address },
    { key: 'logoUrl', label: 'Company Logo', value: agency.logoUrl },
    { key: 'dmwLicense', label: 'DMW License', value: hasDmwLicense },
    { key: 'businessPermit', label: 'Business Permit', value: hasBusinessPermit },
  ]

  const allFields = [...requiredFields, ...recommendedFields]
  const missingFields: string[] = []
  const missingDocuments: string[] = []
  let completedCount = 0

  requiredFields.forEach(field => {
    if (field.value && String(field.value).trim()) {
      completedCount++
    } else {
      missingFields.push(field.label)
    }
  })

  recommendedFields.forEach(field => {
    if (field.key === 'dmwLicense' || field.key === 'businessPermit') {
      if (field.value) {
        completedCount++
      } else {
        missingDocuments.push(field.label)
      }
    } else {
      if (field.value && String(field.value).trim()) {
        completedCount++
      } else {
        missingDocuments.push(field.label)
      }
    }
  })

  const completionPercentage = Math.round((completedCount / allFields.length) * 100)
  const isComplete = missingFields.length === 0

  return {
    isComplete,
    missingFields,
    missingDocuments,
    completionPercentage,
  }
}
