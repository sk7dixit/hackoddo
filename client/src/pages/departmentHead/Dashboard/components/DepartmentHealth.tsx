import React from 'react';

interface MetricBarProps {
  label: string;
  value: number;
  colorClass: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, colorClass }) => {
  return (
    <div className="space-y-2 text-xs font-semibold text-slate-700">
      <div className="flex justify-between items-center text-[10.5px]">
        <span>{label}</span>
        <span className="font-bold font-mono">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export const DepartmentHealth: React.FC = () => {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5 flex flex-col justify-between h-full">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Operational health</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Department Health Index</h4>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
          Excellent
        </span>
      </div>

      {/* Large Score Indicator */}
      <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5B5BD6] to-indigo-400 text-white flex flex-col items-center justify-center shadow-lg shadow-[#5B5BD6]/20 shrink-0">
          <span className="text-xl font-black font-mono leading-none">92%</span>
          <span className="text-[7.5px] uppercase font-bold tracking-widest mt-1 opacity-80">Score</span>
        </div>
        <div>
          <span className="text-xs font-extrabold text-slate-800">IT Department Health</span>
          <p className="text-[10.5px] text-slate-450 font-semibold mt-1 leading-relaxed">
            Calculated across active custody allocations, return accuracies, and repair SLAs.
          </p>
        </div>
      </div>

      {/* Progress Bars list */}
      <div className="space-y-4">
        <MetricBar 
          label="Assets Available Index"
          value={92}
          colorClass="bg-[#5B5BD6]"
        />
        <MetricBar 
          label="On-Time Returns Completed"
          value={96}
          colorClass="bg-emerald-500"
        />
        <MetricBar 
          label="Maintenance SLA Compliance"
          value={89}
          colorClass="bg-amber-500"
        />
        <MetricBar 
          label="Room Booking Utilization"
          value={78}
          colorClass="bg-blue-500"
        />
      </div>
    </div>
  );
};

export default DepartmentHealth;
