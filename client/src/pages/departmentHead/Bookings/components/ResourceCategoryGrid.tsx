import React from 'react';
import { Building, Car, Video, Laptop, Smartphone, Package } from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: string;
  onSelect: (cat: string) => void;
}

export const ResourceCategoryGrid: React.FC<CategoryGridProps> = ({ selectedCategory, onSelect }) => {
  const categories = [
    { id: 'all', label: 'All Resources', icon: Package, count: 24, style: 'hover:border-slate-350 hover:bg-slate-50' },
    { id: 'Meeting Rooms', label: 'Meeting Rooms', icon: Building, count: 10, style: 'hover:border-blue-300 hover:bg-blue-50/20 text-blue-600' },
    { id: 'Company Vehicles', label: 'Company Vehicles', icon: Car, count: 6, style: 'hover:border-emerald-300 hover:bg-emerald-50/20 text-emerald-600' },
    { id: 'Projectors', label: 'Projectors', icon: Video, count: 4, style: 'hover:border-amber-300 hover:bg-amber-50/20 text-amber-600' },
    { id: 'Laptop Pool', label: 'Laptop Pool', icon: Laptop, count: 2, style: 'hover:border-indigo-300 hover:bg-indigo-50/20 text-[#5B5BD6]' },
    { id: 'Testing Devices', label: 'Testing Devices', icon: Smartphone, count: 2, style: 'hover:border-violet-300 hover:bg-violet-50/20 text-violet-650' }
  ];

  return (
    <div className="space-y-3 font-semibold text-xs text-slate-700">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
        Browse Resource Category
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`p-4 bg-white border rounded-2xl text-left cursor-pointer transition-all duration-200 hover:shadow-sm flex flex-col justify-between gap-3 group ${
                isSelected 
                  ? 'border-[#5B5BD6] bg-[#5B5BD6]/5 shadow-sm ring-1 ring-[#5B5BD6]/20' 
                  : 'border-slate-200 ' + cat.style
              }`}
            >
              <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                isSelected 
                  ? 'bg-[#5B5BD6] text-white border-transparent' 
                  : 'bg-slate-50 border-slate-100 group-hover:scale-105 transition-transform text-slate-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <span className="font-extrabold text-xs text-slate-800 block group-hover:text-slate-950">
                  {cat.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-1">
                  {cat.count} Units available
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceCategoryGrid;
