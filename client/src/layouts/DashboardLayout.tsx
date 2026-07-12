import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../store/authStore';
import { toast } from '../components/Toast';
import { 
  LayoutDashboard, 
  Laptop, 
  Handshake, 
  RefreshCw, 
  Wrench, 
  RotateCcw, 
  ClipboardCheck, 
  Bell, 
  User, 
  LogOut, 
  Search, 
  Menu,
  FileText,
  BarChart3,
  Sliders,
  HelpCircle,
  Hexagon,
  ChevronDown,
  Database
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStore.getUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authStore.clearUser();
    navigate('/login');
    toast.success('Successfully logged out.');
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim();
      if (q) {
        navigate(`/search?q=${encodeURIComponent(q)}`);
        setSearchQuery('');
      }
    }
  };

  const handleResetDemo = async () => {
    try {
      setResetting(true);
      const res = await fetch('http://localhost:5000/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        toast.success('Demo database reset successfully.');
        setDropdownOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error('Failed to reset demo database.');
      }
    } catch (e) {
      toast.error('Server error during database reset.');
    } finally {
      setResetting(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assets', label: 'Assets', icon: Laptop },
    { to: '/allocation', label: 'Allocation', icon: Handshake },
    { to: '/transfers', label: 'Transfers', icon: RefreshCw },
    { to: '/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/returns', label: 'Returns', icon: RotateCcw },
    { to: '/audit', label: 'Audit', icon: ClipboardCheck }
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-800 font-sans">
      
      {/* Sidebar - Clean Light Board */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'} bg-[#FAFBFC] border-r border-slate-200 flex flex-col h-screen sticky top-0 transition-all duration-300 z-30`}>
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5B5BD6] flex items-center justify-center shadow-lg shadow-[#5B5BD6]/20 shrink-0">
            <Hexagon className="w-4 h-4 text-white fill-white/20" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">AssetFlow</h1>
            <span className="text-[9.5px] font-bold tracking-tight text-slate-400 mt-1 block">Enterprise Asset Manager</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group relative ${
                  isActive
                    ? 'bg-[#5B5BD6]/8 text-[#5B5BD6]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-[#5B5BD6]' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute right-3 w-1 h-1 rounded-full bg-[#5B5BD6]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-[74px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 flex-1">
            {/* Toggle Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all border border-slate-100"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Search Box */}
            <div className="relative w-[450px] hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets, employees, locations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="glass-input pl-9 pr-4 py-2 text-xs w-full focus:border-[#5B5BD6]/50 focus:ring-[#5B5BD6]/10"
              />
            </div>
          </div>

          {/* Right Header Panel */}
          <div className="flex items-center gap-3">

            {/* Activity Logs Shortcut */}
            <button 
              onClick={() => navigate('/activity-logs')}
              className={`h-11 flex items-center gap-2 px-4 rounded-xl border transition-all font-semibold text-xs ${
                location.pathname === '/activity-logs'
                  ? 'border-[#5B5BD6]/20 bg-[#5B5BD6]/5 text-[#5B5BD6]'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className={`w-4 h-4 ${location.pathname === '/activity-logs' ? 'text-[#5B5BD6]' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Activity Logs</span>
            </button>

            {/* Reports Shortcut */}
            <button 
              onClick={() => navigate('/reports')}
              className={`h-11 flex items-center gap-2 px-4 rounded-xl border transition-all font-semibold text-xs ${
                location.pathname === '/reports'
                  ? 'border-[#5B5BD6]/20 bg-[#5B5BD6]/5 text-[#5B5BD6]'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${location.pathname === '/reports' ? 'text-[#5B5BD6]' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Reports</span>
            </button>
            
            {/* Notification Bell Shortcut */}
            <button 
              onClick={() => navigate('/notifications')}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#5B5BD6]" />
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-11 flex items-center gap-2.5 border border-slate-200 hover:bg-slate-50 px-3.5 rounded-xl text-xs text-slate-700 font-semibold cursor-pointer focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-[10.5px]">
                  JC
                </div>
                <span>{user?.name || 'John Carter'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 w-44 text-xs font-semibold text-slate-700 space-y-0.5 z-50 animate-slide-up">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/help'); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Help Center</span>
                  </button>

                  <button
                    onClick={handleResetDemo}
                    disabled={resetting}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-[#5B5BD6] font-bold"
                  >
                    <Database className="w-3.5 h-3.5 text-violet-400" />
                    <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-grow overflow-y-auto bg-[#F5F7FB] p-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
