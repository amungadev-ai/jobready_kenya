import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import SavedJobsClient from './SavedJobsClient'

export default async function SavedPage() {
  const session = await requireAuth()

  const saved = await db.savedJob.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          locationCity: true,
          locationCounty: true,
          employmentType: true,
          organization: { select: { orgName: true, orgLogoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = saved.map((s) => ({
    id: s.id,
    jobId: s.job.id,
    jobSlug: s.job.slug,
    title: s.job.title,
    company: s.job.organization?.orgName || 'Unknown',
    logoUrl: s.job.organization?.orgLogoUrl,
    location: s.job.locationCity || s.job.locationCounty || 'Remote',
    type: s.job.employmentType || 'N/A',
    savedAt: s.createdAt.toISOString(),
  }))

  return <SavedJobsClient savedJobs={data} />
}
