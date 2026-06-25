import { requireRole } from '@/lib/auth-helper'
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
