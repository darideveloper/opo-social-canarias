import ButtonBase from "./base/ButtonBase";

export default function ButtonAction({
  isSoft = false,
  type = "button",
  className = "",
  onClick,
  children,
}: {
  isSoft?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick: Function;
  children: React.ReactNode;
}) {
  return (
    <button type={type} onClick={() => onClick()}>
      <ButtonBase isSoft={isSoft} className={className}>
        {children}
      </ButtonBase>
    </button>
  );
}
