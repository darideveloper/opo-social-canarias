import React from "react";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSoft?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button = ({
  isSoft = false,
  type = "button",
  className,
  ...rest
}: ButtonProps) => {
  const classes = clsx(
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
  );

  return <button type={type} className={classes} {...rest}></button>;
};

export default Button;