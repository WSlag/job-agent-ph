'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Facebook, Send, CheckCircle, AlertCircle, ExternalLink, Eye, Clock, RefreshCw, Copy, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Admin, Job as JobType } from '@/types';
import { getAdminJobs } from '@/lib/job-management-helpers';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  jobType: string;
  category: string;
  isActive: boolean;
  postedAt: Date;
  imageUrl?: string;
}

interface FacebookPost {
  id: string;
  jobId: string;
  jobTitle: string;
  facebookPostId?: string;
  status: 'pending' | 'posted' | 'failed';
  postContent: string;
  postedAt?: string;
  postedByName: string;
  error?: string;
  createdAt: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.jobagentph.com';

export default function AdminFacebookPage() {
  const { user, userProfile } = useAuth();
  const adminData = userProfile as Admin | null;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'post' | 'history'>('post');
  const [postedJobIds, setPostedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
    fetchPosts();
  }, []);

  const fetchJobs = async () => {
    try {
      // Fetch all jobs without status filter (some jobs may not have status field)
      const fetchedJobs = await getAdminJobs({});
      // Filter to only show active jobs
      const activeJobs = fetchedJobs.filter(job => job.isActive);
      setJobs(activeJobs as Job[]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/facebook/post');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);

        // Track which jobs have been posted
        const postedIds = new Set<string>();
        (data.posts || []).forEach((post: FacebookPost) => {
          if (post.status === 'posted') {
            postedIds.add(post.jobId);
          }
        });
        setPostedJobIds(postedIds);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const formatJobForPreview = (job: Job): string => {
    const jobUrl = `${SITE_URL}/jobs/${job.id}`;

    let salaryText = '';
    if (job.salaryMin || job.salaryMax) {
      if (job.salaryMin && job.salaryMax) {
        salaryText = `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
      } else if (job.salaryMin) {
        salaryText = `${job.currency} ${job.salaryMin.toLocaleString()}+`;
      } else if (job.salaryMax) {
        salaryText = `Up to ${job.currency} ${job.salaryMax.toLocaleString()}`;
      }
    }

    const jobTypeDisplay = job.jobType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');

    const countryTag = job.country.replace(/\s+/g, '');
    const categoryTag = job.category.replace(/\s+/g, '');

    const lines: string[] = [
      `[HIRING] ${job.title}`,
      '',
      `${job.companyName} is looking for ${job.title}!`,
    ];

    if (customMessage) {
      lines.push('', customMessage);
    }

    lines.push(
      '',
      `Location: ${job.location}, ${job.country}`,
    );

    if (salaryText) {
      lines.push(`Salary: ${salaryText}`);
    }

    lines.push(`Type: ${jobTypeDisplay}`);

    lines.push(
      '',
      'Apply now on JobAgentPH:',
      jobUrl,
      '',
      `#JobAgentPH #HiringNow #${countryTag}Jobs #${categoryTag}`,
    );

    return lines.join('\n');
  };

  const handlePostToFacebook = async () => {
    if (!selectedJob) {
      toast.error('Please select a job to post');
      return;
    }

    if (!user || !adminData) {
      toast.error('Admin authentication required');
      return;
    }

    setPosting(true);
    try {
      const response = await fetch('/api/admin/facebook/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          customMessage: customMessage.trim() || undefined,
          adminId: user.uid,
          adminName: `${adminData.firstName} ${adminData.lastName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post to Facebook');
      }

      toast.success(`"${selectedJob.title}" posted to Facebook!`);
      setSelectedJob(null);
      setCustomMessage('');
      setShowPreview(false);
      fetchPosts();
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to post to Facebook');
    } finally {
      setPosting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'posted':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Posted
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const unpostedJobs = jobs.filter(job => !postedJobIds.has(job.id));

  const handleCopyForFacebook = () => {
    if (!selectedJob) {
      toast.error('Please select a job to copy');
      return;
    }

    const postContent = formatJobForPreview(selectedJob);
    navigator.clipboard.writeText(postContent);
    toast.success('Copied to clipboard! Paste into Facebook.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Facebook className="w-6 h-6 text-blue-600" />
            Facebook Cross-Posting
          </h1>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('post')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'post'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Post Job
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              History
            </button>
          </div>
        </div>

        {activeTab === 'post' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Selector */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Select Job to Post</h2>
                <button
                  onClick={() => { fetchJobs(); fetchPosts(); }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loadingJobs ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-100 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : unpostedJobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p className="font-medium">All jobs have been posted!</p>
                  <p className="text-sm mt-1">Check the History tab to see posted jobs.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {unpostedJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedJob?.id === job.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-600">{job.companyName}</div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{job.location}, {job.country}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  {unpostedJobs.length} job{unpostedJobs.length !== 1 ? 's' : ''} not yet posted to Facebook
                </p>
              </div>
            </Card>

            {/* Post Preview & Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Post Preview</h2>

              {selectedJob ? (
                <div className="space-y-4">
                  {/* Selected Job Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-medium text-blue-900">{selectedJob.title}</div>
                    <div className="text-sm text-blue-700">{selectedJob.companyName}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {selectedJob.location}, {selectedJob.country}
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Message <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a custom message to appear in the post..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Preview Toggle */}
                  <Button
                    variant="secondary"
                    onClick={() => setShowPreview(!showPreview)}
                    icon={Eye}
                    iconPosition="left"
                    className="w-full"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Post Preview'}
                  </Button>

                  {/* Preview Content */}
                  {showPreview && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Facebook className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Job Agent Ph</div>
                          <div className="text-xs text-gray-500">Just now</div>
                        </div>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {formatJobForPreview(selectedJob)}
                      </pre>
                    </div>
                  )}

                  {/* Job Image - Right-click to copy */}
                  {selectedJob.imageUrl && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Job Image</span>
                        <span className="text-xs text-gray-400">(Right-click to copy)</span>
                      </div>
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={selectedJob.imageUrl}
                          alt={selectedJob.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Right-click the image above and select "Copy image" to paste into Facebook
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Copy Button - Always works */}
                    <Button
                      onClick={handleCopyForFacebook}
                      icon={Copy}
                      iconPosition="left"
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                    >
                      Copy for Facebook
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Copy the formatted post and paste directly into Facebook
                    </p>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-400">or use API</span>
                      </div>
                    </div>

                    {/* Post Button - Requires API setup */}
                    <Button
                      onClick={handlePostToFacebook}
                      disabled={posting}
                      icon={Facebook}
                      iconPosition="left"
                      variant="secondary"
                      className="w-full"
                    >
                      {posting ? 'Posting...' : 'Post via API'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Requires Facebook API setup (see instructions below)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                  <Facebook className="w-16 h-16 mb-4 opacity-30" />
                  <p>Select a job to preview and post</p>
                </div>
              )}
            </Card>
          </div>
        ) : (
          /* History Tab */
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Post History</h2>
              <button
                onClick={fetchPosts}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loadingPosts ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No posts yet</p>
                <p className="text-sm mt-1">Jobs posted to Facebook will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={`border rounded-lg p-4 ${
                      post.status === 'failed' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{post.jobTitle}</span>
                          {getStatusBadge(post.status)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Posted by {post.postedByName}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {post.createdAt
                            ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                            : 'Just now'}
                        </div>
                        {post.error && (
                          <div className="mt-2 text-sm text-red-600 bg-red-100 px-3 py-1 rounded">
                            Error: {post.error}
                          </div>
                        )}
                      </div>
                      {post.status === 'posted' && post.facebookPostId && (
                        <a
                          href={`https://www.facebook.com/${post.facebookPostId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                          title="View on Facebook"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Setup Instructions */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Setup Required</h3>
          <p className="text-sm text-yellow-700 mb-3">
            To enable Facebook cross-posting, you need to configure the following environment variables:
          </p>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li><code className="bg-yellow-100 px-1 rounded">FACEBOOK_PAGE_ID</code> - Your Facebook Page ID</li>
            <li><code className="bg-yellow-100 px-1 rounded">FACEBOOK_PAGE_ACCESS_TOKEN</code> - A long-lived Page Access Token</li>
          </ul>
          <p className="text-xs text-yellow-600 mt-3">
            Get these from the Facebook Developer Console after creating a Facebook App with pages_manage_posts permission.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
