import * as fs from 'fs'
import * as path from 'path'

const base = '/home/z/my-project/src'

// ============================================================
// Employer Sidebar (client)
// ============================================================
const employerSidebar = `'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, PlusCircle, Briefcase, FileText, Building2, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface Props {
  user: { id: string; name?: string | null; email?: string | null; role?: string | null }
}

const navItems = [
  { href: '/dashboard/employer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/employer/post-job', label: 'Post Job', icon: PlusCircle },
  { href: '/dashboard/employer/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/dashboard/employer/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/employer/company', label: 'Company', icon: Building2 },
]

export default function EmployerSidebar({ user }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={\`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto \${mobileOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-5 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <Briefcase className="h-7 w-7 text-emerald-400" />
              <span className="text-xl font-bold text-white">JOBR</span>
            </Link>
            <p className="text-xs text-emerald-400 mt-1">Employer Portal</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/employer' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${isActive ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}\`}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-800 px-3 py-4">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-white truncate">{user.name || 'Employer'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={async () => { await signOut({ callbackUrl: '/login' }) }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
`

// ============================================================
// Employer layout
// ============================================================
const employerLayout = `import { requireRole } from '@/lib/auth-helper'
import HideSiteChrome from '@/components/HideSiteChrome'
import EmployerSidebar from './EmployerSidebar'

export default async function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  return (
    <>
      <HideSiteChrome />
      <div className="flex h-screen bg-gray-50">
        <EmployerSidebar user={session.user} />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  )
}
`

// ============================================================
// Employer overview page
// ============================================================
const employerPage = `import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import EmployerOverviewClient from './EmployerOverviewClient'

export default async function EmployerDashboardPage() {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  const [totalJobs, activeJobs, totalApps, recentApps] = await Promise.all([
    db.job.count({ where: { postedById: session.user.id, deletedAt: null } }),
    db.job.count({ where: { postedById: session.user.id, status: 'ACTIVE', deletedAt: null } }),
    db.jobApplication.count({
      where: { job: { postedById: session.user.id } },
    }),
    db.jobApplication.findMany({
      where: { job: { postedById: session.user.id } },
      include: {
        user: { select: { name: true, email: true } },
        job: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const data = {
    totalJobs, activeJobs, totalApps,
    recentApplications: recentApps.map((a) => ({
      id: a.id,
      applicantName: a.user.name || 'Unknown',
      applicantEmail: a.user.email,
      jobTitle: a.job.title,
      status: a.status,
      date: a.createdAt.toISOString(),
    })),
  }

  return <EmployerOverviewClient data={data} />
}
`

const employerOverviewClient = `'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, FileText, TrendingUp, PlusCircle, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  HIRED: 'bg-green-100 text-green-800',
}

export default function EmployerOverviewClient({ data }: {
  data: {
    totalJobs: number; activeJobs: number; totalApps: number
    recentApplications: { id: string; applicantName: string; applicantEmail: string; jobTitle: string; status: string; date: string }[]
  }
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your job postings and review applications.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Jobs</CardTitle>
            <Briefcase className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalJobs}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Jobs</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-emerald-600">{data.activeJobs}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            <FileText className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalApps}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Quick Action</CardTitle>
            <PlusCircle className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/employer/post-job">
              <Button className="bg-emerald-600 hover:bg-emerald-700 w-full">Post New Job</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          {data.totalApps > 0 && (
            <Link href="/dashboard/employer/applications">
              <Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {data.recentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p>No applications received yet.</p>
              <p className="text-sm mt-1">Post a job to start receiving applications.</p>
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
                  </tr>
                </thead>
                <tbody>
                  {data.recentApplications.map((app) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{app.applicantName}</p>
                        <p className="text-xs text-gray-500">{app.applicantEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{app.jobTitle}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={statusColors[app.status] || ''}>{app.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {new Date(app.date).toLocaleDateString()}
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
`

// ============================================================
// Post Job page
// ============================================================
const postJobPage = `import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import PostJobForm from './PostJobForm'

export default async function PostJobPage() {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  const categories = await db.jobCategory.findMany({
    orderBy: { label: 'asc' },
    include: { subcategories: { orderBy: { label: 'asc' } } },
  })

  const data = {
    categories: categories.map((c) => ({
      id: c.id,
      label: c.label,
      subcategories: c.subcategories.map((s) => ({ id: s.id, label: s.label })),
    })),
    userId: session.user.id,
  }

  return <PostJobForm data={data} />
}
`

