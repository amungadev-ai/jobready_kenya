import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await db.jobApplication.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: {
            title: true, slug: true, locationCity: true, locationCounty: true,
            employmentType: true, status: true,
            organization: { select: { orgName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Applications GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
