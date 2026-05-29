import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { calcLogsVolume } from '@/lib/volume'

async function updateSessionTotals(
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
  sessionId: number | string,
) {
  const logs = await payload.find({
    collection: 'exercise-logs',
    where: { workoutSession: { equals: sessionId } },
    limit: 500,
    depth: 0,
  })

  const totalVolume = calcLogsVolume(
    logs.docs as Array<{ weight?: number | null; reps?: number | null }>,
  )
  const totalSets = logs.docs.length

  await payload.update({
    collection: 'workout-sessions',
    id: sessionId,
    data: { totalVolume, totalSets },
  })
}

export const recalculateSessionAfterLogChange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const sessionId =
    typeof doc.workoutSession === 'object' ? doc.workoutSession?.id : doc.workoutSession
  if (sessionId) await updateSessionTotals(req.payload, sessionId)
}

export const recalculateSessionAfterLogDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  const sessionId =
    typeof doc?.workoutSession === 'object' ? doc.workoutSession?.id : doc?.workoutSession
  if (sessionId) await updateSessionTotals(req.payload, sessionId)
}
