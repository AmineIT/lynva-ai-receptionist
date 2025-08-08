import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'
import { Providers } from '@/components/providers/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lynva AI Receptionist',
  description: 'AI-powered receptionist application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}