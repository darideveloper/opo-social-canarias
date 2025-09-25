import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import CardContent from '../ui/CardContent';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Label from '../ui/Label';

export default function LoginNewPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-headline font-semibold leading-none tracking-tight">Iniciar Sesión</h1>
          <p className="text-sm text-muted-foreground">Accede a tu panel de control.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@email.com" 
                required 
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
                required 
              />
            </div>
            <Button type="submit" className="w-full">
                Entrar
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
    </div>
  );
}
