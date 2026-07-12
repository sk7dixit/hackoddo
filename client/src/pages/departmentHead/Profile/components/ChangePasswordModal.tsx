import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { toast } from '../../../../components/Toast';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (newPassword.length < 8) {
      setError('New Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('New Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError('New Password must contain at least one number.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('New Password must contain at least one special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Confirm Password does not match New Password.');
      return;
    }

    toast.success('Your account password was successfully updated.');
    
    // Clear forms
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100] font-sans text-xs">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-md w-full relative p-6 space-y-5 animate-slide-up font-semibold text-slate-700">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 mt-3">Change Account Password</h3>
          <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
            Ensure your password is at least 8 characters long and contains uppercase letters and numbers.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-250 text-rose-700 p-3 rounded-2xl text-[10.5px]">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="glass-input text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => { setNewPassword(e.target.value); setError(null); }}
              className="glass-input text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(null); }}
              className="glass-input text-xs font-semibold"
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
              className="px-4.5 py-2.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer shadow-sm shadow-[#5B5BD6]/10"
            >
              Save Password
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ChangePasswordModal;
