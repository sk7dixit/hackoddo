import React from 'react';
import { Laptop, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ReturnItem {
  id: string;
  assetName: string;
  assignedTo: string;
  dueDate: string;
  flag: 'today' | 'tomorrow' | 'overdue';
}

export const UpcomingReturns: React.FC = () => {
  const returns: ReturnItem[] = [
    { id: 'AF-0104', assetName: 'Lenovo ThinkPad X1 Carbon', assignedTo: 'Rohit Sen', dueDate: 'Tomorrow', flag: 'tomorrow' },
    { id: 'AF-0098', assetName: 'iPad Pro (11")', assignedTo: 'Amit Kumar', dueDate: 'Today', flag: 'today' },
    { id: 'AF-0056', assetName: 'Dell XPS 15', assignedTo: 'Sneha Roy', dueDate: '3 Days Overdue', flag: 'overdue' }
  ];

  const getFlagStyle = (flag: 'today' | 'tomorrow' | 'overdue') => {
    switch (flag) {
      case 'overdue':
        return {
          bg: 'bg-rose-50 border-rose-200/80',
          badge: 'bg-rose-100 text-rose-700 border-rose-200',
          text: 'text-rose-600',
          icon: AlertTriangle
        };
      case 'today':
        return {
          bg: 'bg-orange-50/50 border-orange-200/60',
          badge: 'bg-orange-100 text-orange-700 border-orange-200',
          text: 'text-orange-600',
          icon: Clock
        };
      case 'tomorrow':
      default:
        return {
          bg: 'bg-emerald-50/50 border-emerald-250/50',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          text: 'text-emerald-600',
          icon: CheckCircle
        };
    }
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col h-full justify-between">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Expected returns</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Upcoming Returns</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-400 uppercase font-mono">3 Items</span>
      </div>

      <div className="space-y-3 flex-grow mt-2 overflow-y-auto max-h-[220px] pr-1">
        {returns.map(item => {
          const config = getFlagStyle(item.flag);
          const Icon = config.icon;
          return (
            <div key={item.id} className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold text-slate-700 ${config.bg}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block text-xs leading-none">
                    {item.assetName}
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-450 mt-1 block">
                    Holder: {item.assignedTo} • <span className="font-mono text-[9px]">{item.id}</span>
                  </span>
                </div>
              </div>

              {/* Due Date Indicator Badge */}
              <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[9.5px] font-bold ${config.badge}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{item.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingReturns;
