import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardContent from './DashboardContent';

// Main Dashboard Component
export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Panel de Control"
      userRole="admin"
      showAdminSection={true}
    >
      <DashboardContent />
    </DashboardLayout>
  );
}