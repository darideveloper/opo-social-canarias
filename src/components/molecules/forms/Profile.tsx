import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'

// Components
import H1 from '../../atoms/H1'
import Input from '../../atoms/Input'
import ButtonAction from '../../atoms/ButtonAction'
import ImageUpload from '../../atoms/ImageUpload'

// Libs
import { getProfile, updateProfile } from '../../../libs/api/profile'

export default function Profile({ className }: { className?: string }) {
  // Data states
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] =
    useState<string>('/user.svg')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Status states
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    profileImage?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  // Track initial values to detect changes
  const [initialValues, setInitialValues] = useState<{
    name: string
    profileImagePreview: string
    newPassword: string
  }>({ name: '', profileImagePreview: '/user.svg', newPassword: '' })

  // Get profile data when loads
  useEffect(() => {
    async function fetchProfile() {
      const { data } = await getProfile()
      const { name, email, profile_img } = data.data
      setName(name)
      setEmail(email)
      setProfileImagePreview(profile_img)
      // Set initial values for change detection
      setInitialValues({ name, profileImagePreview: profile_img, newPassword: '' })
    }
    fetchProfile()
  }, [])

  // Detect changes in for to show save button
  useEffect(() => {

    // Skip if not data from api yet
    if (!initialValues.name) return

    console.log({ name, profileImagePreview, newPassword, initialValues })

    setHasChanges(
      name !== initialValues.name ||
      profileImagePreview !== initialValues.profileImagePreview ||
      newPassword !== initialValues.newPassword
    )
    console.log("hasChanges", hasChanges)
  }, [name, profileImage, newPassword])

  function handleImageChange(file: File | null, preview: string) {
    setProfileImage(file)
    if (preview) setProfileImagePreview(preview)
  }

  function validate() {
    const next: {
      name?: string
      profileImage?: string
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!name) {
      next.name = 'El nombre es obligatorio'
    }

    // Validate password only if attempting to change it
    const wantsPasswordChange =
      newPassword.length > 0 || confirmPassword.length > 0
    if (wantsPasswordChange) {
      if (!newPassword) {
        next.newPassword = 'La nueva contraseña es obligatoria'
      } else if (newPassword.length < 8) {
        next.newPassword = 'La contraseña debe tener al menos 8 caracteres'
      }
      if (!confirmPassword) {
        next.confirmPassword = 'Confirma tu nueva contraseña'
      } else if (newPassword !== confirmPassword) {
        next.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const { statusCode } = await updateProfile(
        name,
        newPassword,
        profileImage
      )
      if (statusCode === 200) {
        toast.success('Perfil actualizado correctamente')

        // Refetch profile to get the actual saved values from the server
        const { data } = await getProfile()
        const { name: savedName, profile_img: savedProfileImg } = data.data

        // Update state with saved values
        setName(savedName)
        setProfileImagePreview(savedProfileImg)

        // Update initial values to reflect saved state
        setInitialValues({
          name: savedName,
          profileImagePreview: savedProfileImg,
          newPassword: '',
        })

        // Clear password fields
        setNewPassword('')
        setConfirmPassword('')
        // Reset image upload state
        setProfileImage(null)
      } else {
        toast.error('No se pudo actualizar el perfil. Intenta más tarde.')
      }
    } catch {
      toast.error('No se pudo actualizar el perfil. Intenta más tarde.')
    } finally {
      setIsLoading(false)
    }
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
        'my-10',
        className
      )}
    >
      <div className={clsx('card', 'bg-base-100', 'shadow-md')}>
        <div className={clsx('card-body', 'gap-3')}>
          {/* Header */}
          <div className={clsx('text-center', 'mb-1')}>
            <H1>Perfil</H1>
            <p className={clsx('text-sm', 'opacity-70')}>
              Actualiza tu información personal.
            </p>
          </div>

          {/* Name */}
          <Input
            name='name'
            type='text'
            label='Nombre'
            placeholder='Tu nombre'
            value={name}
            onChange={setName}
            error={errors.name}
            autoComplete='name'
            required
          />

          {/* Email (read-only) */}
          <Input
            name='email'
            type='email'
            label='Correo electrónico (no editable)'
            placeholder={email}
            value={email}
            onChange={() => {}}
            error={undefined}
            autoComplete='email'
            disabled
          />

          {/* Profile Image */}
          <ImageUpload
            name='profileImage'
            label='Imagen de perfil'
            defaultPreview={profileImagePreview}
            onChange={handleImageChange}
            error={errors.profileImage}
          />

          {/* Password change (optional) */}
          <Input
            name='newPassword'
            type='password'
            label='Nueva contraseña (opcional)'
            placeholder='Mínimo 8 caracteres'
            value={newPassword}
            onChange={setNewPassword}
            error={errors.newPassword}
            autoComplete='new-password'
          />

          <Input
            name='confirmPassword'
            type='password'
            label='Confirmar nueva contraseña'
            placeholder='Repite la nueva contraseña'
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            autoComplete='new-password'
          />

          {/* Save button */}
          <div className={clsx('card-actions', 'mt-2', 'w-full')}>
            <ButtonAction
              type='submit'
              isSoft
              className={clsx('w-full')}
              disabled={!hasChanges}
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </ButtonAction>
          </div>
        </div>
      </div>
    </form>
  )
}
