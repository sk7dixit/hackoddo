import React, { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';

interface ActivityLog {
  id: string;
  user: string;
  module: 'Asset' | 'Allocation' | 'Maintenance' | 'Audit' | 'Return' | string;
  action: string;
  asset: string;
  status: 'Success' | 'Failed';
  timestamp: string;
}

const MODULE_BADGE_COLORS: Record<string, string> = {
  asset: 'bg-slate-50 text-slate-600 border-slate-200',
  allocation: 'bg-violet-50 text-violet-750 border-violet-100',
  maintenance: 'bg-orange-50 text-orange-750 border-orange-100',
  audit: 'bg-blue-50 text-blue-755 border-blue-100',
  return: 'bg-emerald-50 text-emerald-750 border-emerald-100',
  system: 'bg-slate-50 text-slate-500 border-slate-200'
};

const formatRelativeTime = (timestampString: string): string => {
  const date = new Date(timestampString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/activity-logs');
        const data = await res.json();
        if (res.ok) {
          setLogs(data);
        }
      } catch (e) {
        console.error('Failed to load logs:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setModuleFilter('');
    setStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };

  // Filter logs logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.asset.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());

    const matchesModule = !moduleFilter || log.module === moduleFilter;
    const matchesStatus = !statusFilter || log.status === statusFilter;
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);

    return matchesSearch && matchesModule && matchesStatus && matchesDate;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="border-b border-slate-200/60 pb-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          System Activity Logs
        </h2>
        <p className="text-sm text-slate-500 font-semibold mt-1">Immutable auditable activity logs for security, reporting, and tracking</p>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-center justify-between border-slate-200 shadow-sm bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 w-full">
          
          {/* Search Box */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, asset, action..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>

          {/* Module */}
          <select
            value={moduleFilter}
            onChange={e => { setModuleFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700 font-semibold"
          >
            <option value="">All Modules</option>
            <option value="Asset">Asset</option>
            <option value="Allocation">Allocation</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Audit">Audit</option>
            <option value="Return">Return</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Date Picker */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={dateFilter}
              onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="glass-input py-1.5 text-xs w-full cursor-pointer text-slate-655"
            />
            <button
              onClick={handleResetFilters}
              className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 hover:underline whitespace-nowrap pl-2"
              title="Reset All Filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Directory Table */}
      <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 font-bold">Loading activity logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User Initiator</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Module Section</th>
                  <th className="py-3 px-4">Asset Code</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-slate-650">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 italic">No activity logs found.</td>
                  </tr>
                ) : (
                  currentItems.map(log => {
                    const badgeClass = MODULE_BADGE_COLORS[log.module.toLowerCase()] || MODULE_BADGE_COLORS.system;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        {/* Timestamp: Relative format */}
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[10.5px]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span title={new Date(log.timestamp).toLocaleString()}>
                              {formatRelativeTime(log.timestamp)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-3.5 px-4 text-slate-700 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{log.user}</span>
                        </td>
                        
                        <td className="py-3.5 px-4 text-slate-800">{log.action}</td>
                        
                        {/* Action badge module section colored by module type */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                            {log.module}
                          </span>
                        </td>
                        
                        {/* Asset Code in Purple Bold Mono */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#5B5BD6]">{log.asset}</td>
                        
                        <td className="py-3.5 px-4 text-right">
                          {log.status === 'Success' ? (
                            <span className="text-emerald-600 flex items-center gap-1 justify-end font-bold text-xs">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Success</span>
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1 justify-end font-bold text-xs">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              <span>Failed</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/50">
            <span>
              Page {currentPage} of {totalPages} ({filteredLogs.length} total logs)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>

    </div>
  );
};

export default ActivityLogs;
