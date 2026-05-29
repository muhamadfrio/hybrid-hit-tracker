import { WorkoutLogger } from '@/components/WorkoutLogger'

export default function WorkoutPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Log Workout</h1>
        <p className="text-muted-foreground">
          Pilih program → hari → isi set (default dari template)
        </p>
      </div>
      <WorkoutLogger />
    </div>
  )
}
