import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Toaster from '../ui/Toaster';
import { authService } from '../../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a href="/recuperar-contrasena" className="text-xs text-muted-foreground hover:text-primary underline">
                    ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="underline">
              Regístrate
            </a>
          </div>
          
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
