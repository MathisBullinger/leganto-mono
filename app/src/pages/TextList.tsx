import type { VFC } from 'react'
import { Redirect, RouteProps, Link } from 'itinero'
import { filterCodes, LangCode } from 'util/language'
import LanguageBar from 'components/LanguageBar'
import Helmet from 'react-helmet'
import { useQuery, QueryResult } from 'api/hooks'
import style from './TextList.module.scss'

type Props = RouteProps<{}, { lang: string }>

const TextListWrapper: VFC<Props> = ({ match, location: { path } }) => {
  const { langs, redirect } = useLanguageCodes(match.lang)

  if (redirect) return <Redirect to={path.replace(match.lang, redirect)} />
  return <LanguageList langs={langs} />
}

export default TextListWrapper

function useLanguageCodes(langStr: string): {
  langs: LangCode[]
  redirect?: string
} {
  const parts = langStr.split('/').filter(Boolean)
  const lower = parts.map(part => part.toLocaleLowerCase())

  const [langs, invalid] = filterCodes(lower)
  const result: ReturnType<typeof useLanguageCodes> = { langs }

  if (
    invalid.length ||
    new Set(lower).size !== lower.length ||
    parts.some((v, i) => v !== langs[i])
  )
    result.redirect = langs.join('/')

  return result
}

const LanguageList: VFC<{ langs: LangCode[] }> = ({ langs }) => {
  const [data] = useQuery('listTexts', { languages: langs as any })

  return (
    <div className={style.page}>
      <Helmet>
        <title>Leganto - {langs.join(' | ')}</title>
      </Helmet>
      {data?.texts?.length && <TextList texts={data.texts} langs={langs} />}
      {/* <LanguageBar langs={langs} /> */}
    </div>
  )
}

const TextList: VFC<{ texts: Text[]; langs: LangCode[] }> = ({
  texts,
  langs,
}) => {
  return (
    <ul className={style.list}>
      {texts.map(({ id, translations }) => (
        <li key={id}>
          <Link to={`/text/${langs.join('/')}/${id}`}>
            {translations.map(({ language, title }) => (
              <span key={language}>{title}</span>
            ))}
          </Link>
        </li>
      ))}
    </ul>
  )
}

type Text = QueryResult<'listTexts'>['texts'][number]
