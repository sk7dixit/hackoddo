import React from 'react';
import { Calendar, MonitorPlay, Clock, QrCode } from 'lucide-react';

interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  startTime: number;
  endTime: number;
  title: string;
  status: 'confirmed' | 'maintenance' | 'pending';
}

interface Resource {
  id: string;
  name: string;
  category: string;
  location: string;
}

interface CalendarProps {
  resources: Resource[];
  bookings: Booking[];
  onSelectSlot: (resource: Resource, hour: number) => void;
}

export const BookingCalendar: React.FC<CalendarProps> = ({ resources, bookings, onSelectSlot }) => {
  const hours = [9, 10, 11, 12, 13, 14, 15, 16];

  const formatHour = (hour: number) => {
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return `12:00 PM`;
    return `${hour - 12}:00 PM`;
  };

  const getResourceColorStyle = (category: string, status: string) => {
    if (status === 'maintenance') {
      return 'bg-slate-100 border-slate-250 text-slate-500 cursor-not-allowed';
    }
    const cat = category.toLowerCase();
    if (cat.includes('room')) {
      return 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100/60 cursor-pointer shadow-xs';
    }
    if (cat.includes('vehicle')) {
      return 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/60 cursor-pointer shadow-xs';
    }
    if (cat.includes('projector') || cat.includes('device') || cat.includes('testing')) {
      return 'bg-indigo-50 border-indigo-200 text-[#5B5BD6] hover:bg-indigo-100/60 cursor-pointer shadow-xs';
    }
    return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100/60 cursor-pointer shadow-xs';
  };

  const getSlotStatus = (resource: Resource, hour: number) => {
    const booking = bookings.find(b => 
      b.resourceId === resource.id && 
      hour >= b.startTime && 
      hour < b.endTime
    );

    if (booking) {
      return {
        isBooked: true,
        booking,
        style: getResourceColorStyle(resource.category, booking.status)
      };
    }

    return {
      isBooked: false,
      style: 'bg-emerald-50/50 hover:bg-emerald-50/90 border-emerald-100 text-emerald-600 cursor-pointer'
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)] font-semibold text-xs text-slate-700">
      
      {/* Legend Header */}
      <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <h4 className="font-extrabold text-xs text-slate-800">Timeline Slots Scheduler</h4>
        
        <div className="flex flex-wrap gap-3.5 text-[9.5px] font-bold text-slate-500 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300" />
            <span>Available</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-100 border border-purple-250" />
            <span>Meeting Rooms</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-250" />
            <span>Vehicles</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-100 border border-indigo-250" />
            <span>Projectors & Devs</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-150 border border-slate-250" />
            <span>Maintenance</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[840px] divide-y divide-slate-100">
          
          {/* Hour labels row */}
          <div className="flex bg-slate-50 border-b border-slate-200/80 font-extrabold text-slate-400 text-[9px] uppercase tracking-wider">
            <div className="w-[200px] py-3.5 px-5 border-r border-slate-200 shrink-0">Shared Resource</div>
            {hours.map(hour => (
              <div key={hour} className="flex-1 py-3.5 text-center border-r border-slate-150 last:border-r-0">
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          {resources.map(res => (
            <div key={res.id} className="flex hover:bg-slate-50/20 transition-all">
              
              {/* Resource description block */}
              <div className="w-[200px] p-4 border-r border-slate-200 shrink-0 flex flex-col justify-center gap-1">
                <span className="font-extrabold text-slate-850 block truncate">{res.name}</span>
                <span className="text-[10px] text-slate-450 block truncate leading-none mt-0.5">{res.location}</span>
              </div>

              {/* Grid cell blocks */}
              {hours.map(hour => {
                const status = getSlotStatus(res, hour);
                return (
                  <div 
                    key={hour} 
                    className="flex-1 p-2 border-r border-slate-150 last:border-r-0 flex items-stretch"
                  >
                    <div
                      onClick={() => !status.isBooked && onSelectSlot(res, hour)}
                      className={`w-full p-2.5 rounded-xl border flex flex-col justify-center text-center transition-all ${status.style}`}
                    >
                      {status.isBooked && status.booking ? (
                        <div className="space-y-0.5 truncate leading-tight">
                          <span className="text-[10px] font-black block truncate">
                            {status.booking.title}
                          </span>
                          <span className="text-[8.5px] font-bold opacity-75 uppercase tracking-wider block font-mono mt-0.5">
                            {status.booking.status === 'maintenance' ? 'Service' : 'Booked'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold block opacity-40 font-mono">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default BookingCalendar;
