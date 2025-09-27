import React, { useState, useEffect } from 'react';
import { authService } from '../lib/auth';
import Card from './ui/Card';
import CardHeader from './ui/CardHeader';
import CardContent from './ui/CardContent';
import Button from './ui/Button';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [protectedData, setProtectedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.checkAuth();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.getProtectedData();
      if (response.success) {
        setProtectedData(response.data);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Welcome, {user?.name || user?.email}!</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are successfully logged in. Your user ID is: {user?.id}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Protected Data</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchProtectedData} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Protected Data'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {protectedData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-medium text-green-800 mb-2">Protected Data Retrieved:</h3>
                <pre className="text-sm text-green-700 whitespace-pre-wrap">
                  {JSON.stringify(protectedData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
