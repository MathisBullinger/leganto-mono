import type { FC } from 'react'
import Button from 'components/Button'
import style from './Topnav.module.scss'
import { useContext } from 'context/app'
import * as api from 'api/client'

const Dropdown: FC = () => {
  const { setUser } = useContext()

  const signOut = async () => {
    await api.mutate.signOut()
    setUser(undefined)
  }

  return (
    <ul className={style.dropdown}>
      <li>
        <Button onClick={signOut}>Sign Out</Button>
      </li>
    </ul>
  )
}

export default Dropdown
