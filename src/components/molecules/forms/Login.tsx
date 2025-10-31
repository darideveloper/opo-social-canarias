// Libs
import { clsx } from 'clsx'
import { login } from '../../../libs/api/login'
import { toast } from 'react-toastify'

// Hooks
import React, { useState } from 'react'

// Components
import Input from '../../atoms/Input'
import ButtonAction from '../../atoms/ButtonAction'
import H1 from '../../atoms/H1'

export default function Forms({ className }: { className?: string }) {
  // States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )

  // Functions
  function validate() {
    const next: { email?: string; password?: string } = {}
    if (!email) next.email = 'El email es obligatorio'
    if (!password) next.password = 'La contraseña es obligatoria'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      setIsLoading(true)

      // Login
      const { data, statusCode } = await login(email, password)

      if (statusCode == 200) {
        // Direct to dashboard
        window.location.href = '/dashboard'
      } else {
        toast.error('La combinación de credenciales no tiene una cuenta activa')
      }

      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
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
            <H1 className=''>Iniciar Sesión</H1>
            <p className={clsx('text-sm', 'opacity-70')}>
              Accede a tu panel de control.
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

          {/* Passoword extra lavel */}
          <label className={clsx('label', 'justify-between', 'pt-0')}>
            <span className='label-text'>Contraseña</span>
            <a
              href='/reset-password'
              className={clsx('label-text-alt', 'link', 'link-hover')}
              tabIndex={-1}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </label>

          {/* Password input */}
          <Input
            name='password'
            type='password'
            placeholder='Contraseña'
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete='current-password'
            required
          />

          {/* Button */}
          <div className={clsx('card-actions', 'mt-2', 'w-full')}>
            <ButtonAction
              type='submit'
              isSoft
              className={clsx('w-full')}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </ButtonAction>
          </div>

          <p className={clsx('text-center', 'text-sm', 'mt-1')}>
            ¿No tienes una cuenta?&nbsp;
            <a
              href='/sign-up'
              className={clsx('link', 'link-hover')}
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </form>
  )
}
