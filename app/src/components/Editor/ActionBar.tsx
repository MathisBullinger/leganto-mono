import { FC, useState, useEffect } from 'react'
import Button from 'components/Button'
import Icon from 'components/Icon'
import style from './ActionBar.module.scss'

type Props = {
  hasChanged?: boolean
  isSaving?: boolean
}

const ActionBar: FC<Props> = ({ hasChanged, isSaving }) => {
  const [showStatusLabel, setShowStatusLabel] = useState(false)

  useEffect(() => {
    if (!hasChanged && !isSaving) {
      return setShowStatusLabel(false)
    }

    setShowStatusLabel(true)

    const toId = setTimeout(() => {
      setShowStatusLabel(false)
    }, 2000)

    return () => clearTimeout(toId)
  }, [isSaving, hasChanged])

  const statusLabel = isSaving ? 'saving changes' : 'changes saved'

  return (
    <div className={style.actionBar}>
      <div className={style.status}>
        <Icon type={isSaving ? 'loadingDots' : 'check'} label={statusLabel} />
        {showStatusLabel && <span>{statusLabel}</span>}
      </div>
      {hasChanged && <Button>Publish</Button>}
    </div>
  )
}

export default ActionBar
