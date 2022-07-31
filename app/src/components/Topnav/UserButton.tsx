import type { VFC } from 'react'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { useContext, Context } from 'context/app'
import { useLocation } from 'itinero'
import * as signIn from 'util/signIn'
import cn from 'util/css'
import style from './Topnav.module.scss'

const UserButton: VFC = () => {
  const { user, setUser } = useContext()
  return user ? <SignedIn user={user} /> : <SignedOut setUser={setUser} />
}

export default UserButton

const SignedOut: VFC<{ setUser: Context['setUser'] }> = ({ setUser }) => {
  const location = useLocation()
  const googleSignInUrl = signIn.googleSigninUrl()
  const loading = signIn.useGoogleSignin(location.search, setUser)

  if (loading) return <Icon type="loadingDots" className={style.loading} />

  return (
    <Button className={style.signInButton} link={googleSignInUrl}>
      login
    </Button>
  )
}

const SignedIn: VFC<{ user: Exclude<Context['user'], undefined> }> = ({
  user,
}) => (
  <Button className={cn(style.signInButton, style.signedIn)}>
    {user.name}
  </Button>
)
