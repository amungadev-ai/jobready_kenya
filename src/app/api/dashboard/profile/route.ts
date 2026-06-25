import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, phone: true, bio: true,
        location: true, resumeUrl: true, linkedinUrl: true, websiteUrl: true,
        educationLevel: true, experienceYears: true, skills: true,
        role: true, image: true, createdAt: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ ...user, skills: user.skills ? JSON.parse(user.skills) : [] })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, bio, location, resumeUrl, linkedinUrl, websiteUrl, educationLevel, experienceYears, skills } = body

    const skillsStr = Array.isArray(skills) ? JSON.stringify(skills) : (typeof skills === 'string' ? skills : null)

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        location: location || undefined,
        resumeUrl: resumeUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        websiteUrl: websiteUrl || undefined,
        educationLevel: educationLevel || undefined,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        skills: skillsStr || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
