import { requireRole } from '@/lib/auth-helper'
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
