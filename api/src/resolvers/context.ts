import * as jwt from '~/util/jwt'
import { PublicError } from '../util/error'

export const createContext = (cookies: Record<string, string>) => {
  const headers = new Map<string, string[]>()
  let userId: string | null = null

  if (cookies.auth) {
    try {
      const decoded = jwt.decode(cookies.auth)
      userId = decoded.id ?? null
    } catch (error) {
      console.error('failed to decode jwt', { token: cookies.auth, error })
    }
  }

  const assertSignedIn = (action?: string) => {
    if (!userId)
      throw new PublicError('must be signed in', action && ` to ${action}`)
  }

  return {
    addHeader(name: string, value: string) {
      if (!headers.has(name)) headers.set(name, [value])
      else headers.get(name)!.push(value)
    },
    headers,
    cookies,
    userId,
    assertSignedIn,
  }
}

export type Context = ReturnType<typeof createContext>
