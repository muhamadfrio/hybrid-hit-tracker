'use client'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export type WeeklyVolume = { week: string; volume: number }
export type PersonalRecord = {
  exerciseName: string
  maxWeight: number
  reps: number
  date: string
}

export function DashboardCharts({
  weeklyVolume = [],           // default empty array (aman)
  personalRecords = [],
  totalSessions = 0,
}: {
  weeklyVolume?: WeeklyVolume[]
  personalRecords?: PersonalRecord[]
  totalSessions?: number
}) {
  // Ambil volume minggu terakhir dengan aman
  const latestVolume = weeklyVolume?.at(-1)?.volume ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Sesi */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total sesi</CardDescription>
            <CardTitle className="text-3xl">{totalSessions}</CardTitle>
          </CardHeader>
        </Card>

        {/* Volume Minggu Ini */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Volume minggu ini</CardDescription>
            <CardTitle className="text-3xl">
              {latestVolume.toLocaleString('id-ID')} kg
            </CardTitle>
          </CardHeader>
        </Card>

        {/* PR Tercatat */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>PR tercatat</CardDescription>
            <CardTitle className="text-3xl">{personalRecords.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Chart Volume per Minggu */}
      <Card>
        <CardHeader>
          <CardTitle>Volume per minggu</CardTitle>
          <CardDescription>Total volume (kg) dari semua set kerja</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString('id-ID')} kg`, 'Volume']} />
              <Bar dataKey="volume" fill="oklch(0.55 0.18 265)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PR Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>PR Tracker</CardTitle>
          <CardDescription>Beban maksimum per gerakan (set kerja)</CardDescription>
        </CardHeader>
        <CardContent>
          {personalRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada PR — mulai log workout!</p>
          ) : (
            <ul className="divide-y">
              {personalRecords.map((pr) => (
                <li key={pr.exerciseName} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{pr.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">{pr.date}</p>
                  </div>
                  <Badge variant="success">
                    {pr.maxWeight} kg × {pr.reps}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}