export default function HeroCarouselSkeleton() {
  return (
    <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gray-200 animate-pulse">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>

      {/* Content Area */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4">
            {/* Badge Skeleton */}
            <div className="w-32 md:w-40 h-6 md:h-8 bg-gray-300 rounded-full"></div>

            {/* Title Skeleton */}
            <div className="space-y-2 md:space-y-3">
              <div className="w-3/4 h-8 md:h-14 bg-gray-300 rounded"></div>
              <div className="w-1/2 h-8 md:h-14 bg-gray-300 rounded"></div>
            </div>

            {/* Company Skeleton */}
            <div className="w-48 md:w-64 h-6 md:h-8 bg-gray-300 rounded"></div>

            {/* Details Badges Skeleton */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="w-24 md:w-32 h-8 md:h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-28 md:w-36 h-8 md:h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-20 md:w-28 h-8 md:h-10 bg-gray-300 rounded-lg"></div>
            </div>

            {/* Description Skeleton - Hidden on Mobile */}
            <div className="hidden md:block space-y-2">
              <div className="w-full h-5 bg-gray-300 rounded"></div>
              <div className="w-5/6 h-5 bg-gray-300 rounded"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-wrap gap-2 md:gap-4 pt-2">
              <div className="w-32 md:w-48 h-10 md:h-12 bg-gray-300 rounded-full"></div>
              <div className="w-28 md:w-40 h-10 md:h-12 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Skeleton - Top Right */}
      <div className="absolute top-2 right-2 md:top-6 md:right-6 w-12 md:w-16 h-6 md:h-8 bg-gray-300 rounded-full"></div>

      {/* Dots Skeleton - Bottom Center - Hidden on Mobile */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-3 h-3 bg-gray-300 rounded-full"></div>
        ))}
      </div>
    </div>
  );
}
