import React from 'react';
import { Sparkles, CalendarRange, Laptop, Users } from 'lucide-react';

export const DepartmentHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/40">
      
      {/* Decorative gradient blob */}
      <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-48 h-48 bg-gradient-to-br from-[#5B5BD6]/5 to-[#5B5BD6]/8 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 font-semibold text-xs text-slate-700">
        
        {/* Welcome Text */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Good Morning, Rahul Sharma
            </h1>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5B5BD6]/8 text-[#5B5BD6] text-[8.5px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Supervisor Mode</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Head of <span className="text-[#5B5BD6] font-extrabold">Information Technology Department</span>
          </p>
        </div>

        {/* Counts indicators summary */}
        <div className="flex items-center gap-4.5 bg-slate-50 border border-slate-150 py-2 px-4 rounded-xl text-[10.5px]">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span><span className="font-extrabold text-slate-800">42</span> Employees</span>
          </div>
          <div className="border-l border-slate-200 h-4.5" />
          <div className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-[#5B5BD6]" />
            <span><span className="font-extrabold text-slate-850">186</span> Assets</span>
          </div>
          <div className="border-l border-slate-200 h-4.5" />
          <div className="flex items-center gap-1.5">
            <CalendarRange className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-bold">🟢 Operational Status</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DepartmentHero;
