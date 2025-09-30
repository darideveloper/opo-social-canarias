import React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
  adminOnly?: boolean;
}

export interface DashboardLayoutProps {
  title: string;
  navigationItems?: NavigationItem[];
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  showAdminSection?: boolean;
  userRole?: 'user' | 'admin';
}

export interface UserData {
  name: string;
  email: string;
  photoURL: string | null;
  subscription: string;
  role: 'user' | 'admin';
  gofitos: number;
  completedTopics: number[];
  testsTaken: number;
  testsPassed: number;
}
