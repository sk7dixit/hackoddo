import React from 'react';
import { Eye } from 'lucide-react';

interface ActivityLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  target: string;
  status: 'completed' | 'pending' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface TableProps {
  logs: ActivityLogItem[];
  selectedLogId?: string;
  onSelect: (item: ActivityLogItem) => void;
}

export const ActivityTable: React.FC<TableProps> = ({ logs, selectedLogId, onSelect }) => {
  
  const getStatusBadge = (status: ActivityLogItem['status']) => {
    const styles = {
      completed: 'bg-emerald-55/10 border-emerald-100 text-emerald-600',
      pending: 'bg-orange-50 border-orange-100 text-orange-605',
      failed: 'bg-rose-50 border-rose-100 text-rose-600'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
          
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-6">Time</th>
              <th className="py-3 px-6">User Initiator</th>
              <th className="py-3 px-6">Logged Action</th>
              <th className="py-3 px-6">Module Scope</th>
              <th className="py-3 px-6">Target Asset/Space</th>
              <th className="py-3 px-6">Execution</th>
              <th className="py-3 px-6 text-right">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {logs.map((item, idx) => {
              const isSelected = item.id === selectedLogId;
              return (
                <tr 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`hover:bg-slate-50/50 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-50/40 border-l-2 border-l-[#5B5BD6]' 
                      : idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'
                  }`}
                >
                  <td className="py-2.5 px-6 font-mono text-slate-500 font-bold">
                    {item.time}
                  </td>

                  <td className="py-2.5 px-6 font-extrabold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-100 flex items-center justify-center font-black text-[9px] text-slate-500">
                        {item.user.charAt(0)}
                      </div>
                      <span>{item.user}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-6 font-extrabold text-slate-800">
                    {item.action}
                  </td>

                  <td className="py-2.5 px-6 capitalize text-slate-505 font-bold font-mono text-[10px]">
                    {item.module}
                  </td>

                  <td className="py-2.5 px-6 font-extrabold text-[#5B5BD6]">
                    {item.target}
                  </td>

                  <td className="py-2.5 px-6">
                    {getStatusBadge(item.status)}
                  </td>

                  <td className="py-2.5 px-6 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(item); }}
                      className="p-1 border border-slate-200 hover:border-[#5B5BD6] hover:bg-[#5B5BD6]/5 text-slate-400 hover:text-[#5B5BD6] rounded-lg transition-all flex items-center justify-center ml-auto cursor-pointer"
                      title="View details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
