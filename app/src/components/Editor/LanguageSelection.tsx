import { FC, useState } from 'react'
import { LangCode, languageName } from 'util/language'

import style from './LanguageSelection.module.scss'

type Props = {
  languages: LangCode[]
  onHighlight: (lang: LangCode | null) => void
  onMove: (index: number, offset: number) => void
}

const LanguageSelection: FC<Props> = ({ languages, onHighlight, onMove }) => {
  const [offsets, setOffsets] = useState<[left: number[], right: number[]]>()
  const [initialIndex, setInitialIndex] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [initialX, setInitialX] = useState(0)
  const [gap, setGap] = useState(0)

  return (
    <>
      <ol
        className={style.bar}
        onDragStart={e => {
          e.currentTarget.classList.toggle(style.rearrange, true)
          e.dataTransfer.setDragImage(
            document.getElementById(style.shadow)!,
            0,
            0
          )
        }}
        onDragEnd={({ currentTarget }) =>
          currentTarget.classList.toggle(style.rearrange, false)
        }
      >
        {languages.map((code, i) => (
          <li
            key={`${code}-${i}`}
            onMouseEnter={() => onHighlight(code)}
            onMouseLeave={() => onHighlight(null)}
            draggable="true"
            onDragStart={({ currentTarget, clientX }) => {
              currentTarget.classList.toggle(style.dragged, true)
              currentTarget.style.zIndex = '2'

              const items = [...currentTarget.parentElement!.children]
              if (items.length < 2) return

              const ownIndex = items.indexOf(currentTarget)

              const itemBoxes = new Map(
                items.map(item => [item, item.getBoundingClientRect()])
              )

              const gap =
                itemBoxes.get(items[1])!.left - itemBoxes.get(items[0])!.right
              setGap(gap)

              const ownOffset =
                itemBoxes.get(currentTarget)!.width / 2 + gap / 2

              const nextOffsets = [...Array(items.length - 1 - ownIndex)].map(
                (_, i) =>
                  i === 0
                    ? ownOffset
                    : itemBoxes.get(items[ownIndex + i])!.width + gap
              )

              const previousOffsets = [...Array(ownIndex)].map((_, i) =>
                i === 0
                  ? -ownOffset
                  : -(itemBoxes.get(items[ownIndex - i])!.width + gap)
              )

              const offsets = [previousOffsets, nextOffsets].map(offsets =>
                offsets.map((_, i) =>
                  offsets.slice(0, i + 1).reduce((a, c) => a + c, 0)
                )
              ) as [number[], number[]]

              setOffsets(offsets)
              setInitialX(clientX)
              setInitialIndex(ownIndex)
              setCurrentIndex(ownIndex)
            }}
            onDrag={async ({ clientX, currentTarget }) => {
              if (!clientX || !offsets) return

              const dx = clientX - initialX

              const offsetList = offsets[+(dx > 0)]
              const findLastIndex = (offsetList as any).findLastIndex.bind(
                offsetList
              ) as number[]['findIndex']

              const offsetIndex = findLastIndex(v =>
                dx > 0 ? v <= dx : v >= dx
              )

              const index = initialIndex + (offsetIndex + 1) * (dx > 0 ? 1 : -1)

              if (index === currentIndex) return

              setCurrentIndex(index)

              const items = [
                ...currentTarget.parentElement!.children,
              ] as HTMLElement[]

              const elementOffsets = new Map(items.map(item => [item, 0]))

              const { width } = currentTarget.getBoundingClientRect()

              const step = Math.sign(index - initialIndex)
              for (let i = initialIndex + step; i !== index + step; i += step) {
                elementOffsets.set(items[i], (width + gap) * -step)

                elementOffsets.set(
                  currentTarget,
                  elementOffsets.get(currentTarget)! +
                    (items[i].getBoundingClientRect().width + gap) * step
                )
              }

              ;[...elementOffsets].forEach(([element, offset]) => {
                element.style.transform = `translateX(${offset}px)`
              })
            }}
            onDragEnd={async ({ currentTarget }) => {
              ;[...currentTarget.parentElement!.children].forEach(item => {
                item.classList.toggle(style.dragged, false)
              })

              if (initialIndex !== currentIndex)
                onMove(initialIndex, currentIndex - initialIndex)
            }}
          >
            {languageName[code]}
          </li>
        ))}
      </ol>
      <img
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        id={style.shadow}
        alt=""
      />
    </>
  )
}

export default LanguageSelection
