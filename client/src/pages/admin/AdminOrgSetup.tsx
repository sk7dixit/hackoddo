import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import GlassCard from "../../components/GlassCard";
import {
  Building,
  Tags,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  X,
  Sliders,
  Clock,
  Settings,
  UserX,
  Eye,
  Layers,
  Box,
  Wrench,
} from "lucide-react";
import { toast } from "../../components/Toast";

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
  headId?: string;
  email?: string;
  phone?: string;
  location?: string;
  budget?: number;
  status: string;
  notes?: string;
}

interface AssetCategory {
  id: string;
  name: string;
  code: string;
  icon?: string;
  themeColor?: string;
  description?: string;
  defaultWarranty: number;
  maintenanceCycle: number;
  sharedResource: boolean;
  qrEnabled: boolean;
  status: string;
}

interface LocationItem {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  manager?: string;
  address?: string;
  capacity?: number;
  description?: string;
  status: string;
}

interface HolidayItem {
  id: string;
  date: string;
  holiday: string;
  type: string;
}

export const AdminOrgSetup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState<
    "dashboard" | "departments" | "categories" | "locations" | "calendar"
  >("dashboard");

  // Dynamic View Detection
  useEffect(() => {
    if (location.pathname.endsWith("/departments")) {
      setView("departments");
    } else if (location.pathname.endsWith("/categories")) {
      setView("categories");
    } else if (location.pathname.endsWith("/locations")) {
      setView("locations");
    } else if (location.pathname.endsWith("/calendar")) {
      setView("calendar");
    } else {
      setView("dashboard");
    }
  }, [location.pathname]);

  // Master Data Lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Calendar Rules
  const [calendarSettings, setCalendarSettings] = useState({
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    officeHoursStart: "09:00 AM",
    officeHoursEnd: "06:00 PM",
    lunchStart: "01:00 PM",
    lunchEnd: "02:00 PM",
    bookingRules: {
      maxHours: 4,
      advanceDays: 30,
      cancelTime: 1,
      bufferTime: 15,
      weekendBooking: false,
      holidayBooking: false,
    },
  });

  // Drawer / Details Overlay States
  const [deptDrawerOpen, setDeptDrawerOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedDeptDetails, setSelectedDeptDetails] =
    useState<Department | null>(null);
  const [activeDeptTab, setActiveDeptTab] = useState<
    "overview" | "employees" | "assets" | "timeline"
  >("overview");
  const [catDrawerOpen, setCatDrawerOpen] = useState(false);
  const [locDrawerOpen, setLocDrawerOpen] = useState(false);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);

  // Handle drawer auto-open if passed via navigation state
  useEffect(() => {
    if (location.state?.openDrawer) {
      if (view === "departments") setDeptDrawerOpen(true);
      if (view === "categories") setCatDrawerOpen(true);
      if (view === "locations") setLocDrawerOpen(true);
      if (view === "calendar") setHolidayModalOpen(true);

      // Clear navigation state to prevent reopen on reload
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, view, location.pathname, navigate]);

  // Search & Filters
  const [deptSearch, setDeptSearch] = useState("");
  const [deptStatusFilter, setDeptStatusFilter] = useState("All");
  const [deptParentFilter, setDeptParentFilter] = useState("All");
  const [deptHeadFilter, setDeptHeadFilter] = useState("All");

  // Form States
  const [deptForm, setDeptForm] = useState({
    name: "",
    code: "",
    description: "",
    parentDepartmentId: "Corporate",
    headId: "",
    email: "",
    phone: "",
    location: "",
    budget: "",
    status: "Active",
    notes: "",
  });

  const [catForm, setCatForm] = useState({
    name: "",
    code: "",
    icon: "Laptop",
    themeColor: "Blue",
    description: "",
    defaultWarranty: "24",
    maintenanceCycle: "180",
    sharedResource: false,
    qrEnabled: true,
    status: "Active",
  });

  const [locForm, setLocForm] = useState({
    name: "",
    code: "",
    parentId: "",
    manager: "",
    address: "",
    capacity: "100",
    description: "",
    status: "Active",
  });

  const [holidayForm, setHolidayForm] = useState({
    date: "",
    holiday: "",
    type: "National",
  });

  // Fetch Data
  const fetchData = async () => {
    try {
      const [depts, cats, locs, hols, cal, emps] = await Promise.all([
        api.get<Department[]>("/departments"),
        api.get<AssetCategory[]>("/categories"),
        api.get<LocationItem[]>("/locations"),
        api.get<HolidayItem[]>("/holidays"),
        api.get<any>("/calendar"),
        api.get<any[]>("/employees"),
      ]);
      setDepartments(depts);
      setCategories(cats);
      setLocations(locs);
      setHolidays(hols);
      if (cal && cal.workingDays) setCalendarSettings(cal);
      setEmployees(emps);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- DEPARTMENT HANDLERS ---
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) {
      toast.error("Department Name and Unique Code are required.");
      return;
    }
    try {
      if (editingDept) {
        await api.patch(`/departments/${editingDept.id}`, deptForm);
        toast.success(`Department "${deptForm.name}" updated successfully.`);
      } else {
        await api.post("/departments", deptForm);
        toast.success(`Department "${deptForm.name}" created successfully.`);
      }
      setDeptDrawerOpen(false);
      setEditingDept(null);
      resetDeptForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save department.");
    }
  };

  const handleDeactivateDept = async (dept: Department) => {
    const nextStatus = dept.status === "Active" ? "Inactive" : "Active";
    try {
      await api.patch(`/departments/${dept.id}`, { status: nextStatus });
      toast.success(
        `Department "${dept.name}" status changed to ${nextStatus}.`,
      );
      fetchData();
    } catch (err: any) {
      toast.error(
        err.message || "Validation error: Cannot update department status.",
      );
    }
  };

  const handleDeleteDept = async (dept: Department) => {
    if (
      !window.confirm(
        `Are you absolutely sure you want to delete "${dept.name}"?`,
      )
    )
      return;
    try {
      await api.delete(`/departments/${dept.id}`);
      toast.success("Department deleted successfully.");
      fetchData();
    } catch (err: any) {
      toast.error(
        err.message || "Cannot delete department: dependencies active.",
      );
    }
  };

  const handleOpenEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      code: dept.code,
      description: dept.description || "",
      parentDepartmentId: dept.parentDepartmentId || "Corporate",
      headId: dept.headId || "",
      email: dept.email || "",
      phone: dept.phone || "",
      location: dept.location || "",
      budget: String(dept.budget || 0),
      status: dept.status,
      notes: dept.notes || "",
    });
    setDeptDrawerOpen(true);
  };

  const resetDeptForm = () => {
    setDeptForm({
      name: "",
      code: "",
      description: "",
      parentDepartmentId: "Corporate",
      headId: "",
      email: "",
      phone: "",
      location: "",
      budget: "",
      status: "Active",
      notes: "",
    });
  };

  // --- CATEGORY HANDLERS ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name || !catForm.code) {
      toast.error("Category Name and Code are required.");
      return;
    }
    if (Number(catForm.defaultWarranty) < 0) {
      toast.error("Warranty cannot be negative.");
      return;
    }
    try {
      await api.post("/categories", {
        ...catForm,
        defaultWarranty: Number(catForm.defaultWarranty),
        maintenanceCycle: Number(catForm.maintenanceCycle),
      });
      toast.success("Asset category registered.");
      setCatDrawerOpen(false);
      setCatForm({
        name: "",
        code: "",
        icon: "Laptop",
        themeColor: "Blue",
        description: "",
        defaultWarranty: "24",
        maintenanceCycle: "180",
        sharedResource: false,
        qrEnabled: true,
        status: "Active",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to register category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category removed.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Cannot delete category.");
    }
  };

  // --- LOCATION HANDLERS ---
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locForm.name || !locForm.code) {
      toast.error("Location Name and Code are required.");
      return;
    }
    try {
      await api.post("/locations", {
        ...locForm,
        parentId: locForm.parentId || null,
        capacity: Number(locForm.capacity) || 100,
      });
      toast.success("Office Location registered.");
      setLocDrawerOpen(false);
      setLocForm({
        name: "",
        code: "",
        parentId: "",
        manager: "",
        address: "",
        capacity: "100",
        description: "",
        status: "Active",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save location.");
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await api.delete(`/locations/${id}`);
      toast.success("Location removed.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Cannot delete location.");
    }
  };

  // Recursive Tree Rendering
  const renderTree = (parentId: string | null, depth = 0) => {
    const children = locations.filter((l) => l.parentId === parentId);
    if (children.length === 0) return null;
    return (
      <div className="pl-5 border-l border-slate-200 space-y-1.5 mt-1 ml-1.5">
        {children.map((c) => (
          <div key={c.id} className="text-xs font-semibold">
            <div className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5 text-slate-450" />
              <span className="text-slate-800 font-bold">{c.name}</span>
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                {c.code}
              </span>
              {c.manager && (
                <span className="text-[9px] text-[#4F46E5] font-extrabold">
                  ({c.manager})
                </span>
              )}
            </div>
            {renderTree(c.id, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  // --- CALENDAR & HOLIDAY HANDLERS ---
  const handleSaveCalendar = async () => {
    try {
      await api.post("/calendar", calendarSettings);
      toast.success("Business calendar and hours settings updated.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save calendar hours.");
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayForm.date || !holidayForm.holiday) {
      toast.error("Date and Title are required.");
      return;
    }
    try {
      await api.post("/holidays", holidayForm);
      toast.success("Holiday scheduled.");
      setHolidayModalOpen(false);
      setHolidayForm({ date: "", holiday: "", type: "National" });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add holiday.");
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await api.delete(`/holidays/${id}`);
      toast.success("Holiday calendar event removed.");
      fetchData();
    } catch (e) {
      toast.error("Failed to remove holiday event.");
    }
  };

  const handleToggleDay = (day: string) => {
    const days = [...calendarSettings.workingDays];
    if (days.includes(day)) {
      setCalendarSettings({
        ...calendarSettings,
        workingDays: days.filter((d) => d !== day),
      });
    } else {
      setCalendarSettings({ ...calendarSettings, workingDays: [...days, day] });
    }
  };

  // --- FILTERED DEPARTMENTS ---
  const filteredDepts = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.code.toLowerCase().includes(deptSearch.toLowerCase());
    const matchesStatus =
      deptStatusFilter === "All" || d.status === deptStatusFilter;
    const matchesParent =
      deptParentFilter === "All" || d.parentDepartmentId === deptParentFilter;
    const matchesHead = deptHeadFilter === "All" || d.headId === deptHeadFilter;
    return matchesSearch && matchesStatus && matchesParent && matchesHead;
  });

  return (
    <div className="p-8 bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      <div className="animate-fade-in space-y-6">
        {/* Dynamic Header with Breadcrumbs & Titles */}
        <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link
              to="/admin"
              className="hover:text-[#4F46E5] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to="/admin/organization"
              className="hover:text-[#4F46E5] transition-colors"
            >
              Organization Setup
            </Link>
            {view !== "dashboard" && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#4F46E5]">
                  {view === "departments" && "Departments"}
                  {view === "categories" && "Asset Categories"}
                  {view === "locations" && "Locations"}
                  {view === "calendar" && "Business Calendar"}
                </span>
              </>
            )}
          </div>

          {/* Page Title & Back Button */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-3">
              {view !== "dashboard" && (
                <button
                  onClick={() => {
                    navigate("/admin/organization");
                    setSelectedDeptDetails(null);
                  }}
                  className="p-2 hover:bg-[#F8FAFC] rounded-xl transition-all border border-[#E7ECF3] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
                  {view === "dashboard" && "Organization Setup Overview"}
                  {view === "departments" && "Department Management"}
                  {view === "categories" && "Asset Category Management"}
                  {view === "locations" && "Organization Locations"}
                  {view === "calendar" && "Business Calendar"}
                </h2>
                <p className="text-xs text-slate-450 font-semibold mt-1">
                  {view === "dashboard" &&
                    "Manage the core structure and operational master data of your organization."}
                  {view === "departments" &&
                    "Manage organizational departments, heads and hierarchy."}
                  {view === "categories" && "Manage reusable asset categories."}
                  {view === "locations" &&
                    "Manage offices, buildings, floors and storage."}
                  {view === "calendar" &&
                    "Configure holidays, working hours and booking rules."}
                </p>
              </div>
            </div>
            {view !== "dashboard" && (
              <button
                onClick={() => {
                  navigate("/admin/organization");
                  setSelectedDeptDetails(null);
                }}
                className="text-[10.5px] bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 px-3 py-1.5 rounded-xl font-bold hover:bg-indigo-50 cursor-pointer"
              >
                Back to Overview
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: MASTER SETUP DASHBOARD */}
        {view === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card bg-white p-5 flex flex-col justify-between h-52 border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] relative group hover:-translate-y-1 transition-all">
                <div className="p-3 bg-indigo-50 text-[#4F46E5] w-11 h-11 rounded-2xl flex items-center justify-center border border-indigo-100">
                  <Building className="w-5 h-5" />
                </div>
                <div className="my-3">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    🏢 Departments
                  </h4>
                  <p className="text-[10.5px] text-slate-450 font-semibold mt-1">
                    {departments.filter((d) => d.status === "Active").length}{" "}
                    Active Hierarchy Divisions
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/organization/departments")}
                  className="w-full btn-secondary py-2 text-[10.5px] font-bold text-[#4F46E5] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Manage Departments <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="glass-card bg-white p-5 flex flex-col justify-between h-52 border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] relative group hover:-translate-y-1 transition-all">
                <div className="p-3 bg-emerald-50 text-emerald-600 w-11 h-11 rounded-2xl flex items-center justify-center border border-emerald-100">
                  <Tags className="w-5 h-5" />
                </div>
                <div className="my-3">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    📦 Asset Categories
                  </h4>
                  <p className="text-[10.5px] text-slate-450 font-semibold mt-1">
                    {categories.length} Registered Categories
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/organization/categories")}
                  className="w-full btn-secondary py-2 text-[10.5px] font-bold text-emerald-600 border-emerald-100 hover:bg-emerald-50/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Manage Categories <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="glass-card bg-white p-5 flex flex-col justify-between h-52 border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] relative group hover:-translate-y-1 transition-all">
                <div className="p-3 bg-amber-50 text-amber-600 w-11 h-11 rounded-2xl flex items-center justify-center border border-amber-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="my-3">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    📍 Locations
                  </h4>
                  <p className="text-[10.5px] text-slate-450 font-semibold mt-1">
                    {locations.length} Office Areas & Storage Hubs
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/organization/locations")}
                  className="w-full btn-secondary py-2 text-[10.5px] font-bold text-amber-600 border-amber-100 hover:bg-amber-50/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Manage Locations <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="glass-card bg-white p-5 flex flex-col justify-between h-52 border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] relative group hover:-translate-y-1 transition-all">
                <div className="p-3 bg-rose-50 text-rose-600 w-11 h-11 rounded-2xl flex items-center justify-center border border-rose-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="my-3">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    📅 Business Calendar
                  </h4>
                  <p className="text-[10.5px] text-slate-450 font-semibold mt-1">
                    Working Days, Hours & {holidays.length} Holidays
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/organization/calendar")}
                  className="w-full btn-secondary py-2 text-[10.5px] font-bold text-rose-600 border-rose-100 hover:bg-[#FFF7ED] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Manage Calendar <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Statistics summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card bg-white p-5 border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px]">
                <h3 className="text-xs font-black uppercase text-slate-900 mb-4 border-b pb-2">
                  Master Data Health Index
                </h3>
                <div className="grid grid-cols-4 gap-4 text-center font-mono">
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      DEPARTMENTS
                    </span>
                    <span className="text-xl font-extrabold text-slate-800">
                      {departments.length}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      CATEGORIES
                    </span>
                    <span className="text-xl font-extrabold text-slate-800">
                      {categories.length}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      LOCATIONS
                    </span>
                    <span className="text-xl font-extrabold text-slate-800">
                      {locations.length}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      HOLIDAYS
                    </span>
                    <span className="text-xl font-extrabold text-slate-800">
                      {holidays.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card bg-white p-5 border border-[#E7ECF3] shadow-[0_8px_30px_rgba(15,23,42,0.05)] rounded-[22px] space-y-3.5">
                <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2">
                  Quick Add Shortcuts
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold">
                  <button
                    onClick={() =>
                      navigate("/admin/organization/departments", {
                        state: { openDrawer: true },
                      })
                    }
                    className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200/50 rounded-xl text-slate-700 hover:text-[#4F46E5] text-left cursor-pointer transition-colors"
                  >
                    ＋ New Dept
                  </button>
                  <button
                    onClick={() =>
                      navigate("/admin/organization/categories", {
                        state: { openDrawer: true },
                      })
                    }
                    className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/50 rounded-xl text-slate-700 hover:text-emerald-600 text-left cursor-pointer transition-colors"
                  >
                    ＋ New Category
                  </button>
                  <button
                    onClick={() =>
                      navigate("/admin/organization/locations", {
                        state: { openDrawer: true },
                      })
                    }
                    className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200/50 rounded-xl text-slate-700 hover:text-amber-600 text-left cursor-pointer transition-colors"
                  >
                    ＋ New Location
                  </button>
                  <button
                    onClick={() =>
                      navigate("/admin/organization/calendar", {
                        state: { openDrawer: true },
                      })
                    }
                    className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200/50 rounded-xl text-slate-700 hover:text-rose-600 text-left cursor-pointer transition-colors"
                  >
                    ＋ Add Holiday
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DEPARTMENTS PANEL */}
        {view === "departments" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  className="w-full max-w-xs bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                />
                <select
                  value={deptParentFilter}
                  onChange={(e) => setDeptParentFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Parents</option>
                  <option value="Corporate">Corporate Parent</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <select
                  value={deptStatusFilter}
                  onChange={(e) => setDeptStatusFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
              <button
                onClick={() => {
                  resetDeptForm();
                  setEditingDept(null);
                  setDeptDrawerOpen(true);
                }}
                className="btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,.25)]"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="overflow-x-auto">
                <table className="erp-table w-full">
                  <thead>
                    <tr>
                      <th className="py-3.5 px-5">Department Name</th>
                      <th className="py-3.5 px-4">Code</th>
                      <th className="py-3.5 px-4">HOD Head</th>
                      <th className="py-3.5 px-4">Parent Dept</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredDepts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-slate-400 italic"
                        >
                          No departments match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredDepts.map((dept, index) => (
                        <tr key={index}>
                          <td className="py-4 px-5">
                            <button
                              onClick={() => {
                                setSelectedDeptDetails(dept);
                                setActiveDeptTab("overview");
                              }}
                              className="font-extrabold text-slate-900 hover:text-[#4F46E5] hover:underline text-left block cursor-pointer"
                            >
                              {dept.name}
                            </button>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {dept.location || "No office room registered"}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-[10.5px] text-slate-500">
                            {dept.code}
                          </td>
                          <td className="py-4 px-4 text-slate-650 flex items-center gap-1.5 select-none">
                            {dept.headId ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                                <span>{dept.headId}</span>
                              </>
                            ) : (
                              <span className="text-slate-400 italic">
                                Vacant
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-slate-450">
                            {dept.parentDepartmentId || "Corporate"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                dept.status === "Active"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}
                            >
                              {dept.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => {
                                  setSelectedDeptDetails(dept);
                                  setActiveDeptTab("overview");
                                }}
                                className="p-2 hover:bg-[#EEF2FF] text-[#4F46E5] rounded-xl transition-all border border-transparent hover:border-indigo-100 cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditDept(dept)}
                                className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                                title="Edit"
                              >
                                <Sliders className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeactivateDept(dept)}
                                className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all border border-transparent hover:border-amber-100 cursor-pointer"
                                title={
                                  dept.status === "Active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDept(dept)}
                                className="p-2 hover:bg-rose-50 text-rose-650 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CATEGORY PANEL */}
        {view === "categories" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card flex items-center gap-4 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
                <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-xl border border-indigo-100">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Most Used Category
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    Electronics
                  </h4>
                </div>
              </div>
              <div className="glass-card flex items-center gap-4 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Largest Category
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    Furniture
                  </h4>
                </div>
              </div>
              <div className="glass-card flex items-center gap-4 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Highest Maintenance
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    Vehicles
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Category Directories
              </h4>
              <button
                onClick={() => setCatDrawerOpen(true)}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((cat) => {
                let colorClass =
                  "bg-indigo-50 text-[#4F46E5] border-indigo-150";
                if (cat.name.toLowerCase().includes("furniture"))
                  colorClass =
                    "bg-emerald-50 text-emerald-600 border-emerald-150";
                if (cat.name.toLowerCase().includes("vehicle"))
                  colorClass = "bg-amber-50 text-amber-600 border-amber-150";
                if (cat.name.toLowerCase().includes("room"))
                  colorClass = "bg-rose-50 text-rose-600 border-rose-150";
                return (
                  <div
                    key={cat.id}
                    className="glass-card bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-[180px] shadow-sm hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className={`px-2.5 py-1 rounded-xl border flex items-center justify-center font-bold text-[10.5px] font-mono uppercase tracking-wider ${colorClass}`}
                      >
                        📦 {cat.code}
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3.5 space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-snug truncate">
                        {cat.description || "No description registered"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9.5px] font-extrabold text-slate-405 pt-2.5 border-t border-slate-100 mt-2">
                      <div>
                        <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wide">
                          WARRANTY
                        </span>
                        <span className="text-slate-850 font-mono">
                          {cat.defaultWarranty} Mo.
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wide">
                          LIFECYCLE
                        </span>
                        <span className="text-slate-850 font-mono">
                          {cat.maintenanceCycle} Days
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: LOCATIONS PANEL */}
        {view === "locations" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            <div className="lg:col-span-1 glass-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b pb-2">
                Office Hierarchy Tree
              </h4>
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 max-h-[400px] overflow-y-auto">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 py-1">
                  <Building className="w-4 h-4 text-[#4F46E5]" />
                  <span className="font-black">HQ</span>
                </div>
                {renderTree("loc-hq")}
                {renderTree(null)}
              </div>
            </div>

            <div className="lg:col-span-2 overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#FAFBFC]">
                <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                  Office Locations Directory
                </h4>
                <button
                  onClick={() => setLocDrawerOpen(true)}
                  className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> New Location
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="erp-table w-full">
                  <thead>
                    <tr>
                      <th className="py-3.5 px-5">Office / Wing</th>
                      <th className="py-3.5 px-4">Parent Reference</th>
                      <th className="py-3.5 px-4">Manager</th>
                      <th className="py-3.5 px-4">Capacity</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {locations.map((loc, idx) => (
                      <tr key={idx}>
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 block">
                            {loc.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">
                            {loc.code}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-mono text-[10px]">
                          {loc.parentId || "HQ ROOT"}
                        </td>
                        <td className="py-4 px-4 text-slate-650">
                          {loc.manager || "-"}
                        </td>
                        <td className="py-4 px-4 text-slate-505 font-mono">
                          {loc.capacity || 0}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Delete Location"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: CALENDAR PANEL */}
        {view === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card bg-white p-6 border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-sm font-black uppercase text-slate-800 flex items-center gap-1.5 border-b pb-3">
                  <Clock className="w-4.5 h-4.5 text-[#4F46E5]" /> Office Timing
                  & Lunch Break
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-slate-705">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Office Hours Start
                    </label>
                    <input
                      type="text"
                      value={calendarSettings.officeHoursStart}
                      onChange={(e) =>
                        setCalendarSettings({
                          ...calendarSettings,
                          officeHoursStart: e.target.value,
                        })
                      }
                      className="glass-input pl-3.5 text-xs"
                      placeholder="e.g. 09:00 AM"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Office Hours End
                    </label>
                    <input
                      type="text"
                      value={calendarSettings.officeHoursEnd}
                      onChange={(e) =>
                        setCalendarSettings({
                          ...calendarSettings,
                          officeHoursEnd: e.target.value,
                        })
                      }
                      className="glass-input pl-3.5 text-xs"
                      placeholder="e.g. 06:00 PM"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Lunch Break Start
                    </label>
                    <input
                      type="text"
                      value={calendarSettings.lunchStart}
                      onChange={(e) =>
                        setCalendarSettings({
                          ...calendarSettings,
                          lunchStart: e.target.value,
                        })
                      }
                      className="glass-input pl-3.5 text-xs"
                      placeholder="e.g. 01:00 PM"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Lunch Break End
                    </label>
                    <input
                      type="text"
                      value={calendarSettings.lunchEnd}
                      onChange={(e) =>
                        setCalendarSettings({
                          ...calendarSettings,
                          lunchEnd: e.target.value,
                        })
                      }
                      className="glass-input pl-3.5 text-xs"
                      placeholder="e.g. 02:00 PM"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-800 flex items-center gap-1.5 border-b pb-3">
                  <Calendar className="w-4.5 h-4.5 text-emerald-600" /> Active
                  Working Days
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2.5 flex-wrap">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => {
                      const active = calendarSettings.workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => handleToggleDay(day)}
                          className={`py-2 px-3.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                            active
                              ? "bg-indigo-50 border-indigo-150 text-[#4F46E5]"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="glass-card bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-800 flex items-center gap-1.5 border-b pb-3">
                  <Settings className="w-4.5 h-4.5 text-amber-500" />{" "}
                  Operational Booking Rules
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Max Booking Hours
                    </label>
                    <input
                      type="number"
                      value={calendarSettings.bookingRules.maxHours}
                      onChange={(e) =>
                        setCalendarSettings({
                          ...calendarSettings,
                          bookingRules: {
                            ...calendarSettings.bookingRules,
                            maxHours: Number(e.target.value),
                          },
                        })
                      }
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Advance Booking Days
                    </label>
                    <input
                      type="number"
                      value={calendarSettings.bookingRules.advanceDays}
                      onChange={(e) =>
                        setCalendarSettings({
                          ...calendarSettings,
                          bookingRules: {
                            ...calendarSettings.bookingRules,
                            advanceDays: Number(e.target.value),
                          },
                        })
                      }
                      className="glass-input text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3.5 pt-2">
                  <input
                    type="checkbox"
                    id="weekendBook"
                    checked={calendarSettings.bookingRules.weekendBooking}
                    onChange={(e) =>
                      setCalendarSettings({
                        ...calendarSettings,
                        bookingRules: {
                          ...calendarSettings.bookingRules,
                          weekendBooking: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-[#4F46E5] rounded cursor-pointer"
                  />
                  <label
                    htmlFor="weekendBook"
                    className="cursor-pointer text-xs font-semibold text-slate-650"
                  >
                    Enable resource bookings on weekends
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveCalendar}
                  className="btn-primary text-xs py-3.5 px-6 font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,.25)]"
                >
                  <CheckCircle className="w-4.5 h-4.5" /> Save All Settings
                </button>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#FAFBFC]">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Scheduled Holidays
                  </h4>
                  <button
                    onClick={() => setHolidayModalOpen(true)}
                    className="btn-secondary py-1.5 px-3 text-[10px] font-bold text-rose-600 border-rose-100 hover:bg-rose-50/20 cursor-pointer"
                  >
                    ＋ Holiday
                  </button>
                </div>
                <div className="p-4">
                  <table className="erp-table w-full text-xs text-left">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-semibold text-slate-700">
                      {holidays.map((h) => (
                        <tr key={h.id}>
                          <td className="py-2.5 px-2 font-mono text-[10.5px] text-slate-450">
                            {h.date}
                          </td>
                          <td className="py-2.5 px-2 text-slate-800">
                            {h.holiday}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              onClick={() => handleDeleteHoliday(h.id)}
                              className="p-1.5 hover:bg-rose-55 text-slate-450 hover:text-rose-600 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAILS OVERLAY: DEPARTMENT DETAIL TABS */}
      {selectedDeptDetails && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-2xl bg-white border-l border-slate-200 h-full p-8 flex flex-col justify-between overflow-y-auto animate-slide-in relative">
            <button
              onClick={() => setSelectedDeptDetails(null)}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 absolute top-6 right-6 rounded-xl border cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                  Department Details Control
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {selectedDeptDetails.name}
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-1.5 inline-block">
                  {selectedDeptDetails.code}
                </span>
              </div>

              <div className="flex border-b border-slate-100 gap-4 font-bold text-xs text-slate-455">
                <button
                  onClick={() => setActiveDeptTab("overview")}
                  className={`pb-2 cursor-pointer ${activeDeptTab === "overview" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveDeptTab("employees")}
                  className={`pb-2 cursor-pointer ${activeDeptTab === "employees" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Employees
                </button>
                <button
                  onClick={() => setActiveDeptTab("assets")}
                  className={`pb-2 cursor-pointer ${activeDeptTab === "assets" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Assets
                </button>
                <button
                  onClick={() => setActiveDeptTab("timeline")}
                  className={`pb-2 cursor-pointer ${activeDeptTab === "timeline" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Activity Timeline
                </button>
              </div>

              {activeDeptTab === "overview" && (
                <div className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono font-extrabold text-slate-800">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">
                        Employees
                      </span>
                      <span>
                        {
                          employees.filter(
                            (u) => u.departmentId === selectedDeptDetails.id,
                          ).length
                        }
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">
                        Assets Assigned
                      </span>
                      <span>183</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">
                        Active Bookings
                      </span>
                      <span>16</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">
                        Under Repair
                      </span>
                      <span>3</span>
                    </div>
                  </div>
                  <div className="space-y-3 font-semibold text-slate-700">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                        Description
                      </span>
                      <p className="mt-1 text-slate-650 leading-relaxed">
                        {selectedDeptDetails.description ||
                          "No description listed."}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">
                          Budget Allocation
                        </span>
                        <p className="mt-1 font-bold text-slate-900">
                          ${selectedDeptDetails.budget || 0} USD
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">
                          Email Address
                        </span>
                        <p className="mt-1 text-[#4F46E5] font-bold">
                          {selectedDeptDetails.email || "it@company.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDeptTab === "employees" && (
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Staff Directory (
                    {
                      employees.filter(
                        (u) => u.departmentId === selectedDeptDetails.id,
                      ).length
                    }
                    )
                  </span>
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto border border-slate-150 rounded-2xl p-4 bg-slate-50/20">
                    {employees
                      .filter((u) => u.departmentId === selectedDeptDetails.id)
                      .map((emp) => (
                        <div
                          key={emp.id}
                          className="py-2.5 flex justify-between items-center text-xs font-semibold"
                        >
                          <div>
                            <span className="font-extrabold text-slate-800 block">
                              {emp.name}
                            </span>
                            <span className="text-[9px] text-slate-400 block">
                              {emp.email}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-505">
                            {emp.employeeId}
                          </span>
                        </div>
                      ))}
                    {employees.filter(
                      (u) => u.departmentId === selectedDeptDetails.id,
                    ).length === 0 && (
                      <div className="py-8 text-center text-slate-400 italic">
                        No employees assigned to this department.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDeptTab === "assets" && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Allocated Inventory (Mockup)
                  </span>
                  <div className="p-8 text-center text-slate-400 italic text-xs font-semibold">
                    Live hardware inventory logs loading...
                  </div>
                </div>
              )}

              {activeDeptTab === "timeline" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Operational History
                  </span>
                  <div className="space-y-6 pl-4 border-l-2 border-indigo-100 font-semibold text-xs">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
                      <span className="text-[9px] text-slate-400 font-bold">
                        12 JUL 2026
                      </span>
                      <p className="text-slate-800 font-extrabold mt-0.5">
                        Department details updated
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] text-slate-400 font-bold">
                        10 JUL 2026
                      </span>
                      <p className="text-slate-800 font-extrabold mt-0.5">
                        HOD Head assigned (
                        {selectedDeptDetails.headId || "Vacant"})
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span className="text-[9px] text-slate-400 font-bold">
                        01 JUL 2026
                      </span>
                      <p className="text-slate-800 font-extrabold mt-0.5">
                        Department created successfully
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedDeptDetails(null)}
              className="w-full btn-secondary text-xs py-3 font-bold mt-8 cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

      {/* DRAWERS / MODALS OVERLAYS */}
      {/* 1. Add/Edit Department Drawer */}
      {deptDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-8 flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                {editingDept ? "Edit Department" : "Create Department"}
              </h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase mt-1">
                Configure hierarchical team structures
              </p>
              <form
                onSubmit={handleSaveDept}
                className="space-y-4 text-xs font-semibold text-slate-750 mt-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={deptForm.name}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, name: e.target.value })
                      }
                      placeholder="e.g. Sales Department"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Code (Unique) *
                    </label>
                    <input
                      type="text"
                      required
                      value={deptForm.code}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, code: e.target.value })
                      }
                      placeholder="e.g. SLS"
                      className="glass-input text-xs font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Description
                  </label>
                  <textarea
                    value={deptForm.description}
                    onChange={(e) =>
                      setDeptForm({ ...deptForm, description: e.target.value })
                    }
                    placeholder="Brief description of department scope..."
                    className="glass-input text-xs h-20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Parent Department
                    </label>
                    <select
                      value={deptForm.parentDepartmentId}
                      onChange={(e) =>
                        setDeptForm({
                          ...deptForm,
                          parentDepartmentId: e.target.value,
                        })
                      }
                      className="glass-input text-xs bg-white"
                    >
                      <option value="Corporate">Corporate ROOT</option>
                      {departments
                        .filter((d) => d.id !== editingDept?.id)
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Department Head (HOD)
                    </label>
                    <select
                      value={deptForm.headId}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, headId: e.target.value })
                      }
                      className="glass-input text-xs bg-white"
                    >
                      <option value="">Select HOD...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      value={deptForm.email}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, email: e.target.value })
                      }
                      placeholder="dept@company.com"
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Phone Ext
                    </label>
                    <input
                      type="text"
                      value={deptForm.phone}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, phone: e.target.value })
                      }
                      placeholder="e.g. 1005"
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Location Detail
                    </label>
                    <input
                      type="text"
                      value={deptForm.location}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, location: e.target.value })
                      }
                      placeholder="e.g. Bldg A, Floor 2"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Budget Allocation ($)
                    </label>
                    <input
                      type="number"
                      value={deptForm.budget}
                      onChange={(e) =>
                        setDeptForm({ ...deptForm, budget: e.target.value })
                      }
                      placeholder="e.g. 10000"
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-3.5 font-bold mt-4 cursor-pointer"
                >
                  {editingDept
                    ? "Update Department Master"
                    : "Create Department"}
                </button>
              </form>
            </div>
            <button
              onClick={() => {
                setDeptDrawerOpen(false);
                setEditingDept(null);
              }}
              className="w-full btn-secondary text-xs py-3 font-bold mt-4 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 2. Add Category Drawer */}
      {catDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-8 flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                New Asset Category
              </h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase mt-1">
                Configure asset warranty defaults and maintenance cycles
              </p>
              <form
                onSubmit={handleSaveCategory}
                className="space-y-4 text-xs font-semibold text-slate-755 mt-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={catForm.name}
                      onChange={(e) =>
                        setCatForm({ ...catForm, name: e.target.value })
                      }
                      placeholder="e.g. Laptops"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={catForm.code}
                      onChange={(e) =>
                        setCatForm({ ...catForm, code: e.target.value })
                      }
                      placeholder="e.g. LAP"
                      className="glass-input text-xs uppercase"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Default Warranty (Months)
                    </label>
                    <input
                      type="number"
                      value={catForm.defaultWarranty}
                      onChange={(e) =>
                        setCatForm({
                          ...catForm,
                          defaultWarranty: e.target.value,
                        })
                      }
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Maintenance Cycle (Days) *
                    </label>
                    <input
                      type="number"
                      required
                      value={catForm.maintenanceCycle}
                      onChange={(e) =>
                        setCatForm({
                          ...catForm,
                          maintenanceCycle: e.target.value,
                        })
                      }
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Description
                  </label>
                  <textarea
                    value={catForm.description}
                    onChange={(e) =>
                      setCatForm({ ...catForm, description: e.target.value })
                    }
                    placeholder="Category details..."
                    className="glass-input text-xs h-20 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3.5 pt-2">
                  <input
                    type="checkbox"
                    id="sharedRes"
                    checked={catForm.sharedResource}
                    onChange={(e) =>
                      setCatForm({
                        ...catForm,
                        sharedResource: e.target.checked,
                      })
                    }
                    className="w-4.5 h-4.5 accent-[#4F46E5] rounded cursor-pointer"
                  />
                  <label htmlFor="sharedRes" className="cursor-pointer text-xs">
                    Shared resource category
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-3.5 font-bold mt-4 cursor-pointer"
                >
                  Register Category
                </button>
              </form>
            </div>
            <button
              onClick={() => setCatDrawerOpen(false)}
              className="w-full btn-secondary text-xs py-3 font-bold mt-4 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. Add Location Drawer */}
      {locDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-8 flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                New Office Location
              </h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase mt-1">
                Register offices, floors, wings, or storage areas
              </p>
              <form
                onSubmit={handleSaveLocation}
                className="space-y-4 text-xs font-semibold text-slate-755 mt-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={locForm.name}
                      onChange={(e) =>
                        setLocForm({ ...locForm, name: e.target.value })
                      }
                      placeholder="e.g. Server Room B"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Code (Unique) *
                    </label>
                    <input
                      type="text"
                      required
                      value={locForm.code}
                      onChange={(e) =>
                        setLocForm({ ...locForm, code: e.target.value })
                      }
                      placeholder="e.g. SR-B"
                      className="glass-input text-xs uppercase font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Parent Location
                    </label>
                    <select
                      value={locForm.parentId}
                      onChange={(e) =>
                        setLocForm({ ...locForm, parentId: e.target.value })
                      }
                      className="glass-input text-xs bg-white"
                    >
                      <option value="">HQ Root Parent</option>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Location Manager
                    </label>
                    <select
                      value={locForm.manager}
                      onChange={(e) =>
                        setLocForm({ ...locForm, manager: e.target.value })
                      }
                      className="glass-input text-xs bg-white"
                    >
                      <option value="">Select Manager...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={locForm.address}
                    onChange={(e) =>
                      setLocForm({ ...locForm, address: e.target.value })
                    }
                    placeholder="e.g. wing C, sector 12"
                    className="glass-input text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Asset Capacity
                    </label>
                    <input
                      type="number"
                      value={locForm.capacity}
                      onChange={(e) =>
                        setLocForm({ ...locForm, capacity: e.target.value })
                      }
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-3.5 font-bold mt-4 cursor-pointer"
                >
                  Save Location
                </button>
              </form>
            </div>
            <button
              onClick={() => setLocDrawerOpen(false)}
              className="w-full btn-secondary text-xs py-3 font-bold mt-4 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 4. Holiday Modal */}
      {holidayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/35 flex justify-center items-center z-[100] animate-fade-in p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-[22px] p-6 shadow-xl relative animate-scale-up space-y-4">
            <button
              onClick={() => setHolidayModalOpen(false)}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 absolute top-4 right-4 rounded-lg border cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Schedule Holiday Event
              </h3>
              <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-1">
                Calendar exceptions will block booking requests
              </p>
            </div>
            <form
              onSubmit={handleAddHoliday}
              className="space-y-4 text-xs font-semibold text-slate-750"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Holiday Date *
                </label>
                <input
                  type="date"
                  required
                  value={holidayForm.date}
                  onChange={(e) =>
                    setHolidayForm({ ...holidayForm, date: e.target.value })
                  }
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Holiday Title / Description *
                </label>
                <input
                  type="text"
                  required
                  value={holidayForm.holiday}
                  onChange={(e) =>
                    setHolidayForm({ ...holidayForm, holiday: e.target.value })
                  }
                  placeholder="e.g. Independence Day"
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Holiday Type
                </label>
                <select
                  value={holidayForm.type}
                  onChange={(e) =>
                    setHolidayForm({ ...holidayForm, type: e.target.value })
                  }
                  className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                >
                  <option value="National">National Holiday</option>
                  <option value="Regional">Regional / Local</option>
                  <option value="Corporate">Corporate Leave</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-4 flex-1 text-center font-bold cursor-pointer"
                >
                  Save Holiday
                </button>
                <button
                  type="button"
                  onClick={() => setHolidayModalOpen(false)}
                  className="btn-secondary py-2.5 px-4 flex-1 text-center font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrgSetup;
