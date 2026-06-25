import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-helper"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN")
    const { id } = await params
    const body = await req.json()

    const updated = await db.job.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.featured !== undefined && { featured: body.featured }),
      },
    })

    return NextResponse.json({ job: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN")
    const { id } = await params
    await db.job.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}