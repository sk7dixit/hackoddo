import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgDonutChart, SvgBarChart } from '../../../shared/SvgCharts';
import GlassCard from '../../../components/GlassCard';
import { 
  Laptop, 
  Handshake, 
  Wrench, 
  RefreshCw, 
  RotateCcw, 
  ClipboardCheck, 
  Plus, 
  ChevronRight, 
  Bell, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  availableAssets: number;
  allocatedAssets: number;
  maintenanceAssets: number;
  pendingTransfers: number;
  pendingReturns: number;
  auditPending: number;
}

interface PendingApproval {
  type: string;
  asset: string;
  employee: string;
  status: string;
}

interface RecentActivity {
  time: string;
  message: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
}

interface UpcomingReturn {
  asset: string;
  employee: string;
  returnDate: string;
  daysLeft: number;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // API Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [upcomingReturns, setUpcomingReturns] = useState<UpcomingReturn[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [
          statsRes, 
          pendingRes, 
          activityRes, 
          statusRes, 
          notifRes,
          returnsRes
        ] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard').then(r => r.json()),
          fetch('http://localhost:5000/api/dashboard/pending').then(r => r.json()),
          fetch('http://localhost:5000/api/dashboard/activity').then(r => r.json()),
          fetch('http://localhost:5000/api/dashboard/status').then(r => r.json()),
          fetch('http://localhost:5000/api/dashboard/notifications').then(r => r.json()),
          fetch('http://localhost:5000/api/dashboard/returns').then(r => r.json()),
        ]);

        setStats(statsRes);
        setPendingApprovals(pendingRes);
        setActivities(activityRes);
        setStatusData(statusRes);
        setNotifications(notifRes);
        setUpcomingReturns(returnsRes);
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatClock = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#5B5BD6]/20 border-t-[#5B5BD6] rounded-full animate-spin" />
          <span className="text-slate-400 text-xs font-semibold tracking-wide">Syncing dashboard metrics...</span>
        </div>
      </div>
    );
  }

  const handleKpiClick = (route: string) => {
    navigate(route);
  };

  const kpis = [
    { label: 'Available Assets', value: stats.availableAssets, icon: Laptop, color: 'text-emerald-600 border-emerald-200 bg-emerald-50', indicator: '↗ +5.2%', route: '/assets?status=available' },
    { label: 'Allocated Assets', value: stats.allocatedAssets, icon: Handshake, color: 'text-[#5B5BD6] border-[#5B5BD6]/20 bg-[#5B5BD6]/5', indicator: '↗ +12.4%', route: '/assets?status=allocated' },
    { label: 'Under Maintenance', value: stats.maintenanceAssets, icon: Wrench, color: 'text-orange-600 border-orange-200 bg-orange-50', indicator: '↘ -1.8%', route: '/assets?status=under_maintenance' },
    { label: 'Pending Transfers', value: stats.pendingTransfers, icon: RefreshCw, color: 'text-sky-600 border-sky-200 bg-sky-50', indicator: '↗ +2.1%', route: '/transfers' },
    { label: 'Pending Returns', value: stats.pendingReturns, icon: RotateCcw, color: 'text-pink-600 border-pink-200 bg-pink-50', indicator: '↘ -6.5%', route: '/returns' },
    { label: 'Audit Pending', value: stats.auditPending, icon: ClipboardCheck, color: 'text-amber-600 border-amber-200 bg-amber-50', indicator: 'Active', route: '/audit' },
  ];

  const quickActions = [
    { label: 'Register Asset', path: '/assets', icon: Plus },
    { label: 'Allocate Asset', path: '/allocation', icon: Handshake },
    { label: 'View Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Run Audit', path: '/audit', icon: ClipboardCheck },
    { label: 'View Returns', path: '/returns', icon: RotateCcw },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const getApprovalRoute = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transfer': return '/transfers';
      case 'maintenance': return '/maintenance';
      case 'return': return '/returns';
      default: return '/dashboard';
    }
  };

  const getApprovalActionLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transfer': return 'View';
      case 'maintenance': return 'Review';
      case 'return': return 'Verify';
      default: return 'Open';
    }
  };

  const categoryData = [
    { label: 'Electronics', value: 100 },
    { label: 'Furniture', value: 60 },
    { label: 'Vehicles', value: 20 },
    { label: 'Meeting Rooms', value: 30 },
    { label: 'Printers', value: 27 }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-16">
      
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-800">Asset Manager Dashboard</h2>
        <p className="text-[11px] text-slate-400 font-semibold">Monitor organizational hardware resources and pending approval queues.</p>
      </div>

      {/* 1. Welcome Banner - Slim Compact Layout */}
      <div className="glass-card bg-white border-slate-200 p-4.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 leading-none">
            Good Morning, John Carter 👋
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold">
            Today is <span className="text-slate-800 font-bold">12 July 2026</span> | You have <span className="text-[#5B5BD6] font-bold">{pendingApprovals.length} pending approvals</span> requiring attention.
          </p>
        </div>

        {/* Live Clock Frame */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2.5 self-start md:self-center">
          <Clock className="w-3.5 h-3.5 text-[#5B5BD6]" />
          <span className="font-mono text-sm font-extrabold text-slate-800 tracking-wider">
            {formatClock(currentTime)}
          </span>
        </div>
      </div>

      {/* 2. KPI Cards Grid - Compact 110px */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => handleKpiClick(kpi.route)}
              className="glass-card border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all duration-200 p-4 group flex flex-col justify-between h-[105px]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xl font-extrabold text-slate-800 font-mono leading-none">{kpi.value}</span>
                <div className={`p-1.5 rounded-lg border ${kpi.color} shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-[10px] text-slate-500 group-hover:text-slate-700 transition-colors font-semibold">
                  {kpi.label}
                </p>
                <span className={`text-[9px] font-bold font-mono ${
                  kpi.indicator.includes('+') ? 'text-emerald-600' : kpi.indicator.includes('-') ? 'text-rose-500' : 'text-amber-600'
                }`}>
                  {kpi.indicator}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* 3. Quick Actions shortcuts panel */}
      <div className="space-y-2.5">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.98]"
              >
                <Icon className="w-3.5 h-3.5 text-[#5B5BD6]" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Split Section: Pending Approvals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Approvals Table (2/3 width) */}
        <div className="lg:col-span-2 space-y-2.5">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Pending Approvals Queue</h3>
          <GlassCard className="border-slate-200 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50 sticky top-0">
                    <th className="py-3 px-4">Approval Type</th>
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {pendingApprovals.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          item.type === 'Transfer' ? 'badge-allocated' : item.type === 'Return' ? 'badge-available' : 'badge-maintenance'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{item.asset}</td>
                      <td className="py-3 px-4 text-slate-600">{item.employee}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{item.status}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => navigate(getApprovalRoute(item.type))}
                          className="btn-secondary py-1 px-2.5 text-[10.5px] inline-flex items-center gap-1 text-[#5B5BD6] hover:border-[#5B5BD6]/30"
                        >
                          <span>{getApprovalActionLabel(item.type)}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity Timeline (1/3 width) */}
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase font-extrabold text-slate-550 tracking-wider">Recent Activity Timeline</h3>
          <GlassCard className="border-slate-200 max-h-[295px] overflow-y-auto pr-1">
            <div className="space-y-4">
              {activities.map((act, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#5B5BD6] mt-1.5 shadow-[0_0_4px_rgba(91,91,214,0.3)]" />
                    {idx < activities.length - 1 && (
                      <div className="w-[1px] flex-grow bg-slate-200 mt-1.5" />
                    )}
                  </div>
                  <div className="pb-2 text-slate-700">
                    <span className="text-[10px] font-mono text-slate-400 font-bold block">{act.time}</span>
                    <p className="leading-snug font-semibold mt-0.5">{act.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* 5. Split Section: Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Asset States */}
        <GlassCard className="border-slate-200">
          <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-6">
            Asset Status Summary
          </h3>
          <div className="py-2">
            <SvgDonutChart data={statusData} />
          </div>
        </GlassCard>

        {/* Bar Chart: Category distribution */}
        <GlassCard className="border-slate-200">
          <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-6">
            Category Asset Shares
          </h3>
          <div className="py-2">
            <SvgBarChart data={categoryData} />
          </div>
        </GlassCard>
      </div>

      {/* 6. Split Section: Upcoming Returns & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Returns List (2/3 width) */}
        <div className="lg:col-span-2 space-y-2.5">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Upcoming Returns Calendar</h3>
          <GlassCard className="border-slate-200 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50 sticky top-0">
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Custodian Employee</th>
                    <th className="py-3 px-4">Expected Return Date</th>
                    <th className="py-3 px-4 text-right">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {upcomingReturns.map((ret, idx) => {
                    const isOverdue = ret.daysLeft < 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-600">{ret.asset}</td>
                        <td className="py-3.5 px-4 text-slate-600">{ret.employee}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">{ret.returnDate}</td>
                        <td className="py-3.5 px-4 text-right">
                          {isOverdue ? (
                            <span className="badge badge-danger flex items-center gap-1 justify-end w-24 ml-auto">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Overdue</span>
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono font-bold">{ret.daysLeft} days</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Notifications Widget (1/3 width) */}
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">System Notifications</h3>
          <GlassCard className="border-slate-200 flex flex-col justify-between h-full min-h-[295px]">
            <div className="space-y-3.5 overflow-y-auto max-h-[195px] pr-1">
              {notifications.slice(0, 5).map(notif => (
                <div key={notif.id} className="text-xs border-l-2 border-[#5B5BD6]/40 pl-3 py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-700 leading-none">{notif.title}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold shrink-0">
                      {new Date(notif.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 leading-snug font-medium">{notif.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-3.5 border-t border-slate-100 mt-3.5 shrink-0">
              <button
                onClick={() => navigate('/notifications')}
                className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#5B5BD6] hover:text-[#4545af] group py-1"
              >
                <span>View All Notifications</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
