import { createContext, useContext as useReactContext, useState } from 'react'

export const useValue = () => {
  const [user, setUser] = useState<User>()

  return {
    user,
    setUser,
  }
}

type User = { id: string; name: string }

export type Context = ReturnType<typeof useValue>

const appContext = createContext({} as Context)

export const Provider = appContext.Provider

export const useContext = () => useReactContext(appContext)
