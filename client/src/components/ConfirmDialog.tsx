import React from 'react';
import GlassCard from './GlassCard';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <GlassCard className="w-full max-w-sm shadow-2xl space-y-6">
        
        {/* Title Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
            <span>{title}</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-0.5 hover:bg-slate-100 rounded transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          {message}
        </p>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary text-xs py-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all"
          >
            {confirmText}
          </button>
        </div>

      </GlassCard>
    </div>
  );
};

export default ConfirmDialog;
