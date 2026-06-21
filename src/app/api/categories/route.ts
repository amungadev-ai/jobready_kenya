import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    const categories = await db.jobCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            jobs: { where: { status: 'ACTIVE', deletedAt: null } },
          },
        },
      },
      take: limit,
    });

    return NextResponse.json(
      categories.map((c) => ({
        id: c.id,
        label: c.label,
        slug: c.slug,
        icon: c.icon,
        jobCount: c._count.jobs,
      }))
    );
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}