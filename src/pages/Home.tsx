import type { VFC } from 'react'
import Helmet from 'react-helmet'
import * as signIn from 'util/signIn'
import type { RouteProps } from 'itinero'

const Home: VFC<RouteProps> = ({ location }) => {
  const googleSignInUrl = signIn.googleSigninUrl()
  signIn.useGoogleSignin(location.search)

  return (
    <>
      <Helmet>
        <title>Leganto</title>
      </Helmet>
      <div>
        <a href={googleSignInUrl}>Sign in with Google</a>
      </div>
    </>
  )
}

export default Home
