import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { formatSalaryRange } from '@/lib/utils/seo';
import type { JobWithOrg } from '@/lib/data/jobs';

interface SimilarJobsProps {
  jobs: JobWithOrg[];
  categoryLabel?: string;
  categorySlug?: string;
}

export function SimilarJobs({ jobs, categoryLabel, categorySlug }: SimilarJobsProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="border-t border-gray-200/50 pt-4">
      <h3 className="text-lg font-extrabold text-gray-800">Similar Jobs</h3>
      <div className="mt-4 divide-y divide-gray-200/50 rounded-xl border border-white/60 bg-white/70 backdrop-blur-sm">
        {jobs.slice(0, 5).map((job, i) => {
          const salaryText = formatSalaryRange(
            job.salaryMin,
            job.salaryMax,
            job.salaryCurrency,
            job.salaryDisclosure,
          );
          const orgName = job.organization?.orgName ?? '';
          const location = [job.locationCity, job.locationCounty].filter(Boolean).join(', ') || '';

          return (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className={`flex flex-wrap items-center justify-between gap-2 py-3 px-5 transition hover:bg-emerald-50/30 ${
                i === 0 ? 'rounded-t-xl' : ''
              } ${i === Math.min(jobs.length, 5) - 1 ? 'rounded-b-xl' : ''}`}
            >
              <div>
                <span className="text-sm font-semibold text-gray-800 transition hover:text-emerald-600">
                  {job.title}
                </span>
                <span className="ml-2 text-sm text-gray-400 transition hover:text-gray-600">
                  {orgName}{location ? ` · ${location}` : ''}
                </span>
              </div>
              <span className="text-xs text-gray-500">{salaryText}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}