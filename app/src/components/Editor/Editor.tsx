import { FC, useState } from 'react'
import { createPortal } from 'preact/compat'

import type { LangCode } from 'utils/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import style from './Editor.module.scss'

const EditorWrapper: FC = () => {
  const [languages, setLanguages] = useState<LangCode[]>(['en', 'es'])

  return (
    <div className={style.wrapper}>
      {createPortal(
        <LanguageSelect languages={languages} />,
        document.getElementById('custom-header-content')!
      )}
      {languages.map(lang => (
        <Pane key={lang} language={lang} />
      ))}
    </div>
  )
}

export default EditorWrapper
