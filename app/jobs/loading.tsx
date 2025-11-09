import { JobListSkeleton } from '@/components/skeletons/JobCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar skeleton */}
        <div className="mb-8">
          <div className="h-14 bg-gray-200 animate-pulse rounded-lg w-full max-w-3xl mx-auto" />
        </div>

        {/* Filter buttons skeleton */}
        <div className="mb-6 flex gap-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg flex-shrink-0" />
          ))}
        </div>

        {/* Job cards skeleton */}
        <JobListSkeleton count={6} />
      </div>
    </div>
  );
}
