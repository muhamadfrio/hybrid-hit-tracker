import type { CollectionConfig } from 'payload'
import { isCoachOrAdminAccess, isLoggedIn } from '@/access'

export const TrainingProgram: CollectionConfig = {
  slug: 'training-programs',
  labels: {
    singular: 'Training Program',
    plural: 'Training Programs',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isActive', 'startDate'],
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
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'startDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
  ],
}
