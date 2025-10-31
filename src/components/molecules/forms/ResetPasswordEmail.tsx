// Hooks
import { useState } from 'react'

// Libs
import { clsx } from 'clsx'
import { requestResetPasswordEmail } from '../../../libs/api/reset'

// Components
import Input from '../../atoms/Input'
import ButtonLink from '../../atoms/ButtonLink'
import ButtonAction from '../../atoms/ButtonAction'
import H1 from '../../atoms/H1'

export default function ResetPasswordEmail({
  className,
}: {
  className?: string
}) {
  // States
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [success, setSuccess] = useState(false)

  // Functions
  function validate() {
    const next: { email?: string } = {}
    if (!email) next.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Por favor ingresa un email válido'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      requestResetPasswordEmail(email)
      setSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className={clsx(
          'w-full',
          'max-w-lg',
          'mx-auto',
          'bg-base-100',
          'shadow-md',
          className
        )}
      >
        <div className={clsx('card', 'bg-base-100', 'shadow-md')}>
          <div className={clsx('card-body')}>
            <div className={clsx('text-center', 'mb-1')}>
              <H1 className=''>Email Enviado</H1>
              <p className={clsx('text-sm', 'opacity-70', 'mt-3', '!mb-0')}>
                Hemos enviado un enlace de recuperación a tu correo electrónico.
                Por favor revisa tu bandeja de entrada.
              </p>
            </div>
            <div
              className={clsx(
                'card-actions',
                'mt-2',
                'w-full',
                'flex',
                'justify-center'
              )}
            >
              <ButtonLink
                href='/login'
                isSoft
                className={clsx()}
              >
                Volver al inicio de sesión
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        'w-full',
        'max-w-lg',
        'mx-auto',
        'bg-base-100',
        'shadow-md',
        className
      )}
    >
      <div className={clsx('card', 'bg-base-100', 'shadow-md')}>
        <div className={clsx('card-body', 'gap-3')}>
          {/* Header */}
          <div className={clsx('text-center', 'mb-1')}>
            <H1 className=''>Restablecer Contraseña</H1>
            <p className={clsx('text-sm', 'opacity-70')}>
              Ingresa tu email y te enviaremos un enlace para restablecer tu
              contraseña.
            </p>
          </div>

          {/* Email input */}
          <Input
            name='email'
            type='email'
            label='Email'
            placeholder='tu@email.com'
            value={email}
            onChange={setEmail}
            error={errors.email}
            autoComplete='email'
            required
          />

          {/* Button */}
          <div className={clsx('card-actions', 'mt-2', 'w-full')}>
            <ButtonAction
              type='submit'
              isSoft
              className={clsx('w-full')}
            >
              {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </ButtonAction>
          </div>

          <p className={clsx('text-center', 'text-sm', 'mt-1')}>
            ¿Recordaste tu contraseña?{' '}
            <a
              href='/login'
              className={clsx('link', 'link-hover')}
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </form>
  )
}
