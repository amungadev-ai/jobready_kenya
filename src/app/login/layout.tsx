import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your JOBR Kenya account to manage your jobs and applications.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}