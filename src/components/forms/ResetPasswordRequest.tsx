import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Button from '../ui/Button';
import Toaster from '../ui/Toaster';
import { authService } from '../../lib/auth';

interface ResetPasswordRequestProps {
  token?: string;
}

export default function ResetPasswordRequest({ token }: ResetPasswordRequestProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.requestPasswordReset(email);
      
      if (response.status === 'ok') {
        toast.success(response.message);
        // Reset form
        setEmail('');
      } else {
        toast.error(response.message || 'Error al enviar el email. Intenta más tarde.');
      }
      
    } catch (error) {
      toast.error('Error al enviar el email. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">
            Restablecer Contraseña
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Enviando...
                </div>
              ) : (
                'Enviar Email de Restablecimiento'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={handleGoToLogin}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿Recordaste tu contraseña? Inicia sesión
            </button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
