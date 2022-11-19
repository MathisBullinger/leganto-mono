import type { VFC } from 'react'
import cn from 'util/css'
import style from './Icon.module.scss'

const Icon: VFC<{
  type: keyof typeof icons
  className?: string
  label?: string
}> = ({ type, className, label }) => {
  return (
    <svg
      viewBox={`0 0 ${vpSize} ${vpSize}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(style.icon, className)}
      data-icon={type}
    >
      {!!label && <title>{label}</title>}
      {icons[type]}
    </svg>
  )
}

export default Icon

const vpSize = 100

const normalizePath = (path: string, size: number) =>
  path.replace(/[0-9.]+/g, n => ((parseFloat(n) / size) * vpSize).toString())

const icons = {
  loadingDots: (
    <g>
      <circle r={vpSize / 10} cx={vpSize / 10} cy={vpSize / 2} />
      <circle r={vpSize / 10} cx={vpSize / 2} cy={vpSize / 2} />
      <circle r={vpSize / 10} cx={(vpSize / 10) * 9} cy={vpSize / 2} />
    </g>
  ),
  check: (
    <path
      d={normalizePath(
        'M18.9 35.7 7.7 24.5l2.15-2.15 9.05 9.05 19.2-19.2 2.15 2.15Z',
        48
      )}
    />
  ),
}
