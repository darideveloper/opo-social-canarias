import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Card from '../ui/Card'
import CardHeader from '../ui/CardHeader'
import CardContent from '../ui/CardContent'
import Button from '../ui/Button'
import Toaster from '../ui/Toaster'
import { authService } from '../../lib/auth'

interface ResetPasswordTokenPageProps {
  token: string
}

type ResetStatus = 'form' | 'error'

export default function ResetPasswordTokenPage({
  token,
}: ResetPasswordTokenPageProps) {
  const [status, setStatus] = useState<ResetStatus>('form')
  const [errorMessage, setErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!password) {
      toast.error('Por favor ingresa tu nueva contraseña')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
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

  const handleGoToLogin = () => {
    window.location.href = '/login'
  }

  const handleRetry = () => {
    window.location.href = '/reset-password'
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
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-foreground mb-2'
                >
                  Nueva Contraseña
                </label>
                <input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Mínimo 6 caracteres'
                  className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                  disabled={isSubmitting}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-foreground mb-2'
                >
                  Confirmar Contraseña
                </label>
                <input
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Repite tu nueva contraseña'
                  className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                  disabled={isSubmitting}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 mr-2 animate-spin'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    Restableciendo...
                  </div>
                ) : (
                  'Restablecer Contraseña'
                )}
              </Button>
            </form>

             <div className='mt-6 space-y-2'>
               <div className='text-center'>
                 <button
                   onClick={handleGoToLogin}
                   className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                 >
                   ¿Recordaste tu contraseña? Inicia sesión
                 </button>
               </div>
               <div className='text-center'>
                 <button
                   onClick={handleRetry}
                   className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                 >
                   Solicitar nuevo enlace de restablecimiento
                 </button>
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
              <Button
                onClick={handleRetry}
                className='flex-1'
                variant='outline'
              >
                Solicitar Nuevo Enlace
              </Button>
              <Button
                onClick={handleGoToLogin}
                className='flex-1'
              >
                Ir al Login
              </Button>
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
        <CardContent className='text-center'>
          <div className='space-y-4'>{renderContent()}</div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
