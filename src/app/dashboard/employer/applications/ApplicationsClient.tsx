"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  HIRED: "bg-green-100 text-green-700",
}

interface App {
  id: string
  status: string
  createdAt: string
  user: { name: string | null; email: string }
  job: { title: string }
}

export function EmployerApplicationsClient({ applications: initial }: { applications: App[] }) {
  const [applications, setApplications] = useState(initial)

  async function updateStatus(appId: string, status: string) {
    await fetch("/api/employer/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: appId, status }),
    })
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)))
  }

  if (applications.length === 0) {
    return <div className="text-center py-12 text-gray-400">No applications received yet.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 font-medium">Applicant</th>
            <th className="pb-3 font-medium">Job</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Actions</th>
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
              <td className="py-3">
                <Badge className={statusColors[app.status] || ""} variant="secondary">{app.status}</Badge>
              </td>
              <td className="py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  {app.status !== "SHORTLISTED" && (
                    <Button variant="ghost" size="sm" onClick={() => updateStatus(app.id, "SHORTLISTED")} className="text-xs text-emerald-600">Shortlist</Button>
                  )}
                  {app.status !== "REJECTED" && (
                    <Button variant="ghost" size="sm" onClick={() => updateStatus(app.id, "REJECTED")} className="text-xs text-red-500">Reject</Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}