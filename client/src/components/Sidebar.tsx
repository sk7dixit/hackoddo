import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FolderTree, 
  Laptop, 
  Handshake, 
  CalendarDays, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import { UserRole } from '../../../server/src/types';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { id: 'setup', label: 'Org Setup', icon: FolderTree, roles: ['admin'] },
  { id: 'assets', label: 'Asset Management', icon: Laptop, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { id: 'allocations', label: 'Allocations', icon: Handshake, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { id: 'bookings', label: 'Bookings & Scheduling', icon: CalendarDays, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { id: 'audits', label: 'Audit Cycle', icon: ClipboardCheck, roles: ['admin', 'asset_manager'] },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin', 'asset_manager', 'department_head'] },
];

export const Sidebar: React.FC = () => {
  const { activeRole, activeTab, setActiveTab, logout, currentUser } = useApp();

  const filteredItems = SIDEBAR_ITEMS.filter(item => item.roles.includes(activeRole));

  return (
    <aside className="w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-900 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-900/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="font-extrabold text-white text-base tracking-wider">AF</span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white font-sans">AssetFlow</h1>
          <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">Enterprise ERP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all group relative duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/5 text-violet-400 border border-violet-500/20 shadow-sm shadow-violet-950/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-zinc-900/80 bg-zinc-900/10">
        <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-sm">
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-200 truncate">{currentUser?.name || 'Guest User'}</p>
            <p className="text-[10px] text-zinc-500 truncate">{currentUser?.email || 'guest@assetflow.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/15 duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
