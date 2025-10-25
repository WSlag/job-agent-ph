import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './collections';

// Generic CRUD operations

export async function createDocument<T>(
  collectionName: string,
  docId: string | undefined,
  data: T
) {
  // If docId is not provided, use addDoc to auto-generate an ID
  if (!docId) {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // If docId is provided, use setDoc with the specific ID
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docId;
}

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function updateDocument<T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

export async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot
): Promise<{ data: T[]; lastDoc: DocumentSnapshot | null }> {
  const collectionRef = collection(db, collectionName);
  const queryConstraints = [...constraints, limit(pageSize)];

  if (lastDoc) {
    queryConstraints.push(startAfter(lastDoc));
  }

  const q = query(collectionRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];

  const lastVisible =
    querySnapshot.docs.length > 0
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;

  return { data, lastDoc: lastVisible };
}

// Helper to convert Firestore Timestamp to Date
export function timestampToDate(timestamp: any): Date {
  // Handle null/undefined
  if (!timestamp) {
    return new Date();
  }

  // Handle Firestore Timestamp
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }

  // Handle objects with toDate method
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }

  // Handle Date objects
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Try to parse as date string/number
  try {
    const date = new Date(timestamp);
    // Check if date is valid
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (error) {
    console.warn('Failed to convert timestamp to date:', timestamp);
  }

  // Fallback to current date
  return new Date();
}

// Helper to check if document exists
export async function documentExists(
  collectionName: string,
  docId: string
): Promise<boolean> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
