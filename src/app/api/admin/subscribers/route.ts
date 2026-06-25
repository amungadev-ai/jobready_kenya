import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"

export async function GET() {
  try {
    await requireRole("ADMIN")
    const subscribers = await db.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ subscribers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}