const postJobForm = `'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'APPRENTICESHIP', 'TEMPORARY', 'CASUAL', 'VOLUNTEER']
const experienceLevels = ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
const educationLevels = ['NONE', 'HIGH_SCHOOL', 'CERTIFICATE', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'PROFESSIONAL']
const salaryDisclosures = ['NOT_DISCLOSED', 'NEGOTIABLE', 'COMPETITIVE', 'SHOW_RANGE']
const kenyanCounties = ['Nairobi','Mombasa','Kisumu','Nakuru','Uasin Gishu','Kiambu','Machakos','Meru','Kakamega','Embu','Nyeri','Kilifi','Kitui','Garissa','Murang\\'a','Bungoma','Makueni','Kisii','Nyamira','Homa Bay','Migori','Turkana','West Pokot','Baringo','Laikipia','Nandi','Trans Nzoia','Kericho','Bomet','Kajiado','Kwale','Tana River','Lamu','Taita Taveta','Marsabit','Isiolo','Samburu','Mandera','Wajir','Garissa','Siaya','Busia','Vihiga','Nyandarua','Elgeyo Marakwet','Narok','Kweneng','Tharaka Nithi','Kirinyaga']

export default function PostJobForm({ data }: { data: { categories: { id: string; label: string; subcategories: { id: string; label: string }[] }[]; userId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', subcategoryId: '',
    employmentType: '', experienceLevel: '', educationLevel: '',
    locationCity: '', locationCounty: '', isRemote: false,
    salaryMin: '', salaryMax: '', salaryDisclosure: 'NOT_DISCLOSED',
    deadline: '', howToApply: '', applyEmail: '', applicationUrl: '',
  })

  const update = (key: string, value: string | boolean) => setForm((p) => ({ ...p, [key]: value }))

  const selectedCat = data.categories.find((c) => c.id === form.categoryId)

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.subcategoryId) {
      toast.error('Please fill in title, description, and category')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
        }),
      })
      if (res.ok) {
        toast.success('Job posted successfully!')
        router.push('/dashboard/employer/jobs')
      } else {
        const d = await res.json()
        toast.error(d.error || 'Failed to post job')
      }
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to create a job listing.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Senior Software Engineer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Job Description *</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the role, responsibilities, and requirements..." rows={8} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.categoryId} onValueChange={(v) => update('categoryId', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {data.categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory *</Label>
              <Select value={form.subcategoryId} onValueChange={(v) => update('subcategoryId', v)}>
                <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                <SelectContent>
                  {(selectedCat?.subcategories || []).map((s) => (<SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Job Type & Level</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Employment Type</Label>
            <Select value={form.employmentType} onValueChange={(v) => update('employmentType', v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{employmentTypes.map((t) => (<SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <Select value={form.experienceLevel} onValueChange={(v) => update('experienceLevel', v)}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>{experienceLevels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Education Level</Label>
            <Select value={form.educationLevel} onValueChange={(v) => update('educationLevel', v)}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>{educationLevels.map((l) => (<SelectItem key={l} value={l}>{l.replace(/_/g, ' ')}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Location</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.locationCity} onChange={(e) => update('locationCity', e.target.value)} placeholder="e.g. Nairobi" />
          </div>
          <div className="space-y-2">
            <Label>County</Label>
            <Select value={form.locationCounty} onValueChange={(v) => update('locationCounty', v)}>
              <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
              <SelectContent>{kenyanCounties.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isRemote} onCheckedChange={(v) => update('isRemote', v)} />
            <Label>Remote position</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Compensation</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Salary Disclosure</Label>
            <Select value={form.salaryDisclosure} onValueChange={(v) => update('salaryDisclosure', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{salaryDisclosures.map((s) => (<SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salMin">Min Salary (KES)</Label>
            <Input id="salMin" type="number" value={form.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salMax">Max Salary (KES)</Label>
            <Input id="salMax" type="number" value={form.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>How to Apply</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input id="deadline" type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applyEmail">Application Email</Label>
              <Input id="applyEmail" type="email" value={form.applyEmail} onChange={(e) => update('applyEmail', e.target.value)} placeholder="hr@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applyUrl">Application URL</Label>
              <Input id="applyUrl" value={form.applicationUrl} onChange={(e) => update('applicationUrl', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="howTo">How to Apply</Label>
            <Textarea id="howTo" value={form.howToApply} onChange={(e) => update('howToApply', e.target.value)} placeholder="Instructions for applicants..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Post Job
        </Button>
      </div>
    </div>
  )
}
`

