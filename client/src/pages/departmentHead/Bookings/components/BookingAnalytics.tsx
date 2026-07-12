import React from 'react';
import { SvgBarChart } from '../../../../shared/SvgCharts';

export const BookingAnalytics: React.FC = () => {
  const chartData = [
    { label: 'Mon', value: 4 },
    { label: 'Tue', value: 8 },
    { label: 'Wed', value: 12 },
    { label: 'Thu', value: 7 },
    { label: 'Fri', value: 9 }
  ];

  const mostUsed = [
    { name: 'Meeting Room Alpha', count: 45, pct: 90, color: 'bg-[#5B5BD6]' },
    { name: 'Conference Hall', count: 38, pct: 76, color: 'bg-emerald-500' },
    { name: 'Tesla Model Y Car', count: 26, pct: 52, color: 'bg-blue-500' }
  ];

  const heatmap = [
    { hour: '09 AM', count: 3, style: 'bg-emerald-100/60 border-emerald-200 text-emerald-800' },
    { hour: '10 AM', count: 12, style: 'bg-[#5B5BD6]/20 border-[#5B5BD6]/30 text-[#5B5BD6]' },
    { hour: '11 AM', count: 15, style: 'bg-[#5B5BD6] text-white border-transparent shadow-sm' },
    { hour: '12 PM', count: 2, style: 'bg-slate-50 border-slate-200 text-slate-500' },
    { hour: '01 PM', count: 4, style: 'bg-emerald-100/60 border-emerald-200 text-emerald-800' },
    { hour: '02 PM', count: 9, style: 'bg-blue-150 border-blue-200 text-blue-800' },
    { hour: '03 PM', count: 11, style: 'bg-blue-200 border-blue-300 text-blue-900' },
    { hour: '04 PM', count: 5, style: 'bg-emerald-100/60 border-emerald-200 text-emerald-800' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* 1. Most Used */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Utilization metrics</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Most Used Resources</h4>
        </div>
        
        <div className="space-y-4 pt-1 text-xs font-semibold text-slate-700">
          {mostUsed.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="font-extrabold text-slate-850">{item.name}</span>
                <span className="font-bold text-slate-450">{item.count} Bookings</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Peak Hours Heatmap */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Schedules density</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Peak Booking Hours</h4>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1 text-center font-bold text-[10.5px]">
          {heatmap.map((h, idx) => (
            <div 
              key={idx}
              className={`p-2.5 border rounded-xl flex flex-col justify-center gap-1 ${h.style}`}
            >
              <span className="block opacity-85 leading-none">{h.hour}</span>
              <span className="font-mono text-[9px] block opacity-60 mt-0.5 leading-none">
                {h.count} Bookings
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Weekly Chart */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Weekly summary load</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Weekly Resource Reservation</h4>
          </div>
          <span className="text-[9.5px] font-bold text-slate-450 uppercase">Reserved</span>
        </div>

        <div className="py-2 flex-grow flex items-end">
          <SvgBarChart data={chartData} height={120} />
        </div>
      </div>

    </div>
  );
};

export default BookingAnalytics;
