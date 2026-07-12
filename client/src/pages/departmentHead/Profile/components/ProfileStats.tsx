import React from 'react';
import { Boxes, ClipboardCheck, CalendarDays, FileText } from 'lucide-react';

interface StatsProps {
  stats: {
    assets: number;
    approvals: number;
    bookings: number;
    reports: number;
  };
}

export const ProfileStats: React.FC<StatsProps> = ({ stats }) => {
  const cards = [
    { title: 'Assets Managed', value: stats.assets, icon: Boxes, style: 'bg-blue-50 border-blue-105 text-blue-650' },
    { title: 'Approvals Actioned', value: stats.approvals, icon: ClipboardCheck, style: 'bg-emerald-55/10 border-emerald-100 text-emerald-650' },
    { title: 'Resource Bookings', value: stats.bookings, icon: CalendarDays, style: 'bg-purple-50 border-purple-100 text-purple-650' },
    { title: 'Reports Generated', value: stats.reports, icon: FileText, style: 'bg-indigo-50 border-indigo-100 text-[#5B5BD6]' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold text-xs text-slate-700">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`p-4 border rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-all ${card.style}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">{card.title}</span>
                <span className="text-2xl font-black font-mono block mt-2">{card.value}</span>
              </div>
              <div className="w-7.5 h-7.5 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;
