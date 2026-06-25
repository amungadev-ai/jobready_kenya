import * as fs from 'fs'
import * as path from 'path'

const base = '/home/z/my-project/src'

// ============================================================
// 1. DashboardSidebar.tsx (client component)
// ============================================================
const dashboardSidebar = `'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, FileText, Bookmark, User, LogOut, Menu, X, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface DashboardSidebarProps {
  user: { id: string; name?: string | null; email?: string | null; role?: string | null }
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/saved', label: 'Saved Jobs', icon: Bookmark },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (items: typeof navItems) => (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${
              isActive
                ? 'bg-emerald-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }\`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Briefcase className="h-7 w-7 text-emerald-400" />
          <span className="text-xl font-bold text-white">JOBR</span>
        </Link>
      </div>
      {nav(navItems)}
      <div className="border-t border-gray-800 px-3 py-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={async () => {
            await signOut({ callbackUrl: '/login' })
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={\`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto \${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }\`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
`

// ============================================================
// 2. Dashboard layout.tsx
// ============================================================
const dashboardLayout = `import { requireAuth } from '@/lib/auth-helper'
import HideSiteChrome from '@/components/HideSiteChrome'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  return (
    <>
      <HideSiteChrome />
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar user={session.user} />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
`

// ============================================================
// 3. Dashboard page.tsx (overview)
// ============================================================
const dashboardPage = `import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import { FileText, Bookmark, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DashboardOverviewClient from './DashboardOverviewClient'

export default async function DashboardPage() {
  const session = await requireAuth()

  const [applicationCount, savedCount, recentApplications] = await Promise.all([
    db.jobApplication.count({ where: { userId: session.user.id } }),
    db.savedJob.count({ where: { userId: session.user.id } }),
    db.jobApplication.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: { title: true, organization: { select: { orgName: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const data = {
    applicationCount,
    savedCount,
    recentApplications: recentApplications.map(a => ({
      id: a.id,
      jobTitle: a.job.title,
      company: a.job.organization?.orgName || 'Unknown',
      status: a.status,
      date: a.createdAt.toISOString(),
    })),
    userName: session.user.name || 'there',
  }

  return <DashboardOverviewClient data={data} />
}
`

// ============================================================
// 4. DashboardOverviewClient.tsx
// ============================================================
const dashboardOverviewClient = `'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Bookmark, TrendingUp, ArrowRight, Briefcase, User } from 'lucide-react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  HIRED: 'bg-green-100 text-green-800',
}

interface Data {
  applicationCount: number
  savedCount: number
  recentApplications: { id: string; jobTitle: string; company: string; status: string; date: string }[]
  userName: string
}

export default function DashboardOverviewClient({ data }: { data: Data }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data.userName}!</h1>
        <p className="text-gray-500 mt-1">Here is an overview of your job search activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            <FileText className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.applicationCount}</div>
            <p className="text-xs text-gray-500 mt-1">Total applications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saved Jobs</CardTitle>
            <Bookmark className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.savedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Jobs you have saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/jobs">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" /> Browse Jobs
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" /> Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          {data.applicationCount > 0 && (
            <Link href="/dashboard/applications">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {data.recentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p>No applications yet.</p>
              <Link href="/jobs">
                <Button variant="link" className="mt-2 text-emerald-600">Start applying</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{app.jobTitle}</p>
                    <p className="text-xs text-gray-500">{app.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={statusColors[app.status] || ''}>
                      {app.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(app.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
`

// ============================================================
// 5. Applications page + client
// ============================================================
const applicationsPage = `import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import ApplicationsClient from './ApplicationsClient'

export default async function ApplicationsPage() {
  const session = await requireAuth()

  const applications = await db.jobApplication.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: {
          title: true,
          locationCity: true,
          locationCounty: true,
          employmentType: true,
          organization: { select: { orgName: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = applications.map((a) => ({
    id: a.id,
    jobTitle: a.job.title,
    company: a.job.organization?.orgName || 'Unknown',
    location: a.job.locationCity || a.job.locationCounty || 'Remote',
    type: a.job.employmentType || 'N/A',
    status: a.status,
    date: a.createdAt.toISOString(),
    coverLetter: a.coverLetter,
  }))

  return <ApplicationsClient applications={data} />
}
`

const applicationsClient = `'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  HIRED: 'bg-green-100 text-green-800',
}

interface App {
  id: string
  jobTitle: string
  company: string
  location: string
  type: string
  status: string
  date: string
  coverLetter: string | null
}

export default function ApplicationsClient({ applications }: { applications: App[] }) {
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? applications : applications.filter((a) => a.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 mt-1">Track the status of your job applications.</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="ALL">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="REVIEWED">Reviewed</TabsTrigger>
          <TabsTrigger value="SHORTLISTED">Shortlisted</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No applications found</p>
              <p className="text-sm mt-1">Try a different filter or start applying to jobs.</p>
              <Link href="/jobs">
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Job Title</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">Company</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Location</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{app.jobTitle}</p>
                        <p className="text-xs text-gray-500 sm:hidden">{app.company}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{app.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{app.location}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={statusColors[app.status] || ''}>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
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
// 6. Saved Jobs page + client
// ============================================================
const savedPage = `import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import SavedJobsClient from './SavedJobsClient'

