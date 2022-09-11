import { FC, useState } from 'react'
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
import style from './EditorPane.module.scss'

type Props = {
  language: LangCode
}

const EditorPane: FC<Props> = () => {
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
      console.log(editor.getJSON())
    },
    injectCSS: false,
  })

  const [title, setTitle] = useState('')

  return (
    <div className={style.pane}>
      <Textarea
        value={title}
        onChange={setTitle}
        placeholder="Title"
        className={style.title}
      />
      <EditorContent editor={editor} lang="en" />
    </div>
  )
}

export default EditorPane
