import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import {
  User,
  Shield,
  Key,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  Copy,
  Printer,
  Building,
  Check,
} from "lucide-react";
import { toast } from "../../components/Toast";

const permissionsByRole: Record<string, { label: string; allowed: boolean }[]> =
  {
    employee: [
      { label: "View Own Assets", allowed: true },
      { label: "Raise Maintenance", allowed: true },
      { label: "Book Resources", allowed: true },
      { label: "Request Transfer", allowed: true },
      { label: "Request Return", allowed: true },
      { label: "Register Assets", allowed: false },
      { label: "Delete Assets", allowed: false },
    ],
    department_head: [
      { label: "View Department Assets", allowed: true },
      { label: "Approve Requests", allowed: true },
      { label: "Book Resources", allowed: true },
      { label: "Department Reports", allowed: true },
      { label: "Register Assets", allowed: false },
      { label: "Delete Assets", allowed: false },
    ],
    asset_manager: [
      { label: "Register Assets", allowed: true },
      { label: "Asset Allocation", allowed: true },
      { label: "Transfers Governance", allowed: true },
      { label: "Maintenance Log Dispatch", allowed: true },
      { label: "Audit Verification Dispatch", allowed: true },
      { label: "Inventory Reports", allowed: true },
    ],
    admin: [
      { label: "Full Root ERP CRUD", allowed: true },
      { label: "Organization Masters Setup", allowed: true },
      { label: "Roles & Clearance Clearances", allowed: true },
      { label: "Audit Closures Control", allowed: true },
      { label: "Database Reset Operations", allowed: true },
    ],
  };

