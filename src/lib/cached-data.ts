/**
 * Cached data-access layer.
 *
 * Uses Next.js `unstable_cache` so repeated requests for the same data
 * skip the database entirely.  Combined with ISR on the pages, this means:
 *
 *   ISR pages  → 1 DB hit every N seconds, all other requests from CDN
 *   Dynamic pages (search) → DB hit only on cache miss (TTL-based)
 *
 * At 10 000 rpm with 60 s revalidation, MySQL sees ≈1 connection per
 * minute per cached function instead of 10 000.
 */

import { unstable_cache } from 'next/cache'

// ── TTL buckets (seconds) ──────────────────────────────────────

export const TTL = {
  /** 30 s – near-real-time for featured / homepage sections */
  FAST: 30,
  /** 60 s – job listings, search results */
  DEFAULT: 60,
  /** 5 min – detail pages that change infrequently */
  DETAIL: 300,
  /** 15 min – reference data (categories, counties) */
  REFERENCE: 900,
} as const

// ── Re-exports of types needed by callers ──────────────────────
// (kept here so pages can import from a single place)

// ── Jobs ───────────────────────────────────────────────────────

import {
  getFeaturedJobs,
  getJobBySlug,
  getSimilarJobs,
  getJobsByCategory,
  getJobsByCounty,
  getJobsByType,
  getClosingSoonJobs,
  getRecentJobs,
  getJobCount,
  searchJobs,
  getJobsByOrganization,
  getGovernmentJobs,
  getGovernmentJobsByType,
  type JobWithOrg,
  type JobDetail,
  type PaginatedResult,
  type JobSearchParams,
  type SortOption,
} from '@/lib/data/jobs'

import { EmploymentType, ExperienceLevel, OrganizationType } from '@prisma/client'

export type { JobWithOrg, JobDetail, PaginatedResult, JobSearchParams, SortOption }

export const cachedGetFeaturedJobs = unstable_cache(
  (limit: number = 6) => getFeaturedJobs(limit),
  ['featured-jobs'],
  { revalidate: TTL.FAST },
)

export const cachedGetRecentJobs = unstable_cache(
  (limit: number = 10) => getRecentJobs(limit),
  ['recent-jobs'],
  { revalidate: TTL.FAST },
)

