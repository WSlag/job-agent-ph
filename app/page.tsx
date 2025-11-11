import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import HomeClient from '@/components/pages/HomeClient';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

// Server-side data fetching
async function getFeaturedJobs(): Promise<Job[]> {
  try {
    const db = getDbInstance();
    const jobsRef = collection(db, COLLECTIONS.JOBS);
    const q = query(
      jobsRef,
      where('isActive', '==', true),
      orderBy('postedAt', 'desc'),
      limit(6)
    );

    const querySnapshot = await getDocs(q);
    const jobsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert all Firestore Timestamps to Date objects for client serialization
        postedAt: data.postedAt?.toDate?.() || new Date(),
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || undefined,
        expiresAt: data.expiresAt?.toDate?.() || undefined,
        featuredAt: data.featuredAt?.toDate?.() || undefined,
      } as unknown as Job;
    });

    return jobsData;
  } catch (error) {
    console.error('Error loading featured jobs:', error);
    return [];
  }
}

async function getCategoryCounts(): Promise<{ [key: string]: number }> {
  try {
    const db = getDbInstance();
    const jobsRef = collection(db, COLLECTIONS.JOBS);

    // Load all category counts in parallel
    const countPromises = CATEGORIES.map(async (category) => {
      const q = query(
        jobsRef,
        where('isActive', '==', true),
        where('category', '==', category.name)
      );
      const snapshot = await getDocs(q);
      return { name: category.name, count: snapshot.size };
    });

    const results = await Promise.all(countPromises);

    const counts: { [key: string]: number } = {};
    results.forEach(({ name, count }) => {
      counts[name] = count;
    });

    return counts;
  } catch (error) {
    console.error('Error loading category counts:', error);
    return {};
  }
}

// Server Component - fetches data then passes to client
export default async function Home() {
  // Fetch data in parallel on the server
  const [featuredJobs, categoryCounts] = await Promise.all([
    getFeaturedJobs(),
    getCategoryCounts(),
  ]);

  // Pass server-fetched data to client component
  return (
    <HomeClient
      initialFeaturedJobs={featuredJobs}
      initialCategoryCounts={categoryCounts}
    />
  );
}
