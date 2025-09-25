import React from 'react';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}
