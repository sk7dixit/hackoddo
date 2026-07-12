import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Users,
  UserPlus,
  Trash2,
  Download,
  Upload,
  Eye,
  Lock,
  UserX,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { toast } from "../../components/Toast";

export const AdminUserManagement: React.FC = () => {
  const navigate = useNavigate();

  // Directory States
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [joiningFilter, setJoiningFilter] = useState("");

  // Details drawer state
  const [selectedUserDetails, setSelectedUserDetails] = useState<any | null>(
    null,
  );
  const [activeUserTab, setActiveUserTab] = useState<
    "overview" | "assets" | "bookings" | "history"
  >("overview");

  const [bulkAction, setBulkAction] = useState("");

  const fetchData = async () => {
    try {
      const [emps, depts] = await Promise.all([
        api.get<any[]>("/employees"),
        api.get<any[]>("/departments"),
      ]);
      setEmployees(emps);
      setDepartments(depts);
    } catch (e) {
      toast.error("Failed to fetch employee directory.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- INDIVIDUAL ROW ACTIONS ---
  const handleResetPassword = async (emp: any) => {
    try {
      const nextTempPass = `Temp#${Math.floor(10 + Math.random() * 89)}@L`;
      await api.patch(`/employees/${emp.id}`, {
        password: nextTempPass,
        forcePasswordChange: true,
      });
      toast.success(
        `Reset password for ${emp.name}. Temp password is: ${nextTempPass}`,
      );
    } catch (e) {
      toast.error("Failed to reset password.");
    }
  };

  const handleToggleDeactivate = async (emp: any) => {
    const nextStatus = emp.status === "active" ? "disabled" : "active";
    try {
      await api.patch(`/employees/${emp.id}`, { status: nextStatus });
      toast.success(`Account status set to ${nextStatus}.`);
      fetchData();
    } catch (e) {
      toast.error("Failed to toggle status.");
    }
  };

  const handleDeleteUser = async (emp: any) => {
    if (
      !window.confirm(`Are you absolutely sure you want to delete ${emp.name}?`)
    )
      return;
    try {
      await api.delete(`/employees/${emp.id}`);
      toast.success("Account record purged from directory.");
      fetchData();
    } catch (err: any) {
      toast.error(
        err.message || "Cannot delete user: Active holdings or bookings.",
      );
    }
  };

  // --- BULK OPERATIONS ---
  const handleBulkExecute = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Select employees to perform bulk actions.");
      return;
    }
    if (!bulkAction) return;

    try {
      let payload: any = { employeeIds: selectedEmployees };
      if (bulkAction === "role") {
        const roleVal = window.prompt(
          "Enter role assignment (employee, department_head, asset_manager, admin):",
        );
        if (!roleVal) return;
        payload.role = roleVal;
      } else if (bulkAction === "transfer") {
        const deptVal = window.prompt(
          "Enter destination Department ID (e.g. IT, HR, Finance, Operations):",
        );
        if (!deptVal) return;
        payload.departmentId = deptVal;
      }

      await api.post("/admin/employees/bulk", { action: bulkAction, payload });
      toast.success("Bulk updates deployed successfully.");
      setSelectedEmployees([]);
      setBulkAction("");
      fetchData();
    } catch (e) {
      toast.error("Bulk operation failed.");
    }
  };

  const handleExportCSV = () => {
    window.open("http://localhost:3000/api/admin/employees/export", "_blank");
    toast.success("Export completed.");
  };

  const handleMockImport = async () => {
    const demoPayload = [
      {
        firstName: "Alice",
        lastName: "Auditor",
        email: "alice.audit@company.com",
        role: "asset_manager",
        departmentId: "Operations",
      },
      {
        firstName: "Vikram",
        lastName: "Engineer",
        email: "vikram.eng@company.com",
        role: "employee",
        departmentId: "IT",
      },
      {
        firstName: "Aman",
        lastName: "HR",
        email: "aman.hr@company.com",
        role: "employee",
        departmentId: "HR",
      },
    ];
    try {
      const res: any = await api.post("/admin/employees/bulk", {
        action: "import",
        payload: demoPayload,
      });
      toast.success(
        `Successfully imported ${res.count} employee directory records.`,
      );
      fetchData();
    } catch (e) {
      toast.error("Import failed.");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmployees(employees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, id]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    }
  };

  // --- FILTERED DIRECTORY ---
  const filteredEmployees = employees.filter((emp) => {
    const name = emp.name || "";
    const employeeId = emp.employeeId || "";
    const email = emp.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || emp.role === roleFilter;
    const matchesDept = deptFilter === "All" || emp.departmentId === deptFilter;
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    const matchesJoining = !joiningFilter || emp.joiningDate === joiningFilter;
    return (
      matchesSearch &&
      matchesRole &&
      matchesDept &&
      matchesStatus &&
      matchesJoining
    );
  });

  const totalEmps = employees.length || 326;
  const managers =
    employees.filter((u) => u.role === "asset_manager").length || 6;
  const heads =
    employees.filter((u) => u.role === "department_head").length || 18;
  const disabledCount =
    employees.filter((u) => u.status === "disabled").length || 12;

  return (
    <div className="p-8 bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      <div className="animate-fade-in space-y-6">
        {/* Breadcrumb Header */}
        <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link
              to="/admin"
              className="hover:text-[#4F46E5] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4F46E5]">User Directory</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Employee Directory
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Manage corporate employees, system access credentials, and
              security clearance roles.
            </p>
          </div>
        </div>

        {/* 1. Summary Cards Dashboard Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Staff
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {totalEmps} Employees
            </h2>
            <div className="w-1.5 h-12 rounded bg-[#4F46E5] absolute right-4 top-8" />
          </div>
          <div className="glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Asset Managers
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {managers} Online
            </h2>
            <div className="w-1.5 h-12 rounded bg-emerald-500 absolute right-4 top-8" />
          </div>
          <div className="glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Department Heads
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {heads} Assigned
            </h2>
            <div className="w-1.5 h-12 rounded bg-amber-500 absolute right-4 top-8" />
          </div>
          <div className="glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Clearance Blocked
            </span>
            <h2 className="text-2xl font-black text-rose-500 mt-1 font-mono">
              {disabledCount} Inactive
            </h2>
            <div className="w-1.5 h-12 rounded bg-rose-500 absolute right-4 top-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono font-bold text-xs text-slate-500">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            🔒 Locked: 2
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            ⏳ Resets: 3
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            ⭐ Onboard Today: 5
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-emerald-600">
            🟢 Active Sync: 81
          </div>
        </div>

        {/* 2. Directory Toolbar & Filter controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            {/* Filters container */}
            <div className="flex items-center gap-2 flex-1 min-w-[280px] flex-wrap">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by ID, name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="employee">Employee</option>
                <option value="department_head">Department Head</option>
                <option value="asset_manager">Asset Manager</option>
                <option value="admin">Administrator</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All">All Depts</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>

              <input
                type="date"
                value={joiningFilter}
                onChange={(e) => setJoiningFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleMockImport}
                className="btn-secondary py-2.5 px-3 text-xs flex items-center gap-1 font-bold text-slate-700 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Import Mock
              </button>
              <button
                onClick={handleExportCSV}
                className="btn-secondary py-2.5 px-3 text-xs flex items-center gap-1 font-bold text-[#4F46E5] cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button
                onClick={() => navigate("/admin/create-user")}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Create User
              </button>
            </div>
          </div>

          {/* Bulk Action Toolbar */}
          {selectedEmployees.length > 0 && (
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex justify-between items-center text-xs font-semibold animate-fade-in select-none">
              <div className="flex items-center gap-2">
                <span className="bg-[#4F46E5] text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
                  {selectedEmployees.length}
                </span>
                <span className="text-slate-750">Employees Selected</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg px-2.5 py-1 text-xs font-semibold"
                >
                  <option value="">Bulk Action...</option>
                  <option value="role">Bulk Role Assignment</option>
                  <option value="transfer">Bulk Department Transfer</option>
                  <option value="reset">Bulk Password Reset</option>
                  <option value="activate">Bulk Activate</option>
                  <option value="deactivate">Bulk Deactivate</option>
                </select>
                <button
                  onClick={handleBulkExecute}
                  className="btn-primary py-1 px-3 text-xs cursor-pointer"
                >
                  Execute
                </button>
              </div>
            </div>
          )}

          {/* Directory Table */}
          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="overflow-x-auto">
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-5 w-10">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedEmployees.length === employees.length &&
                          employees.length > 0
                        }
                        className="cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Role Clearance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-400 italic"
                      >
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp, idx) => {
                      const isChecked = selectedEmployees.includes(emp.id);
                      return (
                        <tr
                          key={idx}
                          className={isChecked ? "bg-indigo-50/10" : ""}
                        >
                          <td className="py-3.5 px-5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleSelectRow(emp.id, e.target.checked)
                              }
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#4F46E5] text-[10.5px]">
                                {(emp.name || "EE")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <button
                                  onClick={() => {
                                    setSelectedUserDetails(emp);
                                    setActiveUserTab("overview");
                                  }}
                                  className="font-extrabold text-slate-850 hover:text-[#4F46E5] hover:underline text-left block"
                                >
                                  {emp.name}
                                </button>
                                <span className="text-[9px] font-mono font-bold text-slate-400 block mt-0.5">
                                  {emp.employeeId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10.5px] text-slate-500">
                            {emp.email}
                          </td>
                          <td className="py-3.5 px-4 text-slate-650">
                            {emp.departmentId || "General"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50/50 px-2 py-0.5 border border-indigo-100/50 rounded-full">
                              {emp.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                emp.status === "active"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}
                            >
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => {
                                  setSelectedUserDetails(emp);
                                  setActiveUserTab("overview");
                                }}
                                className="p-2 hover:bg-[#EEF2FF] text-[#4F46E5] rounded-xl transition-all border border-transparent hover:border-indigo-100 cursor-pointer"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleResetPassword(emp)}
                                className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all border border-transparent hover:border-amber-100 cursor-pointer"
                                title="Reset Password"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleDeactivate(emp)}
                                className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                                title={
                                  emp.status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(emp)}
                                className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Employee Analytics Charts Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
          <div className="glass-card p-6 border-slate-250">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider mb-4">
              ERP Role distribution
            </h4>
            <div className="py-8 flex justify-around items-center">
              <div className="w-24 h-24 rounded-full border-8 border-indigo-650 flex items-center justify-center font-bold text-slate-850 select-none">
                92% Staff
              </div>
              <div className="text-[10px] space-y-1 text-slate-455 font-bold">
                <p>
                  🔵 Employees:{" "}
                  {employees.filter((u) => u.role === "employee").length}
                </p>
                <p>
                  🟣 Department Heads:{" "}
                  {employees.filter((u) => u.role === "department_head").length}
                </p>
                <p>
                  🟢 Asset Managers:{" "}
                  {employees.filter((u) => u.role === "asset_manager").length}
                </p>
                <p>
                  🔴 System Admins:{" "}
                  {employees.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-slate-250">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider mb-4">
              Monthly Joining trend
            </h4>
            <div className="py-8 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-semibold">
              Analytics line trend loading...
            </div>
          </div>
        </div>
      </div>

      {/* --- DRAWERS / MODALS OVERLAYS --- */}

      {/* User Details Sidebar Drawer View */}
      {selectedUserDetails && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-2xl bg-white border-l border-slate-200 h-full p-8 flex flex-col justify-between overflow-y-auto animate-slide-in relative">
            <button
              onClick={() => setSelectedUserDetails(null)}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 absolute top-6 right-6 rounded-xl border cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#4F46E5] font-black text-xl flex items-center justify-center border select-none">
                  {(selectedUserDetails.name || "EE")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedUserDetails.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-1.5 inline-block">
                    {selectedUserDetails.employeeId}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 gap-4 font-bold text-xs text-slate-450">
                <button
                  onClick={() => setActiveUserTab("overview")}
                  className={`pb-2 cursor-pointer ${activeUserTab === "overview" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveUserTab("assets")}
                  className={`pb-2 cursor-pointer ${activeUserTab === "assets" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Assigned Assets
                </button>
                <button
                  onClick={() => setActiveUserTab("bookings")}
                  className={`pb-2 cursor-pointer ${activeUserTab === "bookings" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Bookings History
                </button>
                <button
                  onClick={() => setActiveUserTab("history")}
                  className={`pb-2 cursor-pointer ${activeUserTab === "history" ? "text-[#4F46E5] border-b-2 border-[#4F46E5]" : "hover:text-slate-700"}`}
                >
                  Login History
                </button>
              </div>

              {/* Tab Contents */}
              {activeUserTab === "overview" && (
                <div className="space-y-4 text-xs font-semibold text-slate-750">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[9px] text-slate-400 block uppercase">
                        Department Clearances
                      </span>
                      <p className="mt-1 font-bold text-slate-900">
                        {selectedUserDetails.departmentId || "General"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[9px] text-slate-400 block uppercase">
                        Clearance Level
                      </span>
                      <p className="mt-1 font-bold text-slate-900">
                        {selectedUserDetails.role}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">
                        Designation
                      </span>
                      <p className="mt-1 text-slate-800">
                        {selectedUserDetails.designation || "Associate"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">
                        Joining Date
                      </span>
                      <p className="mt-1 font-mono text-slate-800">
                        {selectedUserDetails.joiningDate || "2025-01-01"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">
                      Office Location Workspace
                    </span>
                    <p className="mt-1 text-slate-800">
                      {selectedUserDetails.officeLocation || "Corporate HQ"}
                    </p>
                  </div>
                </div>
              )}

              {activeUserTab === "assets" && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Asset Holdings Ledger
                  </span>
                  <div className="p-8 text-center text-slate-400 italic text-xs font-semibold">
                    No active assets registered in custody.
                  </div>
                </div>
              )}

              {activeUserTab === "bookings" && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Booking Transaction History
                  </span>
                  <div className="p-8 text-center text-slate-400 italic text-xs font-semibold">
                    No bookings logged for this workspace.
                  </div>
                </div>
              )}

              {activeUserTab === "history" && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Secured Login Trails
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs font-semibold">
                    <div>
                      <span className="font-extrabold text-slate-850 block">
                        Chrome - Windows OS
                      </span>
                      <span className="text-[9px] text-slate-400 block">
                        IP: 192.168.1.42
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Today, 11:20 AM
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedUserDetails(null)}
              className="w-full btn-secondary text-xs py-3 font-bold mt-8"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
