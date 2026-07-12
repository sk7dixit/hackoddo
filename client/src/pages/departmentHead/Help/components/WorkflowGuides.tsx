import React from 'react';
import { ArrowRight, Laptop, UserCheck, Wrench, CalendarCheck } from 'lucide-react';

export const WorkflowGuides: React.FC = () => {
  return (
    <div className="space-y-4.5 font-semibold text-xs text-slate-700">
      
      <div className="border-b border-slate-100 pb-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Workflow diagrams</span>
        <h4 className="font-extrabold text-xs text-slate-800 mt-1">IT Operational Guides</h4>
      </div>

      <div className="space-y-4">
        
        {/* 1. Asset allocation */}
        <div className="p-4 bg-slate-50 border border-slate-150 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-[#5B5BD6]">
            <Laptop className="w-4 h-4" />
            <span className="font-extrabold text-slate-800">Asset Approval & Checkout Flow</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Employee Initiator</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Allocation Request</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-[#5B5BD6]/8 border border-[#5B5BD6]/20 text-[#5B5BD6] rounded-lg font-extrabold">Dept Head Review</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Asset Manager</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-emerald-50 border border-emerald-150 text-emerald-600 rounded-lg font-bold">Allocated</span>
          </div>
        </div>

        {/* 2. Transfer */}
        <div className="p-4 bg-slate-50 border border-slate-150 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-[#5B5BD6]">
            <UserCheck className="w-4 h-4" />
            <span className="font-extrabold text-slate-800">Asset Transfer Flow</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Current Holder</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Transfer Request</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-[#5B5BD6]/8 border border-[#5B5BD6]/20 text-[#5B5BD6] rounded-lg font-extrabold">Dept Head Review</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Asset Manager Approval</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-emerald-50 border border-emerald-150 text-emerald-600 rounded-lg font-bold">Transfer Complete</span>
          </div>
        </div>

        {/* 3. Booking */}
        <div className="p-4 bg-slate-50 border border-slate-150 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-[#5B5BD6]">
            <CalendarCheck className="w-4 h-4" />
            <span className="font-extrabold text-slate-800">Resource Booking Flow</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Select Resource</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg">Choose Hourly Slot</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-[#5B5BD6]/8 border border-[#5B5BD6]/20 text-[#5B5BD6] rounded-lg font-extrabold">Conflict overlap validation</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-1 bg-emerald-50 border border-emerald-150 text-emerald-600 rounded-lg font-bold">Booking Confirmed</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WorkflowGuides;
