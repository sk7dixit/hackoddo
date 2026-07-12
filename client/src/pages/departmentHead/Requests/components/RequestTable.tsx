import React from 'react';
import { Eye } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  employee: string;
  asset: string;
  type: 'allocation' | 'transfer' | 'return';
  priority: 'high' | 'medium' | 'low';
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

interface TableProps {
  requests: ApprovalRequest[];
  onSelect: (item: ApprovalRequest) => void;
}

export const RequestTable: React.FC<TableProps> = ({ requests, onSelect }) => {
  const getStatusBadge = (status: ApprovalRequest['status']) => {
    const styles = {
      pending: 'bg-orange-50 border-orange-100 text-orange-600',
      approved: 'bg-emerald-55/10 border-emerald-200 text-emerald-600',
      rejected: 'bg-rose-50 border-rose-100 text-rose-600',
      completed: 'bg-blue-50 border-blue-105 text-blue-600'
    };

    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed'
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPriorityChip = (prio: ApprovalRequest['priority']) => {
    const indicators = {
      high: { char: '🔴', text: 'High' },
      medium: { char: '🟠', text: 'Medium' },
      low: { char: '🟢', text: 'Low' }
    };
    const c = indicators[prio] || indicators.low;
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span>{c.char}</span>
        <span>{c.text}</span>
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
          
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Request ID</th>
              <th className="py-4 px-6">Employee</th>
              <th className="py-4 px-6">Asset Name</th>
              <th className="py-4 px-6">Request Type</th>
              <th className="py-4 px-6">Priority</th>
              <th className="py-4 px-6">Requested Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {requests.map((req, idx) => (
              <tr 
                key={req.id}
                className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}
              >
                <td className="py-3.5 px-6 font-mono text-slate-900 font-bold">
                  {req.id}
                </td>

                <td className="py-3.5 px-6 font-extrabold text-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded-full bg-slate-100 flex items-center justify-center font-black text-[9px] text-slate-500">
                      {req.employee.charAt(0)}
                    </div>
                    <span>{req.employee}</span>
                  </div>
                </td>

                <td className="py-3.5 px-6 font-extrabold text-slate-800">
                  {req.asset}
                </td>

                <td className="py-3.5 px-6 capitalize text-slate-500 font-bold">
                  {req.type}
                </td>

                <td className="py-3.5 px-6">
                  {getPriorityChip(req.priority)}
                </td>

                <td className="py-3.5 px-6 font-mono text-slate-500 font-bold">
                  {req.date}
                </td>

                <td className="py-3.5 px-6">
                  {getStatusBadge(req.status)}
                </td>

                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => onSelect(req)}
                    className="px-2.5 py-1.5 border border-slate-200 hover:border-[#5B5BD6]/45 hover:bg-[#5B5BD6]/5 text-slate-500 hover:text-[#5B5BD6] rounded-lg transition-all flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Request</span>
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

export default RequestTable;
