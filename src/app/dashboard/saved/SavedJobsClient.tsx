'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark, MapPin, Briefcase, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface SavedJob {
  id: string
  jobId: string
  jobSlug: string
  title: string
  company: string
  logoUrl: string | null
  location: string
  type: string
  savedAt: string
}

export default function SavedJobsClient({ savedJobs: initialJobs }: { savedJobs: SavedJob[] }) {
  const [jobs, setJobs] = useState(initialJobs)

  const removeJob = async (savedId: string, jobId: string) => {
    try {
      const res = await fetch('/api/dashboard/saved-jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== savedId))
        toast.success('Job removed from saved list')
      }
    } catch {
      toast.error('Failed to remove job')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-500 mt-1">Jobs you have bookmarked for later.</p>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <Bookmark className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No saved jobs yet</p>
            <p className="text-sm mt-1">Save jobs you are interested in to review them later.</p>
            <Link href="/jobs">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.jobSlug}`} className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/jobs/${job.jobSlug}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeJob(job.id, job.jobId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Saved on {new Date(job.savedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
