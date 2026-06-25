import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN")
    const { id } = await params
    const body = await req.json()

    const updated = await db.organization.update({
      where: { id },
      data: { ...(body.isVerified !== undefined && { isVerified: body.isVerified }) },
    })

    return NextResponse.json({ organization: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}