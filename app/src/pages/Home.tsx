import type { VFC } from 'react'
import Helmet from 'react-helmet'
import type { RouteProps } from 'itinero'

const Home: VFC<RouteProps> = () => {
  return (
    <>
      <Helmet>
        <title>Leganto</title>
      </Helmet>
    </>
  )
}

export default Home
