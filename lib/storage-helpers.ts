/**
 * Firebase Storage helper functions
 * Handles file uploads and downloads
 */

import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The storage path (e.g., 'jobs/jobId/image.jpg')
 * @returns Promise with the download URL
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
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
    const storageRef = ref(storage, path)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    console.error('Error getting file URL:', error)
    throw new Error('Failed to get file URL')
  }
}
