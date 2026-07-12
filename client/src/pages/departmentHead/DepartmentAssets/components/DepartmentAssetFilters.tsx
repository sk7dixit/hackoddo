import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  condition: string;
  setCondition: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  returnStatus: string;
  setReturnStatus: (val: string) => void;
  onClear: () => void;
}

export const DepartmentAssetFilters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  condition,
  setCondition,
  location,
  setLocation,
  returnStatus,
  setReturnStatus,
  onClear
}) => {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 font-semibold text-xs text-slate-700">
      
      {/* Live search input & filter title */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, serial number, or custodian employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10 pr-4 py-2.5 text-xs w-full focus:border-[#5B5BD6]/50 focus:ring-[#5B5BD6]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>Refine Criteria</span>
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

      {/* Select selectors grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
        
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Networking">Networking</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="reserved">Reserved</option>
            <option value="under_maintenance">Maintenance</option>
            <option value="lost">Lost</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        {/* Condition */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Condition</label>
          <select
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Conditions</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Location</label>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="glass-input cursor-pointer"
          >
            <option value="all">All Locations</option>
            <option value="IT Department">IT Department</option>
            <option value="Server Room">Server Room</option>
            <option value="Engineering Lab">Engineering Lab</option>
            <option value="HQ Office">HQ Office</option>
            <option value="Meeting Room Alpha">Meeting Room Alpha</option>
          </select>
        </div>

        {/* Return Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Return Deadline</label>
          <select
            value={returnStatus}
            onChange={e => setReturnStatus(e.target.value)}
            className="glass-input cursor-pointer col-span-2 lg:col-span-1"
          >
            <option value="all">All Timelines</option>
            <option value="upcoming">Upcoming Returns</option>
            <option value="overdue">Overdue Returns</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default DepartmentAssetFilters;
