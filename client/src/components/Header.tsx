import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ShieldAlert, Sparkles, ChevronDown } from 'lucide-react';
import { UserRole } from '../../../server/src/types';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'System Admin',
  asset_manager: 'Asset Manager',
  department_head: 'Dept Head',
  employee: 'Employee',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'from-pink-500/20 to-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-950/20',
  asset_manager: 'from-amber-500/20 to-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-950/20',
  department_head: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-950/20',
  employee: 'from-indigo-500/20 to-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-950/20',
};

export const Header: React.FC = () => {
  const { 
    currentUser, 
    activeRole, 
    setActiveRole, 
    activeTab, 
    notifications, 
    markNotificationsRead 
  } = useApp();
  
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return `Hello, ${currentUser?.name || 'User'}!`;
      case 'setup': return 'Organization setup';
      case 'assets': return 'Asset management';
      case 'allocations': return 'Asset allocations';
      case 'bookings': return 'Resource bookings';
      case 'maintenance': return 'Maintenance requests';
      case 'audits': return 'Asset verification audits';
      case 'reports': return 'Reports & statistics';
      default: return 'AssetFlow';
    }
  };

  const getPageSub = () => {
    switch (activeTab) {
      case 'dashboard': return 'Here is a quick overview of your organization assets today.';
      case 'setup': return 'Configure departments, categories, and manage employee roles.';
      case 'assets': return 'Add, edit, inspect history logs, and generate QR asset labels.';
      case 'allocations': return 'Request physical assets, approve assignments, and manage returns.';
      case 'bookings': return 'Calendar scheduling for shared conference rooms, company vehicles, and office projectors.';
      case 'maintenance': return 'Report faulty assets, approve repairs, and log service technicians.';
      case 'audits': return 'Run regular inventory audits and flag missing items.';
      case 'reports': return 'Analytics on asset utilization, maintenance expenses, and allocations.';
      default: return '';
    }
  };

  return (
    <header className="h-20 bg-zinc-950/40 backdrop-blur-md border-b border-zinc-900 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Title & Sub */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white font-sans">{getPageTitle()}</h2>
        <p className="text-xs text-zinc-500 font-medium tracking-wide mt-0.5">{getPageSub()}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Role Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr transition-all shadow-sm duration-300 ${ROLE_COLORS[activeRole]}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Role: {ROLE_LABELS[activeRole]}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 p-1.5 animate-slide-up">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-zinc-800/40 mb-1">
                Select Active Sandbox Role
              </div>
              {(['admin', 'asset_manager', 'department_head', 'employee'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeRole === r 
                      ? 'bg-violet-600/15 text-violet-400' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all relative ${
              showNotifications ? 'border-violet-500/40 text-violet-400 bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 tracking-wide">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markNotificationsRead}
                    className="text-[10px] font-bold text-violet-400 hover:text-violet-300 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/40">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    <Sparkles className="w-5 h-5 mx-auto mb-2 text-zinc-600" />
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 text-xs transition-colors ${
                        notif.read ? 'bg-transparent text-zinc-400' : 'bg-violet-950/10 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold">{notif.title}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
