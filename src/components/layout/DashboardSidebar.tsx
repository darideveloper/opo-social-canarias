import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  AppLogo,
} from '../ui';
import ProfileSummary from '../navigation/ProfileSummary';
import type { NavigationItem, UserData } from '../../types/navigation';

interface DashboardSidebarProps {
  navigationItems: NavigationItem[];
  userData: UserData;
  totalTopics?: number;
  onNavigationClick?: (item: NavigationItem) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  navigationItems,
  userData,
  totalTopics = 42,
  onNavigationClick
}) => {
  const handleNavigationClick = (item: NavigationItem) => {
    if (onNavigationClick) {
      onNavigationClick(item);
    } else {
      // Default behavior - you might want to implement routing here
      console.log('Navigate to:', item.href);
    }
  };

  const filteredNavigationItems = navigationItems.filter(item => 
    !item.adminOnly || userData.role === 'admin'
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <ProfileSummary userData={userData} totalTopics={totalTopics} />
        <SidebarMenu>
          {filteredNavigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  isActive={item.isActive}
                  onClick={() => handleNavigationClick(item)}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* You can add footer content here if needed */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
