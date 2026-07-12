import React from 'react';
import { SvgBarChart } from '../../../../shared/SvgCharts';

export const AllocationChart: React.FC = () => {
  const chartData = [
    { label: 'Aman', value: 5 },
    { label: 'Rahul', value: 4 },
    { label: 'Priya', value: 3 },
    { label: 'Riya', value: 2 },
    { label: 'Sneha', value: 2 }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between h-full">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Holders rank</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Top Employee Allocations</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-400 uppercase">Assets count</span>
      </div>

      <div className="py-4 flex-grow flex items-end">
        <SvgBarChart data={chartData} height={150} />
      </div>
    </div>
  );
};

export default AllocationChart;