// ============================================================
// Employer Jobs page
// ============================================================
const employerJobsPage = `import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import EmployerJobsClient from './EmployerJobsClient'

export default async function EmployerJobsPage() {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  const jobs = await db.job.findMany({
    where: { postedById: session.user.id, deletedAt: null },
    include: {
      _count: { select: { applications: true } },
      organization: { select: { orgName: true } },
      category: { select: { label: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    employmentType: j.employmentType,
    datePosted: j.datePosted.toISOString(),
    applicationCount: j._count.applications,
    company: j.organization?.orgName || session.user.name || 'My Company',
  }))

  return <EmployerJobsClient jobs={data} />
}
`

const employerJobsClient = `'use client'

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
      const res = await fetch(\`/api/employer/jobs/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setJobs(jobs.map((j) => j.id === id ? { ...j, status: newStatus } : j))
        toast.success(\`Job \${newStatus === 'ACTIVE' ? 'activated' : 'paused'}\`)
      }
    } catch { toast.error('Failed to update') }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      const res = await fetch(\`/api/employer/jobs/\${id}\`, { method: 'DELETE' })
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
                          <Link href={\`/dashboard/employer/applications?jobId=\${job.id}\`}>
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
`

// ============================================================
// Employer Applications page
// ============================================================
const employerAppsPage = `import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import EmployerAppsClient from './EmployerAppsClient'

export default async function EmployerAppsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>
}) {
  const session = await requireRole('EMPLOYER', 'ADMIN')
  const params = await searchParams

  const where: Record<string, unknown> = {
    job: { postedById: session.user.id },
  }
  if (params.jobId) {
    where.jobId = params.jobId
  }

  const applications = await db.jobApplication.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      job: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = applications.map((a) => ({
    id: a.id,
    applicantName: a.user.name || 'Unknown',
    applicantEmail: a.user.email,
    applicantPhone: a.user.phone,
    jobTitle: a.job.title,
    jobId: a.job.id,
    status: a.status,
    coverLetter: a.coverLetter,
    date: a.createdAt.toISOString(),
  }))

  return <EmployerAppsClient applications={data} />
}
`

const employerAppsClient = `'use client'

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
      const res = await fetch(\`/api/admin/applications/\${id}\`, {
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
                          <SelectTrigger className={\`w-32 h-8 text-xs \${statusColors[app.status] || ''}\`}>
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
`

// ============================================================
// Employer Company page
// ============================================================
const companyPage = `import { requireRole } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import CompanyProfileForm from './CompanyProfileForm'

export default async function CompanyPage() {
  const session = await requireRole('EMPLOYER', 'ADMIN')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      companyName: true, companyLogoUrl: true, companyDescription: true,
      companyIndustry: true, companySize: true, companyWebsite: true, companyLocation: true,
    },
  })

  return <CompanyProfileForm profile={user || {}} />
}
`

const companyProfileForm = `'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

const sizes = ['1-10', '11-50', '51-200', '201-1000', '1000+']

export default function CompanyProfileForm({ profile }: { profile: Record<string, unknown> }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    companyName: (profile.companyName as string) || '',
    companyLogoUrl: (profile.companyLogoUrl as string) || '',
    companyDescription: (profile.companyDescription as string) || '',
    companyIndustry: (profile.companyIndustry as string) || '',
    companySize: (profile.companySize as string) || '',
    companyWebsite: (profile.companyWebsite as string) || '',
    companyLocation: (profile.companyLocation as string) || '',
  })

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/employer/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) toast.success('Company profile updated')
      else { const d = await res.json(); toast.error(d.error || 'Failed to update') }
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-gray-500 mt-1">Manage your company information visible to job seekers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>This information appears on your job listings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cname">Company Name</Label>
              <Input id="cname" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Ltd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="csize">Company Size</Label>
              <Select value={form.companySize} onValueChange={(v) => update('companySize', v)}>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>{sizes.map((s) => (<SelectItem key={s} value={s}>{s} employees</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cindustry">Industry</Label>
              <Input id="cindustry" value={form.companyIndustry} onChange={(e) => update('companyIndustry', e.target.value)} placeholder="e.g. Information Technology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clocation">Location</Label>
              <Input id="clocation" value={form.companyLocation} onChange={(e) => update('companyLocation', e.target.value)} placeholder="e.g. Nairobi, Kenya" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cwebsite">Website</Label>
            <Input id="cwebsite" value={form.companyWebsite} onChange={(e) => update('companyWebsite', e.target.value)} placeholder="https://company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cdesc">Company Description</Label>
            <Textarea id="cdesc" value={form.companyDescription} onChange={(e) => update('companyDescription', e.target.value)} placeholder="Tell job seekers about your company..." rows={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clogo">Logo URL</Label>
            <Input id="clogo" value={form.companyLogoUrl} onChange={(e) => update('companyLogoUrl', e.target.value)} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Profile
        </Button>
      </div>
    </div>
  )
}
`

