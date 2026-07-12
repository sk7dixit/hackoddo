import React from 'react';
import { Wrench, ShieldAlert, Play, CheckSquare } from 'lucide-react';

interface MaintItem {
  id: string;
  asset: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
  raisedBy: string;
  status: 'pending' | 'approved' | 'in_progress' | 'resolved';
}

export const MaintenanceQueue: React.FC = () => {
  const queue: MaintItem[] = [
    { id: 'maint-1', asset: 'Dell XPS 15 (AF-0144)', issue: 'Battery swelling reported', priority: 'high', raisedBy: 'Emma Watson', status: 'in_progress' },
    { id: 'maint-2', asset: 'EPSON Projector (AF-0021)', issue: 'Lamp bulb burnt out', priority: 'medium', raisedBy: 'Aman Verma', status: 'pending' },
    { id: 'maint-3', asset: 'MacBook Pro (AF-0105)', issue: 'Keyboard key stuck', priority: 'low', raisedBy: 'Priya Sharma', status: 'resolved' }
  ];

  const getStatusBadge = (status: MaintItem['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold border bg-emerald-50 border-emerald-100 text-emerald-600 flex items-center gap-1">
            <CheckSquare className="w-3 h-3" />
            <span>Resolved</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold border bg-blue-50 border-blue-100 text-blue-600 flex items-center gap-1">
            <Play className="w-3 h-3" />
            <span>In Progress</span>
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold border bg-indigo-50 border-indigo-100 text-[#5B5BD6] flex items-center gap-1">
            <span>Approved</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold border bg-amber-50 border-amber-100 text-amber-600 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col h-full justify-between">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Diagnostic repairs</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Maintenance Queue</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-400 uppercase font-mono">3 Tickets</span>
      </div>

      <div className="space-y-3.5 flex-grow mt-2 overflow-y-auto max-h-[220px] pr-1">
        {queue.map(item => (
          <div key={item.id} className="p-3.5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-2 hover:border-[#5B5BD6]/20 hover:bg-white transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-extrabold text-slate-800 block text-xs truncate">
                  {item.asset}
                </span>
                <span className="text-[10.5px] text-slate-500 font-semibold block mt-1">
                  Issue: {item.issue}
                </span>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <div className="flex justify-between items-center text-[9.5px] font-bold text-slate-400 border-t border-slate-100/60 pt-2 mt-2">
              <span>By: {item.raisedBy}</span>
              <span className={`capitalize ${item.priority === 'high' ? 'text-rose-600' : 'text-slate-400'}`}>
                {item.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceQueue;
