import type { Access, FieldAccess, Where } from 'payload'

export type UserRole = 'athlete' | 'coach' | 'admin'

export type AuthUser = {
  id: number | string
  role?: UserRole | string | null
  email?: string
}

export const isAdmin = (user: AuthUser | null | undefined): boolean =>
  Boolean(user && user.role === 'admin')

export const isCoachOrAdmin = (user: AuthUser | null | undefined): boolean =>
  Boolean(user && (user.role === 'coach' || user.role === 'admin'))

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const isAdminAccess: Access = ({ req: { user } }) => isAdmin(user)

export const isCoachOrAdminAccess: Access = ({ req: { user } }) =>
  isCoachOrAdmin(user)

/** Athletes see only their own rows; coaches/admins see all */
export const ownDataOrCoachAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isCoachOrAdmin(user)) return true
  return {
    user: {
      equals: user.id,
    },
  } satisfies Where
}

export const ownDataOrCoachAdminField: FieldAccess = ({ req: { user }, doc }) => {
  if (!user) return false
  if (isCoachOrAdmin(user)) return true
  const ownerId =
    typeof doc?.user === 'object' && doc?.user !== null
      ? (doc.user as { id?: number | string }).id
      : doc?.user
  return ownerId === user.id
}

export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdmin(user)
