import React from 'react';
import { Boxes, ClipboardCheck, CalendarRange, BarChart3, Bell, History } from 'lucide-react';

interface GridProps {
  onSelectCategory: (cat: string) => void;
}

export const QuickHelpGrid: React.FC<GridProps> = ({ onSelectCategory }) => {
  const cards = [
    { title: 'Managing Assets', desc: 'Monitor checkouts, tags, and lifecycle events', icon: Boxes, query: 'asset', style: 'hover:border-blue-300 hover:bg-blue-50/20 text-blue-600' },
    { title: 'Approval Workflows', desc: 'Approve or reject allocation/transfer lists', icon: ClipboardCheck, query: 'approve', style: 'hover:border-emerald-300 hover:bg-emerald-50/20 text-emerald-600' },
    { title: 'Booking Resources', desc: 'Time slot overlaps conflict checks', icon: CalendarRange, query: 'booking', style: 'hover:border-purple-300 hover:bg-purple-50/20 text-purple-650' },
    { title: 'Reports & Exporting', desc: 'Filter date scopes and export spreadsheets', icon: BarChart3, query: 'reports', style: 'hover:border-[#5B5BD6]/50 hover:bg-[#5B5BD6]/5 text-[#5B5BD6]' },
    { title: 'System Alerts', desc: 'Track overdue checklists and reminders', icon: Bell, query: 'notifications', style: 'hover:border-amber-300 hover:bg-amber-50/20 text-amber-600' },
    { title: 'Permanent Audit Trail', desc: 'Review login activities and exports lists', icon: History, query: 'logs', style: 'hover:border-slate-350 hover:bg-slate-50 text-slate-650' }
  ];

  return (
    <div className="space-y-3 font-semibold text-xs text-slate-700">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
        Quick Help Chapters
      </span>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectCategory(card.query)}
              className={`p-4 bg-white border border-slate-200 rounded-2xl text-left cursor-pointer transition-all duration-200 hover:shadow-xs flex gap-3.5 items-start group ${card.style}`}
            >
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 text-slate-500 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-xs text-slate-800 block group-hover:text-slate-950">
                  {card.title}
                </span>
                <p className="text-[10px] text-slate-450 font-normal leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickHelpGrid;
