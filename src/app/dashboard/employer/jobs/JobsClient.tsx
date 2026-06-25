"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Pause, Play } from "lucide-react"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  DRAFT: "bg-gray-100 text-gray-600",
  PAUSED: "bg-yellow-100 text-yellow-700",
  EXPIRED: "bg-red-100 text-red-700",
}

interface Job {
  id: string
  title: string
  status: string
  datePosted: string
  _count: { applications: number }
}

export function JobsClient({ jobs: initial }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState(initial)

  async function toggleStatus(jobId: string, newStatus: string) {
    await fetch(`/api/employer/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)))
  }

  async function deleteJob(jobId: string) {
    if (!confirm("Delete this job? This cannot be undone.")) return
    await fetch(`/api/employer/jobs/${jobId}`, { method: "DELETE" })
    setJobs((prev) => prev.filter((j) => j.id !== jobId))
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No jobs posted yet.</p>
        <p className="text-gray-400 text-sm mt-1">
          <a href="/dashboard/employer/post-job" className="text-emerald-600 hover:underline">Post your first job</a>
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 font-medium">Title</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Applications</th>
            <th className="pb-3 font-medium">Posted</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b last:border-0">
              <td className="py-3 font-medium">{job.title}</td>
              <td className="py-3">
                <Badge className={statusColors[job.status] || ""} variant="secondary">{job.status}</Badge>
              </td>
              <td className="py-3">{job._count.applications}</td>
              <td className="py-3 text-gray-500">{new Date(job.datePosted).toLocaleDateString()}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  {job.status === "ACTIVE" ? (
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(job.id, "PAUSED")} title="Pause">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(job.id, "ACTIVE")} title="Activate">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)} className="text-red-400 hover:text-red-600" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}