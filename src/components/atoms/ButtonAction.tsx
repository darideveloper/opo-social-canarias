import { clsx } from 'clsx'
import ButtonBase from './base/ButtonBase'

export default function ButtonAction({
  isSoft = false,
  type = 'button',
  className = '',
  onClick = () => {},
  children,
}: {
  isSoft?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={clsx(className)}
    >
      <ButtonBase
        isSoft={isSoft}
        className={clsx('w-full')}
      >
        {children}
      </ButtonBase>
    </button>
  )
}
