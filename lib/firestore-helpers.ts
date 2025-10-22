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
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './collections';

// Generic CRUD operations

export async function createDocument<T>(
  collectionName: string,
  docId: string,
  data: T
) {
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
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
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
