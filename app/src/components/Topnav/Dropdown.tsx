import type { FC } from 'react'
import Button from 'components/Button'
import style from './Topnav.module.scss'
import { useContext } from 'context/app'
import * as api from 'api/client'
import { history } from 'itinero'

const Dropdown: FC = () => {
  const { setUser } = useContext()

  const signOut = async () => {
    await api.mutate.signOut()
    setUser(undefined)
  }

  const createText = async () => {
    const { createText } = await api.mutate.createText()
    console.log('create text', createText.id)
    history.push(`/edit/${createText.id}`)
  }

  return (
    <ul className={style.dropdown}>
      <li>
        <Button onClick={createText}>New Story</Button>
      </li>
      <li>
        <Button onClick={signOut}>Sign Out</Button>
      </li>
    </ul>
  )
}

export default Dropdown
