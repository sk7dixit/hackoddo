import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { authStore } from "../store/authStore";
import { toast } from "../components/Toast";
import api from "../services/api";
import {
  LayoutDashboard,
  Building2,
  Building,
  Tags,
  MapPin,
  Calendar,
  Users,
  UserCheck,
  UserPlus,
  KeyRound,
  ClipboardCheck,
  BarChart3,
  Bell,
  Inbox,
  History,
  Sliders,
  HelpCircle,
  User,
  LogOut,
  Search,
  Menu,
  ChevronDown,
  ChevronRight,
  Globe,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminUser = authStore.getUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Collapsible Sidebar Folders
  const [orgSetupOpen, setOrgSetupOpen] = useState(true);
  const [userMgmtOpen, setUserMgmtOpen] = useState(true);

  // Search Everything States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Profile Dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Notification Dropdown
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Enforce light theme only on mount
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const handleLogout = () => {
    authStore.clearUser();
    navigate("/login");
    toast.success("Successfully logged out.");
  };

  // Perform Global Search (Asset -> Employee -> Department -> Booking -> Audit)
  useEffect(() => {
    const performSearch = async () => {
      const q = searchQuery.trim();
      if (!q || q.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const data = await api.get<any>(
          `/global/search?query=${encodeURIComponent(q)}`,
        );
        const results: any[] = [];

        // Match assets
        if (data.assets) {
          data.assets.forEach((a: any) => {
            results.push({
              type: "Asset",
              title: `${a.name} (${a.id})`,
              subtitle: `Location: ${a.location} | Status: ${a.status.replace("_", " ")}`,
              route: `/admin/assets?search=${a.id}`,
              icon: Laptop,
            });
          });
        }

        // Match employees
        if (data.employees) {
          data.employees.forEach((e: any) => {
            results.push({
              type: "Employee",
              title: `${e.name} (${e.employeeId || e.id})`,
              subtitle: `Role: ${e.role.replace("_", " ")} | Email: ${e.email}`,
              route: `/admin/employees`,
              icon: Users,
            });
          });
        }

        // Match Audits
        if (data.audits) {
          data.audits.forEach((aud: any) => {
            results.push({
              type: "Audit",
              title: `${aud.name} (${aud.id})`,
              subtitle: `Scope: ${aud.scopeType} | Status: ${aud.status}`,
              route: `/admin/audit`,
              icon: ClipboardCheck,
            });
          });
        }

        // Match Departments
        if (data.departments) {
          data.departments.forEach((dept: any) => {
            results.push({
              type: "Department",
              title: `${dept.name} (${dept.code})`,
              subtitle: `Location: ${dept.location} | Head: ${dept.headId}`,
              route: `/admin/organization/departments`,
              icon: Building,
            });
          });
        }

        setSearchResults(results.slice(0, 8));
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside click handlers
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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
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
              Admin Control
            </span>
          </div>
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto font-bold text-xs text-slate-505">
          <NavLink
            to="/admin"
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

          {/* Collapsible Organization Setup */}
          <div className="space-y-1">
            <button
              onClick={() => setOrgSetupOpen(!orgSetupOpen)}
              className="w-full flex items-center justify-between px-3.5 h-12 rounded-[14px] hover:text-slate-805 hover:bg-[#F8FAFC] transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <Building2 className="w-[18px] h-[18px] text-slate-400" />
                <span>Organization Setup</span>
              </div>
              {orgSetupOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {orgSetupOpen && (
              <div className="pl-4 pr-1 py-1 space-y-1 border-l border-[#E7ECF3] ml-5">
                <NavLink
                  to="/admin/organization"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <LayoutDashboard className="w-[16px] h-[16px] shrink-0" />
                  <span>Overview</span>
                </NavLink>
                <NavLink
                  to="/admin/organization/departments"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <Building className="w-[16px] h-[16px] shrink-0" />
                  <span>Departments</span>
                </NavLink>
                <NavLink
                  to="/admin/organization/categories"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <Tags className="w-[16px] h-[16px] shrink-0" />
                  <span>Asset Categories</span>
                </NavLink>
                <NavLink
                  to="/admin/organization/locations"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <MapPin className="w-[16px] h-[16px] shrink-0" />
                  <span>Locations</span>
                </NavLink>
                <NavLink
                  to="/admin/organization/calendar"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-850 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <Calendar className="w-[16px] h-[16px] shrink-0" />
                  <span>Business Calendar</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Collapsible User Management */}
          <div className="space-y-1">
            <button
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
              className="w-full flex items-center justify-between px-3.5 h-12 rounded-[14px] hover:text-slate-805 hover:bg-[#F8FAFC] transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <Users className="w-[18px] h-[18px] text-slate-400" />
                <span>User Management</span>
              </div>
              {userMgmtOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {userMgmtOpen && (
              <div className="pl-4 pr-1 py-1 space-y-1 border-l border-[#E7ECF3] ml-5">
                <NavLink
                  to="/admin/employees"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <UserCheck className="w-[16px] h-[16px] shrink-0" />
                  <span>Employee Directory</span>
                </NavLink>
                <NavLink
                  to="/admin/create-user"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <UserPlus className="w-[16px] h-[16px] shrink-0" />
                  <span>Create User</span>
                </NavLink>
                <NavLink
                  to="/admin/roles"
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 pl-6 pr-3.5 h-11 rounded-[12px] transition-all border-l-[4px] ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                        : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
                    }`
                  }
                >
                  <KeyRound className="w-[16px] h-[16px] shrink-0" />
                  <span>Roles & Permissions</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/audit"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <ClipboardCheck className="w-[18px] h-[18px]" />
            <span>Audit Management</span>
          </NavLink>

          <NavLink
            to="/admin/approvals"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <Inbox className="w-[18px] h-[18px]" />
            <span>Workflow Approvals</span>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <BarChart3 className="w-[18px] h-[18px]" />
            <span>Reports & Analytics</span>
          </NavLink>

          <NavLink
            to="/admin/activity-logs"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 h-12 rounded-[14px] transition-all border-l-[4px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-extrabold"
                  : "hover:text-slate-805 hover:bg-[#F8FAFC] border-transparent"
              }`
            }
          >
            <History className="w-[18px] h-[18px]" />
            <span>Activity Logs</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="h-20 backdrop-blur-xl bg-white/80 border-b border-[#E7ECF3] flex items-center justify-between px-6 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 flex-1">
            {/* Toggle Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-[#F8FAFC] rounded-lg text-slate-400 hover:text-slate-650 transition-all border border-[#E7ECF3]"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Dashboard / Org Control Center text */}
            <div className="hidden lg:block select-none leading-none">
              <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest leading-none block">
                Admin Portal
              </span>
              <span className="font-black text-sm text-slate-800 leading-none mt-1.5 block">
                Organization Control Center
              </span>
            </div>

            {/* Global Search box with matching dropdown */}
            <div
              className="relative w-[360px] hidden sm:block ml-4"
              ref={searchRef}
            >
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets, employees, departments..."
                value={searchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchDropdownOpen(false);
                    navigate(
                      `/admin/search?q=${encodeURIComponent(searchQuery)}`,
                    );
                  }
                }}
                className="w-full bg-white border border-[#E7ECF3] rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              />

              {/* Search Dropdown */}
              {searchDropdownOpen && searchQuery.trim().length >= 2 && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-[#E7ECF3] rounded-2xl shadow-xl p-2.5 max-h-[360px] overflow-y-auto space-y-1.5 z-50">
                  <div className="px-2.5 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-[#E7ECF3]">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium italic">
                      No matching records found.
                    </div>
                  ) : (
                    searchResults.map((res, index) => {
                      const Icon = res.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchDropdownOpen(false);
                            setSearchQuery("");
                            navigate(res.route);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl flex items-start gap-2.5 transition-colors"
                        >
                          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-[#4F46E5] rounded-lg mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-slate-800 dark:text-white leading-none">
                                {res.title}
                              </span>
                              <span className="text-[8px] font-bold uppercase tracking-wider px-1 bg-slate-100 dark:bg-slate-850 rounded text-slate-400 leading-normal">
                                {res.type}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">
                              {res.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Organization Tag */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full text-[10px] text-[#4F46E5] font-extrabold uppercase tracking-wide">
              <Globe className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
              <span>Global Org</span>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-650 transition-all relative shrink-0"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>

              {/* Notification Box */}
              {notifDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-72 text-xs font-semibold text-slate-700 space-y-1.5 z-50 animate-slide-up">
                  <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex justify-between items-center">
                    <span>Recent Alerts</span>
                    <span className="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded-full">
                      7 Pending
                    </span>
                  </div>
                  <div className="space-y-1 py-1 max-h-[220px] overflow-y-auto">
                    <div className="p-2.5 hover:bg-slate-50 rounded-lg flex flex-col gap-0.5 cursor-pointer">
                      <span className="font-bold text-rose-500">
                        Critical: 3 Overdue Returns
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold leading-snug">
                        Rahul, Aman, and Vikram have overdue return
                        verifications.
                      </p>
                    </div>
                    <div className="p-2.5 hover:bg-slate-50 rounded-lg flex flex-col gap-0.5 cursor-pointer">
                      <span className="font-bold text-slate-700">
                        2 Audit Deadlines Near
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold leading-snug">
                        Q3 Organization Asset Verification deadline closes in 5
                        days.
                      </p>
                    </div>
                    <div className="p-2.5 hover:bg-slate-50 rounded-lg flex flex-col gap-0.5 cursor-pointer">
                      <span className="font-bold text-amber-500">
                        Sales Department Alert
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold leading-snug">
                        The Department Head role for Sales is currently vacant.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigate("/admin/notifications");
                    }}
                    className="w-full text-center py-2 text-[#4F46E5] hover:underline font-bold text-[10.5px] border-t border-slate-100 block"
                  >
                    View All Notifications
                  </button>
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
                  SA
                </div>
                <span className="hidden md:inline">
                  {adminUser?.name || "Shashwat Admin"}
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
                      ERP Admin
                    </span>
                    <span className="font-bold text-xs text-slate-800 truncate block mt-0.5">
                      {adminUser?.email || "admin@gmail.com"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F3F4F6] rounded-lg flex items-center gap-2.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-450" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F3F4F6] rounded-lg flex items-center gap-2.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-450" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/admin/help");
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F3F4F6] rounded-lg flex items-center gap-2.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-450" />
                    <span>Help Center</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2.5"
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

export default AdminLayout;
