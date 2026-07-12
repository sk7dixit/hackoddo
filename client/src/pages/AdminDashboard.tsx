import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CircularHealthGauge, 
  SvgHorizontalBarChart, 
  SvgLineChart, 
  BookingHeatmap 
} from '../shared/AdminCharts';
import GlassCard from '../components/GlassCard';
import { 
  Laptop, 
  Users, 
  Building2, 
  UserSquare, 
  Handshake, 
  CalendarDays, 
  ClipboardCheck, 
  Wrench,
  UserPlus,
  Building,
  Tags,
  BarChart3,
  History,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Activity,
  X
} from 'lucide-react';
import api from '../services/api';

// Live count-up animation helper
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 800;
    const increment = end / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Page States
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

  // Fetch all dashboard data from `/api/admin/dashboard`
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/dashboard');
      setDashboardData(data);
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    } catch (e) {
      console.error('Failed to load admin metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-[#F5F7FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin" />
          <span className="text-slate-400 text-xs font-semibold tracking-wide">Synthesizing command metrics...</span>
        </div>
      </div>
    );
  }

  const { kpis, highlights, analytics, departmentsTable, pendingWorkQueue, recentActivities, alerts, healthIndex, stats } = dashboardData;

  const handleKpiNavigation = (target: string) => {
    navigate(target);
  };

  // Define 8 KPI Cards Config matching the new design guidelines
  const kpiCards = [
    { 
      title: 'Total Assets', 
      value: kpis.totalAssets, 
      change: '+4.2% Growth', 
      percent: 85,
      icon: Laptop, 
      circleColor: 'bg-[#EFF6FF] text-[#0EA5E9]', 
      target: '/assets' 
    },
    { 
      title: 'Active Employees', 
      value: kpis.employees, 
      change: '+2.8% Growth', 
      percent: 92,
      icon: Users, 
      circleColor: 'bg-[#EEF2FF] text-[#4F46E5]', 
      target: '/admin/employees' 
    },
    { 
      title: 'Active Departments', 
      value: kpis.departments, 
      change: '100% Active', 
      percent: 100,
      icon: Building2, 
      circleColor: 'bg-[#ECFDF5] text-[#16A34A]', 
      target: '/admin/departments' 
    },
    { 
      title: 'Asset Managers', 
      value: kpis.assetManagers, 
      change: `Online: ${kpis.onlineAssetManagers}`, 
      percent: (kpis.onlineAssetManagers / kpis.assetManagers) * 100,
      icon: UserSquare, 
      circleColor: 'bg-[#FFF7ED] text-[#F59E0B]', 
      target: '/admin/roles' 
    },
    { 
      title: 'Department Heads', 
      value: kpis.departmentHeads, 
      change: `Online: ${kpis.onlineDepartmentHeads}`, 
      percent: (kpis.onlineDepartmentHeads / kpis.departmentHeads) * 100,
      icon: Handshake, 
      circleColor: 'bg-[#EEF2FF] text-[#4F46E5]', 
      target: '/admin/employees' 
    },
    { 
      title: 'Bookings Today', 
      value: kpis.bookingsToday, 
      change: '+5.8% Growth', 
      percent: 78,
      icon: CalendarDays, 
      circleColor: 'bg-[#EFF6FF] text-[#0EA5E9]', 
      target: '/admin/calendar' 
    },
    { 
      title: 'Pending Approvals', 
      value: kpis.pendingApprovals, 
      change: 'Needs Review', 
      percent: 45,
      icon: ClipboardCheck, 
      circleColor: 'bg-[#FFF7ED] text-[#F59E0B]', 
      target: '/admin' 
    },
    { 
      title: 'Under Maintenance', 
      value: kpis.assetsUnderMaintenance, 
      change: '2 Critical', 
      percent: 60,
      icon: Wrench, 
      circleColor: 'bg-[#FFF7ED] text-[#EF4444]', 
      target: '/admin/audit' 
    }
  ];

  return (
    <div className="p-8 space-y-8 pb-16 bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      
      {/* 1. Hero Layout Header (Hero + Health Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Welcome Hero Card */}
        <div className="lg:col-span-8 bg-white border border-[#E7ECF3] p-8 rounded-[24px] flex flex-col justify-between relative overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-indigo-50/40 blur-2xl" />
          <div className="absolute left-1/3 bottom-0 w-32 h-32 rounded-full bg-emerald-50/20 blur-2xl" />

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-extrabold text-[#4F46E5] uppercase tracking-widest block">Executive Summary</span>
            <h2 className="text-[34px] font-bold text-slate-900 leading-tight">
              Good Morning, Shashwat 👋
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-1">
              Welcome back to AssetFlow ERP command portal. Everything across your organization is operating smoothly.
            </p>
          </div>

          <div className="border-t border-[#E7ECF3] my-6" />

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 font-bold">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Today's Additions</span>
              <span className="text-sm text-slate-800 block">• {highlights.newEmployees} Employees</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Approvals Queue</span>
              <span className="text-sm text-amber-600 block">• {highlights.pendingApprovals} Pending</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Service Tickets</span>
              <span className="text-sm text-rose-500 block">• {highlights.maintenanceAssets} In Repair</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Audits Status</span>
              <span className="text-sm text-indigo-500 block">• {highlights.auditsToday} Starting Today</span>
            </div>
          </div>
        </div>

        {/* Right Health Gauge Card */}
        <div className="lg:col-span-4 bg-white border border-[#E7ECF3] p-8 rounded-[24px] flex flex-col justify-between shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">Organization Health</span>
              <h3 className="text-2xl font-black text-slate-850 mt-1">{highlights.healthScore}% Excellent</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-black">+6% Trend</span>
          </div>

          <div className="flex justify-center py-4">
            <CircularHealthGauge value={highlights.healthScore} size={130} />
          </div>

          {/* Compliance meters */}
          <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4 mt-2">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Compliance</span>
              <span className="text-xs font-black text-slate-850">98%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Maintenance</span>
              <span className="text-xs font-black text-slate-850">94%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Availability</span>
              <span className="text-xs font-black text-slate-850">96%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Grid (8 Cards, 4x2 layout, TranslateY hover effect, h-150px) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => handleKpiNavigation(kpi.target)}
              className="group bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[150px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-bold text-slate-400 group-hover:text-[#4F46E5] transition-colors">{kpi.title}</span>
                  <h2 className="text-28 font-black text-slate-900 block font-sans tracking-tight">
                    <CountUp value={kpi.value} />
                  </h2>
                </div>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${kpi.circleColor} shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 mt-auto">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                  <span className="text-slate-450">Monthly Progress</span>
                  <span className="text-emerald-600">{kpi.change}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 border rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${kpi.percent}%` }}
                    className="h-full bg-[#4F46E5] rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Actions shortcuts panel - Rendered as beautiful Cards */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">Enterprise Quick Action Cards</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div
            onClick={() => navigate('/admin/create-user')}
            className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[140px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 text-center items-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-2">＋</div>
            <span className="font-extrabold text-slate-850 tracking-wider">Create Employee</span>
            <div className="w-full border-t border-slate-100 my-2" />
            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Invite Staff</span>
          </div>

          <div
            onClick={() => navigate('/admin/departments')}
            className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[140px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 text-center items-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-2">＋</div>
            <span className="font-extrabold text-slate-850 tracking-wider">Create Dept</span>
            <div className="w-full border-t border-slate-100 my-2" />
            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Manage Data</span>
          </div>

          <div
            onClick={() => navigate('/admin/categories')}
            className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[140px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 text-center items-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-2">＋</div>
            <span className="font-extrabold text-slate-850 tracking-wider">Create Category</span>
            <div className="w-full border-t border-slate-100 my-2" />
            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Categorize</span>
          </div>

          <div
            onClick={() => navigate('/admin/audit')}
            className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[140px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 text-center items-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-2">＋</div>
            <span className="font-extrabold text-slate-850 tracking-wider">Start Audit</span>
            <div className="w-full border-t border-slate-100 my-2" />
            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Compliance</span>
          </div>

          <div
            onClick={() => navigate('/admin/reports')}
            className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[140px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 text-center items-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-2">＋</div>
            <span className="font-extrabold text-slate-850 tracking-wider">Generate Report</span>
            <div className="w-full border-t border-slate-100 my-2" />
            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Export CSV</span>
          </div>

          <div
            onClick={() => navigate('/admin/activity-logs')}
            className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 flex flex-col justify-between h-[140px] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 text-center items-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-2">👁</div>
            <span className="font-extrabold text-slate-850 tracking-wider">Activity Logs</span>
            <div className="w-full border-t border-slate-100 my-2" />
            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Audit Trails</span>
          </div>
        </div>
      </div>

      {/* 4. Split Visual Analytics (Donut & Horizontal Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-[#4F46E5]" />
              Asset Distribution Share
            </h3>
            <button className="text-[9.5px] bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 px-2 py-0.5 rounded font-black">All Assets</button>
          </div>
          <div className="py-2">
            <SvgHorizontalBarChart data={analytics.donutData} />
          </div>
          <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-450 font-bold">
            <span>Aggregated from categories registry</span>
            <span className="text-indigo-650 font-extrabold">92% Healthy</span>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
              Department Asset Distribution
            </h3>
            <button className="text-[9.5px] bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 px-2 py-0.5 rounded font-black">Monthly View</button>
          </div>
          <div className="py-2">
            <SvgHorizontalBarChart data={analytics.barData} />
          </div>
          <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-450 font-bold">
            <span>Compared to last month: +5%</span>
            <span className="text-emerald-600 font-extrabold">Optimal</span>
          </div>
        </GlassCard>
      </div>

      {/* Second Analytics Row (Line Chart & Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Maintenance Ticket Trend
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">Past 30 Days</span>
          </div>
          <div className="py-2">
            <SvgLineChart data={analytics.trendData} height={180} />
          </div>
        </GlassCard>

        <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Peak Resource Bookings Heatmap
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">Operational Hours</span>
          </div>
          <div className="py-2">
            <BookingHeatmap data={analytics.heatmapData} />
          </div>
        </GlassCard>
      </div>

      {/* 5. Split Section: Large Corporate Table & Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Department Summary Table (8 columns) */}
        <div className="lg:col-span-8 space-y-2">
          <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">Corporate Department Overview</h3>
          <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E7ECF3] text-slate-400 font-bold uppercase tracking-wider bg-slate-50">
                    <th className="py-3.5 px-5">Department</th>
                    <th className="py-3.5 px-4">Employees</th>
                    <th className="py-3.5 px-4">Assets</th>
                    <th className="py-3.5 px-4">Bookings</th>
                    <th className="py-3.5 px-4">Maintenance</th>
                    <th className="py-3.5 px-4">Health</th>
                    <th className="py-3.5 px-4">Manager</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-750">
                  {departmentsTable.map((dept: any, index: number) => (
                    <tr 
                      key={index} 
                      onClick={() => setSelectedDept(dept)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5 text-[#4F46E5] font-bold">{dept.department}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{dept.employees}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{dept.assets}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{dept.bookings}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{dept.maintenance}</td>
                      <td className="py-4 px-4">
                        <span className="text-base select-none leading-none">{dept.health}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-650">{dept.manager}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Priority Work Queue (4 columns) */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">Pending Work Queue</h3>
          <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-4 max-h-[305px] overflow-y-auto space-y-3.5 pr-2">
            {pendingWorkQueue.map((item: any, idx: number) => {
              let priorityColor = 'text-slate-500 bg-slate-50 border-slate-200';
              if (item.priority === 'Critical') priorityColor = 'text-rose-600 bg-rose-50 border-rose-100';
              else if (item.priority === 'High') priorityColor = 'text-amber-600 bg-amber-50 border-amber-100';
              
              return (
                <div key={idx} className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-[16px] space-y-2 text-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-extrabold text-slate-800 leading-snug">{item.type}</span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${priorityColor}`}>{item.priority}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{item.detail}</p>
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[9px] font-bold text-slate-400">
                    <span>By: {item.assignedTo} • {item.time}</span>
                    <button className="text-[#4F46E5] hover:underline flex items-center gap-0.5 uppercase tracking-wide font-extrabold">
                      Resolve <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </GlassCard>
        </div>

      </div>

      {/* 6. Timeline and Organization Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Activity Timeline (7 columns) */}
        <div className="lg:col-span-7 space-y-2">
          <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">System Activity Timeline</h3>
          <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-5 max-h-[300px] overflow-y-auto space-y-4">
            {recentActivities.map((act: any, idx: number) => (
              <div key={idx} className="flex gap-4 text-xs">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] mt-1 shadow-[0_0_6px_rgba(22,163,74,0.3)]" />
                  {idx < recentActivities.length - 1 && (
                    <div className="w-[1px] flex-grow bg-slate-100 mt-2" />
                  )}
                </div>
                <div className="pb-2 text-slate-700 leading-normal">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black text-slate-400">{act.time}</span>
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase tracking-wide border border-emerald-100/50">Success</span>
                  </div>
                  <p className="font-semibold text-slate-850 mt-1">{act.message}</p>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Organization Alerts (5 columns) */}
        <div className="lg:col-span-5 space-y-2">
          <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">Critical Alerts Ledger</h3>
          <GlassCard className="bg-white border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] p-5 max-h-[300px] overflow-y-auto space-y-3">
            {alerts.map((al: any, idx: number) => (
              <div 
                key={idx}
                className="p-3.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 rounded-[16px] flex items-start gap-3 cursor-pointer transition-all active:scale-[0.99]"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold text-slate-750 leading-snug">
                  <span className="text-rose-605 font-extrabold uppercase text-[9px] block mb-1">Critical Priority alert</span>
                  <p>{al.message}</p>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

      </div>

      {/* 7. Department Health Indices (Beautiful Radial Cards) */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">Department Health Index Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {healthIndex.map((dept: any, idx: number) => (
            <div 
              key={idx}
              className="bg-white border border-[#E7ECF3] rounded-[22px] p-4.5 flex items-center justify-between transition-all duration-200 hover:shadow-md"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{dept.name} Health</span>
                <h4 className="text-[28px] font-black text-slate-800 leading-none">{dept.score}%</h4>
                <p className="text-[8px] text-slate-405 font-bold uppercase">Compliance Score</p>
              </div>

              {/* Miniature progress circle */}
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg width="44" height="44" className="transform -rotate-90">
                  <circle cx="22" cy="22" r="16" fill="transparent" stroke="#F1F5F9" strokeWidth="3.5" />
                  <circle
                    cx="22"
                    cy="22"
                    r="16"
                    fill="transparent"
                    stroke={dept.color}
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={2 * Math.PI * 16 - (dept.score / 100) * 2 * Math.PI * 16}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[8.5px] font-black text-slate-700">{dept.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Organization Statistics (Bottom Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 space-y-1">
          <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Most Used Category</span>
          <p className="text-xs font-black text-slate-800">{stats.mostUsedCategory}</p>
        </div>
        <div className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 space-y-1">
          <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Most Active Department</span>
          <p className="text-xs font-black text-slate-800">{stats.mostActiveDepartment}</p>
        </div>
        <div className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 space-y-1">
          <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Highest Resource booked</span>
          <p className="text-xs font-black text-slate-800">{stats.highestBookingResource}</p>
        </div>
        <div className="bg-white border border-[#E7ECF3] rounded-[22px] p-5 space-y-1">
          <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Idle Physical Assets</span>
          <p className="text-xs font-black text-slate-800">{stats.idleAssets} Devices</p>
        </div>
      </div>

      {/* 9. Interactive Department Details Slide-Out Drawer */}
      {selectedDept && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-left border-l border-[#E7ECF3]">
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Department Details Drawer</h3>
                  <span className="text-[#4F46E5] font-extrabold uppercase text-[10px] tracking-wider">Corporate Audit Details</span>
                </div>
                <button 
                  onClick={() => setSelectedDept(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-450 hover:text-slate-850"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department details content */}
              <div className="space-y-6 text-xs font-semibold text-slate-700">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Department Name</span>
                    <p className="text-sm font-black text-slate-900">{selectedDept.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Status health</span>
                    <p className="text-base select-none mt-0.5">{selectedDept.health} Healthy</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-405 tracking-wider">Metrics Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] text-slate-450 uppercase tracking-wide block">Employees</span>
                      <span className="text-lg font-black text-slate-800 font-mono">{selectedDept.employees}</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] text-slate-450 uppercase tracking-wide block">Assets Managed</span>
                      <span className="text-lg font-black text-slate-800 font-mono">{selectedDept.assets}</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] text-slate-450 uppercase tracking-wide block">Bookings Booked</span>
                      <span className="text-lg font-black text-slate-800 font-mono">{selectedDept.bookings}</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] text-slate-450 uppercase tracking-wide block">Active Repairs</span>
                      <span className="text-lg font-black text-rose-500 font-mono">{selectedDept.maintenance}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold text-slate-405 tracking-wider">Assigned Leadership</h4>
                  <div className="p-3 bg-white border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center font-black">
                      {selectedDept.manager.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-850 text-xs block leading-none">{selectedDept.manager}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">HOD / Department Leader</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/25 border border-indigo-100/50 rounded-2xl space-y-2">
                  <span className="text-[10px] text-[#4F46E5] uppercase font-extrabold tracking-wide block">Audit Compliance Log</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    The department of {selectedDept.department} was last verified during the Q2 Mid-Year Audit. Under the governance of HOD {selectedDept.manager}, physical inventory discrepancy rates remained below 1.5%.
                  </p>
                </div>

              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDept(null);
                navigate(`/admin/departments`);
              }}
              className="w-full bg-[#4F46E5] text-white text-xs py-3.5 mt-8 flex items-center justify-center gap-1.5 shadow-sm rounded-xl font-bold"
            >
              <span>Manage Department Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 10. Footer Section */}
      <footer className="border-t border-slate-200 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between text-[10.5px] font-bold text-slate-450 uppercase tracking-wide gap-3 select-none">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">AssetFlow ERP Portal</span>
          <span className="text-slate-300">|</span>
          <span>Version 1.0</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span>Last Sync: Today, {syncTime}</span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shadow-[0_0_4px_rgba(22,163,74,0.5)]" />
            <span>Server: Online</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AdminDashboard;
