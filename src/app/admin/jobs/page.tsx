import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobsAdminClient } from "./JobsAdminClient"

export default async function AdminJobsPage() {
  await requireRole("ADMIN")

  const jobs = await db.job.findMany({
    orderBy: { datePosted: "desc" },
    select: {
      id: true, title: true, status: true, featured: true, datePosted: true,
      organization: { select: { orgName: true } },
    },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <p className="text-gray-500 mt-1">Manage all job listings</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <JobsAdminClient jobs={JSON.parse(JSON.stringify(jobs))} />
        </CardContent>
      </Card>
    </div>
  )
}