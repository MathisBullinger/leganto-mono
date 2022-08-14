import type { VFC } from 'react'
import UserButton from './UserButton'
import style from './Topnav.module.scss'

const Topnav: VFC = () => (
  <header className={style.bar}>
    <div className={style.left}>
      <span className={style.logo}>Leganto</span>
    </div>
    <div className={style.right}>
      <UserButton />
    </div>
  </header>
)

export default Topnav
