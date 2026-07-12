import React from 'react';
import { Bell, ShieldAlert, Wrench, Calendar, FileText, CheckCircle2, Bookmark, Eye, Check, Archive, RefreshCw } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  time: string;
  status: 'unread' | 'read' | 'archived';
}

interface ListProps {
  notifications: NotificationItem[];
  onSelect: (item: NotificationItem) => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}

export const NotificationList: React.FC<ListProps> = ({
  notifications,
  onSelect,
  onMarkRead,
  onArchive
}) => {
  
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'maintenance': return Wrench;
      case 'bookings': return Calendar;
      case 'approvals': return FileText;
      case 'transfers': return RefreshCw;
      case 'returns': return CheckCircle2;
      default: return Bell;
    }
  };

  const getPriorityStyle = (prio: NotificationItem['priority']) => {
    switch (prio) {
      case 'critical': return 'border-l-4 border-l-rose-500 bg-rose-50/20';
      case 'high': return 'border-l-4 border-l-orange-500 bg-orange-50/20';
      case 'medium': return 'border-l-4 border-l-blue-500 bg-blue-55/5';
      case 'low': return 'border-l-4 border-l-emerald-500 bg-emerald-55/5';
      default: return 'border-l-4 border-l-slate-200';
    }
  };

  const getPriorityBadge = (prio: NotificationItem['priority']) => {
    const labels = {
      critical: '🔴 Critical',
      high: '🟠 High',
      medium: '🔵 Medium',
      low: '🟢 Low'
    };
    return (
      <span className="text-[9px] font-extrabold uppercase font-mono tracking-wide">
        {labels[prio]}
      </span>
    );
  };

  return (
    <div className="space-y-3.5 font-semibold text-xs text-slate-700">
      {notifications.map(item => {
        const Icon = getCategoryIcon(item.category);
        const prioStyle = getPriorityStyle(item.priority);
        const isUnread = item.status === 'unread';

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-4 bg-white border border-slate-200 hover:border-slate-350 rounded-2xl flex gap-4 transition-all duration-150 hover:shadow-xs group cursor-pointer relative ${prioStyle}`}
          >
            {/* Category Icon indicator */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 self-start text-slate-500">
              <Icon className="w-4.5 h-4.5" />
            </div>

            {/* Content text */}
            <div className="space-y-1.5 flex-1 min-w-0 pr-12">
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-[12.5px] truncate block leading-tight ${
                  isUnread ? 'text-slate-900 font-black' : 'text-slate-700'
                }`}>
                  {item.title}
                </span>
                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread alert" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed line-clamp-2">
                {item.description}
              </p>
              
              {/* Timeline metadata */}
              <div className="flex items-center gap-3.5 text-[10px] text-slate-400 font-medium font-mono pt-1">
                <span>{item.time}</span>
                <span>•</span>
                <span>Category: <span className="capitalize font-bold text-slate-500">{item.category}</span></span>
                <span>•</span>
                {getPriorityBadge(item.priority)}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUnread && (
                <button
                  onClick={e => { e.stopPropagation(); onMarkRead(item.id); }}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#5B5BD6] hover:bg-[#5B5BD6]/5 hover:text-[#5B5BD6] text-slate-400 transition-all cursor-pointer"
                  title="Mark as read"
                >
                  <Check className="w-4.5 h-4.5" />
                </button>
              )}
              {item.status !== 'archived' && (
                <button
                  onClick={e => { e.stopPropagation(); onArchive(item.id); }}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                  title="Archive notification"
                >
                  <Archive className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
