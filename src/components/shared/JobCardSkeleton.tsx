import { Skeleton } from '@/components/ui/skeleton';

export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/60 bg-white/70 p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Logo placeholder */}
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl sm:h-12 sm:w-12" />

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-2.5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1.5">
              <Skeleton className="h-4 w-48 sm:h-5 sm:w-64" />
              <Skeleton className="h-3 w-28 sm:w-36" />
            </div>
            <Skeleton className="h-3 w-10 shrink-0" />
          </div>

          {/* Badge placeholders */}
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}