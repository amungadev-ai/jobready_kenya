"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Mail } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export function MessagesClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function toggleRead(msgId: string, isRead: boolean) {
    await fetch(`/api/admin/messages/${msgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    })
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, isRead: !isRead } : m)))
  }

  async function deleteMessage(msgId: string) {
    if (!confirm("Delete this message?")) return
    await fetch(`/api/admin/messages/${msgId}`, { method: "DELETE" })
    setMessages((prev) => prev.filter((m) => m.id !== msgId))
  }

  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No messages yet.</div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`border rounded-lg p-4 ${!msg.isRead ? "bg-blue-50/50 border-blue-200" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{msg.name}</p>
                  <span className="text-xs text-gray-500">{msg.email}</span>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-sm font-medium text-gray-700 mt-1">{msg.subject}</p>
                {expanded === msg.id && (
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{msg.message}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setExpanded(expanded === msg.id ? null : msg.id)} title="View">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleRead(msg.id, msg.isRead)} title={msg.isRead ? "Mark unread" : "Mark read"}>
                  <Mail className={`h-4 w-4 ${!msg.isRead ? "text-blue-500" : "text-gray-400"}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMessage(msg.id)} className="text-red-400 hover:text-red-600" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}