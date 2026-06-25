import { requireRole } from "@/lib/auth-helper"
import { AdminSidebar } from "./AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN")

  return (
    <>
      <style>{`.site-header, .site-footer { display: none !important; } .site-wrapper { min-height: 100vh; }`}</style>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}