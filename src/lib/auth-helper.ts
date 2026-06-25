import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'
import type { UserRole } from '@prisma/client'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

export async function requireRole(...roles: UserRole[]) {
  const session = await requireAuth()
  const userRole = (session.user as Record<string, unknown>).role as
    | UserRole
    | undefined
  if (!userRole || !roles.includes(userRole)) {
    redirect('/dashboard')
  }
  return session
}