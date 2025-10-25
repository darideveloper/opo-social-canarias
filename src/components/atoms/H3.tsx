import clsx from "clsx";
import React from "react";

type H1Props = {
  className?: string;
  children: React.ReactNode;
};

export default function H1({ className = "", children }: H1Props) {
  return (
    <h3
      className={clsx(
        "text-sm",
        "text-center",
        "font-semibold",
        "xl:text-xl sm:text-sm md:text-base lg:text-xl",
        className
      )}
    >
      {children}
    </h3>
  );
}

