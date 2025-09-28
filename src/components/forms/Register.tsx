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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Email format validation - more restrictive for username part
    const emailRegex = /^[a-zA-Z0-9._-]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, ingresa un email válido');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(email, password, name);
      console.log(response.data)
      
      if (response.status === 'ok') {
        // Show confirmation messages
        toast.success('¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta');
      } else {
        // Check for specific error cases
        if (response.status === 'error' && 
            response.data?.email?.includes('duplicated_email')) {
          toast.error('El email ya está registrado');
        } else {
          toast.error(response.message || 'Error al crear tu cuenta. Intente mas tarde');
        }
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
          <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">Registrarse</h1>
          <p className="text-sm text-muted-foreground">Crea tu cuenta para comenzar.</p>
        </CardHeader>
        <CardContent>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Tu nombre" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="underline">
              Inicia sesión
            </a>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
