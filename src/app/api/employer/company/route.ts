import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        companyName: true, companyLogoUrl: true, companyDescription: true,
        companyIndustry: true, companySize: true, companyWebsite: true, companyLocation: true,
      },
    })
    return NextResponse.json(user || {})
  } catch (error) {
    console.error('Company GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    await db.user.update({
      where: { id: session.user.id },
      data: {
        companyName: body.companyName || undefined,
        companyLogoUrl: body.companyLogoUrl || undefined,
        companyDescription: body.companyDescription || undefined,
        companyIndustry: body.companyIndustry || undefined,
        companySize: body.companySize || undefined,
        companyWebsite: body.companyWebsite || undefined,
        companyLocation: body.companyLocation || undefined,
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Company PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
