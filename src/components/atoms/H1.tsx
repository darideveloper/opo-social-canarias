import clsx from "clsx";
import React from "react";

type H1Props = {
  className?: string;
  children: React.ReactNode;
};

export default function H1({ className = "", children }: H1Props) {
  return (
    <h1
      className={clsx(
        "text-xl",
        "text-center",
        "font-semibold",
        "xl:text-5xl sm:text-2xl md:text-3xl lg:text-4xl",
        className
      )}
    >
      {children}
    </h1>
  );
}


