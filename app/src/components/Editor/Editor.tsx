import { FC, useState } from 'react'
import { createPortal } from 'preact/compat'
import cn from 'util/css'
import type { LangCode } from 'utils/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import style from './Editor.module.scss'

const EditorWrapper: FC = () => {
  const [languages, setLanguages] = useState<LangCode[]>(['en', 'es'])
  const [highlighted, setHighlighted] = useState<LangCode | null>(null)

  console.log({ highlighted })

  return (
    <div className={cn(style.wrapper, { [style.highlight]: highlighted })}>
      {createPortal(
        <LanguageSelect languages={languages} onHighlight={setHighlighted} />,
        document.getElementById('custom-header-content')!
      )}
      {languages.map(lang => (
        <Pane key={lang} language={lang} highlighted={lang === highlighted} />
      ))}
    </div>
  )
}

export default EditorWrapper
