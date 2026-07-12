import React from 'react';
import { Calendar, CheckCircle, RefreshCw, Bookmark, ShieldAlert, FileText, User } from 'lucide-react';

interface ActivityLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  target: string;
  status: 'completed' | 'pending' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface TimelineProps {
  logs: ActivityLogItem[];
  selectedLogId?: string;
  onSelect: (item: ActivityLogItem) => void;
}

export const ActivityTimeline: React.FC<TimelineProps> = ({ logs, selectedLogId, onSelect }) => {
  
  const getIcon = (module: string) => {
    switch (module.toLowerCase()) {
      case 'approval': return FileText;
      case 'transfer': return RefreshCw;
      case 'booking': return Bookmark;
      case 'login': return User;
      case 'maintenance': return ShieldAlert;
      default: return CheckCircle;
    }
  };

  const getPriorityColor = (prio: string, isSelected: boolean) => {
    if (isSelected) return 'text-[#5B5BD6] border-[#5B5BD6] bg-[#5B5BD6]/8 ring-2 ring-[#5B5BD6]/10';
    switch (prio) {
      case 'critical': return 'text-rose-600 border-rose-250 bg-rose-50';
      case 'high': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'medium': return 'text-blue-600 border-blue-150 bg-blue-50';
      case 'low': return 'text-emerald-600 border-emerald-250 bg-emerald-50';
      default: return 'text-slate-500 border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5 font-semibold text-xs text-slate-700">
      
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Chronology</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Audit Stream Timeline</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-450 uppercase">Live Logs</span>
      </div>

      <div className="relative border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-5 text-xs font-semibold text-slate-700">
        {logs.slice(0, 5).map(item => {
          const Icon = getIcon(item.module);
          const isSelected = item.id === selectedLogId;
          const colorStyle = getPriorityColor(item.priority, isSelected);

          return (
            <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              className={`relative group cursor-pointer p-2 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-indigo-50/30 border-indigo-150 shadow-xs' 
                  : 'border-transparent hover:bg-slate-50/50'
              }`}
            >
              {/* Node Icon */}
              <div className={`absolute -left-[24px] top-3 w-5.5 h-5.5 rounded-full border flex items-center justify-center shadow-xs z-10 transition-transform group-hover:scale-115 ${colorStyle}`}>
                <Icon className="w-3 h-3" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-extrabold text-slate-850 block transition-colors ${isSelected ? 'text-[#5B5BD6]' : 'group-hover:text-[#5B5BD6]'}`}>
                    {item.action}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold shrink-0">
                    {item.time}
                  </span>
                </div>
                
                <span className="text-[10px] text-slate-500 block font-normal">
                  Initiated by {item.user} • Target: <span className="font-mono font-bold text-[#5B5BD6]">{item.target}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ActivityTimeline;
