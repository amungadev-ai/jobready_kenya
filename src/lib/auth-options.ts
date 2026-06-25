import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  // This will be configured by the authentication agent.
  // Placeholder to prevent import errors.
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || 'jobr-ke-admin-secret-placeholder',
};

export default authOptions;