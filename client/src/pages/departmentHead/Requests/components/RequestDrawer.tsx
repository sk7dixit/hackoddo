import React, { useState, useEffect } from 'react';
import { X, User, Laptop, Info, FileText, CheckCircle2, ShieldCheck, CornerDownLeft, AlertCircle } from 'lucide-react';
import { toast } from '../../../../components/Toast';

interface ApprovalRequest {
  id: string;
  employee: string;
  asset: string;
  type: 'allocation' | 'transfer' | 'return';
  priority: 'high' | 'medium' | 'low';
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  designation?: string;
  employeeId?: string;
  assetTag?: string;
  condition?: string;
  reason?: string;
  duration?: string;
}

interface DrawerProps {
  item: ApprovalRequest | null;
  onClose: () => void;
  onApproveConfirm: (item: ApprovalRequest, remarks: string, notifyEmp: boolean, notifyMgr: boolean) => void;
  onRejectConfirm: (item: ApprovalRequest, remarks: string) => void;
}

export const RequestDrawer: React.FC<DrawerProps> = ({ item, onClose, onApproveConfirm, onRejectConfirm }) => {
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [notifyEmp, setNotifyEmp] = useState(true);
  const [notifyMgr, setNotifyMgr] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset form states when the item changes
  useEffect(() => {
    setActionType(null);
    setRemarks('');
    setNotifyEmp(true);
    setNotifyMgr(true);
    setError(null);
  }, [item]);

  if (!item) return null;

  const employeeId = item.employeeId || 'EMP-1024';
  const designation = item.designation || 'Senior Software Engineer';
  const assetTag = item.assetTag || 'AF-LPT-0104';
  const condition = item.condition || 'Excellent';
  const reason = item.reason || 'Needed for project development work compiles.';
  const duration = item.duration || '90 Days';

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (actionType === 'reject' && !remarks.trim()) {
      setError('Rejection remarks are mandatory to notify the requesting employee.');
      return;
    }

    if (actionType === 'approve') {
      onApproveConfirm(item, remarks, notifyEmp, notifyMgr);
    } else if (actionType === 'reject') {
      onRejectConfirm(item, remarks);
    }

    // Reset drawer state
    setActionType(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[500px] bg-white border-l border-slate-200 h-screen flex flex-col z-10 shadow-2xl animate-slide-left font-semibold text-xs text-slate-700">
        
        {/* Header Title */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Approval detail panel</span>
            <h3 className="font-extrabold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
              <span>Review Request:</span>
              <span className="font-mono text-[#5B5BD6] font-bold">{item.id}</span>
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

          {/* Section 1: Employee details */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Employee Custodian
            </h4>
            <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-550 shadow-sm shrink-0">
                {item.employee.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {item.employee}
                </span>
                <span className="text-[10.5px] text-slate-500 block">
                  {designation} • <span className="font-mono text-[9px] font-bold text-slate-450">{employeeId}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Asset details */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Asset Information
            </h4>
            <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <Laptop className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {item.asset}
                </span>
                <span className="text-[10.5px] text-slate-500 block">
                  Condition: {condition} • Tag: <span className="font-mono text-[9px] font-bold text-[#5B5BD6]">{assetTag}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Request justification */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Request Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[11px] pb-1">
              <div>
                <span className="text-slate-400 font-bold block">Request Type</span>
                <span className="text-slate-800 font-extrabold block mt-0.5 capitalize">{item.type}</span>
              </div>
              {item.type === 'allocation' && (
                <div>
                  <span className="text-slate-400 font-bold block">Duration requested</span>
                  <span className="text-slate-800 font-extrabold block mt-0.5">{duration}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 p-3.5 bg-[#5B5BD6]/4 border border-[#5B5BD6]/10 rounded-2xl text-[11px]">
              <Info className="w-4.5 h-4.5 text-[#5B5BD6] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold text-slate-850 block">Justification Remarks</span>
                <p className="text-[#475569] font-bold leading-relaxed">{reason}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Attachments */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Attachments
            </h4>
            <a 
              href="#attachment"
              onClick={e => { e.preventDefault(); toast.success('Downloading Request_Specification.pdf...'); }}
              className="p-3 border border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-white rounded-2xl flex items-center justify-between text-[11px] transition-all"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-rose-500" />
                <span>Request_Specification.pdf</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold">1.2 MB</span>
            </a>
          </div>

          {/* Inline Action Remarks Form */}
          {actionType && (
            <form onSubmit={handleConfirmAction} className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-4.5 animate-slide-up">
              <div className="border-b border-slate-150 pb-2">
                <span className="text-[10px] font-extrabold uppercase text-[#5B5BD6] block">
                  Remarks & Verification
                </span>
                <h5 className="font-extrabold text-xs text-slate-800 mt-1">
                  Confirming Request {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </h5>
              </div>

              {error && (
                <div className="flex gap-1.5 p-2.5 bg-rose-50 border border-rose-150 rounded-xl text-rose-700 text-[10.5px]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                  {actionType === 'reject' ? 'Rejection Reason (Mandatory)' : 'Supervisor Remarks (Optional)'}
                </label>
                <textarea
                  value={remarks}
                  onChange={e => { setRemarks(e.target.value); setError(null); }}
                  placeholder={actionType === 'reject' ? 'Explain the reason for denying this checkout...' : 'Add audit feedback remarks...'}
                  rows={3}
                  className="glass-input resize-none w-full p-2.5 text-xs font-semibold"
                />
              </div>

              {actionType === 'approve' && (
                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEmp}
                      onChange={e => setNotifyEmp(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5B5BD6]"
                    />
                    <span>Email notification to Employee</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyMgr}
                      onChange={e => setNotifyMgr(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5B5BD6]"
                    />
                    <span>Queue notification to Central Asset Manager</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 border-t border-slate-150 pt-3.5 mt-1">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-3 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4.5 py-2 text-white rounded-xl font-bold cursor-pointer ${
                    actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Drawer Footer Actions (Only for pending requests and if form is not already open) */}
        {item.status === 'pending' && !actionType && (
          <div className="p-5 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50/50">
            <button
              onClick={() => setActionType('reject')}
              className="px-4 py-2.5 border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl font-bold cursor-pointer transition-colors text-xs"
            >
              Reject
            </button>
            <button
              onClick={() => setActionType('approve')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors text-xs shadow-sm shadow-emerald-500/10"
            >
              Approve Request
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RequestDrawer;
