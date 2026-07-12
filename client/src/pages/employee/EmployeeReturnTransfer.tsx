import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  RotateCcw,
  RefreshCw,
  Plus,
  Search,
  Filter,
  X,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Clock,
  Download,
  ChevronRight,
  Send,
  Building,
  CheckCircle,
  Trash2,
  Info,
  Check
} from "lucide-react";

export const EmployeeReturnTransfer: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "return" | "transfer" | "history">("dashboard");

  // Loaded Data
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeReturns, setActiveReturns] = useState<any[]>([]);
  const [activeTransfers, setActiveTransfers] = useState<any[]>([]);
  const [historyRequests, setHistoryRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Return wizard state
  const [retAssetId, setRetAssetId] = useState("");
  const [retReason, setRetReason] = useState("Project Completed");
  const [retCondition, setRetCondition] = useState("Good");
  const [retComments, setRetComments] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Transfer wizard state
  const [trfAssetId, setTrfAssetId] = useState("");
  const [trfTargetType, setTrfTargetType] = useState<"employee" | "department">("employee");
  const [trfTargetEmployeeId, setTrfTargetEmployeeId] = useState("");
  const [trfTargetDeptId, setTrfTargetDeptId] = useState("IT");
  const [trfReason, setTrfReason] = useState("Project Requirement");
  const [trfComments, setTrfComments] = useState("");
  const [submittingTransfer, setSubmittingTransfer] = useState(false);

  // Detail Drawer state
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsRes, empRes, returnsRes, transfersRes, historyRes] = await Promise.all([
        api.get("/employee/assets?limit=100"),
        api.get("/employees"),
        api.get("/employee/returns"),
        api.get("/employee/transfers"),
        api.get("/employee/requests/history"),
      ]);

      setAssets(assetsRes.assets || []);
      setEmployees(empRes.value || empRes || []);
      setActiveReturns(returnsRes || []);
      setActiveTransfers(transfersRes || []);
      setHistoryRequests(historyRes || []);
    } catch (err: any) {
      console.error("Error loading return/transfer data:", err);
      toast.error("Failed to load request records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit return
  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retAssetId) {
      toast.error("Please select an asset to return.");
      return;
    }

    setSubmittingReturn(true);
    try {
      await api.post("/employee/returns", {
        assetId: retAssetId,
        reason: retReason,
        condition: retCondition,
        comments: retComments,
      });
      toast.success("Return request raised successfully!");
      setRetAssetId("");
      setRetComments("");
      setActiveTab("dashboard");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit return request.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Submit transfer
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trfAssetId) {
      toast.error("Please select an asset to transfer.");
      return;
    }
    if (trfTargetType === "employee" && !trfTargetEmployeeId) {
      toast.error("Please select a target employee.");
      return;
    }

    setSubmittingTransfer(true);
    try {
      await api.post("/employee/transfers", {
        assetId: trfAssetId,
        targetType: trfTargetType,
        targetEmployeeId: trfTargetType === "employee" ? trfTargetEmployeeId : undefined,
        targetDepartmentId: trfTargetType === "department" ? trfTargetDeptId : undefined,
        reason: trfReason,
        comments: trfComments,
      });
      toast.success("Transfer request raised successfully!");
      setTrfAssetId("");
      setTrfTargetEmployeeId("");
      setTrfComments("");
      setActiveTab("dashboard");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit transfer request.");
    } finally {
      setSubmittingTransfer(false);
    }
  };

  // Cancel Request
  const handleCancelRequest = async (type: "Return" | "Transfer", id: string) => {
    if (!window.confirm(`Are you sure you want to cancel this pending ${type} request?`)) return;

    try {
      if (type === "Return") {
        await api.delete(`/employee/returns/${id}`);
      } else {
        await api.delete(`/employee/transfers/${id}`);
      }
      toast.success(`${type} request canceled successfully.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel request.");
    }
  };

  // Open Details Drawer
  const handleOpenDetails = (req: any, type: "Return" | "Transfer") => {
    setSelectedReq({ ...req, requestType: type });
  };

  // Stats calculation
  const pendingReturns = activeReturns.length;
  const pendingTransfers = activeTransfers.length;
  const approvedCount = historyRequests.filter(h => h.status === "approved" || h.status === "completed").length;
  const rejectedCount = historyRequests.filter(h => h.status === "rejected").length;

  return (
    <div className="p-8 space-y-6">
      
      {/* Header Navigation */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link to="/employee" className="hover:text-[#4F46E5] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4F46E5]">Returns & Transfers Console</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Asset return & transfer
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Initiate offboarding returns, register peer transfers, and monitor manager authorization stages.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dashboard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "return" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Request Return
          </button>
          <button
            onClick={() => setActiveTab("transfer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "transfer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Request Transfer
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "history" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            History Logs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
          <span>Syncing request ledger today...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Pending Returns</span>
                    <h3 className="text-2xl font-black text-amber-500 mt-1 font-mono">{pendingReturns}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Clock className="w-5 h-5" /></div>
                </div>

                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Pending Transfers</span>
                    <h3 className="text-2xl font-black text-indigo-500 mt-1 font-mono">{pendingTransfers}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><Send className="w-5 h-5" /></div>
                </div>

                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Approved</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">{approvedCount}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
                </div>

                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Rejected</span>
                    <h3 className="text-2xl font-black text-rose-600 mt-1 font-mono">{rejectedCount}</h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
                </div>
              </div>

              {/* Active Requests List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Returns */}
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Pending Offboarding Returns
                    </h3>
                  </div>

                  {activeReturns.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 font-semibold italic">
                      No pending return requests.
                    </div>
                  ) : (
                    <div className="space-y-4.5">
                      {activeReturns.map((ret) => (
                        <div
                          key={ret.id}
                          className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9.5px] font-mono text-indigo-650 font-bold uppercase block">
                                Ticket ID: {ret.id}
                              </span>
                              <h4 className="font-bold text-xs text-slate-850 mt-1">
                                Asset ID: {ret.assetId}
                              </h4>
                            </div>
                            <button
                              onClick={() => handleCancelRequest("Return", ret.id)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Cancel Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-[10.5px] text-slate-500 mt-2 font-semibold">
                            Reason: <span className="text-slate-800">{ret.reason}</span>
                          </div>

                          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-450 uppercase flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> status: {ret.status}
                            </span>
                            <button
                              onClick={() => handleOpenDetails(ret, "Return")}
                              className="text-[#4F46E5] hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Transfers */}
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Pending Peer Transfers
                    </h3>
                  </div>

                  {activeTransfers.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 font-semibold italic">
                      No pending peer transfer requests.
                    </div>
                  ) : (
                    <div className="space-y-4.5">
                      {activeTransfers.map((trf) => (
                        <div
                          key={trf.id}
                          className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9.5px] font-mono text-indigo-650 font-bold uppercase block">
                                Ticket ID: {trf.id}
                              </span>
                              <h4 className="font-bold text-xs text-slate-850 mt-1">
                                Asset ID: {trf.assetId}
                              </h4>
                            </div>
                            <button
                              onClick={() => handleCancelRequest("Transfer", trf.id)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Cancel Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-[10.5px] text-slate-500 mt-2 font-semibold">
                            Recipient: <span className="text-slate-800 uppercase font-bold">{trf.toEmployeeId}</span>
                          </div>

                          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-450 uppercase flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> status: {trf.status}
                            </span>
                            <button
                              onClick={() => handleOpenDetails(trf, "Transfer")}
                              className="text-[#4F46E5] hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Request Return Form */}
          {activeTab === "return" && (
            <div className="max-w-md mx-auto bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-4 flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-850 uppercase tracking-wider">
                  Request Return Form
                </h3>
              </div>

              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Select Asset to Return
                  </label>
                  <select
                    required
                    value={retAssetId}
                    onChange={(e) => setRetAssetId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="">-- Choose Asset --</option>
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.id}] {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Reason for Return
                  </label>
                  <select
                    value={retReason}
                    onChange={(e) => setRetReason(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="Project Completed">Project Completed</option>
                    <option value="Role Change">Role Change</option>
                    <option value="Resignation">Resignation</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Upgrade">Upgrade</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Asset Condition Pre-Evaluation
                  </label>
                  <select
                    value={retCondition}
                    onChange={(e) => setRetCondition(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Minor Damage">Minor Damage</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Needs Inspection">Needs Inspection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Supporting Comments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide condition details or comments..."
                    value={retComments}
                    onChange={(e) => setRetComments(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="btn-primary w-full py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  {submittingReturn ? "Submitting..." : "Submit Return Request"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Request Transfer Form */}
          {activeTab === "transfer" && (
            <div className="max-w-md mx-auto bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <h3 className="font-black text-sm text-slate-850 uppercase tracking-wider">
                  Request Peer Transfer Form
                </h3>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Select Asset to Transfer
                  </label>
                  <select
                    required
                    value={trfAssetId}
                    onChange={(e) => setTrfAssetId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="">-- Choose Asset --</option>
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.id}] {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Transfer Destination Type
                  </label>
                  <div className="flex gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => setTrfTargetType("employee")}
                      className={`flex-1 py-2 border rounded-xl font-bold text-xs cursor-pointer ${
                        trfTargetType === "employee"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      Employee Peer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrfTargetType("department")}
                      className={`flex-1 py-2 border rounded-xl font-bold text-xs cursor-pointer ${
                        trfTargetType === "department"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      Department Pool
                    </button>
                  </div>
                </div>

                {trfTargetType === "employee" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Target Employee Recipient
                    </label>
                    <select
                      required
                      value={trfTargetEmployeeId}
                      onChange={(e) => setTrfTargetEmployeeId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                    >
                      <option value="">-- Select Recipient --</option>
                      {employees
                        .filter((emp) => emp.employeeId !== "EMP-1001" && emp.name)
                        .map((emp) => (
                          <option key={emp.id} value={emp.name}>
                            {emp.name} ({emp.employeeId || "N/A"})
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Target Department Pool
                    </label>
                    <select
                      value={trfTargetDeptId}
                      onChange={(e) => setTrfTargetDeptId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                    >
                      <option value="IT">IT Department</option>
                      <option value="HR">HR Department</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Reason for Transfer
                  </label>
                  <select
                    value={trfReason}
                    onChange={(e) => setTrfReason(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="Project Requirement">Project Requirement</option>
                    <option value="Department Change">Department Change</option>
                    <option value="Temporary Assignment">Temporary Assignment</option>
                    <option value="Equipment Sharing">Equipment Sharing</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Additional Comments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional details..."
                    value={trfComments}
                    onChange={(e) => setTrfComments(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingTransfer}
                  className="btn-primary w-full py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  {submittingTransfer ? "Submitting..." : "Submit Transfer Request"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Consolidated History Logs */}
          {activeTab === "history" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b pb-3.5">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Consolidated History logs
                </h3>
              </div>

              {historyRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                  No historical resolved returns or peer transfers.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold text-slate-500">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Asset ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4">Request Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historyRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-700">{req.id}</td>
                          <td className="p-4 font-mono text-slate-500">{req.assetId}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 border text-[9.5px] rounded-md font-extrabold uppercase tracking-wide ${
                              req.type === "Return" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-purple-50 text-purple-600 border-purple-100"
                            }`}>
                              {req.type}
                            </span>
                          </td>
                          <td className="p-4 truncate max-w-xs">{req.reason}</td>
                          <td className="p-4 font-mono">{req.date ? req.date.split("T")[0] : "N/A"}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                              req.status === "approved" || req.status === "completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Details Drawer */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/40 z-[90] backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedReq(null)} />

          <div className="w-full max-w-md bg-white h-full relative z-[100] shadow-2xl flex flex-col animate-slide-left border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-none">
                    {selectedReq.requestType} Request Details
                  </h3>
                  <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase mt-1.5 block">
                    ID: {selectedReq.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
                <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide">
                  Specifications
                </h4>
                <div className="space-y-2 text-xs font-semibold text-slate-650">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-400 uppercase text-[9.5px]">Asset ID</span>
                    <span className="text-slate-800 font-mono">{selectedReq.assetId}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-400 uppercase text-[9.5px]">Filing Date</span>
                    <span className="text-slate-800 font-mono">{selectedReq.date ? selectedReq.date.split("T")[0] : "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-400 uppercase text-[9.5px]">Reason</span>
                    <span className="text-slate-800">{selectedReq.reason}</span>
                  </div>
                  {selectedReq.requestType === "Return" ? (
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-400 uppercase text-[9.5px]">Condition</span>
                      <span className="text-slate-800">{selectedReq.reportedCondition}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-400 uppercase text-[9.5px]">Recipient</span>
                      <span className="text-slate-800 uppercase font-bold">{selectedReq.toEmployeeId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase text-[9.5px]">Current status</span>
                    <span className="text-[#4F46E5] uppercase tracking-wider font-extrabold">{selectedReq.status}</span>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                  Employee Remarks & Comments
                </span>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-semibold text-slate-650 leading-relaxed font-sans min-h-[50px]">
                  {selectedReq.comments || "No comments provided."}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                  Authorization Stages
                </span>
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
                  <div className="relative flex justify-between items-start text-xs font-semibold text-slate-800">
                    <div className="absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] border-[#4F46E5] bg-[#4F46E5] z-10" />
                    <div>
                      <span className="block font-bold">Request Submitted</span>
                      <span className="text-[9px] uppercase font-extrabold text-slate-400">Step 1</span>
                    </div>
                  </div>
                  <div className="relative flex justify-between items-start text-xs font-semibold text-slate-400">
                    <div className="absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] border-slate-200 bg-white z-10" />
                    <div>
                      <span className="block font-bold">Department Head Recommendation</span>
                      <span className="text-[9px] uppercase font-extrabold text-slate-400">Step 2 (Pending)</span>
                    </div>
                  </div>
                  <div className="relative flex justify-between items-start text-xs font-semibold text-slate-400">
                    <div className="absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] border-slate-200 bg-white z-10" />
                    <div>
                      <span className="block font-bold">Asset Manager Verification</span>
                      <span className="text-[9px] uppercase font-extrabold text-slate-400">Step 3 (Pending)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="btn-secondary py-2.5 px-6 font-bold text-xs cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeReturnTransfer;
