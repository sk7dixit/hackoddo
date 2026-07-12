import React from 'react';
import { SvgBarChart } from '../../../../shared/SvgCharts';
import { Percent, Clock, AlertTriangle } from 'lucide-react';

export const ApprovalAnalytics: React.FC = () => {
  const chartData = [
    { label: 'Mon', value: 8 },
    { label: 'Tue', value: 12 },
    { label: 'Wed', value: 6 },
    { label: 'Thu', value: 15 },
    { label: 'Fri', value: 9 },
    { label: 'Sat', value: 2 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Left Card: Stats ledger */}
      <div className="lg:col-span-1 p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="border-b border-slate-100 pb-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">KPI summaries</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Approval Performance</h4>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Approval Rate</span>
              <span className="text-sm font-black text-slate-800 block mt-1">96%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
            <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Avg Resolution time</span>
              <span className="text-sm font-black text-slate-800 block mt-1">4 Hours</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
            <div className="w-8.5 h-8.5 rounded-xl bg-white border border-rose-250 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Overdue 48h</span>
              <span className="text-sm font-black text-rose-700 block mt-1">3 Pnd Requests</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Right Card: Svg chart weekly */}
      <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Weekly processing load</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Completed Approvals</h4>
          </div>
          <span className="text-[9.5px] font-bold text-slate-450 uppercase">Requests count</span>
        </div>

        <div className="py-2 flex-grow flex items-end">
          <SvgBarChart data={chartData} height={140} />
        </div>
      </div>

    </div>
  );
};

export default ApprovalAnalytics;
