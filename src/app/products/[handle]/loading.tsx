export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading...
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col space-y-6">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          
          {/* Price Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          
          {/* Description Skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
          
          {/* Availability Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </main>
  );
}

