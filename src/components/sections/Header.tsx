import React, { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import AppLogo from '../ui/AppLogo';
import Button from '../ui/Button';
import MobileMenuButton from '../ui/MobileMenuButton';
import MobileNavigation from './MobileNavigation';
import NavigationLink from '../ui/NavigationLink';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={clsx(
        'px-4 lg:px-6',
        'h-16',
        'flex',
        'items-center',
        'bg-card/80',
        'backdrop-blur-sm',
        'shadow-sm',
        'sticky',
        'top-0',
        'z-50',
        'border-b'
      )}>
        {/* Logo */}
        <AppLogo />
        
        {/* Desktop Navigation */}
        <nav className={clsx(
          'ml-auto',
          'hidden',
          'md:flex',
          'items-center',
          'gap-4',
          'lg:gap-6'
        )}>
          <NavigationLink href="/landing">Inicio</NavigationLink>
          <NavigationLink href="/que-ofrecemos">Qué ofrecemos</NavigationLink>
          <NavigationLink href="/precios">Precios</NavigationLink>
          
          <div className="flex items-center gap-2">
            <a href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </a>
            <a href="/register">
              <Button size="sm">
                Prueba Gratis
              </Button>
            </a>
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="ml-auto md:hidden">
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  );
};

export default Header;
