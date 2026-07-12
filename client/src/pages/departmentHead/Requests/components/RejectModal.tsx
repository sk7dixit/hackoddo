import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { toast } from '../../../../components/Toast';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  title: string;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Justification remarks are mandatory for rejection.');
      return;
    }
    onConfirm(remarks);
    setRemarks('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-md w-full relative p-6 space-y-5 animate-slide-up font-semibold text-xs text-slate-700 font-sans">
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 mt-3">{title}</h3>
          <p className="text-[10.5px] text-slate-505 font-semibold leading-relaxed">
            Rejection requests must have justification notes explaining budget or role mismatches.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-[10.5px]">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Remarks text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Rejection Remarks (Mandatory)
            </label>
            <textarea
              required
              placeholder="e.g. Budget scope allocation limits reached this quarter."
              value={remarks}
              onChange={e => { setRemarks(e.target.value); setError(null); }}
              rows={3}
              className="glass-input resize-none w-full p-3 text-xs font-semibold"
            />
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
              className="px-4.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer shadow-sm shadow-rose-500/10"
            >
              Confirm Reject
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RejectModal;
