import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div className="space-y-8 py-12">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Hybrid HIT Tracker</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Program 4 hari — Dorian Yates × Natty Adjustment. Log latihan, progressive overload,
          dan dashboard progress.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Athlete App</CardTitle>
            <CardDescription>Log workout & lihat progress</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin / Coach</CardTitle>
            <CardDescription>Kelola program & data atlet</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/admin">Payload Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
