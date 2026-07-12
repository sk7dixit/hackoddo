import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  BarChart3,
  TrendingUp,
  Wrench,
  ShieldCheck,
  Download,
  Filter,
  RefreshCw,
  Info,
  ChevronRight,
} from "lucide-react";

export const AdminReportsAnalytics: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<
    | "dashboard"
    | "assets"
    | "departments"
    | "maintenance"
    | "bookings"
    | "predictive"
  >("dashboard");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    kpis: {
      totalAssets: 1284,
      assetUtilization: 91,
      maintenanceCost: "₹2.45 Lakh",
      healthScore: 94,
      employees: 328,
      bookings: 482,
      auditCompliance: 96,
      overdueAssets: 9,
    },
    analytics: {
      donutData: [],
      barData: [],
      trendData: [],
      funnelData: [],
      categoryData: [],
      ageData: [],
    },
    topResources: [],
    idleAssets: [],
    departmentAnalytics: [],
    maintenanceStats: {
      open: 12,
      resolved: 186,
      highPriority: 5,
      avgResolution: "2.6 Days",
    },
    resourceStats: {
      total: 486,
      completed: 452,
      cancelled: 18,
      upcoming: 16,
    },
    auditStats: {
      cycles: 18,
      completed: 16,
      open: 2,
      compliance: "96%",
    },
    financialStats: {
      totalValue: "₹2.8 Cr",
      maintenanceCost: "₹2.4 Lakh",
      depreciation: "₹18 Lakh",
      replacementDue: 12,
    },
    aiSuggestions: [],
  });

  const [dateRange, setDateRange] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>("/admin/reports/dashboard");
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExport = (type: string) => {
    window.open(
      `http://localhost:3000/api/admin/reports/export?type=${type}`,
      "_blank",
    );
    toast.success(`Success: exported ${type} records to CSV format.`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-semibold py-24 bg-[#F5F7FB] min-h-screen flex flex-col justify-center items-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5] mb-2" />
        <span>Loading Organization Analytics...</span>
      </div>
    );
  }

  const {
    kpis,
    analytics,
    topResources,
    idleAssets,
    departmentAnalytics,
    maintenanceStats,
    resourceStats,
    aiSuggestions,
  } = data;

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Reports & Analytics</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            Reports & System Analytics
          </h2>
          <p className="text-xs text-slate-455 font-semibold mt-1">
            Review executive dashboards, asset trends, department audit health
            compliance, maintenance costs, and AI recommendations.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 border border-slate-200 flex items-center justify-between gap-4 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-450 mr-2">Filters:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-2 py-1 text-slate-700 font-semibold cursor-pointer focus:outline-none"
          >
            <option value="All">All Time</option>
            <option value="Month">This Month</option>
            <option value="Quarter">This Quarter</option>
          </select>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-2 py-1 text-slate-700 font-semibold cursor-pointer focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="IT">IT Only</option>
            <option value="HR">HR Only</option>
            <option value="Operations">Operations Only</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("assets")}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 font-bold text-slate-650 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Assets CSV
          </button>
          <button
            onClick={() => handleExport("departments")}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 font-bold text-slate-650 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Dept CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 border border-slate-200 flex justify-between items-start h-28 relative bg-white">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Assets
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {kpis.totalAssets}
            </h2>
            <span className="text-[9px] text-emerald-500 font-bold mt-1 block">
              ＋32 This Month
            </span>
          </div>
          <BarChart3 className="w-5 h-5 text-[#4F46E5] absolute right-5 top-5" />
        </div>
        <div className="glass-card p-5 border border-slate-200 flex justify-between items-start h-28 relative bg-white">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Asset Utilization
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {kpis.assetUtilization}%
            </h2>
            <span className="text-[9px] text-emerald-500 font-bold mt-1 block">
              ↑ 6% Increase
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-500 absolute right-5 top-5" />
        </div>
        <div className="glass-card p-5 border border-slate-200 flex justify-between items-start h-28 relative bg-white">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Maintenance Cost
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {kpis.maintenanceCost}
            </h2>
            <span className="text-[9px] text-emerald-500 font-bold mt-1 block">
              ↓ 12% Savings
            </span>
          </div>
          <Wrench className="w-5 h-5 text-amber-500 absolute right-5 top-5" />
        </div>
        <div className="glass-card p-5 border border-slate-200 flex justify-between items-start h-28 relative bg-white">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Org Health Score
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {kpis.healthScore}%
            </h2>
            <span className="text-[9px] text-emerald-500 font-bold mt-1 block">
              Excellent Rating
            </span>
          </div>
          <ShieldCheck className="w-5 h-5 text-indigo-500 absolute right-5 top-5" />
        </div>
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-center h-20 text-center font-mono">
          <span className="text-[9px] text-slate-400 font-bold uppercase">
            Staff Directory
          </span>
          <span className="text-lg font-black text-slate-800 mt-0.5">
            {kpis.employees} Employees
          </span>
        </div>
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-center h-20 text-center font-mono">
          <span className="text-[9px] text-slate-400 font-bold uppercase">
            Resource Bookings
          </span>
          <span className="text-lg font-black text-slate-800 mt-0.5">
            {kpis.bookings} Booked
          </span>
        </div>
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-center h-20 text-center font-mono">
          <span className="text-[9px] text-slate-400 font-bold uppercase">
            Audit Compliance
          </span>
          <span className="text-lg font-black text-emerald-600 mt-0.5">
            {kpis.auditCompliance}% Pass
          </span>
        </div>
        <div className="p-4 bg-white border rounded-2xl flex flex-col justify-center h-20 text-center font-mono">
          <span className="text-[9px] text-slate-400 font-bold uppercase">
            Overdue Returns
          </span>
          <span className="text-lg font-black text-rose-500 mt-0.5">
            {kpis.overdueAssets} Assets
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveReportTab("dashboard")}
          className={`pb-3 relative cursor-pointer ${activeReportTab === "dashboard" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          Executive Dashboard
          {activeReportTab === "dashboard" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveReportTab("assets")}
          className={`pb-3 relative cursor-pointer ${activeReportTab === "assets" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          Asset Analytics
          {activeReportTab === "assets" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveReportTab("departments")}
          className={`pb-3 relative cursor-pointer ${activeReportTab === "departments" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          Department Health
          {activeReportTab === "departments" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveReportTab("maintenance")}
          className={`pb-3 relative cursor-pointer ${activeReportTab === "maintenance" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          Maintenance & Costs
          {activeReportTab === "maintenance" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveReportTab("bookings")}
          className={`pb-3 relative cursor-pointer ${activeReportTab === "bookings" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          Resource Bookings
          {activeReportTab === "bookings" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveReportTab("predictive")}
          className={`pb-3 relative cursor-pointer ${activeReportTab === "predictive" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          Predictive AI Insights
          {activeReportTab === "predictive" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* TAB CONTENTS */}

      {activeReportTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="glass-card p-6 bg-white border border-slate-200">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider mb-4 border-b pb-2">
              Asset Status Shares
            </h4>
            <div className="space-y-3.5">
              {analytics.donutData.map((d: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: d.color }}
                      className="w-3 h-3 rounded"
                    />
                    <span className="text-slate-800">{d.label}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-bold">
                    {d.value} items
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 lg:col-span-2 bg-white border border-slate-200">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider mb-4 border-b pb-2">
              Department Asset Distribution
            </h4>
            <div className="space-y-4">
              {analytics.barData.map((b: any, idx: number) => (
                <div key={idx} className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800">{b.label}</span>
                    <span>{b.value} Assets</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 border rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, (b.value / kpis.totalAssets) * 100 * 3.5)}%`,
                      }}
                      className="h-full bg-[#4F46E5] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeReportTab === "assets" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="p-5 border-b bg-[#FAFBFC]">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                Top 5 Frequently Used Resources
              </h4>
            </div>
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-2.5 px-4">Asset</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4 text-right">Usage</th>
                </tr>
              </thead>
              <tbody>
                {topResources.map((res: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-bold text-slate-850">
                      {res.name}
                    </td>
                    <td className="py-3 px-4">{res.department}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                      {res.usage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="p-5 border-b bg-[#FAFBFC]">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                Underutilized / Idle Assets
              </h4>
            </div>
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-2.5 px-4">Asset ID</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4 text-right">Idle Days</th>
                </tr>
              </thead>
              <tbody>
                {idleAssets.map((asset: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-bold text-slate-850">
                      {asset.name}
                    </td>
                    <td className="py-3 px-4">{asset.department}</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-500 font-bold">
                      {asset.idleDays} Days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReportTab === "departments" && (
        <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] animate-fade-in">
          <div className="p-5 border-b bg-[#FAFBFC]">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Corporate Department Health Summary
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-4">Active Staff</th>
                  <th className="py-3 px-4">Assets Assigned</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4 text-right">Compliance Index</th>
                </tr>
              </thead>
              <tbody>
                {departmentAnalytics.map((dept: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-4 px-5 text-slate-900 font-bold">
                      {dept.department}
                    </td>
                    <td className="py-4 px-4 font-mono">{dept.employees}</td>
                    <td className="py-4 px-4 font-mono">{dept.assets}</td>
                    <td className="py-4 px-4 font-mono">{dept.bookings}</td>
                    <td className="py-4 px-4">{dept.health}</td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-[#4F46E5]">
                      {dept.score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReportTab === "maintenance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <div className="glass-card p-5 border text-center flex flex-col justify-center h-28 font-mono bg-white">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Open Tickets
            </span>
            <h3 className="text-xl font-black text-rose-500 mt-1">
              {maintenanceStats.open} Active
            </h3>
          </div>
          <div className="glass-card p-5 border text-center flex flex-col justify-center h-28 font-mono bg-white">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Resolved Tickets
            </span>
            <h3 className="text-xl font-black text-emerald-600 mt-1">
              {maintenanceStats.resolved} Fixed
            </h3>
          </div>
          <div className="glass-card p-5 border text-center flex flex-col justify-center h-28 font-mono bg-white">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              High/Urgent Priority
            </span>
            <h3 className="text-xl font-black text-amber-500 mt-1">
              {maintenanceStats.highPriority} Urgent
            </h3>
          </div>
          <div className="glass-card p-5 border text-center flex flex-col justify-center h-28 font-mono bg-white">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Avg Resolution Speed
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              {maintenanceStats.avgResolution}
            </h3>
          </div>
        </div>
      )}

      {activeReportTab === "bookings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-semibold text-xs text-slate-750">
          <div className="glass-card p-5 border border-slate-200 space-y-4 bg-white">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
              Bookings Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Bookings</span>
                <span className="font-bold">{resourceStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-bold text-emerald-600">
                  {resourceStats.completed}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled</span>
                <span className="font-bold text-rose-500">
                  {resourceStats.cancelled}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming</span>
                <span className="font-bold text-indigo-500">
                  {resourceStats.upcoming}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 border border-slate-200 lg:col-span-2 bg-white">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider mb-3 border-b pb-2">
              Popular Resources Leaderboard
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="font-bold text-slate-800">
                  Conference Room A
                </span>
                <span className="font-mono text-[#4F46E5] font-black">
                  142 Bookings
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="font-bold text-slate-800">
                  Vehicle 02 (Corporate HQ)
                </span>
                <span className="font-mono text-[#4F46E5] font-black">
                  92 Bookings
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="font-bold text-slate-800">
                  Projector Pool D
                </span>
                <span className="font-mono text-[#4F46E5] font-black">
                  45 Bookings
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReportTab === "predictive" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {aiSuggestions.map((sug: any, idx: number) => (
            <div
              key={idx}
              className="glass-card p-6 space-y-4 flex flex-col justify-between h-48 hover:-translate-y-1 transition-all bg-white border border-slate-200"
            >
              <div>
                <div className="p-2 bg-indigo-50 text-[#4F46E5] w-9 h-9 rounded-xl flex items-center justify-center mb-3 border border-indigo-100">
                  <Info className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-850">
                  {sug.title}
                </h4>
                <p className="text-[10px] text-slate-450 font-semibold mt-1.5 leading-relaxed">
                  {sug.detail}
                </p>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                {sug.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportsAnalytics;
