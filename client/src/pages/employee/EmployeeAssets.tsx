import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Laptop,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Calendar,
  AlertCircle,
  FileText,
  MapPin,
  Clock,
  Printer,
  Download,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Award,
  Heart,
  ShieldCheck,
  Building,
  CheckCircle,
  Info,
} from "lucide-react";

// Mock QR Code Render
const QrCodeSvg: React.FC<{ value: string }> = ({ value }) => {
  return (
    <svg
      className="w-36 h-36 border p-2 bg-white rounded-xl shadow-sm"
      viewBox="0 0 100 100"
    >
      <rect x="5" y="5" width="20" height="20" fill="black" />
      <rect x="8" y="8" width="14" height="14" fill="white" />
      <rect x="11" y="11" width="8" height="8" fill="black" />

      <rect x="75" y="5" width="20" height="20" fill="black" />
      <rect x="78" y="8" width="14" height="14" fill="white" />
      <rect x="81" y="11" width="8" height="8" fill="black" />

      <rect x="5" y="75" width="20" height="20" fill="black" />
      <rect x="8" y="78" width="14" height="14" fill="white" />
      <rect x="11" y="81" width="8" height="8" fill="black" />

      <rect x="35" y="15" width="6" height="6" fill="black" />
      <rect x="45" y="25" width="8" height="8" fill="black" />
      <rect x="55" y="10" width="5" height="5" fill="black" />
      <rect x="65" y="20" width="7" height="7" fill="black" />

      <rect x="30" y="45" width="10" height="10" fill="black" />
      <rect x="50" y="50" width="12" height="12" fill="black" />
      <rect x="70" y="40" width="8" height="8" fill="black" />

      <rect x="35" y="75" width="12" height="12" fill="black" />
      <rect x="55" y="80" width="8" height="8" fill="black" />
      <rect x="68" y="70" width="6" height="6" fill="black" />
    </svg>
  );
};

// Mock Barcode Render
const BarcodeSvg: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-white p-4 border rounded-xl shadow-sm">
      <div className="flex gap-0.5 h-10 items-stretch select-none">
        <div className="w-1 bg-black" />
        <div className="w-0.5 bg-white" />
        <div className="w-1 bg-black" />
        <div className="w-2 bg-black" />
        <div className="w-1 bg-white" />
        <div className="w-0.5 bg-black" />
        <div className="w-1 bg-black" />
        <div className="w-0.5 bg-white" />
        <div className="w-2 bg-black" />
        <div className="w-1 bg-white" />
        <div className="w-1 bg-black" />
        <div className="w-0.5 bg-white" />
        <div className="w-0.5 bg-black" />
        <div className="w-2 bg-black" />
        <div className="w-1 bg-white" />
        <div className="w-1 bg-black" />
        <div className="w-1 bg-white" />
        <div className="w-2 bg-black" />
        <div className="w-1 bg-black" />
      </div>
      <span className="font-mono text-[9px] font-bold tracking-widest text-slate-450 uppercase">
        {code}
      </span>
    </div>
  );
};

