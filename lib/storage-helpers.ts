/**
 * Firebase Storage helper functions
 * Handles file uploads and downloads
 */

import { getStorageInstance } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { CertificationFile } from '@/types'

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The storage path (e.g., 'jobs/jobId/image.jpg')
 * @returns Promise with the download URL
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

/**
 * Deletes a file from Firebase Storage
 * @param path The storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Failed to delete file')
  }
}

/**
 * Gets the download URL for a file
 * @param path The storage path
 * @returns Promise with the download URL
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    console.error('Error getting file URL:', error)
    throw new Error('Failed to get file URL')
  }
}

/**
 * Uploads multiple certification files to Firebase Storage
 * @param files Array of files to upload
 * @param agencyId The agency ID
 * @param certificationType Type of certification ('dmw-license' or 'business-permit')
 * @returns Promise with array of CertificationFile objects
 */
export async function uploadMultipleCertifications(
  files: File[],
  agencyId: string,
  certificationType: 'dmw-license' | 'business-permit'
): Promise<CertificationFile[]> {
  try {
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now() + Math.random() // Add randomness to prevent conflicts
      const ext = file.name.split('.').pop()
      const storagePath = `agency-certifications/${agencyId}/${certificationType}-${timestamp}.${ext}`

      const url = await uploadFile(file, storagePath)

      return {
        url,
        fileName: file.name,
        uploadedAt: new Date(),
        fileType: file.type,
        fileSize: file.size,
        storagePath
      } as CertificationFile
    })

    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading multiple certifications:', error)
    throw new Error('Failed to upload certification files')
  }
}

/**
 * Deletes a certification file from Firebase Storage
 * @param storagePath The storage path of the file to delete
 */
export async function deleteCertificationFile(storagePath: string): Promise<void> {
  try {
    await deleteFile(storagePath)
  } catch (error) {
    console.error('Error deleting certification file:', error)
    // Don't throw - file might already be deleted
  }
}

/**
 * Extracts filename from a Firebase Storage URL
 * @param url The Firebase Storage URL
 * @returns The extracted filename
 */
export function extractFileNameFromUrl(url: string): string {
  try {
    const parts = url.split('/')
    const filenamePart = parts[parts.length - 1]
    return decodeURIComponent(filenamePart.split('?')[0])
  } catch (error) {
    return 'document'
  }
}

/**
 * Extracts storage path from a Firebase Storage URL
 * @param url The Firebase Storage URL
 * @returns The storage path
 */
export function extractStoragePathFromUrl(url: string): string {
  try {
    const match = url.match(/\/o\/(.+?)\?/)
    return match ? decodeURIComponent(match[1]) : ''
  } catch (error) {
    return ''
  }
}

/**
 * Guesses file type from URL extension
 * @param url The file URL
 * @returns The MIME type
 */
export function guessFileTypeFromUrl(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()
  const typeMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
  }
  return typeMap[ext || ''] || 'application/octet-stream'
}
