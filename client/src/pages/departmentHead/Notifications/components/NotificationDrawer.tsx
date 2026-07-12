import React from 'react';
import { X, Bell, Info, ArrowUpRight, FolderOpen, CalendarClock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../../../components/Toast';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  time: string;
  status: 'unread' | 'read' | 'archived';
}

interface DrawerProps {
  item: NotificationItem | null;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<DrawerProps> = ({ item, onClose }) => {
  const navigate = useNavigate();

  if (!item) return null;

  const handleActionNavigation = () => {
    onClose();
    if (item.category.toLowerCase() === 'approvals' || item.category.toLowerCase() === 'transfers') {
      toast.success('Routing to Approvals Center...');
      navigate('/department-head/requests');
    } else if (item.category.toLowerCase() === 'bookings') {
      toast.success('Routing to Resource Bookings Calendar...');
      navigate('/department-head/bookings');
    } else {
      toast.success('Routing to Asset Inventory...');
      navigate('/department-head/assets');
    }
  };

  const getPriorityStyle = (prio: NotificationItem['priority']) => {
    switch (prio) {
      case 'critical': return 'bg-rose-50 border-rose-100 text-rose-700';
      case 'high': return 'bg-orange-50 border-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'low': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex justify-end">
      
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[460px] bg-white border-l border-slate-200 h-screen flex flex-col z-10 shadow-2xl animate-slide-left font-semibold text-xs text-slate-700 font-sans">
        
        {/* Header Title */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Notification metadata logs</span>
            <h3 className="font-extrabold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
              <span>Inspect alert:</span>
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

          {/* Section 1: Overview badge */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Alert type
            </h4>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <Bell className="w-5 h-5 text-slate-500" />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Channel: Department Operations Roster
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Metadata parameters */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Operational Parameters
            </h4>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[11px]">
              <div>
                <span className="text-slate-450 font-bold block">Status</span>
                <span className="text-slate-800 font-extrabold block mt-0.5 capitalize">{item.status}</span>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Generated time</span>
                <span className="text-slate-800 font-mono font-bold block mt-0.5">{item.time}</span>
              </div>
              <div>
                <span className="text-slate-455 font-bold block">Priority Index</span>
                <div className="mt-1">
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold capitalize ${getPriorityStyle(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Trigger source</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">Workflow Engine</span>
              </div>
            </div>
          </div>

          {/* Section 3: Event Body description */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Event Details
            </h4>
            <div className="flex gap-2.5 p-4 bg-[#5B5BD6]/4 border border-[#5B5BD6]/10 rounded-2xl text-[11.5px]">
              <Info className="w-5 h-5 text-[#5B5BD6] shrink-0 mt-0.5" />
              <p className="text-[#334155] font-semibold leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* Section 4: Audit Timeline */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Event Timeline Trace
            </h4>
            <div className="border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-4 text-[11px]">
              
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                  <CalendarClock className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-850 block">System Event triggered</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">{item.time}</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-slate-50 border border-slate-250 text-slate-450 flex items-center justify-center">
                  <FolderOpen className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-500 block">Logged to database timeline</span>
                  <span className="text-[9.5px] font-mono text-slate-350 font-bold block mt-0.5">Persisted</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Drawer footer action */}
        <div className="p-5 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={handleActionNavigation}
            className="w-full py-3 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#5B5BD6]/10 text-xs transition-colors"
          >
            <span>Open Related Workspace</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationDrawer;
