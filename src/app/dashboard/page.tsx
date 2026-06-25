import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import { FileText, Bookmark, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DashboardOverviewClient from './DashboardOverviewClient'

export default async function DashboardPage() {
  const session = await requireAuth()

  const [applicationCount, savedCount, recentApplications] = await Promise.all([
    db.jobApplication.count({ where: { userId: session.user.id } }),
    db.savedJob.count({ where: { userId: session.user.id } }),
    db.jobApplication.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: { title: true, organization: { select: { orgName: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const data = {
    applicationCount,
    savedCount,
    recentApplications: recentApplications.map(a => ({
      id: a.id,
      jobTitle: a.job.title,
      company: a.job.organization?.orgName || 'Unknown',
      status: a.status,
      date: a.createdAt.toISOString(),
    })),
    userName: session.user.name || 'there',
  }

  return <DashboardOverviewClient data={data} />
}
