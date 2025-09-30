import React from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '../ui';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { getNavigationItems } from '../navigation/NavigationConfig';
import type { DashboardLayoutProps, NavigationItem, UserData } from '../../types/navigation';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  navigationItems,
  headerActions,
  children,
  showAdminSection = false,
  userRole = 'user'
}) => {
  // Mock user data - in a real app, this would come from context or props
  const mockUserData: UserData = {
    name: "Mar\u00EDa Garc\u00EDa",
    email: "maria@example.com",
    photoURL: null,
    subscription: "Anual Pro",
    role: userRole,
    gofitos: 1250,
    completedTopics: [1, 2, 3, 4, 5],
    testsTaken: 15,
    testsPassed: 12,
  };

  // Use provided navigation items or get default ones
  const finalNavigationItems = navigationItems || getNavigationItems(userRole);

  // Set active state based on current page title
  const navigationItemsWithActiveState: NavigationItem[] = finalNavigationItems.map(item => ({
    ...item,
    isActive: item.label.toLowerCase() === title.toLowerCase() || 
             (title === 'Panel de Control' && item.id === 'dashboard')
  }));

  const handleNavigationClick = (item: NavigationItem) => {
    // In a real app, you would handle routing here
    // For now, we'll just log the navigation
    console.log('Navigate to:', item.href);
  };

  return (
    <SidebarProvider>
      <DashboardSidebar
        navigationItems={navigationItemsWithActiveState}
        userData={mockUserData}
        onNavigationClick={handleNavigationClick}
      />
      <SidebarInset>
        <DashboardHeader
          title={title}
          userData={mockUserData}
          headerActions={headerActions}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
