import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardContent } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Label from '../ui/Label'
import Link from '../ui/Link'
import { FormField } from '../ui/Form'
import Toaster from '../ui/Toaster'
import { authService } from '../../lib/auth'

interface ResetPasswordFormProps {
  token: string
}

type ResetStatus = 'form' | 'error'

export default function ResetPasswordForm({
  token,
}: ResetPasswordFormProps) {
  const [status, setStatus] = useState<ResetStatus>('form')
  const [errorMessage, setErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token de restablecimiento no válido')
      return
    }

    // Show form immediately - token validation will happen on submit
    setStatus('form')
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setConfirmPasswordError('')

    if (!password) {
      setPasswordError('Por favor ingresa tu nueva contraseña')
      return
    }

    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authService.resetPasswordWithToken(token, password)

      if (response.status === 'ok') {
        toast.success(
          response.message || 'Contraseña restablecida exitosamente'
        )
        // Reset form after successful password reset
        setPassword('')
        setConfirmPassword('')
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        toast.error(
          'Error al restablecer la contraseña. Intenta más tarde o solicita un nuevo enlace de restablecimiento.'
        )
      }
    } catch (error) {
      toast.error(
        'Error al restablecer la contraseña. Intenta más tarde o solicita un nuevo enlace de restablecimiento.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  const renderContent = () => {
    switch (status) {
      case 'form':
        return (
          <>
            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <FormField
                label="Nueva Contraseña"
                error={passwordError}
                required
              >
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Mínimo 6 caracteres'
                  disabled={isSubmitting}
                  error={!!passwordError}
                  required
                  minLength={6}
                />
              </FormField>

              <FormField
                label="Confirmar Contraseña"
                error={confirmPasswordError}
                required
              >
                <Input
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Repite tu nueva contraseña'
                  disabled={isSubmitting}
                  error={!!confirmPasswordError}
                  required
                  minLength={6}
                />
              </FormField>

              <Button
                type='submit'
                className='w-full'
                loading={isSubmitting}
                loadingText="Restableciendo..."
              >
                Restablecer Contraseña
              </Button>
            </form>

             <div className='mt-6 space-y-2'>
               <div className='text-center'>
                 <Link href="/login" variant="muted">
                   ¿Recordaste tu contraseña? Inicia sesión
                 </Link>
               </div>
               <div className='text-center'>
                 <Link href="/reset-password" variant="muted">
                   Solicitar nuevo enlace de restablecimiento
                 </Link>
               </div>
             </div>
          </>
        )

      case 'error':
        return (
          <div className='text-center'>
            <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <p className='text-lg text-foreground'>Algo salió mal</p>
            <p className='text-sm text-muted-foreground mt-2'>
              {errorMessage ||
                'Hubo un problema al restablecer tu contraseña. Por favor, intenta nuevamente solicitando un nuevo enlace de restablecimiento.'}
            </p>
            <div className='flex gap-2 mt-4'>
              <Link
                href="/reset-password"
                variant="muted"
                className='flex-1 text-center py-2 px-4 border border-input rounded-md hover:bg-accent'
              >
                Solicitar Nuevo Enlace
              </Link>
              <Link
                href="/login"
                variant="muted"
                className='flex-1 text-center py-2 px-4 bg-primary text-primary-foreground rounded-md border border-primary hover:bg-transparent hover:text-primary hover:border-primary'
              >
                Ir al Login
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <Card>
        <CardHeader className='text-center'>
          <h1 className='text-2xl font-headline font-semibold leading-none tracking-tight'>
            Restablecer Contraseña
          </h1>
          <p className='text-sm text-muted-foreground'>
            {status === 'form' && 'Ingresa tu nueva contraseña'}
            {status === 'error' &&
              'Se encontró un problema durante el proceso.'}
          </p>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>{renderContent()}</div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
