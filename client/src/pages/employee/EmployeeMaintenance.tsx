import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Clock,
  Printer,
  Download,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Award,
  ShieldCheck,
  Building,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  Info,
  Check,
  UploadCloud
} from "lucide-react";

export const EmployeeMaintenance: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "raise" | "history">("dashboard");

  // Loaded Data States
  const [assets, setAssets] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [historyRequests, setHistoryRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Raised Form wizard states
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Request Details drawer
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [reqTimeline, setReqTimeline] = useState<any[]>([]);
  const [technician, setTechnician] = useState<any | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Fetch initial lists
  const fetchMaintenanceData = async () => {
    setLoading(true);
    try {
      const [assetsRes, activeRes, histRes] = await Promise.all([
        api.get("/employee/assets?limit=100"),
        api.get("/employee/maintenance"),
        api.get("/employee/maintenance/history"),
      ]);
      setAssets(assetsRes.assets || []);
      setActiveRequests(activeRes || []);
      setHistoryRequests(histRes || []);
    } catch (err: any) {
      console.error("Error loading maintenance modules:", err);
      toast.error("Failed to load workspace maintenance tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  // Handle Mock File upload
  const handleMockUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const res = await api.post("/employee/maintenance/upload", { fileName: file.name });
      setAttachments((prev) => [...prev, res]);
      toast.success("Attachment upload succeeded: " + file.name);
    } catch (err) {
      toast.error("Failed to upload mock file.");
    } finally {
      setUploading(false);
    }
  };

  // Submit request
  const handleSubmitRequest = async () => {
    if (!selectedAssetId) {
      toast.error("Please select an asset to continue.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a description of the issue.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/employee/maintenance", {
        assetId: selectedAssetId,
        issueCategory: category,
        priority,
        description,
        attachments,
      });
      toast.success("Maintenance request raised successfully!");
      
      // Reset Wizard Form
      setSelectedAssetId("");
      setCategory("Hardware");
      setPriority("Medium");
      setDescription("");
      setAttachments([]);
      setWizardStep(1);
      
      // Return to dashboard
      setActiveTab("dashboard");
      fetchMaintenanceData();
    } catch (err: any) {
      toast.error(err.message || "Failed to raise maintenance request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open detail drawer
  const handleOpenDetails = async (reqId: string) => {
    setSelectedReq({ id: reqId }); // placeholder to open drawer
    setDrawerLoading(true);
    try {
      const res = await api.get(`/employee/maintenance/${reqId}`);
      setSelectedReq(res.request);
      setReqTimeline(res.timeline || []);
      setTechnician(res.technician || null);
    } catch (err) {
      console.error("Error loading ticket detail:", err);
      toast.error("Failed to fetch detailed maintenance status.");
      setSelectedReq(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  // KPI calculations
  const openCount = activeRequests.filter(r => r.status === "pending" || r.status === "approved").length;
  const progressCount = activeRequests.filter(r => r.status === "assigned" || r.status === "in_progress").length;
  const resolvedCount = historyRequests.filter(r => r.status === "resolved").length;
  const rejectedCount = historyRequests.filter(r => r.status === "rejected").length;

  return (
    <div className="p-8 space-y-6">
      
      {/* 1. Header Navigation */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link to="/employee" className="hover:text-[#4F46E5] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4F46E5]">Maintenance Request Console</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Maintenance Management
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Submit repair requests, review technician logs, and trace resolution updates.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dashboard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab("raise")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "raise" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Raise Request Wizard
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
          <span>Syncing ticket registry today...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Open */}
                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Open Tickets</span>
                    <h3 className="text-2xl font-black text-amber-500 mt-1 font-mono">{openCount}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
                </div>

                {/* Progress */}
                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">In Progress</span>
                    <h3 className="text-2xl font-black text-indigo-500 mt-1 font-mono">{progressCount}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><RefreshCw className="w-5 h-5" /></div>
                </div>

                {/* Resolved */}
                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Resolved</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">{resolvedCount}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
                </div>

                {/* Rejected */}
                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Rejected</span>
                    <h3 className="text-2xl font-black text-rose-600 mt-1 font-mono">{rejectedCount}</h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
                </div>
              </div>

              {/* Active Requests List */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="border-b pb-3.5 flex justify-between items-center">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    My Active Tickets
                  </h3>
                  <button
                    onClick={() => setActiveTab("raise")}
                    className="btn-primary py-1.5 px-3 flex items-center gap-1 font-bold text-[10.5px] shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> File Repair Ticket
                  </button>
                </div>

                {activeRequests.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                    No active maintenance tickets recorded.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-350 transition-colors"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9.5px] font-mono text-slate-405 font-bold uppercase block">
                                Ticket {req.id}
                              </span>
                              <h4 className="font-bold text-xs text-slate-800 mt-1 truncate">
                                Asset: {req.assetId}
                              </h4>
                            </div>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              req.priority === "Critical"
                                ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse"
                                : req.priority === "High"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-indigo-50 text-indigo-600 border-indigo-100"
                            }`}>
                              {req.priority}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10.5px] text-slate-600 leading-relaxed min-h-[50px] font-sans">
                            {req.problemDescription}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[10px] font-bold">
                          <span className="text-indigo-600 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" /> Status: {req.status}
                          </span>
                          <button
                            onClick={() => handleOpenDetails(req.id)}
                            className="text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Track Ticket <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Raise Request Wizard */}
          {activeTab === "raise" && (
            <div className="max-w-xl mx-auto bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in relative">
              {/* Step indicator */}
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-black text-sm text-slate-850 uppercase tracking-wider">
                  Raise Repair Wizard
                </h3>
                <span className="text-[10px] font-extrabold px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4F46E5] rounded-full font-mono uppercase tracking-wider">
                  Step {wizardStep} of 5
                </span>
              </div>

              {/* Wizard Content */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Select Assigned Asset
                    </label>
                    <span className="text-[10.5px] text-slate-450 font-semibold block pb-1">
                      Choose which item in your custody requires service today.
                    </span>
                    <select
                      value={selectedAssetId}
                      onChange={(e) => setSelectedAssetId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                    >
                      <option value="">-- Choose Hardware Item --</option>
                      {assets.map((a) => (
                        <option key={a.id} value={a.id}>
                          [{a.id}] {a.name} ({a.condition})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Issue Category
                    </label>
                    <span className="text-[10.5px] text-slate-450 font-semibold block pb-1">
                      Select the primary class of issue encountered.
                    </span>
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      {["Hardware", "Software", "Battery", "Screen", "Keyboard", "Network", "Physical Damage", "Other"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`p-3 border rounded-2xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                            category === cat
                              ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
                              : "border-slate-200 hover:border-slate-305 text-slate-655"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Priority Urgency
                    </label>
                    <span className="text-[10.5px] text-slate-450 font-semibold block pb-1">
                      Indicate how critical this asset's downtime is to your operational tasks.
                    </span>
                    <div className="grid grid-cols-4 gap-3 pt-1">
                      {["Low", "Medium", "High", "Critical"].map((prio) => (
                        <button
                          key={prio}
                          onClick={() => setPriority(prio)}
                          className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                            priority === prio
                              ? "bg-slate-900 text-white border-slate-900 shadow-md scale-102"
                              : "border-slate-200 hover:border-slate-305 text-slate-650"
                          }`}
                        >
                          <span>{prio}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Problem Details Description
                    </label>
                    <span className="text-[10.5px] text-slate-450 font-semibold block pb-1">
                      Describe in detail the problem, when it started, and any symptoms.
                    </span>
                    <textarea
                      rows={4}
                      placeholder="e.g. Laptop display flickers while charging. Issue started two days ago."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-3.5 bg-slate-50/50 hover:border-slate-350 font-semibold text-xs focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Upload supporting documents
                    </label>
                    <span className="text-[10.5px] text-slate-450 font-semibold block pb-2">
                      Upload diagnostic screenshots, photos of physical damage, or diagnostic logs.
                    </span>

                    {/* Drag & drop box */}
                    <div className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-2xl p-6 text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center gap-2 group bg-slate-50/50">
                      <input
                        type="file"
                        onChange={handleMockUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#4F46E5] transition-colors" />
                      <div>
                        <span className="font-bold text-xs text-slate-700 block">
                          {uploading ? "Uploading attachment..." : "Click or drag files to upload"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                          PNG, JPG, PDF up to 10 MB
                        </span>
                      </div>
                    </div>

                    {/* Uploaded items */}
                    {attachments.length > 0 && (
                      <div className="pt-4 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                          Uploaded Attachments ({attachments.length})
                        </span>
                        <div className="space-y-2">
                          {attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 border border-slate-100 rounded-xl flex items-center justify-between bg-slate-50/50 text-xs font-semibold"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#4F46E5]" />
                                <span className="text-slate-750 font-medium truncate max-w-xs">{file.fileName}</span>
                              </div>
                              <button
                                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                                className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                  disabled={wizardStep === 1}
                  className="btn-secondary py-2 px-4 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  Back
                </button>
                {wizardStep < 5 ? (
                  <button
                    onClick={() => {
                      if (wizardStep === 1 && !selectedAssetId) {
                        toast.error("Please select an asset to continue.");
                        return;
                      }
                      setWizardStep((s) => s + 1);
                    }}
                    className="btn-primary py-2 px-5 text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitRequest}
                    disabled={submitting}
                    className="btn-primary py-2 px-6 text-xs font-bold shadow-indigo-500/20 shadow-md cursor-pointer flex items-center gap-1"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: History Logs */}
          {activeTab === "history" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b pb-3.5">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Resolved & Closed History
                </h3>
              </div>

              {historyRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                  No historical closed tickets found for your profile.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold text-slate-500">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Asset ID</th>
                        <th className="p-4">Problem Category</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Request Date</th>
                        <th className="p-4">Final Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historyRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-700">{req.id}</td>
                          <td className="p-4 font-mono text-slate-500">{req.assetId}</td>
                          <td className="p-4">{req.issueCategory || "Repair"}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 border text-[9.5px] rounded-md font-extrabold uppercase tracking-wide ${
                              req.priority === "Critical"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : req.priority === "High"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-indigo-50 text-indigo-600 border-indigo-100"
                            }`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="p-4 font-mono">{req.date}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                              req.status === "resolved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleOpenDetails(req.id)}
                              className="text-[#4F46E5] hover:underline cursor-pointer"
                            >
                              View details
                            </button>
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

      {/* Request Details Drawer */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/40 z-[90] backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedReq(null)} />

          <div className="w-full max-w-xl bg-white h-full relative z-[100] shadow-2xl flex flex-col animate-slide-left border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-none">
                    Ticket ID: {selectedReq.id}
                  </h3>
                  <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase mt-1.5 block">
                    Asset Code: {selectedReq.assetId}
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

            {/* Details panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {drawerLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
                  <span>Loading ticket timeline logs...</span>
                </div>
              ) : (
                <>
                  {/* Basic information */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
                    <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide">
                      Ticket Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Issue Class</span>
                        <span className="text-slate-850 font-bold block mt-0.5">{selectedReq.issueCategory || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Priority Urgency</span>
                        <span className="text-slate-850 font-bold block mt-0.5">{selectedReq.priority}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Filing Date</span>
                        <span className="text-slate-850 font-mono font-bold block mt-0.5">{selectedReq.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Workflow Status</span>
                        <span className="text-[#4F46E5] font-bold block mt-0.5 uppercase tracking-wide">{selectedReq.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Problem Description
                    </span>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-semibold text-slate-650 leading-relaxed font-sans">
                      {selectedReq.problemDescription}
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedReq.attachments && selectedReq.attachments.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                        Filed Attachments
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedReq.attachments.map((file: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50/50 transition-colors text-xs font-semibold"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#4F46E5]" />
                              <span className="text-slate-700 truncate max-w-[120px]">{file.fileName}</span>
                            </div>
                            <button
                              onClick={() => toast.success("Mock downloading file: " + file.fileName)}
                              className="text-[#4F46E5] hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technician information */}
                  {technician && (
                    <div className="bg-[#EEF2FF]/50 border border-indigo-100 rounded-2xl p-5 space-y-3.5">
                      <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#4F46E5]" /> Assigned Repair Technician
                      </h4>

                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Name</span>
                          <span className="text-slate-800 font-bold block mt-0.5">{technician.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Team</span>
                          <span className="text-slate-800 font-bold block mt-0.5">{technician.type}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Contact Number</span>
                          <span className="text-indigo-600 font-mono font-bold block mt-0.5">{technician.contact}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Assigned Date</span>
                          <span className="text-slate-800 font-mono font-bold block mt-0.5">{technician.assignedDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Staged Timeline */}
                  <div className="space-y-4 pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Resolution Tracking Timeline
                    </span>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
                      {reqTimeline.map((step, idx) => (
                        <div
                          key={idx}
                          className={`relative flex justify-between items-start text-xs font-semibold ${
                            step.done ? "text-slate-800" : "text-slate-400"
                          }`}
                        >
                          {/* Node status */}
                          <div className={`absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] z-10 ${
                            step.done ? "border-[#4F46E5] bg-[#4F46E5]" : "border-slate-200 bg-white"
                          }`} />
                          
                          <div>
                            <span className={`block font-bold ${step.done ? "text-slate-800" : "text-slate-400"}`}>
                              {step.label}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold mt-1 block">
                              Stage: {step.status}
                            </span>
                          </div>

                          {step.done && step.date && (
                            <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">
                              {step.date}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="btn-secondary py-2.5 px-6 font-bold text-xs cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeMaintenance;
