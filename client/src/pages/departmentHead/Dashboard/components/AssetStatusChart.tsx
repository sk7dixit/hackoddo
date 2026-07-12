import React from 'react';
import { SvgDonutChart } from '../../../../shared/SvgCharts';

export const AssetStatusChart: React.FC = () => {
  const chartData = [
    { label: 'Available', value: 45, color: '#22C55E' },
    { label: 'Allocated', value: 113, color: '#5B5BD6' },
    { label: 'Maintenance', value: 18, color: '#F59E0B' },
    { label: 'Reserved', value: 10, color: '#3b82f6' }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between h-full">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Inventory status</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Asset Status Distribution</h4>
        </div>
        <span className="text-[9.5px] font-bold bg-[#5B5BD6]/8 text-[#5B5BD6] px-2 py-0.5 rounded border border-[#5B5BD6]/10">Live Stats</span>
      </div>
      
      <div className="py-4 flex justify-center items-center flex-grow">
        <SvgDonutChart data={chartData} size={150} />
      </div>
    </div>
  );
};

export default AssetStatusChart;
