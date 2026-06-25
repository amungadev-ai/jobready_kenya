'use client'

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
const kenyanCounties = ['Nairobi','Mombasa','Kisumu','Nakuru','Uasin Gishu','Kiambu','Machakos','Meru','Kakamega','Embu','Nyeri','Kilifi','Kitui','Garissa','Murang\'a','Bungoma','Makueni','Kisii','Nyamira','Homa Bay','Migori','Turkana','West Pokot','Baringo','Laikipia','Nandi','Trans Nzoia','Kericho','Bomet','Kajiado','Kwale','Tana River','Lamu','Taita Taveta','Marsabit','Isiolo','Samburu','Mandera','Wajir','Garissa','Siaya','Busia','Vihiga','Nyandarua','Elgeyo Marakwet','Narok','Kweneng','Tharaka Nithi','Kirinyaga']

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
