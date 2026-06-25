import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create your JOBR Kenya account to apply for jobs or post opportunities.',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}