import { clsx } from 'clsx'
import ButtonBase from './base/ButtonBase'

export default function ButtonAction({
  isSoft = false,
  href,
  className = '',
  children,
}: {
  isSoft?: boolean
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
    >
      <ButtonBase
        isSoft={isSoft}
        className={clsx(className)}
      >
        {children}
      </ButtonBase>
    </a>
  )
}
