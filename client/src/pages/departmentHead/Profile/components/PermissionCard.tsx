import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export const PermissionCard: React.FC = () => {
  const allowed = [
    'View Department Assets',
    'Approve Allocation Requests',
    'Approve Transfer Requests',
    'Book Resources',
    'View Reports',
    'View Notifications',
    'View Activity Logs'
  ];

  const restricted = [
    'Register Assets',
    'Delete Assets',
    'Create Departments',
    'Assign Roles',
    'Organization Settings'
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 font-semibold text-xs text-slate-700">
      
      <div className="border-b border-slate-100 pb-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Access scopes</span>
        <h4 className="font-extrabold text-xs text-slate-800 mt-1">Role Permissions & Limits</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-slate-750 font-semibold text-xs">
        
        {/* Allowed permissions list */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-600 block">
            ✔ Authorized Actions
          </span>
          <div className="space-y-2">
            {allowed.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted permissions list */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-rose-600 block">
            ❌ Restricted Actions
          </span>
          <div className="space-y-2">
            {restricted.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 opacity-65">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="line-through">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PermissionCard;
