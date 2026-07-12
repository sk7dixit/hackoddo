import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  onClear: () => void;
}

export const NotificationFilters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  status,
  setStatus,
  priority,
  setPriority,
  onClear
}) => {
  const categories = ['All', 'Assets', 'Approvals', 'Transfers', 'Bookings', 'Maintenance', 'Returns', 'Audit'];

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 font-semibold text-xs text-slate-700">
      
      {/* Search and control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, employee name, request ID, asset, or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10 pr-4 py-2.5 text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>Search Filters</span>
          </div>
          <button
            onClick={onClear}
            className="px-3 py-2 border border-slate-200 hover:border-slate-350 text-slate-505 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Category Chips row */}
      <div className="space-y-2 border-t border-slate-100/70 pt-3">
        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Event Categorization chips
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={`px-3 py-1.5 border rounded-xl text-[10.5px] cursor-pointer transition-all duration-150 ${
                  isSelected 
                    ? 'bg-[#5B5BD6] text-white border-transparent shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown Filters grid */}
      <div className="grid grid-cols-2 gap-3.5 pt-1">
        
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Read Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All notifications</option>
            <option value="unread">Unread only</option>
            <option value="read">Read only</option>
            <option value="archived">Archived only</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Priority Level</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default NotificationFilters;
