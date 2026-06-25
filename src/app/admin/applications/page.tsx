import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  HIRED: "bg-green-100 text-green-700",
}

export default async function AdminApplicationsPage() {
  await requireRole("ADMIN")

  const applications = await db.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      job: { select: { title: true, organization: { select: { orgName: true } } } },
    },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">All job applications across the platform</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Applicant</th>
                  <th className="pb-3 font-medium">Job</th>
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0">
                    <td className="py-3">
                      <p className="font-medium">{app.user.name || "—"}</p>
                      <p className="text-xs text-gray-500">{app.user.email}</p>
                    </td>
                    <td className="py-3">{app.job.title}</td>
                    <td className="py-3 text-gray-500">{app.job.organization?.orgName || "—"}</td>
                    <td className="py-3"><Badge className={statusColors[app.status] || ""} variant="secondary">{app.status}</Badge></td>
                    <td className="py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}