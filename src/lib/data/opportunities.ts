import { db } from '@/lib/db';
import { OpportunityStatus, OpportunityType, FundingDisclosure } from '@prisma/client';

// ============================================================
// TYPES
// ============================================================

export interface OpportunityListItem {
  id: string;
  title: string;
  slug: string;
  type: OpportunityType;
  providerName: string;
  providerLogoUrl?: string | null;
  locationCity?: string | null;
  locationCounty?: string | null;
  isRemote: boolean;
  isOnline: boolean;
  fundingDisclosure: FundingDisclosure;
  fundingAmount?: number | null;
  fundingCurrency: string;
  datePosted: Date;
  deadline?: Date | null;
  featured: boolean;
}

export interface PaginatedOpportunityResult {
  data: OpportunityListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OpportunitySearchParams {
  query?: string;
  type?: OpportunityType;
  county?: string;
  sort?: 'newest' | 'deadline-soon' | 'deadline-later';
  page?: number;
  limit?: number;
}

export interface OpportunityDetail extends OpportunityListItem {
  description: string;
  seoDescription?: string | null;
  seoTitle?: string | null;
  eligibilityCriteria?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  duration?: string | null;
  applicationUrl?: string | null;
  applyEmail?: string | null;
  howToApply?: string | null;
  openToInternational: boolean;
  targetDemographic?: string | null;
  providerWebsite?: string | null;
  providerOrg?: {
    id: string;
    orgName: string;
    orgSlug: string;
    orgLogoUrl?: string | null;
  } | null;
}

// ============================================================
// DATA ACCESS FUNCTIONS
// ============================================================

const activeOpportunityWhere = {
  status: OpportunityStatus.ACTIVE,
  deletedAt: null,
};

export async function getFeaturedOpportunities(limit: number = 6): Promise<OpportunityListItem[]> {
  return db.opportunity.findMany({
    where: { ...activeOpportunityWhere, featured: true },
    orderBy: { datePosted: 'desc' },
    take: limit,
  }) as Promise<OpportunityListItem[]>;
}

export async function getOpportunitiesByType(
  type: OpportunityType,
  limit: number = 10
): Promise<OpportunityListItem[]> {
  return db.opportunity.findMany({
    where: { ...activeOpportunityWhere, type },
    orderBy: { datePosted: 'desc' },
    take: limit,
  }) as Promise<OpportunityListItem[]>;
}

export async function getRecentOpportunities(limit: number = 10): Promise<OpportunityListItem[]> {
  return db.opportunity.findMany({
    where: activeOpportunityWhere,
    orderBy: { datePosted: 'desc' },
    take: limit,
  }) as Promise<OpportunityListItem[]>;
}

export async function getOpportunitiesByOrganization(
  orgId: string,
  limit: number = 6
): Promise<OpportunityListItem[]> {
  return db.opportunity.findMany({
    where: { ...activeOpportunityWhere, providerOrgId: orgId },
    orderBy: { datePosted: 'desc' },
    take: limit,
  }) as Promise<OpportunityListItem[]>;
}

export async function getOpportunityBySlug(slug: string): Promise<OpportunityDetail | null> {
  const opp = await db.opportunity.findUnique({
    where: { slug },
    include: {
      providerOrg: {
        select: {
          id: true,
          orgName: true,
          orgSlug: true,
          orgLogoUrl: true,
        },
      },
    },
  });

  if (!opp || opp.status !== 'ACTIVE' || opp.deletedAt) return null;
  return opp as unknown as OpportunityDetail;
}

// ============================================================
// SEARCH / PAGINATED LISTING
// ============================================================

export async function searchOpportunities(
  params: OpportunitySearchParams
): Promise<PaginatedOpportunityResult> {
  const {
    query,
    type,
    county,
    sort = 'newest',
    page = 1,
    limit = 20,
  } = params;

  const where: Record<string, unknown> = { ...activeOpportunityWhere };

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { providerName: { contains: query } },
      { description: { contains: query } },
    ];
  }

  if (type) {
    where.type = type;
  }

  if (county) {
    where.locationCounty = { contains: county };
  }

  // Determine sort order
  let orderBy: Record<string, string>;
  switch (sort) {
    case 'deadline-soon':
      orderBy = { deadline: 'asc' };
      break;
    case 'deadline-later':
      orderBy = { deadline: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { datePosted: 'desc' };
  }

  const [data, total] = await Promise.all([
    db.opportunity.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.opportunity.count({ where }),
  ]);

  return {
    data: data as unknown as OpportunityListItem[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// ALL SLUGS (for generateStaticParams)
// ============================================================

export async function getAllOpportunitySlugs(): Promise<string[]> {
  const slugs = await db.opportunity.findMany({
    where: activeOpportunityWhere,
    select: { slug: true },
    orderBy: { datePosted: 'desc' },
  });
  return slugs.map((s) => s.slug);
}

// ============================================================
// OPPORTUNITY COUNTS BY TYPE (for filter tab badges)
// ============================================================

export async function getOpportunityCountsByType(): Promise<Record<OpportunityType, number>> {
  const counts = await db.opportunity.groupBy({
    by: ['type'],
    where: activeOpportunityWhere,
    _count: { id: true },
  });

  const map: Record<string, number> = {};
  for (const c of counts) {
    map[c.type] = c._count.id;
  }

  const result = {} as Record<OpportunityType, number>;
  for (const t of Object.values(OpportunityType)) {
    result[t] = map[t] ?? 0;
  }
  return result;
}

// ============================================================
// CLOSING SOON OPPORTUNITIES (deadline within 7 days, not past)
// ============================================================

export async function getClosingSoonOpportunities(limit: number = 4): Promise<OpportunityListItem[]> {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const opps = await db.opportunity.findMany({
    where: {
      ...activeOpportunityWhere,
      deadline: {
        gte: now,
        lte: sevenDaysFromNow,
      },
    },
    orderBy: { deadline: 'asc' },
    take: limit,
  });

  return opps as unknown as OpportunityListItem[];
}

// ============================================================
// OPPORTUNITIES BY PROVIDER (for "More from this provider")
// ============================================================

export async function getOpportunitiesByProvider(
  providerName: string,
  excludeId?: string,
  limit: number = 5
): Promise<OpportunityListItem[]> {
  const where: Record<string, unknown> = {
    ...activeOpportunityWhere,
    providerName,
  };

  if (excludeId) {
    where.id = { not: excludeId };
  }

  const opps = await db.opportunity.findMany({
    where,
    orderBy: { datePosted: 'desc' },
    take: limit,
  });

  return opps as unknown as OpportunityListItem[];
}

// ============================================================
// OPPORTUNITY COUNT FOR ORGANIZATION
// ============================================================

export async function getOpportunityCountForOrganization(orgId: string): Promise<number> {
  return db.opportunity.count({
    where: { ...activeOpportunityWhere, providerOrgId: orgId },
  });
}

// ============================================================
// SIMILAR OPPORTUNITIES
// ============================================================

export async function getSimilarOpportunities(
  opportunityId: string,
  type?: OpportunityType,
  county?: string,
  limit: number = 5
): Promise<OpportunityListItem[]> {
  const where: Record<string, unknown> = {
    ...activeOpportunityWhere,
    id: { not: opportunityId },
  };

  if (type) {
    where.type = type;
  }

  if (county) {
    where.locationCounty = { contains: county };
  }

  const opps = await db.opportunity.findMany({
    where,
    orderBy: { datePosted: 'desc' },
    take: limit,
  });

  return opps as unknown as OpportunityListItem[];
}

// ============================================================
// OPPORTUNITY STATS (for index page summary)
// ============================================================

export async function getOpportunityTypeStats(): Promise<{ type: OpportunityType; count: number }[]> {
  const counts = await db.opportunity.groupBy({
    by: ['type'],
    where: activeOpportunityWhere,
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return counts.map((c) => ({
    type: c.type as OpportunityType,
    count: c._count.id,
  }));
}