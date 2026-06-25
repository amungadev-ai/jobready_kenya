'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, Eye, Pause, Play, Trash2, FileText } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800',
}

export default function EmployerJobsClient({ jobs: initialJobs }: {
  jobs: { id: string; title: string; status: string; employmentType: string | null; datePosted: string; applicationCount: number; company: string }[]
}) {
  const [jobs, setJobs] = useState(initialJobs)
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter)

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      const res = await fetch(`/api/employer/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setJobs(jobs.map((j) => j.id === id ? { ...j, status: newStatus } : j))
        toast.success(`Job ${newStatus === 'ACTIVE' ? 'activated' : 'paused'}`)
      }
    } catch { toast.error('Failed to update') }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      const res = await fetch(`/api/employer/jobs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id))
        toast.success('Job deleted')
      }
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-500 mt-1">{jobs.length} job(s) posted</p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button className="bg-emerald-600 hover:bg-emerald-700">+ Post New Job</Button>
        </Link>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="ALL">All ({jobs.length})</TabsTrigger>
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="PAUSED">Paused</TabsTrigger>
          <TabsTrigger value="DRAFT">Draft</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No jobs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Title</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Apps</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Posted</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((job) => (
                    <tr key={job.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500 sm:hidden">{job.status}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="secondary" className={statusColors[job.status] || ''}>{job.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{job.applicationCount}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {new Date(job.datePosted).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/dashboard/employer/applications?jobId=${job.id}`}>
                            <Button variant="ghost" size="sm" title="View Applications"><FileText className="h-4 w-4" /></Button>
                          </Link>
                          <Button variant="ghost" size="sm" title={job.status === 'ACTIVE' ? 'Pause' : 'Activate'} onClick={() => toggleStatus(job.id, job.status)}>
                            {job.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500" title="Delete" onClick={() => deleteJob(job.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
