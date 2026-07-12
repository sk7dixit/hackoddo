import React, { useState, useEffect } from 'react';
import { Calendar, Users, X, Info } from 'lucide-react';
import ConflictAlert from './ConflictAlert';

interface Resource {
  id: string;
  name: string;
  category: string;
  location: string;
}

interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  startTime: number;
  endTime: number;
  title: string;
  status: 'confirmed' | 'maintenance' | 'pending';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  defaultStartHour: number;
  bookings: Booking[];
  onConfirm: (bookingData: {
    resourceId: string;
    resourceName: string;
    startTime: number;
    endTime: number;
    title: string;
    attendees: number;
    notes?: string;
  }) => void;
}

export const BookingModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  resource,
  defaultStartHour,
  bookings,
  onConfirm
}) => {
  const [title, setTitle] = useState('Sprint Planning Meeting');
  const [date, setDate] = useState('2026-07-15');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(10);
  const [attendees, setAttendees] = useState(12);
  const [notes, setNotes] = useState('');
  
  // Conflict state
  const [conflictBooking, setConflictBooking] = useState<Booking | null>(null);

  // Set default hours on load
  useEffect(() => {
    if (defaultStartHour) {
      setStartHour(defaultStartHour);
      setEndHour(defaultStartHour + 1);
    }
  }, [defaultStartHour, isOpen]);

  // Check overlap whenever resource, date, or hours change
  useEffect(() => {
    if (!resource || !isOpen) return;

    // Check overlap
    const conflict = bookings.find(b => 
      b.resourceId === resource.id && 
      ((startHour >= b.startTime && startHour < b.endTime) ||
       (endHour > b.startTime && endHour <= b.endTime) ||
       (startHour <= b.startTime && endHour >= b.endTime))
    );

    if (conflict) {
      setConflictBooking(conflict);
    } else {
      setConflictBooking(null);
    }
  }, [resource, startHour, endHour, bookings, isOpen]);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictBooking) return; // Prevent confirming conflicts

    onConfirm({
      resourceId: resource.id,
      resourceName: resource.name,
      startTime: startHour,
      endTime: endHour,
      title,
      attendees,
      notes
    });
    
    // Reset states
    setTitle('Sprint Planning Meeting');
    setNotes('');
    onClose();
  };

  const handleSelectAlternative = (start: number, end: number) => {
    setStartHour(start);
    setEndHour(end);
    setConflictBooking(null);
  };

  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  const formatHour = (h: number) => {
    if (h < 12) return `${h}:00 AM`;
    if (h === 12) return `12:00 PM`;
    return `${h - 12}:00 PM`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-y-auto max-h-[90vh] shadow-2xl max-w-md w-full relative p-5 space-y-3.5 animate-slide-up font-semibold text-xs text-slate-700 font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 mt-3">Book Shared Resource</h3>
          <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
            Reserve company slots on behalf of the Information Technology department.
          </p>
        </div>

        {/* Selected resource tag */}
        <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl">
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Resource selected</span>
          <span className="font-extrabold text-slate-800 block mt-1.5 leading-none">{resource.name}</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Location: {resource.location}</span>
        </div>

        {/* Conflict overlay warning */}
        {conflictBooking && (
          <ConflictAlert
            resourceName={resource.name}
            conflictTitle={conflictBooking.title}
            conflictTime={`${formatHour(conflictBooking.startTime)} - ${formatHour(conflictBooking.endTime)}`}
            onSelectAlternative={handleSelectAlternative}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Booking title/purpose */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Meeting Purpose</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="glass-input text-xs font-semibold"
            />
          </div>

          {/* Time selectors row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Start Hour</label>
              <select
                value={startHour}
                onChange={e => setStartHour(Number(e.target.value))}
                className="glass-input cursor-pointer"
              >
                {hours.slice(0, -1).map(h => (
                  <option key={h} value={h}>{formatHour(h)}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">End Hour</label>
              <select
                value={endHour}
                onChange={e => setEndHour(Number(e.target.value))}
                className="glass-input cursor-pointer"
              >
                {hours.filter(h => h > startHour).map(h => (
                  <option key={h} value={h}>{formatHour(h)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendee Count */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Attendees Count</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={attendees}
              onChange={e => setAttendees(Number(e.target.value))}
              className="glass-input text-xs font-semibold"
            />
          </div>

          {/* Notes textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Special Notes</label>
            <textarea
              placeholder="Provide special requests or details..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="glass-input resize-none w-full text-xs font-semibold"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={conflictBooking !== null}
              className="px-4.5 py-2.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer shadow-sm shadow-[#5B5BD6]/10 disabled:opacity-40 disabled:pointer-events-none"
            >
              Confirm Booking
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default BookingModal;
