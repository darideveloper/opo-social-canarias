import clsx from "clsx";

export default function Button({
  isSoft = false,
  type = "button",
  className = "",
  children,
}: {
  isSoft?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      className={clsx(
        "btn",
        "btn-secondary",
        "px-6",
        "py-3",
        "rounded-lg",
        "font-semibold",
        "transition-colors",
        "duration-200",
        isSoft && "btn-soft",
        className
      )}
    >
      {children}
    </button>
  );
}
