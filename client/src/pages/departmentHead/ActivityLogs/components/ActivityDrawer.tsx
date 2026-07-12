import React from 'react';
import { X, History, User, Laptop, Info, Clock, CheckCircle2 } from 'lucide-react';

interface ActivityLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  target: string;
  status: 'completed' | 'pending' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  employeeId?: string;
  remarks?: string;
}

interface DrawerProps {
  log: ActivityLogItem | null;
  onClose: () => void;
}

export const ActivityDrawer: React.FC<DrawerProps> = ({ log, onClose }) => {
  if (!log) return null;

  const employeeId = log.employeeId || 'EMP-1001';
  const remarks = log.remarks || 'Audit trail logging confirmed. Operational parameters verified.';

  const getPriorityStyle = (prio: string) => {
    switch (prio) {
      case 'critical': return 'bg-rose-50 border-rose-100 text-rose-700';
      case 'high': return 'bg-orange-50 border-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'low': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[480px] bg-white border-l border-slate-200 h-screen flex flex-col z-10 shadow-2xl animate-slide-left font-semibold text-xs text-slate-700">
        
        {/* Header Title */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Permanent audit ledger</span>
            <h3 className="font-extrabold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
              <span>Inspect log:</span>
              <span className="font-mono text-[#5B5BD6] font-bold">{log.id}</span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable details panel */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">

          {/* Section 1: User Initiator */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Initiator Details
            </h4>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-500 shadow-sm shrink-0">
                {log.user.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {log.user}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Department: IT • Employee ID: <span className="font-mono font-bold">{employeeId}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Action Log Details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Action Description
            </h4>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[11px]">
              <div>
                <span className="text-slate-455 font-bold block">Logged Action</span>
                <span className="text-slate-800 font-extrabold block mt-1">{log.action}</span>
              </div>
              <div>
                <span className="text-slate-455 font-bold block">Execution status</span>
                <span className="text-slate-800 font-extrabold block mt-1 capitalize">{log.status}</span>
              </div>
              <div>
                <span className="text-slate-455 font-bold block">Severity Level</span>
                <div className="mt-1">
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold capitalize ${getPriorityStyle(log.priority)}`}>
                    {log.priority}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-455 font-bold block">Timestamp</span>
                <span className="text-slate-800 font-mono font-bold block mt-1">12 July 2026, {log.time}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Target Details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Target Entity Scope
            </h4>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <Laptop className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {log.target}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Category: Operations • Module Scope: <span className="capitalize font-bold text-[#5B5BD6]">{log.module}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Remarks body */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Remarks justification
            </h4>
            <div className="flex gap-2.5 p-4 bg-[#5B5BD6]/4 border border-[#5B5BD6]/10 rounded-2xl text-[11.5px]">
              <Info className="w-5 h-5 text-[#5B5BD6] shrink-0 mt-0.5" />
              <p className="text-[#334155] font-semibold leading-relaxed">
                "{remarks}"
              </p>
            </div>
          </div>

          {/* Section 5: Timeline Trace */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Trace timeline
            </h4>
            <div className="border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-4 text-[11px]">
              
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Action Executed & Verified</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">Checked signature key</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                  <Clock className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Logged to immutable logs</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">Completed successfully</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ActivityDrawer;
