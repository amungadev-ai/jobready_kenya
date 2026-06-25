import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"

export async function GET() {
  try {
    await requireRole("ADMIN")
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    })
    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}