import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import EmployerJobsClient from './EmployerJobsClient'

export default async function EmployerJobsPage() {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  const jobs = await db.job.findMany({
    where: { postedById: session.user.id, deletedAt: null },
    include: {
      _count: { select: { applications: true } },
      organization: { select: { orgName: true } },
      category: { select: { label: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    employmentType: j.employmentType,
    datePosted: j.datePosted.toISOString(),
    applicationCount: j._count.applications,
    company: j.organization?.orgName || session.user.name || 'My Company',
  }))

  return <EmployerJobsClient jobs={data} />
}
