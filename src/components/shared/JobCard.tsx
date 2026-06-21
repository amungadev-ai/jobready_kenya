import Link from 'next/link';
import {
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Star,
  Wifi,
} from 'lucide-react';
import { EmploymentType, ExperienceLevel, SalaryDisclosure } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import {
  EmploymentTypeLabels,
  ExperienceLevelLabels,
  EmploymentTypeColors,
  ExperienceLevelColors,
} from '@/lib/enums';
import { formatRelativeDate, formatDeadlineCountdown, formatSalaryRange } from '@/lib/utils/seo';

// ============================================================
// TYPES
// ============================================================

interface JobCardProps {
  title: string;
  slug: string;
  organizationName?: string | null;
  organizationLogoUrl?: string | null;
  organizationSlug?: string | null;
  locationCity?: string | null;
  locationCounty?: string | null;
  employmentType?: EmploymentType | null;
  experienceLevel?: ExperienceLevel | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryDisclosure?: SalaryDisclosure | null;
  salaryCurrency?: string;
  datePosted: string | Date;
  deadline?: string | Date | null;
  isRemote?: boolean;
  isFeatured?: boolean;
  description?: string | null;
}

// ============================================================
// HELPERS
// ============================================================

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getLocationLabel(city?: string | null, county?: string | null, remote?: boolean): string {
  const parts: string[] = [];
  if (remote) parts.push('Remote');
  if (city) parts.push(city);
  else if (county) parts.push(county);
  return parts.join(', ') || 'Kenya';
}

function formatDeadline(text: string): string {
  return text.replace(/ left$/, '').replace(/ day$/, ' days');
}

// ============================================================
// COMPONENT
// ============================================================

export function JobCard({
  title,
  slug,
  organizationName,
  organizationLogoUrl,
  organizationSlug,
  locationCity,
  locationCounty,
  employmentType,
  experienceLevel,
  salaryMin,
  salaryMax,
  salaryDisclosure,
  salaryCurrency = 'KES',
  datePosted,
  deadline,
  isRemote = false,
  isFeatured = false,
  description = null,
}: JobCardProps) {
  const salaryText = formatSalaryRange(salaryMin, salaryMax, salaryCurrency, salaryDisclosure);
  const deadlineText = deadline ? formatDeadlineCountdown(deadline) : null;
  const isUrgent = deadlineText && !deadlineText.startsWith('Closed') && !deadlineText.startsWith('Closes today');

  const borderClass = isFeatured
    ? 'border-l-4 border-l-emerald-500 border-t-white/60 border-r-white/60 border-b-white/60'
    : 'border-white/60';

  return (
    <div
      className={`group rounded-xl border bg-white/70 p-4 backdrop-blur-sm transition hover:border-emerald-300 hover:bg-emerald-50/30 sm:p-5 ${borderClass}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Org logo or placeholder */}
        <div className="shrink-0">
          {organizationLogoUrl ? (
            <img
              src={organizationLogoUrl}
              alt={organizationName ?? 'Organization'}
              className="h-11 w-11 rounded-xl object-cover shadow-sm sm:h-12 sm:w-12"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-extrabold text-emerald-700 shadow-sm sm:h-12 sm:w-12 sm:text-base">
              {organizationName ? getInitials(organizationName) : '?'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Title & featured badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/jobs/${slug}`}
                className="text-sm font-semibold leading-snug text-gray-800 transition hover:text-emerald-600 sm:text-base sm:font-bold"
              >
                {title}
              </Link>
              <div className="mt-0.5 flex items-center gap-1.5">
                {organizationName && (
                  <Link
                    href={organizationSlug ? `/organizations/${organizationSlug}` : '#'}
                    className="text-xs text-gray-400 transition hover:text-gray-600 sm:text-sm"
                  >
                    {organizationName}
                  </Link>
                )}
                {isFeatured && (
                  <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                )}
              </div>
            </div>
            <span className="shrink-0 text-xs text-gray-300">
              {formatRelativeDate(datePosted)}
            </span>
          </div>

          {/* Badges row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="gap-1 border-gray-200 bg-gray-50 text-xs font-medium text-gray-600"
            >
              <MapPin className="h-3 w-3" />
              {getLocationLabel(locationCity, locationCounty, isRemote)}
            </Badge>

            {isRemote && (
              <Badge
                variant="outline"
                className="gap-1 border-gray-200 bg-gray-50 text-xs font-medium text-gray-600"
              >
                <Wifi className="h-3 w-3" />
                Remote
              </Badge>
            )}

            {employmentType && (
              <Badge
                variant="outline"
                className={`text-xs font-medium ${EmploymentTypeColors[employmentType]}`}
              >
                <Briefcase className="h-3 w-3" />
                {EmploymentTypeLabels[employmentType]}
              </Badge>
            )}

            {experienceLevel && (
              <Badge
                variant="outline"
                className={`text-xs font-medium ${ExperienceLevelColors[experienceLevel]}`}
              >
                <GraduationCap className="h-3 w-3" />
                {ExperienceLevelLabels[experienceLevel]}
              </Badge>
            )}
          </div>

          {/* Description snippet */}
          {description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{description}</p>
          )}

          {/* Bottom row: salary + deadline */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            {salaryText && (
              <span className="text-xs font-semibold text-emerald-600 sm:text-sm">
                {salaryText} /mo
              </span>
            )}
            {deadlineText && isUrgent && (
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-xs font-medium text-red-600"
              >
                <Clock className="h-3 w-3" />
                {'Closes in ' + formatDeadline(deadlineText)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}