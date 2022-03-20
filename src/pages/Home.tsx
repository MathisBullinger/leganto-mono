import { useGoogleSigninUrl } from 'hooks/signIn'
import type { VFC } from 'react'
import Helmet from 'react-helmet'

const Home: VFC = () => {
  const googleSignInUrl = useGoogleSigninUrl()

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
