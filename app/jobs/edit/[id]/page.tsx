'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateJob } from '@/lib/job-helpers';
import { Job } from '@/types';
import Header from '@/components/layout/Header';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import JobEditForm from '@/components/jobs/JobEditForm';

export default function EditJobPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (userProfile && 'companyName' in userProfile) {
        loadJob();
      } else {
        router.push('/jobs');
      }
    }
  }, [user, userProfile, authLoading, jobId]);

  const loadJob = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));

      if (!jobDoc.exists()) {
        setError('Job not found');
        return;
      }

      const jobData = { id: jobDoc.id, ...jobDoc.data() } as Job;

      // Verify the job belongs to the current agency
      if (jobData.agencyId !== user.uid) {
        setError('You do not have permission to edit this job');
        return;
      }

      setJob(jobData);
    } catch (err) {
      console.error('Error loading job:', err);
      setError('Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold mb-4">{error}</p>
            <Link
              href="/agency/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/agency/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
          <p className="text-gray-600 mt-2">Update the details for: {job.title}</p>
        </div>

        <JobEditForm job={job} />
      </div>
    </div>
  );
}
