import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { authStore } from "../../store/authStore";
import { toast } from "../../components/Toast";
import {
  Laptop,
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  BookOpen,
  AlertCircle,
  ArrowRight,
  User,
  Bell,
  History,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  Compass
} from "lucide-react";

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const sessionUser = authStore.getUser();

  // Dashboard Data States
  const [stats, setStats] = useState<any>({
    assignedAssets: 0,
    pendingRequests: 0,
    todayBookings: 0,
    upcomingReturns: 0,
  });
  const [assets, setAssets] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, assetsRes, notifsRes, activityRes] = await Promise.all([
        api.get("/employee/dashboard/stats"),
        api.get("/employee/dashboard/assets-preview"),
        api.get("/employee/dashboard/notifications"),
        api.get("/employee/dashboard/activity"),
      ]);

      setStats(statsRes);
      setAssets(assetsRes);
      setNotifications(notifsRes);
      setActivities(activityRes);
    } catch (err: any) {
      console.error("Error loading employee dashboard:", err);
      toast.error("Failed to load personal dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, status: "read" } : n))
    );
    toast.success("Notification marked as read.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3 text-slate-400 font-semibold text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
        <span>Loading your personal workspace today...</span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* 1. Header & Quick Greeting */}
      <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,.04)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            Good Morning, {sessionUser?.name?.split(" ")[0] || "Employee"} 👋
          </h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Department: <span className="font-extrabold text-[#4F46E5]">{sessionUser?.departmentId || "General Engineering"}</span>
            {" • "}
            Employee ID: <span className="font-mono font-extrabold">{sessionUser?.employeeId || "EMP-1024"}</span>
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-secondary py-2 px-3.5 flex items-center gap-1.5 font-bold text-[11px] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Workspace
        </button>
      </div>

      {/* 2. Welcome Card & KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Profile Card */}
        <div className="lg:col-span-4 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#6366F1] to-[#4F46E5]" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-[#4F46E5] text-xl shadow-inner select-none shrink-0">
                {sessionUser?.name?.split(" ").map(n => n[0]).join("") || "EM"}
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-850 leading-none">
                  {sessionUser?.name || "Employee User"}
                </h3>
                <span className="text-[10px] font-extrabold tracking-widest text-[#4F46E5] uppercase mt-1.5 block">
                  {sessionUser?.designation || "Staff Associate"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-[11px] font-semibold text-slate-600 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Office Desk:</span>
                <span className="font-bold text-slate-800">{sessionUser?.officeLocation || "HQ, Floor 2"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reporting Manager:</span>
                <span className="font-bold text-slate-800">{sessionUser?.reportingManager || "Shashwat Admin"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Sign-In:</span>
                <span className="font-mono text-slate-500 font-bold">Today, 09:15 AM</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/employee/profile")}
            className="w-full btn-secondary text-[11px] py-2 mt-5 flex items-center justify-center gap-1.5 font-bold cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-450" /> View Account Details
          </button>
        </div>

        {/* KPI Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 gap-6">
          {/* Assigned Assets */}
          <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] flex flex-col justify-between h-36 relative group hover:-translate-y-1 transition-all">
            <div className="p-2 bg-indigo-50 text-[#4F46E5] rounded-xl w-fit">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Assigned Assets
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-850 font-mono">
                  {stats.assignedAssets}
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-sans">hardware tags</span>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] flex flex-col justify-between h-36 relative group hover:-translate-y-1 transition-all">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl w-fit">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Pending Requests
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-amber-600 font-mono">
                  {stats.pendingRequests}
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-sans">active tickets</span>
              </div>
            </div>
          </div>

          {/* Today's Bookings */}
          <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] flex flex-col justify-between h-36 relative group hover:-translate-y-1 transition-all">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl w-fit">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Today's Bookings
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-600 font-mono">
                  {stats.todayBookings}
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-sans">reservations</span>
              </div>
            </div>
          </div>

          {/* Upcoming Returns */}
          <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] flex flex-col justify-between h-36 relative group hover:-translate-y-1 transition-all">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl w-fit">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Upcoming Returns
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-rose-600 font-mono">
                  {stats.upcomingReturns}
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-sans">due check-ins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,.04)]">
        <h4 className="font-extrabold text-[10.5px] uppercase tracking-wider text-slate-400 mb-4.5">
          Quick Actions Dashboard
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/employee/book-resource")}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-[#4F46E5]/30 rounded-2xl transition-all cursor-pointer text-slate-700 hover:text-[#4F46E5] gap-2 font-bold"
          >
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Book Resource</span>
          </button>

          <button
            onClick={() => navigate("/employee/maintenance")}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-[#4F46E5]/30 rounded-2xl transition-all cursor-pointer text-slate-700 hover:text-[#4F46E5] gap-2 font-bold"
          >
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>Raise Issue</span>
          </button>

          <button
            onClick={() => navigate("/employee/return-transfer")}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-[#4F46E5]/30 rounded-2xl transition-all cursor-pointer text-slate-700 hover:text-[#4F46E5] gap-2 font-bold"
          >
            <RefreshCw className="w-5 h-5 text-rose-500" />
            <span>Request Return</span>
          </button>

          <button
            onClick={() => navigate("/employee/return-transfer")}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-[#4F46E5]/30 rounded-2xl transition-all cursor-pointer text-slate-700 hover:text-[#4F46E5] gap-2 font-bold"
          >
            <Compass className="w-5 h-5 text-emerald-500" />
            <span>Transfer Asset</span>
          </button>
        </div>
      </div>

      {/* 4. Assets Preview & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assets Preview */}
        <div className="lg:col-span-8 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] space-y-4.5">
          <div className="flex justify-between items-center border-b pb-3">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              My Custody Assets Preview
            </h4>
            <Link
              to="/employee/assets"
              className="text-[10.5px] font-extrabold text-[#4F46E5] hover:underline flex items-center gap-1.5"
            >
              View All Assets <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {assets.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
              No hardware assets currently checked out to your profile.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border text-[#4F46E5]">
                      <Laptop className="w-4.5 h-4.5" />
                    </div>
                    <h5 className="font-black text-xs text-slate-800 mt-3 truncate">
                      {asset.name}
                    </h5>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold mt-1 block">
                      {asset.id}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] space-y-1 font-semibold text-slate-500">
                    <div className="flex justify-between">
                      <span>Condition:</span>
                      <span className="text-slate-700 font-bold">{asset.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Date:</span>
                      <span className="text-slate-700 font-mono font-bold">
                        {asset.returnDate || "Open-ended"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-4 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] space-y-4.5">
          <div className="border-b pb-3">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Today's Schedule
            </h4>
          </div>

          <div className="space-y-3">
            <div className="p-3 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center gap-3 transition-colors bg-slate-50/50">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-805 truncate">Meeting Room A</span>
                  <span className="text-[9.5px] font-mono font-bold text-[#4F46E5] shrink-0 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/50">
                    10:00 AM
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Project Discussion • Confirmed</p>
              </div>
            </div>

            <div className="p-3 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center gap-3 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-805 truncate">External Printer</span>
                  <span className="text-[9.5px] font-mono font-bold text-slate-450 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border">
                    02:30 PM
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">SLA Report Printing • Scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Notifications & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notifications Preview */}
        <div className="lg:col-span-6 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] space-y-4.5">
          <div className="flex justify-between items-center border-b pb-3">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Recent Notifications
            </h4>
            <Link
              to="/employee/notifications"
              className="text-[10.5px] font-extrabold text-[#4F46E5] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border rounded-2xl flex justify-between items-start gap-4 transition-all ${
                  n.status === "unread"
                    ? "bg-indigo-50/20 border-indigo-100"
                    : "border-slate-100"
                }`}
              >
                <div className="flex gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                    n.status === "unread" ? "bg-indigo-50 text-[#4F46E5]" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-800 block">
                      {n.title}
                    </span>
                    <p className="text-[10.5px] text-slate-450 font-semibold mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>

                {n.status === "unread" && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-[9.5px] font-black uppercase text-[#4F46E5] hover:underline shrink-0 mt-0.5 cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-6 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.05)] space-y-4.5">
          <div className="border-b pb-3">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Recent Activity Timeline
            </h4>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
            {activities.map((act) => (
              <div key={act.id} className="relative flex justify-between items-start text-xs font-semibold text-slate-705">
                {/* Node icon */}
                <div className="absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] border-[#4F46E5] bg-white z-10" />
                
                <div>
                  <span className="font-bold text-slate-800 text-[11.5px] block">{act.action}</span>
                  <span className="text-[9px] text-[#4F46E5] font-extrabold uppercase mt-1 block tracking-wider">
                    Module: {act.module}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 mt-0.5 font-mono">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span>
                    {new Date(act.timestamp).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
