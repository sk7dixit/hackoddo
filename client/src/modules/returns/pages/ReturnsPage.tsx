import React, { useEffect, useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import { toast } from '../../../components/Toast';
import { 
  Plus, 
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Calendar,
  Clipboard,
  ShieldAlert,
  Clock,
  ChevronRight
} from 'lucide-react';

interface ReturnRequest {
  id: string;
  assetId: string;
  employeeId: string;
  status: 'pending' | 'approved';
  reportedCondition: string;
  verifiedCondition?: string;
  notes?: string;
  date: string;
}

const CONDITION_BADGES: Record<string, string> = {
  Excellent: 'badge-available',
  Good: 'badge-available',
  'Needs Repair': 'badge-maintenance',
  Damaged: 'badge-danger'
};

const STATUS_BADGES: Record<string, string> = {
  pending: 'badge-reserved',
  approved: 'badge-available'
};

const STATUS_LABELS: Record<string, string> = {
  pending: '🟡 Pending',
  approved: '🟢 Verified'
};

export const ReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // New Return form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssetId, setNewAssetId] = useState('');
  const [newEmpId, setNewEmpId] = useState('Rahul');
  const [newCondition, setNewCondition] = useState('Good');

  // Verify Return form
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedRet, setSelectedRet] = useState<ReturnRequest | null>(null);
  const [verifiedCondition, setVerifiedCondition] = useState('Good');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const employeesList = ['Rahul', 'Shashwat', 'Priya', 'Aman', 'Sneha', 'Vikram', 'Amit', 'Kavita', 'Rohit', 'Pooja'];

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/returns');
        const data = await res.json();
        if (res.ok) {
          setReturns(data);
        }
      } catch (e) {
        toast.error('Failed to load returns registry.');
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, [refreshTrigger]);

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetId || !newEmpId) {
      toast.error('Please enter an Asset ID.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: newAssetId, employeeId: newEmpId, condition: newCondition })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Return request submitted for ${newAssetId}. Waiting manager verification.`);
        setShowCreateModal(false);
        setNewAssetId('');
        setNewEmpId('Rahul');
        setNewCondition('Good');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error(data.error || 'Failed to submit return request.');
      }
    } catch (e) {
      toast.error('Server error during return creation.');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRet) return;

    try {
      const res = await fetch(`http://localhost:5000/api/returns/${selectedRet.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          verifiedCondition,
          notes: verificationNotes
        })
      });

      if (res.ok) {
        toast.success(`Verification complete. Asset ${selectedRet.assetId} is now ${
          verifiedCondition === 'Needs Repair' || verifiedCondition === 'Damaged' ? 'under maintenance' : 'available'
        }.`);
        setShowVerifyModal(false);
        setSelectedRet(null);
        setVerificationNotes('');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Failed to submit verification.');
      }
    } catch (e) {
      toast.error('Server connection error.');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setConditionFilter('');
    setDateFilter('');
  };

  // KPI Calculations
  const pendingCount = returns.filter(r => r.status === 'pending').length;
  const verifiedCount = returns.filter(r => r.status === 'approved').length;
  const inspectionCount = returns.filter(r => r.status === 'pending' && r.reportedCondition !== 'Excellent').length;
  const rejectedCount = 0; // Mock rejected count (standard returns cannot be rejected but are routed to repair)

  // Filters logic
  const filteredReturns = returns.filter(r => {
    const matchesSearch = 
      r.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesCondition = !conditionFilter || r.reportedCondition === conditionFilter;
    const matchesDate = !dateFilter || r.date.startsWith(dateFilter);

    return matchesSearch && matchesStatus && matchesCondition && matchesDate;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Asset Returns Registry
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">Coordinate returned hardware, verify physical conditions, and release back to stock</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Return Request</span>
        </button>
      </div>

      {/* KPI Cards Grid - Compact 100px */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending Returns</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-2">{pendingCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Verified Today</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-2">{verifiedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Under Inspection</span>
          <span className="text-2xl font-black text-blue-600 font-mono mt-2">{inspectionCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Rejected</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2">{rejectedCount}</span>
        </GlassCard>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] border-slate-200 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Asset ID or Employee..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-full focus:ring-[#5B5BD6]/10"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Verified</option>
          </select>

          {/* Condition */}
          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Conditions</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Needs Repair">Needs Repair</option>
            <option value="Damaged">Damaged</option>
          </select>

          {/* Date Picker */}
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-full text-slate-700"
            />
          </div>
        </div>

        {/* Reset button row */}
        <div className="flex justify-end pt-2 border-t border-slate-100 mt-3">
          <button
            onClick={handleResetFilters}
            className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-bold">Loading returns...</div>
        ) : filteredReturns.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <span className="text-4xl block">📦</span>
            <div>
              <h4 className="text-sm font-bold text-slate-800">No Return Requests</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">There are currently no return requests reported.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              File Return Request
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Return ID</th>
                  <th className="py-3 px-4">Asset Code</th>
                  <th className="py-3 px-4">Returned By</th>
                  <th className="py-3 px-4">Reported Condition</th>
                  <th className="py-3 px-4">Date Reported</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-slate-650">
                {filteredReturns.map(ret => (
                  <tr key={ret.id} className="hover:bg-slate-50 transition-colors">
                    {/* Return ID in Purple Bold Mono */}
                    <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{ret.id}</td>
                    
                    {/* Asset ID in Dark Bold Mono */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{ret.assetId}</td>
                    
                    <td className="py-3 px-4 text-slate-700">{ret.employeeId}</td>
                    
                    {/* Condition badge */}
                    <td className="py-3 px-4">
                      <span className={`badge ${CONDITION_BADGES[ret.reportedCondition] || 'badge-neutral'}`}>
                        {ret.reportedCondition}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ret.date).toLocaleDateString()}
                    </td>
                    
                    {/* Dot status badge */}
                    <td className="py-3 px-4">
                      <span className={`badge ${STATUS_BADGES[ret.status]}`}>
                        {STATUS_LABELS[ret.status]}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      {ret.status === 'pending' ? (
                        <button
                          onClick={() => {
                            setSelectedRet(ret);
                            setVerifiedCondition(ret.reportedCondition);
                            setShowVerifyModal(true);
                          }}
                          className="btn-secondary py-1 px-3 text-[10.5px] font-bold text-[#5B5BD6] border-[#5B5BD6]/20 hover:bg-[#5B5BD6]/5 transition-all inline-flex items-center gap-1"
                        >
                          <span>Verify Condition</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">Verified ({ret.verifiedCondition})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* MODAL 1: CREATE REQUEST */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-2">
              File Asset Return
            </h3>

            <form onSubmit={handleCreateReturn} className="space-y-4 text-xs font-semibold">
              {/* Asset ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">Asset ID Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AF-0012"
                  value={newAssetId}
                  onChange={e => setNewAssetId(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              {/* Custodian & Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Employee Custodian</label>
                  <select
                    value={newEmpId}
                    onChange={e => setNewEmpId(e.target.value)}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {employeesList.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Reported Condition</label>
                  <select
                    value={newCondition}
                    onChange={e => setNewCondition(e.target.value)}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>

              {/* Modal controls */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL 2: VERIFY REQUEST */}
      {showVerifyModal && selectedRet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-2">
              <Clipboard className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Verify Asset Condition
            </h3>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
              <p>Asset ID: <strong className="text-slate-900 font-mono">{selectedRet.assetId}</strong></p>
              <p>Reported Holder: <strong className="text-slate-900">{selectedRet.employeeId}</strong></p>
              <p>Reported Condition: <strong className="text-amber-700">{selectedRet.reportedCondition}</strong></p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs font-semibold">
              {/* Actual Inspected Condition */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Actual Inspected Condition</label>
                <select
                  value={verifiedCondition}
                  onChange={e => setVerifiedCondition(e.target.value)}
                  className="glass-input text-xs cursor-pointer bg-white text-slate-700 font-bold"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Needs Repair">Needs Repair (Decommission to Repair Lab)</option>
                  <option value="Damaged">Damaged (Decommission to Repair Lab)</option>
                </select>
              </div>

              {/* Inspection Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Inspection Audit Notes</label>
                <textarea
                  placeholder="Details on scratch levels, battery health, or component tests..."
                  value={verificationNotes}
                  onChange={e => setVerificationNotes(e.target.value)}
                  className="glass-input text-xs h-20 resize-none font-semibold text-slate-700"
                />
              </div>

              {(verifiedCondition === 'Needs Repair' || verifiedCondition === 'Damaged') && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] text-rose-700 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Asset will automatically transition to 'under_maintenance' status.</span>
                </div>
              )}

              {/* Modal controls */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowVerifyModal(false); setSelectedRet(null); }}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  Submit Inspection
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default ReturnsPage;
