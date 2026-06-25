import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessagesClient } from "./MessagesClient"

export default async function AdminMessagesPage() {
  await requireRole("ADMIN")

  const messages = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Contact form submissions</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MessagesClient messages={JSON.parse(JSON.stringify(messages))} />
        </CardContent>
      </Card>
    </div>
  )
}