import type { VFC } from 'react'
import cn from 'util/css'
import style from './Icon.module.scss'

const Icon: VFC<{ type: keyof typeof icons; className?: string }> = ({
  type,
  className,
}) => {
  return (
    <svg
      viewBox={`0 0 ${vpSize} ${vpSize}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(style.icon, className)}
      data-icon={type}
    >
      {icons[type]}
    </svg>
  )
}

export default Icon

const vpSize = 100

const icons = {
  loadingDots: (
    <g>
      <circle r={vpSize / 10} cx={vpSize / 10} cy={vpSize / 2} />
      <circle r={vpSize / 10} cx={vpSize / 2} cy={vpSize / 2} />
      <circle r={vpSize / 10} cx={(vpSize / 10) * 9} cy={vpSize / 2} />
    </g>
  ),
}
