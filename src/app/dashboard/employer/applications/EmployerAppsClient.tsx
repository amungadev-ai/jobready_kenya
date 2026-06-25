'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Eye } from 'lucide-react'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  HIRED: 'bg-green-100 text-green-800',
}

export default function EmployerAppsClient({ applications: initialApps }: {
  applications: { id: string; applicantName: string; applicantEmail: string; applicantPhone: string | null; jobTitle: string; jobId: string; status: string; coverLetter: string | null; date: string }[]
}) {
  const [apps, setApps] = useState(initialApps)

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setApps(apps.map((a) => a.id === id ? { ...a, status } : a))
        toast.success('Status updated')
      }
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">{apps.length} application(s) received</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {apps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No applications yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Applicant</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">Job</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{app.applicantName}</p>
                        <p className="text-xs text-gray-500">{app.applicantEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{app.jobTitle}</td>
                      <td className="px-4 py-3">
                        <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v)}>
                          <SelectTrigger className={`w-32 h-8 text-xs ${statusColors[app.status] || ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['PENDING','REVIEWED','SHORTLISTED','REJECTED','HIRED'].map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {new Date(app.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{app.applicantName} - {app.jobTitle}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3 text-sm">
                              <p><span className="font-medium">Email:</span> {app.applicantEmail}</p>
                              <p><span className="font-medium">Phone:</span> {app.applicantPhone || 'N/A'}</p>
                              <p><span className="font-medium">Status:</span> <Badge variant="secondary" className={statusColors[app.status]}>{app.status}</Badge></p>
                              <div>
                                <p className="font-medium mb-1">Cover Letter:</p>
                                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{app.coverLetter || 'No cover letter provided.'}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
