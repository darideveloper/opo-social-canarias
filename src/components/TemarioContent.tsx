import React from 'react';
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Progress,
  Button,
} from './ui';

// Mock data for temario
const mockTemarioData = [
  {
    id: 1,
    title: "Tema 1 - Introducción al Trabajo Social",
    status: "completed",
    progress: 100,
    duration: "2h 30m",
    lastAccessed: "2024-01-15"
  },
  {
    id: 2,
    title: "Tema 2 - Marco Legal y Normativo",
    status: "in_progress",
    progress: 65,
    duration: "3h 15m",
    lastAccessed: "2024-01-14"
  },
  {
    id: 3,
    title: "Tema 3 - Metodología del Trabajo Social",
    status: "not_started",
    progress: 0,
    duration: "2h 45m",
    lastAccessed: null
  },
  {
    id: 4,
    title: "Tema 4 - Intervención Social",
    status: "not_started",
    progress: 0,
    duration: "3h 00m",
    lastAccessed: null
  },
  {
    id: 5,
    title: "Tema 5 - Potestad Reglamentaria",
    status: "completed",
    progress: 100,
    duration: "2h 15m",
    lastAccessed: "2024-01-13"
  }
];

const TemarioContent: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En progreso</Badge>;
      default:
        return <Badge variant="secondary">No iniciado</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const completedCount = mockTemarioData.filter(item => item.status === 'completed').length;
  const totalCount = mockTemarioData.length;
  const overallProgress = (completedCount / totalCount) * 100;

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight">Temario</h2>
          <p className="text-muted-foreground">Progreso general: {completedCount} de {totalCount} temas completados</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Progreso: {overallProgress.toFixed(0)}%
          </Badge>
        </div>
      </div>

      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Progreso General del Temario
          </CardTitle>
          <CardDescription>
            Tu avance en la preparación de todos los temas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Temas completados</span>
              <span>{completedCount}/{totalCount}</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{overallProgress.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temas List */}
      <div className="grid grid-cols-1 gap-4">
        {mockTemarioData.map((tema) => (
          <Card key={tema.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(tema.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{tema.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tema.duration}
                      </div>
                      {tema.lastAccessed && (
                        <span>Último acceso: {new Date(tema.lastAccessed).toLocaleDateString('es-ES')}</span>
                      )}
                    </div>
                    {tema.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{tema.progress}%</span>
                        </div>
                        <Progress value={tema.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(tema.status)}
                  <Button variant={tema.status === 'completed' ? 'outline' : 'default'}>
                    {tema.status === 'completed' ? 'Repasar' : tema.status === 'in_progress' ? 'Continuar' : 'Comenzar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default TemarioContent;