export default async function SavedPage() {
  const session = await requireAuth()

  const saved = await db.savedJob.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          locationCity: true,
          locationCounty: true,
          employmentType: true,
          organization: { select: { orgName: true, orgLogoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = saved.map((s) => ({
    id: s.id,
    jobId: s.job.id,
    jobSlug: s.job.slug,
    title: s.job.title,
    company: s.job.organization?.orgName || 'Unknown',
    logoUrl: s.job.organization?.orgLogoUrl,
    location: s.job.locationCity || s.job.locationCounty || 'Remote',
    type: s.job.employmentType || 'N/A',
    savedAt: s.createdAt.toISOString(),
  }))

  return <SavedJobsClient savedJobs={data} />
}
`

const savedJobsClient = `'use client'

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
                    <Link href={\`/jobs/\${job.jobSlug}\`} className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={\`/jobs/\${job.jobSlug}\`}>
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
`

// ============================================================
// 7. Profile page + form
// ============================================================
const profilePage = `import { requireAuth } from '@/lib/auth-helper'
import { db } from '@/lib/db'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await requireAuth()

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      location: true,
      resumeUrl: true,
      linkedinUrl: true,
      websiteUrl: true,
      educationLevel: true,
      experienceYears: true,
      skills: true,
    },
  })

  if (!user) {
    return <div className="text-center py-12 text-gray-500">User not found.</div>
  }

  const profile = {
    ...user,
    skills: user.skills ? JSON.parse(user.skills) as string[] : [],
  }

  return <ProfileForm profile={profile} />
}
`

const profileForm = `'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

const educationLevels = ['NONE', 'HIGH_SCHOOL', 'CERTIFICATE', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'PROFESSIONAL']

interface Profile {
  id: string
  name: string | null
  email: string
  phone: string | null
  bio: string | null
  location: string | null
  resumeUrl: string | null
  linkedinUrl: string | null
  websiteUrl: string | null
  educationLevel: string | null
  experienceYears: number | null
  skills: string[]
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    location: profile.location || '',
    resumeUrl: profile.resumeUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    websiteUrl: profile.websiteUrl || '',
    educationLevel: profile.educationLevel || '',
    experienceYears: profile.experienceYears?.toString() || '',
    skills: (profile.skills || []).join(', '),
  })

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          experienceYears: form.experienceYears ? parseInt(form.experienceYears) : null,
          skills: form.skills,
        }),
      })
      if (res.ok) {
        toast.success('Profile updated successfully')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and job preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>This information will be visible to employers when you apply.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled className="bg-gray-50" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+254 712 345 678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Nairobi, Kenya" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="Tell employers about yourself..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input id="skills" value={form.skills} onChange={(e) => update('skills', e.target.value)} placeholder="JavaScript, React, Node.js, Python" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education &amp; Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select value={form.educationLevel} onValueChange={(v) => update('educationLevel', v)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {educationLevels.map((l) => (
                    <SelectItem key={l} value={l}>{l.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" min="0" max="50" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} placeholder="5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input id="resumeUrl" value={form.resumeUrl} onChange={(e) => update('resumeUrl', e.target.value)} placeholder="https://drive.google.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" value={form.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} placeholder="https://yoursite.com" />
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
// 8. API Routes
// ============================================================
const profileApi = `import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, phone: true, bio: true,
        location: true, resumeUrl: true, linkedinUrl: true, websiteUrl: true,
        educationLevel: true, experienceYears: true, skills: true,
        role: true, image: true, createdAt: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ ...user, skills: user.skills ? JSON.parse(user.skills) : [] })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, bio, location, resumeUrl, linkedinUrl, websiteUrl, educationLevel, experienceYears, skills } = body

    const skillsStr = Array.isArray(skills) ? JSON.stringify(skills) : (typeof skills === 'string' ? skills : null)

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        location: location || undefined,
        resumeUrl: resumeUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        websiteUrl: websiteUrl || undefined,
        educationLevel: educationLevel || undefined,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        skills: skillsStr || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

const savedJobsApi = `import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const saved = await db.savedJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: {
            id: true, title: true, slug: true, locationCity: true, locationCounty: true,
            employmentType: true,
            organization: { select: { orgName: true, orgLogoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('SavedJobs GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await req.json()
    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    }

    const saved = await db.savedJob.create({
      data: { userId: session.user.id, jobId },
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 })
    }
    console.error('SavedJobs POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await req.json()
    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    }

    await db.savedJob.deleteMany({
      where: { userId: session.user.id, jobId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SavedJobs DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

const applicationsApi = `import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await db.jobApplication.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: {
            title: true, slug: true, locationCity: true, locationCounty: true,
            employmentType: true, status: true,
            organization: { select: { orgName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Applications GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
`

// ============================================================
// Write all files
// ============================================================
const files: Record<string, string> = {
  'app/dashboard/DashboardSidebar.tsx': dashboardSidebar,
  'app/dashboard/layout.tsx': dashboardLayout,
  'app/dashboard/DashboardOverviewClient.tsx': dashboardOverviewClient,
  'app/dashboard/page.tsx': dashboardPage,
  'app/dashboard/applications/ApplicationsClient.tsx': applicationsClient,
  'app/dashboard/applications/page.tsx': applicationsPage,
  'app/dashboard/saved/SavedJobsClient.tsx': savedJobsClient,
  'app/dashboard/saved/page.tsx': savedPage,
  'app/dashboard/profile/ProfileForm.tsx': profileForm,
  'app/dashboard/profile/page.tsx': profilePage,
  'app/api/dashboard/profile/route.ts': profileApi,
  'app/api/dashboard/saved-jobs/route.ts': savedJobsApi,
  'app/api/dashboard/applications/route.ts': applicationsApi,
}

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(base, filePath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`Created: ${filePath}`)
}

console.log('\\nAll jobseeker dashboard files created!')