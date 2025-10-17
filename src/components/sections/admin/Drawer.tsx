import clsx from "clsx";
import type { ReactNode } from "react";

type AdminDrawerProps = {
  children: ReactNode;
};

export default function AdminDrawer({ children }: AdminDrawerProps) {
  const drawerId = "admin-drawer";

  return (
    <div className={clsx("drawer", "min-h-screen", "lg:drawer-open")}> 
      <input id={drawerId} type="checkbox" className={clsx("drawer-toggle")} />

      <div className={clsx("drawer-content")}> 
        {children}
      </div>

      <div className={clsx("drawer-side", "is-drawer-close:overflow-visible")}>
        <label htmlFor={drawerId} aria-label="close sidebar" className={clsx("drawer-overlay")}></label>

        <div className={clsx(
          "is-drawer-close:w-14",
          "is-drawer-open:w-64",
          "bg-base-100",
          "flex",
          "flex-col",
          "items-start",
          "min-h-full"
        )}> 
          <div className={clsx("w-full", "px-3", "py-4")}> 
            <a href="/">
              <img src="/logo.webp" alt="Logo" className={clsx("h-8")} />
            </a>
          </div>

          <ul className={clsx("menu", "w-full", "grow")}>
            <li>
              <a href="/dashboard" className={clsx("is-drawer-close:tooltip", "is-drawer-close:tooltip-right")} data-tip="Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={clsx("inline-block", "size-4", "my-1.5")}>
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span className={clsx("is-drawer-close:hidden")}>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/" className={clsx("is-drawer-close:tooltip", "is-drawer-close:tooltip-right")} data-tip="Homepage">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className={clsx("inline-block", "size-4", "my-1.5")}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                <span className={clsx("is-drawer-close:hidden")}>Homepage</span>
              </a>
            </li>
            <li>
              <a href="/settings" className={clsx("is-drawer-close:tooltip", "is-drawer-close:tooltip-right")} data-tip="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className={clsx("inline-block", "size-4", "my-1.5")}><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                <span className={clsx("is-drawer-close:hidden")}>Settings</span>
              </a>
            </li>
          </ul>

          <div className={clsx("m-2", "is-drawer-close:tooltip", "is-drawer-close:tooltip-right")} data-tip="Toggle">
            <label htmlFor={drawerId} className={clsx("btn", "btn-ghost", "btn-circle", "drawer-button", "is-drawer-open:rotate-y-180")}> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className={clsx("inline-block", "size-4", "my-1.5")}><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

