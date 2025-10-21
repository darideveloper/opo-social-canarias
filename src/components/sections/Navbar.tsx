import clsx from 'clsx'
import ButtonLink from '../ui/ButtonLink'

export default function Navbar() {
  return (
    <header className={clsx('navbar', 'bg-base-100', 'shadow-sm')}>
      <div className={clsx('navbar-start')}>
        <a
          className={clsx('text-xl')}
          href='/'
        >
          <img
            src='/logo.webp'
            alt='Logo'
            className={clsx('h-6', 'md:h-10')}
          />
        </a>
      </div>

      <div className={clsx('navbar-center', 'hidden lg:flex')}>
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
      </div>

      <div className={clsx('navbar-end')}>
        <div className={clsx('flex', 'gap-2')}>
          <ButtonLink
            className={clsx('btn btn-ghost')}
            href='/login'
          >
            Inicia Sesión
          </ButtonLink>
          <ButtonLink
            className={clsx('btn btn-secondary')}
            href='/sign-up'
          >
            Prueba Gratis
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}
