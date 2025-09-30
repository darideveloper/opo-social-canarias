import React from 'react';
import { FileQuestion, Clock, Trophy, Play, BarChart3, Target } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Progress,
} from './ui';

// Mock data for tests
const mockTestStats = {
  totalTests: 15,
  passedTests: 12,
  averageScore: 78,
  bestScore: 92,
  currentStreak: 3
};

const mockRecentTests = [
  {
    id: 1,
    title: "Test Tema 5 - Potestad Reglamentaria",
    score: 85,
    totalQuestions: 20,
    date: "2024-01-15",
    status: "passed"
  },
  {
    id: 2,
    title: "Simulacro Completo #3",
    score: 72,
    totalQuestions: 50,
    date: "2024-01-14",
    status: "passed"
  },
  {
    id: 3,
    title: "Test Tema 2 - Marco Legal",
    score: 65,
    totalQuestions: 15,
    date: "2024-01-13",
    status: "failed"
  },
  {
    id: 4,
    title: "Test Tema 1 - Introducción",
    score: 88,
    totalQuestions: 18,
    date: "2024-01-12",
    status: "passed"
  }
];

const TestsContent: React.FC = () => {
  const passRate = (mockTestStats.passedTests / mockTestStats.totalTests) * 100;

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Excelente</Badge>;
    } else if (score >= 60) {
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Aprobado</Badge>;
    } else {
      return <Badge variant="destructive">Suspenso</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight">Tests</h2>
          <p className="text-muted-foreground">Practica y evalúa tu conocimiento</p>
        </div>
        <Button size="lg">
          <Play className="w-4 h-4 mr-2" />
          Nuevo Test
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Realizados</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTestStats.totalTests}</div>
            <p className="text-xs text-muted-foreground">Total completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Aprobados</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">{mockTestStats.passedTests} de {mockTestStats.totalTests} aprobados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Media</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTestStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Puntuación</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTestStats.bestScore}%</div>
            <p className="text-xs text-muted-foreground">Récord personal</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Elige el tipo de test que quieres realizar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="h-20 flex flex-col gap-2">
              <FileQuestion className="w-6 h-6" />
              <span>Test por Tema</span>
            </Button>
            <Button variant="outline" size="lg" className="h-20 flex flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>Simulacro Completo</span>
            </Button>
            <Button variant="outline" size="lg" className="h-20 flex flex-col gap-2">
              <Target className="w-6 h-6" />
              <span>Test Personalizado</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tests Recientes</CardTitle>
              <CardDescription>Tu historial de tests más recientes</CardDescription>
            </div>
            <Button variant="outline" size="sm">Ver Todos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${test.status === 'passed' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <FileQuestion className={`w-5 h-5 ${test.status === 'passed' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{test.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{test.totalQuestions} preguntas</span>
                      <span>{new Date(test.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getScoreBadge(test.score)}
                  <div className="text-right">
                    <div className="text-2xl font-bold">{test.score}%</div>
                    <div className="text-xs text-muted-foreground">Puntuación</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TestsContent;
