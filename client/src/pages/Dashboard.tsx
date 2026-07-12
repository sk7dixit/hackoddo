import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { SvgDonutChart, SvgBarChart } from '../components/CustomChart';
import { 
  Laptop, 
  Handshake, 
  CalendarDays, 
  Wrench, 
  Clock,
  Sparkles,
  ArrowRight,
  BellRing
} from 'lucide-react';
import { Asset, Allocation, Booking } from '../../../server/src/types';

interface DashboardStats {
  availableAssets: number;
  allocatedAssets: number;
  maintenance: number;
  bookingsToday: number;
  overdue: number;
}

export const Dashboard: React.FC = () => {
  const { currentUser, activeRole, refreshTrigger, setActiveTab } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myAssets, setMyAssets] = useState<Asset[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await api.get<DashboardStats>('/dashboard');
        setStats(statsData);

        if (currentUser) {
          // Fetch all assets & filter down to what is allocated to current user
          const allAssets = await api.get<Asset[]>('/assets');
          const allAllocations = await api.get<Allocation[]>('/allocations');
          
          const myAllocatedIds = allAllocations
            .filter(a => a.employeeId === currentUser.id && a.status === 'approved')
            .map(a => a.assetId);
            
          const myAssigned = allAssets.filter(a => myAllocatedIds.includes(a.id));
          setMyAssets(myAssigned);

          // Fetch bookings and filter down to user's bookings
          const allBookings = await api.get<Booking[]>('/bookings');
          const myUpcoming = allBookings
            .filter(b => b.employeeId === currentUser.id && b.status === 'confirmed')
            .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          setMyBookings(myUpcoming);
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, activeRole, refreshTrigger]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm font-medium tracking-wide">Loading workspace data...</span>
        </div>
      </div>
    );
  }

  // Define metrics cards configuration
  const metrics = [
    { label: 'Available Assets', value: stats.availableAssets, icon: Laptop, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15', tab: 'assets' },
    { label: 'Allocated Assets', value: stats.allocatedAssets, icon: Handshake, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/15', tab: 'allocations' },
    { label: 'Open Repairs', value: stats.maintenance, icon: Wrench, color: 'text-orange-400 bg-orange-500/10 border-orange-500/15', tab: 'maintenance' },
    { label: 'Bookings Today', value: stats.bookingsToday, icon: CalendarDays, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15', tab: 'bookings' },
    { label: 'Overdue Returns', value: stats.overdue, icon: Clock, color: 'text-rose-400 bg-rose-500/10 border-rose-500/15', tab: 'allocations' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* 1. Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <GlassCard 
              key={idx} 
              hoverable
              onClick={() => setActiveTab(m.tab)}
              className="cursor-pointer border-zinc-800/40 relative overflow-hidden group"
            >
              {/* Subtle background glow */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-violet-600/5 group-hover:scale-125 transition-transform duration-300 blur-xl" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white font-mono">{m.value}</span>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-1">{m.label}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 2. Main Content Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual Charts (2/3 width on large) */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="border-zinc-800/50 bg-zinc-900/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-violet-400" />
              Inventory Allocation Share
            </h3>
            <div className="py-4">
              <SvgDonutChart 
                data={[
                  { label: 'Available Physical', value: stats.availableAssets, color: '#10b981' },
                  { label: 'Allocated Custody', value: stats.allocatedAssets, color: '#6366f1' },
                  { label: 'Under Maintenance', value: stats.maintenance, color: '#f97316' },
                  { label: 'Overdue Pending', value: stats.overdue, color: '#f43f5e' }
                ]} 
              />
            </div>
          </GlassCard>

          <GlassCard className="border-zinc-800/50 bg-zinc-900/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
              Operational Status Check
            </h3>
            <div className="py-2">
              <SvgBarChart 
                data={[
                  { label: 'Available', value: stats.availableAssets },
                  { label: 'Allocated', value: stats.allocatedAssets },
                  { label: 'Repairing', value: stats.maintenance },
                  { label: 'Overdue', value: stats.overdue },
                  { label: 'Booked Today', value: stats.bookingsToday }
                ]} 
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column: User specific views or alerts */}
        <div className="space-y-8">
          {/* Employee/General View: "My Assigned Assets" */}
          {activeRole === 'employee' && (
            <GlassCard className="border-zinc-800/50 bg-zinc-900/40 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white mb-4 uppercase text-zinc-400 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-violet-400" />
                  My Active Hardware ({myAssets.length})
                </h3>
                
                {myAssets.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center italic">No assets allocated to you.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {myAssets.map(asset => (
                      <div key={asset.id} className="p-3 bg-zinc-950/40 border border-zinc-800/60 rounded-xl flex items-center justify-between text-xs hover:border-violet-500/25 transition-all">
                        <div>
                          <span className="font-semibold text-zinc-200">{asset.name}</span>
                          <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">{asset.qrCode}</p>
                        </div>
                        <span className="badge badge-allocated">In Custody</span>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="font-bold text-sm tracking-tight text-white mt-8 mb-4 uppercase text-zinc-400 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-cyan-400" />
                  My Scheduled Bookings ({myBookings.length})
                </h3>

                {myBookings.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center italic">No upcoming bookings scheduled.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {myBookings.slice(0, 3).map(book => (
                      <div key={book.id} className="p-3 bg-zinc-950/40 border border-zinc-800/60 rounded-xl text-xs hover:border-cyan-500/25 transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-zinc-200 truncate">{book.title}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold uppercase tracking-wider">Booked</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          {new Date(book.startTime).toLocaleDateString()} | {new Date(book.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(book.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-zinc-800/40 mt-6">
                <button
                  onClick={() => setActiveTab('assets')}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 group py-1"
                >
                  Request Asset / Booking
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </GlassCard>
          )}

          {/* Admin / Manager View: Urgent Actions Needed */}
          {(activeRole === 'admin' || activeRole === 'asset_manager') && (
            <GlassCard className="border-zinc-800/50 bg-zinc-900/40 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white mb-4 uppercase text-zinc-400 flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-violet-400" />
                  Management Priority Items
                </h3>

                <div className="space-y-4">
                  {stats.overdue > 0 && (
                    <div className="p-3.5 bg-rose-500/5 border border-rose-500/15 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
                        <Clock className="w-4 h-4" />
                        <span>Overdue Assets Alert</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        There are <span className="text-white font-semibold">{stats.overdue}</span> asset allocations that have passed their expected return date. Please coordinate returns.
                      </p>
                      <button 
                        onClick={() => setActiveTab('allocations')}
                        className="text-[10px] text-rose-400 font-extrabold uppercase hover:underline mt-2.5 flex items-center gap-1"
                      >
                        Inspect Overdues <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {stats.maintenance > 0 && (
                    <div className="p-3.5 bg-orange-500/5 border border-orange-500/15 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-orange-400 font-bold mb-1">
                        <Wrench className="w-4 h-4" />
                        <span>Pending Maintenance tickets</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        There are <span className="text-white font-semibold">{stats.maintenance}</span> reported hardware issues waiting for technician dispatch or approval.
                      </p>
                      <button 
                        onClick={() => setActiveTab('maintenance')}
                        className="text-[10px] text-orange-400 font-extrabold uppercase hover:underline mt-2.5 flex items-center gap-1"
                      >
                        Dispatch Technicians <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {stats.overdue === 0 && stats.maintenance === 0 && (
                    <div className="py-12 text-center text-zinc-500 italic">
                      All assets and maintenance operations are currently up to date!
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
