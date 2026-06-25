import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import ApplicationsClient from './ApplicationsClient'

export default async function ApplicationsPage() {
  const session = await requireAuth()

  const applications = await db.jobApplication.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: {
          title: true,
          locationCity: true,
          locationCounty: true,
          employmentType: true,
          organization: { select: { orgName: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = applications.map((a) => ({
    id: a.id,
    jobTitle: a.job.title,
    company: a.job.organization?.orgName || 'Unknown',
    location: a.job.locationCity || a.job.locationCounty || 'Remote',
    type: a.job.employmentType || 'N/A',
    status: a.status,
    date: a.createdAt.toISOString(),
    coverLetter: a.coverLetter,
  }))

  return <ApplicationsClient applications={data} />
}
