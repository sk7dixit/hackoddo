import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { Booking, Asset, Category, Employee } from '../../../server/src/types';

export const Bookings: React.FC = () => {
  const { currentUser, refreshTrigger, triggerRefresh } = useApp();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Selected resource filter for the schedule list
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    resourceId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    notes: '',
  });

  // UX Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, assetsData, catsData, empsData] = await Promise.all([
          api.get<Booking[]>('/bookings'),
          api.get<Asset[]>('/assets'),
          api.get<Category[]>('/categories'),
          api.get<Employee[]>('/employees')
        ]);
        setBookings(booksData);
        setCategories(catsData);
        setEmployees(empsData);

        // Filter resources only (category.type === 'resource')
        const resourceCats = catsData.filter(c => c.type === 'resource').map(c => c.id);
        const resourceAssets = assetsData.filter(a => resourceCats.includes(a.categoryId));
        setResources(resourceAssets);

        // Pre-select first resource in form
        if (resourceAssets.length > 0 && !bookingForm.resourceId) {
          setBookingForm(f => ({ ...f, resourceId: resourceAssets[0].id }));
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch bookings data');
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setSuccess(msg);
      setError(null);
    } else {
      setError(msg);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.resourceId || !bookingForm.title || !bookingForm.date) {
      showFeedback('error', 'Title, Resource and Date are required.');
      return;
    }

    // Combine Date and Time inputs into ISO Strings
    const startIso = new Date(`${bookingForm.date}T${bookingForm.startTime}`).toISOString();
    const endIso = new Date(`${bookingForm.date}T${bookingForm.endTime}`).toISOString();

    if (new Date(startIso).getTime() >= new Date(endIso).getTime()) {
      showFeedback('error', 'Booking Start Time must be strictly before End Time.');
      return;
    }

    try {
      await api.post('/bookings', {
        resourceId: bookingForm.resourceId,
        title: bookingForm.title,
        startTime: startIso,
        endTime: endIso,
        notes: bookingForm.notes
      });
      
      showFeedback('success', 'Resource slot booked successfully!');
      setShowAddForm(false);
      setBookingForm(f => ({
        ...f,
        title: '',
        notes: ''
      }));
      triggerRefresh();
    } catch (e: any) {
      // Handles overlap and other errors directly
      showFeedback('error', e.message);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      showFeedback('success', 'Booking cancelled.');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Filter bookings based on selected resource filter
  const filteredBookings = bookings
    .filter(b => b.status === 'confirmed')
    .filter(b => !selectedResourceId || b.resourceId === selectedResourceId)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Feedback Banner alerts */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-1">Scheduling Conflict</span>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Selector & actions row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Resource Filter */}
        <div className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-900 px-3.5 py-2.5 rounded-xl text-xs max-w-xs">
          <CalendarDays className="w-4 h-4 text-zinc-500" />
          <select
            value={selectedResourceId}
            onChange={e => setSelectedResourceId(e.target.value)}
            className="bg-transparent border-none text-zinc-300 focus:outline-none cursor-pointer w-full"
          >
            <option value="">All Scheduled Resources</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Schedule Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-3"
        >
          <Plus className="w-4 h-4" />
          <span>Book Shared Resource</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Bookings Timeline List (2/3 width) */}
        <div className={`space-y-4 ${showAddForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <GlassCard className="border-zinc-800/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
              Upcoming Reservations Calendar List ({filteredBookings.length})
            </h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredBookings.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 italic">
                  No confirmed bookings scheduled for this filter.
                </div>
              ) : (
                filteredBookings.map(book => {
                  const res = resources.find(r => r.id === book.resourceId);
                  const booker = employees.find(e => e.id === book.employeeId);
                  const isOwnBooking = book.employeeId === currentUser?.id;

                  const start = new Date(book.startTime);
                  const end = new Date(book.endTime);
                  
                  return (
                    <div 
                      key={book.id} 
                      className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-800 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-200 text-sm">{book.title}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                            {res?.name.split(' ')[0] || 'Resource'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            {start.toLocaleDateString()} | {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                            {res?.location || 'Conference Area'}
                          </span>
                        </div>

                        {book.notes && (
                          <p className="text-[11px] text-zinc-500 italic bg-zinc-900/10 p-2 rounded border border-zinc-900/50 mt-1 max-w-lg">
                            "{book.notes}"
                          </p>
                        )}
                        
                        <p className="text-[10px] text-zinc-600 font-medium">
                          Scheduled by: {booker?.name || 'Employee'}
                        </p>
                      </div>

                      {/* Cancel action */}
                      {isOwnBooking && (
                        <button
                          onClick={() => handleCancelBooking(book.id)}
                          className="text-rose-500 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-lg transition-all self-end sm:self-center"
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Book Resource Form Panel */}
        {showAddForm && (
          <GlassCard className="border-zinc-800/50 bg-zinc-900/40 lg:col-span-1 border-t-cyan-500/40 border-t-2 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm tracking-tight text-white uppercase text-zinc-400 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-cyan-400" />
                Schedule Booking
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Resource to book</label>
                <select
                  value={bookingForm.resourceId}
                  onChange={e => setBookingForm({ ...bookingForm, resourceId: e.target.value })}
                  className="glass-input text-xs cursor-pointer bg-zinc-950"
                >
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.location})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Meeting / Purpose Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Quarter Sync"
                  value={bookingForm.title}
                  onChange={e => setBookingForm({ ...bookingForm, title: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Booking Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.date}
                  onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Start Time</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.startTime}
                    onChange={e => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">End Time</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.endTime}
                    onChange={e => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Additional Notes</label>
                <textarea
                  placeholder="Add details, special equipment requirements..."
                  value={bookingForm.notes}
                  onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="glass-input text-xs h-20 resize-none"
                />
              </div>

              <div className="bg-zinc-950/30 p-3 rounded-lg border border-zinc-800 flex gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Real-time collision checks are executed. Conflicting reservations will trigger a warning.
                </p>
              </div>

              <button type="submit" className="w-full btn-primary text-xs py-3 mt-2">
                Confirm Reservation Slot
              </button>
            </form>
          </GlassCard>
        )}

      </div>
    </div>
  );
};

export default Bookings;
