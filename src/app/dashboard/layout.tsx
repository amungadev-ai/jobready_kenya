import { requireAuth } from '@/lib/auth-helper'
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
