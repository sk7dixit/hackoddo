import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/GlassCard';
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  ChevronRight, 
  Info, 
  CheckCheck,
  ToggleLeft,
  ToggleRight,
  Settings,
  AlertTriangle,
  RotateCcw,
  Wrench,
  UserCheck
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string; // 'allocation' | 'maintenance' | 'audit' | 'return' | 'system'
  priority: 'normal' | 'critical';
  read: boolean;
  createdAt: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  allocation: { bg: 'bg-violet-50', text: 'text-violet-750', border: 'border-violet-100' },
  maintenance: { bg: 'bg-orange-50', text: 'text-orange-750', border: 'border-orange-100' },
  audit: { bg: 'bg-blue-50', text: 'text-blue-755', border: 'border-blue-100' },
  return: { bg: 'bg-emerald-50', text: 'text-emerald-750', border: 'border-emerald-100' },
  system: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter tabs
  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Critical' | 'Today' | 'Allocation' | 'Maintenance' | 'Audit'>('All');

  // Settings states
  const [emailNotif, setEmailNotif] = useState(true);
  const [dashboardNotif, setDashboardNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(false);

  // Selected for Details
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/notifications');
        const data = await res.json();
        if (res.ok) {
          setNotifications(data);
          // Auto-select first notification if none is selected
          if (data.length > 0) {
            setSelectedNotif(data[0]);
          }
        }
      } catch (e) {
        console.error('Failed to load notifications:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [refreshTrigger]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PATCH' });
      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        if (selectedNotif?.id === id) {
          setSelectedNotif(prev => prev ? { ...prev, read: true } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications/read-all', { method: 'PATCH' });
      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        setSelectedNotif(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenRelatedModule = (type: string) => {
    setSelectedNotif(null);
    switch (type.toLowerCase()) {
      case 'allocation':
        navigate('/allocation');
        break;
      case 'maintenance':
        navigate('/maintenance');
        break;
      case 'audit':
        navigate('/audit');
        break;
      case 'return':
        navigate('/returns');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Count summaries
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = notifications.filter(n => n.createdAt.startsWith(todayStr)).length;

  // Filter requests
  const filteredNotifs = notifications.filter(notif => {
    if (filterTab === 'Unread') return !notif.read;
    if (filterTab === 'Critical') return notif.priority === 'critical';
    if (filterTab === 'Today') return notif.createdAt.startsWith(todayStr);
    if (filterTab === 'Allocation') return notif.type === 'allocation' || notif.type === 'return';
    if (filterTab === 'Maintenance') return notif.type === 'maintenance';
    if (filterTab === 'Audit') return notif.type === 'audit';
    return true; // All
  });

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'allocation':
        return <UserCheck className="w-4 h-4" />;
      case 'return':
        return <RotateCcw className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'audit':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Notification Center
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">Monitor real-time workflow alerts and system notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5 self-start sm:self-center"
          >
            <CheckCheck className="w-4 h-4 text-[#5B5BD6]" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Statistics Cards - Compact 100px */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Unread Alerts</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-2">{unreadCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Read Notifications</span>
          <span className="text-2xl font-black text-slate-700 font-mono mt-2">{readCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-rose-50/50 border-rose-100">
          <span className="text-[10px] text-rose-700 font-semibold uppercase tracking-wider">Critical Warnings</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2 flex items-center gap-1.5">
            {criticalCount} <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Received Today</span>
          <span className="text-2xl font-black text-[#5B5BD6] font-mono mt-2">{todayCount}</span>
        </GlassCard>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Notifications List (Left 2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tabs row - active tab purple text, purple underline, bold */}
          <div className="glass-card p-3 flex overflow-x-auto gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-slate-200 bg-white shadow-sm">
            {(['All', 'Unread', 'Critical', 'Today', 'Allocation', 'Maintenance', 'Audit'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`pb-1 px-1 transition-all ${
                  filterTab === tab 
                    ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6] font-bold' 
                    : 'hover:text-slate-700 font-semibold'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List display */}
          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 font-bold">Loading alerts...</div>
            ) : filteredNotifs.length === 0 ? (
              <GlassCard className="text-center py-16 text-slate-400 italic font-bold border-slate-200 bg-white">No notifications found in this scope.</GlassCard>
            ) : (
              filteredNotifs.map(notif => {
                const isCritical = notif.priority === 'critical';
                const isUnread = !notif.read;
                const colors = CATEGORY_COLORS[notif.type.toLowerCase()] || CATEGORY_COLORS.system;
                
                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotif(notif)}
                    className={`glass-card p-4 cursor-pointer flex gap-4 items-start transition-all border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 shadow-sm ${
                      isUnread ? 'bg-indigo-50/20 border-l-2 border-l-[#5B5BD6]' : 'bg-white'
                    }`}
                  >
                    {/* Category Icon Colors */}
                    <div className={`p-2 rounded-xl shrink-0 border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {getCategoryIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-xs font-bold leading-tight ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400 font-bold shrink-0">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-500 font-semibold leading-relaxed truncate">{notif.message}</p>
                    </div>

                    {/* Quick controls */}
                    <div className="flex gap-2 items-center pl-2" onClick={e => e.stopPropagation()}>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                          title="Mark Read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Selected Details & Settings (Right 1/3 width) */}
        <div className="space-y-6">
          
          {/* Notification detail panel (Never shows an empty placeholder since selectedNotif is auto-selected) */}
          {selectedNotif ? (
            <GlassCard className="border-slate-200 bg-white animate-slide-up space-y-5 shadow-sm">
              <div className="flex justify-between items-start pb-3 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-[#5B5BD6] bg-[#5B5BD6]/5 px-2 py-0.5 border border-[#5B5BD6]/10 rounded">
                    {selectedNotif.id}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-2">{selectedNotif.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedNotif(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 hover:bg-slate-50 rounded transition-all"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-650 font-semibold">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <p className="leading-relaxed font-bold italic text-slate-800">"{selectedNotif.message}"</p>
                </div>

                <div className="flex justify-between border-t border-slate-100 pt-3">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9.5px]">Alert Category</span>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-700">{selectedNotif.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9.5px]">Priority Level</span>
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${selectedNotif.priority === 'critical' ? 'text-rose-600 font-extrabold' : 'text-slate-600'}`}>
                    {selectedNotif.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9.5px]">Reported At</span>
                  <span className="font-mono text-slate-500">
                    {new Date(selectedNotif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {!selectedNotif.read && (
                  <button
                    onClick={() => handleMarkAsRead(selectedNotif.id)}
                    className="flex-1 btn-secondary text-xs py-2"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleOpenRelatedModule(selectedNotif.type)}
                  className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
                >
                  <span>Open Module</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="border-slate-200 bg-white text-center py-10 text-slate-400 italic text-[11px] flex flex-col items-center justify-center gap-2 shadow-sm font-bold">
              <Info className="w-6 h-6 text-slate-350" />
              <span>Select an alert to view complete timeline details.</span>
            </GlassCard>
          )}

          {/* Settings switch panel */}
          <GlassCard className="border-slate-200 bg-white space-y-4 shadow-sm">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-2 uppercase flex items-center gap-2">
              <Settings className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Alert Subscriptions
            </h3>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700">Email Notifications</span>
                  <p className="text-[10px] text-slate-400">Send digests to assetmanager@gmail.com</p>
                </div>
                <button onClick={() => setEmailNotif(!emailNotif)} className="text-[#5B5BD6] focus:outline-none transition-all">
                  {emailNotif ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold border-t border-slate-100 pt-3.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700">Dashboard Notifications</span>
                  <p className="text-[10px] text-slate-400">Render banners at sidebar header widgets</p>
                </div>
                <button onClick={() => setDashboardNotif(!dashboardNotif)} className="text-[#5B5BD6] focus:outline-none transition-all">
                  {dashboardNotif ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold border-t border-slate-100 pt-3.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700">Overdue Reminders</span>
                  <p className="text-[10px] text-slate-400">Daily ping alerts on unreturned checkout items</p>
                </div>
                <button onClick={() => setReminderNotif(!reminderNotif)} className="text-[#5B5BD6] focus:outline-none transition-all">
                  {reminderNotif ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default NotificationsPage;
