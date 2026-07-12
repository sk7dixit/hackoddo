import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  ClipboardCheck,
  Plus,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  Clock,
  QrCode,
  Check,
  X,
  Pause,
  Wrench,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
} from "lucide-react";

interface Audit {
  id: string;
  name: string;
  code: string;
  scope: {
    type: string;
    departmentId?: string;
    locationId?: string;
    categoryId?: string;
    assetIds?: string[];
  };
  startDate: string;
  endDate: string;
  deadline: string;
  priority: string;
  auditors: string[];
  status:
    "scheduled" | "running" | "review" | "completed" | "archived" | "closed";
  progress: number;
  verifiedCount: number;
  pendingCount: number;
  missingCount: number;
  damagedCount: number;
  timeline: string[];
  assets: any[];
}

interface Discrepancy {
  id: string;
  auditId: string;
  assetId: string;
  issue: string;
  departmentId: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "open" | "investigating" | "resolved" | "escalated";
}

interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId?: string;
  status: string;
}

interface Department {
  id: string;
  name: string;
  headId?: string;
}

export const AdminAuditManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "cycles" | "execution" | "discrepancies" | "compliance"
  >("dashboard");

  // Master Data
  const [audits, setAudits] = useState<Audit[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Drawer & QR States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrScanInput, setQrScanInput] = useState("");

  // Form Fields
  const [auditName, setAuditName] = useState("");
  const [auditCode, setAuditCode] = useState("");
  const [scopeType, setScopeType] = useState("Department");
  const [scopeDept, setScopeDept] = useState("IT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedAuditors, setSelectedAuditors] = useState<string[]>([]);

  // Banners
  const [workloadWarning, setWorkloadWarning] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = async () => {
    try {
      const [auds, discs, emps, depts] = await Promise.all([
        api.get<Audit[]>("/admin/audits"),
        api.get<Discrepancy[]>("/admin/discrepancies"),
        api.get<Employee[]>("/employees"),
        api.get<Department[]>("/departments"),
      ]);
      setAudits(auds);
      setDiscrepancies(discs);
      setEmployees(emps.filter((e) => e.status === "active"));
      setDepartments(depts);
      if (auds.length > 0 && !selectedAudit) {
        const running = auds.find((a) => a.status === "running");
        setSelectedAudit(running || auds[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!scopeDept || selectedAuditors.length === 0) {
      setConflictWarning(null);
      setWorkloadWarning(null);
      return;
    }

    // Conflict of Interest
    if (scopeType === "Department") {
      const deptObj = departments.find((d) => d.id === scopeDept);
      if (deptObj && deptObj.headId) {
        const conflict = selectedAuditors.includes(deptObj.headId);
        if (conflict) {
          const headName =
            employees.find((e) => e.id === deptObj.headId)?.name || "Head";
          setConflictWarning(
            `Conflict Warning: ${headName} manages this department. Assigning them as auditor is a conflict of interest.`,
          );
        } else {
          setConflictWarning(null);
        }
      }
    } else {
      setConflictWarning(null);
    }

    // Workload limit check
    let workloadExceeded = false;
    for (const audId of selectedAuditors) {
      const runningCount = audits.filter(
        (a) => a.status === "running" && a.auditors.includes(audId),
      ).length;
      if (runningCount >= 2) {
        const name = employees.find((e) => e.id === audId)?.name || "Auditor";
        setWorkloadWarning(
          `Workload Limit: ${name} is already assigned to 2 running audits.`,
        );
        workloadExceeded = true;
        break;
      }
    }
    if (!workloadExceeded) setWorkloadWarning(null);
  }, [scopeDept, selectedAuditors, scopeType, departments, employees, audits]);

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictWarning) {
      toast.error(
        "Cannot create audit cycle: Conflict of interest warning unresolved.",
      );
      return;
    }
    if (workloadWarning) {
      toast.error("Cannot create audit cycle: Workload limit exceeded.");
      return;
    }
    try {
      const payload = {
        name: auditName,
        code: auditCode,
        scope: { type: scopeType, departmentId: scopeDept },
        startDate,
        endDate,
        deadline,
        priority,
        auditors: selectedAuditors,
      };
      await api.post("/admin/audits", payload);
      toast.success(`Audit cycle "${auditName}" scheduled successfully.`);
      setDrawerOpen(false);
      setAuditName("");
      setAuditCode("");
      setStartDate("");
      setEndDate("");
      setDeadline("");
      setSelectedAuditors([]);
      fetchData();
    } catch (e: any) {
      const errorMsg = e.response?.data?.error || "Validation failed.";
      toast.error(`Failed to create audit: ${errorMsg}`);
    }
  };

  const handleStatusTransition = async (
    auditId: string,
    nextStatus: "running" | "review" | "closed",
  ) => {
    try {
      await api.patch(`/admin/audits/${auditId}`, { status: nextStatus });
      toast.success(`Audit cycle status updated to ${nextStatus}.`);
      fetchData();
      if (selectedAudit && selectedAudit.id === auditId) {
        setSelectedAudit({ ...selectedAudit, status: nextStatus });
      }
    } catch (e: any) {
      const errorMsg = e.response?.data?.error || "Transition denied.";
      toast.error(errorMsg);
    }
  };

  const handleQRVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const assetId = qrScanInput.trim();
    if (!assetId || !selectedAudit) return;
    try {
      await api.patch(`/admin/audits/${selectedAudit.id}`, {
        assetVerification: {
          assetId,
          verificationStatus: "verified",
          notes: "Verified via QR Code Scan Mode",
        },
      });
      toast.success(`Asset ${assetId} scanned & verified successfully!`);
      setQrModalOpen(false);
      setQrScanInput("");
      fetchData();
    } catch (e: any) {
      toast.error("Failed to verify scanned asset.");
    }
  };

  const handleIndividualVerification = async (
    assetId: string,
    statusMark: "verified" | "missing" | "damaged",
  ) => {
    if (!selectedAudit) return;
    try {
      await api.patch(`/admin/audits/${selectedAudit.id}`, {
        assetVerification: {
          assetId,
          verificationStatus: statusMark,
          notes: `Verified as ${statusMark} during cycle`,
        },
      });
      toast.success(`Verified asset ${assetId} as ${statusMark}.`);
      fetchData();
    } catch (e) {
      toast.error("Failed to verify asset.");
    }
  };

  const handleUpdateDiscrepancy = async (
    discId: string,
    nextStatus: "investigating" | "resolved" | "escalated",
  ) => {
    try {
      await api.patch(`/admin/discrepancies/${discId}`, { status: nextStatus });
      toast.success(`Discrepancy marked as ${nextStatus}.`);
      fetchData();
    } catch (e) {
      toast.error("Failed to update discrepancy.");
    }
  };

  const filteredAudits = audits.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <span className="text-[#4F46E5]">Audit Management</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Audit Cycle Governance
            </h2>
            <p className="text-xs text-slate-455 font-semibold mt-1">
              Plan, schedule, assign auditors, track discrepancy remediation,
              and close organization-wide compliance cycles.
            </p>
          </div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 flex flex-col justify-between h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Audit Cycles
            </span>
            <h2 className="text-2xl font-black text-slate-850 mt-1 font-mono">
              {audits.length} Cycles
            </h2>
          </div>
          <div className="glass-card p-6 flex flex-col justify-between h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Running Audits
            </span>
            <h2 className="text-2xl font-black text-indigo-650 mt-1 font-mono">
              {audits.filter((a) => a.status === "running").length} Active
            </h2>
          </div>
          <div className="glass-card p-6 flex flex-col justify-between h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Compliance Score
            </span>
            <h2 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              96% Score
            </h2>
          </div>
          <div className="glass-card p-6 flex flex-col justify-between h-28">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Pending Reviews
            </span>
            <h2 className="text-2xl font-black text-amber-500 mt-1 font-mono">
              {audits.filter((a) => a.status === "review").length} Pending
            </h2>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "dashboard" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Audit Dashboard</span>
            {activeTab === "dashboard" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("cycles")}
            className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "cycles" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
          >
            <Clock className="w-4 h-4" />
            <span>Manage Cycles</span>
            {activeTab === "cycles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("execution")}
            className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "execution" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
          >
            <QrCode className="w-4 h-4" />
            <span>Execution Console</span>
            {activeTab === "execution" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("discrepancies")}
            className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "discrepancies" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Discrepancy Center</span>
            {activeTab === "discrepancies" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("compliance")}
            className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeTab === "compliance" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Compliance Rankings</span>
            {activeTab === "compliance" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
            )}
          </button>
        </div>

        {/* TAB PANELS */}

        {/* 1. DASHBOARD OVERVIEW & INSIGHTS */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs font-semibold">
            {/* Calendar View */}
            <div className="glass-card lg:col-span-2 space-y-4 bg-white border border-slate-200">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                  Audit Scheduling Calendar
                </h4>
                <span className="text-[10px] text-indigo-650 font-bold">
                  July 2026
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 mb-2 uppercase text-[9px] tracking-wider">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="grid grid-cols-7 gap-2.5">
                {Array.from({ length: 31 }).map((_, idx) => {
                  const day = idx + 1;
                  let bgColor = "bg-slate-50 text-slate-700";
                  if (day === 4)
                    bgColor =
                      "bg-emerald-50 text-emerald-600 border border-emerald-100";
                  if (day >= 10 && day <= 14)
                    bgColor =
                      "bg-[#4F46E5]/5 text-[#4F46E5] border border-[#4F46E5]/20";
                  if (day === 20)
                    bgColor =
                      "bg-amber-50 text-amber-600 border border-amber-100";
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl flex flex-col justify-between items-center font-mono ${bgColor}`}
                    >
                      <span>{day}</span>
                      {day === 10 && (
                        <span className="w-1 h-1 rounded-full bg-[#4F46E5] mt-1 animate-pulse" />
                      )}
                      {day === 20 && (
                        <span className="w-1 h-1 rounded-full bg-amber-500 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Insights Recommendations */}
            <div className="glass-card space-y-4">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Predictive Audit Recommendations
              </h4>
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5">
                <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-700 block text-xs">
                    IT Department Alert
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-normal">
                    IT assets have logged 3 missing reports. Recommend surprise
                    audit in Warehouse B.
                  </p>
                </div>
              </div>
              <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
                <Wrench className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-700 block text-xs">
                    Vehicle Category Warning
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-normal">
                    Damage records exceed 15% this quarter. Schedule preventive
                    checkups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE CYCLES */}
        {activeTab === "cycles" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input pl-9 text-xs w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => setDrawerOpen(true)}
                className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" /> Create Audit Cycle
              </button>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-5">Audit ID</th>
                    <th className="py-3 px-4">Cycle Name</th>
                    <th className="py-3 px-4">Scope</th>
                    <th className="py-3 px-4">Start</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.map((audit) => (
                    <tr key={audit.id}>
                      <td className="py-3.5 px-5 font-mono text-slate-400">
                        {audit.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            setSelectedAudit(audit);
                            setActiveTab("execution");
                          }}
                          className="font-extrabold text-slate-800 hover:text-[#4F46E5] hover:underline text-left block cursor-pointer"
                        >
                          {audit.name}
                        </button>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {audit.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px] text-slate-650">
                          {audit.scope?.type || "Global"}:{" "}
                          {audit.scope?.departmentId ||
                            audit.scope?.locationId ||
                            "HQ"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-slate-450">
                        {audit.startDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-slate-450">
                        {audit.deadline}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold capitalize ${
                            audit.status === "running"
                              ? "bg-indigo-50 text-[#4F46E5] border border-indigo-100"
                              : audit.status === "scheduled"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {audit.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold space-x-2">
                        {audit.status === "scheduled" && (
                          <button
                            onClick={() =>
                              handleStatusTransition(audit.id, "running")
                            }
                            className="text-[#4F46E5] hover:underline cursor-pointer"
                          >
                            Start
                          </button>
                        )}
                        {audit.status === "running" && (
                          <button
                            onClick={() =>
                              handleStatusTransition(audit.id, "review")
                            }
                            className="text-amber-500 hover:underline cursor-pointer"
                          >
                            Review
                          </button>
                        )}
                        {audit.status === "review" && (
                          <button
                            onClick={() =>
                              handleStatusTransition(audit.id, "closed")
                            }
                            className="text-emerald-600 hover:underline cursor-pointer"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAudit(audit);
                            setActiveTab("execution");
                          }}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. EXECUTION CONSOLE */}
        {activeTab === "execution" && selectedAudit && (
          <div className="space-y-6 animate-fade-in text-xs font-semibold text-slate-750">
            <div className="glass-card space-y-4">
              <div className="flex justify-between items-center gap-4 flex-wrap border-b pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
                    {selectedAudit.name} ({selectedAudit.code})
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Auditing: {selectedAudit.scope?.type || "Global"} -{" "}
                    {selectedAudit.scope?.departmentId || "HQ"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="btn-secondary py-2 px-4 flex items-center gap-1.5 font-bold text-slate-755 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-slate-500" /> Scanner Mode
                  </button>
                  {selectedAudit.status === "running" && (
                    <button
                      onClick={() =>
                        handleStatusTransition(selectedAudit.id, "review")
                      }
                      className="btn-secondary py-2 px-4 flex items-center gap-1 text-amber-500 font-bold cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause Cycle
                    </button>
                  )}
                  {selectedAudit.status === "review" && (
                    <button
                      onClick={() =>
                        handleStatusTransition(selectedAudit.id, "closed")
                      }
                      className="btn-primary py-2 px-4 flex items-center gap-1.5 text-white font-bold cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" /> Close Cycle
                    </button>
                  )}
                </div>
              </div>

              {/* Metrics cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 border rounded-xl font-mono text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Verified
                  </span>
                  <span className="text-lg font-black text-emerald-600 block mt-0.5">
                    {selectedAudit.verifiedCount} items
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl font-mono text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Pending
                  </span>
                  <span className="text-lg font-black text-slate-500 block mt-0.5">
                    {selectedAudit.pendingCount} items
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl font-mono text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Missing
                  </span>
                  <span className="text-lg font-black text-rose-500 block mt-0.5">
                    {selectedAudit.missingCount} items
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl font-mono text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">
                    Damaged
                  </span>
                  <span className="text-lg font-black text-amber-500 block mt-0.5">
                    {selectedAudit.damagedCount} items
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Cycle Progress</span>
                  <span>{selectedAudit.progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border">
                  <div
                    style={{ width: `${selectedAudit.progress}%` }}
                    className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Items List */}
            <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="p-5 border-b flex justify-between items-center bg-[#FAFBFC]">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Asset Verification Actions
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Pending list
                </span>
              </div>
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th className="py-2.5 px-4">Asset ID</th>
                    <th className="py-2.5 px-4">Specification</th>
                    <th className="py-2.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      AF-0089
                    </td>
                    <td className="py-3 px-4">
                      Dell Latitude 5420 Workstation
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() =>
                          handleIndividualVerification("AF-0089", "verified")
                        }
                        className="text-emerald-600 hover:underline font-bold cursor-pointer"
                      >
                        ✓ Verified
                      </button>
                      <button
                        onClick={() =>
                          handleIndividualVerification("AF-0089", "damaged")
                        }
                        className="text-amber-500 hover:underline font-bold cursor-pointer"
                      >
                        ⚠ Damaged
                      </button>
                      <button
                        onClick={() =>
                          handleIndividualVerification("AF-0089", "missing")
                        }
                        className="text-rose-500 hover:underline font-bold cursor-pointer"
                      >
                        ❌ Missing
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      AF-0112
                    </td>
                    <td className="py-3 px-4">Apple iPad Air Test Device</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() =>
                          handleIndividualVerification("AF-0112", "verified")
                        }
                        className="text-emerald-600 hover:underline font-bold cursor-pointer"
                      >
                        ✓ Verified
                      </button>
                      <button
                        onClick={() =>
                          handleIndividualVerification("AF-0112", "damaged")
                        }
                        className="text-amber-500 hover:underline font-bold cursor-pointer"
                      >
                        ⚠ Damaged
                      </button>
                      <button
                        onClick={() =>
                          handleIndividualVerification("AF-0112", "missing")
                        }
                        className="text-rose-500 hover:underline font-bold cursor-pointer"
                      >
                        ❌ Missing
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. DISCREPANCY CENTER */}
        {activeTab === "discrepancies" && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Discrepancy Remediation Center
              </h4>
              <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                Assign investigations, resolve issues, or escalate cases.
              </p>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-5">Asset</th>
                    <th className="py-3 px-4">Issue Details</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {discrepancies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-slate-400 italic"
                      >
                        No discrepancies currently logged.
                      </td>
                    </tr>
                  ) : (
                    discrepancies.map((disc) => (
                      <tr key={disc.id}>
                        <td className="py-3.5 px-5 font-bold text-slate-850">
                          {disc.assetId}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {disc.issue}
                        </td>
                        <td className="py-3.5 px-4">{disc.departmentId}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase font-black ${
                              disc.severity === "Critical"
                                ? "bg-rose-50 text-rose-700 border border-rose-100"
                                : disc.severity === "High"
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-indigo-50 text-indigo-750 border border-indigo-100"
                            }`}
                          >
                            {disc.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold capitalize">
                          {disc.status}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold space-x-2">
                          {disc.status === "open" && (
                            <button
                              onClick={() =>
                                handleUpdateDiscrepancy(
                                  disc.id,
                                  "investigating",
                                )
                              }
                              className="text-[#4F46E5] hover:underline cursor-pointer"
                            >
                              Investigate
                            </button>
                          )}
                          {disc.status === "investigating" && (
                            <button
                              onClick={() =>
                                handleUpdateDiscrepancy(disc.id, "resolved")
                              }
                              className="text-emerald-600 hover:underline cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                          {disc.status !== "resolved" && (
                            <button
                              onClick={() =>
                                handleUpdateDiscrepancy(disc.id, "escalated")
                              }
                              className="text-rose-500 hover:underline cursor-pointer"
                            >
                              Escalate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. COMPLIANCE & RANKINGS */}
        {activeTab === "compliance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs font-semibold text-slate-750">
            <div className="glass-card lg:col-span-2 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Department Compliance Scoreboard
              </h4>
              <div className="space-y-4 pt-2">
                {[
                  { name: "IT Department", score: 98, color: "bg-emerald-500" },
                  { name: "HR Department", score: 97, color: "bg-emerald-500" },
                  {
                    name: "Finance & Analytics",
                    score: 92,
                    color: "bg-indigo-500",
                  },
                  {
                    name: "Operations Logistics",
                    score: 90,
                    color: "bg-amber-500",
                  },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-extrabold">
                      <span>{d.name}</span>
                      <span className="text-slate-900">{d.score}% Score</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${d.color} rounded-full`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card space-y-4">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider border-b pb-2">
                Generate Compliance Reports
              </h4>
              <div className="space-y-2.5">
                <button
                  onClick={() => toast.success("Report queued.")}
                  className="w-full text-left p-3.5 hover:bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <span>Executive Summary Ledger</span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => toast.success("Report queued.")}
                  className="w-full text-left p-3.5 hover:bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <span>Discrepancy Remediation Logs</span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => toast.success("Report queued.")}
                  className="w-full text-left p-3.5 hover:bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <span>Asset Lifecycle Compliance</span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE AUDIT CYCLE DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-[450px] bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-left text-xs font-semibold text-slate-750">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                    Create Audit Cycle
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Schedule organization inventory checks.
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warnings Banner */}
              {conflictWarning && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 text-rose-600 leading-normal animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{conflictWarning}</span>
                </div>
              )}
              {workloadWarning && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2 text-amber-600 leading-normal animate-pulse">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{workloadWarning}</span>
                </div>
              )}

              <form onSubmit={handleCreateAudit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Audit Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={auditName}
                    onChange={(e) => setAuditName(e.target.value)}
                    placeholder="e.g. Q3 IT Hardware Audit"
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Audit Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={auditCode}
                    onChange={(e) => setAuditCode(e.target.value)}
                    placeholder="e.g. AUD-IT-Q3"
                    className="glass-input text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Department Scope
                  </label>
                  <select
                    value={scopeDept}
                    onChange={(e) => setScopeDept(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="glass-input text-xs"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Audit Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Assign Auditor
                  </label>
                  <div className="border rounded-xl p-3 max-h-32 overflow-y-auto space-y-2 bg-slate-50/50">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          id={`auditor-${emp.id}`}
                          checked={selectedAuditors.includes(emp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAuditors([
                                ...selectedAuditors,
                                emp.id,
                              ]);
                            } else {
                              setSelectedAuditors(
                                selectedAuditors.filter((id) => id !== emp.id),
                              );
                            }
                          }}
                          className="w-4 h-4 accent-[#4F46E5] cursor-pointer"
                        />
                        <label
                          htmlFor={`auditor-${emp.id}`}
                          className="text-xs cursor-pointer"
                        >
                          {emp.name} ({emp.role})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="btn-secondary py-2.5 flex-1 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 flex-1 font-bold cursor-pointer"
                  >
                    Schedule Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MOCK QR SCANNED MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="w-[380px] bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-up text-xs font-semibold text-slate-700">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
                Simulate QR Scanner
              </h4>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Scan hardware assets by entering their Asset ID code below (e.g.
              `AF-0089` or `AF-0112`).
            </p>
            <form onSubmit={handleQRVerify} className="space-y-3">
              <input
                type="text"
                required
                value={qrScanInput}
                onChange={(e) => setQrScanInput(e.target.value)}
                placeholder="Enter Asset ID code..."
                className="glass-input text-xs text-center font-mono font-bold tracking-wider"
              />
              <button
                type="submit"
                className="w-full btn-primary py-2.5 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,.25)]"
              >
                <CheckCircle2 className="w-4 h-4" /> Simulate Scan Success
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditManagement;
