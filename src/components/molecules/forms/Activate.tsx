// Hooks
import { useState, useEffect } from 'react'

// Libs
import { toast } from 'react-toastify'
import { activate } from '../../../libs/api/activate'

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
    console.log('token', token)
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

  // Direct after validate token
  useEffect(() => {
    console.log('status', status)
    // Redirect to login page or register page
    setTimeout(() => {
      if (status === 'success') {
        window.location.href = '/login'
      } else {
        window.location.href = '/sign-up'
      }
    }, 6000)
  }, [status])

  // No render, just show toasts messages
  return <></>
}
