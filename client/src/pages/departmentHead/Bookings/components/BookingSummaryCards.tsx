import React from 'react';
import { CalendarDays, ShieldCheck, CheckCircle2, Bookmark, XCircle, Percent } from 'lucide-react';

export const BookingSummaryCards: React.FC = () => {
  const cards = [
    { title: 'Total Resources', value: 24, icon: CalendarDays, style: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
    { title: 'Active Bookings', value: 9, icon: Bookmark, style: 'bg-blue-50 border-blue-100 text-blue-700' },
    { title: 'Available Today', value: 15, icon: CheckCircle2, style: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
    { title: 'Upcoming Bookings', value: 7, icon: CalendarDays, style: 'bg-teal-50 border-teal-100 text-teal-700' },
    { title: 'Cancelled', value: 2, icon: XCircle, style: 'bg-rose-50 border-rose-100 text-rose-700' },
    { title: 'Utilization index', value: '82%', icon: Percent, style: 'bg-purple-50 border-purple-100 text-purple-700' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

export default BookingSummaryCards;