export const EmployeeAssets: React.FC = () => {
  const navigate = useNavigate();

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Loaded Data States
  const [assets, setAssets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Drawer States
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Tab details state
  const [warranty, setWarranty] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [qrZoom, setQrZoom] = useState(false);

  // Fetch Assets
  const fetchAssets = async () => {
    setLoading(true);
    try {
      let url = "/employee/assets?";
      url += "search=" + encodeURIComponent(search);
      url += "&category=" + encodeURIComponent(category);
      url += "&location=" + encodeURIComponent(locationFilter);
      url += "&status=" + encodeURIComponent(statusFilter);
      url += "&sort=" + encodeURIComponent(sort);
      url += "&page=" + page;
      url += "&limit=6";

      const res = await api.get(url);
      setAssets(res.assets || []);
      setTotal(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err: any) {
      console.error("Error fetching assets:", err);
      toast.error("Failed to load your assigned assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, category, locationFilter, statusFilter, sort, page]);

  // Load Drawer Details
  const handleOpenDetails = async (asset: any) => {
    setSelectedAsset(asset);
    setActiveTab("overview");
    setDrawerLoading(true);
    try {
      const [warrRes, docsRes, histRes, locRes] = await Promise.all([
        api.get(`/employee/assets/warranty/${asset.id}`),
        api.get(`/employee/assets/documents/${asset.id}`),
        api.get(`/employee/assets/history/${asset.id}`),
        api.get(`/employee/assets/location/${asset.id}`),
      ]);
      setWarranty(warrRes);
      setDocuments(docsRes);
      setHistory(histRes);
      setLocationDetails(locRes);
    } catch (err) {
      console.error("Error loading asset details:", err);
      toast.error("Failed to load complete asset profile details.");
    } finally {
      setDrawerLoading(false);
    }
  };

  const handlePrintQR = () => {
    toast.info(
      "Sending label print payload to your default workspace printer...",
    );
    window.print();
  };

  const handleDownloadQR = () => {
    toast.success("Downloaded asset QR code label.");
  };

  return (
    <div className="p-8 space-y-6">
      {/* 1. Header Navigation */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.015)]">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link
            to="/employee"
            className="hover:text-[#4F46E5] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">My Assets</span>
        </div>
        <div className="pt-2 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              My Allocated Ledger
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Verify parameters, check active warranty terms, and access
              hardware manual docs.
            </p>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4F46E5] rounded-full uppercase tracking-wider">
            {total} Total items
          </span>
        </div>
      </div>

      {/* 2. Summary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
              Allocated Assets
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1 font-mono">
              {total}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-xl">
            <Laptop className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
              Warranty Covered
            </span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {total}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
              Status Active
            </span>
            <h3 className="text-2xl font-black text-[#4F46E5] mt-1 font-mono">
              100%
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
              Returns Pending
            </span>
            <h3 className="text-2xl font-black text-slate-600 mt-1 font-mono">
              {assets.filter((a) => a.returnDate).length}
            </h3>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search and Advanced Filters */}
      <div className="bg-white border border-[#E7ECF3] p-4 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,.02)] space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by asset name, code tag, serial number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 hover:border-slate-350 rounded-xl font-semibold text-xs bg-slate-50/50 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest Assigned</option>
              <option value="oldest">Sort: Oldest Assigned</option>
              <option value="returnDate">Sort: Return Due Date</option>
              <option value="category">Sort: Category Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
          {/* Category Filter */}
          <div className="flex items-center gap-2 border border-slate-150 rounded-lg px-2.5 py-1.5 bg-slate-50/20 text-slate-600 font-semibold text-[11px]">
            <span className="text-slate-400">Category:</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Printers">Printers</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 border border-slate-150 rounded-lg px-2.5 py-1.5 bg-slate-50/20 text-slate-600 font-semibold text-[11px]">
            <span className="text-slate-400">Location:</span>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Floors</option>
              <option value="Floor 1">Floor 1</option>
              <option value="Floor 2">Floor 2</option>
              <option value="Floor 3">Floor 3</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 border border-slate-150 rounded-lg px-2.5 py-1.5 bg-slate-50/20 text-slate-600 font-semibold text-[11px]">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="allocated">Allocated</option>
              <option value="reserved">Reserved</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>

          {(search ||
            category !== "All" ||
            locationFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocationFilter("All");
                setStatusFilter("All");
                setPage(1);
              }}
              className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1 ml-auto"
            >
              <X className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Asset List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-[#E7ECF3] rounded-3xl p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="w-20 h-5 bg-slate-100 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 w-3/4 rounded" />
                <div className="h-3 bg-slate-100 w-1/2 rounded" />
              </div>
              <div className="h-10 bg-slate-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white border border-[#E7ECF3] rounded-3xl p-16 text-center max-w-md mx-auto shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4F46E5] mx-auto">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-slate-800">
              No Assets Found
            </h4>
            <p className="text-xs text-slate-450 font-semibold leading-relaxed">
              No allocated hardware items match your current query or category
              parameters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-[#4F46E5] shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full uppercase tracking-wider">
                    {asset.status}
                  </span>
                </div>

                <div className="mt-4.5 space-y-1 select-none">
                  <h4 className="font-black text-sm text-slate-850 truncate group-hover:text-[#4F46E5] transition-colors">
                    {asset.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">
                    {asset.id}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 text-[10.5px] font-semibold text-slate-550">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-bold text-slate-700">
                      {asset.categoryId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <span className="font-extrabold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/50 text-[10px]">
                      {asset.condition}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Date:</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {asset.purchaseDate || "12 Jun 2026"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Return:</span>
                    <span className="font-bold text-slate-705 font-mono">
                      {asset.returnDate || "15 Dec 2026"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenDetails(asset)}
                  className="w-full btn-secondary text-xs py-2.5 font-bold cursor-pointer flex items-center justify-center gap-1.5 group-hover:bg-[#4F46E5] group-hover:text-white group-hover:border-[#4F46E5] transition-all"
                >
                  View Details & Actions{" "}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4 select-none font-bold text-xs">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-slate-500 font-bold">
            Page <span className="text-[#4F46E5] font-mono">{page}</span> of{" "}
            <span className="text-slate-800 font-mono">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      )}

      {/* 6. Details Drawer Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-slate-900/40 z-[90] backdrop-blur-xs flex justify-end animate-fade-in">
          {/* Overlay click closer */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedAsset(null)}
          />

          {/* Drawer content panel */}
          <div className="w-full max-w-xl bg-white h-full relative z-[100] shadow-2xl flex flex-col animate-slide-left border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-none">
                    {selectedAsset.name}
                  </h3>
                  <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase mt-1.5 block">
                    Tag ID: {selectedAsset.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 text-xs font-bold text-slate-500 overflow-x-auto bg-slate-50/30">
              {[
                "overview",
                "warranty",
                "timeline",
                "qr",
                "documents",
                "location",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 border-b-[2.5px] whitespace-nowrap transition-colors cursor-pointer uppercase tracking-wider text-[10.5px] ${
                    activeTab === tab
                      ? "text-[#4F46E5] border-[#4F46E5] font-black"
                      : "border-transparent hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {drawerLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
                  <span>Loading full asset data profile...</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: Overview */}
                  {activeTab === "overview" && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Specifications */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
                        <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide">
                          Technical Specifications
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Manufacturer
                            </span>
                            <span className="text-slate-850 font-bold block mt-0.5">
                              {selectedAsset.manufacturer || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Model Code
                            </span>
                            <span className="text-slate-850 font-bold block mt-0.5">
                              {selectedAsset.model || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Serial Number
                            </span>
                            <span className="text-slate-850 font-mono font-bold block mt-0.5">
                              {selectedAsset.serialNumber || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Cost Value
                            </span>
                            <span className="text-slate-850 font-mono font-bold block mt-0.5">
                              ${selectedAsset.cost || "0"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Health score */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide">
                          Condition & Health
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs font-bold text-slate-650">
                              <span>Asset Health Score</span>
                              <span className="text-emerald-600 font-mono">
                                96%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: "96%" }}
                              />
                            </div>
                          </div>
                          <span className="px-3.5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xs font-black select-none uppercase tracking-wide">
                            {selectedAsset.condition}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Warranty */}
                  {activeTab === "warranty" && warranty && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                        <Award className="w-10 h-10 text-indigo-500" />
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                            Coverage Status
                          </span>
                          <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-[#4F46E5] rounded-full text-xs font-black block w-fit mx-auto mt-1 uppercase tracking-wider">
                            {warranty.status} Warranty
                          </span>
                        </div>

                        <div className="w-full border-t border-slate-200 pt-4 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Start Date
                            </span>
                            <span className="font-mono font-bold block mt-0.5">
                              {warranty.startDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Expiration
                            </span>
                            <span className="font-mono font-bold block mt-0.5">
                              {warranty.endDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Days Left
                            </span>
                            <span className="text-emerald-600 font-mono font-extrabold block mt-0.5">
                              {warranty.remainingDays} Days
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-150 rounded-2xl p-4 text-xs space-y-2 text-slate-600 font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Coverage Provider:
                          </span>
                          <span className="font-bold text-slate-800">
                            {warranty.vendor}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Annual Maintenance (AMC):
                          </span>
                          <span className="font-bold text-emerald-600">
                            Covered
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: History & Timeline */}
                  {activeTab === "timeline" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
                        {history.map((h, i) => (
                          <div
                            key={h.id}
                            className="relative flex justify-between items-start text-xs font-semibold text-slate-705"
                          >
                            <div className="absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] border-[#4F46E5] bg-white z-10" />
                            <div>
                              <span className="font-bold text-slate-800 block">
                                {h.message}
                              </span>
                              <span className="text-[9.5px] text-[#4F46E5] font-extrabold uppercase mt-1.5 block tracking-wider">
                                Event: {h.type}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-450 font-mono font-bold mt-0.5">
                              {new Date(h.date).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: QR & Barcodes */}
                  {activeTab === "qr" && (
                    <div className="space-y-6 text-center animate-fade-in flex flex-col items-center justify-center">
                      <div
                        onClick={() => setQrZoom(!qrZoom)}
                        className={`cursor-pointer transition-all hover:scale-102 flex flex-col items-center justify-center border p-4 bg-white rounded-3xl shadow-md ${
                          qrZoom ? "scale-115 shadow-xl border-[#4F46E5]" : ""
                        }`}
                      >
                        <QrCodeSvg
                          value={`https://assetflow.com/assets/${selectedAsset.id}`}
                        />
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 mt-3 flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> Click to Zoom
                        </span>
                      </div>

                      <div className="w-full max-w-xs space-y-4">
                        <BarcodeSvg code={selectedAsset.id} />

                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handlePrintQR}
                            className="btn-secondary py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                          >
                            <Printer className="w-4 h-4" /> Print Label
                          </button>
                          <button
                            onClick={handleDownloadQR}
                            className="btn-primary py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
                          >
                            <Download className="w-4 h-4" /> Download QR
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Documents */}
                  {activeTab === "documents" && (
                    <div className="space-y-3.5 animate-fade-in">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 border border-slate-100 hover:border-slate-200 rounded-2xl flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-[#4F46E5] rounded-xl">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">
                                {doc.name}
                              </span>
                              <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">
                                {doc.type} • {doc.size}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              toast.success(`Starting download: ${doc.name}`)
                            }
                            className="p-2 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-400 hover:text-[#4F46E5] rounded-xl cursor-pointer transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 6: Location */}
                  {activeTab === "location" && locationDetails && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
                        <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-500" />{" "}
                          Physical Placement Coordinates
                        </h4>

                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650 pt-2">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Campus Building
                            </span>
                            <span className="text-slate-850 font-bold block mt-0.5">
                              {locationDetails.building}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Level Floor
                            </span>
                            <span className="text-slate-850 font-bold block mt-0.5">
                              {locationDetails.floor}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Room Placement
                            </span>
                            <span className="text-slate-850 font-bold block mt-0.5">
                              {locationDetails.room}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">
                              Assigned Desk Tag
                            </span>
                            <span className="text-slate-850 font-mono font-bold block mt-0.5">
                              {locationDetails.desk}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions Bar Footer */}
            <div className="p-6 border-t border-slate-150 bg-slate-50/70 grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  navigate("/employee/maintenance");
                }}
                className="btn-secondary py-2.5 font-bold text-[10.5px] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1 border border-amber-250 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Issue ticket</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAsset(null);
                  navigate("/employee/return-transfer");
                }}
                className="btn-secondary py-2.5 font-bold text-[10.5px] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1 border border-rose-250 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                <span>Request Return</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAsset(null);
                  navigate("/employee/return-transfer");
                }}
                className="btn-secondary py-2.5 font-bold text-[10.5px] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1 border border-indigo-250 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                <span>Transfer item</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAssets;
