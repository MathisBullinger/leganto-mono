import type { FC, ReactNode } from 'react'
import style from './Button.module.scss'
import cn from 'util/css'

type Props = {
  children?: ReactNode
  className?: string
  link?: string
}

const Button: FC<Props> = ({ children, className, link }) => {
  const isLink = typeof link === 'string'
  const Tag = isLink ? 'a' : 'button'

  return (
    <Tag
      className={cn(style.button, className)}
      {...(isLink ? { href: link } : {})}
    >
      {children}
    </Tag>
  )
}

export default Button
