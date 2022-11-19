import { FC, useState, useCallback } from 'react'
import { createPortal, useEffect } from 'preact/compat'
import cn from 'util/css'
import type { LangCode } from 'utils/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import ActionBar from './ActionBar'
import throttle from 'froebel/throttle'
import * as api from 'api/client'
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

type Change = { language: LangCode; title?: string }

const EditorWrapper: FC<{ textId: string }> = ({ textId }) => {
  const [languages, setLanguages] = useState<LangCode[]>(['en', 'es'])
  const [highlighted, setHighlighted] = useState<LangCode | null>(null)
  const [nodeSizes, setNodeSizes] = useState(new Map<LangCode, number[]>())
  const [diffs, setDiffs] = useState<Change[]>([])
  const [saving, setSaving] = useState<symbol[]>([])

  useOffsetStyles(nodeSizes)

  const saveChanges = useCallback(
    throttle(
      async () => {
        let updates: any[] = []

        setDiffs(diffs => {
          updates = diffs
          return []
        })

        if (!updates.length) return

        const saveId = Symbol()
        setSaving(ids => [...ids, saveId])

        await api.mutate.updateText({ textId, updates })
        setSaving(ids => ids.filter(id => id !== saveId))
      },
      2000,
      { leading: false, trailing: true }
    ),
    [textId]
  )

  useEffect(saveChanges, [saveChanges, diffs])

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
          onUpdateTitle={title =>
            setDiffs(diffs => [...diffs, { language: lang, title }])
          }
        />
      ))}
      <ActionBar isSaving={saving.length + diffs.length > 0} />
    </div>
  )
}

export default EditorWrapper

const move = <T,>(list: T[], from: number, to: number): T[] => {
  const tmp = [...list.slice(0, from), ...list.slice(from + 1)]
  return [...tmp.slice(0, to), list[from], ...tmp.slice(to)]
}
