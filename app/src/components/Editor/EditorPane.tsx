import { FC, useState, useRef, useCallback } from 'react'
import cn from 'util/css'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Textarea from 'components/Textarea'
import type { LangCode } from 'utils/language'
import bundle from 'froebel/bundle'
import style from './EditorPane.module.scss'
import { useEffect } from 'preact/hooks'
import classNames from 'util/css'

type Props = {
  language: LangCode
  highlighted: boolean
  onUpdateTitle: (title: string) => void
  onUpdateContent: (content: string) => void
  initial: { title?: string; content?: string }
  onContainer?: (container: HTMLElement | null) => void
  onRowHover?: (index: number | null) => void
  highlightTitle?: boolean
  onHighlightTitle?: (v: boolean) => void
}

const EditorPane: FC<Props> = ({
  highlighted,
  onUpdateTitle,
  onUpdateContent,
  initial,
  onContainer,
  onRowHover,
  highlightTitle,
  onHighlightTitle,
}) => {
  const setContainerRef = useRef(onContainer)
  setContainerRef.current = onContainer
  const setContainer = useCallback(
    (el: HTMLElement | null) => setContainerRef.current?.(el),
    []
  )

  const [title, setTitle] = useState(initial.title ?? '')

  useEffect(() => {
    return () => setContainer(null)
  }, [setContainer])

  return (
    <div className={cn(style.pane, { [style.highlighted]: highlighted })}>
      <div
        className={classNames(style.title, {
          [style.highlightTitle]: highlightTitle,
        })}
      >
        <Textarea
          value={title}
          onChange={bundle(setTitle, onUpdateTitle)}
          placeholder="Title"
          onMouseOver={() => onHighlightTitle?.(true)}
          onMouseOut={() => onHighlightTitle?.(false)}
        />
      </div>
      <EditorBody
        initial={initial}
        onUpdateContent={onUpdateContent}
        onContainer={setContainer}
        onRowHover={onRowHover}
      />
    </div>
  )
}

export default EditorPane

const EditorBody: FC<
  Pick<Props, 'initial' | 'onUpdateContent' | 'onContainer' | 'onRowHover'>
> = ({ initial, onUpdateContent, onContainer, onRowHover }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      HardBreak,
      Heading.configure({ levels: [1, 2] }),
      History,
    ],
    content: initial.content,
    onUpdate: ({ editor }) => {
      onUpdateContent(editor.getHTML())
    },
    injectCSS: false,
  })

  return (
    <EditorContent
      editor={editor}
      lang="en"
      ref={ref => {
        const container =
          (
            ref?.editorContentRef.current as HTMLElement
          )?.querySelector<HTMLDivElement>('.ProseMirror') ?? null

        if (!ref || container === containerRef.current) return
        containerRef.current = container

        onContainer?.(container)
      }}
      onMouseOver={({ target }) => {
        if (target === containerRef.current || !(target instanceof HTMLElement))
          return

        const index = [...target.parentElement!.children].indexOf(target)
        if (index < 0) return

        onRowHover?.(index)
      }}
      onMouseOut={() => onRowHover?.(null)}
    />
  )
}
