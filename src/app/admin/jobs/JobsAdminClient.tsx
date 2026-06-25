"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Star } from "lucide-react"

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
  featured: boolean
  datePosted: string
  organization: { orgName: string } | null
}

export function JobsAdminClient({ jobs: initial }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState(initial)

  async function toggleFeatured(jobId: string, featured: boolean) {
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    })
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, featured: !featured } : j)))
  }

  async function deleteJob(jobId: string) {
    if (!confirm("Delete this job?")) return
    await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" })
    setJobs((prev) => prev.filter((j) => j.id !== jobId))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 font-medium">Title</th>
            <th className="pb-3 font-medium">Organization</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Featured</th>
            <th className="pb-3 font-medium">Posted</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b last:border-0">
              <td className="py-3 font-medium">{job.title}</td>
              <td className="py-3 text-gray-500">{job.organization?.orgName || "—"}</td>
              <td className="py-3"><Badge className={statusColors[job.status] || ""} variant="secondary">{job.status}</Badge></td>
              <td className="py-3">
                <button onClick={() => toggleFeatured(job.id, job.featured)}>
                  <Star className={`h-4 w-4 ${job.featured ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                </button>
              </td>
              <td className="py-3 text-gray-500">{new Date(job.datePosted).toLocaleDateString()}</td>
              <td className="py-3">
                <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}