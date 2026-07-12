import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Settings,
  Building2,
  ShieldAlert,
  Smartphone,
  FolderLock,
  CalendarDays,
  DatabaseBackup,
  Link2,
  Search,
  ArrowLeft,
  Save,
  RefreshCw,
  Laptop,
  Play,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

interface SettingHistory {
  id: string;
  timestamp: string;
  setting: string;
  changedBy: string;
  from: string;
  to: string;
}

interface ActiveSession {
  id: string;
  user: string;
  login: string;
  logout: string;
  device: string;
  browser: string;
  ip: string;
  status: string;
}

export const AdminSettings: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings State
  const [settings, setSettings] = useState<any>({
    general: {
      orgName: "",
      orgCode: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      timezone: "IST (UTC+5:30)",
      language: "English",
      currency: "USD",
      branding: {
        primaryColor: "#4F46E5",
        secondaryColor: "#6366F1",
        theme: "light",
      },
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12 Hours",
    },
    organization: {
      multipleBranches: true,
      deptHierarchy: "Standard",
      employeeIdFormat: "EMP-XXXX",
      financialYear: "Apr - Mar",
      workingDays: [],
    },
    assetPolicies: {
      allowDuplicateSerial: false,
      qrCodeRequired: true,
      photoMandatory: true,
      warrantyTracking: true,
      returnRules: {
        maxDelayDays: 15,
        autoOverdue: true,
        reminderDaysBefore: 7,
      },
    },
    bookingRules: {
      maxBookingHours: 8,
      advanceBookingDays: 30,
      minNoticeMinutes: 30,
      bufferMinutes: 15,
      doubleBookingRestricted: true,
    },
    maintenanceRules: {
      slas: {
        Low: 7,
        Medium: 5,
        High: 2,
        Critical: 1,
      },
    },
    backupSettings: {
      schedule: "Daily",
      includeData: [],
    },
    integrations: {
      googleCalendar: false,
      outlook: false,
      cloudStorage: true,
      smtpConfigured: true,
    },
  });

  const [history, setHistory] = useState<SettingHistory[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [backingUp, setBackingUp] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);

  const fetchSettingsData = async () => {
    try {
      const [sets, hist, sess] = await Promise.all([
        api.get("/admin/settings"),
        api.get<SettingHistory[]>("/admin/settings/history"),
        api.get<ActiveSession[]>("/admin/login-history"),
      ]);
      setSettings(sets);
      setHistory(hist);
      setSessions(sess.filter((s) => s.logout === "Active"));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      await api.post("/admin/settings", settings);
      toast.success("System configurations updated successfully.");
      fetchSettingsData();
      setSelectedCategory(null);
    } catch (e) {
      toast.error("Failed to update system settings.");
    }
  };

  const handleRevokeSession = async (sessId: string) => {
    try {
      await api.delete(`/admin/sessions/${sessId}`);
      toast.success("Login session revoked successfully.");
      fetchSettingsData();
    } catch (e) {
      toast.error("Failed to revoke browser session.");
    }
  };

  const handleManualBackup = () => {
    if (backingUp) return;
    setBackingUp(true);
    toast.success("Warming up database exporter... Backup process initiated.");
    setTimeout(() => {
      setBackingUp(false);
      toast.success(
        "Snapshot successfully archived to AWS Cloud Storage bucket.",
      );
      fetchSettingsData();
    }, 2500);
  };

  const handleWipeRestore = async () => {
    try {
      await api.post("/demo/reset");
      toast.success(
        "Database has been fully reset and seeded back to defaults!",
      );
      setRestoreConfirmOpen(false);
      fetchSettingsData();
    } catch (e) {
      toast.error("Failed to restore demo databases.");
    }
  };

  const categories = [
    {
      id: "general",
      title: "General Preferences",
      icon: Settings,
      desc: "Branding, timezone, primary colors, date/time layouts",
    },
    {
      id: "organization",
      title: "Organization Hierarchy",
      icon: Building2,
      desc: "Multiple branches, department structures, Employee IDs",
    },
    {
      id: "security",
      title: "Security & Auth",
      icon: ShieldAlert,
      desc: "Password requirements, timeout parameters, active devices",
    },
    {
      id: "assets",
      title: "Asset & Return Policies",
      icon: FolderLock,
      desc: "QR mandatory switches, return rules, overdue notifications",
    },
    {
      id: "bookings",
      title: "Booking Policy Rules",
      icon: CalendarDays,
      desc: "Advance bookings, notice limits, double booking guards",
    },
    {
      id: "backup",
      title: "Backup & Recovery",
      icon: DatabaseBackup,
      desc: "Database schedule backups, CSV recovery download, demo resets",
    },
    {
      id: "integrations",
      title: "System Integrations",
      icon: Link2,
      desc: "Google Workspace SMTP configuration, Outlook Connect",
    },
  ];

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            to="/admin/settings"
            onClick={() => setSelectedCategory(null)}
            className="hover:text-[#4F46E5] transition-colors"
          >
            System Settings
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#4F46E5]">
                {categories.find((c) => c.id === selectedCategory)?.title}
              </span>
            </>
          )}
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-[#F8FAFC] rounded-xl transition-all border border-[#E7ECF3] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
                {!selectedCategory
                  ? "System Settings"
                  : categories.find((c) => c.id === selectedCategory)?.title}
              </h2>
              <p className="text-xs text-slate-455 font-semibold mt-1">
                {!selectedCategory
                  ? "Configure organization rules, branding styles, and security matrix policies."
                  : categories.find((c) => c.id === selectedCategory)?.desc}
              </p>
            </div>
          </div>
          {selectedCategory && (
            <button
              onClick={handleSaveSettings}
              className="btn-primary py-2 px-4.5 flex items-center gap-1.5 font-bold text-white shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Configurations
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD VIEW OF CARDS */}
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-9 text-xs w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className="glass-card p-6 cursor-pointer hover:border-[#4F46E5] hover:shadow-md transition duration-200 flex flex-col justify-between h-40 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-[#4F46E5] border border-indigo-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">
                        {c.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#4F46E5] font-bold tracking-wide mt-2 block self-end">
                    Configure Parameters →
                  </span>
                </div>
              );
            })}
          </div>

          {/* Configuration History & Sys Info double columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* System Info */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                System & Engine Info
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border rounded-xl font-mono">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Application Engine
                  </span>
                  <span className="text-xs font-black text-slate-850 block mt-0.5">
                    AssetFlow ERP v1.0
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl font-mono">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Stack Framework
                  </span>
                  <span className="text-xs font-black text-slate-850 block mt-0.5">
                    React & Node/Express
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl font-mono">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Storage Status
                  </span>
                  <span className="text-xs font-black text-slate-850 block mt-0.5">
                    MongoDB (Online)
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl font-mono">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Disk Cache State
                  </span>
                  <span className="text-xs font-black text-emerald-600 block mt-0.5">
                    62% Allocated
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap pt-2">
                <button
                  onClick={() => toast.success("Server caches cleared.")}
                  className="btn-secondary py-2 px-3.5 font-bold cursor-pointer"
                >
                  Clear Caches
                </button>
                <button
                  onClick={() => setRestoreConfirmOpen(true)}
                  className="btn-secondary py-2 px-3.5 font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>

            {/* Config History */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Configuration Logs History
              </h4>
              <div className="relative border-l border-slate-200 ml-4 space-y-4 pt-1 pb-2">
                {history.slice(0, 3).map((h) => (
                  <div key={h.id} className="relative pl-6">
                    <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-[#4F46E5] z-10" />
                    <span className="font-bold text-slate-850 block">
                      {h.setting} updated by {h.changedBy}
                    </span>
                    <span className="text-[9.5px] text-slate-400 block mt-0.5">
                      From "{h.from}" to "{h.to}" • {h.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FORM SETTINGS VIEW */
        <div className="glass-card p-6 bg-white border border-slate-250">
          {selectedCategory === "general" && (
            <div className="space-y-4 max-w-2xl">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                General Preferences & Branding
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Org Name
                  </label>
                  <input
                    type="text"
                    value={settings.general?.orgName || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          orgName: e.target.value,
                        },
                      })
                    }
                    className="glass-input text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Org Code
                  </label>
                  <input
                    type="text"
                    value={settings.general?.orgCode || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          orgCode: e.target.value,
                        },
                      })
                    }
                    className="glass-input text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Timezone
                  </label>
                  <select
                    value={settings.general?.timezone || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          timezone: e.target.value,
                        },
                      })
                    }
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                    <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
                    <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settings.general?.currency || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          currency: e.target.value,
                        },
                      })
                    }
                    className="glass-input text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "organization" && (
            <div className="space-y-4 max-w-2xl">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Branch & Hierarchy Configurations
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                  <input
                    type="checkbox"
                    checked={settings.organization?.multipleBranches || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organization: {
                          ...settings.organization,
                          multipleBranches: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-[#4F46E5] cursor-pointer"
                  />
                  <span className="text-slate-800">
                    Enable Multiple Branches & HQ Zones
                  </span>
                </label>
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Employee ID Format
                  </label>
                  <input
                    type="text"
                    value={settings.organization?.employeeIdFormat || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organization: {
                          ...settings.organization,
                          employeeIdFormat: e.target.value,
                        },
                      })
                    }
                    className="glass-input text-xs font-mono w-48"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "security" && (
            <div className="space-y-6">
              <div className="space-y-4 max-w-2xl">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                  Security & Session Limits
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">
                      Session Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="glass-input text-xs w-32"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">
                      Max Failed Login Attempts
                    </label>
                    <input
                      type="number"
                      defaultValue={5}
                      className="glass-input text-xs w-32"
                    />
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                  Connected Active Devices
                </h4>
                <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <table className="erp-table w-full">
                    <thead>
                      <tr>
                        <th className="py-2.5 px-4">Device</th>
                        <th className="py-2.5 px-4">Browser</th>
                        <th className="py-2.5 px-4">IP Address</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s) => (
                        <tr key={s.id}>
                          <td className="py-3 px-4 font-bold text-slate-850 flex items-center gap-1.5">
                            <Laptop className="w-4 h-4 text-slate-400" />{" "}
                            {s.device}
                          </td>
                          <td className="py-3 px-4 font-mono">{s.browser}</td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {s.ip}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRevokeSession(s.id)}
                              className="text-rose-500 hover:text-rose-600 hover:underline font-bold cursor-pointer"
                            >
                              Force Logout
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "assets" && (
            <div className="space-y-4 max-w-2xl">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Asset Policy Parameters
              </h4>
              <div className="space-y-3.5">
                <label className="flex items-center gap-2.5 cursor-pointer font-bold select-none">
                  <input
                    type="checkbox"
                    checked={settings.assetPolicies?.qrCodeRequired || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        assetPolicies: {
                          ...settings.assetPolicies,
                          qrCodeRequired: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-[#4F46E5] cursor-pointer"
                  />
                  <span className="text-slate-800">
                    QR Code scanning mandatory for verifications
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer font-bold select-none">
                  <input
                    type="checkbox"
                    checked={settings.assetPolicies?.photoMandatory || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        assetPolicies: {
                          ...settings.assetPolicies,
                          photoMandatory: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-[#4F46E5] cursor-pointer"
                  />
                  <span className="text-slate-800">
                    Photo Attachment required during allocation receipt
                    confirmation
                  </span>
                </label>
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Maximum Return Delay (Days)
                  </label>
                  <input
                    type="number"
                    value={
                      settings.assetPolicies?.returnRules?.maxDelayDays || 15
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        assetPolicies: {
                          ...settings.assetPolicies,
                          returnRules: {
                            ...settings.assetPolicies.returnRules,
                            maxDelayDays: parseInt(e.target.value) || 15,
                          },
                        },
                      })
                    }
                    className="glass-input text-xs w-24"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "bookings" && (
            <div className="space-y-4 max-w-2xl">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Resource Booking Policies
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Max Booking Duration (Hours)
                  </label>
                  <input
                    type="number"
                    value={settings.bookingRules?.maxBookingHours || 8}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bookingRules: {
                          ...settings.bookingRules,
                          maxBookingHours: parseInt(e.target.value) || 8,
                        },
                      })
                    }
                    className="glass-input text-xs w-24"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Advance Booking Window (Days)
                  </label>
                  <input
                    type="number"
                    value={settings.bookingRules?.advanceBookingDays || 30}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bookingRules: {
                          ...settings.bookingRules,
                          advanceBookingDays: parseInt(e.target.value) || 30,
                        },
                      })
                    }
                    className="glass-input text-xs w-24"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer font-bold pt-4 select-none">
                <input
                  type="checkbox"
                  checked={
                    settings.bookingRules?.doubleBookingRestricted || false
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bookingRules: {
                        ...settings.bookingRules,
                        doubleBookingRestricted: e.target.checked,
                      },
                    })
                  }
                  className="w-4.5 h-4.5 accent-[#4F46E5] cursor-pointer"
                />
                <span className="text-slate-800">
                  Enable Double Booking restrictions for Conference Rooms
                </span>
              </label>
            </div>
          )}

          {selectedCategory === "backup" && (
            <div className="space-y-6">
              <div className="space-y-4 max-w-2xl border-b pb-4">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                  Archiving & Recovery Schedules
                </h4>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">
                    Backup Schedule
                  </label>
                  <select
                    value={settings.backupSettings?.schedule || "Daily"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backupSettings: {
                          ...settings.backupSettings,
                          schedule: e.target.value,
                        },
                      })
                    }
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-48"
                  >
                    <option value="Daily">Daily Backups</option>
                    <option value="Weekly">Weekly Backups</option>
                    <option value="Monthly">Monthly Backups</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleManualBackup}
                    disabled={backingUp}
                    className="btn-primary text-white py-2 px-4.5 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {backingUp ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {backingUp
                        ? "Archiving Database..."
                        : "Backup Database Now"}
                    </span>
                  </button>
                  <button
                    onClick={() => toast.success("Backup snapshot saved.")}
                    className="btn-secondary py-2 px-4 font-bold cursor-pointer"
                  >
                    Export System Configurations
                  </button>
                </div>
              </div>

              {/* Logs */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                  Backup Logs
                </h4>
                <div className="border rounded-2xl p-4 bg-slate-50 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Auto backup completed successfully
                    </span>
                    <span className="text-[9.5px] text-slate-400 block mt-0.5">
                      Size: 42 KB • Status: Stable
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">
                    Today, 02:00 AM
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "integrations" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                  External API Integrations
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Connect to external calendars or authorization providers.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 rounded-2xl flex justify-between items-center bg-slate-50/20">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Google Calendar Sync
                    </span>
                    <span className="text-[9.5px] text-rose-500 font-bold block mt-0.5">
                      Disconnected
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      toast.success("API mock connection established.")
                    }
                    className="btn-secondary py-1.5 px-3 font-bold cursor-pointer"
                  >
                    Connect Service
                  </button>
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl flex justify-between items-center bg-slate-50/20">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Outlook Calendar Integration
                    </span>
                    <span className="text-[9.5px] text-rose-500 font-bold block mt-0.5">
                      Disconnected
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      toast.success("API mock connection established.")
                    }
                    className="btn-secondary py-1.5 px-3 font-bold cursor-pointer"
                  >
                    Connect Service
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {restoreConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="w-[400px] bg-white p-6 border border-slate-200 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
                  Confirm System Reset
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  This operation deletes the current database completely and
                  restores the initial seeder workspace. All changes will be
                  lost.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRestoreConfirmOpen(false)}
                className="btn-secondary py-2 px-4 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeRestore}
                className="btn-primary bg-rose-500 hover:bg-rose-600 border-rose-500 hover:border-rose-600 text-white py-2 px-4 font-bold cursor-pointer"
              >
                Yes, Restore Seeder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
