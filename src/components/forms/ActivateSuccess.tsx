import React from 'react';
import Button from '../ui/Button';
import Link from '../ui/Link';

interface ActivateSuccessProps {
  isLoading: boolean;
  onGoToLogin: () => void;
}

export default function ActivateSuccess({ isLoading, onGoToLogin }: ActivateSuccessProps) {
  if (isLoading) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p className="text-lg text-foreground">
          Activando tu cuenta...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Por favor espera mientras procesamos tu activación.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-lg text-foreground">
        ¡Tu cuenta ha sido activada!
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Ya puedes iniciar sesión con tus credenciales.
      </p>
      <Link 
        href="/login" 
        variant="muted" 
        className="w-full mt-4 text-center block py-2 px-4 bg-primary text-primary-foreground rounded-md border border-primary hover:bg-transparent hover:text-primary hover:border-primary"
      >
        Ir al Login
      </Link>
    </div>
  );
}
