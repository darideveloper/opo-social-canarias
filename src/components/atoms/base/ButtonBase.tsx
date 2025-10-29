import { clsx } from 'clsx'

export default function ButtonBase({
  isSoft = false,
  className = "",
  children,
}: {
  isSoft?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "btn",
        'btn-secondary',
        isSoft ? "btn-soft" : "hover:btn-accent",
        isSoft ? "hover:text-base-100" : "hover:text-secondary-content",
        "transition-all",
        "duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}
