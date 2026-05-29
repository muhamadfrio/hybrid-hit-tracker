import { NextResponse } from 'next/server'
import { format, startOfWeek, subWeeks } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { requireUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const user = await requireUser()
    const payload = await getPayloadClient()

    const sessions = await payload.find({
      collection: 'workout-sessions',
      where: { user: { equals: user.id } },
      sort: '-date',
      limit: 200,
      depth: 0,
    })

    const logs = await payload.find({
      collection: 'exercise-logs',
      where: {
        workoutSession: { in: sessions.docs.map((s) => s.id) },
        setType: { in: ['working', 'all-out'] },
      },
      limit: 2000,
      depth: 2,
    })

    const weeklyMap = new Map<string, number>()
    for (let i = 7; i >= 0; i--) {
      const w = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      const key = format(w, 'dd MMM', { locale: localeId })
      weeklyMap.set(key, 0)
    }

    for (const session of sessions.docs) {
      const weekKey = format(startOfWeek(new Date(session.date), { weekStartsOn: 1 }), 'dd MMM', {
        locale: localeId,
      })
      if (weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, (weeklyMap.get(weekKey) ?? 0) + (session.totalVolume ?? 0))
      }
    }

    const weeklyVolume = Array.from(weeklyMap.entries()).map(([week, volume]) => ({
      week,
      volume: Math.round(volume),
    }))

    const prMap = new Map<
      string,
      { exerciseName: string; maxWeight: number; reps: number; date: string }
    >()

    for (const log of logs.docs) {
      const template =
        typeof log.exerciseTemplate === 'object' ? log.exerciseTemplate : null
      const name = template?.name ?? 'Unknown'
      const weight = log.weight ?? 0
      const reps = log.reps ?? 0
      if (!weight) continue

      const session =
        typeof log.workoutSession === 'object' ? log.workoutSession : null
      const dateStr = session?.date
        ? format(new Date(session.date), 'dd MMM yyyy', { locale: localeId })
        : '—'

      const existing = prMap.get(name)
      if (!existing || weight > existing.maxWeight) {
        prMap.set(name, {
          exerciseName: name,
          maxWeight: weight,
          reps,
          date: dateStr,
        })
      }
    }

    return NextResponse.json({
      weeklyVolume,
      personalRecords: Array.from(prMap.values()).sort((a, b) => b.maxWeight - a.maxWeight),
      totalSessions: sessions.totalDocs,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
