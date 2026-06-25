import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const jobs = await db.job.findMany({
      where: { postedById: session.user.id, deletedAt: null },
      include: { _count: { select: { applications: true } }, category: { select: { label: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Employer jobs GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, categoryId, subcategoryId, employmentType, experienceLevel, educationLevel,
      locationCity, locationCounty, isRemote, salaryMin, salaryMax, salaryDisclosure, deadline, howToApply, applyEmail, applicationUrl } = body

    if (!title || !description || !subcategoryId) {
      return NextResponse.json({ error: 'Title, description, and subcategory are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36)

    const job = await db.job.create({
      data: {
        title, slug, description, subcategoryId,
        categoryId: categoryId || null,
        postedById: session.user.id,
        employmentType: employmentType || null,
        experienceLevel: experienceLevel || null,
        educationLevel: educationLevel || null,
        locationCity: locationCity || null,
        locationCounty: locationCounty || null,
        isRemote: isRemote || false,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        salaryDisclosure: salaryDisclosure || 'NOT_DISCLOSED',
        deadline: deadline ? new Date(deadline) : null,
        howToApply: howToApply || null,
        applyEmail: applyEmail || null,
        applicationUrl: applicationUrl || null,
        status: 'ACTIVE',
        searchText: `${title} ${description} ${locationCity || ''} ${locationCounty || ''}`,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Employer jobs POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
