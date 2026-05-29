/** Volume = weight × reps per set */
export function calcSetVolume(weight: number | null | undefined, reps: number | null | undefined): number {
  if (!weight || !reps) return 0
  return weight * reps
}

export function calcLogsVolume(
  logs: Array<{ weight?: number | null; reps?: number | null }>,
): number {
  return logs.reduce((sum, log) => sum + calcSetVolume(log.weight, log.reps), 0)
}
