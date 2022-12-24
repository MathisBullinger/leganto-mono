import { useMemo, VFC, CSSProperties, ReactHTML } from 'react'
import { RouteProps, Redirect } from 'itinero'
import { QueryResult, useQuery } from 'api/hooks'
import Icon from 'components/Icon'
import style from './Text.module.scss'

const TextWrapper: VFC<RouteProps<{}, { id: string; lang: string }>> = ({
  match,
}) => {
  const languages = useMemo(
    () => match.lang.split('/').filter(Boolean),
    [match.lang]
  )

  const [data, loading] = useQuery('getText', {
    textId: match.id,
    languages: languages as any,
  })

  return (
    <div className={style.page}>
      {loading ? (
        <Icon type="loadingDots" />
      ) : !data?.text ? (
        <Redirect to="/" />
      ) : (
        <TextView {...data.text} />
      )}
    </div>
  )
}

export default TextWrapper

const TextView: VFC<Text> = ({ translations }) => {
  const sections = translations.map(({ language, title, content }) => ({
    language,
    title,
    content: [
      ...new DOMParser().parseFromString(content ?? '', 'text/html').body
        .children,
    ],
  }))

  return (
    <article
      className={style.textWrapper}
      style={{ '--columns': sections.length } as CSSProperties}
    >
      {sections.map(({ language, title, content }, column) => (
        <section
          key={language}
          lang={language}
          style={{ '--column': column } as CSSProperties}
        >
          <h1 style={{ '--row': 0 } as CSSProperties}>{title}</h1>
          {content.map(({ tagName, innerHTML }, i) => {
            const Tag = tagName.toLowerCase() as keyof ReactHTML

            return (
              <Tag
                key={i}
                style={{ '--row': i + 2 } as CSSProperties}
                dangerouslySetInnerHTML={{ __html: innerHTML }}
              />
            )
          })}
        </section>
      ))}
    </article>
  )
}

// const useText = ()

type Text = Exclude<QueryResult<'getText'>['text'], null | undefined>
