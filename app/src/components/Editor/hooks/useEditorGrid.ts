import { useMemo, useState, useCallback } from 'react'

export const useEditorGrid = (columns: HTMLElement[]) => {
  const [cssRows, setCSSRows] = useState<string>()
  const columnSizes = useMemo(
    () => new Map<HTMLElement, Map<HTMLElement, number>>(),
    []
  )

  const calcCssRows = useCallback(() => {
    const columnNodes = new Map(
      [...columnSizes.keys()].map(v => [v, [...v.children] as HTMLElement[]])
    )
    const columns = [...columnSizes].map(([column, sizes]) =>
      [...sizes]
        .sort(
          ([a], [b]) =>
            columnNodes.get(column)!.indexOf(a) -
            columnNodes.get(column)!.indexOf(b)
        )
        .map(([, size]) => size)
    )

    const rowCount = Math.max(...columns.map(column => column.length))
    const rowHeights = [...Array(rowCount)].map((_, i) =>
      Math.max(...columns.map(column => column[i] ?? 0))
    )
    setCSSRows(rowHeights.map(n => `minmax(${n}px, min-content)`).join(' '))
  }, [columnSizes])

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver(entries => {
        for (const entry of entries) {
          const map = columnSizes.get(entry.target.parentElement!)
          if (!map) continue
          map.set(entry.target as HTMLElement, entry.contentRect.height)
        }
        calcCssRows()
      }),
    [columnSizes, calcCssRows]
  )

  const mutationObserver = useMemo(
    () =>
      new MutationObserver(mutations => {
        const isHTMLElement = (node: unknown): node is HTMLElement =>
          node instanceof HTMLElement

        const added = mutations
          .flatMap(v => [...v.addedNodes])
          .filter(isHTMLElement)
        const removed = mutations
          .flatMap(v => [...v.removedNodes])
          .filter(isHTMLElement)

        added.forEach(node => resizeObserver.observe(node))
        removed.forEach(node => {
          resizeObserver.unobserve(node)
          for (const [, nodes] of columnSizes) nodes.delete(node)
        })
        if (!added.length) calcCssRows()
      }),
    [resizeObserver, columnSizes, calcCssRows]
  )

  const [observedColumns, setObservedColumns] = useState(new Set<HTMLElement>())
  const unobserved = columns.filter(column => !observedColumns.has(column))

  const observeColumn = (column: HTMLElement) => {
    mutationObserver.observe(column, { childList: true })
    setObservedColumns(v => new Set([...v, column]))
    const children = [...column.children] as HTMLElement[]
    columnSizes.set(column, new Map())
    children.forEach(node => resizeObserver.observe(node))
  }

  if (unobserved.length) {
    unobserved.forEach(observeColumn)
    calcCssRows()
  }

  return cssRows
}
