import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Link from '../ui/Link';
import { FormField } from '../ui/Form';
import Toaster from '../ui/Toaster';
import { authService } from '../../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Por favor ingresa tu email');
      return;
    }

    if (!password) {
      setPasswordError('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log({response})
      
      if (response.status === 'ok') {
        toast.success('¡Inicio de sesión exitoso!');
        // Redirect to home page or dashboard
        window.location.href = '/';
      } else {
        toast.error(response.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      toast.error('Ha ocurrido un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">Iniciar Sesión</h1>
          <p className="text-sm text-muted-foreground">Accede a tu panel de control.</p>
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
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
                error={!!emailError}
                autoComplete="email"
              />
            </FormField>
            <FormField
              label="Contraseña"
              error={passwordError}
              required
            >
              <Input 
                id="password" 
                type="password" 
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
                error={!!passwordError}
                autoComplete="current-password"
              />
            </FormField>
            <Button 
              type="submit" 
              className="w-full" 
              loading={isLoading}
              loadingText="Iniciando sesión..."
            >
              Entrar
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              <Link href="/recuperar-contrasena" variant="muted">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div>
              ¿No tienes una cuenta?{" "}
              <Link href="/register" variant="muted">
                Regístrate
              </Link>
            </div>
          </div>
          
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
