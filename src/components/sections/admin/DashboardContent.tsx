import clsx from "clsx";

type DashboardContentProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function DashboardContent({
  title = "Panel de Control",
  subtitle = "Contenido de ejemplo del dashboard.",
  className,
  children,
}: DashboardContentProps) {
  return (
    <div className={clsx("p-4", className)}>
      <div className={clsx("card", "bg-base-100", "shadow-sm", "p-6")}> 
        <h2 className={clsx("text-lg", "font-semibold")}>{title}</h2>
        <p className={clsx("opacity-70", "mt-1")}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}


