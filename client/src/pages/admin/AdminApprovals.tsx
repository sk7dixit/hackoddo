import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  FileCheck2,
  RefreshCw,
  Search,
  Check,
  X,
  ChevronRight,
  ArrowRight,
  Building,
  User,
  Wrench,
  Inbox,
  AlertCircle,
} from "lucide-react";

interface TransferRequest {
  id: string;
  assetId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  reason: string;
  status: string;
  date: string;
}

interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName?: string;
  reportedBy: string;
  priority: string;
  problemDescription: string;
  status: string;
  createdAt: string;
}

interface ReturnRequest {
  id: string;
  assetId: string;
  employeeId: string;
  reason: string;
  status: string;
  date: string;
}

export const AdminApprovals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "transfers" | "maintenance" | "returns"
  >("transfers");

  // Data queues
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transfersData, maintenanceData, returnsData] = await Promise.all([
        api.get<TransferRequest[]>("/transfers"),
        api.get<MaintenanceRequest[]>("/maintenance"),
        api.get<ReturnRequest[]>("/returns"),
      ]);
      setTransfers(transfersData || []);
      setMaintenance(maintenanceData || []);
      setReturns(returnsData || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load approval queues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ACTIONS ---
  const handleTransferAction = async (
    id: string,
    action: "approved" | "rejected",
  ) => {
    try {
      await api.patch(`/transfers/${id}`, { status: action });
      toast.success(`Transfer request ${action} successfully.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to process transfer request.");
    }
  };

  const handleMaintenanceAction = async (
    id: string,
    action: "approve" | "reject",
  ) => {
    try {
      await api.patch(`/maintenance/${id}/${action}`, {});
      toast.success(
        `Maintenance request ${action === "approve" ? "approved" : "rejected"} successfully.`,
      );
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to process maintenance request.");
    }
  };

  const handleReturnAction = async (
    id: string,
    action: "approved" | "rejected",
  ) => {
    try {
      await api.patch(`/returns/${id}`, {
        status: action,
        verifiedCondition: "Good",
        notes: "Admin Direct Action",
      });
      toast.success(`Return request ${action} successfully.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to process return request.");
    }
  };

  // --- PENDING FILTERED QUEUES ---
  const pendingTransfers = transfers
    .filter(
      (t) =>
        t.status.toLowerCase() === "requested" ||
        t.status.toLowerCase() === "pending",
    )
    .filter(
      (t) =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.fromEmployeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.toEmployeeId.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const pendingMaintenance = maintenance
    .filter((m) => m.status.toLowerCase() === "pending")
    .filter(
      (m) =>
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const pendingReturns = returns
    .filter(
      (r) =>
        r.status.toLowerCase() === "requested" ||
        r.status.toLowerCase() === "pending",
    )
    .filter(
      (r) =>
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Approvals Inbox</span>
        </div>
        <div className="pt-2 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Workflow Approvals Inbox
            </h2>
            <p className="text-xs text-slate-455 font-semibold mt-1">
              Process all organization asset custody transfers, maintenance
              dispatch tickets, and return requests in one place.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-white border border-[#E7ECF3] hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveTab("transfers")}
          className={`glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28 cursor-pointer border ${
            activeTab === "transfers"
              ? "border-[#4F46E5] bg-[#EEF2FF]/20"
              : "border-slate-200 bg-white"
          }`}
        >
          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
            Pending Transfers
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
            {pendingTransfers.length} Requests
          </h2>
          <div className="w-1.5 h-12 rounded bg-[#4F46E5] absolute right-4 top-8" />
        </div>

        <div
          onClick={() => setActiveTab("maintenance")}
          className={`glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28 cursor-pointer border ${
            activeTab === "maintenance"
              ? "border-[#4F46E5] bg-[#EEF2FF]/20"
              : "border-slate-200 bg-white"
          }`}
        >
          <span className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">
            Pending Repairs
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
            {pendingMaintenance.length} Tickets
          </h2>
          <div className="w-1.5 h-12 rounded bg-amber-500 absolute right-4 top-8" />
        </div>

        <div
          onClick={() => setActiveTab("returns")}
          className={`glass-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all h-28 cursor-pointer border ${
            activeTab === "returns"
              ? "border-[#4F46E5] bg-[#EEF2FF]/20"
              : "border-slate-200 bg-white"
          }`}
        >
          <span className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">
            Pending Returns
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-1 font-mono">
            {pendingReturns.length} Requests
          </h2>
          <div className="w-1.5 h-12 rounded bg-emerald-500 absolute right-4 top-8" />
        </div>
      </div>

      {/* Tabs list Navigation */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveTab("transfers")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${
            activeTab === "transfers"
              ? "text-[#4F46E5] font-black"
              : "hover:text-slate-700"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Custody Transfers ({pendingTransfers.length})</span>
          {activeTab === "transfers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("maintenance")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${
            activeTab === "maintenance"
              ? "text-[#4F46E5] font-black"
              : "hover:text-slate-700"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Dispatch ({pendingMaintenance.length})</span>
          {activeTab === "maintenance" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("returns")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${
            activeTab === "returns"
              ? "text-[#4F46E5] font-black"
              : "hover:text-slate-700"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Asset Returns ({pendingReturns.length})</span>
          {activeTab === "returns" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Request ID, Asset ID or Custodian..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input pl-9 text-xs w-full"
        />
      </div>

      {/* QUEUE TABLES */}
      <div className="overflow-hidden border border-slate-200 rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        {/* TRANSFERS QUEUE */}
        {activeTab === "transfers" && (
          <div className="overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-3 px-5">Transfer ID</th>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Transfer From</th>
                  <th className="py-3 px-4">Transfer To</th>
                  <th className="py-3 px-4">Transfer Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {pendingTransfers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Inbox className="w-8 h-8 text-slate-300" />
                        <span>
                          No pending custody transfer requests in queue.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingTransfers.map((trf) => (
                    <tr key={trf.id}>
                      <td className="py-4 px-5 font-mono text-[10.5px] text-[#4F46E5] font-bold">
                        {trf.id}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {trf.assetId}
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {trf.fromEmployeeId}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1.5 text-indigo-650 font-bold">
                          <ArrowRight className="w-3.5 h-3.5" />
                          {trf.toEmployeeId}
                        </span>
                      </td>
                      <td
                        className="py-4 px-4 truncate max-w-[200px]"
                        title={trf.reason}
                      >
                        {trf.reason || "No transfer reason specified"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleTransferAction(trf.id, "rejected")
                            }
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleTransferAction(trf.id, "approved")
                            }
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all border border-transparent hover:border-emerald-100 cursor-pointer"
                            title="Approve Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MAINTENANCE QUEUE */}
        {activeTab === "maintenance" && (
          <div className="overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-3 px-5">Ticket ID</th>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {pendingMaintenance.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Wrench className="w-8 h-8 text-slate-300" />
                        <span>No pending maintenance requests in queue.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingMaintenance.map((m) => (
                    <tr key={m.id}>
                      <td className="py-4 px-5 font-mono text-[10.5px] text-[#4F46E5] font-bold">
                        {m.id}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {m.assetId}
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {m.reportedBy}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.priority.toLowerCase() === "critical" ||
                            m.priority.toLowerCase() === "high"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {m.priority}
                        </span>
                      </td>
                      <td
                        className="py-4 px-4 truncate max-w-[200px]"
                        title={m.problemDescription}
                      >
                        {m.problemDescription}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleMaintenanceAction(m.id, "reject")
                            }
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Reject Ticket"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleMaintenanceAction(m.id, "approve")
                            }
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all border border-transparent hover:border-emerald-100 cursor-pointer"
                            title="Approve Ticket"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* RETURNS QUEUE */}
        {activeTab === "returns" && (
          <div className="overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th className="py-3 px-5">Return ID</th>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Custodian</th>
                  <th className="py-3 px-4">Return Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {pendingReturns.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileCheck2 className="w-8 h-8 text-slate-300" />
                        <span>No pending return requests in queue.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingReturns.map((r) => (
                    <tr key={r.id}>
                      <td className="py-4 px-5 font-mono text-[10.5px] text-[#4F46E5] font-bold">
                        {r.id}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {r.assetId}
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {r.employeeId}
                        </span>
                      </td>
                      <td
                        className="py-4 px-4 truncate max-w-[200px]"
                        title={r.reason}
                      >
                        {r.reason || "No return reason specified"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleReturnAction(r.id, "rejected")}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Reject Return"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReturnAction(r.id, "approved")}
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all border border-transparent hover:border-emerald-100 cursor-pointer"
                            title="Approve Return"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
