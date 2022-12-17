import { FC, useState, useCallback } from 'react'
import { createPortal, useEffect } from 'preact/compat'
import cn from 'util/css'
import type { LangCode } from 'utils/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import ActionBar from './ActionBar'
import * as api from 'api/client'
import debounce from 'froebel/debounce'
import style from './Editor.module.scss'
import { groupBy } from 'util/list'

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

type Change = { language: LangCode; title?: string; content?: string }
type RemoteData = { [K in LangCode]?: { title: string; content: string } }

const EditorLoader: FC<{ textId: string }> = ({ textId }) => {
  const [data, setData] = useState<RemoteData>()

  useEffect(() => {
    const fetchEdit = async () => {
      const result = await api.query.getDraft({
        textId,
        languages: ['en', 'es'] as any,
      })

      if (!result.draft) return

      const data = result.draft.translations.reduce(
        (acc, cur) => ({ ...acc, [cur.language]: cur }),
        {}
      )
      setData(data)
    }
    fetchEdit()
  }, [textId])

  if (!data) return null

  return <EditorWrapper textId={textId} initial={data} />
}

export default EditorLoader

const EditorWrapper: FC<{ textId: string; initial: RemoteData }> = ({
  textId,
  initial,
}) => {
  const [languages, setLanguages] = useState<LangCode[]>(['en', 'es'])
  const [highlighted, setHighlighted] = useState<LangCode | null>(null)
  const [nodeSizes, setNodeSizes] = useState(new Map<LangCode, number[]>())
  const [diffs, setDiffs] = useState<Change[]>([])
  const [saving, setSaving] = useState<symbol[]>([])

  useOffsetStyles(nodeSizes)

  const saveChanges = useCallback(
    debounce(async () => {
      let changes: Change[] = []

      setDiffs(diffs => {
        changes = diffs
        return []
      })

      if (!changes.length) return

      const saveId = Symbol()
      setSaving(ids => [...ids, saveId])
      const accumulated = accumulateChanges(changes)

      if (accumulated.length) {
        await api.mutate.updateText({ textId, updates: accumulated as any })
      }

      setSaving(ids => ids.filter(id => id !== saveId))
    }, 1000),
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
          onUpdateContent={content =>
            setDiffs(diffs => [...diffs, { language: lang, content }])
          }
          initial={initial?.[lang] ?? {}}
        />
      ))}
      <ActionBar isSaving={saving.length + diffs.length > 0} />
    </div>
  )
}

const move = <T,>(list: T[], from: number, to: number): T[] => {
  const tmp = [...list.slice(0, from), ...list.slice(from + 1)]
  return [...tmp.slice(0, to), list[from], ...tmp.slice(to)]
}

const accumulateChanges = (changes: Change[]): Change[] => {
  const handleLanguage = (changes: Change[]) => {
    let title: string | null = null
    let content: string | null = null
    let accumulated = [...changes]

    for (const change of accumulated) {
      if (change.title !== undefined) {
        title = change.title
        delete change.title
      }
      if (change.content !== undefined) {
        content = change.content
        delete change.content
      }
    }

    accumulated = accumulated.filter(
      change => change.title !== undefined || change.content !== undefined
    )

    if (title !== null) {
      accumulated.push({ language: changes[0].language, title })
    }

    if (content !== null) {
      accumulated.push({ language: changes[0].language, content })
    }

    return accumulated
  }

  return groupBy(changes, 'language').map(handleLanguage).flat()
}
