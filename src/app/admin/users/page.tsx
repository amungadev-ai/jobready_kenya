import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersClient } from "./UsersClient"

export default async function AdminUsersPage() {
  await requireRole("ADMIN")

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">Manage registered users</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersClient users={JSON.parse(JSON.stringify(users))} />
        </CardContent>
      </Card>
    </div>
  )
}