import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const FALLBACK_DATABASE_URL = 'mysql://jobready_database_admin:Admincyber@d7.my-control-panel.com:3306/jobready_database?connection_limit=5&pool_timeout=10'

const databaseUrl = process.env.DATABASE_URL || FALLBACK_DATABASE_URL
process.env.DATABASE_URL = databaseUrl

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

/**
 * Test the database connection. Returns { ok: true } or { ok: false, error: string }.
 * Used by /api/health for diagnostics.
 */
export async function testDbConnection(): Promise<{ ok: boolean; latencyMs?: number; error?: string; dbUrlPrefix?: string }> {
  const start = Date.now()
  try {
    await db.$queryRaw`SELECT 1 as ping`
    const latencyMs = Date.now() - start
    return { ok: true, latencyMs, dbUrlPrefix: databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@').slice(0, 80) }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg, dbUrlPrefix: databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@').slice(0, 80) }
  }
}