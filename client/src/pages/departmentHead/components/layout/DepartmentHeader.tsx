import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Sliders,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { authStore } from "../../../../store/authStore";
import { toast } from "../../../../components/Toast";

interface DepartmentHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStore.getUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authStore.clearUser();
    navigate("/login");
    toast.success("Successfully logged out.");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.endsWith("/assets")) return "Department Assets";
    if (path.endsWith("/requests")) return "Requests & Approvals";
    if (path.endsWith("/bookings")) return "Resource Bookings";
    if (path.endsWith("/reports")) return "Department Reports";
    if (path.endsWith("/notifications")) return "Notifications";
    if (path.endsWith("/activity")) return "Activity Logs";
    if (path.endsWith("/help")) return "Help Center";
    if (path.endsWith("/profile")) return "My Profile";
    return "Department Dashboard";
  };

  return (
    <header className="no-print h-[74px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all border border-slate-100"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Title */}
        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight hidden lg:block pr-4 border-r border-slate-100">
          {getPageTitle()}
        </h2>

        {/* Global Search Box */}
        <div className="relative w-[360px] hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              location.pathname.endsWith("/assets")
                ? "Search Asset Tag, Serial No..."
                : location.pathname.endsWith("/requests")
                  ? "Search employee, asset or request..."
                  : location.pathname.endsWith("/bookings")
                    ? "Search booking or room..."
                    : location.pathname.endsWith("/activity")
                      ? "Search logs..."
                      : "Search employee, asset or request..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const q = searchQuery.trim();
                if (q) {
                  navigate(
                    `/department-head/search?q=${encodeURIComponent(q)}`,
                  );
                  setSearchQuery("");
                }
              }
            }}
            className="glass-input pl-9 pr-4 py-2 text-xs w-full focus:border-[#5B5BD6]/50 focus:ring-[#5B5BD6]/10"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Shortcut */}
        <button
          onClick={() => navigate("/department-head/notifications")}
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#5B5BD6] animate-pulse" />
        </button>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-11 flex items-center gap-2.5 border border-slate-200 hover:bg-slate-50 px-3.5 rounded-xl text-xs text-slate-700 font-semibold cursor-pointer focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-[#5B5BD6]/10 border border-[#5B5BD6]/20 text-[#5B5BD6] flex items-center justify-center font-bold text-[10.5px]">
              DH
            </div>
            <div className="text-left hidden md:block">
              <span className="block leading-none text-slate-800">
                {user?.name || "Department Head"}
              </span>
              <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                {user?.email || "departmenthead@gmail.com"}
              </span>
            </div>
            <ChevronDown
              className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              style={{ transform: dropdownOpen ? "rotate(180deg)" : "none" }}
            />
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 w-48 text-xs font-semibold text-slate-700 space-y-0.5 z-50 animate-slide-up">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/department-head/profile");
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/department-head/help");
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Help Center</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
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
  );
};

export default DepartmentHeader;
