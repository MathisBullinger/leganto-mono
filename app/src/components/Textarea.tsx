import { FC, HTMLProps, useState } from 'react'
import cn from 'util/css'
import style from './Textarea.module.scss'

type Props = {
  value: string
  onChange(value: string): void
}

const Textarea: FC<
  Omit<HTMLProps<HTMLTextAreaElement>, keyof Props> & Props
> = ({ value, onChange, className, ...props }) => {
  const [rows, setRows] = useState(1)

  const handleChange = (text: string) => {
    setRows((text.match(/\n/g)?.length ?? 0) + 1)
    onChange(text)
  }

  return (
    <textarea
      {...props}
      className={cn(style.textArea, className)}
      value={value}
      onChange={({ target }) => handleChange(target.value)}
      rows={rows}
    />
  )
}

export default Textarea
