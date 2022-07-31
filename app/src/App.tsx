import Routes from './Routes'
import Topnav from './components/Topnav/Topnav'
import * as AppContext from 'context/app'

export default function App() {
  const contextValue = AppContext.useValue()

  return (
    <AppContext.Provider value={contextValue}>
      <Topnav />
      <Routes />
    </AppContext.Provider>
  )
}
