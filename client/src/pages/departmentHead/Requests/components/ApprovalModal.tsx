import React, { useState } from 'react';
import { CheckSquare, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string, notifyEmp: boolean, notifyMgr: boolean) => void;
  title: string;
}

export const ApprovalModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
  const [remarks, setRemarks] = useState('');
  const [notifyEmp, setNotifyEmp] = useState(true);
  const [notifyMgr, setNotifyMgr] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(remarks, notifyEmp, notifyMgr);
    setRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-md w-full relative p-6 space-y-5 animate-slide-up font-semibold text-xs text-slate-700">
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 mt-3">{title}</h3>
          <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
            Verify notes and remark comments before signing approval authorization.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Remarks text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Approval Remarks (Optional)</label>
            <textarea
              placeholder="e.g. Approved for development work role scope."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={3}
              className="glass-input resize-none w-full p-3 font-semibold text-xs"
            />
          </div>

          {/* Notifications checkboxes */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Alert routing</label>
            
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-650 hover:text-slate-900">
              <input
                type="checkbox"
                checked={notifyEmp}
                onChange={e => setNotifyEmp(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B5BD6] focus:ring-[#5B5BD6]/10 border-slate-300"
              />
              <span>Notify employee custodian via notifications</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-slate-650 hover:text-slate-900">
              <input
                type="checkbox"
                checked={notifyMgr}
                onChange={e => setNotifyMgr(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B5BD6] focus:ring-[#5B5BD6]/10 border-slate-300"
              />
              <span>Notify central Asset Manager for final barcode tags</span>
            </label>
          </div>

          {/* Action triggers */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              Confirm Approve
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ApprovalModal;
