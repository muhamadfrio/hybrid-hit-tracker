import type { CollectionConfig, Where } from 'payload'
import { isCoachOrAdmin, isLoggedIn } from '@/access'
import { SET_TYPES } from './ExerciseTemplate'
import {
  recalculateSessionAfterLogChange,
  recalculateSessionAfterLogDelete,
} from './hooks/recalculateSession'

import type { AuthUser } from '@/access'

const exerciseLogAccess = async ({
  req,
}: {
  req: { user?: AuthUser | null; payload: import('payload').Payload }
}): Promise<boolean | Where> => {
  const { user, payload } = req
  if (!user) return false
  if (isCoachOrAdmin(user)) return true

  const sessions = await payload.find({
    collection: 'workout-sessions',
    where: { user: { equals: user.id } },
    limit: 500,
    depth: 0,
  })
  const sessionIds = sessions.docs.map((s) => s.id)
  if (sessionIds.length === 0) return false

  return {
    workoutSession: { in: sessionIds },
  }
}

export const ExerciseLog: CollectionConfig = {
  slug: 'exercise-logs',
  labels: {
    singular: 'Exercise Log',
    plural: 'Exercise Logs',
  },
  admin: {
    useAsTitle: 'exerciseTemplate',
    defaultColumns: ['exerciseTemplate', 'setType', 'weight', 'reps', 'rir'],
    group: 'Logging',
  },
  access: {
    read: exerciseLogAccess,
    create: isLoggedIn,
    update: exerciseLogAccess,
    delete: exerciseLogAccess,
  },
  hooks: {
    afterChange: [recalculateSessionAfterLogChange],
    afterDelete: [recalculateSessionAfterLogDelete],
  },
  fields: [
    {
      name: 'workoutSession',
      type: 'relationship',
      relationTo: 'workout-sessions',
      required: true,
      index: true,
    },
    {
      name: 'exerciseTemplate',
      type: 'relationship',
      relationTo: 'exercise-templates',
      required: true,
    },
    {
      name: 'setType',
      type: 'select',
      required: true,
      options: [...SET_TYPES],
    },
    {
      name: 'setNumber',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'weight',
      type: 'number',
      label: 'Weight (kg)',
      min: 0,
    },
    {
      name: 'reps',
      type: 'number',
      min: 0,
    },
    {
      name: 'rir',
      type: 'number',
      label: 'RIR (Reps in Reserve)',
      min: 0,
      max: 10,
    },
    {
      name: 'note',
      type: 'text',
      label: 'Personal Note',
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
