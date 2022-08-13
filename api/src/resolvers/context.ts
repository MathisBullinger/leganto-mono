import * as jwt from '~/util/jwt'

export const createContext = (cookies: Record<string, string>) => {
  const headers = new Map<string, string[]>()
  let userId: string | null = null

  if (cookies.auth) {
    const decoded = jwt.decode(cookies.auth)
    userId = decoded.id ?? null
  }

  return {
    addHeader(name: string, value: string) {
      if (!headers.has(name)) headers.set(name, [value])
      else headers.get(name)!.push(value)
    },
    headers,
    cookies,
    userId,
  }
}

export type Context = ReturnType<typeof createContext>
