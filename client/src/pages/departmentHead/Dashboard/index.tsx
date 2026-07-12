import React from 'react';
import DepartmentHero from './components/DepartmentHero';
import DepartmentStats from './components/DepartmentStats';
import QuickActions from './components/QuickActions';
import AssetStatusChart from './components/AssetStatusChart';
import AllocationChart from './components/AllocationChart';
import BookingWidget from './components/BookingWidget';
import PendingApprovalWidget from './components/PendingApprovalWidget';
import UpcomingReturns from './components/UpcomingReturns';
import MaintenanceQueue from './components/MaintenanceQueue';
import RecentActivities from './components/RecentActivities';
import NotificationWidget from './components/NotificationWidget';
import DepartmentHealth from './components/DepartmentHealth';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* 1. Welcome Hero Banner */}
      <DepartmentHero />

      {/* 2. Six KPI Cards */}
      <DepartmentStats />

      {/* 3. Quick Action Shortcuts */}
      <QuickActions />

      {/* 4. Charts & Booking Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AssetStatusChart />
        <AllocationChart />
        <BookingWidget />
      </div>

      {/* 5. Approvals, Returns & Maintenance Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PendingApprovalWidget />
        </div>
        <div>
          <UpcomingReturns />
        </div>
        <div>
          <MaintenanceQueue />
        </div>
      </div>

      {/* 6. Timeline, Notifications & Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentActivities />
        <NotificationWidget />
        <DepartmentHealth />
      </div>
    </div>
  );
};

export default Dashboard;
