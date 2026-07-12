import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingSummaryCards from './components/BookingSummaryCards';
import ResourceCategoryGrid from './components/ResourceCategoryGrid';
import BookingCalendar from './components/BookingCalendar';
import BookingTable from './components/BookingTable';
import BookingModal from './components/BookingModal';
import BookingDrawer from './components/BookingDrawer';
import DepartmentSchedule from './components/DepartmentSchedule';
import BookingAnalytics from './components/BookingAnalytics';
import { toast } from '../../../components/Toast';
import { CalendarDays, LayoutGrid, List } from 'lucide-react';

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

export const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'agenda'>('timeline');
  
  // Selected slot state for modal
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedStartHour, setSelectedStartHour] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selected booking for details drawer
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Mock Bookable Resources Directory
  const resources: Resource[] = [
    { id: 'res-1', name: 'Meeting Room Alpha (12-Seater)', category: 'Meeting Rooms', location: 'Building A, 3rd Floor' },
    { id: 'res-2', name: 'Meeting Room Beta (6-Seater)', category: 'Meeting Rooms', location: 'Building A, 2nd Floor' },
    { id: 'res-3', name: 'Tesla Model Y Utility Car', category: 'Company Vehicles', location: 'HQ Garage, Reserved Slot #4' },
    { id: 'res-4', name: 'EPSON Projector #1', category: 'Projectors', location: 'IT Department Storage' },
    { id: 'res-5', name: 'Dell UltraSharp 34" Monitor', category: 'Testing Devices', location: 'Lab Desk #3' }
  ];

  // Mock Reservations state (to support additions/deletions)
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'BK-1001', resourceId: 'res-1', resourceName: 'Meeting Room Alpha (12-Seater)', startTime: 10, endTime: 12, title: 'Sprint Planning Meeting', status: 'confirmed' },
    { id: 'BK-1002', resourceId: 'res-1', resourceName: 'Meeting Room Alpha (12-Seater)', startTime: 14, endTime: 16, title: 'UX Redesign Review', status: 'confirmed' },
    { id: 'BK-1003', resourceId: 'res-2', resourceName: 'Meeting Room Beta (6-Seater)', startTime: 11, endTime: 12, title: 'IT Budget sync', status: 'confirmed' },
    { id: 'BK-1004', resourceId: 'res-3', resourceName: 'Tesla Model Y Utility Car', startTime: 13, endTime: 16, title: 'Hardware Delivery courier', status: 'confirmed' },
    { id: 'BK-1005', resourceId: 'res-4', resourceName: 'EPSON Projector #1', startTime: 16, endTime: 17, title: 'Maintenance diagnostic', status: 'maintenance' }
  ]);

  const handleSelectSlot = (res: Resource, hour: number) => {
    setSelectedResource(res);
    setSelectedStartHour(hour);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (data: {
    resourceId: string;
    resourceName: string;
    startTime: number;
    endTime: number;
    title: string;
    attendees: number;
    notes?: string;
  }) => {
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      resourceId: data.resourceId,
      resourceName: data.resourceName,
      startTime: data.startTime,
      endTime: data.endTime,
      title: data.title,
      status: 'confirmed'
    };

    setBookings(prev => [...prev, newBooking]);
    toast.success(`Successfully reserved ${data.resourceName} for ${data.title}!`);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    toast.success(`Booking ${id} successfully cancelled.`);
    setSelectedBooking(null);
  };

  // Filter resources based on category selection
  const filteredResources = resources.filter(res => 
    selectedCategory === 'all' || res.category === selectedCategory
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-605 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">Resource Booking</span>
      </div>

      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resource Bookings</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Reserve conference rooms, vehicles, and test hardware devices on behalf of your department staff
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-xl text-slate-650 self-start font-sans">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
              viewMode === 'timeline' ? 'bg-white shadow-xs text-slate-800' : 'hover:bg-slate-50 text-slate-500'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
              viewMode === 'agenda' ? 'bg-white shadow-xs text-slate-800' : 'hover:bg-slate-50 text-slate-500'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Agenda</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <BookingSummaryCards />

      {viewMode === 'timeline' ? (
        <>
          {/* Categories Grid (Only for Timeline) */}
          <ResourceCategoryGrid 
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Interactive Calendar grid */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Timeline calendar scheduler
            </span>
            <BookingCalendar
              resources={filteredResources}
              bookings={bookings}
              onSelectSlot={handleSelectSlot}
            />
          </div>
        </>
      ) : (
        /* Agenda View Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Department Bookings Ledger
            </span>
            {bookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-450">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-800">No Reservations Scheduled</h3>
                  <p className="text-[10.5px] text-slate-450 font-semibold">Your department has no resource bookings today.</p>
                </div>
              </div>
            ) : (
              <BookingTable 
                bookings={bookings} 
                onSelect={setSelectedBooking} 
              />
            )}
          </div>
          <div>
            <DepartmentSchedule />
          </div>
        </div>
      )}

      {/* Utilization and heatmap analytics */}
      <BookingAnalytics />

      {/* Drawer */}
      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onCancel={handleCancelBooking}
      />

      {/* Booking modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={selectedResource}
        defaultStartHour={selectedStartHour}
        bookings={bookings}
        onConfirm={handleConfirmBooking}
      />

    </div>
  );
};

export default Bookings;
