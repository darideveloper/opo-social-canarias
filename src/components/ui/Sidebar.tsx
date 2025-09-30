import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Menu } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sidebar Components
const SidebarProvider = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen w-full">{children}</div>
);

const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-64 flex-col border-r bg-background">
    {children}
  </div>
);

const SidebarHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-16 items-center border-b px-4 justify-center">
    {children}
  </div>
);

const SidebarContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 overflow-auto py-2">
    {children}
  </div>
);

const SidebarMenu = ({ children }: { children: React.ReactNode }) => (
  <ul className="space-y-1 px-2">
    {children}
  </ul>
);

const SidebarMenuItem = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
);

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }>(
  ({ className, isActive = false, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-border hover:text-black",
        isActive && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarInset = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-1 flex-col overflow-hidden">
    {children}
  </div>
);

const SidebarTrigger = ({ className }: { className?: string }) => (
  <button className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9", className)}>
    <Menu className="h-4 w-4" />
  </button>
);

const SidebarFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="border-t p-2">
    {children}
  </div>
);

export { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset, 
  SidebarTrigger, 
  SidebarFooter 
};
