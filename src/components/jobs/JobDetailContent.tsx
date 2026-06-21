import Link from 'next/link';
import {
  Clock,
  ExternalLink,
  Mail,
  CalendarDays,
  Globe,
  Heart,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { formatRelativeDate, formatDeadlineCountdown, isClosingSoon, formatDate, formatSalaryRange } from '@/lib/utils/seo';
import { EmploymentTypeBadge, ExperienceLevelBadge } from '@/components/shared/Badge';
import type { JobDetail } from '@/lib/data/jobs';

// ============================================================
// HELPERS
// ============================================================

function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

// ============================================================
// COMPONENT
// ============================================================

interface JobDetailContentProps {
  job: JobDetail;
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  const org = job.organization;
  const orgName = org?.orgName ?? 'Unspecified Employer';
  const locationLabel = [job.locationCity, job.locationCounty].filter(Boolean).join(', ') || 'Kenya';

  const deadlineText = job.deadline ? formatDeadlineCountdown(job.deadline) : null;
  const closingSoon = job.deadline ? isClosingSoon(job.deadline) : false;
  const isClosed = deadlineText === 'Closed';

  const salaryText = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryDisclosure);

  // ── Apply actions ──
  const hasApplyUrl = !!job.applicationUrl;
  const hasApplyEmail = !!job.applyEmail && !hasApplyUrl;

  return (
    <div className="space-y-6">
      {/* Breadcrumb (handled by parent page) */}

      {/* ── Job Header Card ── */}
      <div className="rounded-xl border border-white/60 bg-white/70 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Company avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-xl font-extrabold text-emerald-700 shadow-sm">
              {orgName ? getInitials(orgName) : '?'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-gray-800 md:text-3xl">
                {job.title}
              </h1>
              <p className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
                {org?.orgSlug ? (
                  <Link href={`/organizations/${org.orgSlug}`} className="font-semibold text-gray-700 transition hover:text-emerald-600">
                    {orgName}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-700">{orgName}</span>
                )}
                <span className="text-gray-300">•</span>
                <span>{locationLabel}</span>
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {job.employmentType && <EmploymentTypeBadge type={job.employmentType} />}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-200/50 pt-4 text-xs text-gray-500">
          {salaryText && (
            <span className="flex items-center gap-1.5">
              💰 <span className="font-medium text-gray-700">{salaryText}</span>
            </span>
          )}
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1.5">
            📅 Posted <span className="font-medium text-gray-700">{formatRelativeDate(job.datePosted)}</span>
          </span>
          {job.deadline && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                ⏳ Closes <span className={`font-medium ${isClosed ? 'text-gray-400' : 'text-red-600'}`}>
                  {formatDate(job.deadline)}
                </span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Job Description ── */}
      <div className="rounded-xl border border-white/60 bg-white/70 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-extrabold text-gray-800">Job Description</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {job.description.slice(0, 300)}...
        </p>
        <h3 className="mt-5 text-md font-extrabold text-gray-800">Key Responsibilities</h3>
        <div
          className="mt-2 text-sm leading-relaxed text-gray-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
        />
        {job.howToApply && (
          <>
            <h3 className="mt-5 text-md font-extrabold text-gray-800">Requirements</h3>
            <div
              className="mt-2 text-sm leading-relaxed text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatDescription(job.howToApply) }}
            />
          </>
        )}
      </div>

      {/* ── Apply Section (emerald gradient) ── */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-800">Ready to apply?</h3>
            <p className="text-sm text-gray-600">Submit your application before the deadline.</p>
            {job.deadline && !isClosed && (
              <p className="mt-1 text-xs font-medium text-red-600">
                ⏳ Closes in {deadlineText}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {hasApplyUrl && (
              <a
                href={job.applicationUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {hasApplyEmail && (
              <a
                href={`mailto:${job.applyEmail}`}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
              >
                <Mail className="h-4 w-4" />
                Apply via Email
              </a>
            )}
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-emerald-400 hover:text-emerald-600">
              <Heart className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* ── Company Info (in main content, per template) ── */}
      {org && (
        <div className="rounded-xl border border-white/60 bg-white/70 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-extrabold text-gray-800">About the Company</h2>
          <div className="mt-3 flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-xl font-extrabold text-emerald-700 shadow-sm">
              {getInitials(org.orgName)}
            </div>
            <div>
              <h3 className="text-md font-bold text-gray-800">{org.orgName}</h3>
              <p className="text-sm text-gray-500">
                {org.orgIndustry ? `${org.orgIndustry.replace(/_/g, ' ')} · ` : ''}
                {org.headquarters || locationLabel}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {org.orgDescription || `${org.orgName} is a leading organization in Kenya's employment sector.`}
              </p>
              {org.orgWebsite && (
                <a
                  href={org.orgWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                >
                  Visit company website →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Share & Report ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-3">
          <span className="font-medium">Share:</span>
          <a href="#" className="transition hover:text-emerald-600">📧</a>
          <a href="#" className="transition hover:text-emerald-600">🐦</a>
          <a href="#" className="transition hover:text-emerald-600">💼</a>
          <a href="#" className="transition hover:text-emerald-600">📱</a>
        </div>
        <a href="#" className="text-xs text-gray-400 transition hover:text-red-500">
          Report this job
        </a>
      </div>

      {/* ── Source Attribution ── */}
      {job.sourcePlatform && (
        <p className="text-center text-xs text-gray-400">
          Originally posted on{' '}
          {job.sourceUrl ? (
            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline transition hover:text-gray-600">
              {job.sourcePlatform}
            </a>
          ) : (
            <span>{job.sourcePlatform}</span>
          )}
        </p>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function formatDescription(text: string): string {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^([ \t]*[-*][ \t]+)(.+)$/gm, '<li>$2</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  html = html.replace(/^([ \t]*\d+[.)][ \t]+)(.+)$/gm, '<li>$2</li>');
  html = html.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, content) => {
    const level = hashes.length;
    return `<h${Math.min(level, 4)}>${content}</h${Math.min(level, 4)}>`;
  });

  html = html
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(ul|ol|h[1-4])/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return html;
}