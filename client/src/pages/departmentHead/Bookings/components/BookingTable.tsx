import React from 'react';
import { Eye } from 'lucide-react';

interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  startTime: number;
  endTime: number;
  title: string;
  status: 'confirmed' | 'maintenance' | 'pending';
}

interface TableProps {
  bookings: Booking[];
  onSelect: (item: Booking) => void;
}

export const BookingTable: React.FC<TableProps> = ({ bookings, onSelect }) => {
  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      confirmed: 'bg-emerald-55/10 border-emerald-100 text-emerald-600',
      pending: 'bg-orange-50 border-orange-100 text-orange-600',
      maintenance: 'bg-slate-100 border-slate-200 text-slate-500'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const formatHour = (h: number) => {
    if (h < 12) return `${h}:00 AM`;
    if (h === 12) return `12:00 PM`;
    return `${h - 12}:00 PM`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
          
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Booking ID</th>
              <th className="py-4 px-6">Resource Name</th>
              <th className="py-4 px-6">Scheduled Date</th>
              <th className="py-4 px-6">Time Slot</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {bookings.map((book, idx) => (
              <tr 
                key={book.id}
                className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}
              >
                <td className="py-3.5 px-6 font-mono text-slate-900 font-bold">
                  {book.id}
                </td>

                <td className="py-3.5 px-6 font-extrabold text-slate-800">
                  {book.resourceName}
                </td>

                <td className="py-3.5 px-6 font-mono text-slate-500 font-bold">
                  15 July 2026
                </td>

                <td className="py-3.5 px-6 font-mono text-slate-500 font-bold">
                  {formatHour(book.startTime)} - {formatHour(book.endTime)}
                </td>

                <td className="py-3.5 px-6 text-slate-500 font-bold">
                  IT Department
                </td>

                <td className="py-3.5 px-6">
                  {getStatusBadge(book.status)}
                </td>

                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => onSelect(book)}
                    className="px-2.5 py-1.5 border border-slate-200 hover:border-[#5B5BD6]/45 hover:bg-[#5B5BD6]/5 text-slate-500 hover:text-[#5B5BD6] rounded-lg transition-all flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Booking</span>
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

export default BookingTable;
