import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  requestType: string;
  setRequestType: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  onClear: () => void;
}

export const RequestFilters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  requestType,
  setRequestType,
  dateRange,
  setDateRange,
  onClear
}) => {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 font-semibold text-xs text-slate-700">
      
      {/* Search box and clear trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Request ID, employee, asset tag, or asset name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10 pr-4 py-2.5 text-xs w-full focus:border-[#5B5BD6]/50 focus:ring-[#5B5BD6]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter List</span>
          </div>
          <button
            onClick={onClear}
            className="px-3 py-2 border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Select lists grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
        
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Priority</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Request Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Request Type</label>
          <select
            value={requestType}
            onChange={e => setRequestType(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="allocation">Allocation</option>
            <option value="transfer">Transfer</option>
            <option value="return">Return</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Date Range</label>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default RequestFilters;
