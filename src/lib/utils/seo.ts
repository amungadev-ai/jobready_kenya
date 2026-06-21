import { formatDistanceToNowStrict, differenceInDays, parseISO } from 'date-fns';
import { EmploymentType, ExperienceLevel, EducationLevel, SalaryDisclosure, OrganizationType } from '@prisma/client';
import {
  EmploymentTypeLabels,
  ExperienceLevelLabels,
  EducationLevelLabels,
  SalaryDisclosureLabels,
  OrganizationTypeLabels,
} from '@/lib/enums';

// ============================================================
// JSON-LD SCHEMA GENERATORS
// ============================================================

interface JobPostingSchemaInput {
  title: string;
  description: string;
  datePosted: string | Date;
  deadline?: string | Date | null;
  organizationName?: string | null;
  organizationWebsite?: string | null;
  locationCity?: string | null;
  locationCounty?: string | null;
  isRemote?: boolean;
  employmentType?: EmploymentType | null;
  experienceLevel?: ExperienceLevel | null;
  educationLevel?: EducationLevel | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  slug: string;
}

export function generateJobSchema(job: JobPostingSchemaInput): object {
  const employmentTypeMap: Record<string, string> = {
    FULL_TIME: 'FULL_TIME',
    PART_TIME: 'PART_TIME',
    CONTRACT: 'CONTRACTOR',
    FREELANCE: 'CONTRACTOR',
    INTERNSHIP: 'INTERN',
    TEMPORARY: 'TEMPORARY',
    CASUAL: 'PART_TIME',
    VOLUNTEER: 'VOLUNTEER',
    APPRENTICESHIP: 'INTERN',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'JobBoard Kenya',
      value: job.slug,
    },
    datePosted: job.datePosted instanceof Date ? job.datePosted.toISOString() : job.datePosted,
    ...(job.deadline && {
      validThrough: job.deadline instanceof Date ? job.deadline.toISOString() : job.deadline,
    }),
    ...(job.employmentType && {
      employmentType: employmentTypeMap[job.employmentType] ?? 'FULL_TIME',
    }),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organizationName ?? 'Unspecified Employer',
      ...(job.organizationWebsite && { sameAs: job.organizationWebsite }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.locationCity ?? 'Kenya',
        addressRegion: job.locationCounty ?? undefined,
        addressCountry: 'KE',
      },
    },
    ...(job.isRemote && {
      jobLocationType: 'TELECOMMUTE',
    }),
    ...(job.experienceLevel && {
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: getExperienceMonths(job.experienceLevel),
      },
    }),
    ...(job.educationLevel && {
      educationRequirements: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: mapEducationLevel(job.educationLevel),
      },
    }),
    ...(job.salaryMin != null && job.salaryMax != null && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salaryCurrency ?? 'KES',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin,
          maxValue: job.salaryMax,
          unitText: 'MONTH',
        },
      },
    }),
  };
}

interface BreadcrumbItem {
  name: string;
  href?: string;
}

// ============================================================
// WEB SITE SCHEMA (homepage)
// ============================================================

export function generateWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JOBR Kenya',
    url: 'https://jobr.co.ke',
    description: "Kenya's #1 job board. Discover verified jobs, government jobs, internships, scholarships, and career opportunities.",
    inLanguage: 'en-KE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jobr.co.ke/jobs?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================================
// COLLECTION PAGE SCHEMA (hub / listing pages)
// ============================================================

interface CollectionPageSchemaInput {
  name: string;
  description: string;
  url: string;
}

export function generateCollectionPageSchema(input: CollectionPageSchemaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'JOBR Kenya',
      url: 'https://jobr.co.ke',
    },
  };
}

// ============================================================
// ITEM LIST SCHEMA (for category/county index directories)
// ============================================================

interface ItemListEntry {
  name: string;
  url: string;
  position: number;
}

export function generateItemListSchema(
  name: string,
  url: string,
  items: ItemListEntry[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href && { item: item.href }),
    })),
  };
}

// ============================================================
// DATE / TIME UTILITIES
// ============================================================

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();

  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return formatDistanceToNowStrict(d, { addSuffix: true });
}

export function formatDeadlineCountdown(deadline: string | Date): string | null {
  const d = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  const now = new Date();
  const days = differenceInDays(d, now);

  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function isClosingSoon(deadline: string | Date, thresholdDays: number = 7): boolean {
  const d = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  const now = new Date();
  const days = differenceInDays(d, now);
  return days >= 0 && days <= thresholdDays;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ============================================================
// TEXT UTILITIES
// ============================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '...';
}

// ============================================================
// SALARY FORMATTING
// ============================================================

export function formatSalaryRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string = 'KES',
  disclosure?: SalaryDisclosure | null
): string | null {
  if (disclosure === SalaryDisclosure.NOT_DISCLOSED) return null;
  if (disclosure === SalaryDisclosure.NEGOTIABLE) return 'Negotiable';
  if (disclosure === SalaryDisclosure.COMPETITIVE) return 'Competitive';
  if (min == null && max == null) return null;

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString('en-KE');
  };

  const currencySymbol = currency === 'KES' ? 'KSh' : currency;
  if (min != null && max != null) return `${currencySymbol} ${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${currencySymbol} ${fmt(min)}`;
  if (max != null) return `Up to ${currencySymbol} ${fmt(max)}`;
  return null;
}

// ============================================================
// INTERNAL HELPERS
// ============================================================

function getExperienceMonths(level: ExperienceLevel): number {
  const map: Record<ExperienceLevel, number> = {
    [ExperienceLevel.ENTRY]: 0,
    [ExperienceLevel.JUNIOR]: 12,
    [ExperienceLevel.MID]: 36,
    [ExperienceLevel.SENIOR]: 60,
    [ExperienceLevel.LEAD]: 96,
    [ExperienceLevel.EXECUTIVE]: 120,
  };
  return map[level] ?? 0;
}

function mapEducationLevel(level: EducationLevel): string {
  const map: Record<EducationLevel, string> = {
    [EducationLevel.NONE]: 'none',
    [EducationLevel.HIGH_SCHOOL]: 'high_school',
    [EducationLevel.CERTIFICATE]: 'associate_degree',
    [EducationLevel.DIPLOMA]: 'associate_degree',
    [EducationLevel.BACHELORS]: 'bachelor_degree',
    [EducationLevel.MASTERS]: 'master_degree',
    [EducationLevel.DOCTORATE]: 'doctorate_degree',
    [EducationLevel.PROFESSIONAL]: 'professional_certificate',
  };
  return map[level] ?? 'none';
}