export const AdminCreateUserWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [departments, setDepartments] = useState<any[]>([]);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any | null>(null);

  // Form states
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    dob: "",
    phone: "",
    role: "employee",
    departmentId: "",
    designation: "Associate",
    joiningDate: new Date().toISOString().split("T")[0],
    reportingManager: "John Carter",
    employmentType: "Full-Time",
    officeLocation: "Corporate HQ",
    username: "",
    password: "",
    forcePasswordChange: true,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await api.get<any[]>("/departments");
        setDepartments(depts);
      } catch (e) {
        toast.error("Failed to load departments.");
      }
    };
    fetchDepartments();
  }, []);

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !form.firstName ||
        !form.lastName ||
        !form.email ||
        !form.departmentId
      ) {
        toast.error("Please fill in all required fields (marked with *).");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post("/employees", form);
      if (res.success) {
        setOnboardingSuccess(res.credentials);
        toast.success("Employee workspace onboarded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to onboard employee.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.");
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            to="/admin/employees"
            className="hover:text-[#4F46E5] transition-colors"
          >
            User Directory
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Onboarding Wizard</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            New User Wizard
          </h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Multi-step structured onboarding path for setting up system accounts
            and clearances.
          </p>
        </div>
      </div>

      {/* Stepper Indicators */}
      {!onboardingSuccess && (
        <div className="glass-card p-5 flex items-center justify-between gap-4 select-none">
          {[
            { step: 1, label: "Basic Info", icon: User },
            { step: 2, label: "Clearance Role", icon: Building },
            { step: 3, label: "Permissions scope", icon: Shield },
            { step: 4, label: "Authentication", icon: Key },
            { step: 5, label: "Review & Deploy", icon: CheckCircle },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;
            return (
              <div
                key={s.step}
                className="flex items-center gap-2 flex-1 justify-center last:flex-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.2)]"
                      : isActive
                        ? "bg-[#4F46E5] border-[#4F46E5] text-white shadow-[0_4px_10px_rgba(79,70,229,0.2)]"
                        : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <div className="hidden md:block">
                  <span
                    className={`text-[10px] uppercase font-bold block ${isActive ? "text-slate-800" : "text-slate-400"}`}
                  >
                    Step {s.step}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold ${isActive ? "text-[#4F46E5]" : "text-slate-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {s.step < 5 && (
                  <div
                    className={`hidden md:block flex-1 h-0.5 max-w-[40px] ml-4 rounded ${isCompleted ? "bg-emerald-400" : "bg-slate-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Wizard Form Area */}
      <div className="max-w-2xl mx-auto">
        {onboardingSuccess ? (
          <div className="glass-card p-8 space-y-6 text-center shadow-xl border-emerald-100 bg-white">
            <div className="p-3 bg-emerald-50 text-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                Workspace Initialized
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Access Credentials Generated Successfully
              </p>
            </div>

            <div className="p-5 bg-slate-50 border rounded-2xl text-left space-y-3.5 text-xs font-semibold text-slate-700 max-w-sm mx-auto">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">
                  Employee Workspace ID
                </span>
                <p className="font-mono mt-0.5 text-slate-900 font-extrabold text-sm">
                  {onboardingSuccess.employeeId}
                </p>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">
                    Generated Username
                  </span>
                  <p className="font-mono mt-0.5 text-slate-900 font-extrabold">
                    {onboardingSuccess.username}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(onboardingSuccess.username)}
                  className="p-1.5 hover:bg-slate-100 border rounded-lg text-slate-500 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">
                    Temporary Password
                  </span>
                  <p className="font-mono mt-0.5 text-slate-900 font-extrabold">
                    {onboardingSuccess.tempPassword}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(onboardingSuccess.tempPassword)
                  }
                  className="p-1.5 hover:bg-slate-100 border rounded-lg text-slate-500 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-center max-w-sm mx-auto">
              <button
                onClick={() => window.print()}
                className="btn-secondary flex-1 py-3 text-xs flex items-center justify-center gap-1.5 font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>
              <button
                onClick={() => navigate("/admin/employees")}
                className="btn-primary flex-1 py-3 text-xs font-bold cursor-pointer"
              >
                Go to Directory
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 bg-white border border-slate-200">
            {/* STEP 1: BASIC INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                    1. Personal Information
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    Please provide primary identification details
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-450 font-bold uppercase">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      placeholder="e.g. Shashwat"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-450 font-bold uppercase">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      placeholder="e.g. Kumar"
                      className="glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-455 font-bold uppercase">
                      Work Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="user@company.com"
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-455 font-bold uppercase">
                      Phone Ext
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="e.g. +1 555-019-28"
                      className="glass-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-455 font-bold uppercase">
                      Department *
                    </label>
                    <select
                      value={form.departmentId}
                      required
                      onChange={(e) =>
                        setForm({ ...form, departmentId: e.target.value })
                      }
                      className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                    >
                      <option value="">Select Dept...</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-455 font-bold uppercase">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={(e) =>
                        setForm({ ...form, designation: e.target.value })
                      }
                      placeholder="e.g. Associate"
                      className="glass-input text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CLEARANCE ROLE */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                    2. Clearance Role Selection
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    Determine access permissions and corporate directory group
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      val: "employee",
                      title: "Employee (Custodian)",
                      desc: "Standard employee account. Holds custodianship of assigned assets, requests bookings and schedules transfers.",
                    },
                    {
                      val: "department_head",
                      title: "Department Head (HOD)",
                      desc: "Manages department assets, approves or rejects resource requests and views HOD analytics.",
                    },
                    {
                      val: "asset_manager",
                      title: "Asset Manager",
                      desc: "Registers new assets, manages audit logs, governs allocation list, and controls compliance reports.",
                    },
                    {
                      val: "admin",
                      title: "System Administrator",
                      desc: "Full root access. Control system settings, manage permissions clearings, organization masters, and database actions.",
                    },
                  ].map((r) => (
                    <label
                      key={r.val}
                      className={`p-4 border rounded-2xl flex items-start gap-3.5 cursor-pointer transition-all ${
                        form.role === r.val
                          ? "border-[#4F46E5] bg-[#4F46E5]/5 shadow-sm"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="clearanceRole"
                        checked={form.role === r.val}
                        onChange={() => setForm({ ...form, role: r.val })}
                        className="w-4.5 h-4.5 mt-0.5 text-[#4F46E5] accent-[#4F46E5] cursor-pointer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 block text-xs">
                          {r.title}
                        </span>
                        <span className="text-[10.5px] text-slate-450 leading-relaxed block mt-1">
                          {r.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: PERMISSIONS PREVIEW */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                    3. Permissions Scope Preview
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    Summary of actions permitted under the selected role profile
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <Shield className="w-5 h-5 text-[#4F46E5]" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Clearance Access Profile
                      </span>
                      <span className="text-xs font-black text-slate-850 uppercase">
                        {form.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-semibold">
                    {permissionsByRole[form.role]?.map((perm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs select-none ${
                            perm.allowed
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-500"
                          }`}
                        >
                          {perm.allowed ? "✓" : "✗"}
                        </div>
                        <span
                          className={
                            perm.allowed
                              ? "text-slate-800 font-extrabold"
                              : "text-slate-400 font-normal"
                          }
                        >
                          {perm.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: AUTHENTICATION */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                    4. Security & Authentication
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    Determine workspace identity codes and credential policies
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-455 font-bold uppercase">
                      Custom Employee Workspace ID (Leave blank to
                      auto-generate)
                    </label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      placeholder="e.g. EMP-2026-88"
                      className="glass-input text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-455 font-bold uppercase">
                      Custom Password (Leave blank to generate random temp
                      password)
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="••••••••••••"
                      className="glass-input text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-3 mt-4">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">
                      Security Directives
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="forceReset"
                        checked={form.forcePasswordChange}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            forcePasswordChange: e.target.checked,
                          })
                        }
                        className="w-4.5 h-4.5 accent-indigo-650 rounded cursor-pointer"
                      />
                      <label
                        htmlFor="forceReset"
                        className="font-semibold text-slate-700 cursor-pointer"
                      >
                        Force user to change password on first login
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & DEPLOY */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                    5. Review & Deploy Onboarding
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    Please review all parameters before creating the employee
                    account
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-xs font-semibold text-slate-700">
                  <div className="p-4 bg-[#FAFBFC] border-b font-extrabold text-slate-900 uppercase tracking-wide">
                    Summary Verification
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">
                          First Name
                        </span>
                        <span className="text-slate-900 font-extrabold">
                          {form.firstName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">
                          Last Name
                        </span>
                        <span className="text-slate-900 font-extrabold">
                          {form.lastName}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">
                          Work Email
                        </span>
                        <span className="text-slate-800 font-mono">
                          {form.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">
                          Department ID
                        </span>
                        <span className="text-slate-900 font-extrabold">
                          {form.departmentId}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">
                          Role Profile
                        </span>
                        <span className="text-[#4F46E5] uppercase font-black">
                          {form.role}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">
                          Force Pass Change
                        </span>
                        <span>
                          {form.forcePasswordChange ? "Yes (Enforced)" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Action Bar */}
            <div className="flex justify-between items-center gap-4 pt-6 border-t mt-8">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary py-3 px-6 text-xs font-black flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,.25)] cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Deploy Onboarding
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCreateUserWizard;
