import { db } from '@/lib/db';
import { JobStatus, OpportunityStatus } from '@prisma/client';

// ============================================================
// TYPES
// ============================================================

export interface HomeStats {
  totalJobs: number;
  totalOrganizations: number;
  totalCategories: number;
  totalOpportunities: number;
}

export interface CategoryJobCount {
  categoryId: string;
  categoryLabel: string;
  categorySlug: string;
  jobCount: number;
}

// ============================================================
// DATA ACCESS FUNCTIONS
// ============================================================

export async function getHomeStats(): Promise<HomeStats> {
  const [totalJobs, totalOrganizations, totalCategories, totalOpportunities] =
    await Promise.all([
      db.job.count({
        where: { status: JobStatus.ACTIVE, deletedAt: null },
      }),
      db.organization.count({
        where: { isActive: true, deletedAt: null },
      }),
      db.jobCategory.count(),
      db.opportunity.count({
        where: { status: OpportunityStatus.ACTIVE, deletedAt: null },
      }),
    ]);

  return {
    totalJobs,
    totalOrganizations,
    totalCategories,
    totalOpportunities,
  };
}

export async function getCategoryJobCounts(): Promise<CategoryJobCount[]> {
  const categories = await db.jobCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: {
          jobs: { where: { status: JobStatus.ACTIVE, deletedAt: null } },
        },
      },
    },
  });

  return categories
    .map((c) => ({
      categoryId: c.id,
      categoryLabel: c.label,
      categorySlug: c.slug,
      jobCount: c._count.jobs,
    }))
    .sort((a, b) => b.jobCount - a.jobCount);
}