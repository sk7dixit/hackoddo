import React from 'react';
import { Building, User, Users, Boxes, CalendarDays, ClipboardCheck } from 'lucide-react';

export const DepartmentOverview: React.FC = () => {
  const details = [
    { label: 'Department', value: 'Information Technology', icon: Building },
    { label: 'Department Head', value: 'Rahul Sharma', icon: User },
    { label: 'Employees count', value: '42 Staff members', icon: Users },
    { label: 'Asset Holdings', value: '186 Registered Units', icon: Boxes },
    { label: 'Shared Resources', value: '12 Shared Resources', icon: CalendarDays },
    { label: 'Open Requests', value: '7 Pending approvals', icon: ClipboardCheck }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Profile context</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Department Overview</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-400 uppercase">Snapshot</span>
      </div>

      <div className="space-y-3.5 text-xs font-semibold text-slate-700">
        {details.map((detail, idx) => {
          const Icon = detail.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
              <div className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">
                  {detail.label}
                </span>
                <span className="text-xs font-extrabold text-slate-800 block mt-1">
                  {detail.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentOverview;
