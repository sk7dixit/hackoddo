import React from 'react';
import { CheckCircle2, Laptop, Repeat, Wrench } from 'lucide-react';

interface ActivityItem {
  time: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  iconBg: string;
}

export const RecentActivities: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      time: '09:20 AM',
      title: 'Custody Transfer Approved',
      desc: 'iPad Pro AF-0098 moved from Rohit Sen to Priya Sharma.',
      icon: Repeat,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      time: '08:55 AM',
      title: 'MacBook Pro AF-0008 Assigned',
      desc: 'Allocation request approved and asset handed to Aman Verma.',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      time: 'Yesterday',
      title: 'Projector AF-0021 Returned',
      desc: 'Returned by Sales team and restored to ops directory.',
      icon: Laptop,
      iconBg: 'bg-slate-50 text-slate-500 border-slate-200'
    },
    {
      time: 'Yesterday',
      title: 'Maintenance Ticket Closed',
      desc: 'Keyboard key replaced on ThinkPad AF-0103. Returned to user.',
      icon: Wrench,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100'
    }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Operation logs</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Recent Activities</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-400 uppercase">Audit Trail</span>
      </div>

      <div className="relative border-l border-slate-150 pl-5 ml-2.5 py-2 space-y-5.5 text-xs font-semibold text-slate-700">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div key={idx} className="relative group">
              {/* Timeline marker node */}
              <div className={`absolute -left-[30px] top-0 w-5.5 h-5.5 rounded-full border flex items-center justify-center bg-white shadow-sm z-10 transition-transform group-hover:scale-110 ${act.iconBg}`}>
                <Icon className="w-3 h-3" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-850 block">
                    {act.title}
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold">
                    {act.time}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-450 leading-relaxed font-semibold">
                  {act.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
