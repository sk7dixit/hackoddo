import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  History,
  Search,
  Filter,
  X,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Clock,
  ChevronRight,
  Info,
  Building,
  CheckCircle,
  Megaphone,
  RefreshCw,
  Award
} from "lucide-react";

export const EmployeeActivity: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"activity" | "announcements">("activity");

  // Loaded Data
  const [activities, setActivities] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activityRes, annRes] = await Promise.all([
        api.get("/employee/activity"),
        api.get("/employee/announcements")
      ]);
      setActivities(activityRes || []);
      setAnnouncements(annRes || []);
    } catch (err: any) {
      toast.error("Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter calculations
  const filteredActivities = activities.filter((act) => {
    const matchesSearch = (act.action || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "All" || act.module === selectedModule;
    return matchesSearch && matchesModule;
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
            <span className="text-[#4F46E5]">Activity & Announcements</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Logs & Broadcast Center
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Trace your operational event logs, login sessions, and review department announcements.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "activity" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Activity Timeline Logs
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "announcements" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Announcements ({announcements.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
          <span>Syncing logs dashboard...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: Activity Timeline Logs */}
          {activeTab === "activity" && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter controls */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Module selection */}
                <div className="flex flex-wrap gap-2">
                  {["All", "Allocation", "Return", "Maintenance", "Bookings"].map((mod) => (
                    <button
                      key={mod}
                      onClick={() => setSelectedModule(mod)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer transition-all ${
                        selectedModule === mod
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>

                {/* Search query */}
                <div className="w-full md:w-80 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs by keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-350 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Vertical Timeline logs */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm">
                {filteredActivities.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                    No activity logs recorded.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
                    {filteredActivities.map((act, idx) => (
                      <div key={act.id || idx} className="relative flex justify-between items-start text-xs font-semibold text-slate-700">
                        {/* Dot node */}
                        <div className="absolute -left-[20px] top-1.5 w-[11px] h-[11px] rounded-full border-[2.5px] border-[#4F46E5] bg-[#4F46E5] z-10" />

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-black text-slate-900 text-xs">
                              {act.action}
                            </h4>
                            <span className="text-[8.5px] font-extrabold px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-md uppercase tracking-wider">
                              {act.module}
                            </span>
                            <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              act.status === "Success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              {act.status}
                            </span>
                          </div>

                          <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans">
                            {act.description}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] text-slate-400 font-mono font-bold shrink-0 pt-0.5">
                          {act.timestamp ? act.timestamp.replace("T", " ").substring(0, 16) : "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Announcements */}
          {activeTab === "announcements" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((ann) => (
                  <div
                    key={ann.announcementId}
                    className="bg-white border border-[#E7ECF3] rounded-3xl p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Priority and headers */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-indigo-50 text-[#4F46E5] rounded-xl shrink-0">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 text-xs truncate max-w-[200px]">
                              {ann.title}
                            </h4>
                            <span className="text-[9.5px] text-slate-400 font-semibold block mt-0.5">
                              Audience: {ann.audience || ann.departmentId || "All"}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          ann.priority === "High"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-indigo-50 text-[#4F46E5] border-indigo-100"
                        }`}>
                          {ann.priority}
                        </span>
                      </div>

                      {/* Announcement Description */}
                      <p className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[11px] text-slate-600 font-semibold leading-relaxed font-sans">
                        {ann.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> By {ann.createdBy || "System"}
                      </span>
                      <span className="font-mono">
                        {ann.createdAt ? ann.createdAt.split("T")[0] : ann.date || "Today"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default EmployeeActivity;
