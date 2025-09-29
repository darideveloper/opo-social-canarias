import React, { useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import Button from '../ui/Button';
import NavigationLink from '../ui/NavigationLink';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => {
  const navigationItems = [
    { href: '/landing-new', label: 'Inicio' },
    { href: '/que-ofrecemos', label: 'Qué ofrecemos' },
    { href: '/precios', label: 'Precios' },
  ];

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          'fixed',
          'inset-0',
          'bg-black/50',
          'z-40',
          'transition-opacity',
          'duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile Menu */}
      <nav
        className={clsx(
          'fixed',
          'top-16',
          'right-0',
          'w-80',
          'max-w-[calc(100vw-2rem)]',
          'h-[calc(100vh-4rem)]',
          'bg-card',
          'border-l',
          'shadow-lg',
          'z-50',
          'transform',
          'transition-transform',
          'duration-300',
          'ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
        role="navigation"
      >
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="flex-1 p-6">
            <ul className="space-y-4">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <NavigationLink
                    href={item.href}
                    className="block py-3 text-lg font-medium"
                    onClick={onClose}
                  >
                    {item.label}
                  </NavigationLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="p-6 border-t space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = '/login';
                onClose();
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = '/register';
                onClose();
              }}
            >
              Prueba Gratis
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
