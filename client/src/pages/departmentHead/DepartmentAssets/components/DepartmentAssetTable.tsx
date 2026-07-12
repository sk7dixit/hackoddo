import React from 'react';
import { Eye, QrCode } from 'lucide-react';

interface AssetItem {
  id: string;
  name: string;
  category: string;
  assignedTo: string | null;
  status: 'available' | 'allocated' | 'under_maintenance' | 'reserved' | 'lost' | 'retired';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
  location: string;
  returnDate: string | null;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  warranty: string;
  history?: Array<{ date: string; action: string; performedBy: string; notes?: string }>;
  maintenance?: Array<{ date: string; issue: string; status: string }>;
  allocations?: Array<{ employee: string; from: string; to: string }>;
}

interface TableProps {
  assets: AssetItem[];
  onSelect: (item: AssetItem) => void;
  onSelectQr: (item: AssetItem) => void;
}

export const DepartmentAssetTable: React.FC<TableProps> = ({ assets, onSelect, onSelectQr }) => {
  
  const getStatusBadge = (status: AssetItem['status']) => {
    const styles = {
      available: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      allocated: 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold',
      under_maintenance: 'bg-orange-50 border-orange-100 text-orange-600',
      reserved: 'bg-purple-50 border-purple-100 text-purple-600',
      lost: 'bg-rose-50 border-rose-100 text-rose-600',
      retired: 'bg-slate-100 border-slate-205 text-slate-500'
    };
    
    const labels = {
      available: 'Available',
      allocated: 'Allocated',
      under_maintenance: 'Maintenance',
      reserved: 'Reserved',
      lost: 'Lost',
      retired: 'Retired'
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getConditionBadge = (cond: AssetItem['condition']) => {
    const styles = {
      Excellent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      Good: 'bg-indigo-50 text-[#5B5BD6] border-indigo-100',
      Fair: 'bg-amber-50 text-amber-600 border-amber-100',
      Damaged: 'bg-rose-50 text-rose-600 border-rose-100'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[cond]}`}>
        {cond}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      
      {/* Scrollable table viewport */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
          
          {/* Header Row */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-6 w-12 text-center">QR</th>
              <th className="py-4 px-6">Asset Tag</th>
              <th className="py-4 px-6">Asset Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Assigned To</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Condition</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Return Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {assets.map((item, index) => (
              <tr 
                key={item.id} 
                className={`hover:bg-slate-50/40 transition-colors ${index % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}
              >
                {/* QR preview icon */}
                <td className="py-2.5 px-6 text-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectQr(item); }}
                    className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-150 hover:border-[#5B5BD6] hover:bg-[#5B5BD6]/5 flex items-center justify-center text-slate-500 hover:text-[#5B5BD6] mx-auto shadow-xs cursor-pointer transition-all"
                    title="View QR Label"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </td>

                <td className="py-2.5 px-6 font-mono text-slate-900 font-bold">
                  {item.id}
                </td>

                <td className="py-2.5 px-6 font-extrabold text-slate-800">
                  {item.name}
                </td>

                <td className="py-2.5 px-6 text-slate-500 font-bold">
                  {item.category}
                </td>

                <td className="py-2.5 px-6 font-extrabold text-slate-800">
                  {item.assignedTo ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[8.5px] text-slate-505">
                        {item.assignedTo.charAt(0)}
                      </div>
                      <span>{item.assignedTo}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-medium italic">Unassigned</span>
                  )}
                </td>

                <td className="py-2.5 px-6">
                  {getStatusBadge(item.status)}
                </td>

                <td className="py-2.5 px-6">
                  {getConditionBadge(item.condition)}
                </td>

                <td className="py-2.5 px-6 text-slate-505 font-bold">
                  {item.location}
                </td>

                <td className="py-2.5 px-6 font-mono text-slate-500 font-bold">
                  {item.returnDate ? item.returnDate : <span className="text-slate-350">-</span>}
                </td>

                <td className="py-2.5 px-6 text-right">
                  <button
                    onClick={() => onSelect(item)}
                    className="p-1.5 border border-slate-200 hover:border-[#5B5BD6] hover:bg-[#5B5BD6]/5 text-slate-400 hover:text-[#5B5BD6] rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-xs ml-auto"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default DepartmentAssetTable;