// ============================================================
// API Routes
// ============================================================
const employerJobsApi = `import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const jobs = await db.job.findMany({
      where: { postedById: session.user.id, deletedAt: null },
      include: { _count: { select: { applications: true } }, category: { select: { label: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Employer jobs GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, categoryId, subcategoryId, employmentType, experienceLevel, educationLevel,
      locationCity, locationCounty, isRemote, salaryMin, salaryMax, salaryDisclosure, deadline, howToApply, applyEmail, applicationUrl } = body

    if (!title || !description || !subcategoryId) {
      return NextResponse.json({ error: 'Title, description, and subcategory are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36)

    const job = await db.job.create({
      data: {
        title, slug, description, subcategoryId,
        categoryId: categoryId || null,
        postedById: session.user.id,
        employmentType: employmentType || null,
        experienceLevel: experienceLevel || null,
        educationLevel: educationLevel || null,
        locationCity: locationCity || null,
        locationCounty: locationCounty || null,
        isRemote: isRemote || false,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        salaryDisclosure: salaryDisclosure || 'NOT_DISCLOSED',
        deadline: deadline ? new Date(deadline) : null,
        howToApply: howToApply || null,
        applyEmail: applyEmail || null,
        applicationUrl: applicationUrl || null,
        status: 'ACTIVE',
        searchText: \`\${title} \${description} \${locationCity || ''} \${locationCounty || ''}\`,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Employer jobs POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

const employerJobByIdApi = `import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const job = await db.job.findFirst({
      where: { id, postedById: session.user.id, deletedAt: null },
      include: { _count: { select: { applications: true } } },
    })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(job)
  } catch (error) {
    console.error('Employer job GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await req.json()

    const job = await db.job.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(job)
  } catch (error) {
    console.error('Employer job PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    await db.job.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Employer job DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

const employerAppsApi = `import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const apps = await db.jobApplication.findMany({
      where: { job: { postedById: session.user.id } },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(apps)
  } catch (error) {
    console.error('Employer apps GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

const employerCompanyApi = `import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        companyName: true, companyLogoUrl: true, companyDescription: true,
        companyIndustry: true, companySize: true, companyWebsite: true, companyLocation: true,
      },
    })
    return NextResponse.json(user || {})
  } catch (error) {
    console.error('Company GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    await db.user.update({
      where: { id: session.user.id },
      data: {
        companyName: body.companyName || undefined,
        companyLogoUrl: body.companyLogoUrl || undefined,
        companyDescription: body.companyDescription || undefined,
        companyIndustry: body.companyIndustry || undefined,
        companySize: body.companySize || undefined,
        companyWebsite: body.companyWebsite || undefined,
        companyLocation: body.companyLocation || undefined,
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Company PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

// ============================================================
// Write all files
// ============================================================
const files: Record<string, string> = {
  'app/dashboard/employer/EmployerSidebar.tsx': employerSidebar,
  'app/dashboard/employer/layout.tsx': employerLayout,
  'app/dashboard/employer/page.tsx': employerPage,
  'app/dashboard/employer/EmployerOverviewClient.tsx': employerOverviewClient,
  'app/dashboard/employer/post-job/page.tsx': postJobPage,
  'app/dashboard/employer/post-job/PostJobForm.tsx': postJobForm,
  'app/dashboard/employer/jobs/page.tsx': employerJobsPage,
  'app/dashboard/employer/jobs/EmployerJobsClient.tsx': employerJobsClient,
  'app/dashboard/employer/applications/page.tsx': employerAppsPage,
  'app/dashboard/employer/applications/EmployerAppsClient.tsx': employerAppsClient,
  'app/dashboard/employer/company/page.tsx': companyPage,
  'app/dashboard/employer/company/CompanyProfileForm.tsx': companyProfileForm,
  'app/api/employer/jobs/route.ts': employerJobsApi,
  'app/api/employer/jobs/[id]/route.ts': employerJobByIdApi,
  'app/api/employer/applications/route.ts': employerAppsApi,
  'app/api/employer/company/route.ts': employerCompanyApi,
}

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(base, filePath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`Created: ${filePath}`)
}

console.log('\\nAll employer dashboard files created!')