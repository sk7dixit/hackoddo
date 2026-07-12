import React from 'react';
import { SvgBarChart, SvgDonutChart } from '../../../../shared/SvgCharts';
import { Clock, CheckSquare, Percent } from 'lucide-react';

export const ActivityAnalytics: React.FC = () => {
  const chartData = [
    { label: 'Mon', value: 25 },
    { label: 'Tue', value: 38 },
    { label: 'Wed', value: 18 },
    { label: 'Thu', value: 45 },
    { label: 'Fri', value: 32 },
    { label: 'Sat', value: 10 },
    { label: 'Sun', value: 4 }
  ];

  const moduleUsage = [
    { label: 'Assets', value: 1245, color: '#5B5BD6' },
    { label: 'Approvals', value: 817, color: '#22C55E' },
    { label: 'Bookings', value: 421, color: '#3b82f6' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
      
      {/* 1. Stats and metrics */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Speed performance</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Approval Metrics Summary</h4>
        </div>
        
        <div className="space-y-3.5 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
            <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Average Approval Time</span>
              <span className="text-sm font-black text-slate-800 block mt-1">2.4 Hours</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-emerald-55/10 border border-emerald-100 text-emerald-600 rounded-2xl">
            <div className="w-8.5 h-8.5 rounded-xl bg-white border border-emerald-250 flex items-center justify-center shadow-sm">
              <Percent className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Approval Rate</span>
              <span className="text-sm font-black text-slate-800 block mt-1">96%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
            <div className="w-8.5 h-8.5 rounded-xl bg-white border border-rose-250 flex items-center justify-center shadow-sm">
              <CheckSquare className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Rejection Rate</span>
              <span className="text-sm font-black text-rose-700 block mt-1">7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Donut chart module breakdown */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Modules activity</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Module Usage Distribution</h4>
        </div>
        <div className="py-1 flex justify-center">
          <SvgDonutChart data={moduleUsage} size={120} />
        </div>
      </div>

      {/* 3. Bar chart daily activities count */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">SLA performance</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Daily Log Activities</h4>
          </div>
          <span className="text-[9.5px] font-bold text-slate-450 uppercase">Events</span>
        </div>
        <div className="py-2 flex-grow flex items-end">
          <SvgBarChart data={chartData} height={120} />
        </div>
      </div>

    </div>
  );
};

export default ActivityAnalytics;
