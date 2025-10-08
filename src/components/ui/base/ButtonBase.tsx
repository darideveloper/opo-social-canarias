import clsx from "clsx";

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
        "btn-secondary",
        isSoft && "btn-soft",
        "transition-all",
        "duration-200",
        "hover:scale-105",
        className
      )}
    >
      {children}
    </div>
  );
}
