import React from 'react';
import { clsx, type ClassValue } from 'clsx';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: ClassValue;
}

const MobileMenuButton = ({ isOpen, onClick, className }: MobileMenuButtonProps) => {
  return (
    <button
      className={clsx(
        'relative',
        'w-8 h-8',
        'flex flex-col',
        'justify-center',
        'items-center',
        'space-y-1',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary',
        'focus:ring-offset-2',
        'rounded-md',
        'transition-all',
        'duration-200',
        'hover:bg-accent',
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span
        className={clsx(
          'block',
          'w-6 h-0.5',
          'bg-foreground',
          'transition-all',
          'duration-300',
          'origin-center',
          isOpen && 'rotate-45 translate-y-1.5'
        )}
      />
      <span
        className={clsx(
          'block',
          'w-6 h-0.5',
          'bg-foreground',
          'transition-all',
          'duration-300',
          isOpen && 'opacity-0'
        )}
      />
      <span
        className={clsx(
          'block',
          'w-6 h-0.5',
          'bg-foreground',
          'transition-all',
          'duration-300',
          'origin-center',
          isOpen && '-rotate-45 -translate-y-1.5'
        )}
      />
    </button>
  );
};

export default MobileMenuButton;
