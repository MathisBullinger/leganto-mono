import { Route } from 'itinero'

import TextList from './pages/TextList'

const Routes = () => (
  <Route path={/^(?<lang>(\/[a-z]{2})+)$/i}>{TextList}</Route>
)

export default Routes
