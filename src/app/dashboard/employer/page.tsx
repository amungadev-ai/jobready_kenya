import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import EmployerOverviewClient from './EmployerOverviewClient'

export default async function EmployerDashboardPage() {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  const [totalJobs, activeJobs, totalApps, recentApps] = await Promise.all([
    db.job.count({ where: { postedById: session.user.id, deletedAt: null } }),
    db.job.count({ where: { postedById: session.user.id, status: 'ACTIVE', deletedAt: null } }),
    db.jobApplication.count({
      where: { job: { postedById: session.user.id } },
    }),
    db.jobApplication.findMany({
      where: { job: { postedById: session.user.id } },
      include: {
        user: { select: { name: true, email: true } },
        job: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const data = {
    totalJobs, activeJobs, totalApps,
    recentApplications: recentApps.map((a) => ({
      id: a.id,
      applicantName: a.user.name || 'Unknown',
      applicantEmail: a.user.email,
      jobTitle: a.job.title,
      status: a.status,
      date: a.createdAt.toISOString(),
    })),
  }

  return <EmployerOverviewClient data={data} />
}
