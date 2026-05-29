'use client'

import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Program = { id: string | number; name: string }
type TrainingDay = {
  id: string | number
  dayName: string
  dayOrder: number
  exercises?: Array<{
    id: string | number
    name: string
    variant?: string
    description?: string
    recommendedWarmUpSets?: number
    recommendedWorkingSets?: number
    defaultSetType?: string
    targetRepsMin?: number
    targetRepsMax?: number
  }>
}

const SET_TYPE_LABELS: Record<string, string> = {
  'warm-up': '🔵 Warm-up',
  working: '🟡 Working',
  'all-out': '🔴 All-out',
  'drop-set': 'Drop Set',
}

const DAY_LABELS: Record<string, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  'deadlift-shoulders': 'Deadlift + Bahu',
}

type SetRow = {
  setType: string
  setNumber: number
  weight: string
  reps: string
  rir: string
  note: string
}

export function WorkoutLogger() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [days, setDays] = useState<TrainingDay[]>([])
  const [programId, setProgramId] = useState<string>('')
  const [dayId, setDayId] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null)
  const [setsByExercise, setSetsByExercise] = useState<Record<string, SetRow[]>>({})
  const [feeling, setFeeling] = useState('3')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [overloadTips, setOverloadTips] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/training-programs?where[isActive][equals]=true&limit=10', {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data: { docs: Program[] }) => setPrograms(data.docs ?? []))
  }, [])

  useEffect(() => {
    if (!programId) return
    fetch(
      `/api/training-days?where[program][equals]=${programId}&sort=dayOrder&depth=2&limit=10`,
      { credentials: 'include' },
    )
      .then((r) => r.json())
      .then((data: { docs: TrainingDay[] }) => setDays(data.docs ?? []))
  }, [programId])

  const initSetsForDay = useCallback((day: TrainingDay) => {
    const map: Record<string, SetRow[]> = {}
    for (const ex of day.exercises ?? []) {
      const id = String(ex.id)
      const warm = ex.recommendedWarmUpSets ?? 1
      const work = ex.recommendedWorkingSets ?? 1
      const rows: SetRow[] = []
      for (let i = 1; i <= warm; i++) {
        rows.push({
          setType: 'warm-up',
          setNumber: i,
          weight: '',
          reps: '',
          rir: '3',
          note: '',
        })
      }
      for (let i = 1; i <= work; i++) {
        rows.push({
          setType: ex.defaultSetType ?? 'working',
          setNumber: warm + i,
          weight: '',
          reps: '',
          rir: '1',
          note: '',
        })
      }
      map[id] = rows
    }
    setSetsByExercise(map)
  }, [])

  useEffect(() => {
    const day = days.find((d) => String(d.id) === dayId) ?? null
    setSelectedDay(day)
    if (day) initSetsForDay(day)
  }, [dayId, days, initSetsForDay])

  function updateSet(exerciseId: string, index: number, field: keyof SetRow, value: string) {
    setSetsByExercise((prev) => {
      const rows = [...(prev[exerciseId] ?? [])]
      const row = rows[index]
      if (!row) return prev
      rows[index] = { ...row, [field]: value }
      return { ...prev, [exerciseId]: rows }
    })
  }

  async function checkOverload(exerciseId: string, weight: number, reps: number, rir: number) {
    const res = await fetch('/api/progressive-overload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ exerciseTemplateId: exerciseId, weight, reps, rir }),
    })
    if (res.ok) {
      const data = (await res.json()) as { message: string }
      setOverloadTips((t) => ({ ...t, [exerciseId]: data.message }))
    }
  }

  async function handleSave() {
    if (!programId || !dayId || !selectedDay) {
      alert('❌ Pilih Program dan Hari Latihan terlebih dahulu!')
      return
    }
  
    setSaving(true)
    setMessage(null)
  
    try {
      const sessionRes = await fetch('/api/workout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          program: Number(programId),
          trainingDay: Number(dayId),
          date: format(new Date(), 'yyyy-MM-dd'),
          feeling: Number(feeling) || 3,
          notes: notes || '',
        }),
      })
  
      const sessionData = await sessionRes.json()
      const sessionId = sessionData.doc?.id ?? sessionData.id
  
      if (!sessionRes.ok || !sessionId) {
        console.error('Gagal buat session:', sessionData)
        setMessage('❌ Gagal membuat sesi workout')
        setSaving(false)
        return
      }
  
      let successCount = 0
      for (const ex of selectedDay.exercises ?? []) {
        const exId = String(ex.id)
        const rows = setsByExercise[exId] ?? []
  
        for (const row of rows) {
          if (!row.weight || !row.reps || Number(row.weight) <= 0 || Number(row.reps) <= 0) {
            continue
          }
  
          const logRes = await fetch('/api/exercise-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              workoutSession: Number(sessionId),
              exerciseTemplate: Number(ex.id),
              setType: row.setType,
              setNumber: row.setNumber,
              weight: Number(row.weight),
              reps: Number(row.reps),
              rir: Number(row.rir) || 1,
              note: row.note || undefined,
              completedAt: new Date().toISOString(),
            }),
          })
  
          if (logRes.ok) successCount++
          else console.error('Gagal simpan log untuk exercise', ex.id, await logRes.json())
        }
      }
  
      setMessage(`✅ Workout berhasil disimpan! (${successCount} set tercatat)`)
      setNotes('')
      setFeeling('3')
  
      setTimeout(() => window.location.reload(), 800)
  
    } catch (err) {
      console.error('Error saat save:', err)
      setMessage('❌ Terjadi kesalahan saat menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pilih program & hari</CardTitle>
          <CardDescription>Form diisi default dari Exercise Template</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Program</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={String(p.id)} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hari latihan</Label>
            <Select value={dayId} onValueChange={setDayId} disabled={!programId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih hari" />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={String(d.id)} value={String(d.id)}>
                    {DAY_LABELS[d.dayName] ?? d.dayName} (Urutan {d.dayOrder})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Perasaan (1–5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Catatan sesi</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional" />
          </div>
        </CardContent>
      </Card>

      {selectedDay?.exercises?.map((ex) => (
        <Card key={String(ex.id)}>
          <CardHeader>
            <CardTitle className="text-lg">{ex.name}</CardTitle>
            {ex.variant && <CardDescription>{ex.variant}</CardDescription>}
            {ex.description && (
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{ex.description}</p>
            )}
            {overloadTips[String(ex.id)] && (
              <Badge variant="success" className="mt-2 w-fit">
                {overloadTips[String(ex.id)]}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {(setsByExercise[String(ex.id)] ?? []).map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 rounded-lg border p-3 sm:grid-cols-6"
              >
                <div className="col-span-2 text-sm font-medium">
                  {SET_TYPE_LABELS[row.setType] ?? row.setType} #{row.setNumber}
                </div>
                <div>
                  <Label className="text-xs">kg</Label>
                  <Input
                    type="number"
                    value={row.weight}
                    onChange={(e) => updateSet(String(ex.id), idx, 'weight', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Reps</Label>
                  <Input
                    type="number"
                    value={row.reps}
                    onChange={(e) => updateSet(String(ex.id), idx, 'reps', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">RIR</Label>
                  <Input
                    type="number"
                    value={row.rir}
                    onChange={(e) => updateSet(String(ex.id), idx, 'rir', e.target.value)}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-xs">Note</Label>
                  <Input
                    value={row.note}
                    onChange={(e) => updateSet(String(ex.id), idx, 'note', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {selectedDay && (
        <Button size="lg" className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Workout'}
        </Button>
      )}
      {message && <p className="text-center text-sm text-primary">{message}</p>}
    </div>
  )
}
