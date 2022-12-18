import {
  FC,
  useState,
  ForwardRefRenderFunction,
  forwardRef,
  useRef,
  useCallback,
} from 'react'
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

type Props = {
  language: LangCode
  highlighted: boolean
  onUpdateTitle: (title: string) => void
  onUpdateContent: (content: string) => void
  initial: { title?: string; content?: string }
  onContainer?: (container: HTMLElement | null) => void
}

const EditorPane: FC<Props> = ({
  highlighted,
  onUpdateTitle,
  onUpdateContent,
  initial,
  onContainer,
}) => {
  const setContainerRef = useRef(onContainer)
  setContainerRef.current = onContainer
  const setContainer = useCallback(
    (el: HTMLElement | null) => setContainerRef.current?.(el),
    []
  )

  const [title, setTitle] = useState(initial.title ?? '')

  console.log('render pane')

  useEffect(() => {
    return () => setContainer(null)
  }, [setContainer])

  return (
    <div className={cn(style.pane, { [style.highlighted]: highlighted })}>
      <Textarea
        value={title}
        onChange={bundle(setTitle, onUpdateTitle)}
        placeholder="Title"
        className={style.title}
      />
      <EditorBody
        initial={initial}
        onUpdateContent={onUpdateContent}
        onContainer={setContainer}
      />
    </div>
  )
}

export default EditorPane

const EditorBody: FC<
  Pick<Props, 'initial' | 'onUpdateContent' | 'onContainer'>
> = ({ initial, onUpdateContent, onContainer }) => {
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
    />
  )
}
