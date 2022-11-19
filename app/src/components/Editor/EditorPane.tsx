import { FC, useState } from 'react'
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

type Props = {
  language: LangCode
  highlighted: boolean
  onUpdateSize: (sizes: number[]) => void
  onUpdateTitle: (title: string) => void
  initial: { title?: string }
}

const EditorPane: FC<Props> = ({
  highlighted,
  onUpdateSize,
  onUpdateTitle,
  initial,
}) => {
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
    content: '',
    onUpdate: ({ editor }) => {
      const sizes = [...editor.view.dom.children]
        .filter((node): node is HTMLElement => node instanceof HTMLElement)
        .map(node => node.offsetHeight)

      onUpdateSize(sizes)
    },
    injectCSS: false,
  })

  const [title, setTitle] = useState(initial.title ?? '')

  return (
    <div className={cn(style.pane, { [style.highlighted]: highlighted })}>
      <Textarea
        value={title}
        onChange={bundle(setTitle, onUpdateTitle)}
        placeholder="Title"
        className={style.title}
      />
      <EditorContent editor={editor} lang="en" />
    </div>
  )
}

export default EditorPane
