import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  History,
  Search,
  Download,
  Lock,
  Cpu,
  Clock,
  User,
  Layers,
  X,
  ChevronRight,
  ShieldAlert,
  Terminal,
  FileSpreadsheet,
} from "lucide-react";

interface ActivityLog {
  id: string;
  user: string;
  module: string;
  action: string;
  asset: string;
  status: "Success" | "Failed";
  timestamp?: string;
  ip?: string;
  browser?: string;
}

interface SecurityLog {
  id: string;
  date: string;
  user: string;
  event: string;
  device: string;
  ip: string;
  status: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

interface SystemLog {
  id: string;
  service: string;
  event: string;
  time: string;
  status: string;
}

interface LoginHistory {
  id: string;
  user: string;
  login: string;
  logout: string;
  device: string;
  browser: string;
  ip: string;
  status: string;
}

interface ExportLog {
  id: string;
  user: string;
  report: string;
  format: string;
  time: string;
}

const mockLiveFeedTemplates = [
  {
    user: "admin@gmail.com",
    module: "Departments",
    action: "Created Sales Department",
    asset: "Sales",
    status: "Success",
  },
  {
    user: "Rahul Sharma",
    module: "Asset Allocation",
    action: "Allocated Laptop AF-0124 to Aman",
    asset: "AF-0124",
    status: "Success",
  },
  {
    user: "admin@gmail.com",
    module: "RBAC",
    action: "Reset password for Mohit",
    asset: "Mohit",
    status: "Success",
  },
  {
    user: "Priya Singh",
    module: "Maintenance",
    action: "Closed repair order for PR-003",
    asset: "PR-003",
    status: "Success",
  },
  {
    user: "Shashwat Admin",
    module: "Audit",
    action: "Started verification cycle AUD-001",
    asset: "AUD-001",
    status: "Success",
  },
];

export const AdminActivityLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "logs" | "user" | "asset" | "security" | "system" | "exports"
  >("dashboard");

