import React from 'react';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Button from '../ui/Button';

interface ActivatePageProps {
  token: string;
}

export default function ActivatePage({ token }: ActivatePageProps) {
  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">Activación de Cuenta</h1>
          <p className="text-sm text-muted-foreground">Tu cuenta ha sido activada exitosamente.</p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
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
            </div>
            
            <Button 
              onClick={handleGoToLogin} 
              className="w-full"
            >
              Ir al Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
