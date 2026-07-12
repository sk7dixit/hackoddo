import React from 'react';
import { History, CalendarDays, AlertTriangle, Boxes, Bookmark, ClipboardCheck } from 'lucide-react';

interface SummaryCountsProps {
  counts: {
    total: number;
    today: number;
    pending: number;
    assets: number;
    bookings: number;
    approvals: number;
  };
}

export const ActivitySummaryCards: React.FC<SummaryCountsProps> = ({ counts }) => {
  const cards = [
    { title: 'Total Activities', value: counts.total.toLocaleString(), icon: History, style: 'bg-blue-50 border-blue-100 text-blue-650' },
    { title: 'Today\'s Activities', value: counts.today, icon: CalendarDays, style: 'bg-emerald-55/10 border-emerald-100 text-emerald-650' },
    { title: 'Pending Actions', value: counts.pending, icon: AlertTriangle, style: 'bg-orange-50 border-orange-100 text-orange-650' },
    { title: 'Asset Activities', value: counts.assets.toLocaleString(), icon: Boxes, style: 'bg-indigo-50 border-indigo-100 text-[#5B5BD6]' },
    { title: 'Booking Activities', value: counts.bookings, icon: Bookmark, style: 'bg-purple-50 border-purple-100 text-purple-650' },
    { title: 'Approval Activities', value: counts.approvals, icon: ClipboardCheck, style: 'bg-teal-50 border-teal-100 text-teal-650' }
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

export default ActivitySummaryCards;
