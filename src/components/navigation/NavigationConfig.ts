import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Sparkles,
  Trophy,
  Search,
  Users,
  Database,
  CalendarDays,
  Flag,
  Rss,
} from 'lucide-react';
import type { NavigationItem } from '../../types/navigation';

export const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    isActive: true
  },
  {
    id: 'temario',
    label: 'Temario',
    icon: BookOpen,
    href: '/dashboard/temario'
  },
  {
    id: 'tests',
    label: 'Tests',
    icon: FileQuestion,
    href: '/dashboard/tests'
  },
  {
    id: 'casos-practicos',
    label: 'Casos Prácticos',
    icon: Sparkles,
    href: '/dashboard/casos-practicos'
  },
  {
    id: 'ranking',
    label: 'Ranking',
    icon: Trophy,
    href: '/dashboard/ranking'
  },
  {
    id: 'recursos',
    label: 'Recursos',
    icon: Search,
    href: '/dashboard/recursos'
  }
];

export const adminNavigationItems: NavigationItem[] = [
  {
    id: 'admin-users',
    label: 'Gestión de Usuarios',
    icon: Users,
    href: '/dashboard/admin/users',
    adminOnly: true
  },
  {
    id: 'admin-content',
    label: 'Gestión de Contenido',
    icon: Database,
    href: '/dashboard/admin/content',
    adminOnly: true
  },
  {
    id: 'admin-convocatorias',
    label: 'Convocatorias',
    icon: CalendarDays,
    href: '/dashboard/admin/convocatorias',
    adminOnly: true
  },
  {
    id: 'admin-reports',
    label: 'Reportes',
    icon: Flag,
    href: '/dashboard/admin/reports',
    adminOnly: true
  },
  {
    id: 'admin-news',
    label: 'Noticias',
    icon: Rss,
    href: '/dashboard/admin/news',
    adminOnly: true
  }
];

export const getNavigationItems = (userRole: 'user' | 'admin' = 'user'): NavigationItem[] => {
  const items = [...defaultNavigationItems];
  
  if (userRole === 'admin') {
    items.push(...adminNavigationItems);
  }
  
  return items;
};
