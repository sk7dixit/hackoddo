import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Search,
  Users,
  Laptop,
  Building,
  Video,
  FileText,
  ClipboardCheck,
  FolderOpen,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  SearchCode,
  MapPin,
  CalendarDays
} from "lucide-react";

export const GlobalSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [results, setResults] = useState<any>({
    employees: [],
    assets: [],
    departments: [],
    resources: [],
    requests: [],
    audits: [],
    categories: []
  });
  const [loading, setLoading] = useState(false);

  // Determine current portal context for breadcrumbs
  const getPortalPrefix = () => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) return "/admin";
    if (path.startsWith("/department-head")) return "/department-head";
    if (path.startsWith("/employee")) return "/employee";
    return "";
  };

  const portalPrefix = getPortalPrefix();

  const executeSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({
        employees: [],
        assets: [],
        departments: [],
        resources: [],
        requests: [],
        audits: [],
        categories: []
      });
      return;
    }
    setLoading(true);
    try {
      const data = await api.get(`/global/search?query=${encodeURIComponent(q)}`);
      setResults(data);
    } catch (err) {
      console.error("Global search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce input updates
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(searchQuery);
      setSearchParams(searchQuery ? { q: searchQuery } : {});
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, executeSearch, setSearchParams]);

  // Total matches counter
  const totalMatches =
    (results.employees?.length || 0) +
    (results.assets?.length || 0) +
    (results.departments?.length || 0) +
    (results.resources?.length || 0) +
    (results.requests?.length || 0) +
    (results.audits?.length || 0) +
    (results.categories?.length || 0);

  return (
    <div className="p-8 space-y-6">
      
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to={portalPrefix || "/"} className="hover:text-[#4F46E5] transition-colors">
            Portal Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Global Search System</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            Unified Global Search
          </h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Query real-time indexes of hardware inventory, employee rosters, audit cycles and operational files.
          </p>
        </div>
      </div>

      {/* Unified Search Input Container */}
      <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type query to scan the entire ERP database..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:bg-white transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
          />
        </div>

        {searchQuery.trim() && (
          <div className="text-center text-[10px] text-slate-450 uppercase font-extrabold tracking-wide">
            {loading ? (
              <span className="flex items-center justify-center gap-1 text-[#4F46E5]">
                <RefreshCw className="w-3 h-3 animate-spin" /> Scanning database indexes...
              </span>
            ) : (
              <span>Found {totalMatches} matching records in database</span>
            )}
          </div>
        )}
      </div>

      {totalMatches === 0 && !loading && searchQuery.trim() && (
        <div className="bg-white border border-[#E7ECF3] rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto space-y-3">
          <SearchCode className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-extrabold text-xs text-slate-800 uppercase">No matching records</h4>
          <p className="text-[10.5px] text-slate-450 font-semibold leading-relaxed">
            No entries matching your query were found. Please verify spelling or search tags.
          </p>
        </div>
      )}

      {/* Results Categorized List */}
      {totalMatches > 0 && !loading && (
        <div className="space-y-6 animate-fade-in">
          
          {/* 1. ASSETS */}
          {results.assets?.length > 0 && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b pb-3.5 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">
                  Matched Inventory Assets ({results.assets.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.assets.map((asset: any) => (
                  <div
                    key={asset.id}
                    className="p-4 border border-slate-150 rounded-2xl flex flex-col justify-between hover:border-slate-350 transition-colors"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">
                        {asset.id}
                      </span>
                      <h4 className="font-bold text-xs text-slate-850 truncate mt-1">
                        {asset.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-2.5">
                        <span>Model: {asset.model}</span>
                        <span>•</span>
                        <span>Custodian: {asset.holder || "Available"}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center">
                      <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase ${
                        asset.status === "allocated"
                          ? "bg-indigo-50 text-[#4F46E5]"
                          : asset.status === "available"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {asset.status.replace("_", " ")}
                      </span>
                      <Link
                        to={`${portalPrefix}/assets?search=${asset.id}`}
                        className="text-[#4F46E5] hover:underline text-[10.5px] font-bold flex items-center gap-0.5"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. EMPLOYEES */}
          {results.employees?.length > 0 && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b pb-3.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">
                  Matched Employees Roster ({results.employees.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.employees.map((emp: any) => (
                  <div
                    key={emp.id}
                    className="p-4 border border-slate-150 rounded-2xl hover:border-slate-350 transition-colors flex justify-between items-center"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-850">
                        {emp.name}
                      </h4>
                      <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase block">
                        ID: {emp.employeeId || emp.id}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-bold uppercase pt-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.departmentId || "HQ"}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-50 border text-slate-550 border-slate-150">
                      {emp.role.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DEPARTMENTS & RESOURCES */}
          {(results.departments?.length > 0 || results.resources?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Departments */}
              {results.departments?.length > 0 && (
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3.5 flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">
                      Departments ({results.departments.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {results.departments.map((dept: any) => (
                      <div
                        key={dept.id}
                        className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-850">{dept.name}</h4>
                          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase mt-0.5 block">
                            Code: {dept.code}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">
                          Head: {dept.headId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {results.resources?.length > 0 && (
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3.5 flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">
                      Shared Resources ({results.resources.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {results.resources.map((res: any) => (
                      <div
                        key={res.resourceId}
                        className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-850">{res.resourceName}</h4>
                          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase mt-0.5 block">
                            Category: {res.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-700 block font-bold">{res.location}</span>
                          <span className="text-[9px] text-slate-400 mt-0.5 block font-bold">Cap: {res.capacity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 4. WORKFLOW REQUESTS & AUDITS */}
          {(results.requests?.length > 0 || results.audits?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Requests */}
              {results.requests?.length > 0 && (
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">
                      Workflows & Custody Requests ({results.requests.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {results.requests.map((req: any, idx: number) => (
                      <div
                        key={req.id || idx}
                        className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-850 truncate max-w-[200px]">
                            {req.problemDescription || req.reason || "Workflow Custody Request"}
                          </h4>
                          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                            <span>ID: {req.id}</span>
                            <span>•</span>
                            <span className="text-indigo-500 font-black">{req.type}</span>
                          </div>
                        </div>

                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-50 border text-slate-600">
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audits */}
              {results.audits?.length > 0 && (
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3.5 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">
                      Audit Cycles ({results.audits.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {results.audits.map((aud: any) => (
                      <div
                        key={aud.id}
                        className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-850">{aud.name}</h4>
                          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase mt-0.5 block">
                            ID: {aud.id}
                          </span>
                        </div>
                        <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-650 tracking-wider">
                          {aud.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default GlobalSearch;
