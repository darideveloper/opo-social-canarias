import React from 'react';
import Label from './Label';
import Input from './Input';
import Button from './Button';

interface FormFieldProps {
  label: string | React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}

export function Form({ onSubmit, loading, children, ...props }: FormProps) {
  return (
    <form onSubmit={onSubmit} {...props}>
      <div className="space-y-4">
        {children}
      </div>
    </form>
  );
}
