import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"

export async function GET() {
  try {
    await requireRole("ADMIN")
    const applications = await db.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        job: { select: { title: true, organization: { select: { orgName: true } } } },
      },
      take: 200,
    })
    return NextResponse.json({ applications })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
