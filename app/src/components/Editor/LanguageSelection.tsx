import { FC } from 'react'
import { LangCode, languageName } from 'utils/language'

import style from './LanguageSelection.module.scss'

type Props = {
  languages: LangCode[]
}

const LanguageSelection: FC<Props> = ({ languages }) => {
  return (
    <ul className={style.bar}>
      {languages.map(code => (
        <li key={code}>{languageName[code]}</li>
      ))}
    </ul>
  )
}

export default LanguageSelection