  // Master Data
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [exportLogs, setExportLogs] = useState<ExportLog[]>([]);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Timelines
  const [assetSearchQuery, setAssetSearchQuery] = useState("AF-0007");
  const [assetTimeline, setAssetTimeline] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  const fetchData = async () => {
    try {
      const [logsData, secData, sysData, logHist, expData] = await Promise.all([
        api.get<ActivityLog[]>("/activity-logs"),
        api.get<SecurityLog[]>("/admin/security-logs"),
        api.get<SystemLog[]>("/admin/system-logs"),
        api.get<LoginHistory[]>("/admin/login-history"),
        api.get<ExportLog[]>("/admin/export-logs"),
      ]);
      setLogs(logsData);
      setSecurityLogs(secData);
      setSystemLogs(sysData);
      setLoginHistory(logHist);
      setExportLogs(expData);
      handleSearchAssetTimeline("AF-0007");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    setLiveFeed([
      {
        time: "11:45 AM",
        user: "Shashwat Admin",
        action: "Created IT Department",
      },
      {
        time: "11:42 AM",
        user: "Rahul Sharma",
        action: "MacBook Pro AF-0124 Allocated",
      },
      {
        time: "11:39 AM",
        user: "Shashwat Admin",
        action: "Password reset for Aman",
      },
      {
        time: "11:32 AM",
        user: "Priya Singh",
        action: "Maintenance check closed for Printer PR-003",
      },
    ]);

    const interval = setInterval(() => {
      const randomIdx = Math.floor(
        Math.random() * mockLiveFeedTemplates.length,
      );
      const template = mockLiveFeedTemplates[randomIdx];
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLiveFeed((prev) => [
        {
          time: now,
          user: template.user.split("@")[0],
          action: template.action,
        },
        ...prev.slice(0, 4),
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchAssetTimeline = (queryId: string) => {
    if (!queryId) return;
    const stages = [
      "Purchased on 2025-10-15",
      "Registered in inventory on 2025-10-18",
      "Allocated to Vikram Singh on 2025-10-20",
      "Transferred to IT department on 2026-02-14",
      "Scheduled for maintenance on 2026-05-10",
      "Returned to Corporate HQ stock on 2026-06-01",
      "Verified in Annual Audit on 2026-06-05",
      "Retired from service on 2026-07-12",
    ];
    setAssetTimeline(stages);
  };

  const filteredLogs = logs.filter((l) => {
    const userStr = l.user || (l as any).operator || "";
    const actionStr = l.action || "";
    const matchesSearch =
      userStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actionStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === "All" || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Activity Logs</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            Global Audit Trail Logs
          </h2>
          <p className="text-xs text-slate-455 font-semibold mt-1">
            Review live system activity feeds, secure IP logins, failed
            credentials retry events, database sync statuses, and file exports.
          </p>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Total Logs
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            428,520 Logs
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Today's Activities
          </span>
          <h2 className="text-2xl font-black text-indigo-650 mt-1 font-mono">
            2,184 Events
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Security Events
          </span>
          <h2 className="text-2xl font-black text-rose-500 mt-1 font-mono">
            18 Alerts
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Failed Logins
          </span>
          <h2 className="text-2xl font-black text-amber-500 mt-1 font-mono">
            6 Retries
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "dashboard" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <History className="w-4 h-4" />
          <span>Live Activity Feed</span>
          {activeTab === "dashboard" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "logs" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Layers className="w-4 h-4" />
          <span>Organization Logs</span>
          {activeTab === "logs" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "user" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <User className="w-4 h-4" />
          <span>User Timelines</span>
          {activeTab === "user" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("asset")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "asset" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Clock className="w-4 h-4" />
          <span>Asset Lifecycles</span>
          {activeTab === "asset" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "security" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Lock className="w-4 h-4" />
          <span>Security Audit Logs</span>
          {activeTab === "security" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "system" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Cpu className="w-4 h-4" />
          <span>System Operation Logs</span>
          {activeTab === "system" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("exports")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "exports" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Download className="w-4 h-4" />
          <span>Exports Ledger</span>
          {activeTab === "exports" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. DASHBOARD & LIVE FEED */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs font-semibold text-slate-750 animate-fade-in">
          {/* Live Feed Timeline */}
          <div className="glass-card lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
                Live Activity Feed
              </h4>
              <span className="text-[9.5px] uppercase font-bold text-[#4F46E5] tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" /> Live
                Refreshing
              </span>
            </div>

            {/* Resigned GitHub timeline nodes and lines */}
            <div className="relative border-l border-slate-200 ml-4 space-y-6 pt-3 pb-2">
              {liveFeed.map((item, idx) => (
                <div key={idx} className="relative pl-7 animate-fade-in">
                  <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-indigo-50 border-2 border-[#4F46E5] z-10" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h5 className="font-bold text-slate-850 leading-normal">
                        {item.action}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Operator: {item.user}
                      </p>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px] whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Charts drawings */}
          <div className="glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
              Module Usage Analytics
            </h4>
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Asset Allocation</span>
                  <span>42% Usage</span>
                </div>
                <div className="h-2.5 bg-slate-50 border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "42%" }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Maintenance Orders</span>
                  <span>28% Usage</span>
                </div>
                <div className="h-2.5 bg-slate-50 border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "28%" }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Audit Controls</span>
                  <span>18% Usage</span>
                </div>
                <div className="h-2.5 bg-slate-50 border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "18%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERAL ORGANIZATION LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search operator or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-9 text-xs w-64"
                />
              </div>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-770 cursor-pointer focus:outline-none"
              >
                <option value="All">All Modules</option>
                <option value="Asset Management">Assets</option>
                <option value="User Management">Users</option>
                <option value="Audit">Audits</option>
                <option value="RBAC">RBAC</option>
              </select>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Immutable System Logs
            </span>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-3 px-5">Time</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 px-5 font-mono text-slate-400">
                      {log.timestamp || "Today"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-850">
                      {log.user || (log as any).operator || "System"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px] text-slate-650">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 truncate max-w-[280px]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-600 font-bold">
                        Success
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-[#4F46E5] hover:underline font-bold cursor-pointer"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. USER TIMELINES */}
      {activeTab === "user" && (
        <div className="glass-card space-y-4 animate-fade-in text-slate-750">
          <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider border-b pb-2">
            User Session Flow Activity
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold">
            Chronological list of standard user operations within their logged
            sessions.
          </p>

          <div className="relative border-l border-slate-200 ml-4 space-y-6 pt-4 pb-2">
            <div className="relative pl-6">
              <div className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 z-10" />
              <span>
                Login to portal via Windows Device (Chrome Browser) at 09:15 AM
              </span>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 z-10" />
              <span>
                Viewed Assets Directory filter for "Laptops" at 09:20 AM
              </span>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 z-10" />
              <span>
                Raised allocation request for AF-0124 (MacBook Pro) at 09:42 AM
              </span>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-rose-500 z-10" />
              <span>Session Logged Out successfully at 12:30 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ASSET LIFECYCLES */}
      {activeTab === "asset" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-855 uppercase tracking-wider">
                  Asset Lifecycle Timeline
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Track structural status changes of hardware devices over time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Asset Code:
                </span>
                <input
                  type="text"
                  value={assetSearchQuery}
                  onChange={(e) => {
                    setAssetSearchQuery(e.target.value);
                    handleSearchAssetTimeline(e.target.value);
                  }}
                  placeholder="e.g. AF-0007"
                  className="glass-input text-xs font-mono font-bold w-36 pl-3"
                />
              </div>
            </div>

            <div className="relative border-l border-slate-200 ml-4 space-y-6 pt-4 pb-2 font-semibold text-xs text-slate-750">
              {assetTimeline.map((stage, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-indigo-50 border-2 border-[#4F46E5] z-10" />
                  <span>{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SECURITY AUDIT LOGS */}
      {activeTab === "security" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
              Security Audits Registry
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              Failed login attempts, locked devices, and password changes.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Target User</th>
                  <th className="py-2.5 px-4">Security Event</th>
                  <th className="py-2.5 px-4">IP Address</th>
                  <th className="py-2.5 px-4">Risk Badge</th>
                </tr>
              </thead>
              <tbody>
                {securityLogs.map((sec) => (
                  <tr key={sec.id}>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {sec.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-850">
                      {sec.user}
                    </td>
                    <td className="py-3 px-4">{sec.event}</td>
                    <td className="py-3 px-4 font-mono">{sec.ip}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase font-black ${
                          sec.riskLevel === "Critical"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : sec.riskLevel === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}
                      >
                        {sec.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SYSTEM LOGS */}
      {activeTab === "system" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
              System Services Status Logs
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              Database connections, backup completion cycles, and server
              caching.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-2.5 px-4">Service</th>
                  <th className="py-2.5 px-4">Log Event</th>
                  <th className="py-2.5 px-4">Time</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((sys) => (
                  <tr key={sys.id}>
                    <td className="py-3 px-4 font-bold text-slate-850">
                      {sys.service}
                    </td>
                    <td className="py-3 px-4">{sys.event}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {sys.time}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                      {sys.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. EXPORTS LEDGER */}
      {activeTab === "exports" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
              Export Ledger Timeline
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              Trace down report downloads, CSV exports, and file formats.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-2.5 px-4">Operator</th>
                  <th className="py-2.5 px-4">Report Name</th>
                  <th className="py-2.5 px-4">Format</th>
                  <th className="py-2.5 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {exportLogs.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-3 px-4 font-bold text-slate-850">
                      {exp.user}
                    </td>
                    <td className="py-3 px-4">{exp.report}</td>
                    <td className="py-3 px-4 font-mono text-[#4F46E5] font-bold">
                      {exp.format}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {exp.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOG DETAIL DRAWER */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-[420px] bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-left text-xs font-semibold text-slate-700">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
                    Log Payload Detail
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Immutable event metadata trace.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-3.5 bg-slate-50 border rounded-xl font-mono text-[11px] leading-relaxed">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-400">Activity ID:</span>
                    <span className="font-bold text-[#4F46E5]">
                      {selectedLog.id || "ACT-10239"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-400">Operator:</span>
                    <span className="font-bold">
                      {selectedLog.user ||
                        (selectedLog as any).operator ||
                        "System"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-400">Module Scope:</span>
                    <span className="font-bold">{selectedLog.module}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-400">Action:</span>
                    <span className="font-bold">{selectedLog.action}</span>
                  </div>
                  {selectedLog.asset && (
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-400">Asset Ref:</span>
                      <span className="font-bold text-[#4F46E5]">
                        {selectedLog.asset}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="font-bold">
                      {selectedLog.ip || "192.168.1.1"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-400">Browser:</span>
                    <span className="font-bold">
                      {selectedLog.browser || "Chrome"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-bold text-emerald-600">
                      {selectedLog.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full btn-secondary py-2.5 font-bold cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogs;
