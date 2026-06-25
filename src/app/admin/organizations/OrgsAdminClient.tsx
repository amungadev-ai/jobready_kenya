"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"

interface Org {
  id: string
  orgName: string
  orgIndustry: string
  orgType: string
  isVerified: boolean
  _count: { jobs: number }
}

export function OrgsAdminClient({ orgs: initial }: { orgs: Org[] }) {
  const [orgs, setOrgs] = useState(initial)

  async function toggleVerified(orgId: string, isVerified: boolean) {
    await fetch(`/api/admin/organizations/${orgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: !isVerified }),
    })
    setOrgs((prev) => prev.map((o) => (o.id === orgId ? { ...o, isVerified: !isVerified } : o)))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium">Industry</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium">Verified</th>
            <th className="pb-3 font-medium">Jobs</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orgs.map((org) => (
            <tr key={org.id} className="border-b last:border-0">
              <td className="py-3 font-medium">{org.orgName}</td>
              <td className="py-3 text-gray-500">{org.orgIndustry.replace(/_/g, " ")}</td>
              <td className="py-3 text-gray-500">{org.orgType.replace(/_/g, " ")}</td>
              <td className="py-3">
                <span className={`text-xs px-2 py-1 rounded-full ${org.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                  {org.isVerified ? "Verified" : "Unverified"}
                </span>
              </td>
              <td className="py-3">{org._count.jobs}</td>
              <td className="py-3">
                <Button variant="ghost" size="icon" onClick={() => toggleVerified(org.id, org.isVerified)} title="Toggle verified">
                  {org.isVerified ? <XCircle className="h-4 w-4 text-red-400" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}