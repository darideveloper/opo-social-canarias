import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Toaster from '../ui/Toaster';
import ActivateSuccess from './ActivateSuccess';
import ActivateError from './ActivateError';
import { authService } from '../../lib/auth';

interface ActivatePageProps {
  token: string;
}

type ActivationStatus = 'loading' | 'success' | 'error';

export default function ActivatePage({ token }: ActivatePageProps) {
  const [status, setStatus] = useState<ActivationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

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

  const handleRetry = async () => {
    setIsRetrying(true);
    setStatus('loading');
    setErrorMessage('');
    
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
    } finally {
      setIsRetrying(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <ActivateSuccess 
            isLoading={true}
            onGoToLogin={handleGoToLogin}
          />
        );

      case 'success':
        return (
          <ActivateSuccess 
            isLoading={false}
            onGoToLogin={handleGoToLogin}
          />
        );

      case 'error':
        return (
          <ActivateError 
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onGoToLogin={handleGoToLogin}
            isRetrying={isRetrying}
          />
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
