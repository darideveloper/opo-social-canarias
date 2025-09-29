import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Input component with error state support
 * 
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" />
 * <Input error errorMessage="Email is required" />
 * ```
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  /** Show error state styling */
  error?: boolean;
  /** Error message to display below input */
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
