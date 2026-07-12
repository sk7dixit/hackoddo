import React from 'react';
import { X, Calendar, MapPin, Clock, Users, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from '../../../../components/Toast';

interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  startTime: number;
  endTime: number;
  title: string;
  status: 'confirmed' | 'maintenance' | 'pending';
}

interface DrawerProps {
  booking: Booking | null;
  onClose: () => void;
  onCancel: (id: string) => void;
}

export const BookingDrawer: React.FC<DrawerProps> = ({ booking, onClose, onCancel }) => {
  if (!booking) return null;

  const handleReschedule = () => {
    toast.success(`Rescheduled slot request generated for ${booking.id}.`);
  };

  const handlePrint = () => {
    toast.success(`Printing booking reservation slip for ${booking.id}...`);
  };

  const formatHour = (h: number) => {
    if (h < 12) return `${h}:00 AM`;
    if (h === 12) return `12:00 PM`;
    return `${h - 12}:00 PM`;
  };

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop blur */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[480px] bg-white border-l border-slate-200 h-screen flex flex-col z-10 shadow-2xl animate-slide-left font-semibold text-xs text-slate-700">
        
        {/* Header Title */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Booking detail panel</span>
            <h3 className="font-extrabold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
              <span>Reservation:</span>
              <span className="font-mono text-[#5B5BD6] font-bold">{booking.id}</span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable details panel */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">

          {/* Section 1: Resource metadata */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Resource details
            </h4>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <MapPin className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {booking.resourceName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Capacity: 12 Persons • Block A Office Area
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Booking details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Reservation parameters
            </h4>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[11px]">
              <div>
                <span className="text-slate-450 font-bold block">Status</span>
                <div className="mt-1">{getStatusBadge(booking.status)}</div>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Date scheduled</span>
                <span className="text-slate-800 font-mono font-bold block mt-1">15 July 2026</span>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Time reserved</span>
                <span className="text-slate-800 font-mono font-bold block mt-1">
                  {formatHour(booking.startTime)} - {formatHour(booking.endTime)}
                </span>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Attendees count</span>
                <span className="text-slate-800 font-extrabold block mt-1">12 Attendees</span>
              </div>
            </div>

            <div className="flex gap-2.5 p-3.5 bg-[#5B5BD6]/4 border border-[#5B5BD6]/10 rounded-2xl text-[11px] mt-2">
              <FileText className="w-4.5 h-4.5 text-[#5B5BD6] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold text-slate-850 block">Reservation Title / Purpose</span>
                <p className="text-[#475569] font-bold leading-relaxed">"{booking.title}"</p>
              </div>
            </div>
          </div>

          {/* Section 3: Participants */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Participants List
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-extrabold text-slate-800">
              {['Rahul Verma', 'Priya Sharma', 'Aman Verma', 'Riya Gupta'].map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-150 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-[8px] text-slate-400">
                    {p.charAt(0)}
                  </div>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Timeline connected */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Reservation timeline
            </h4>
            <div className="border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-4 text-[11px]">
              
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Booking Created & Confirmed</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">By Rahul Sharma</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                  <Clock className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Email Calendar reminders sent</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">T-30 Minutes alarm</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Actions panel */}
        {booking.status === 'confirmed' && (
          <div className="p-5 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <button
              onClick={() => onCancel(booking.id)}
              className="px-4 py-2.5 border border-slate-250 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl font-bold cursor-pointer transition-colors text-xs"
            >
              Cancel Booking
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2.5 border border-slate-250 bg-white hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
              >
                Print Slip
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer transition-colors text-xs shadow-sm shadow-[#5B5BD6]/10"
              >
                Reschedule
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingDrawer;
