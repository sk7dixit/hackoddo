import React, { useState } from 'react';
import NotificationSummaryCards from './components/NotificationSummaryCards';
import NotificationFilters from './components/NotificationFilters';
import NotificationList from './components/NotificationList';
import NotificationDrawer from './components/NotificationDrawer';
import NotificationPreferences from './components/NotificationPreferences';
import { toast } from '../../../components/Toast';
import { Bell, CheckSquare, Trash2, Archive } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  time: string;
  status: 'unread' | 'read' | 'archived';
}

export const Notifications: React.FC = () => {
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  // Selected Notification for Drawer
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  // Mock Notification Database state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NT-101',
      title: 'Transfer Request Awaiting Review',
      description: 'Rahul Verma has initiated a transfer request of Laptop AF-0045 to Priya Sharma.',
      category: 'transfers',
      priority: 'high',
      time: '10 mins ago',
      status: 'unread'
    },
    {
      id: 'NT-102',
      title: 'Meeting Room Alpha Confirmed',
      description: 'Reservation for Sprint Planning Meeting has been confirmed for 10:00 AM - 12:00 PM today.',
      category: 'bookings',
      priority: 'medium',
      time: '30 mins ago',
      status: 'unread'
    },
    {
      id: 'NT-103',
      title: 'Critical: Dell XPS Battery Swelling',
      description: 'Emma Watson submitted a maintenance request for AF-0144 with swollen battery concerns.',
      category: 'maintenance',
      priority: 'critical',
      time: '2 hours ago',
      status: 'unread'
    },
    {
      id: 'NT-104',
      title: 'Return Checklist Overdue Warning',
      description: 'Sneha Roy checkout period for Laptop AF-0056 ended 3 days ago. Return is overdue.',
      category: 'returns',
      priority: 'high',
      time: 'Yesterday',
      status: 'unread'
    },
    {
      id: 'NT-105',
      title: 'Quarterly Audit Scheduled',
      description: 'Admin has scheduled a quarterly inventory audit compliance review for tomorrow.',
      category: 'audit',
      priority: 'low',
      time: 'Yesterday',
      status: 'read'
    },
    {
      id: 'NT-106',
      title: 'Allocation Approved notification',
      description: 'Asset Manager has successfully allocated Projector AF-0021 to IT Floor Conference room.',
      category: 'approvals',
      priority: 'medium',
      time: '2 days ago',
      status: 'read'
    },
    {
      id: 'NT-107',
      title: 'System Firmware Updates completed',
      description: 'HQ network router firmware updates completed successfully overnight.',
      category: 'system',
      priority: 'low',
      time: '3 days ago',
      status: 'archived'
    }
  ]);

  // Actions
  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(nt => {
      if (nt.id === id) return { ...nt, status: 'read' };
      return nt;
    }));
    toast.success('Marked as read.');
  };

  const handleArchive = (id: string) => {
    setNotifications(prev => prev.map(nt => {
      if (nt.id === id) return { ...nt, status: 'archived' };
      return nt;
    }));
    toast.success('Notification archived.');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(nt => {
      if (nt.status === 'unread') return { ...nt, status: 'read' };
      return nt;
    }));
    toast.success('All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notification alerts cleared.');
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setStatus('all');
    setPriority('all');
    toast.success('Filters cleared.');
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setSelectedNotification(item);
    if (item.status === 'unread') {
      handleMarkRead(item.id);
    }
  };

  // Compute counts for cards
  const summaryCounts = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    critical: notifications.filter(n => n.priority === 'critical' && n.status === 'unread').length,
    today: notifications.filter(n => n.time.includes('ago') || n.time === 'Today').length,
    week: notifications.filter(n => !n.time.includes('days')).length,
    archived: notifications.filter(n => n.status === 'archived').length
  };

  // Filtering logic
  const filteredNotifications = notifications.filter(item => {
    const q = search.toLowerCase();
    const searchMatch = !search ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q);

    const categoryMatch = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    const statusMatch = status === 'all' || item.status === status;
    const priorityMatch = priority === 'all' || item.priority === priority;

    return searchMatch && categoryMatch && statusMatch && priorityMatch;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Stay updated with department-level checkouts, approvals timeline, and critical overdue warnings
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 text-xs font-bold font-mono">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2.5 border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl flex items-center gap-1.5 cursor-pointer text-slate-750 font-sans"
          >
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <span>Mark All Read</span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100/60 border border-rose-150 text-rose-700 rounded-xl flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Clear Alerts</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <NotificationSummaryCards counts={summaryCounts} />

      {/* Filters and category chips selector */}
      <NotificationFilters
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        onClear={handleClearFilters}
      />

      {/* List layout and preference side card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts card stack list */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Inbox Alert Stream
          </span>
          {filteredNotifications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 animate-pulse">
                <Bell className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-800">You're all caught up</h3>
                <p className="text-[10.5px] text-slate-450 font-semibold max-w-xs">No pending notifications match the filter parameters.</p>
              </div>
            </div>
          ) : (
            <NotificationList
              notifications={filteredNotifications}
              onSelect={handleSelectNotification}
              onMarkRead={handleMarkRead}
              onArchive={handleArchive}
            />
          )}
        </div>

        {/* Preferences selector card */}
        <div>
          <NotificationPreferences />
        </div>

      </div>

      {/* Details drawer slider */}
      <NotificationDrawer 
        item={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />

    </div>
  );
};

export default Notifications;
