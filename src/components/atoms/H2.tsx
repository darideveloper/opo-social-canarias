import clsx from "clsx";
import React from "react";

type H1Props = {
  className?: string;
  children: React.ReactNode;
};

export default function H1({ className = "", children }: H1Props) {
  return (
    <h2
      className={clsx(
        "text-lg",
        "text-center",
        "font-semibold",
        "xl:text-4xl sm:text-xl md:text-2xl lg:text-3xl",
        className
      )}
    >
      {children}
    </h2>
  );
}


