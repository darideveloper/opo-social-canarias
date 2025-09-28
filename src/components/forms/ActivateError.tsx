import React from 'react';
import Button from '../ui/Button';

interface ActivateErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onGoToLogin: () => void;
  isRetrying?: boolean;
}

export default function ActivateError({ 
  errorMessage, 
  onRetry, 
  onGoToLogin, 
  isRetrying = false 
}: ActivateErrorProps) {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-lg text-foreground">
        Error en la activación
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {errorMessage}
      </p>
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={onRetry} 
          className="flex-1"
          variant="outline"
          disabled={isRetrying}
        >
          {isRetrying ? 'Reintentando...' : 'Reintentar'}
        </Button>
        <Button 
          onClick={onGoToLogin} 
          className="flex-1"
        >
          Ir al Login
        </Button>
      </div>
    </div>
  );
}

