import React from 'react';
import { SidebarTrigger } from '../ui';
import UserNav from '../navigation/UserNav';
import type { UserData } from '../../types/navigation';

interface DashboardHeaderProps {
  title: string;
  userData: UserData;
  headerActions?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  userData,
  headerActions
}) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold hidden md:block">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {headerActions}
        <UserNav userData={userData} />
      </div>
    </header>
  );
};

export default DashboardHeader;
