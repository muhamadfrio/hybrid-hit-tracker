import { cookies } from 'next/headers'
import type { User } from '@/payload-types'
import { getPayloadClient } from './payload'

const TOKEN_COOKIE = 'payload-token'

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  if (!token) return null

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: new Headers({ Cookie: `${TOKEN_COOKIE}=${token}` }) })
    if (!user) return null
    return user as unknown as User
  } catch {
    return null
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
