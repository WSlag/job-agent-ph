import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { JobApplication, ApplicationWithDetails, ApplicationStatus } from '@/types';

const APPLICATIONS_COLLECTION = 'applications';

// Convert Firestore timestamp to Date
function convertTimestamps(data: any): any {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
}

/**
 * Create a new job application
 */
export async function createApplication(params: {
  jobId: string;
  jobHunterId: string;
  agencyId: string;
  coverLetter?: string;
  resumeUrl?: string;
  conversationId?: string;
}): Promise<string> {
  try {
    const applicationData = {
      jobId: params.jobId,
      jobHunterId: params.jobHunterId,
      agencyId: params.agencyId,
      conversationId: params.conversationId || null,
      status: 'pending' as ApplicationStatus,
      coverLetter: params.coverLetter || null,
      resumeUrl: params.resumeUrl || null,
      appliedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), applicationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  try {
    const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(applicationRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    console.error('Error details:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      name: (error as any)?.name,
      stack: (error as any)?.stack,
      fullError: error
    });
    throw error;
  }
}

/**
 * Update application conversation ID
 */
export async function updateApplicationConversation(
  applicationId: string,
  conversationId: string
): Promise<void> {
  try {
    const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(applicationRef, {
      conversationId,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating application conversation:', error);
    throw error;
  }
}

/**
 * Get a single application by ID
 */
export async function getApplication(applicationId: string): Promise<JobApplication | null> {
  try {
    const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    const applicationSnap = await getDoc(applicationRef);

    if (!applicationSnap.exists()) {
      return null;
    }

    const data = convertTimestamps(applicationSnap.data());
    return {
      id: applicationSnap.id,
      ...data,
    } as JobApplication;
  } catch (error) {
    console.error('Error getting application:', error);
    throw error;
  }
}

/**
 * Get all applications for a job hunter
 */
export async function getJobHunterApplications(
  jobHunterId: string,
  limitCount: number = 50
): Promise<JobApplication[]> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('jobHunterId', '==', jobHunterId),
      orderBy('appliedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as JobApplication[];
  } catch (error) {
    console.error('Error getting job hunter applications:', error);
    throw error;
  }
}

/**
 * Get all applications for a specific job
 */
export async function getJobApplications(
  jobId: string,
  limitCount: number = 100
): Promise<JobApplication[]> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('jobId', '==', jobId),
      orderBy('appliedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as JobApplication[];
  } catch (error) {
    console.error('Error getting job applications:', error);
    throw error;
  }
}

/**
 * Get all applications for an agency (across all their jobs)
 */
export async function getAgencyApplications(
  agencyId: string,
  limitCount: number = 100
): Promise<JobApplication[]> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('agencyId', '==', agencyId),
      orderBy('appliedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as JobApplication[];
  } catch (error) {
    console.error('Error getting agency applications:', error);
    throw error;
  }
}

/**
 * Check if a job hunter has already applied to a job
 */
export async function hasAppliedToJob(
  jobId: string,
  jobHunterId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('jobId', '==', jobId),
      where('jobHunterId', '==', jobHunterId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking application status:', error);
    throw error;
  }
}

/**
 * Get existing application for a job and job hunter
 */
export async function getExistingApplication(
  jobId: string,
  jobHunterId: string
): Promise<JobApplication | null> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('jobId', '==', jobId),
      where('jobHunterId', '==', jobHunterId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...convertTimestamps(doc.data()),
    } as JobApplication;
  } catch (error) {
    console.error('Error getting existing application:', error);
    throw error;
  }
}

/**
 * Get application count for a job
 */
export async function getJobApplicationCount(jobId: string): Promise<number> {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('jobId', '==', jobId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting application count:', error);
    return 0;
  }
}

/**
 * Get application count by status for a job
 */
export async function getJobApplicationStats(jobId: string): Promise<{
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  rejected: number;
  hired: number;
}> {
  try {
    const applications = await getJobApplications(jobId);

    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length,
    };
  } catch (error) {
    console.error('Error getting application stats:', error);
    return { total: 0, pending: 0, reviewing: 0, shortlisted: 0, rejected: 0, hired: 0 };
  }
}

/**
 * Delete an application
 */
export async function deleteApplication(applicationId: string): Promise<void> {
  try {
    const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await deleteDoc(applicationRef);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

/**
 * Subscribe to applications for a job hunter (real-time updates)
 */
export function subscribeToJobHunterApplications(
  jobHunterId: string,
  callback: (applications: JobApplication[]) => void
): () => void {
  const q = query(
    collection(db, APPLICATIONS_COLLECTION),
    where('jobHunterId', '==', jobHunterId),
    orderBy('appliedAt', 'desc')
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as JobApplication[];
    callback(applications);
  });
}

/**
 * Subscribe to applications for a job (real-time updates)
 */
export function subscribeToJobApplications(
  jobId: string,
  callback: (applications: JobApplication[]) => void
): () => void {
  const q = query(
    collection(db, APPLICATIONS_COLLECTION),
    where('jobId', '==', jobId),
    orderBy('appliedAt', 'desc')
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as JobApplication[];
    callback(applications);
  });
}

/**
 * Upload resume file to Firebase Storage
 */
export async function uploadResume(
  file: File,
  jobHunterId: string
): Promise<string> {
  try {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF or Word document.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `resumes/${jobHunterId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filename);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
}
