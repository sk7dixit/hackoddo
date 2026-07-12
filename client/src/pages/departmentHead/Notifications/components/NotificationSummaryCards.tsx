import React from 'react';
import { Bell, ShieldAlert, AlertTriangle, CalendarDays, History, Archive } from 'lucide-react';

interface SummaryCountsProps {
  counts: {
    total: number;
    unread: number;
    critical: number;
    today: number;
    week: number;
    archived: number;
  };
}

export const NotificationSummaryCards: React.FC<SummaryCountsProps> = ({ counts }) => {
  const cards = [
    { title: 'Total Notifications', value: counts.total, icon: Bell, style: 'bg-blue-50 border-blue-100 text-blue-650' },
    { title: 'Unread Alert Pings', value: counts.unread, icon: ShieldAlert, style: 'bg-rose-50 border-rose-100 text-rose-650' },
    { title: 'Critical Warnings', value: counts.critical, icon: AlertTriangle, style: 'bg-orange-50 border-orange-100 text-orange-650' },
    { title: 'Today\'s Alerts', value: counts.today, icon: CalendarDays, style: 'bg-emerald-55/10 border-emerald-100 text-emerald-650' },
    { title: 'Received This Week', value: counts.week, icon: History, style: 'bg-purple-50 border-purple-100 text-purple-650' },
    { title: 'Archived Logs', value: counts.archived, icon: Archive, style: 'bg-slate-50 border-slate-150 text-slate-650' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-semibold text-xs text-slate-700">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`p-4 border rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-all ${card.style}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">{card.title}</span>
                <span className="text-2.5xl font-black font-mono block mt-2.5">{card.value}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSummaryCards;
