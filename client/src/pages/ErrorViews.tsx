import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { AlertCircle, ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';

// 1. 404 Page Not Found
export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <GlassCard className="w-full max-w-sm text-center p-8 space-y-6 border-zinc-800/60 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-400 mx-auto animate-bounce">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black font-mono tracking-tight text-white">404</h1>
          <h2 className="text-sm font-extrabold text-zinc-300">Page Not Found</h2>
          <p className="text-[11.5px] text-zinc-550 leading-relaxed max-w-xs mx-auto">
            The link you followed is broken, or the directory view is restricted.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </button>
      </GlassCard>
    </div>
  );
};

// 2. 403 Forbidden
export const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <GlassCard className="w-full max-w-sm text-center p-8 space-y-6 border-zinc-800/60 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/15 flex items-center justify-center text-rose-500 mx-auto animate-pulse">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black font-mono tracking-tight text-rose-500">403</h1>
          <h2 className="text-sm font-extrabold text-zinc-300">Access Restricted</h2>
          <p className="text-[11.5px] text-zinc-550 leading-relaxed max-w-xs mx-auto">
            You do not have L3 clearance credentials required to view this administrative asset.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </button>
      </GlassCard>
    </div>
  );
};

// 3. 500 Something Went Wrong
export const ServerError: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <GlassCard className="w-full max-w-sm text-center p-8 space-y-6 border-zinc-800/60 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-500 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black font-mono tracking-tight text-orange-500">500</h1>
          <h2 className="text-sm font-extrabold text-zinc-300">Internal Server Error</h2>
          <p className="text-[11.5px] text-zinc-550 leading-relaxed max-w-xs mx-auto">
            The ERP database is temporarily unreachable. Please restart the background Express task.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </button>
      </GlassCard>
    </div>
  );
};
