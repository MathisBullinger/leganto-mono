import { FC, useState, useEffect, useCallback, CSSProperties } from 'react'
import { createPortal } from 'preact/compat'
import cn from 'util/css'
import type { LangCode } from 'util/language'
import LanguageSelect from './LanguageSelection'
import Pane from './EditorPane'
import ActionBar from './ActionBar'
import * as api from 'api/client'
import debounce from 'froebel/debounce'
import style from './Editor.module.scss'
import { groupBy } from 'util/list'
import { useEditorGrid } from './hooks/useEditorGrid'
import { useRowHighlight } from './hooks/useRowHighlight'

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

  const [editorPanes, setEditorPanes] = useState<(HTMLElement | null)[]>([])
  const rows = useEditorGrid(editorPanes.filter(Boolean) as HTMLElement[])

  return (
    <div
      className={cn(style.wrapper, { [style.highlight]: highlighted })}
      style={{ '--rows': rows } as CSSProperties}
    >
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
      <EditorPanes
        textId={textId}
        languages={languages}
        highlighted={highlighted}
        initial={initial}
        setPanes={setEditorPanes}
      />
    </div>
  )
}

const EditorPanes: FC<{
  textId: string
  languages: LangCode[]
  highlighted: LangCode | null
  initial: RemoteData
  setPanes: (
    set: (current: (HTMLElement | null)[]) => (HTMLElement | null)[]
  ) => void
}> = ({ textId, languages, highlighted, initial, setPanes }) => {
  const [diffs, setDiffs] = useState<Change[]>([])
  const [saving, setSaving] = useState<symbol[]>([])
  const [highlightTitle, setHighlightTitle] = useState(false)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  useRowHighlight(highlightedRow)

  const saveChanges = useCallback(
    debounce(async () => {
      let changes: Change[] = []

      setDiffs(diffs => {
        changes = diffs
        return diffs.length ? [] : diffs
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
    <>
      {languages.map((lang, i) => (
        <Pane
          key={lang}
          language={lang}
          highlighted={lang === highlighted}
          onContainer={el =>
            setPanes(panes =>
              Array(Math.max(panes.length, i + 1))
                .fill(null)
                .map((_, e) => (e === i ? el : panes[e]))
            )
          }
          onUpdateTitle={title =>
            setDiffs(diffs => [...diffs, { language: lang, title }])
          }
          onUpdateContent={content =>
            setDiffs(diffs => [...diffs, { language: lang, content }])
          }
          initial={initial?.[lang] ?? {}}
          onRowHover={setHighlightedRow}
          highlightTitle={highlightTitle}
          onHighlightTitle={setHighlightTitle}
        />
      ))}
      <ActionBar isSaving={saving.length + diffs.length > 0} />
    </>
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
