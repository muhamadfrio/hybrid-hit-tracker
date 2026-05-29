import type { CollectionConfig } from 'payload'
import { ownDataOrCoachAdmin, isLoggedIn } from '@/access'

export const WorkoutSession: CollectionConfig = {
  slug: 'workout-sessions',
  labels: {
    singular: 'Workout Session',
    plural: 'Workout Sessions',
  },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'user', 'trainingDay', 'totalVolume', 'feeling'],
    group: 'Logging',
  },
  access: {
    read: ownDataOrCoachAdmin,
    create: isLoggedIn,
    update: ownDataOrCoachAdmin,
    delete: ownDataOrCoachAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user && !data.user) {
          data.user = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'training-programs',
      required: false,
    },
    {
      name: 'trainingDay',
      type: 'relationship',
      relationTo: 'training-days',
      required: false,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'totalVolume',
      type: 'number',
      label: 'Total Volume (kg)',
      admin: { readOnly: true },
    },
    {
      name: 'totalSets',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'feeling',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: '1 = sangat lelah, 5 = sangat bagus' },
    },
  ],
}
