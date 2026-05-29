import Link from 'next/link'
import { Dumbbell, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AppNav({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Dumbbell className="h-5 w-5 text-primary" />
          Hybrid HIT
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workout">Log Workout</Link>
          </Button>
          {email && (
            <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
          )}
          <form action="/api/auth/logout" method="post">
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="mr-1 h-4 w-4" />
              Keluar
            </Button>
          </form>
        </nav>
      </div>
    </header>
  )
}
