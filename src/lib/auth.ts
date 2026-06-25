import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { db, withRetry } from '@/lib/db'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[auth] Missing credentials')
          return null
        }

        try {
          const user = await withRetry(() =>
            db.user.findUnique({
              where: { email: credentials.email as string },
            })
          )

          console.log('[auth] DB lookup for:', credentials.email, '->', user ? `found (active=${user.isActive}, hasPw=${!!user.password})` : 'NOT FOUND')

          if (!user || !user.password || !user.isActive) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          )
          console.log('[auth] bcrypt.compare for', credentials.email, '->', isValid)

          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch (err) {
          console.error('[auth] authorize error:', err)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as Record<string, unknown>).role
        token.picture = user.image
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.sub
        (session.user as Record<string, unknown>).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'jobr-dev-secret-change-in-production',
}

export async function getAuthSession() {
  const { getServerSession } = await import('next-auth')
  return getServerSession(authOptions)
}

const handler = (
  req: NextRequest,
  ctx: { params: { nextauth: string[] } },
) => {
  return NextAuth(req, ctx, authOptions)
}
export { handler as GET, handler as POST }