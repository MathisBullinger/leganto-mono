import type { FC, HTMLProps, ReactNode } from 'react'
import style from './Button.module.scss'
import cn from 'util/css'

type Props = {
  children?: ReactNode
  link?: string
} & HTMLProps<HTMLButtonElement | HTMLAnchorElement>

const Button: FC<Props> = ({ children, className, link, ...props }) => {
  const isLink = typeof link === 'string'
  const Tag = isLink ? 'a' : 'button'

  return (
    <Tag
      {...(props as any)}
      className={cn(style.button, className)}
      {...(isLink ? { href: link } : {})}
    >
      {children}
    </Tag>
  )
}

export default Button
