import type { VFC } from 'react'
import type { RouteProps } from 'itinero'
import Helmet from 'react-helmet'
import EditorView from 'components/Editor/Editor'
import style from './Editor.module.scss'

const Editor: VFC<RouteProps> = ({ match: { id } }) => {
  return (
    <div className={style.page}>
      <Helmet>
        <title>Edit | Leganto</title>
      </Helmet>
      <EditorView />
    </div>
  )
}

export default Editor
