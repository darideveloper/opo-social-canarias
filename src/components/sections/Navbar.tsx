import clsx from "clsx";

type NavbarProps = {
    isLogged?: boolean;
    avatarUrl?: string;
};

export default function Navbar({ isLogged = true, avatarUrl }: NavbarProps) {
    return (
        <div className={clsx("navbar", "bg-base-100", "shadow-sm")}>
            <div className={clsx("navbar-start")}>
                <div className={clsx("dropdown")}> 
                    <div tabIndex={0} role="button" className={clsx("btn btn-ghost", "lg:hidden")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
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
                        {isLogged ? (
                            <>
                                <li><a href="/perfil">Perfil</a></li>
                                <li><a href="/settings">Configuración</a></li>
                                <li><a href="/logout">Cerrar sesión</a></li>
                            </>
                        ) : (
                            <>
                                <li><a href="/login">Inicia Sesión</a></li>
                                <li><a href="/sign-up">Prueba Gratis</a></li>
                            </>
                        )}
                    </ul>
                </div>
                <a className={clsx("text-xl")} href="/">
                    <img src="/logo.webp" alt="Logo" className={clsx("h-10")} />
                </a>
            </div>
            <div className={clsx("navbar-center", "hidden lg:flex")}>
                <ul className={clsx("menu menu-horizontal", "px-1")}>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/about">Qué Ofrecemos</a></li>
                    <li><a href="/pricing">Precios</a></li>
                </ul>
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
                            "menu menu-sm dropdown-content",
                            "bg-base-100",
                            "rounded-box",
                            "z-[1]",
                            "mt-3",
                            "w-52",
                            "p-2",
                            "shadow",
                        )}>
                            <li><a href="/perfil">Perfil</a></li>
                            <li><a href="/settings">Configuración</a></li>
                            <li><a href="/logout">Cerrar sesión</a></li>
                        </ul>
                    </div>
                ) : (
                    <div className={clsx("flex", "gap-2")}>
                        <a className={clsx("btn btn-ghost")} href="/login">Inicia Sesión</a>
                        <a className={clsx("btn btn-secondary")} href="/sign-up">Prueba Gratis</a>
                    </div>
                )}
            </div>
        </div>
    );
}