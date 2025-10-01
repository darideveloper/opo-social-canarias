import React from 'react';
import { Home, ArrowLeft, Search, User } from 'lucide-react';
import AppLogo from './ui/AppLogo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <AppLogo className="scale-125" />
        </div>

        {/* 404 Illustration/Icon */}
        <div className="space-y-6">
          <div className="relative">
            <div className="text-8xl font-bold text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Main Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Página no encontrada
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary hover:border-primary rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Home className="w-4 h-4" />
              Ir al inicio
            </a>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver atrás
            </button>
          </div>

          {/* Additional Navigation Links */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              O puedes visitar estas páginas:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a
                href="/dashboard"
                className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
              >
                Dashboard
              </a>
              <a
                href="/login"
                className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
              >
                Iniciar sesión
              </a>
              <a
                href="/register"
                className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
              >
                Registrarse
              </a>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="pt-6 text-xs text-gray-400">
          <p>
            Si crees que esto es un error, por favor{' '}
            <a
              href="mailto:soporte@socialia.com"
              className="text-primary hover:text-primary/80 hover:underline"
            >
              contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
