import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Link from '../ui/Link';
import { FormField } from '../ui/Form';
import Toaster from '../ui/Toaster';
import { authService } from '../../lib/auth';

interface ResetPasswordRequestProps {
  token?: string;
}

export default function ResetPasswordRequest({ token }: ResetPasswordRequestProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email) {
      setEmailError('Por favor ingresa tu email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor ingresa un email válido');
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
            <FormField
              label="Email"
              error={emailError}
              required
            >
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={isLoading}
                error={!!emailError}
                required
              />
            </FormField>
            
            <Button 
              type="submit" 
              className="w-full"
              loading={isLoading}
              loadingText="Enviando..."
            >
              Enviar Email de Restablecimiento
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" variant="muted">
              ¿Recordaste tu contraseña? Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
