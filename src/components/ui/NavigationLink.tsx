import React from 'react';
import { clsx, type ClassValue } from 'clsx';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: ClassValue;
  onClick?: () => void;
  isActive?: boolean;
}

const NavigationLink = ({ 
  href, 
  children, 
  className, 
  onClick,
  isActive = false 
}: NavigationLinkProps) => {
  return (
    <a
      href={href}
      className={clsx(
        'text-sm',
        'font-medium',
        'transition-colors',
        'duration-200',
        'hover:text-primary',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary',
        'focus:ring-offset-2',
        'rounded-md',
        'px-2',
        'py-1',
        isActive ? 'text-primary' : 'text-muted-foreground',
        className
      )}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
