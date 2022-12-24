import { useEffect, useMemo } from 'react'

export const useRowHighlight = (index: number | null) => {
  const stylesheet = useMemo(() => document.createElement('style'), [])

  useEffect(() => {
    document.body.appendChild(stylesheet)
    return () => stylesheet.remove()
  }, [stylesheet])

  useEffect(() => {
    while (stylesheet.sheet?.cssRules.length) stylesheet.sheet.deleteRule(0)
    if (index === null) return

    const rule = `.ProseMirror > *:nth-child(${
      index + 1
    })::before {${highlightStyle}}`

    stylesheet.sheet?.insertRule(rule)
  }, [index, stylesheet])
}

const highlightStyle = `
  content: '';
  position: absolute;
  display: block;
  z-index: -1;
  pointer-events: none;
  --padd-vert: 0.3em;
  --padd-hori: 0.5em;
  left: calc(var(--padd-hori) * -1);
  top: calc(var(--padd-vert) * -1);
  width: calc(100% + var(--padd-hori) * 2);
  height: calc(100% + var(--padd-vert) * 2);
  border-radius: 0.5em;
  background-color: var(--row-highlight-color);
`
  .split('\n')
  .map(v => v.trim())
  .join('')
