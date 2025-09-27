import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Button from '../ui/Button';
import Toaster from '../ui/Toaster';
import { authService } from '../../lib/auth';

interface ActivatePageProps {
  token: string;
}

type ActivationStatus = 'loading' | 'success' | 'error';

export default function ActivatePage({ token }: ActivatePageProps) {
  const [status, setStatus] = useState<ActivationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Token de activación no válido');
        return;
      }

      try {
        const response = await authService.activateAccount(token);
        
        if (response.status === 'ok') {
          setStatus('success');
          toast.success('¡Cuenta activada exitosamente!');
        } else {
          setStatus('error');
          toast.error('Error al activar la cuenta');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('Error de conexión. Intenta más tarde.');
        toast.error('Error de conexión. Intenta más tarde.');
      }
    };

    activateAccount();
  }, [token]);

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  const handleRetry = () => {
    setStatus('loading');
    setErrorMessage('');
    // Retry activation
    const activateAccount = async () => {
      try {
        const response = await authService.activateAccount(token);
        
        if (response.status === 'ok') {
          setStatus('success');
          toast.success('¡Cuenta activada exitosamente!');
        } else {
          setStatus('error');
          setErrorMessage(response.message || 'Error al activar la cuenta');
          toast.error(response.message || 'Error al activar la cuenta');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('Error de conexión. Intenta más tarde.');
        toast.error('Error de conexión. Intenta más tarde.');
      }
    };

    activateAccount();
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
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

      case 'success':
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
            <Button 
              onClick={handleGoToLogin} 
              className="w-full mt-4"
            >
              Ir al Login
            </Button>
          </div>
        );

      case 'error':
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
                onClick={handleRetry} 
                className="flex-1"
                variant="outline"
              >
                Reintentar
              </Button>
              <Button 
                onClick={handleGoToLogin} 
                className="flex-1"
              >
                Ir al Login
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">Activación de Cuenta</h1>
          <p className="text-sm text-muted-foreground">
            {status === 'loading' && 'Procesando activación...'}
            {status === 'success' && 'Tu cuenta ha sido activada exitosamente.'}
            {status === 'error' && 'Hubo un problema con la activación.'}
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            {renderContent()}
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
