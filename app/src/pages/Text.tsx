import { useMemo, VFC, CSSProperties, ReactHTML, useState, useRef } from 'react'
import { RouteProps, Redirect } from 'itinero'
import { QueryResult, useQuery } from 'api/hooks'
import Icon from 'components/Icon'
import style from './Text.module.scss'
import { useEffect } from 'preact/hooks'

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
    <div>
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
  const [paneHeights, setPaneHeights] = useState<Record<string, number>>({})
  const textHeight = Math.max(...Object.values(paneHeights))

  const sections = useMemo(
    () =>
      translations.map(({ language, title, content }) => ({
        language,
        title,
        content: [
          ...new DOMParser().parseFromString(content ?? '', 'text/html').body
            .children,
        ],
      })),
    [translations]
  )

  return (
    <article
      className={style.textWrapper}
      style={{ '--tabs': sections.length } as CSSProperties}
      onScroll={({ currentTarget: el }) => {
        const dy = el.scrollTop / (el.scrollHeight - el.offsetHeight)

        const panes = ([...el.children] as HTMLElement[])
          .slice(0, -1)
          .map(v => v.firstChild as HTMLElement)

        panes.forEach(pane => {
          pane.style.transform = `translateY(${
            -dy * (pane.offsetHeight - pane.parentElement!.offsetHeight)
          }px)`
        })
      }}
    >
      {sections.map((pane, column) => (
        <section
          key={pane.language}
          lang={pane.language}
          style={{ '--tab': column } as CSSProperties}
        >
          <Content
            {...pane}
            onHeightChange={height =>
              setPaneHeights(v => ({ ...v, [pane.language]: height }))
            }
          />
        </section>
      ))}
      <div className={style.shadow} style={{ minHeight: `${textHeight}px` }} />
    </article>
  )
}

const Content: VFC<
  Translation & { onHeightChange: (height: number) => void }
> = ({ title, content, onHeightChange }) => {
  const heightCbRef = useRef(onHeightChange)
  heightCbRef.current = onHeightChange

  const observer = useMemo(
    () =>
      new ResizeObserver(([{ contentRect }]) => {
        heightCbRef.current?.(contentRect.height)
      }),
    []
  )

  useEffect(
    () => () => {
      observer.disconnect()
      heightCbRef.current?.(0)
    },
    [observer]
  )

  return (
    <div className={style.content} ref={el => el && observer.observe(el)}>
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
    </div>
  )
}

type Text = Exclude<QueryResult<'getText'>['text'], null | undefined>

type Translation = {
  language: string
  title?: string | null
  content: Element[]
}
