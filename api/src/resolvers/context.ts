export const createContext = () => {
  const headers = new Map<string, string[]>()

  return {
    addHeader(name: string, value: string) {
      if (!headers.has(name)) headers.set(name, [value])
      else headers.get(name)!.push(value)
    },
    headers,
  }
}

export type Context = ReturnType<typeof createContext>
