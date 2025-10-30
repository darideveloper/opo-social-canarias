// Hooks
import { useState, useEffect } from 'react'

// Libs
import { toast } from 'react-toastify'
import { activate } from '../../../libs/api/activate'
import { clsx } from 'clsx'

// Components
import ButtonLink from '../../atoms/ButtonLink'

// Types
type ActivateProps = {
  token?: string
}

export default function Activate({ token = '' }: ActivateProps) {
  // States
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )

  // Validate token
  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus('error')
        toast.error('Token de activación no válido')
        return
      }

      try {
        const response = await activate(token)

        if (response.statusCode === 200) {
          setStatus('success')
          toast.success('¡Cuenta activada exitosamente!')
        } else {
          setStatus('error')
          toast.error(
            'Error al activar la cuenta. Intenta registrarte nuevamente.'
          )
        }
      } catch (error) {
        setStatus('error')
        toast.error('Error de conexión. Intenta más tarde.')
      }
    }

    activateAccount()
  }, [token])

  // No render, just show toasts messages
  return (
    <>
      {status == 'loading' ? (
        <span
          className={clsx(
            'loading',
            'loading-dots',
            'loading-xl',
            'text-secondary'
          )}
        />
      ) : (
        <ButtonLink href={status === 'success' ? '/login' : '/sign-up'} isSoft={status === 'success'}>
          {status === 'success' ? 'Ir a Login' : 'Ir a Registro'}
        </ButtonLink>
      )
    }
    </>
  )
}
