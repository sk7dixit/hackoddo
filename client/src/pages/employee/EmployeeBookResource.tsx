import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Clock,
  User,
  Users,
  Video,
  Car,
  FileText,
  MapPin,
  RefreshCw,
  Plus,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  Building,
  Bookmark,
  CalendarDays,
  FileEdit,
  Trash2
} from "lucide-react";

export const EmployeeBookResource: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "directory" | "calendar" | "my-bookings">("dashboard");

  // Loaded Data States
  const [resources, setResources] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Booking Wizard Stepper Modal
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizResourceId, setWizResourceId] = useState("");
  const [wizDate, setWizDate] = useState("");
  const [wizStartTime, setWizStartTime] = useState("09:00");
  const [wizEndTime, setWizEndTime] = useState("10:00");
  const [wizPurpose, setWizPurpose] = useState("Project Meeting");
  const [wizParticipants, setWizParticipants] = useState(2);
  const [wizNotes, setWizNotes] = useState("");
  const [conflictError, setConflictError] = useState("");
  const [bookingSubmit, setBookingSubmit] = useState(false);

  // Reschedule dialog modal
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);
  const [reschDate, setReschDate] = useState("");
  const [reschStartTime, setReschStartTime] = useState("09:00");
  const [reschEndTime, setReschEndTime] = useState("10:00");
  const [rescheduleSubmit, setRescheduleSubmit] = useState(false);

  // Details Drawer
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [bookingTimeline, setBookingTimeline] = useState<any[]>([]);

  // Calendar tab states
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resrcRes, bookingsRes, empRes] = await Promise.all([
        api.get("/employee/resources"),
        api.get("/employee/bookings"),
        api.get("/employees")
      ]);
      setResources(resrcRes || []);
      setBookings(bookingsRes || []);
      setEmployees(empRes.value || empRes || []);
    } catch (err: any) {
      console.error("Error loading resources modules:", err);
      toast.error("Failed to load booking repository.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Run overlap pre-check on step continue
  const handleCheckOverlap = async () => {
    if (!wizResourceId || !wizDate || !wizStartTime || !wizEndTime) {
      toast.error("Please fill in Date and Time inputs.");
      return;
    }
    if (wizStartTime >= wizEndTime) {
      toast.error("Start time must be before End time.");
      return;
    }

    setConflictError("");
    try {
      // Query availability list
      const bookedList = await api.get(`/employee/resources/${wizResourceId}/availability?date=${wizDate}`);
      
      // Local conflict check
      const conflict = bookedList.some(
        (b: any) => wizStartTime < b.endTime && wizEndTime > b.startTime
      );
      if (conflict) {
        setConflictError("Time Slot Conflict: Another employee has already booked this resource during the requested hours.");
      } else {
        setWizardStep(4);
      }
    } catch (err) {
      toast.error("Failed to verify time slot availability.");
    }
  };

  // Submit booking
  const handleCreateBooking = async () => {
    setBookingSubmit(true);
    setConflictError("");
    try {
      await api.post("/employee/bookings", {
        resourceId: wizResourceId,
        date: wizDate,
        startTime: wizStartTime,
        endTime: wizEndTime,
        purpose: wizPurpose,
        participants: wizParticipants,
        additionalNotes: wizNotes
      });
      toast.success("Resource booked successfully!");
      setIsWizardOpen(false);
      resetWizard();
      fetchData();
      setActiveTab("my-bookings");
    } catch (err: any) {
      if (err.message === "Time Slot Conflict" || (err.error && err.error === "Time Slot Conflict")) {
        setConflictError("Time Slot Conflict: The requested slots overlap with an existing meeting.");
      } else {
        toast.error(err.message || "Failed to book resource.");
      }
    } finally {
      setBookingSubmit(false);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking reservation?")) return;
    try {
      await api.delete(`/employee/bookings/${id}`);
      toast.success("Booking cancelled successfully.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking.");
    }
  };

  // Reschedule Booking Submit
  const handleRescheduleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reschStartTime >= reschEndTime) {
      toast.error("Start time must be before End time.");
      return;
    }

    setRescheduleSubmit(true);
    try {
      await api.put(`/employee/bookings/${rescheduleBooking.bookingId}`, {
        date: reschDate,
        startTime: reschStartTime,
        endTime: reschEndTime,
        purpose: rescheduleBooking.purpose
      });
      toast.success("Rescheduled successfully!");
      setRescheduleBooking(null);
      fetchData();
    } catch (err: any) {
      if (err.message === "Time Slot Conflict" || (err.error && err.error === "Time Slot Conflict")) {
        toast.error("Reschedule Conflict: Overlapping time slot on the selected date.");
      } else {
        toast.error(err.message || "Failed to reschedule booking.");
      }
    } finally {
      setRescheduleSubmit(false);
    }
  };

  // Open Details Drawer
  const handleOpenDetails = async (bookingId: string) => {
    setSelectedBookingDetails({ bookingId });
    setDrawerLoading(true);
    try {
      const res = await api.get(`/employee/bookings/${bookingId}`);
      setSelectedBookingDetails(res.booking);
      setBookingTimeline(res.timeline || []);
    } catch (err) {
      toast.error("Failed to load booking details.");
      setSelectedBookingDetails(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  const resetWizard = () => {
    setWizardStep(1);
    setWizResourceId("");
    setWizDate("");
    setWizStartTime("09:00");
    setWizEndTime("10:00");
    setWizPurpose("Project Meeting");
    setWizParticipants(2);
    setWizNotes("");
    setConflictError("");
  };

  // Filters calculation
  const filteredResources = resources.filter((resrc) => {
    const matchesSearch = resrc.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resrc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resrc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // KPI Calculations
  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookingsCount = bookings.filter(b => b.date === todayStr && b.status === "confirmed").length;
  const upcomingBookingsCount = bookings.filter(b => b.date > todayStr && b.status === "confirmed").length;
  // Fallbacks: Completed counts (past dates), cancelled counts
  const cancelledBookingsCount = bookings.filter(b => b.status === "cancelled").length;
  const completedBookingsCount = bookings.filter(b => b.date < todayStr && b.status === "confirmed").length;

  // Calendar Day Rendering Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = [];
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Empty padding cells for start of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const getBookingsForDate = (date: Date) => {
    const dStr = date.toISOString().split("T")[0];
    return bookings.filter(b => b.date === dStr && b.status === "confirmed");
  };

  return (
    <div className="p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link to="/employee" className="hover:text-[#4F46E5] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4F46E5]">Shared Resource Bookings</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Resource Booking Portal
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Reserve meeting rooms, projectors, and company vehicles with instant scheduling validation.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dashboard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "directory" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Resource Directory
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "calendar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Interactive Calendar
          </button>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my-bookings" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            My Reservations
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
          <span>Syncing shared resources ledger...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* KPI metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Today's Bookings</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">{todayBookingsCount}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
                </div>

                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Upcoming Bookings</span>
                    <h3 className="text-2xl font-black text-indigo-500 mt-1 font-mono">{upcomingBookingsCount}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><Clock className="w-5 h-5" /></div>
                </div>

                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Completed</span>
                    <h3 className="text-2xl font-black text-slate-600 mt-1 font-mono">{completedBookingsCount}</h3>
                  </div>
                  <div className="p-3 bg-slate-50 text-slate-500 rounded-xl"><CalendarIcon className="w-5 h-5" /></div>
                </div>

                <div className="bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Cancelled</span>
                    <h3 className="text-2xl font-black text-rose-500 mt-1 font-mono">{cancelledBookingsCount}</h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><X className="w-5 h-5" /></div>
                </div>
              </div>

              {/* Action grid & recents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Quick actions box */}
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Quick Reservation</h3>
                    <p className="text-[10.5px] text-slate-450 font-semibold leading-relaxed">
                      Need a conference room or a vehicle? Launch the stepper wizard to pick slots and verify conflicts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetWizard();
                      setIsWizardOpen(true);
                    }}
                    className="btn-primary w-full py-2.5 flex items-center justify-center gap-1 font-bold text-xs shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Reserve Shared Resource
                  </button>
                </div>

                {/* Recent Bookings Feed */}
                <div className="md:col-span-2 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3.5 flex justify-between items-center">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      My Scheduled Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab("my-bookings")}
                      className="text-[#4F46E5] hover:underline text-[10.5px] font-bold"
                    >
                      View All
                    </button>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 font-semibold italic">
                      No scheduled resource bookings.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {bookings.slice(0, 3).map((bk) => (
                        <div
                          key={bk.bookingId}
                          className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 text-[#4F46E5] rounded-xl">
                              {bk.category === "Vehicles" ? <Car className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-800">{bk.resourceName}</h4>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
                                <span className="font-mono">{bk.date}</span>
                                <span>•</span>
                                <span className="font-mono text-slate-500">{bk.startTime} - {bk.endTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleOpenDetails(bk.bookingId)}
                            className="btn-secondary py-1.5 px-3 text-[10.5px] font-bold hover:bg-slate-205 cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Resource Directory */}
          {activeTab === "directory" && (
            <div className="space-y-6 animate-fade-in">
              {/* Category tabs & Search */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {["All", "Meeting Rooms", "Conference Halls", "Projectors", "Vehicles", "Training Rooms", "Cameras"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer transition-all ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="w-full md:w-80 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by resource, campus, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-350 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Resource Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {filteredResources.map((resrc) => (
                  <div
                    key={resrc.resourceId}
                    className="bg-white border border-[#E7ECF3] rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="w-full h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100 relative">
                        {resrc.category === "Meeting Rooms" || resrc.category === "Conference Halls" ? (
                          <Video className="w-8 h-8 text-[#4F46E5]" />
                        ) : resrc.category === "Vehicles" ? (
                          <Car className="w-8 h-8 text-amber-500" />
                        ) : (
                          <CalendarDays className="w-8 h-8 text-indigo-500" />
                        )}
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white border border-slate-100 text-[8.5px] font-bold text-slate-450 uppercase">
                          Capacity: {resrc.capacity}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase">
                          ID: {resrc.resourceId}
                        </span>
                        <h4 className="font-black text-slate-800 text-xs truncate">{resrc.resourceName}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-405 font-bold pt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{resrc.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        resetWizard();
                        setWizResourceId(resrc.resourceId);
                        setIsWizardOpen(true);
                      }}
                      className="btn-primary w-full py-2.5 text-xs font-bold shadow-sm cursor-pointer text-center"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Calendar */}
          {activeTab === "calendar" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#4F46E5]" />
                  <h3 className="font-black text-sm text-slate-850 uppercase tracking-wider">
                    Booking Calendar Ledger
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-black text-xs text-slate-800 uppercase tracking-wide min-w-[120px] text-center">
                    {currentCalendarDate.toLocaleString("default", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-3 text-center">
                {/* Weekday headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <span key={day} className="font-extrabold text-[9.5px] text-slate-400 uppercase tracking-wider">
                    {day}
                  </span>
                ))}

                {/* Days */}
                {calendarDays.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="h-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100" />;
                  }

                  const dateBookings = getBookingsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={date.toISOString()}
                      className={`h-20 p-2.5 border border-slate-100 rounded-2xl text-left flex flex-col justify-between hover:border-slate-300 transition-all ${
                        isToday ? "bg-indigo-50/30 border-indigo-100" : "bg-white"
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${isToday ? "text-[#4F46E5] font-black" : "text-slate-500"}`}>
                        {date.getDate()}
                      </span>

                      {dateBookings.length > 0 ? (
                        <div className="space-y-1">
                          {dateBookings.slice(0, 2).map((b) => (
                            <div
                              key={b.bookingId}
                              onClick={() => handleOpenDetails(b.bookingId)}
                              className="px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] text-[8.5px] font-bold border border-indigo-100 truncate cursor-pointer"
                              title={b.resourceName}
                            >
                              {b.resourceName}
                            </div>
                          ))}
                          {dateBookings.length > 2 && (
                            <span className="text-[7.5px] font-extrabold text-slate-400 uppercase block pl-1">
                              +{dateBookings.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[8px] text-slate-350 italic font-semibold">Available</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: My Reservations */}
          {activeTab === "my-bookings" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b pb-3.5">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Active Booking Reservations
                </h3>
              </div>

              {bookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                  No active scheduled reservations found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {bookings.map((bk) => (
                    <div
                      key={bk.bookingId}
                      className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">
                              ID: {bk.bookingId}
                            </span>
                            <h4 className="font-bold text-xs text-slate-850 mt-1">
                              {bk.resourceName}
                            </h4>
                          </div>
                          <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 uppercase tracking-wide">
                            {bk.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1.5 text-xs text-slate-650 font-semibold">
                          <div className="flex justify-between">
                            <span className="text-[9.5px] text-slate-400 uppercase">Date</span>
                            <span className="font-mono text-slate-800">{bk.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[9.5px] text-slate-400 uppercase">Time Slot</span>
                            <span className="font-mono text-slate-800">{bk.startTime} - {bk.endTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[9.5px] text-slate-400 uppercase">Purpose</span>
                            <span className="text-slate-800 truncate max-w-[120px]">{bk.purpose}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[10.5px] font-bold">
                        <button
                          onClick={() => {
                            setRescheduleBooking(bk);
                            setReschDate(bk.date);
                            setReschStartTime(bk.startTime);
                            setReschEndTime(bk.endTime);
                          }}
                          className="text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FileEdit className="w-3.5 h-3.5" /> Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelBooking(bk.bookingId)}
                          className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Booking Stepper Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-[95] backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-black text-slate-850 text-sm uppercase tracking-wider">
                Create Resource Reservation
              </h3>
              <span className="text-[9.5px] font-extrabold px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4F46E5] rounded-full font-mono uppercase tracking-wider">
                Step {wizardStep} of 6
              </span>
            </div>

            {/* Steps Content */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Choose Resource
                  </label>
                  <select
                    value={wizResourceId}
                    onChange={(e) => setWizResourceId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="">-- Choose Shared Resource --</option>
                    {resources.map((r) => (
                      <option key={r.resourceId} value={r.resourceId}>
                        [{r.category}] {r.resourceName} ({r.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Choose Reservation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={wizDate}
                    onChange={(e) => setWizDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={wizStartTime}
                        onChange={(e) => setWizStartTime(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={wizEndTime}
                        onChange={(e) => setWizEndTime(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {conflictError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex gap-2 text-rose-600 text-[10.5px] leading-relaxed font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{conflictError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Purpose of Reservation
                  </label>
                  <select
                    value={wizPurpose}
                    onChange={(e) => setWizPurpose(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="Project Meeting">Project Meeting</option>
                    <option value="Interview">Interview</option>
                    <option value="Training">Training</option>
                    <option value="Client Meeting">Client Meeting</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {wizardStep === 5 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={wizParticipants}
                    onChange={(e) => setWizParticipants(parseInt(e.target.value, 10))}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {wizardStep === 6 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need HDMI Projector cables / Whiteboard markers..."
                    value={wizNotes}
                    onChange={(e) => setWizNotes(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                disabled={wizardStep === 1}
                className="btn-secondary py-2 px-4 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Back
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                {wizardStep === 3 ? (
                  <button
                    onClick={handleCheckOverlap}
                    className="btn-primary py-2 px-5 text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Check Conflict & Continue
                  </button>
                ) : wizardStep < 6 ? (
                  <button
                    onClick={() => {
                      if (wizardStep === 1 && !wizResourceId) {
                        toast.error("Please choose a resource.");
                        return;
                      }
                      if (wizardStep === 2 && !wizDate) {
                        toast.error("Please pick a booking date.");
                        return;
                      }
                      setWizardStep((s) => s + 1);
                    }}
                    className="btn-primary py-2 px-5 text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleCreateBooking}
                    disabled={bookingSubmit}
                    className="btn-primary py-2 px-6 text-xs font-bold shadow-indigo-500/20 shadow-md cursor-pointer"
                  >
                    {bookingSubmit ? "Booking..." : "Book Resource"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal Dialog */}
      {rescheduleBooking && (
        <div className="fixed inset-0 bg-slate-900/40 z-[95] backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleRescheduleSave}
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-5"
          >
            <div className="border-b pb-3">
              <h3 className="font-black text-slate-850 text-sm uppercase tracking-wider">
                Reschedule Booking
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={reschDate}
                  onChange={(e) => setReschDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={reschStartTime}
                    onChange={(e) => setReschStartTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={reschEndTime}
                    onChange={(e) => setReschEndTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:border-slate-300 font-semibold text-xs focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={rescheduleSubmit}
                className="btn-primary py-2 px-5 text-xs font-bold shadow-sm cursor-pointer"
              >
                {rescheduleSubmit ? "Updating..." : "Reschedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Booking Details Drawer */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 bg-slate-900/40 z-[90] backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedBookingDetails(null)} />

          <div className="w-full max-w-md bg-white h-full relative z-[100] shadow-2xl flex flex-col animate-slide-left border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-none">
                    Reservation Details
                  </h3>
                  <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase mt-1.5 block">
                    ID: {selectedBookingDetails.bookingId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {drawerLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
                  <span>Loading timeline...</span>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
                    <h4 className="font-extrabold text-[10.5px] text-[#4F46E5] uppercase tracking-wide">
                      Resource Info
                    </h4>
                    <div className="space-y-2 text-xs font-semibold text-slate-650">
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-400 uppercase text-[9.5px]">Resource</span>
                        <span className="text-slate-800 font-bold">{selectedBookingDetails.resourceName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-400 uppercase text-[9.5px]">Location</span>
                        <span className="text-slate-800">{selectedBookingDetails.location}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-400 uppercase text-[9.5px]">Booking Date</span>
                        <span className="text-slate-800 font-mono">{selectedBookingDetails.date}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-400 uppercase text-[9.5px]">Time Range</span>
                        <span className="text-slate-800 font-mono">{selectedBookingDetails.startTime} - {selectedBookingDetails.endTime}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-400 uppercase text-[9.5px]">Purpose</span>
                        <span className="text-slate-800">{selectedBookingDetails.purpose}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 uppercase text-[9.5px]">Status</span>
                        <span className="text-emerald-600 uppercase tracking-wide font-extrabold">{selectedBookingDetails.status}</span>
                      </div>
                    </div>
                  </div>

                  {selectedBookingDetails.additionalNotes && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                        Additional Notes
                      </span>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-semibold text-slate-650 leading-relaxed font-sans">
                        {selectedBookingDetails.additionalNotes}
                      </div>
                    </div>
                  )}

                  {/* Progress Timeline */}
                  <div className="space-y-4 pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                      Booking Status Timeline
                    </span>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
                      {bookingTimeline.map((step, idx) => (
                        <div
                          key={idx}
                          className={`relative flex justify-between items-start text-xs font-semibold ${
                            step.done ? "text-slate-800" : "text-slate-400"
                          }`}
                        >
                          <div className={`absolute -left-[20px] top-0.5 w-[11px] h-[11px] rounded-full border-[2.5px] z-10 ${
                            step.done ? "border-[#4F46E5] bg-[#4F46E5]" : "border-slate-200 bg-white"
                          }`} />
                          
                          <div>
                            <span className="block font-bold">{step.label}</span>
                          </div>

                          {step.done && step.timestamp && (
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold mt-0.5">
                              {step.timestamp.includes("T") ? step.timestamp.split("T")[0] : step.timestamp}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="btn-secondary py-2.5 px-6 font-bold text-xs cursor-pointer"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeBookResource;
