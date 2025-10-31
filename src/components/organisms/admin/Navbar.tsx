// Icons
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'

// Libs
import { clsx } from 'clsx'
import { getProfile } from '../../../libs/api/profile'

// Hooks
import { useEffect, useState } from 'react'

export default function AdminNavbar() {
  const drawerId = 'admin-drawer'


  // Profile data states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Get profile data when loads
  useEffect(() => {
    async function fetchProfile() {
      const { data, statusCode } = await getProfile()
      const { profile_img, name, email } = data.data
      if (statusCode === 200) {
        setAvatarUrl(profile_img)
        setUserName(name)
        setUserEmail(email)
      } else {
        // Redirect to logout
        window.location.href = '/logout'
      }
    }
    fetchProfile()
  }, [])


  return (
    <nav className={clsx('navbar', 'bg-base-100', 'shadow-sm')}>
      <div className={clsx('navbar-start')}>
        <label
          htmlFor={drawerId}
          className={clsx('btn', 'btn-ghost', 'mr-2', 'lg:hidden')}
          aria-label='toggle sidebar'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </label>
        <span className={clsx('text-sm', 'md:text-base', 'font-medium')}>
          Panel de Control
        </span>
      </div>

      <div className={clsx('navbar-end')}>
        <div className={clsx('dropdown dropdown-end')}>
          <div
            tabIndex={0}
            role='button'
            className={clsx('btn btn-ghost btn-circle', 'avatar')}
          >
            <div className={clsx('w-10', 'rounded-full')}>
              <img
                alt='avatar'
                src={avatarUrl || '/user.svg'}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className={clsx(
              'menu dropdown-content',
              'bg-base-100',
              'rounded',
              'z-[1]',
              'mt-3',
              'w-64',
              'p-2',
              'shadow'
            )}
          >
            <li
              className={clsx(
                'px-3',
                'py-2',
                'border-b',
                'border-base-300',
                'disabled'
              )}
            >
              <div className={clsx('font-semibold')}>{userName}</div>
              <div className={clsx('text-xs', 'opacity-70')}>{userEmail}</div>
            </li>
            <li>
              <a href='/dashboard/profile'>
                <FiUser className={clsx('w-4', 'h-4')} />
                Perfil
              </a>
            </li>
            <li className={clsx('border-b', 'border-base-300')}>
              <a href='/dashboard/profile'>
                <FiSettings className={clsx('w-4', 'h-4')} />
                Configuración
              </a>
            </li>
            <li>
              <a href='/logout'>
                <FiLogOut className={clsx('w-4', 'h-4')} />
                Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
