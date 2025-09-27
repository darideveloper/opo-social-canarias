import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Card from './ui/Card';
import CardHeader from './ui/CardHeader';
import CardContent from './ui/CardContent';
import Button from './ui/Button';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  
  // Safely access auth context with fallback for SSR
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const isAuthenticated = authContext?.isAuthenticated || false;
  const isLoading = authContext?.isLoading || false;

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isClient, isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold">Welcome to OpoSocial</h1>
          <p className="text-muted-foreground">You are logged in!</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Authentication Status</h3>
              <p className="text-sm text-green-700">
                Welcome back, <strong>{user?.name || user?.email}</strong>!
              </p>
              <p className="text-xs text-green-600 mt-1">User ID: {user?.id}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => window.location.href = '/dashboard'} 
                className="flex-1"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => window.location.href = '/login'} 
                variant="outline"
                className="flex-1"
              >
                Login Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
