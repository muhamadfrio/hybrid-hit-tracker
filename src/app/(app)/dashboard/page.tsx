'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DashboardCharts,
  type PersonalRecord,
  type WeeklyVolume,
} from '@/components/DashboardCharts'

export default function DashboardPage() {
  const [data, setData] = useState<{
    weeklyVolume: WeeklyVolume[]
    personalRecords: PersonalRecord[]
    totalSessions: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard', { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-muted-foreground">Memuat dashboard...</p>

  if (!data) {
    return <p className="text-destructive">Gagal memuat data. Silakan login ulang.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Progress</h1>
          <p className="text-muted-foreground">Volume mingguan & PR tracker</p>
        </div>
        <Button asChild>
          <Link href="/workout">Log Workout Baru</Link>
        </Button>
      </div>
      <DashboardCharts
        weeklyVolume={data.weeklyVolume}
        personalRecords={data.personalRecords}
        totalSessions={data.totalSessions}
      />
    </div>
  )
}
