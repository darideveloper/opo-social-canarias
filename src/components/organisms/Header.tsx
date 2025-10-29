// Libs
import clsx from 'clsx'

// Components
import ButtonLink from '../atoms/ButtonLink'

export default function Navbar() {
  return (
    <header className={clsx('navbar', '!bg-base-100', 'shadow-sm')}>
      <div
        className={clsx(
          'container',
          'mx-auto',
          'flex',
          'flex-col md:flex-row',
          'items-center',
          'justify-between',
          '!p-0',
          'gap-2',
          'container',
          '!p-2'
        )}
      >
        <div className={clsx('navbar-start')}>
          <a
            className={clsx('text-xl', 'mx-auto md:mx-0')}
            href='/'
          >
            <img
              src='/logo.webp'
              alt='Logo'
              className={clsx('h-6', 'md:h-10')}
            />
          </a>
        </div>

        <nav className={clsx('navbar-center', '!flex')}>
          <ul className={clsx('menu menu-horizontal', 'px-1')}>
            <li>
              <a href='/'>Inicio</a>
            </li>
            <li>
              <a href='/about'>Qué Ofrecemos</a>
            </li>
            <li>
              <a href='/pricing'>Precios</a>
            </li>
          </ul>
        </nav>

        <div
          className={clsx(
            'navbar-end',
            '!w-full md:!w-1/2',
            'flex',
            'justify-center',
            'md:justify-end'
          )}
        >
          <div className={clsx('flex', 'gap-2')}>
            <ButtonLink
              href='/login'
              isSoft={true}
            >
              Inicia Sesión
            </ButtonLink>
            <ButtonLink href='/sign-up'>Prueba Gratis</ButtonLink>
          </div>
        </div>
      </div>
    </header>
  )
}
