import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, FileText, Building2, Mail, MessageSquare } from "lucide-react"

export default async function AdminPage() {
  await requireRole("ADMIN")

  const [userCount, jobCount, appCount, orgCount, subCount, unreadMsgs, recentUsers, recentJobs] = await Promise.all([
    db.user.count(),
    db.job.count(),
    db.jobApplication.count(),
    db.organization.count(),
    db.newsletterSubscription.count(),
    db.contactSubmission.count({ where: { isRead: false } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 10, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    db.job.findMany({ orderBy: { datePosted: "desc" }, take: 10, select: { id: true, title: true, status: true, datePosted: true, organization: { select: { orgName: true } } } }),
  ])

  const stats = [
    { label: "Users", value: userCount, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Jobs", value: jobCount, icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
    { label: "Applications", value: appCount, icon: FileText, color: "text-amber-600 bg-amber-50" },
    { label: "Organizations", value: orgCount, icon: Building2, color: "text-purple-600 bg-purple-50" },
    { label: "Subscribers", value: subCount, icon: Mail, color: "text-pink-600 bg-pink-50" },
    { label: "Unread Messages", value: unreadMsgs, icon: MessageSquare, color: "text-red-600 bg-red-50" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-gray-500"><th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Email</th><th className="pb-3 font-medium">Role</th><th className="pb-3 font-medium">Joined</th></tr></thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{u.name || "—"}</td>
                      <td className="py-2 text-gray-500 text-xs">{u.email}</td>
                      <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-red-100 text-red-700" : u.role === "EMPLOYER" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{u.role}</span></td>
                      <td className="py-2 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-gray-500"><th className="pb-3 font-medium">Title</th><th className="pb-3 font-medium">Org</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Posted</th></tr></thead>
                <tbody>
                  {recentJobs.map((j) => (
                    <tr key={j.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{j.title}</td>
                      <td className="py-2 text-gray-500 text-xs">{j.organization?.orgName || "—"}</td>
                      <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${j.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{j.status}</span></td>
                      <td className="py-2 text-gray-500 text-xs">{new Date(j.datePosted).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}