import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  GraduationCap,
  Wifi,
  Clock,
  DollarSign,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import {
  EmploymentType,
  ExperienceLevel,
  EducationLevel,
  SalaryDisclosure,
} from '@prisma/client';
import {
  EmploymentTypeLabels,
  ExperienceLevelLabels,
  EducationLevelLabels,
} from '@/lib/enums';
import { formatSalaryRange, formatDate, isClosingSoon, formatDeadlineCountdown } from '@/lib/utils/seo';
import {
  TrendingSearchesWidget,
  CVAdWidget,
  JobAlertsWidget,
  SmartMatchingWidget,
} from '@/components/shared/MarketingSidebar';
import type { JobDetail } from '@/lib/data/jobs';

// ============================================================
// COMPONENT
// ============================================================

interface JobDetailSidebarProps {
  job: JobDetail;
}

export function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  const salaryText = formatSalaryRange(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency,
    job.salaryDisclosure,
  );

  const deadlineText = job.deadline ? formatDeadlineCountdown(job.deadline) : null;
  const closingSoon = job.deadline ? isClosingSoon(job.deadline) : false;
  const isClosed = deadlineText === 'Closed';

  const locationLabel = [job.locationCity, job.locationCounty].filter(Boolean).join(', ') || 'Kenya';
  const remoteLabel = job.isRemote ? (job.locationCity ? 'Hybrid' : 'Remote') : 'On-site';

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Smart Job Matching */}
      <SmartMatchingWidget />

      {/* Job Summary — template style key-value pairs */}
      <div className="rounded-xl border border-white/60 bg-white/70 p-5 backdrop-blur-sm">
        <h4 className="mb-3 border-b border-gray-200/60 pb-3 text-sm font-bold uppercase tracking-wider text-gray-700">
          Job Summary
        </h4>
        <div className="space-y-2.5 text-sm">
          {job.experienceLevel && (
            <div className="flex justify-between">
              <span className="text-gray-500">Experience</span>
              <span className="font-medium text-gray-700">
                {ExperienceLevelLabels[job.experienceLevel]}
              </span>
            </div>
          )}
          {job.employmentType && (
            <div className="flex justify-between">
              <span className="text-gray-500">Employment Type</span>
              <span className="font-medium text-gray-700">
                {EmploymentTypeLabels[job.employmentType]}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span className="font-medium text-gray-700">{locationLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Remote</span>
            <span className="font-medium text-gray-700">{remoteLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Salary</span>
            <span className="font-medium text-emerald-600">{salaryText || 'Not disclosed'}</span>
          </div>
          {job.deadline && (
            <div className="flex justify-between">
              <span className="text-gray-500">Deadline</span>
              <span className={`font-medium ${isClosed ? 'text-gray-400' : closingSoon ? 'text-red-600' : 'text-gray-700'}`}>
                {formatDate(job.deadline)}
              </span>
            </div>
          )}
          {job.educationLevel && (
            <div className="flex justify-between">
              <span className="text-gray-500">Education</span>
              <span className="font-medium text-gray-700">
                {EducationLevelLabels[job.educationLevel]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Trending Searches */}
      <TrendingSearchesWidget />

      {/* CV Ad */}
      <CVAdWidget />

      {/* Job Alerts */}
      <JobAlertsWidget />
    </aside>
  );
}