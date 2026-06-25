import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const saved = await db.savedJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: {
            id: true, title: true, slug: true, locationCity: true, locationCounty: true,
            employmentType: true,
            organization: { select: { orgName: true, orgLogoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('SavedJobs GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await req.json()
    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    }

    const saved = await db.savedJob.create({
      data: { userId: session.user.id, jobId },
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 })
    }
    console.error('SavedJobs POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await req.json()
    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    }

    await db.savedJob.deleteMany({
      where: { userId: session.user.id, jobId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SavedJobs DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
