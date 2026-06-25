import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const apps = await db.jobApplication.findMany({
      where: { job: { postedById: session.user.id } },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(apps)
  } catch (error) {
    console.error('Employer apps GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
