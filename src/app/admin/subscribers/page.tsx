import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminSubscribersPage() {
  await requireRole("ADMIN")

  const subscribers = await db.newsletterSubscription.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="text-gray-500 mt-1">Manage email subscribers</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Subscribers ({subscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Frequency</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{sub.email}</td>
                    <td className="py-3 text-gray-500">{sub.frequency}</td>
                    <td className="py-3 text-gray-500">{sub.source}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${sub.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}