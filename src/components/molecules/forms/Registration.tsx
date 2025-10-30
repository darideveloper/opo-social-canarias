import { useState } from 'react'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'
import { signUp } from '../../../libs/api/signUp'
import Input from '../../atoms/Input'
import ButtonAction from '../../atoms/ButtonAction'
import H1 from '../../atoms/H1'
import ImageUpload from '../../atoms/ImageUpload'

type RegistrationProps = {
  onSubmit?: (payload: {
    name: string
    email: string
    profileImage: File | null
    password: string
  }) => void
  className?: string
}

export default function RegistrationForm({
  onSubmit,
  className,
}: RegistrationProps) {
  // States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [passwordValidation, setPasswordValidation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    profileImage?: string
    password?: string
    passwordValidation?: string
  }>({})

  // Functions
  function validate() {
    const next: {
      name?: string
      email?: string
      profileImage?: string
      password?: string
      passwordValidation?: string
    } = {}

    if (!name) next.name = 'El nombre es obligatorio'
    if (!email) next.email = 'El email es obligatorio'
    
    // Email format validation
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      next.email = 'Por favor, ingresa un email válido'
    }
    
    if (!password) next.password = 'La contraseña es obligatoria'
    if (password && password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres'
    if (!passwordValidation)
      next.passwordValidation = 'Debes confirmar tu contraseña'
    if (password && passwordValidation && password !== passwordValidation) {
      next.passwordValidation = 'Las contraseñas no coinciden'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleImageChange(file: File | null, preview: string) {
    setProfileImage(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      // Sign up
      const { data, statusCode } = await signUp(email, password, name, profileImage || undefined)
      
      if (statusCode === 201 || statusCode === 200) {
        // Success - matches test expectation
        toast.success('¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta')
        setTimeout(() => {
          window.location.href = '/login'
        }, 5000)
      } else if (statusCode === 400) {
        // Bad request - could be validation error
        let errorMessage = 'Error al registrar'
        
        // Check for email validation errors
        if (data?.data?.email && Array.isArray(data.data.email)) {
          // Handle error structure with data.data.email array
          const emailError = data.data.email[0]
          if (emailError === 'duplicated_email') {
            errorMessage = 'El email ya está registrado'
          } else {
            errorMessage = emailError
          }
        } else if (data?.email) {
          errorMessage = Array.isArray(data.email) ? data.email[0] : data.email
        } else if (data?.message) {
          errorMessage = data.message
          // Check if it's the specific email validation message
          if (errorMessage.includes('email') && errorMessage.includes('válid')) {
            errorMessage = 'Por favor, ingresa un email válido'
          }
        }
        
        toast.error(errorMessage)
      } else if (statusCode === 409) {
        // Conflict - email already exists - matches test expectation
        toast.error('El email ya está registrado')
      } else {
        // Other errors
        const errorMessage = data?.message || 'Error al registrar'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Error al registrar. Intenta más tarde')
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
            <H1 className=''>Registro</H1>
            <p className={clsx('text-sm', 'opacity-70')}>Crea tu cuenta.</p>
          </div>

          {/* Name input */}
          <Input
            name='name'
            type='text'
            label='Nombre'
            placeholder='John Doe'
            value={name}
            onChange={setName}
            error={errors.name}
            autoComplete='name'
            required
          />

          {/* Email input */}
          <Input
            name='email'
            type='email'
            label='Correo electrónico'
            placeholder='tu@email.com'
            value={email}
            onChange={setEmail}
            error={errors.email}
            autoComplete='email'
            required
          />

          {/* Password input */}
          <Input
            name='password'
            type='password'
            label='Contraseña'
            placeholder='Mínimo 8 caracteres'
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete='new-password'
            required
          />

          {/* Password validation input */}
          <Input
            name='passwordValidation'
            type='password'
            label='Confirma tu contraseña'
            placeholder='Repite tu contraseña'
            value={passwordValidation}
            onChange={setPasswordValidation}
            error={errors.passwordValidation}
            autoComplete='new-password'
            required
          />

          {/* Profile Image input */}
          <ImageUpload
            name='profileImage'
            label='Imagen de perfil'
            defaultPreview='/user.svg'
            onChange={handleImageChange}
            error={errors.profileImage}
          />

          {/* Button */}
          <div className={clsx('card-actions', 'mt-2', 'w-full')}>
            <ButtonAction
              type='submit'
              isSoft
              className={clsx('w-full')}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </ButtonAction>
          </div>

          <p className={clsx('text-center', 'text-sm', 'mt-1')}>
            ¿Ya tienes una cuenta?{' '}
            <a
              href='/login'
              className={clsx('link', 'link-hover')}
            >
              Inicia Sesión
            </a>
          </p>
        </div>
      </div>
    </form>
  )
}
