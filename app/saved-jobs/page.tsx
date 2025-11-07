'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Bookmark, MapPin, DollarSign, Clock, Trash2, ExternalLink } from 'lucide-react';
import { Job } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import MobileNativeHeader from '@/components/layout/MobileNativeHeader';

export default function SavedJobsPage() {
  const { user: currentUser, userType, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingJobId, setRemovingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/login');
      return;
    }

    if (!authLoading && userType !== 'jobhunter') {
      router.push('/');
      return;
    }

    if (currentUser) {
      loadSavedJobs();
    }
  }, [currentUser, userType, authLoading]);

  const loadSavedJobs = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Get saved job IDs from Firestore
      const savedJobsRef = collection(db, 'savedJobs', currentUser.uid, 'jobs');
      const savedJobsSnapshot = await getDocs(query(savedJobsRef));

      const jobIds = savedJobsSnapshot.docs.map(doc => doc.id);

      if (jobIds.length === 0) {
        // Also check localStorage for migration (only if no jobs in Firestore)
        const localSavedJobs = localStorage.getItem('savedJobs');
        if (localSavedJobs) {
          try {
            const localJobIds = JSON.parse(localSavedJobs);
            // Migrate from localStorage to Firestore
            const migrationPromises = localJobIds.map((jobId: string) =>
              setDoc(doc(db, 'savedJobs', currentUser.uid, 'jobs', jobId), {
                savedAt: new Date(),
              }).catch((err) => {
                console.warn(`Failed to migrate job ${jobId}:`, err);
              })
            );
            await Promise.all(migrationPromises);
            localStorage.removeItem('savedJobs');
            // Reload after migration
            await loadSavedJobs();
            return;
          } catch (migrationError) {
            console.error('Error migrating saved jobs from localStorage:', migrationError);
            // Continue with empty list rather than failing completely
          }
        }
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      // Fetch job details for each saved job
      const jobs: Job[] = [];
      for (const jobId of jobIds) {
        try {
          const jobDoc = await getDoc(doc(db, 'jobs', jobId));
          if (jobDoc.exists()) {
            const jobData = jobDoc.data();
            jobs.push({
              id: jobDoc.id,
              ...jobData,
              // Ensure postedAt is a valid Date object
              postedAt: jobData.postedAt?.toDate ? jobData.postedAt.toDate() : new Date(jobData.postedAt || Date.now()),
            } as Job);
          } else {
            // Remove from saved jobs if job no longer exists
            await deleteDoc(doc(db, 'savedJobs', currentUser.uid, 'jobs', jobId)).catch(() => {});
          }
        } catch (jobError) {
          console.error(`Error fetching job ${jobId}:`, jobError);
        }
      }

      // Sort by date saved (most recent first)
      jobs.sort((a, b) => {
        const aData = savedJobsSnapshot.docs.find(d => d.id === a.id)?.data();
        const bData = savedJobsSnapshot.docs.find(d => d.id === b.id)?.data();
        return (bData?.savedAt?.toMillis() || 0) - (aData?.savedAt?.toMillis() || 0);
      });

      setSavedJobs(jobs);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId: string) => {
    if (!currentUser) return;

    try {
      setRemovingJobId(jobId);
      await deleteDoc(doc(db, 'savedJobs', currentUser.uid, 'jobs', jobId));
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('Failed to remove saved job. Please try again.');
    } finally {
      setRemovingJobId(null);
    }
  };

  const formatSalaryRange = (min?: number, max?: number) => {
    if (!min && !max) {
      return 'Negotiable';
    }
    const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return formatter.format(min || max || 0);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNativeHeader
        title="Saved Jobs"
        onBack={() => router.back()}
        hideOnScroll
        showShadowOnScroll
      />

      <div className="container mx-auto px-3 md:px-4 max-w-6xl pt-16 md:pt-20 pb-8">
        <div className="mb-8 hidden md:block">
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="text-gray-600 mt-1">
                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
              </p>
            </div>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <Card className="p-8 md:p-12 text-center">
            <Bookmark className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">No saved jobs yet</h2>
            <p className="text-gray-600 mb-6">
              Start saving jobs that interest you to easily find them later
            </p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <Card key={job.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link href={`/jobs/${job.id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mt-1">{job.companyName || 'Company Name'}</p>
                      </div>
                      <Badge variant={job.isActive ? 'success' : 'default'}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                          +{job.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Posted {job.postedAt && !isNaN(new Date(job.postedAt).getTime())
                        ? format(new Date(job.postedAt), 'MMM d, yyyy')
                        : 'Recently'}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                    <Link href={`/jobs/${job.id}`} className="w-full md:w-auto">
                      <Button variant="primary" className="whitespace-nowrap w-full md:w-auto" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Job
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => handleRemoveSavedJob(job.id)}
                      disabled={removingJobId === job.id}
                      className="whitespace-nowrap w-full md:w-auto"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {removingJobId === job.id ? 'Removing...' : 'Remove'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
