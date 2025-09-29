import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  variant?: 'default' | 'muted';
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "text-sm underline transition-colors hover:text-primary",
          variant === 'muted' && "text-muted-foreground",
          variant === 'default' && "text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

export default Link;
