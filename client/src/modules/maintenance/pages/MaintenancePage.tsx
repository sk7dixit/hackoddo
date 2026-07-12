import React, { useEffect, useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  Laptop, 
  Briefcase,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  assetId: string;
  employeeId: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed' | 'resolved';
  problemDescription: string;
  technicianId?: string;
  notes?: string;
}

interface Technician {
  id: string;
  name: string;
  type: string;
}

const PRIORITY_BADGES = {
  High: 'bg-rose-50 text-rose-700 border-rose-100 px-2.5 py-0.5 rounded-full text-xs font-bold border',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100 px-2.5 py-0.5 rounded-full text-xs font-bold border',
  Low: 'bg-slate-50 text-slate-600 border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold border'
};

const STATUS_BADGES = {
  pending: 'badge-reserved',
  approved: 'badge-available',
  rejected: 'badge-danger',
  assigned: 'badge-allocated',
  in_progress: 'badge-allocated bg-blue-50 text-blue-700 border-blue-100',
  waiting_parts: 'badge-maintenance',
  completed: 'badge-available bg-teal-50 text-teal-700 border-teal-100',
  resolved: 'badge-available'
};

export const MaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  
  // Selection / Drawer states
  const [selectedReq, setSelectedReq] = useState<MaintenanceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchAsset, setSearchAsset] = useState<string>('');

  // Assign form
  const [selectedTechId, setSelectedTechId] = useState<string>('tech-1');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  // UX Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mntRes, techRes] = await Promise.all([
          fetch('http://localhost:5000/api/maintenance').then(r => r.json()),
          fetch('http://localhost:5000/api/maintenance/technicians').then(r => r.json())
        ]);
        setRequests(mntRes);
        setTechnicians(techRes);
      } catch (e) {
        setError('Failed to fetch maintenance requests.');
      }
    };
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedReq) {
      const updated = requests.find(r => r.id === selectedReq.id);
      if (updated) setSelectedReq(updated);
    }
  }, [requests]);

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
    }, 4500);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}/approve`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Approval request failed');
      showFeedback('success', `Repair request ${id} approved.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}/reject`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Rejection request failed');
      showFeedback('success', `Repair request ${id} rejected.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleAssign = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId: selectedTechId })
      });
      if (!res.ok) throw new Error('Technician assignment failed');
      showFeedback('success', 'Technician assigned successfully.');
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleUpdateProgress = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Progress update failed');
      showFeedback('success', `Repair state updated to ${newStatus.replace('_', ' ')}.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleResolve = async (id: string, reopen: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reopen, notes: resolutionNotes })
      });
      if (!res.ok) throw new Error('Resolution submission failed');
      
      showFeedback('success', reopen ? 'Repair ticket re-opened.' : 'Repair resolved! Asset released back to available stock.');
      setResolutionNotes('');
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // KPI calculations
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved' || r.status === 'assigned').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress' || r.status === 'waiting_parts').length;
  const resolvedCount = requests.filter(r => r.status === 'resolved').length;
  const highPriorityCount = requests.filter(r => r.priority === 'High' && r.status !== 'resolved').length;
  const totalUnderMaintenanceCount = requests.filter(r => r.status !== 'resolved' && r.status !== 'pending' && r.status !== 'rejected').length;

  // Filtering Requests
  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus.toLowerCase();
    const matchesPriority = !filterPriority || req.priority === filterPriority;
    const matchesSearch = !searchAsset || req.assetId.toLowerCase().includes(searchAsset.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Banner Feedbacks */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
          <XCircle className="w-4.5 h-4.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Header Title (28px Title, 15px Subtitle) */}
      <div className="border-b border-slate-200/60 pb-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Maintenance & Repair Center
        </h2>
        <p className="text-sm text-slate-500 font-semibold mt-1">Verify employee issues, assign technicians, track repair logs, and restore stock.</p>
      </div>

      {/* KPI Cards Row - Reduced by 20% in height (h-[100px]) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending Requests</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-2">{pendingCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Approved Requests</span>
          <span className="text-2xl font-black text-violet-650 font-mono mt-2">{approvedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">In Progress</span>
          <span className="text-2xl font-black text-blue-600 font-mono mt-2">{inProgressCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Resolved Today</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-2">{resolvedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-rose-50/50 border-rose-100">
          <span className="text-[10px] text-rose-700 font-semibold uppercase tracking-wider">High Priority</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2">{highPriorityCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Under Maintenance</span>
          <span className="text-2xl font-black text-slate-800 font-mono mt-2">{totalUnderMaintenanceCount}</span>
        </GlassCard>
      </div>

      {/* Main Grid: Directory & Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Repair Directory Table (2/3 width) */}
        <div className={`space-y-4 ${selectedReq ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          
          {/* Filters Toolbar */}
          <div className="glass-card p-4 flex flex-wrap gap-4 items-center justify-between border-slate-200 shadow-sm bg-white">
            {/* Active Tab State: Stronger active state (purple underline, purple text, bold) */}
            <div className="flex gap-4 border-b border-slate-100 pb-1 text-xs uppercase font-bold tracking-wider text-slate-400">
              {['All', 'Pending', 'Approved', 'Assigned', 'In_Progress', 'Waiting_Parts', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`pb-1.5 px-1 transition-all ${
                    (filterStatus === st) 
                      ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6] font-bold' 
                      : 'hover:text-slate-700 font-semibold'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search Asset ID..."
                value={searchAsset}
                onChange={e => setSearchAsset(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs w-40"
              />
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs bg-white text-slate-700"
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Date Reported</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 italic">No repair tickets in this category.</td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => (
                      <tr 
                        key={req.id}
                        onClick={() => setSelectedReq(req)}
                        className={`transition-colors duration-150 ${
                          selectedReq?.id === req.id ? 'bg-indigo-50/50 hover:bg-indigo-50 border-l-2 border-l-[#5B5BD6]' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{req.id}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{req.assetId}</td>
                        <td className="py-3 px-4 text-slate-700 font-semibold">{req.employeeId}</td>
                        <td className="py-3 px-4">
                          <span className={PRIORITY_BADGES[req.priority]}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-semibold">{req.date}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${STATUS_BADGES[req.status]}`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="btn-secondary py-1 px-3 text-[10.5px] font-bold text-[#5B5BD6] border-[#5B5BD6]/20 hover:bg-[#5B5BD6]/5 transition-all inline-flex items-center gap-1"
                          >
                            <span>Review</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Selected Request Details Drawer (1/3 width) */}
        {selectedReq && (
          <GlassCard className="border-slate-200 bg-white lg:col-span-1 animate-slide-up space-y-6 shadow-sm">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#5B5BD6] bg-[#5B5BD6]/5 px-2 py-0.5 border border-[#5B5BD6]/10 rounded">
                  {selectedReq.id}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-2">Asset Code: {selectedReq.assetId}</h3>
                <span className={`badge ${STATUS_BADGES[selectedReq.status]} mt-1.5`}>
                  {selectedReq.status.replace('_', ' ')}
                </span>
              </div>
              <button 
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-650 text-xs font-bold p-1 hover:bg-slate-50 rounded transition-all"
              >
                Close
              </button>
            </div>

            {/* Information Grid */}
            <div className="space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Problem Description */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Problem Description</span>
                <p className="text-slate-800 leading-relaxed font-bold italic">"{selectedReq.problemDescription}"</p>
                <div className="flex items-center gap-4 text-[10.5px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/50 font-semibold">
                  <span>Reported by: <strong className="text-slate-700">{selectedReq.employeeId}</strong></span>
                  <span>Priority: <strong className="text-rose-600">{selectedReq.priority}</strong></span>
                </div>
              </div>

              {/* Maintenance Workflows actions */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                
                {/* 1. Pending approval trigger */}
                {selectedReq.status === 'pending' && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Manager Decision</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(selectedReq.id)}
                        className="flex-1 py-2 border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(selectedReq.id)}
                        className="flex-1 py-2 bg-[#5B5BD6] text-white hover:bg-[#4d4dbf] text-xs font-bold rounded-xl transition-all shadow-[0_1px_2px_rgba(91,91,214,0.15)]"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Assign Technician trigger */}
                {selectedReq.status === 'approved' && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Assign Technician</span>
                    <div className="flex gap-2">
                      <select
                        value={selectedTechId}
                        onChange={e => setSelectedTechId(e.target.value)}
                        className="flex-1 glass-input py-2 text-xs bg-white text-slate-700 font-semibold"
                      >
                        {technicians.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(selectedReq.id)}
                        className="btn-primary py-2 px-4 text-xs font-bold"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. In Progress updates */}
                {selectedReq.status === 'assigned' && (
                  <button
                    onClick={() => handleUpdateProgress(selectedReq.id, 'in_progress')}
                    className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Initiate Repair Work</span>
                  </button>
                )}

                {/* 4. Repair state selector */}
                {(selectedReq.status === 'in_progress' || selectedReq.status === 'waiting_parts') && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Progression Update</span>
                    <div className="flex gap-2">
                      {selectedReq.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateProgress(selectedReq.id, 'waiting_parts')}
                          className="flex-1 py-2 border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold rounded-xl transition-all"
                        >
                          Waiting Parts
                        </button>
                      )}
                      {selectedReq.status === 'waiting_parts' && (
                        <button
                          onClick={() => handleUpdateProgress(selectedReq.id, 'in_progress')}
                          className="flex-1 py-2 border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl transition-all"
                        >
                          Resume Repair
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateProgress(selectedReq.id, 'completed')}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Final resolution / Close ticket */}
                {selectedReq.status === 'completed' && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Inspection Notes</span>
                    
                    <textarea
                      required
                      placeholder="Add completion notes: parts used, Diagnostic comments..."
                      value={resolutionNotes}
                      onChange={e => setResolutionNotes(e.target.value)}
                      className="glass-input text-xs h-16 w-full resize-none font-semibold text-slate-700"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolve(selectedReq.id, true)}
                        className="flex-1 py-2 border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl transition-all"
                      >
                        Reopen Ticket
                      </button>
                      <button
                        onClick={() => handleResolve(selectedReq.id, false)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Resolve & Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Info status tag */}
                {selectedReq.status === 'resolved' && (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[10.5px] text-emerald-700 font-bold space-y-1">
                    <p className="flex items-center gap-1.5 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-650" />
                      <span>Repair Resolved & Released</span>
                    </p>
                    {selectedReq.notes && <p className="text-[9.5px] text-slate-500 italic text-center font-semibold">"{selectedReq.notes}"</p>}
                  </div>
                )}

                {selectedReq.status === 'rejected' && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] text-rose-700 font-bold flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-650" />
                    <span>Repair Request Rejected</span>
                  </div>
                )}

              </div>
              
              {/* Previous history traces info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Previous Maintenance History</span>
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10.5px] text-slate-600 font-semibold">
                  <div className="flex gap-2">
                    <span className="text-slate-450 font-bold">MR-002</span>
                    <span className="text-slate-800">Keyboard Issue Resolved</span>
                  </div>
                  <div className="flex gap-2 border-t border-slate-200/60 pt-1.5">
                    <span className="text-slate-450 font-bold">MR-005</span>
                    <span className="text-slate-800">Battery Replacement Completed</span>
                  </div>
                </div>
              </div>

            </div>

          </GlassCard>
        )}

      </div>

    </div>
  );
};

export default MaintenancePage;
