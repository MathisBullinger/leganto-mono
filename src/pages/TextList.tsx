import type { VFC } from 'react'
import { Redirect, RouteProps } from 'itinero'
import { filterCodes, LangCode } from 'utils/language'
import LanguageBar from 'components/LanguageBar'

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
  return (
    <div>
      {langs.join(', ')}
      <LanguageBar langs={langs} />
    </div>
  )
}
