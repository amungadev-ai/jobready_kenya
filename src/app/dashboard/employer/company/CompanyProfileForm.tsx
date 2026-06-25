'use client'

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
