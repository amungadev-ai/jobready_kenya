"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Shield, ShieldOff } from "lucide-react"

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  EMPLOYER: "bg-blue-100 text-blue-700",
  JOBSEEKER: "bg-emerald-100 text-emerald-700",
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export function UsersClient({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial)

  async function toggleActive(userId: string, isActive: boolean) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !isActive } : u)))
  }

  async function changeRole(userId: string, newRole: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
  }

  async function deleteUser(userId: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium">Email</th>
            <th className="pb-3 font-medium">Role</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Joined</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="py-3 font-medium">{user.name || "—"}</td>
              <td className="py-3 text-gray-500">{user.email}</td>
              <td className="py-3">
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${roleColors[user.role]}`}
                >
                  <option value="JOBSEEKER">JOBSEEKER</option>
                  <option value="EMPLOYER">EMPLOYER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="py-3">
                <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleActive(user.id, user.isActive)} title={user.isActive ? "Deactivate" : "Activate"}>
                    {user.isActive ? <ShieldOff className="h-4 w-4 text-red-400" /> : <Shield className="h-4 w-4 text-emerald-500" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} className="text-red-400 hover:text-red-600" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}