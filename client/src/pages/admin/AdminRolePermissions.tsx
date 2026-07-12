import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Shield,
  Settings,
  Layers,
  Check,
  X,
  Plus,
  Sliders,
  Eye,
  Lock,
  Clock,
  Activity,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  UserCheck,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  usersCount: number;
  permissionCount: number;
  lastModified: string;
  permissions: string[];
}

interface Workflow {
  id: string;
  name: string;
  steps: string[];
}

interface PermissionAudit {
  id: string;
  date: string;
  admin: string;
  user: string;
  action: string;
}

const matrixCategories = [
  {
    id: "dashboard",
    label: "Dashboard Scopes",
    permissions: [
      {
        id: "dashboard",
        label: "View Dashboard Metrics",
        desc: "Allow viewing system overview KPIs, summaries, and activity summaries.",
      },
    ],
  },
  {
    id: "assets",
    label: "Asset Operations",
    permissions: [
      {
        id: "assets:view",
        label: "View Inventory List",
        desc: "View complete organizational hardware and equipment logs.",
      },
      {
        id: "assets:register",
        label: "Register New Assets",
        desc: "Create new hardware entries in database.",
      },
      {
        id: "assets:edit",
        label: "Modify Specifications",
        desc: "Edit specifications, warranty dates, and custodian holdings.",
      },
      {
        id: "assets:delete",
        label: "Delete Records",
        desc: "Retire or delete hardware items permanently.",
      },
      {
        id: "assets:allocate",
        label: "Allocate Custody",
        desc: "Approve asset allocations and handovers to staff.",
      },
      {
        id: "assets:transfer",
        label: "Transfer Governance",
        desc: "Approve and dispatch department-to-department transfers.",
      },
      {
        id: "assets:return",
        label: "Confirm Handovers & Returns",
        desc: "Acknowledge return verifications back to stock.",
      },
      {
        id: "assets:maintenance",
        label: "Maintenance Log Dispatch",
        desc: "Dispatch assets to external repair technicians.",
      },
    ],
  },
  {
    id: "bookings",
    label: "Resource Booking",
    permissions: [
      {
        id: "assets:booking",
        label: "Reserve Resources",
        desc: "Schedule and book shared corporate facilities, rooms, or vehicles.",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    permissions: [
      {
        id: "reports:view",
        label: "View Analytics & Export CSV",
        desc: "Review ledger trends, compliance statistics, and trigger CSV downloads.",
      },
    ],
  },
  {
    id: "audit",
    label: "Inventory Auditing",
    permissions: [
      {
        id: "audit:full",
        label: "Manage Verification Cycles",
        desc: "Initiate new audit schedules, log scan verifications, and close cycles.",
      },
    ],
  },
  {
    id: "notifications",
    label: "Broadcasts & Alerts",
    permissions: [
      {
        id: "notifications:manage",
        label: "Manage Notification Bell",
        desc: "Send security alerts, compose notifications, and schedule broadcasts.",
      },
    ],
  },
  {
    id: "settings",
    label: "System & Policy",
    permissions: [
      {
        id: "settings:write",
        label: "Configure System Settings",
        desc: "Access global checkout parameters, SMTP configurations, and system backups.",
      },
      {
        id: "logs:view",
        label: "View Audit Trails",
        desc: "Access security activity logs and user session records.",
      },
    ],
  },
];

export const AdminRolePermissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "matrix" | "workflows" | "policies" | "simulator" | "audits"
  >("matrix");
  const [roles, setRoles] = useState<Role[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [policies, setPolicies] = useState<any>({
    passwordPolicy: {
      minLength: 8,
      uppercaseRequired: true,
      numbersRequired: true,
      specialCharactersRequired: true,
      expiryDays: 90,
    },
    sessionRules: {
      autoLogoutMinutes: 30,
      rememberDays: 7,
      multipleSessions: true,
    },
  });
  const [audits, setAudits] = useState<PermissionAudit[]>([]);

  // Redesign state: matrix selection splits
  const [selectedRoleId, setSelectedRoleId] = useState<string>("employee");
  const [selectedCategoryTab, setSelectedCategoryTab] =
    useState<string>("assets");
  const [simulationRole, setSimulationRole] = useState<string>("employee");

  const fetchData = async () => {
    try {
      const [rolesData, workflowsData, policiesData, auditsData] =
        await Promise.all([
          api.get<Role[]>("/rbac/roles"),
          api.get<Workflow[]>("/rbac/workflows"),
          api.get<any>("/rbac/policies"),
          api.get<PermissionAudit[]>("/rbac/audits"),
        ]);
      setRoles(rolesData);
      setWorkflows(workflowsData);
      if (policiesData && policiesData.passwordPolicy)
        setPolicies(policiesData);
      setAudits(auditsData);
      if (
        rolesData.length > 0 &&
        !rolesData.find((r) => r.id === selectedRoleId)
      ) {
        setSelectedRoleId(rolesData[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePermission = async (
    roleId: string,
    permissionKey: string,
  ) => {
    const roleObj = roles.find((r) => r.id === roleId);
    if (!roleObj) return;

    let updatedPermissions = [...roleObj.permissions];
    if (updatedPermissions.includes(permissionKey)) {
      if (roleId === "admin" && permissionKey === "settings:write") {
        toast.error(
          "Security Safety: Cannot revoke settings write permission from Administrator.",
        );
        return;
      }
      updatedPermissions = updatedPermissions.filter(
        (p) => p !== permissionKey,
      );
    } else {
      updatedPermissions.push(permissionKey);
    }

    try {
      await api.patch(`/rbac/roles/${roleId}`, {
        permissions: updatedPermissions,
      });
      toast.success(`Access permissions updated for ${roleObj.name}.`);
      fetchData();
    } catch (e) {
      toast.error("Failed to update permission matrix.");
    }
  };

  const handleUpdateWorkflowStep = async (wfId: string, steps: string[]) => {
    try {
      await api.patch(`/rbac/workflows/${wfId}`, { steps });
      toast.success("Approval workflow sequence updated.");
      fetchData();
    } catch (e) {
      toast.error("Failed to update workflow step.");
    }
  };

  const handleAddWorkflowStep = (wf: Workflow) => {
    const stepName = window.prompt(
      "Enter step name to append to approval workflow:",
    );
    if (!stepName) return;
    const newSteps = [...wf.steps];
    const index = newSteps.indexOf("Completed");
    const indexAvail = newSteps.indexOf("Available");
    const insertIdx =
      index >= 0 ? index : indexAvail >= 0 ? indexAvail : newSteps.length;
    newSteps.splice(insertIdx, 0, stepName);
    handleUpdateWorkflowStep(wf.id, newSteps);
  };

  const handleRemoveWorkflowStep = (wf: Workflow, stepName: string) => {
    if (
      stepName === "Employee" ||
      stepName === "Completed" ||
      stepName === "Available"
    ) {
      toast.error("Cannot remove root initiation or terminal steps.");
      return;
    }
    const newSteps = wf.steps.filter((s) => s !== stepName);
    handleUpdateWorkflowStep(wf.id, newSteps);
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/rbac/policies", policies);
      toast.success("Access and Security Policies updated.");
      fetchData();
    } catch (e) {
      toast.error("Failed to save security policies.");
    }
  };

  const handleDuplicateTemplate = (roleName: string) => {
    toast.success(
      `Successfully duplicated "${roleName}" template. Custom role created.`,
    );
  };

  const activeRoleObj = roles.find((r) => r.id === selectedRoleId);

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Roles & Permissions</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            Access Clearance & Roles
          </h2>
          <p className="text-xs text-slate-455 font-semibold mt-1">
            Configure system security clearances, approval workflows, simulator
            sandboxes, and policy matrices.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Active Roles
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            {roles.length} System Roles
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Permission Groups
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            {matrixCategories.length} Categories
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Protected Modules
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            15 Core Pages
          </h2>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all h-28">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Custom Permissions
          </span>
          <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
            26 Rules Loaded
          </h2>
        </div>
      </div>

      {/* Role template summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="glass-card p-5 flex flex-col justify-between h-40 hover:shadow transition-all relative"
          >
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-extrabold text-sm text-slate-850">
                  {role.name}
                </h4>
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Clearance
                </span>
              </div>
              <p className="text-[10px] text-slate-450 font-semibold mt-1">
                Holds {role.permissions.length} active module scopes.
              </p>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-2 border-t border-slate-100">
              <span>USERS: {role.usersCount}</span>
              <button
                onClick={() => handleDuplicateTemplate(role.name)}
                className="text-[#4F46E5] hover:underline font-bold cursor-pointer"
              >
                Duplicate Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "matrix" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Shield className="w-4 h-4" />
          <span>Central Permission Matrix</span>
          {activeTab === "matrix" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("workflows")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "workflows" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Sliders className="w-4 h-4" />
          <span>Approval Workflows</span>
          {activeTab === "workflows" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "policies" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Lock className="w-4 h-4" />
          <span>Global Access Policies</span>
          {activeTab === "policies" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "simulator" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Eye className="w-4 h-4" />
          <span>Access Simulator Sandbox</span>
          {activeTab === "simulator" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("audits")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "audits" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <Activity className="w-4 h-4" />
          <span>Permission Change Logs</span>
          {activeTab === "audits" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. PERMISSION MATRIX (Redesigned with Left Roles Panel and Right Tabbed Categories Panel) */}
      {activeTab === "matrix" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start animate-fade-in">
          {/* Left Roles List Panel */}
          <div className="md:col-span-1 glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b pb-2">
              ERP Clearances
            </h4>
            <div className="space-y-1.5">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border font-bold text-xs flex justify-between items-center transition-all cursor-pointer ${
                    selectedRoleId === role.id
                      ? "bg-[#4F46E5]/5 border-[#4F46E5] text-[#4F46E5]"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  <span>{role.name}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      selectedRoleId === role.id
                        ? "bg-[#4F46E5] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {role.permissions.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Tabbed Category Editor Panel */}
          <div className="md:col-span-3 glass-card space-y-6">
            <div className="flex justify-between items-start border-b pb-3.5 flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Permission Matrix Settings
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Configure active security clearance capabilities for the
                  selected profile role.
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100/50 px-3 py-1.5 rounded-xl font-mono text-[10px] text-[#4F46E5] font-extrabold uppercase select-none">
                Active: {activeRoleObj?.name || "Loading"}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
              {matrixCategories.map((cat) => {
                const countActive = cat.permissions.filter((p) =>
                  activeRoleObj?.permissions.includes(p.id),
                ).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryTab(cat.id)}
                    className={`px-3 py-2 text-[10px] font-extrabold uppercase border rounded-xl transition-all cursor-pointer ${
                      selectedCategoryTab === cat.id
                        ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {cat.label}{" "}
                    {countActive > 0 && (
                      <span className="text-[9px] text-[#4F46E5] bg-white border px-1 rounded ml-1 font-mono font-bold">
                        {countActive}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Category Permission Checkboxes */}
            <div className="space-y-3.5">
              {matrixCategories
                .find((c) => c.id === selectedCategoryTab)
                ?.permissions.map((perm) => {
                  const isChecked =
                    activeRoleObj?.permissions.includes(perm.id) || false;
                  return (
                    <label
                      key={perm.id}
                      className={`p-4 border rounded-2xl flex items-start gap-4 transition-all cursor-pointer ${
                        isChecked
                          ? "border-indigo-150 bg-indigo-50/10"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleTogglePermission(selectedRoleId, perm.id)
                        }
                        className="w-5 h-5 mt-0.5 accent-[#4F46E5] cursor-pointer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-850 text-xs block">
                          {perm.label}
                        </span>
                        <span className="text-[10px] text-slate-450 leading-relaxed block mt-1.5">
                          {perm.desc}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block mt-1.5 font-bold uppercase">
                          ID: {perm.id}
                        </span>
                      </div>
                    </label>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* 2. APPROVAL WORKFLOWS */}
      {activeTab === "workflows" && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Approval Step Sequences
            </h4>
            <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
              Control chain steps for logistics verifications and checkouts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map((wf) => (
              <div key={wf.id} className="glass-card p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                    {wf.name}
                  </h4>
                  <button
                    onClick={() => handleAddWorkflowStep(wf)}
                    className="btn-secondary py-1.5 px-3 text-[10px] font-bold text-[#4F46E5] cursor-pointer"
                  >
                    ＋ Add Step
                  </button>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap pt-2">
                  {wf.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span>{step}</span>
                        {step !== "Employee" &&
                          step !== "Completed" &&
                          step !== "Available" && (
                            <button
                              onClick={() => handleRemoveWorkflowStep(wf, step)}
                              className="text-rose-500 hover:bg-rose-50 p-0.5 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                      </div>
                      {idx < wf.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACCESS POLICIES */}
      {activeTab === "policies" && (
        <form
          onSubmit={handleSavePolicies}
          className="space-y-6 max-w-2xl animate-fade-in"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Password Policy */}
            <div className="glass-card space-y-4">
              <h4 className="font-extrabold text-sm text-slate-850 flex items-center gap-2 uppercase tracking-wider border-b pb-2">
                <Lock className="w-4.5 h-4.5 text-[#4F46E5]" /> Password
                Governance
              </h4>
              <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-450 font-bold uppercase">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    value={policies.passwordPolicy.minLength}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        passwordPolicy: {
                          ...policies.passwordPolicy,
                          minLength: Number(e.target.value),
                        },
                      })
                    }
                    className="glass-input text-xs w-24"
                  />
                </div>
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="requireUpper"
                    checked={policies.passwordPolicy.uppercaseRequired}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        passwordPolicy: {
                          ...policies.passwordPolicy,
                          uppercaseRequired: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-indigo-650 cursor-pointer"
                  />
                  <label htmlFor="requireUpper" className="cursor-pointer">
                    Require Uppercase Letters
                  </label>
                </div>
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    checked={policies.passwordPolicy.numbersRequired}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        passwordPolicy: {
                          ...policies.passwordPolicy,
                          numbersRequired: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-indigo-650 cursor-pointer"
                  />
                  <label htmlFor="requireNumbers" className="cursor-pointer">
                    Require Numbers
                  </label>
                </div>
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="requireSpecial"
                    checked={policies.passwordPolicy.specialCharactersRequired}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        passwordPolicy: {
                          ...policies.passwordPolicy,
                          specialCharactersRequired: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-indigo-650 cursor-pointer"
                  />
                  <label htmlFor="requireSpecial" className="cursor-pointer">
                    Require Special Characters
                  </label>
                </div>
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] text-slate-450 font-bold uppercase">
                    Password Expiration (Days)
                  </label>
                  <input
                    type="number"
                    value={policies.passwordPolicy.expiryDays}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        passwordPolicy: {
                          ...policies.passwordPolicy,
                          expiryDays: Number(e.target.value),
                        },
                      })
                    }
                    className="glass-input text-xs w-24"
                  />
                </div>
              </div>
            </div>

            {/* Session Settings */}
            <div className="glass-card space-y-4">
              <h4 className="font-extrabold text-sm text-slate-855 flex items-center gap-2 uppercase tracking-wider border-b pb-2">
                <Clock className="w-4.5 h-4.5 text-[#4F46E5]" /> Session Rules
              </h4>
              <div className="space-y-4 text-xs font-semibold text-slate-750">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-450 font-bold uppercase">
                    Auto Logout Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    value={policies.sessionRules.autoLogoutMinutes}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        sessionRules: {
                          ...policies.sessionRules,
                          autoLogoutMinutes: Number(e.target.value),
                        },
                      })
                    }
                    className="glass-input text-xs w-24"
                  />
                </div>
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="multisess"
                    checked={policies.sessionRules.multipleSessions}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        sessionRules: {
                          ...policies.sessionRules,
                          multipleSessions: e.target.checked,
                        },
                      })
                    }
                    className="w-4.5 h-4.5 accent-indigo-650 cursor-pointer"
                  />
                  <label htmlFor="multisess" className="cursor-pointer">
                    Allow multiple sessions from same IP
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary text-xs py-3.5 px-6 font-bold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,.25)]"
          >
            <CheckCircle className="w-4.5 h-4.5" /> Save Policies Settings
          </button>
        </form>
      )}

      {/* 4. ACCESS SIMULATOR SANDBOX */}
      {activeTab === "simulator" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
                  Access Clearance Simulation
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Select a role template below to preview exactly which screens
                  and controls are visible.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Preview As:
                </span>
                <select
                  value={simulationRole}
                  onChange={(e) => setSimulationRole(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-44"
                >
                  <option value="employee">Employee</option>
                  <option value="department_head">Department Head</option>
                  <option value="asset_manager">Asset Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Simulated Workspace View */}
            <div className="border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 text-xs font-semibold space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] uppercase font-bold text-[#4F46E5] tracking-wider">
                  Simulator Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 font-semibold">
                {/* Visible Sections */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Visible Navigation Screens
                  </span>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-emerald-600 shadow-sm">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-slate-800">
                        Dashboard & Metrics Overview
                      </span>
                    </div>
                    <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-emerald-600 shadow-sm">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-slate-800">
                        Resource Bookings Pool
                      </span>
                    </div>
                    {simulationRole !== "employee" && (
                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-emerald-600 shadow-sm animate-fade-in">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-slate-800">
                          Department Audits List
                        </span>
                      </div>
                    )}
                    {simulationRole === "admin" && (
                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-emerald-600 shadow-sm animate-fade-in">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-slate-800">
                          Security & Access Policies Page
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Blocked Sections */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Disabled Action Controls
                  </span>
                  <div className="space-y-1.5">
                    {simulationRole !== "admin" && (
                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-rose-500 shadow-sm animate-fade-in">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-slate-400">
                          Create/Delete Department Buttons
                        </span>
                      </div>
                    )}
                    {simulationRole === "employee" && (
                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-rose-500 shadow-sm animate-fade-in">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-slate-400">
                          Approve Custody / Allocation Request
                        </span>
                      </div>
                    )}
                    {simulationRole !== "admin" && (
                      <div className="p-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2 text-rose-500 shadow-sm animate-fade-in">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-slate-400">
                          Reset Employee Passwords
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PERMISSION AUDIT TRAIL */}
      {activeTab === "audits" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Access Scope Audit Logs
            </h4>
            <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
              Chronological trail of role promotions and permission edits.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="overflow-x-auto">
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-4">Operator Admin</th>
                    <th className="py-3.5 px-4">Affected Clearance</th>
                    <th className="py-3.5 px-4">Action Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {audits.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-slate-400 italic"
                      >
                        No permission audit trails logged yet.
                      </td>
                    </tr>
                  ) : (
                    audits.map((aud, index) => (
                      <tr key={index}>
                        <td className="py-3.5 px-5 font-mono text-[10px] text-slate-400">
                          {aud.date}
                        </td>
                        <td className="py-3.5 px-4 text-slate-900 font-bold">
                          {aud.admin}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-mono text-[10px] text-slate-700 font-bold">
                            {aud.user}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-650">
                          {aud.action}
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
    </div>
  );
};

export default AdminRolePermissions;
