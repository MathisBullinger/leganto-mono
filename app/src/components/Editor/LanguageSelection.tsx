import { FC } from 'react'
import { LangCode, languageName } from 'utils/language'

import style from './LanguageSelection.module.scss'

type Props = {
  languages: LangCode[]
  onHighlight: (lang: LangCode | null) => void
}

const LanguageSelection: FC<Props> = ({ languages, onHighlight }) => {
  return (
    <ol className={style.bar}>
      {languages.map(code => (
        <li
          key={code}
          onMouseEnter={() => onHighlight(code)}
          onMouseLeave={() => onHighlight(null)}
        >
          {languageName[code]}
        </li>
      ))}
    </ol>
  )
}

export default LanguageSelection
