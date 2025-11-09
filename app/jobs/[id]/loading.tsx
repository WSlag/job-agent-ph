export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image skeleton */}
            <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />

            {/* Title and company skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 animate-pulse rounded-full" />
              ))}
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Apply button skeleton */}
            <div className="h-12 bg-gray-200 animate-pulse rounded-xl" />

            {/* Info cards skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
