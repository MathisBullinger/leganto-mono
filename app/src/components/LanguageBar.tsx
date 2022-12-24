import type { VFC } from 'react'
import { LangCode, languageName } from 'util/language'

import style from './LanguageBar.module.css'

const LanguageBar: VFC<{ langs: LangCode[] }> = ({ langs }) => {
  return (
    <ol className={style.bar}>
      {langs.map(lang => (
        <li key={lang}>{languageName[lang]}</li>
      ))}
    </ol>
  )
}

export default LanguageBar
