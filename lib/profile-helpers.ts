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
 * Checks if an agency profile is complete with all mandatory fields
 * Supports both legacy single-file (dmwLicenseUrl) and new multi-file (dmwLicenseFiles) formats
 * @param agency The agency profile to check
 * @returns true if profile is complete, false otherwise
 */
export function isAgencyProfileComplete(agency: Agency): boolean {
  // Check basic required fields
  const hasBasicInfo = Boolean(
    agency.companyName?.trim() &&
    agency.registrationNumber?.trim() &&
    agency.contactPerson?.trim() &&
    agency.phone?.trim() &&
    agency.address?.trim() &&
    agency.logoUrl
  )

  // Check mandatory certifications (support both new multi-file and legacy single URL)
  const hasDmwLicense =
    (agency.dmwLicenseFiles && agency.dmwLicenseFiles.length > 0) ||
    Boolean(agency.dmwLicenseUrl)

  const hasBusinessPermit =
    (agency.businessPermitFiles && agency.businessPermitFiles.length > 0) ||
    Boolean(agency.businessPermitUrl)

  const hasCertifications = hasDmwLicense && hasBusinessPermit

  return hasBasicInfo && hasCertifications
}

/**
 * Gets a detailed profile completion status for an agency
 * Supports both legacy single-file and new multi-file certification formats
 * @param agency The agency profile to check
 * @returns Object with missing fields and completion status
 */
export function getAgencyProfileCompletionStatus(agency: Agency): {
  isComplete: boolean
  missingFields: string[]
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

  const requiredFields = [
    { key: 'companyName', label: 'Company Name', value: agency.companyName },
    { key: 'registrationNumber', label: 'Registration Number', value: agency.registrationNumber },
    { key: 'contactPerson', label: 'Contact Person', value: agency.contactPerson },
    { key: 'phone', label: 'Phone', value: agency.phone },
    { key: 'address', label: 'Address', value: agency.address },
    { key: 'logoUrl', label: 'Company Logo', value: agency.logoUrl },
    { key: 'dmwLicense', label: 'DMW License', value: hasDmwLicense },
    { key: 'businessPermit', label: 'Business Permit', value: hasBusinessPermit },
  ]

  const missingFields: string[] = []
  let completedCount = 0

  requiredFields.forEach(field => {
    if (field.key === 'dmwLicense' || field.key === 'businessPermit') {
      // Boolean value for certification fields
      if (field.value) {
        completedCount++
      } else {
        missingFields.push(field.label)
      }
    } else {
      // String value for other fields
      if (field.value && String(field.value).trim()) {
        completedCount++
      } else {
        missingFields.push(field.label)
      }
    }
  })

  const completionPercentage = Math.round((completedCount / requiredFields.length) * 100)
  const isComplete = completedCount === requiredFields.length

  return {
    isComplete,
    missingFields,
    completionPercentage,
  }
}
