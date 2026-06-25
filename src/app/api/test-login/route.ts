import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db, testDbConnection } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // 1. Test DB connection
    const health = await testDbConnection()
    if (!health.ok) {
      return NextResponse.json({ step: 'db_connection', error: health.error, details: health }, { status: 500 })
    }

    // 2. Find user
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ step: 'user_lookup', error: 'User not found', email })
    }

    // 3. Check active + password
    if (!user.isActive) {
      return NextResponse.json({ step: 'active_check', error: 'User is not active', email })
    }
    if (!user.password) {
      return NextResponse.json({ step: 'password_check', error: 'User has no password set', email })
    }

    // 4. Verify bcrypt
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ step: 'bcrypt_verify', error: 'Password mismatch', email })
    }

    return NextResponse.json({
      step: 'success',
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive },
      dbHealth: { latencyMs: health.latencyMs, isVercel: health.isVercel },
    })
  } catch (err: any) {
    return NextResponse.json({ step: 'exception', error: err.message, code: err.code }, { status: 500 })
  }
}