import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Boxes, CalendarDays, BarChart3 } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Approve Requests',
      desc: 'Verify and authorize asset requests',
      icon: ClipboardCheck,
      to: '/department-head/requests',
      color: 'hover:border-[#5B5BD6]/40 hover:bg-[#5B5BD6]/5 text-[#5B5BD6]',
    },
    {
      title: 'Department Assets',
      desc: 'Audit your department hardware stock',
      icon: Boxes,
      to: '/department-head/assets',
      color: 'hover:border-blue-400/40 hover:bg-blue-500/5 text-blue-600',
    },
    {
      title: 'Book Resource',
      desc: 'Reserve meeting rooms and cars',
      icon: CalendarDays,
      to: '/department-head/bookings',
      color: 'hover:border-emerald-400/40 hover:bg-emerald-500/5 text-emerald-600',
    },
    {
      title: 'Department Report',
      desc: 'Export expense and lifecycle lists',
      icon: BarChart3,
      to: '/department-head/reports',
      color: 'hover:border-violet-400/40 hover:bg-violet-500/5 text-violet-600',
    },
  ];

  return (
    <div className="space-y-3.5">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
        Department Quick Actions
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(act.to)}
              className={`p-4 bg-white border border-slate-200 rounded-2xl text-left transition-all duration-200 cursor-pointer hover:shadow-md flex items-center gap-3.5 group ${act.color}`}
            >
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                <Icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 group-hover:text-slate-950 block">
                  {act.title}
                </span>
                <span className="text-[10.5px] font-bold text-slate-400 mt-1 block group-hover:text-slate-500 leading-snug">
                  {act.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
