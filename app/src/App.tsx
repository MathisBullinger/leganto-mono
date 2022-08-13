import { useEffect, useRef } from 'react'
import Routes from './Routes'
import Topnav from './components/Topnav/Topnav'
import * as AppContext from 'context/app'
import * as api from 'api/client'

export default function App() {
  const contextValue = AppContext.useValue()
  const contextRef = useRef(contextValue)
  contextRef.current = contextValue

  useEffect(() => {
    const fetchMe = async () => {
      const { me } = await api.query.me()
      contextRef.current.setUser(me ?? undefined)
    }
    fetchMe()
  }, [])

  return (
    <AppContext.Provider value={contextValue}>
      <Topnav />
      <Routes />
    </AppContext.Provider>
  )
}
