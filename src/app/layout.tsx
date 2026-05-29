import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hybrid HIT Tracker',
  description: 'Workout CMS — Hybrid HIT (Dorian Yates × Natty Adjustment)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
