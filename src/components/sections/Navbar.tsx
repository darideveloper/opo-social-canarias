import clsx from "clsx";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import ButtonLink from "../ui/ButtonLink";

type NavbarProps = {
  isLogged?: boolean;
  avatarUrl?: string;
  userName?: string;
  userEmail?: string;
};

export default function Navbar({ 
  isLogged = true, 
  avatarUrl,
  userName = "Usuario",
  userEmail = "usuario@email.com" 
}: NavbarProps) {
  return (
    <div className={clsx(
      "navbar",
      "bg-base-100",
      "shadow-sm",
    )}>
      <div className={clsx("navbar-start")}>
        {!isLogged && (
          <div className={clsx("dropdown")}>
            <div tabIndex={0} role="button" className={clsx(
              "btn btn-ghost",
              "lg:hidden",
            )}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className={clsx(
                "menu menu-sm dropdown-content",
                "bg-base-100",
                "rounded-box",
                "z-[1]",
                "mt-3",
                "w-52",
                "p-2",
                "shadow",
              )}
            >
              <li><a href="/">Inicio</a></li>
              <li><a href="/about">Qué Ofrecemos</a></li>
              <li><a href="/pricing">Precios</a></li>
            </ul>
          </div>
        )}
        <a className={clsx("text-xl")} href="/">
          <img src="/logo.webp" alt="Logo" className={clsx("h-6", "md:h-10")} />
        </a>
      </div>
      
      <div className={clsx("navbar-center", "hidden lg:flex")}>
        {isLogged ? (
          <a href="/dashboard" className={clsx("btn", "btn-ghost")}>
            Panel de Control
          </a>
        ) : (
          <ul className={clsx("menu menu-horizontal", "px-1")}>
            <li><a href="/">Inicio</a></li>
            <li><a href="/about">Qué Ofrecemos</a></li>
            <li><a href="/pricing">Precios</a></li>
          </ul>
        )}
      </div>

      <div className={clsx("navbar-end")}>
        {isLogged ? (
          <div className={clsx("dropdown dropdown-end")}>
            <div tabIndex={0} role="button" className={clsx("btn btn-ghost btn-circle", "avatar")}>
              <div className={clsx("w-10", "rounded-full")}>
                <img alt="avatar" src={avatarUrl || "/user.svg"} />
              </div>
            </div>
            <ul tabIndex={0} className={clsx(
              "menu dropdown-content",
              "bg-base-100",
              "rounded",
              "z-[1]",
              "mt-3",
              "w-64",
              "p-2",
              "shadow",
            )}>
              <li className={clsx("px-3", "py-2", "border-b", "border-base-300", "disabled")}>
                <div className={clsx("font-semibold")}>{userName}</div>
                <div className={clsx("text-xs", "opacity-70")}>{userEmail}</div>
              </li>
              <li>
                <a href="/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={clsx("w-4", "h-4")}>
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/perfil">
                  <FiUser className={clsx("w-4", "h-4")} />
                  Perfil
                </a>
              </li>
              <li className={clsx("border-b", "border-base-300")}>
                <a href="/settings">
                  <FiSettings className={clsx("w-4", "h-4")} />
                  Configuración
                </a>
              </li>
              <li>
                <a href="/logout">
                  <FiLogOut className={clsx("w-4", "h-4")} />
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className={clsx("flex", "gap-2")}>
            <ButtonLink className={clsx("btn btn-ghost")} href="/login">Inicia Sesión</ButtonLink>
            <ButtonLink className={clsx("btn btn-secondary")} href="/sign-up">Prueba Gratis</ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
