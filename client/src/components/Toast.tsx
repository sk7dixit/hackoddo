import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private listeners = new Set<ToastListener>();
  private toasts: ToastItem[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => this.listeners.delete(listener);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  private show(message: string, type: 'success' | 'error' | 'info') {
    const id = Math.random().toString();
    const newToast = { id, message, type };
    this.toasts = [...this.toasts, newToast];
    this.notify();
    setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l([...this.toasts]));
  }
}

export const toast = new ToastManager();

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3.5 p-4 rounded-xl border shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-slide-in relative overflow-hidden ${
              isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              isError ? 'bg-rose-50 border-rose-200 text-rose-800' :
              'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold leading-relaxed">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-[#5B5BD6] shrink-0" />}
              <span>{t.message}</span>
            </div>
            
            <button
              onClick={() => toast.dismiss(t.id)}
              className="p-0.5 hover:bg-white/10 rounded transition-all text-current opacity-70 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
