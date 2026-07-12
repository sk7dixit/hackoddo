import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Calendar, AlertCircle } from 'lucide-react';

interface NotifItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'transfer' | 'maintenance' | 'booking' | 'return' | 'audit';
}

export const NotificationWidget: React.FC = () => {
  const notifications: NotifItem[] = [
    {
      id: 'n-1',
      title: 'Transfer Request Pending',
      message: 'Rohit Sen has requested transfer of iPad Pro to Priya Sharma.',
      time: '12m ago',
      unread: true,
      type: 'transfer'
    },
    {
      id: 'n-2',
      title: 'Maintenance Approved',
      message: 'Dell XPS 15 repair request has been authorized and routed to technician.',
      time: '1h ago',
      unread: true,
      type: 'maintenance'
    },
    {
      id: 'n-3',
      title: 'Booking Reminder',
      message: 'Your meeting Room Alpha reservation starts in 15 minutes.',
      time: '2h ago',
      unread: false,
      type: 'booking'
    },
    {
      id: 'n-4',
      title: 'Asset Return Due Today',
      message: 'Lenovo ThinkPad assigned to Amit Kumar is due back in inventory today.',
      time: '4h ago',
      unread: false,
      type: 'return'
    },
    {
      id: 'n-5',
      title: 'IT Compliance Audit Scheduled',
      message: 'Q3 Asset Verification cycle starts next week. Review department holdings.',
      time: '1d ago',
      unread: false,
      type: 'audit'
    }
  ];

  const getIcon = (type: NotifItem['type']) => {
    switch (type) {
      case 'transfer':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'maintenance':
        return <CheckCircle className="w-4 h-4 text-[#5B5BD6]" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'return':
        return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case 'audit':
      default:
        return <Bell className="w-4 h-4 text-violet-500" />;
    }
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Activity inbox</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Notifications</h4>
        </div>
        <span className="text-[9.5px] font-bold text-[#5B5BD6] bg-[#5B5BD6]/8 px-2 py-0.5 rounded border border-[#5B5BD6]/10">
          2 New
        </span>
      </div>

      <div className="space-y-3.5 text-xs font-semibold text-slate-700">
        {notifications.map(item => (
          <div key={item.id} className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
            item.unread 
              ? 'bg-[#5B5BD6]/4 border-[#5B5BD6]/15' 
              : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50'
          }`}>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 mt-0.5 shadow-sm">
              {getIcon(item.type)}
            </div>
            
            <div className="space-y-1 flex-grow">
              <div className="flex justify-between items-center">
                <span className={`text-xs block ${item.unread ? 'font-black text-slate-900' : 'font-extrabold text-slate-800'}`}>
                  {item.title}
                </span>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold whitespace-nowrap pl-2">
                  {item.time}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-450 leading-relaxed font-semibold">
                {item.message}
              </p>
            </div>

            {item.unread && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6] shrink-0 mt-2 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationWidget;