export const cachedGetClosingSoonJobs = unstable_cache(
  (limit: number = 6) => getClosingSoonJobs(limit),
  ['closing-soon-jobs'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetJobBySlug = unstable_cache(
  (slug: string) => getJobBySlug(slug),
  ['job-by-slug'],
  { revalidate: TTL.DETAIL },
)

export const cachedGetSimilarJobs = unstable_cache(
  (jobId: string, categoryId?: string, limit: number = 5) =>
    getSimilarJobs(jobId, categoryId, limit),
  ['similar-jobs'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetJobsByCategory = unstable_cache(
  (slug: string, page: number, limit: number) =>
    getJobsByCategory(slug, page, limit),
  ['jobs-by-category'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetJobsByCounty = unstable_cache(
  (county: string, page: number, limit: number) =>
    getJobsByCounty(county, page, limit),
  ['jobs-by-county'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetJobsByType = unstable_cache(
  (type: EmploymentType, page: number, limit: number) =>
    getJobsByType(type, page, limit),
  ['jobs-by-type'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetJobCount = unstable_cache(
  (whereJson: string) => getJobCount(JSON.parse(whereJson)),
  ['job-count'],
  { revalidate: TTL.DEFAULT },
)

export const cachedSearchJobs = unstable_cache(
  (
    query: string,
    empType: string,
    county: string,
    categoryId: string,
    expLevel: string,
    isRemote: string,
    hasSalary: string,
    sort: string,
    page: number,
    limit: number,
  ) =>
    searchJobs({
      query: query || undefined,
      employmentType: (empType || undefined) as EmploymentType | undefined,
      locationCounty: county || undefined,
      categoryId: categoryId || undefined,
      experienceLevel: expLevel || undefined,
      isRemote: isRemote === 'true' ? true : isRemote === 'false' ? false : undefined,
      hasSalary: hasSalary === 'true' ? true : undefined,
      sort: (sort || 'newest') as SortOption,
      page,
      limit,
    }),
  ['search-jobs'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetGovernmentJobs = unstable_cache(
  (page: number, limit: number) => getGovernmentJobs(page, limit),
  ['government-jobs'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetGovernmentJobsByType = unstable_cache(
  (orgType: string, page: number, limit: number) =>
    getGovernmentJobsByType(orgType as OrganizationType, page, limit),
  ['government-jobs-by-type'],
  { revalidate: TTL.DEFAULT },
)

// ── Categories ─────────────────────────────────────────────────

import {
  getAllCategories,
  getCategoryBySlug,
  getSubcategoryBySlug,
  getPopularCategories,
  type CategoryWithCount,
  type CategoryWithSubcategories,
} from '@/lib/data/categories'

export type { CategoryWithCount, CategoryWithSubcategories }

export const cachedGetAllCategories = unstable_cache(
  () => getAllCategories(),
  ['all-categories'],
  { revalidate: TTL.REFERENCE },
)

export const cachedGetCategoryBySlug = unstable_cache(
  (slug: string) => getCategoryBySlug(slug),
  ['category-by-slug'],
  { revalidate: TTL.REFERENCE },
)

export const cachedGetPopularCategories = unstable_cache(
  (limit: number = 10) => getPopularCategories(limit),
  ['popular-categories'],
  { revalidate: TTL.REFERENCE },
)

// ── Opportunities ──────────────────────────────────────────────

import {
  searchOpportunities,
  getOpportunityCountsByType,
  getClosingSoonOpportunities,
  getOpportunityBySlug,
  getSimilarOpportunities,
  getOpportunitiesByProvider,
  getOpportunitiesByOrganization,
  type OpportunityListItem,
  type OpportunityDetail,
  type OpportunitySearchParams,
} from '@/lib/data/opportunities'

import { OpportunityType } from '@prisma/client'

export type { OpportunityListItem, OpportunityDetail, OpportunitySearchParams }

export const cachedSearchOpportunities = unstable_cache(
  (query: string, type: string, county: string, sort: string, page: number, limit: number) =>
    searchOpportunities({
      query: query || undefined,
      type: (type || undefined) as OpportunityType | undefined,
      county: county || undefined,
      sort: (sort || undefined) as any,
      page,
      limit,
    }),
  ['search-opportunities'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetOpportunityCountsByType = unstable_cache(
  () => getOpportunityCountsByType(),
  ['opportunity-counts-by-type'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetClosingSoonOpportunities = unstable_cache(
  (limit: number = 4) => getClosingSoonOpportunities(limit),
  ['closing-soon-opportunities'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetOpportunityBySlug = unstable_cache(
  (slug: string) => getOpportunityBySlug(slug),
  ['opportunity-by-slug'],
  { revalidate: TTL.DETAIL },
)

export const cachedGetSimilarOpportunities = unstable_cache(
  (id: string, type: string, county: string, limit: number) =>
    getSimilarOpportunities(
      id,
      (type || undefined) as OpportunityType | undefined,
      county || undefined,
      limit,
    ),
  ['similar-opportunities'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetOpportunitiesByProvider = unstable_cache(
  (providerName: string, excludeId: string, limit: number) =>
    getOpportunitiesByProvider(providerName, excludeId || undefined, limit),
  ['opportunities-by-provider'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetOpportunitiesByOrganization = unstable_cache(
  (orgId: string, limit: number) => getOpportunitiesByOrganization(orgId, limit),
  ['opportunities-by-org'],
  { revalidate: TTL.DEFAULT },
)

// ── Organizations ──────────────────────────────────────────────

import {
  searchOrganizations,
  getOrganizationBySlug,
  getActiveOrganizationSlugs,
  getSimilarOrganizations,
} from '@/lib/data/organizations'

export const cachedSearchOrganizations = unstable_cache(
  (search: string, orgType: string, orgIndustry: string, verified: string, sort: string, page: number, limit: number) =>
    searchOrganizations({
      search: search || undefined,
      orgType: orgType || undefined,
      orgIndustry: orgIndustry || undefined,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      sort: (sort || undefined) as any,
      page,
      limit,
    }),
  ['search-organizations'],
  { revalidate: TTL.DEFAULT },
)

export const cachedGetOrganizationBySlug = unstable_cache(
  (slug: string) => getOrganizationBySlug(slug),
  ['organization-by-slug'],
  { revalidate: TTL.DETAIL },
)

export const cachedGetActiveOrganizationSlugs = unstable_cache(
  () => getActiveOrganizationSlugs(),
  ['active-organization-slugs'],
  { revalidate: TTL.REFERENCE },
)

export const cachedGetSimilarOrganizations = unstable_cache(
  (industry: string, excludeId: string, limit: number) =>
    getSimilarOrganizations(industry, excludeId, limit),
  ['similar-organizations'],
  { revalidate: TTL.DEFAULT },
)