import React from 'react';
import {
  LayoutDashboard,
  Book,
  Users,
  User as UserIcon,
  FileQuestion,
  Trophy,
  Search,
  Sparkles,
  BookOpen,
  LogOut,
  Database,
  ThumbsDown,
  CheckCircle,
  Shield,
  User,
  Settings,
  CalendarDays,
  Flag,
  Rss,
  ExternalLink,
  Activity,
  BookCheck,
  Menu,
} from 'lucide-react';

// Import UI components from our library
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  AppLogo,
} from './ui';

// Mock data constants
const TOTAL_TOPICS = 42; // Mock total topics count

const mockUserData = {
  name: "María García",
  email: "maria@example.com",
  photoURL: null,
  subscription: "Anual Pro",
  role: "user", // Change to "admin" to test admin features
  gofitos: 1250,
  completedTopics: [1, 2, 3, 4, 5],
  testsTaken: 15,
  testsPassed: 12,
  activityLog: [
    {
      type: "test",
      title: "Test Tema 5 - Potestad Reglamentaria",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      details: "85%"
    },
    {
      type: "topic",
      title: "Tema 12 - EBEP completado",
     date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      details: "100%"
    },
    {
      type: "case",
      title: "Caso Práctico - Violencia de Género",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      details: "Aprobado"
    }
  ]
};

const mockConvocatorias = [
  {
    id: 1,
    title: "Bolsa de Trabajo Social (Estabilización)",
    entity: "Ayuntamiento de La Laguna",
    link: "#",
    date: "15/07/2024",
    status: "Abierta",
  },
  {
    id: 2,
    title: "Lista de Reserva Trabajador/a Social",
    entity: "Cabildo de Gran Canaria",
    link: "#",
    date: "01/07/2024",
    status: "Cerrada",
  },
  {
    id: 3,
    title: "Oposición Libre (Grupo A, Subgrupo A1)",
    entity: "Gobierno de Canarias",
    link: "#",
    date: "28/06/2024",
    status: "Próximamente",
  },
];

const UserNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownMenu>
      <div ref={dropdownRef}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockUserData.photoURL || undefined} alt={`Avatar de ${mockUserData.name}`} />
              <AvatarFallback>
                {mockUserData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        {isOpen && (
          <DropdownMenuContent className="w-56 absolute right-0 mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{mockUserData.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockUserData.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsOpen(false)}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsOpen(false)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsOpen(false)}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </div>
    </DropdownMenu>
  );
};

const ProfileSummary = () => {
  const getSubscriptionBadgeVariant = () => {
    switch(mockUserData.subscription) {
      case "Anual Pro":
      case "Mensual Pro":
        return "default";
      case "Mensual":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  return (
    <div className="flex flex-col items-center text-center p-4">
      <Avatar className="h-20 w-20 mb-3 border-2 border-primary">
        <AvatarImage src={mockUserData.photoURL || undefined} alt={`Avatar de ${mockUserData.name}`} />
        <AvatarFallback className="text-3xl">
          {mockUserData.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || <User />}
        </AvatarFallback>
      </Avatar>
      <h3 className="text-lg font-semibold font-headline">{mockUserData.name}</h3>
      <p className="text-sm text-muted-foreground">{mockUserData.email}</p>
      
      <div className="flex items-center gap-4 mt-4">
        <Badge variant={getSubscriptionBadgeVariant()}>{mockUserData.subscription}</Badge>
        {mockUserData.role === 'admin' && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1"/>Admin</Badge>}
        <div className="text-sm">
          <span className="font-bold">{mockUserData.gofitos || 0}</span>
          <span className="text-muted-foreground"> Gofitos</span>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  progress?: number;
}

const StatCard = ({ title, value, description, icon: Icon, progress }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {progress !== undefined && (
        <Progress value={progress} className="mt-2 h-2" />
      )}
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Acciones Rápidas</CardTitle>
      <CardDescription>Continúa tu preparación desde donde lo dejaste.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col space-y-3">
      <Button size="lg" variant="outline">
        <BookOpen className="w-4 h-4" />
        Ir al Temario
      </Button>
      <Button size="lg" variant="outline">
        <FileQuestion className="w-4 h-4" />
        Hacer Súper Test (Simulacro)
      </Button>
      <Button size="lg" variant="outline">
        <Sparkles className="w-4 h-4" />
        Nuevo Caso Práctico - IA
      </Button>
      <Button size="lg" variant="outline">
        <Search className="w-4 h-4" />
        Buscar Recursos Adicionales
      </Button>
    </CardContent>
  </Card>
);

const RecentActivity = () => {
  const iconMap = {
    test: FileQuestion,
    topic: BookCheck,
    case: Sparkles,
  };

  const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'hoy';
    if (diffInDays === 1) return 'hace 1 día';
    if (diffInDays < 7) return `hace ${diffInDays} días`;
    if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} semanas`;
    return `hace ${Math.floor(diffInDays / 30)} meses`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary"/>
          <CardTitle className="font-headline">Actividad Reciente</CardTitle>
        </div>
        <CardDescription>Tu progreso de los últimos días.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockUserData.activityLog.length > 0 ? (
          <div className="space-y-4">
            {mockUserData.activityLog.map((activity, index) => {
              const Icon = iconMap[activity.type as keyof typeof iconMap] || Activity;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-secondary p-2 rounded-lg">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.date)}
                    </p>
                  </div>
                  <div>
                    {activity.details && (
                      <Badge 
                        variant={activity.details.includes('%') ? 'default' : 'secondary'} 
                        className={activity.details.includes('%') ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      >
                        {activity.details}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Aún no hay actividad registrada.</p>
            <p className="text-sm">¡Empieza a estudiar para ver tu progreso aquí!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MotivationCard = () => (
  <Card className="bg-primary text-primary-foreground">
    <CardContent className="flex items-center justify-between p-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold font-headline">¡Vas por buen camino!</h3>
        <p className="text-sm opacity-90">Llevas 7 días seguidos estudiando. La constancia es clave para aprobar las oposiciones.</p>
        <div className="flex items-center gap-6 pt-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Meta diaria: 2 horas</span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            <span>Siguiente hito: Tema 30</span>
          </div>
        </div>
      </div>
      <div className="hidden sm:block">
        <Trophy className="h-20 w-20 text-yellow-300" />
      </div>
    </CardContent>
  </Card>
);

const ConvocatoriasWidget = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rss className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Últimas Convocatorias</CardTitle>
        </div>
        <Button variant="outline" size="sm">Ver Todas</Button>
      </div>
      <CardDescription>
        Mantente al día de las últimas oportunidades en Canarias. Próximamente...
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {mockConvocatorias.map((conv) => (
          <div key={conv.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="mb-2 sm:mb-0">
              <p className="font-semibold">{conv.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Badge 
                  variant={conv.status === 'Abierta' ? 'default' : conv.status === 'Cerrada' ? 'destructive' : 'secondary'} 
                  className="text-xs"
                >
                  {conv.status}
                </Badge>
                <span>Publicado: {conv.date}</span>
                <Badge variant="secondary">{conv.entity}</Badge>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              Ver Convocatoria
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Component
export default function Dashboard() {
  const progressPercentage = mockUserData?.completedTopics ? (mockUserData.completedTopics.length / TOTAL_TOPICS) * 100 : 0;
  const testsTaken = mockUserData?.testsTaken || 0;
  const testsPassed = mockUserData?.testsPassed || 0;
  const passRate = testsTaken > 0 ? (testsPassed / testsTaken) * 100 : 0;
  const gofitos = mockUserData?.gofitos || 0;
  const completedTopics = mockUserData?.completedTopics?.length || 0;
  const isAdmin = mockUserData?.role === 'admin';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <ProfileSummary />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BookOpen className="w-4 h-4" />
                Temario
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileQuestion className="w-4 h-4" />
                Tests
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Sparkles className="w-4 h-4" />
                Casos Prácticos
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Trophy className="w-4 h-4" />
                Ranking
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Search className="w-4 h-4" />
                Recursos
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ThumbsDown className="w-4 h-4" />
                Mis Fallos
              </SidebarMenuButton>
            </SidebarMenuItem>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Database className="w-4 h-4" />
                  Alumnas
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden"/>
            <h1 className="font-headline text-xl font-semibold hidden md:block">Panel de Control</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold font-headline tracking-tight">¡Bienvenida, {mockUserData.name}!</h2>
                <p className="text-muted-foreground">Es un buen día para avanzar en tu oposición y sumar Gofitos.</p>
              </div>
            </div>
            
            {isAdmin && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5"/>
                    Panel de Administración
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    <Users className="mr-2 w-4 h-4"/>
                    Gestionar Alumnas
                  </Button>
                  <Button>
                    <UserIcon className="mr-2 w-4 h-4"/>
                    Añadir Nueva Alumna
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Motivation Card */}
            <MotivationCard />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Progreso Temario" 
                value={`${completedTopics}/${TOTAL_TOPICS}`} 
                description={`${progressPercentage.toFixed(1)}% completado`}
                icon={Book}
                progress={progressPercentage}
              />
              <StatCard 
                title="Tests Realizados" 
                value={testsTaken} 
                description="Sigue practicando" 
                icon={FileQuestion}
              />
              <StatCard 
                title="Tests Aprobados" 
                value={testsPassed} 
                description={`${passRate.toFixed(0)}% de acierto`}
                icon={CheckCircle}
              />
              <StatCard 
                title="Gofitos" 
                value={gofitos} 
                description="¡A por todas!" 
                icon={Trophy}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
            </div>
            
            <ConvocatoriasWidget />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
