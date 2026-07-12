import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  onClear: () => void;
}

export const ActivityFilters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  status,
  setStatus,
  priority,
  setPriority,
  dateRange,
  setDateRange,
  onClear
}) => {
  const quickChips = [
    { label: 'Today', action: () => { setDateRange('today'); } },
    { label: 'Approvals', action: () => { setSelectedType('approval'); } },
    { label: 'Bookings', action: () => { setSelectedType('booking'); } },
    { label: 'Maintenance', action: () => { setSelectedType('maintenance'); } },
    { label: 'High Priority', action: () => { setPriority('high'); } }
  ];

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 font-semibold text-xs text-slate-700 font-sans">
      
      {/* Search box row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Activity ID, employee name, asset tag, or request ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10 pr-4 py-2.5 text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>Search Filter</span>
          </div>
          <button
            onClick={onClear}
            className="px-3 py-2 border border-slate-200 hover:border-slate-350 text-slate-505 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Quick chips bar */}
      <div className="space-y-2 border-t border-slate-100/70 pt-3">
        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Quick filter chips
        </span>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={chip.action}
              className="px-3 py-1.5 border border-slate-200 hover:border-[#5B5BD6]/50 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[10.5px] text-slate-550 cursor-pointer transition-all font-bold"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Select lists grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
        
        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Activity Type</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Activities</option>
            <option value="asset">Asset Allocation</option>
            <option value="approval">Approvals</option>
            <option value="transfer">Transfers</option>
            <option value="return">Returns</option>
            <option value="maintenance">Maintenance</option>
            <option value="booking">Bookings</option>
            <option value="login">Logins</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Execution Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Severity</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Date Scope</label>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default ActivityFilters;
