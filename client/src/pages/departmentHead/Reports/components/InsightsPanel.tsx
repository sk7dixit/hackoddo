import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

export const InsightsPanel: React.FC = () => {
  const insights = [
    { text: '78% of IT department assets are actively utilized (Allocated / Reserved).', type: 'info' },
    { text: 'Meeting Room Alpha is booked 91% of available business hours.', type: 'success' },
    { text: '4 assets (including Dell XPS AF-0056) are overdue for return.', type: 'warning' },
    { text: 'Laptops category generated the highest maintenance requests (swollen battery issues).', type: 'error' },
    { text: 'Resource utilization increased by 14% compared to the previous month.', type: 'info' }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5B5BD6]" />
          <h4 className="font-extrabold text-xs text-slate-800">Operational Insights summary</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-450 uppercase">Calculated</span>
      </div>

      <div className="space-y-3.5 text-xs font-semibold text-slate-700">
        {insights.map((ins, idx) => (
          <div 
            key={idx}
            className="flex gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl items-start hover:border-[#5B5BD6]/20 hover:bg-white transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed text-slate-800">{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
