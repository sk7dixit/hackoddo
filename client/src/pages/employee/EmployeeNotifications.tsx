import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Bell,
  CheckCircle,
  X,
  FileText,
  Sliders,
  Inbox,
  Clock,
  ChevronRight,
  ShieldAlert,
  Archive,
  RefreshCw,
  Eye,
  Settings,
  Mail,
  Smartphone
} from "lucide-react";

export const EmployeeNotifications: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"inbox" | "preferences">("inbox");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Loaded Data
  const [notifications, setNotifications] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [prefLoading, setPrefLoading] = useState(false);

  // Drawer overlay
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/notifications");
      setNotifications(res || []);
    } catch (err: any) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    setPrefLoading(true);
    try {
      const res = await api.get("/employee/preferences");
      setPreferences(res);
    } catch (err) {
      console.error("Error loading preference:", err);
    } finally {
      setPrefLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    fetchPreferences();
  }, []);

  // Mark single as read
  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/employee/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
      );
      if (selectedNotif && selectedNotif.id === id) {
        setSelectedNotif((prev: any) => ({ ...prev, status: "read" }));
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      await api.put("/employee/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error("Failed to mark all as read.");
    }
  };

  // Archive / Delete Notification
  const handleArchiveNotif = async (id: string) => {
    try {
      await api.delete(`/employee/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (selectedNotif && selectedNotif.id === id) {
        setSelectedNotif(null);
      }
      toast.success("Notification archived.");
    } catch (err) {
      toast.error("Failed to archive notification.");
    }
  };

  // Save Preferences
  const handlePreferenceToggle = async (field: string, value: boolean) => {
    if (!preferences) return;
    const updated = { ...preferences, [field]: value };
    setPreferences(updated);
    try {
      await api.put("/employee/preferences", updated);
    } catch (err) {
      toast.error("Failed to update notification channels.");
    }
  };

  // Calculations
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const criticalCount = notifications.filter((n) => n.priority === "Critical" && n.status === "unread").length;

  const filteredNotifs = notifications.filter((n) => {
    if (selectedCategory === "All") return true;
    return n.category === selectedCategory;
  });

  return (
    <div className="p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link to="/employee" className="hover:text-[#4F46E5] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4F46E5]">Notification Center</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Alerts & Communications
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Read corporate broadcasts, system warnings, and trace return or transfer approvals in real time.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "inbox" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Alerts Inbox ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "preferences" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
          <span>Syncing notification logs...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: Inbox */}
          {activeTab === "inbox" && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter chips & Read all */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Category filters */}
                <div className="flex flex-wrap gap-2">
                  {["All", "Assets", "Maintenance", "Bookings", "Audit", "Security"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer transition-all ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="btn-secondary py-1.5 px-4 font-bold text-[10.5px] flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark All Read
                </button>
              </div>

              {/* Feed List */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                {filteredNotifs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                    Inbox is empty. No alerts recorded.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`py-4.5 flex justify-between items-start gap-4 transition-colors first:pt-0 last:pb-0 ${
                          notif.status === "unread" ? "bg-slate-50/30 px-3 -mx-3 rounded-2xl" : ""
                        }`}
                      >
                        <div className="flex gap-3.5">
                          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            notif.status === "unread" ? "bg-indigo-50 text-[#4F46E5]" : "bg-slate-100 text-slate-400"
                          }`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className={`text-xs ${notif.status === "unread" ? "font-black text-slate-905" : "font-bold text-slate-700"}`}>
                                {notif.title}
                              </h4>
                              <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${
                                notif.priority === "Critical"
                                  ? "bg-rose-50 text-rose-600 border-rose-100"
                                  : "bg-slate-50 text-slate-500 border-slate-100"
                              }`}>
                                {notif.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold mt-1 font-sans leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold mt-1.5 block">
                              {notif.time || (notif.date ? notif.date.split("T")[0] : "Today")}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {notif.status === "unread" && (
                            <button
                              onClick={() => handleMarkRead(notif.id)}
                              className="p-1.5 hover:bg-slate-100 text-indigo-600 hover:text-indigo-850 rounded-lg transition-colors cursor-pointer"
                              title="Mark Read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleArchiveNotif(notif.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                            title="Archive alert"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Preferences */}
          {activeTab === "preferences" && (
            <div className="max-w-md mx-auto bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-black text-slate-850 text-sm uppercase tracking-wider">
                  Notification Preferences
                </h3>
              </div>

              {prefLoading ? (
                <div className="flex items-center justify-center py-10">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#4F46E5]" />
                </div>
              ) : preferences ? (
                <div className="space-y-6 text-xs font-semibold text-slate-650">
                  {/* Delivery Channel Toggles */}
                  <div className="space-y-4">
                    <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-wide">
                      Delivery Channels
                    </h4>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[#4F46E5]" />
                          <div>
                            <span className="font-bold text-slate-800 block">Email Alerts</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">Receive notifications directly in your corporate inbox.</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => handlePreferenceToggle("emailNotifications", e.target.checked)}
                          className="w-4.5 h-4.5 text-[#4F46E5] rounded border-slate-300 focus:ring-[#4F46E5] cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4 text-[#4F46E5]" />
                          <div>
                            <span className="font-bold text-slate-800 block">In-App Popups</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">Enable toast messages and header bells inside active sessions.</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.assetNotifications} // reusing as generic toggle field
                          onChange={(e) => handlePreferenceToggle("assetNotifications", e.target.checked)}
                          className="w-4.5 h-4.5 text-[#4F46E5] rounded border-slate-300 focus:ring-[#4F46E5] cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Modules filter settings */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-wide">
                      Modules Included
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2.5 p-2.5 border rounded-xl hover:bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.maintenanceNotifications}
                          onChange={(e) => handlePreferenceToggle("maintenanceNotifications", e.target.checked)}
                          className="text-[#4F46E5]"
                        />
                        <span className="text-[10.5px] font-bold text-slate-700">Maintenance</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 border rounded-xl hover:bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.bookingNotifications}
                          onChange={(e) => handlePreferenceToggle("bookingNotifications", e.target.checked)}
                          className="text-[#4F46E5]"
                        />
                        <span className="text-[10.5px] font-bold text-slate-700">Resource Bookings</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 border rounded-xl hover:bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.announcementNotifications}
                          onChange={(e) => handlePreferenceToggle("announcementNotifications", e.target.checked)}
                          className="text-[#4F46E5]"
                        />
                        <span className="text-[10.5px] font-bold text-slate-700">Announcements</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-slate-400 font-semibold italic">
                  Could not load notification preference profile.
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default EmployeeNotifications;
