import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  User,
  ShieldCheck,
  Terminal,
  Download,
  Play,
  Lock,
  ChevronRight,
  Database,
} from "lucide-react";

export const AdminProfile: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "profile" | "security" | "demo"
  >("profile");
  const [sessions, setSessions] = useState<any[]>([]);
  const [resetting, setResetting] = useState(false);

  const fetchProfileData = async () => {
    try {
      const sess = await api.get<any[]>("/admin/login-history");
      setSessions(sess.filter((s) => s.logout === "Active"));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleRevokeSession = async (sessId: string) => {
    try {
      await api.delete(`/admin/sessions/${sessId}`);
      toast.success("Login session terminated.");
      fetchProfileData();
    } catch (e) {
      toast.error("Failed to revoke session.");
    }
  };

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await api.post("/demo/reset");
      toast.success("Demo Database reset and seeded successfully.");
    } catch (e) {
      toast.error("Failed to reset demo database.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">My Profile</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            Operator Profile
          </h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Manage admin settings, active logins, credentials, and seed database
            configurations.
          </p>
        </div>
      </div>

      {/* Profile Hero Section */}
      <div className="glass-card flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4.5">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border flex items-center justify-center text-[#4F46E5] font-black text-2xl uppercase shadow-inner">
            SD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-850 font-sans">
                Shashwat Dixit
              </h2>
              <span className="bg-indigo-50 border text-[#4F46E5] px-2 py-0.5 rounded text-[9.5px] uppercase font-black tracking-wider">
                System Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              AssetFlow ERP Command Center • Joined Oct 2025
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toast.success("Profile summary downloaded.")}
            className="btn-secondary py-2.5 px-4 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" /> Export Profile
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeSubTab === "profile" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
          {activeSubTab === "profile" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("security")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeSubTab === "security" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security Center</span>
          {activeSubTab === "security" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("demo")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeSubTab === "demo" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Terminal className="w-4 h-4" />
          <span>Demo Settings</span>
          {activeSubTab === "demo" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* SUB-TAB PANELS */}

      {/* 1. MY PROFILE */}
      {activeSubTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          {/* Profile Card details */}
          <div className="glass-card lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Account Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] leading-relaxed">
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-bold text-slate-800">EMP-0001</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-bold text-slate-800">
                  admin@gmail.com
                </span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span className="text-slate-400">Contact Number:</span>
                <span className="font-bold text-slate-800">
                  +91 98765 43210
                </span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span className="text-slate-400">Account Status:</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
            </div>

            {/* Mock Update credentials */}
            <div className="border-t pt-4 space-y-3.5 max-w-sm">
              <h5 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                Update Account Security
              </h5>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Current Password
                </label>
                <input
                  type="password"
                  value="•••••"
                  disabled
                  className="glass-input text-xs pl-3 font-bold"
                />
              </div>
              <button
                onClick={() => toast.success("Credentials update requested.")}
                className="btn-secondary py-2 px-4 font-bold cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Operator Metrics
            </h4>
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span>Login Sessions Today</span>
                <span className="font-mono font-bold text-[#4F46E5]">
                  4 sessions
                </span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span>Audit Schedules Created</span>
                <span className="font-mono font-bold text-[#4F46E5]">
                  12 audits
                </span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <span>Export Ledgers Printed</span>
                <span className="font-mono font-bold text-[#4F46E5]">
                  28 reports
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECURITY CENTER & LOGINS */}
      {activeSubTab === "security" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-sm text-slate-855 uppercase tracking-wider">
              Active Device Sessions
            </h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Audit traceability log
            </span>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-3 px-4 font-bold uppercase">Device</th>
                  <th className="py-3 px-4 font-bold uppercase">Browser</th>
                  <th className="py-3 px-4 font-bold uppercase">IP Address</th>
                  <th className="py-3 px-4 font-bold uppercase">Login Time</th>
                  <th className="py-3 px-4 font-bold uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-slate-400" /> {s.device}
                    </td>
                    <td className="py-3 px-4 font-mono">{s.browser}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {s.ip}
                    </td>
                    <td className="py-3 px-4 font-mono">{s.login}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="text-rose-500 hover:underline font-bold cursor-pointer"
                      >
                        Revoke Session
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DEMO SETTINGS */}
      {activeSubTab === "demo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          <div className="glass-card lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Judges Demo Toolkit
            </h4>
            <p className="text-[10px] text-slate-450 leading-normal font-semibold">
              Simulate dashboard events or reset states instantly between
              judging rotations.
            </p>

            <div className="flex gap-2.5 flex-wrap pt-2">
              <button
                onClick={handleResetDemo}
                disabled={resetting}
                className="btn-primary py-2.5 px-5 font-bold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,.25)] cursor-pointer"
              >
                <Database className="w-4 h-4" />{" "}
                {resetting ? "Resetting..." : "Reset Demo Data"}
              </button>
              <button
                onClick={() => toast.success("Mock reports populated.")}
                className="btn-secondary py-2.5 px-4.5 font-bold cursor-pointer"
              >
                Generate Reports
              </button>
            </div>
          </div>

          {/* Demo checklist */}
          <div className="glass-card space-y-4 font-semibold text-xs">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Demo Ready Checklist
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span> <span>Admin Credentials Active</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span> <span>Asset Catalog Seeded</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span> <span>IT Department Mock Audit Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
