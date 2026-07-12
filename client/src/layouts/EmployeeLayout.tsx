import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { authStore } from "../store/authStore";
import { toast } from "../components/Toast";
import api from "../services/api";
import {
  LayoutDashboard,
  Laptop,
  Calendar,
  AlertCircle,
  RefreshCw,
  Bell,
  History,
  User,
  LogOut,
  Sliders,
  HelpCircle,
  Menu,
  ChevronDown,
  ChevronRight,
  Globe,
  Sun,
  Laptop as LaptopIcon,
  Search,
} from "lucide-react";

export const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionUser = authStore.getUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authStore.clearUser();
    navigate("/login");
    toast.success("Successfully logged out from your employee session.");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-800 font-sans">
      {/* Sidebar navigation */}
      <aside
        className={`${sidebarOpen ? "w-[280px]" : "w-0 overflow-hidden"} bg-white border-r border-[#E7ECF3] flex flex-col h-screen sticky top-0 transition-all duration-300 z-35 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)]`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E7ECF3] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <span className="font-extrabold text-white text-base leading-none">
              AF
            </span>
          </div>
          <div className="overflow-hidden">
            <h1 className="font-black text-sm tracking-tight text-slate-900 leading-none">
              AssetFlow
            </h1>
            <span className="text-[9px] font-extrabold tracking-widest text-[#4F46E5] uppercase mt-1.5 block">
              Employee Workspace
            </span>
          </div>
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto font-bold text-xs text-slate-500">
          <NavLink
            to="/employee"
            end
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <LayoutDashboard className="w-[18px] h-[18px]" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/employee/assets"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <Laptop className="w-[18px] h-[18px]" />
            <span>My Assets</span>
          </NavLink>

          <NavLink
            to="/employee/book-resource"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <Calendar className="w-[18px] h-[18px]" />
            <span>Book Resource</span>
          </NavLink>

          <NavLink
            to="/employee/maintenance"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <AlertCircle className="w-[18px] h-[18px]" />
            <span>Maintenance</span>
          </NavLink>

          <NavLink
            to="/employee/return-transfer"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <RefreshCw className="w-[18px] h-[18px]" />
            <span>Return & Transfer</span>
          </NavLink>

          <NavLink
            to="/employee/notifications"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <Bell className="w-[18px] h-[18px]" />
            <span>Notifications</span>
          </NavLink>

          <NavLink
            to="/employee/activity"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <History className="w-[18px] h-[18px]" />
            <span>Activity</span>
          </NavLink>

          <NavLink
            to="/employee/profile"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <User className="w-[18px] h-[18px]" />
            <span>My Profile</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer Stats */}
        <div className="p-4 border-t border-[#E7ECF3] bg-slate-50/50 flex flex-col gap-1.5 font-bold text-[10px] text-slate-400">
          <span className="font-mono text-slate-500">
            {sessionUser?.employeeId || "EMP-1024"}
          </span>
          <span className="uppercase text-[9px] tracking-wider text-emerald-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />{" "}
            Account Active
          </span>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="h-20 backdrop-blur-xl bg-white/80 border-b border-[#E7ECF3] flex items-center justify-between px-6 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 flex-1">
            {/* Toggle Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-[#F8FAFC] rounded-lg text-slate-400 hover:text-slate-650 transition-all border border-[#E7ECF3] cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Title / Portal Indicator */}
            <div className="hidden lg:block select-none leading-none">
              <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest leading-none block">
                Employee Workspace
              </span>
              <span className="font-black text-sm text-slate-800 leading-none mt-1.5 block">
                My Work & Allocations
              </span>
            </div>

            {/* Global Search box */}
            <div
              className="relative w-[280px] hidden sm:block ml-4 animate-fade-in"
              ref={searchRef}
            >
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets, bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(
                      `/employee/search?q=${encodeURIComponent(searchQuery)}`,
                    );
                    setSearchQuery("");
                  }
                }}
                className="w-full bg-slate-50 border border-[#E7ECF3] rounded-2xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Global Org indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full text-[10px] text-[#4F46E5] font-extrabold uppercase tracking-wide">
              <Globe className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
              <span>Workspace Active</span>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-650 transition-all relative shrink-0 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
              </button>

              {/* Notification Box */}
              {notifDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-72 text-xs font-semibold text-slate-700 space-y-1.5 z-50 animate-slide-up">
                  <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex justify-between items-center">
                    <span>Recent Notifications</span>
                    <span className="bg-indigo-50 text-[#4F46E5] text-[9px] px-1.5 py-0.5 rounded-full">
                      New Alerts
                    </span>
                  </div>
                  <div className="p-3 text-center text-slate-400 italic">
                    Open Dashboard to review all notifications.
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="h-10 flex items-center gap-2 border border-slate-200 hover:bg-slate-50 px-3.5 rounded-xl text-xs text-slate-700 font-semibold cursor-pointer focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-[#4F46E5] flex items-center justify-center font-black text-[10.5px]">
                  {sessionUser?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "EM"}
                </div>
                <span className="hidden md:inline">
                  {sessionUser?.name || "Employee User"}
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                  style={{
                    transform: profileDropdownOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>

              {/* Profile Dropdown Box */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-[18px] shadow-xl p-1.5 w-48 text-xs font-semibold text-slate-705 space-y-0.5 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="font-extrabold text-[10.5px] text-slate-400 uppercase tracking-wide block">
                      Employee
                    </span>
                    <span className="font-bold text-xs text-slate-800 truncate block mt-0.5">
                      {sessionUser?.email || "employee@gmail.com"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/employee/profile");
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F3F4F6] rounded-lg flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-450" />
                    <span>My Profile</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic content area */}
        <main className="flex-grow overflow-y-auto p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
