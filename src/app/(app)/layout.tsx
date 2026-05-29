import './globals.css'
import { AppNav } from '@/components/AppNav'
import { getCurrentUser } from '@/lib/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen">
      {user && <AppNav email={user.email} />}
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
