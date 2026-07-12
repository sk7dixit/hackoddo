import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

export const BookingWidget: React.FC = () => {
  const navigate = useNavigate();

  const bookings = [
    {
      title: 'Sprint Planning meeting',
      resource: 'Meeting Room Alpha',
      time: '10:00 AM - 11:30 AM',
      location: 'Building A, 3rd Floor',
      status: 'Confirmed'
    },
    {
      title: 'Product design review',
      resource: 'Conference Hall',
      time: '02:00 PM - 03:30 PM',
      location: 'Building B, 1st Floor',
      status: 'Confirmed'
    },
    {
      title: 'Dev Workshop Session',
      resource: 'EPSON Projector #1',
      time: '04:00 PM - 05:30 PM',
      location: 'Engineering Lab',
      status: 'Confirmed'
    }
  ];

  // Dummy mini calendar days (IT department timeline context)
  const currentDay = new Date().getDate();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    return d;
  });

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 flex flex-col h-full justify-between">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Shared spaces</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Resource Bookings</h4>
        </div>
        <button
          onClick={() => navigate('/department-head/bookings')}
          className="px-2.5 py-1.5 rounded-lg bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white text-[10px] font-bold transition-colors flex items-center gap-1 shadow-sm shadow-[#5B5BD6]/10"
        >
          <Plus className="w-3 h-3" />
          <span>Book Resource</span>
        </button>
      </div>

      {/* Mini Calendar Row */}
      <div className="grid grid-cols-7 gap-1.5 text-center bg-slate-50 border border-slate-150 p-2 rounded-xl">
        {days.map((day, idx) => {
          const isToday = day.getDate() === currentDay;
          return (
            <div
              key={idx}
              className={`p-1.5 rounded-lg transition-all flex flex-col justify-center ${
                isToday 
                  ? 'bg-[#5B5BD6] text-white shadow-sm shadow-[#5B5BD6]/20' 
                  : 'text-slate-500 hover:bg-slate-100/50'
              }`}
            >
              <span className="text-[9px] uppercase font-bold tracking-tight block">
                {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
              </span>
              <span className="text-xs font-black font-mono mt-0.5 block">
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bookings timeline */}
      <div className="space-y-3.5 flex-grow mt-4 overflow-y-auto max-h-[180px] pr-1">
        {bookings.map((book, idx) => (
          <div key={idx} className="flex gap-3 text-xs font-semibold text-slate-700 bg-slate-50/50 border border-slate-150 rounded-xl p-3.5 relative overflow-hidden group hover:border-[#5B5BD6]/30 hover:bg-white transition-all">
            {/* Status bar Left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />

            <div className="space-y-1.5 flex-1 pl-1">
              <span className="font-extrabold text-slate-800 block text-xs truncate">
                {book.title}
              </span>
              <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[10.5px] text-slate-500 font-semibold mt-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{book.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{book.resource}</span>
                </div>
              </div>
            </div>

            <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 self-start">
              {book.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingWidget;
