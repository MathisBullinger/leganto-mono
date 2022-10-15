import { FC, useState } from 'react'
import { createPortal } from 'preact/compat'
import cn from 'util/css'
import type { LangCode } from 'utils/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import style from './Editor.module.scss'

const EditorWrapper: FC = () => {
  const [languages, setLanguages] = useState<LangCode[]>(['de', 'en', 'es'])
  const [highlighted, setHighlighted] = useState<LangCode | null>(null)

  return (
    <div className={cn(style.wrapper, { [style.highlight]: highlighted })}>
      {createPortal(
        <LanguageSelect
          languages={languages}
          onHighlight={setHighlighted}
          onMove={(index, offset) => {
            setLanguages(move(languages, index, index + offset))
          }}
        />,
        document.getElementById('custom-header-content')!
      )}
      {languages.map(lang => (
        <Pane key={lang} language={lang} highlighted={lang === highlighted} />
      ))}
    </div>
  )
}

export default EditorWrapper

const move = <T,>(list: T[], from: number, to: number): T[] => {
  const tmp = [...list.slice(0, from), ...list.slice(from + 1)]
  return [...tmp.slice(0, to), list[from], ...tmp.slice(to)]
}
