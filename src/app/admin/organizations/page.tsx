import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrgsAdminClient } from "./OrgsAdminClient"

export default async function AdminOrganizationsPage() {
  await requireRole("ADMIN")

  const orgs = await db.organization.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, orgName: true, orgIndustry: true, orgType: true, isVerified: true,
      _count: { select: { jobs: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
        <p className="text-gray-500 mt-1">Manage organizations and verification</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Organizations ({orgs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgsAdminClient orgs={JSON.parse(JSON.stringify(orgs))} />
        </CardContent>
      </Card>
    </div>
  )
}