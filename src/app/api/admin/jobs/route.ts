import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"

export async function GET() {
  try {
    await requireRole("ADMIN")
    const jobs = await db.job.findMany({
      orderBy: { datePosted: "desc" },
      select: {
        id: true, title: true, status: true, featured: true, datePosted: true,
        organization: { select: { orgName: true } },
      },
      take: 200,
    })
    return NextResponse.json({ jobs })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}