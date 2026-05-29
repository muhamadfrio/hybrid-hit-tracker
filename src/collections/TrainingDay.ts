import type { CollectionConfig } from 'payload'
import { isCoachOrAdminAccess, isLoggedIn } from '@/access'

export const DAY_NAMES = [
  { label: 'Push', value: 'push' },
  { label: 'Pull', value: 'pull' },
  { label: 'Legs', value: 'legs' },
  { label: 'Deadlift + Bahu', value: 'deadlift-shoulders' },
] as const

export const TrainingDay: CollectionConfig = {
  slug: 'training-days',
  labels: {
    singular: 'Training Day',
    plural: 'Training Days',
  },
  admin: {
    useAsTitle: 'dayName',
    defaultColumns: ['dayName', 'dayOrder', 'program'],
    group: 'Program',
  },
  access: {
    read: isLoggedIn,
    create: isCoachOrAdminAccess,
    update: isCoachOrAdminAccess,
    delete: isCoachOrAdminAccess,
  },
  fields: [
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'training-programs',
      required: true,
      index: true,
    },
    {
      name: 'dayName',
      type: 'select',
      required: true,
      options: [...DAY_NAMES],
    },
    {
      name: 'dayOrder',
      type: 'number',
      required: true,
      min: 1,
      max: 7,
    },
    {
      name: 'exercises',
      type: 'relationship',
      relationTo: 'exercise-templates',
      hasMany: true,
      admin: {
        description: 'Urutan latihan sesuai program Excel',
      },
    },
  ],
}
