import { clsx } from 'clsx'
import ButtonBase from './base/ButtonBase'

export default function ButtonAction({
  isSoft = false,
  type = 'button',
  className = '',
  onClick = () => {},
  children,
  disabled = false,
}: {
  isSoft?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
}) {
  console.log("disabled button action", disabled)
  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={clsx(className)}
      disabled={disabled}
    >
      <ButtonBase
        isSoft={isSoft}
        className={clsx('w-full')}
        disabled={disabled}
      >
        {children}
      </ButtonBase>
    </button>
  )
}
