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
import style from './Editor.module.scss'
import Textarea from 'components/Textarea'

const EditorWrapper: FC = () => {
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
    injectCSS: false,
  })

  const [title, setTitle] = useState('')

  return (
    <div className={style.wrapper}>
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

export default EditorWrapper
