import { NextResponse } from 'next/server';
import { UNIQUE_COUNTIES } from '@/lib/data/counties';
import { db } from '@/lib/db';
import { JobStatus } from '@prisma/client';

export async function GET() {
  try {
    // Get job counts per county from DB
    const countyJobs = await db.job.groupBy({
      by: ['locationCounty'],
      where: {
        status: JobStatus.ACTIVE,
        deletedAt: null,
        locationCounty: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const countyCountMap = new Map(
      countyJobs.map((cj) => [cj.locationCounty!.toLowerCase(), cj._count.id])
    );

    const result = UNIQUE_COUNTIES.map((c) => ({
      name: c.name,
      slug: c.slug,
      capital: c.capital,
      jobCount: countyCountMap.get(c.name.toLowerCase()) ?? 0,
    })).sort((a, b) => b.jobCount - a.jobCount);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Counties API error:', error);
    // Fallback to static list
    return NextResponse.json(UNIQUE_COUNTIES);
  }
}