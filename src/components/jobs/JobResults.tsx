'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  SearchX,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobCard } from '@/components/shared/JobCard';
import { JobCardSkeletonList } from '@/components/shared/JobCardSkeleton';
import type { JobWithOrg } from '@/lib/data/jobs';

// ============================================================
// TYPES
// ============================================================

interface JobResultsProps {
  jobs: JobWithOrg[];
  total: number;
  page: number;
  totalPages: number;
  isLoading?: boolean;
}

type SortOption = 'newest' | 'deadline-soon' | 'deadline-later';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'deadline-soon', label: 'Deadline soon' },
  { value: 'deadline-later', label: 'Deadline later' },
];

// ============================================================
// COMPONENT
// ============================================================

export function JobResults({
  jobs,
  total,
  page,
  totalPages,
  isLoading = false,
}: JobResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') as SortOption | null;

  // ----- Sort handler -----
  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'newest') {
        params.delete('sort');
      } else {
        params.set('sort', value);
      }
      params.delete('page');
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  // ----- Per-page handler -----
  const handlePerPageChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', value);
      params.delete('page');
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  // ----- Page navigation -----
  const createPageUrl = useCallback(
    (pageNum: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (pageNum <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(pageNum));
      }
      return `/jobs?${params.toString()}`;
    },
    [searchParams]
  );

  const goToPage = useCallback(
    (pageNum: number) => {
      router.push(createPageUrl(pageNum));
    },
    [router, createPageUrl]
  );

  // ----- Pagination range -----
  const paginationRange = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  // ----- Showing range -----
  const limit = Number(searchParams.get('limit')) || 20;
  const showingFrom = (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  // ----- Empty state -----
  if (!isLoading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <SearchX className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-800">No jobs found</h3>
        <p className="mt-1.5 max-w-sm text-sm text-gray-500">
          Try adjusting your search terms or filters to discover more
          opportunities.
        </p>
      </div>
    );
  }

  // ----- Loading state -----
  if (isLoading) {
    return <JobCardSkeletonList count={8} />;
  }

  return (
    <div>
      {/* Job list */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            slug={job.slug}
            description={job.description}
            organizationName={job.organization?.orgName}
            organizationLogoUrl={job.organization?.orgLogoUrl}
            organizationSlug={job.organization?.orgSlug}
            locationCity={job.locationCity}
            locationCounty={job.locationCounty}
            employmentType={job.employmentType}
            experienceLevel={job.experienceLevel}
            salaryMin={job.salaryMin}
            salaryMax={job.salaryMax}
            salaryDisclosure={job.salaryDisclosure}
            salaryCurrency={job.salaryCurrency}
            datePosted={job.datePosted}
            deadline={job.deadline}
            isRemote={job.isRemote}
            isFeatured={job.isFeatured}
          />
        ))}
      </div>

      {/* Pagination — template style */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200/50 pt-4">
          {/* Left: showing info + per-page */}
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-medium text-gray-700">{showingFrom}-{showingTo}</span> of{' '}
              <span className="font-medium text-gray-700">{total.toLocaleString()}</span> jobs
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="per-page" className="text-sm text-gray-500">Show:</label>
              <select
                id="per-page"
                value={limit}
                onChange={(e) => handlePerPageChange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white/70 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none"
              >
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Right: page buttons — template pill style */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                page <= 1
                  ? 'cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              ←
            </button>

            {paginationRange.map((item, idx) =>
              item === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="text-sm text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    page === item
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                page >= totalPages
                  ? 'cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}