import type { CollectionConfig } from 'payload'
import { isAdmin, isCoachOrAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'firstName', 'lastName'],
    group: 'System',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isCoachOrAdmin(user)) return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => isAdmin(user) || isCoachOrAdmin(user),
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      if (isCoachOrAdmin(user)) return true
      return user.id === id
    },
    delete: ({ req: { user } }) => isAdmin(user),
    admin: ({ req: { user } }) => isCoachOrAdmin(user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'athlete',
      options: [
        { label: 'Athlete', value: 'athlete' },
        { label: 'Coach', value: 'coach' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req: { user } }) => isAdmin(user),
      },
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
}
