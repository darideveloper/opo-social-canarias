import React from 'react';
import { clsx, type ClassValue } from 'clsx';

interface AppLogoProps {
  className?: ClassValue;
}

const AppLogo = ({ className }: AppLogoProps) => {
  return (
    <a 
      href="/" 
      className={clsx(
        'inline-block',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary',
        'focus:ring-offset-2',
        'rounded-md',
        'transition-opacity',
        'duration-200',
        'hover:opacity-80',
        className
      )}
    >
      <div className="cursor-pointer p-1 sm:p-2">
        <img
          src="/logo.webp"
          alt="Socialia Logo"
          className={clsx(
            'h-6',
            'sm:h-8',
            'md:h-10',
            'lg:h-12',
            'xl:h-14',
            'w-auto',
            'object-contain',
            'transition-all',
            'duration-200',
            'max-w-[200px]',
            'sm:max-w-[250px]',
            'lg:max-w-[300px]'
          )}
        />
      </div>
    </a>
  );
};

export default AppLogo;
