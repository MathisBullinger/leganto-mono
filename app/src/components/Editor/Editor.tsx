import { FC, useState } from 'react'
import { createPortal, useEffect } from 'preact/compat'
import cn from 'util/css'
import type { LangCode } from 'utils/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import style from './Editor.module.scss'

const useOffsetStyles = (paneOffsets: Map<LangCode, number[]>) => {
  const [styleNode] = useState(document.createElement('style'))

  useEffect(() => {
    document.body.appendChild(styleNode)

    return () => styleNode.remove()
  }, [styleNode])

  useEffect(() => {
    const offsets = [...paneOffsets.values()]
    const maxNodes = Math.max(...offsets.map(({ length }) => length))

    while (styleNode.sheet?.cssRules.length) styleNode.sheet.deleteRule(0)

    if (offsets.length < 2 || !styleNode.sheet) return

    for (let i = 0; i < offsets.length; i++) {
      const offs = Array(offsets[i].length).fill(0)

      for (let j = 0; j < maxNodes; j++) {
        const rowHeight = Math.max(...offsets.map(pane => pane[j] ?? 0))
        for (let k = j + 1; k < offs.length; k++) {
          offs[k] += rowHeight - offsets[i][j]
        }
      }

      for (let j = 0; j < offs.length; j++) {
        const rule = `.${style.wrapper} > *:nth-child(${
          i + 1
        }) .ProseMirror > *:nth-child(${j + 1}) { transform: translateY(${
          offs[j]
        }px); }`

        styleNode.sheet.insertRule(rule)
      }
    }
  }, [paneOffsets, styleNode])
}

const EditorWrapper: FC = () => {
  const [languages, setLanguages] = useState<LangCode[]>(['en', 'es'])
  const [highlighted, setHighlighted] = useState<LangCode | null>(null)
  const [nodeSizes, setNodeSizes] = useState(new Map<LangCode, number[]>())

  useOffsetStyles(nodeSizes)

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
        <Pane
          key={lang}
          language={lang}
          highlighted={lang === highlighted}
          onUpdateSize={sizes =>
            setNodeSizes(
              nodeSizes => new Map([...nodeSizes.entries(), [lang, sizes]])
            )
          }
        />
      ))}
    </div>
  )
}

export default EditorWrapper

const move = <T,>(list: T[], from: number, to: number): T[] => {
  const tmp = [...list.slice(0, from), ...list.slice(from + 1)]
  return [...tmp.slice(0, to), list[from], ...tmp.slice(to)]
}
