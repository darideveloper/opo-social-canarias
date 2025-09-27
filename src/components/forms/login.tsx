import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Toaster from '../ui/Toaster';
import { AuthContext } from '../../contexts/AuthContext';

export default function LoginNewPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Safely access auth context with fallback for SSR
  const authContext = useContext(AuthContext);
  const login = authContext?.login;
  const isAuthenticated = authContext?.isAuthenticated || false;

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isClient && isAuthenticated) {
      window.location.href = '/';
    }
  }, [isClient, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isClient) {
      toast.error('Authentication not available. Please refresh the page.');
      return;
    }
    
    setIsLoading(true);

    try {
      // If authContext is available, use it; otherwise, call authService directly
      let response;
      if (authContext && login) {
        response = await login(email, password);
      } else {
        // Fallback: call authService directly
        const { authService } = await import('../../lib/auth');
        response = await authService.login(email, password);
      }
      
      if (response.success) {
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

  // Show loading state only during SSR
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">Iniciar Sesión</h1>
            <p className="text-sm text-muted-foreground">Cargando...</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
