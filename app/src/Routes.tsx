import { Route, Switch, Redirect } from 'itinero'

import Home from './pages/Home'
import Profile from './pages/Profile'
import TextList from './pages/TextList'
import Editor from './pages/Editor'

const Routes = () => (
  <Switch>
    <Route path="/">{Home}</Route>
    <Route path="/profile/:id">{Profile}</Route>
    <Route path="/edit/:id">{Editor}</Route>
    <Route path={/^(?<lang>(\/[a-z]{2})+)$/i}>{TextList}</Route>
    <Redirect to="/" />
  </Switch>
)

export default Routes
