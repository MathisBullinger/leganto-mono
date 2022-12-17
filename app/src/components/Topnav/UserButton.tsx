import { VFC } from 'react'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Dropdown from './Dropdown'
import { useContext, Context } from 'context/app'
import { useLocation, Link } from 'itinero'
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
}) => {
  return (
    <Button
      className={cn(style.signInButton, style.signedIn)}
      onKeyDown={({ key, target }) => {
        if (key === 'Escape') (target as HTMLElement).blur()
      }}
    >
      <Link to={`/profile/${user.id}`}>{user.name}</Link>
      {<Dropdown />}
    </Button>
  )
}
