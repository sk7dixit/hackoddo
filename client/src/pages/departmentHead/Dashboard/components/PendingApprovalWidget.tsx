import React, { useState } from 'react';
import { toast } from '../../../../components/Toast';
import { ClipboardCheck, FileText, ArrowRightLeft, AlertCircle } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  employee: string;
  asset: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  notes?: string;
}

export const PendingApprovalWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'allocation' | 'transfers'>('allocation');

  const [allocations, setAllocations] = useState<ApprovalRequest[]>([
    { id: 'req-1', employee: 'Aman Verma', asset: 'MacBook Pro 16" (M3 Max)', priority: 'high', date: '2026-07-11', notes: 'Need high compute system for mobile app compiles' },
    { id: 'req-2', employee: 'Priya Sharma', asset: 'Dell XPS 15', priority: 'medium', date: '2026-07-12', notes: 'Standard replacement for aging laptop' },
    { id: 'req-3', employee: 'Riya Gupta', asset: 'ASUS ROG Zephyrus', priority: 'low', date: '2026-07-12', notes: 'Design rendering system' }
  ]);

  const [transfers, setTransfers] = useState<ApprovalRequest[]>([
    { id: 'req-t1', employee: 'Rohit Sen ➔ Priya', asset: 'iPad Pro (11")', priority: 'medium', date: '2026-07-11', notes: 'Peer transfer of department device' },
    { id: 'req-t2', employee: 'Amit Kumar ➔ Kavita', asset: 'ThinkPad X1 Carbon', priority: 'low', date: '2026-07-12', notes: 'Re-allocation inside development team' }
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject', type: 'allocation' | 'transfers') => {
    if (type === 'allocation') {
      setAllocations(prev => prev.filter(req => req.id !== id));
    } else {
      setTransfers(prev => prev.filter(req => req.id !== id));
    }
    toast.success(`Request successfully ${action === 'approve' ? 'approved' : 'rejected'}.`);
  };

  const getPriorityBadge = (prio: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-rose-50 border-rose-200 text-rose-700',
      medium: 'bg-orange-50 border-orange-200 text-orange-700',
      low: 'bg-slate-100 border-slate-200 text-slate-650'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${styles[prio]}`}>
        {prio}
      </span>
    );
  };

  const currentList = activeTab === 'allocation' ? allocations : transfers;

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col h-full justify-between">
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Decision requests</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Pending Approvals</h4>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-50 border border-slate-200/80 p-0.5 rounded-xl text-[10.5px] font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('allocation')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'allocation' 
                ? 'bg-white text-slate-800 shadow-sm border border-slate-150' 
                : 'hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Allocation ({allocations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transfers' 
                ? 'bg-white text-slate-800 shadow-sm border border-slate-150' 
                : 'hover:text-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfers ({transfers.length})</span>
          </button>
        </div>
      </div>

      {/* Requests table / cards */}
      <div className="flex-grow mt-2 space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
        {currentList.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center space-y-2.5">
            <span className="text-2xl">🎉</span>
            <span className="text-xs font-extrabold text-slate-800">Everything is up to date</span>
            <p className="text-[10.5px] text-slate-400 font-semibold">No approval requests requires attention today.</p>
          </div>
        ) : (
          currentList.map(req => (
            <div key={req.id} className="p-4 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-3 hover:shadow-sm hover:border-[#5B5BD6]/20 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-900 block">
                    {req.employee}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10.5px] font-semibold text-slate-500">{req.asset}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold">{req.date}</span>
                  </div>
                </div>
                {getPriorityBadge(req.priority)}
              </div>

              {req.notes && (
                <p className="text-[10.5px] text-slate-450 italic bg-white border border-slate-150 p-2 rounded-xl">
                  "{req.notes}"
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100/60 pt-3">
                <button
                  onClick={() => handleAction(req.id, 'reject', activeTab)}
                  className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg text-[10px] font-bold transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(req.id, 'approve', activeTab)}
                  className="px-3.5 py-1.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-[#5B5BD6]/10"
                >
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingApprovalWidget;
