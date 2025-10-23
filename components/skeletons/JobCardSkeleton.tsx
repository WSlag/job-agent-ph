import { Skeleton } from "@/components/ui/Skeleton"

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-40 sm:h-48 w-full" />

      {/* Content skeleton */}
      <div className="p-3 sm:p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-4 sm:h-6 w-3/4" />

        {/* Company */}
        <Skeleton className="h-3 sm:h-4 w-1/2" />

        {/* Location */}
        <Skeleton className="h-3 sm:h-4 w-2/3" />

        {/* Salary */}
        <Skeleton className="h-3 sm:h-4 w-1/3" />

        {/* Skills */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Posted time */}
        <Skeleton className="h-3 w-24" />

        {/* Button */}
        <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function JobListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}
