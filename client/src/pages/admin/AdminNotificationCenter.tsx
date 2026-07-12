import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Bell,
  Send,
  Calendar,
  FileText,
  Archive,
  Trash2,
  Search,
  Plus,
  Volume2,
  Sliders,
  Check,
  X,
  Mail,
  Smartphone,
  ChevronRight,
} from "lucide-react";

interface Notification {
  id: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  title: string;
  message: string;
  recipient: string;
  time: string;
  status: "unread" | "read" | "archived";
  category: string;
  relatedModule?: string;
  relatedAsset?: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  audience: string;
  priority: string;
  expiryDate: string;
  type: string;
  date: string;
}

interface ScheduledReminder {
  id: string;
  message: string;
  audience: string;
  date: string;
  time: string;
  repeat: string;
  priority: string;
}

interface Template {
  id: string;
  title: string;
  subject: string;
  message: string;
  variables: string[];
}

export const AdminNotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "inbox" | "broadcast" | "scheduled" | "templates" | "channels"
  >("inbox");

  // Master Data
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledReminder[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  // Announcement Form Fields
  const [annTitle, setAnnTitle] = useState("");
  const [annDesc, setAnnDesc] = useState("");
  const [annAudience, setAnnAudience] = useState("Entire Organization");
  const [annPriority, setAnnPriority] = useState("Medium");
  const [annExpiry, setAnnExpiry] = useState("");
  const [annType, setAnnType] = useState("General");

  // Scheduled Reminder Form Fields
  const [schMessage, setSchMessage] = useState("");
  const [schAudience, setSchAudience] = useState("Employees");
  const [schDate, setSchDate] = useState("");
  const [schTime, setSchTime] = useState("");
  const [schRepeat, setSchRepeat] = useState("Weekly");
  const [schPriority, setSchPriority] = useState("Medium");

  // Template Form Fields
  const [newTempTitle, setNewTempTitle] = useState("");
  const [newTempSub, setNewTempSub] = useState("");
  const [newTempBody, setNewTempBody] = useState("");
  const [newTempVars, setNewTempVars] = useState("Employee, Asset, Department");

  // Delivery channel states
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    sms: false,
    push: true,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const fetchData = async () => {
    try {
      const [notifs, anns, schs, temps] = await Promise.all([
        api.get<Notification[]>("/admin/notifications"),
        api.get<Announcement[]>("/admin/announcements"),
        api.get<ScheduledReminder[]>("/admin/scheduled-notifications"),
        api.get<Template[]>("/admin/notification-templates"),
      ]);
      setNotifications(notifs);
      setAnnouncements(anns);
      setScheduled(schs);
      setTemplates(temps);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkRead = async (notifId: string) => {
    try {
      await api.patch(`/admin/notifications/${notifId}`, { status: "read" });
      toast.success("Notification marked as read.");
      fetchData();
      if (selectedNotif && selectedNotif.id === notifId) {
        setSelectedNotif({ ...selectedNotif, status: "read" });
      }
    } catch (e) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleArchiveNotif = async (notifId: string) => {
    try {
      await api.patch(`/admin/notifications/${notifId}`, {
        status: "archived",
      });
      toast.success("Notification archived.");
      fetchData();
      if (selectedNotif && selectedNotif.id === notifId) {
        setSelectedNotif(null);
      }
    } catch (e) {
      toast.error("Failed to archive notification.");
    }
  };

  const handleDeleteNotif = async (notifId: string) => {
    try {
      await api.delete(`/admin/notifications/${notifId}`);
      toast.success("Notification deleted.");
      fetchData();
      if (selectedNotif && selectedNotif.id === notifId) {
        setSelectedNotif(null);
      }
    } catch (e) {
      toast.error("Failed to delete notification.");
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: annTitle,
        description: annDesc,
        audience: annAudience,
        priority: annPriority,
        expiryDate: annExpiry,
        type: annType,
      };
      await api.post("/admin/announcements", payload);
      toast.success(`Announcement "${annTitle}" broadcasted successfully!`);
      setAnnTitle("");
      setAnnDesc("");
      setAnnExpiry("");
      fetchData();
    } catch (e: any) {
      const errorMsg = e.response?.data?.error || "Validation failed.";
      toast.error(errorMsg);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await api.delete(`/admin/announcements/${id}`);
      toast.success("Announcement removed.");
      fetchData();
    } catch (e) {
      toast.error("Failed to delete announcement.");
    }
  };

  const handleScheduleReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        message: schMessage,
        audience: schAudience,
        date: schDate,
        time: schTime,
        repeat: schRepeat,
        priority: schPriority,
      };
      await api.post("/admin/scheduled-notifications", payload);
      toast.success("Reminder scheduled successfully.");
      setSchMessage("");
      setSchDate("");
      setSchTime("");
      fetchData();
    } catch (e: any) {
      const errorMsg = e.response?.data?.error || "Validation failed.";
      toast.error(errorMsg);
    }
  };

  const handleDeleteScheduled = async (id: string) => {
    try {
      await api.delete(`/admin/scheduled-notifications/${id}`);
      toast.success("Scheduled notification deleted.");
      fetchData();
    } catch (e) {
      toast.error("Failed to delete scheduled notification.");
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const varsArray = newTempVars.split(",").map((v) => v.trim());
      const payload = {
        title: newTempTitle,
        subject: newTempSub,
        message: newTempBody,
        variables: varsArray,
      };
      await api.post("/admin/notification-templates", payload);
      toast.success(`Template "${newTempTitle}" saved.`);
      setNewTempTitle("");
      setNewTempSub("");
      setNewTempBody("");
      fetchData();
    } catch (e: any) {
      const errorMsg = e.response?.data?.error || "Template save failed.";
      toast.error(errorMsg);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || n.priority === priorityFilter;
    return matchesSearch && matchesPriority;
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
          <span className="text-[#4F46E5]">Notification Center</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            System Notification Center
          </h2>
          <p className="text-xs text-slate-455 font-semibold mt-1">
            Dispatch announcements, configure scheduled reminders, customize
            email templates, and manage communications.
          </p>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between h-28 bg-white">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Unread Alerts
          </span>
          <h2 className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {notifications.filter((n) => n.status === "unread").length} Unread
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between h-28 bg-white">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Active Broadcasts
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            {announcements.length} Live
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between h-28 bg-white">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Scheduled Alarms
          </span>
          <h2 className="text-2xl font-black text-indigo-650 mt-1 font-mono">
            {scheduled.length} Queued
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between h-28 bg-white">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Templates Library
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            {templates.length} Saved
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "inbox" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Bell className="w-4 h-4" />
          <span>Priority Inbox</span>
          {activeTab === "inbox" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "broadcast" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Broadcast Board</span>
          {activeTab === "broadcast" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "scheduled" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduler Control</span>
          {activeTab === "scheduled" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "templates" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <FileText className="w-4 h-4" />
          <span>Alert Templates</span>
          {activeTab === "templates" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "channels" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Sliders className="w-4 h-4" />
          <span>Delivery Channels</span>
          {activeTab === "channels" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. PRIORITY INBOX */}
      {activeTab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Inbox..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-9 text-xs w-64"
                />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">🔴 Critical Only</option>
                <option value="High">🟠 High Only</option>
                <option value="Medium">🟡 Medium Only</option>
                <option value="Low">🟢 Low Only</option>
              </select>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-5">Priority</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifs.map((notif) => (
                    <tr
                      key={notif.id}
                      className={`cursor-pointer ${notif.status === "unread" ? "bg-[#4F46E5]/5 font-extrabold text-slate-900" : ""}`}
                      onClick={() => setSelectedNotif(notif)}
                    >
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-black ${
                            notif.priority === "Critical"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : notif.priority === "High"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}
                        >
                          {notif.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 truncate max-w-[240px]">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold mt-0.5 truncate">
                          {notif.message}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-450">
                        {notif.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                        {notif.time}
                      </td>
                      <td
                        className="py-3.5 px-4 text-right font-bold space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notif.status === "unread" && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="text-[#4F46E5] hover:underline cursor-pointer"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => handleArchiveNotif(notif.id)}
                          className="text-slate-400 hover:text-slate-650 cursor-pointer"
                        >
                          <Archive className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="text-rose-500 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Right Details Card */}
          <div className="glass-card p-6 bg-white min-h-[300px]">
            {selectedNotif ? (
              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Notification Detail
                  </span>
                  <span className="font-mono text-slate-400">
                    {selectedNotif.time}
                  </span>
                </div>
                <h4 className="font-black text-sm text-slate-850 leading-normal">
                  {selectedNotif.title}
                </h4>
                <p className="p-3 bg-slate-50 border rounded-xl leading-relaxed text-slate-600 font-semibold">
                  {selectedNotif.message}
                </p>
                <div className="space-y-2 pt-2 border-t text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Related Module:</span>
                    <span className="font-bold text-slate-800">
                      {selectedNotif.relatedModule || "Global"}
                    </span>
                  </div>
                  {selectedNotif.relatedAsset && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Asset:</span>
                      <span className="font-bold font-mono text-[#4F46E5]">
                        {selectedNotif.relatedAsset}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-bold text-slate-800">
                      {selectedNotif.category}
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  {selectedNotif.status === "unread" && (
                    <button
                      onClick={() => handleMarkRead(selectedNotif.id)}
                      className="btn-primary py-2 px-4 flex-1 text-center font-bold cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleArchiveNotif(selectedNotif.id)}
                    className="btn-secondary py-2 px-4 flex-1 text-center font-bold cursor-pointer"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 py-16">
                <Bell className="w-8 h-8 text-slate-350 mb-2" />
                <p className="italic">
                  Select a notification row to view full details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. BROADCAST BOARD */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs font-semibold animate-fade-in">
          <div className="glass-card lg:col-span-2 space-y-4 bg-white border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider border-b pb-2">
              Broadcast Organization Announcement
            </h4>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Server Migration Downtime"
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Message Body *
                </label>
                <textarea
                  required
                  value={annDesc}
                  onChange={(e) => setAnnDesc(e.target.value)}
                  placeholder="Provide downtime windows and contact points..."
                  className="glass-input text-xs h-24 p-3 leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Target Audience
                  </label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="Entire Organization">
                      Entire Organization
                    </option>
                    <option value="Asset Managers">Asset Managers</option>
                    <option value="Department Heads">Department Heads</option>
                    <option value="Employees">Employees</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Priority
                  </label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={annExpiry}
                    onChange={(e) => setAnnExpiry(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Announcement Type
                  </label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="General">General Notice</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Holiday">Holiday</option>
                    <option value="System Update">System Update</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary py-3 px-6 font-bold flex items-center gap-1.5 text-white cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,.25)]"
              >
                <Send className="w-4 h-4" /> Broadcast Announcement
              </button>
            </form>
          </div>

          {/* Active Announcements */}
          <div className="glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-855 uppercase tracking-wider border-b pb-2">
              Active Broadcast Board
            </h4>
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative hover:shadow-sm transition-shadow"
                >
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="bg-indigo-50 border border-indigo-150 text-[9px] uppercase px-2 py-0.5 rounded font-mono text-[#4F46E5] font-black">
                    {ann.type}
                  </span>
                  <h5 className="font-extrabold text-slate-850 mt-2">
                    {ann.title}
                  </h5>
                  <p className="text-[10px] text-slate-450 mt-1 leading-relaxed font-semibold">
                    {ann.description}
                  </p>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">
                  No active announcements notices.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SCHEDULER CONTROL */}
      {activeTab === "scheduled" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs font-semibold animate-fade-in">
          <div className="glass-card space-y-4 bg-white border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider border-b pb-2">
              Schedule Reminder Alert
            </h4>
            <form onSubmit={handleScheduleReminder} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Reminder Message *
                </label>
                <input
                  type="text"
                  required
                  value={schMessage}
                  onChange={(e) => setSchMessage(e.target.value)}
                  placeholder="e.g. Audit checklist due in 3 days"
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Recipient Audience
                </label>
                <select
                  value={schAudience}
                  onChange={(e) => setSchAudience(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                >
                  <option value="Employees">Employees</option>
                  <option value="Department Heads">Department Heads</option>
                  <option value="Asset Managers">Asset Managers</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Trigger Date
                  </label>
                  <input
                    type="date"
                    required
                    value={schDate}
                    onChange={(e) => setSchDate(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Trigger Time
                  </label>
                  <input
                    type="text"
                    required
                    value={schTime}
                    onChange={(e) => setSchTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="glass-input text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Repeat Interval
                  </label>
                  <select
                    value={schRepeat}
                    onChange={(e) => setSchRepeat(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="None">Once Only</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Priority
                  </label>
                  <select
                    value={schPriority}
                    onChange={(e) => setSchPriority(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary py-2.5 px-4 font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" /> Save Scheduled Alert
              </button>
            </form>
          </div>

          <div className="glass-card lg:col-span-2 space-y-4 bg-white border border-slate-200">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
              Active Scheduled Alerts
            </h4>
            <div className="space-y-3.5">
              {scheduled.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h5 className="font-extrabold text-slate-800">
                      {item.message}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Audience: {item.audience} | Run: {item.date} at{" "}
                      {item.time} ({item.repeat})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteScheduled(item.id)}
                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {scheduled.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">
                  No scheduled alerts queued.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TEMPLATES DIRECTORY */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs font-semibold animate-fade-in">
          <div className="glass-card space-y-4 bg-white border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider border-b pb-2">
              Save Alert Template
            </h4>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTempTitle}
                  onChange={(e) => setNewTempTitle(e.target.value)}
                  placeholder="e.g. Audit Assigned Notice"
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={newTempSub}
                  onChange={(e) => setNewTempSub(e.target.value)}
                  placeholder="e.g. Q3 Inventory Audit assigned"
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Variables Placeholders
                </label>
                <input
                  type="text"
                  value={newTempVars}
                  onChange={(e) => setNewTempVars(e.target.value)}
                  placeholder="Comma-separated e.g. Employee, Asset"
                  className="glass-input text-xs font-mono font-bold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Message Body *
                </label>
                <textarea
                  required
                  value={newTempBody}
                  onChange={(e) => setNewTempBody(e.target.value)}
                  placeholder="Hello {{Employee}}, you have been assigned..."
                  className="glass-input text-xs h-28 p-3 leading-relaxed"
                />
              </div>
              <button
                type="submit"
                className="btn-primary py-2.5 px-4 font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-4.5 h-4.5" /> Save Template
              </button>
            </form>
          </div>

          <div className="glass-card lg:col-span-2 space-y-4 bg-white border border-slate-200">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
              Templates Directory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((temp) => (
                <div
                  key={temp.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-850">
                      {temp.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Subject: {temp.subject}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    {temp.message}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t">
                    <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">
                      Variables:
                    </span>
                    {temp.variables.map((v, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-50 border border-indigo-150 text-[#4F46E5] font-mono text-[9px] px-1.5 py-0.5 rounded font-bold"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. DELIVERY CHANNELS */}
      {activeTab === "channels" && (
        <div className="space-y-6 max-w-xl animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Delivery Channels Configuration
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Enable or disable delivery pipelines per system alert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border flex justify-between items-center h-28 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-[#4F46E5] rounded-xl border border-indigo-100">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-850">
                    In-App Notifications
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Displays alerts in portal bell
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.inApp}
                onChange={(e) =>
                  setChannels({ ...channels, inApp: e.target.checked })
                }
                className="w-5 h-5 accent-[#4F46E5] cursor-pointer"
              />
            </div>

            <div className="glass-card p-6 border flex justify-between items-center h-28 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-[#4F46E5] rounded-xl border border-indigo-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-850">
                    Email Integration
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Dispatches emails to inbox
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.email}
                onChange={(e) =>
                  setChannels({ ...channels, email: e.target.checked })
                }
                className="w-5 h-5 accent-[#4F46E5] cursor-pointer"
              />
            </div>

            <div className="glass-card p-6 border flex justify-between items-center h-28 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-[#4F46E5] rounded-xl border border-indigo-100">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-850">SMS Gateways</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Mock text message dispatches
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.sms}
                onChange={(e) =>
                  setChannels({ ...channels, sms: e.target.checked })
                }
                className="w-5 h-5 accent-[#4F46E5] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationCenter;
