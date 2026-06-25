import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import EmployerAppsClient from './EmployerAppsClient'

export default async function EmployerAppsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>
}) {
  const session = await requireRole('EMPLOYER', 'ADMIN')
  const params = await searchParams

  const where: Record<string, unknown> = {
    job: { postedById: session.user.id },
  }
  if (params.jobId) {
    where.jobId = params.jobId
  }

  const applications = await db.jobApplication.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      job: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = applications.map((a) => ({
    id: a.id,
    applicantName: a.user.name || 'Unknown',
    applicantEmail: a.user.email,
    applicantPhone: a.user.phone,
    jobTitle: a.job.title,
    jobId: a.job.id,
    status: a.status,
    coverLetter: a.coverLetter,
    date: a.createdAt.toISOString(),
  }))

  return <EmployerAppsClient applications={data} />
}
