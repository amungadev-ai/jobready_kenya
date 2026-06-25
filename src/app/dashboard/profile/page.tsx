import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await requireAuth()

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      location: true,
      resumeUrl: true,
      linkedinUrl: true,
      websiteUrl: true,
      educationLevel: true,
      experienceYears: true,
      skills: true,
    },
  })

  if (!user) {
    return <div className="text-center py-12 text-gray-500">User not found.</div>
  }

  const profile = {
    ...user,
    skills: user.skills ? JSON.parse(user.skills) as string[] : [],
  }

  return <ProfileForm profile={profile} />
}
