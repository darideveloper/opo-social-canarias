import React from 'react';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}
