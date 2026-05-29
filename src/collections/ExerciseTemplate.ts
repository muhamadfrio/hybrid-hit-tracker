import type { CollectionConfig } from 'payload'
import { isCoachOrAdminAccess, isLoggedIn } from '@/access'

export const SET_TYPES = [
  { label: '🔵 Warm-up', value: 'warm-up' },
  { label: '🟡 Working', value: 'working' },
  { label: '🔴 All-out', value: 'all-out' },
  { label: 'Drop Set', value: 'drop-set' },
] as const

export const ExerciseTemplate: CollectionConfig = {
  slug: 'exercise-templates',
  labels: {
    singular: 'Exercise Template',
    plural: 'Exercise Templates',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'variant', 'muscleGroup', 'defaultSetType'],
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
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'variant',
      type: 'text',
      label: 'Variant / Tag',
      admin: {
        description: 'e.g. Upper Chest — Prioritas, Mid Chest — Volume',
      },
    },
    {
      name: 'muscleGroup',
      type: 'text',
      label: 'Muscle Group / Focus',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Technique Notes',
      admin: {
        description: 'Catatan teknik dari program (kolom Note Excel)',
      },
    },
    {
      name: 'recommendedWarmUpSets',
      type: 'number',
      min: 0,
      defaultValue: 1,
    },
    {
      name: 'recommendedWorkingSets',
      type: 'number',
      min: 0,
      defaultValue: 1,
    },
    {
      name: 'defaultSetType',
      type: 'select',
      required: true,
      defaultValue: 'working',
      options: [...SET_TYPES],
    },
    {
      name: 'targetRepsMin',
      type: 'number',
      label: 'Target Reps (min)',
      defaultValue: 6,
      admin: { description: 'Untuk saran progressive overload' },
    },
    {
      name: 'targetRepsMax',
      type: 'number',
      label: 'Target Reps (max)',
      defaultValue: 10,
    },
    {
      name: 'targetRir',
      type: 'number',
      label: 'Target RIR',
      defaultValue: 1,
      min: 0,
      max: 5,
    },
  ],
}
