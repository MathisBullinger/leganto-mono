import { createContext, useContext as useReactContext, useState } from 'react'

export const useValue = () => {
  const [user, setUser_] = useState<User | undefined>(readUser())

  const setUser = (user: User | undefined) => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
    setUser_(user)
  }

  return {
    user,
    setUser,
  }
}

const readUser = (): User | undefined => {
  const userData = localStorage.getItem('user')
  if (!userData) return undefined
  return JSON.parse(userData)
}

type User = { id: string; name: string }

export type Context = ReturnType<typeof useValue>

const appContext = createContext({} as Context)

export const Provider = appContext.Provider

export const useContext = () => useReactContext(appContext)
