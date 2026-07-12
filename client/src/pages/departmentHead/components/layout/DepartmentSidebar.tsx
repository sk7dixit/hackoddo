import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  ClipboardCheck, 
  CalendarDays, 
  BarChart3, 
  History, 
  HelpCircle, 
  UserCircle,
  LogOut,
  Hexagon,
  Users,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { authStore } from '../../../../store/authStore';
import { toast } from '../../../../components/Toast';

interface DepartmentSidebarProps {
  open: boolean;
}

export const DepartmentSidebar: React.FC<DepartmentSidebarProps> = ({ open }) => {
  const navigate = useNavigate();
  const user = authStore.getUser();

  const handleLogout = () => {
    authStore.clearUser();
    navigate('/login');
    toast.success('Successfully logged out.');
  };

  const navItems = [
    { to: '/department-head', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/department-head/assets', label: 'Department Assets', icon: Boxes },
    { to: '/department-head/requests', label: 'Requests', icon: ClipboardCheck },
    { to: '/department-head/bookings', label: 'Resource Booking', icon: CalendarDays },
    { to: '/department-head/reports', label: 'Reports', icon: BarChart3 },
    { to: '/department-head/activity', label: 'Activity Logs', icon: History }
  ];

  return (
    <aside className={`no-print ${open ? 'w-56' : 'w-0 overflow-hidden'} bg-[#FAFBFC] border-r border-slate-200 flex flex-col h-screen sticky top-0 transition-all duration-300 z-30 font-semibold text-xs text-slate-700`}>
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8.5 h-8.5 rounded-xl bg-[#5B5BD6] flex items-center justify-center shadow-lg shadow-[#5B5BD6]/20 shrink-0">
          <Hexagon className="w-4.5 h-4.5 text-white fill-white/20" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">AssetFlow</h1>
          <span className="text-[9.5px] font-bold tracking-tight text-[#5B5BD6] mt-1 block uppercase">Dept Head Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group relative ${
                isActive
                  ? 'bg-[#5B5BD6]/8 text-[#5B5BD6]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-[#5B5BD6]' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#5B5BD6] animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Lower Dashboard stats summary & actions section */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-4 shrink-0">
        
        {/* Status indicators */}
        <div className="space-y-2.5 text-[10.5px] font-semibold text-slate-650">
          <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Department Status
          </span>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>42 Employees</span>
          </div>
          <div className="flex items-center gap-2">
            <Boxes className="w-3.5 h-3.5 text-slate-400" />
            <span>186 Assets</span>
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <ClipboardList className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-extrabold">7 Pending Requests</span>
          </div>
        </div>
</div>

    </aside>
  );
};

export default DepartmentSidebar;
