import React, { useEffect, useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import { toast } from '../../../components/Toast';
import { 
  Plus, 
  ArrowRight,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Building,
  Check,
  X
} from 'lucide-react';

interface TransferRequest {
  id: string;
  assetId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  reason: string;
  status: 'requested' | 'approved' | 'rejected';
  date: string;
}

const EMPLOYEE_DEPT: Record<string, string> = {
  Rahul: 'Computer Science',
  Shashwat: 'IT',
  Priya: 'Design',
  Aman: 'HR',
  Sneha: 'Marketing',
  Vikram: 'Operations',
  Amit: 'Sales',
  Kavita: 'Finance',
  Rohit: 'Legal',
  Pooja: 'Support'
};

const STATUS_BADGES: Record<string, string> = {
  requested: 'badge-reserved',
  approved: 'badge-available',
  rejected: 'badge-danger'
};

const STATUS_LABELS: Record<string, string> = {
  requested: '🟡 Pending',
  approved: '🟢 Approved',
  rejected: '🔴 Rejected'
};

export const TransfersPage: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [assetId, setAssetId] = useState('');
  const [fromEmployeeId, setFromEmployeeId] = useState('Rahul');
  const [toEmployeeId, setToEmployeeId] = useState('Shashwat');
  const [reason, setReason] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/transfers');
        const data = await res.json();
        if (res.ok) {
          setTransfers(data);
        }
      } catch (e) {
        toast.error('Failed to load transfers directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransfers();
  }, [refreshTrigger]);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !fromEmployeeId || !toEmployeeId) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (fromEmployeeId === toEmployeeId) {
      toast.error('Source and Recipient employees must be different.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, fromEmployeeId, toEmployeeId, reason })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Custody transfer request submitted for ${assetId}.`);
        setShowModal(false);
        setAssetId('');
        setFromEmployeeId('Rahul');
        setToEmployeeId('Shashwat');
        setReason('');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error(data.error || 'Failed to submit transfer request.');
      }
    } catch (e) {
      toast.error('Server error during transfer creation.');
    }
  };

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`http://localhost:5000/api/transfers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });

      if (res.ok) {
        toast.success(`Transfer request ${action} successfully.`);
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Failed to update transfer status.');
      }
    } catch (e) {
      toast.error('Server connection error.');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDeptFilter('');
    setDateFilter('');
  };

  // KPI Calculations
  const pendingCount = transfers.filter(t => t.status === 'requested').length;
  const approvedCount = transfers.filter(t => t.status === 'approved').length;
  const rejectedCount = transfers.filter(t => t.status === 'rejected').length;
  const completedCount = approvedCount; // Completed transfers mapped to approved

  // Filters logic
  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = 
      t.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fromEmployeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toEmployeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = !statusFilter || t.status === statusFilter;
    
    // Check department of either the sender or receiver
    const fromDept = EMPLOYEE_DEPT[t.fromEmployeeId] || '';
    const toDept = EMPLOYEE_DEPT[t.toEmployeeId] || '';
    const matchesDept = !deptFilter || fromDept === deptFilter || toDept === deptFilter;
    
    const matchesDate = !dateFilter || t.date.startsWith(dateFilter);

    return matchesSearch && matchesStatus && matchesDept && matchesDate;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle, gap reduced) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Transfer Management
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">Manage asset ownership transfers between employees and departments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Transfer Request</span>
        </button>
      </div>

      {/* KPI Cards Grid - Compact 100px */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-2">{pendingCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Approved</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-2">{approvedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Rejected</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2">{rejectedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Completed</span>
          <span className="text-2xl font-black text-blue-600 font-mono mt-2">{completedCount}</span>
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
              placeholder="Search Transfers (ID, Employee)..."
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
            <option value="requested">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Departments</option>
            {Array.from(new Set(Object.values(EMPLOYEE_DEPT))).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
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

      {/* Dynamic Consolidated Directory Table Card */}
      <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-bold">Loading transfers...</div>
        ) : filteredTransfers.length === 0 ? (
          /* Premium Empty state centered vertically inside table area */
          <div className="py-20 text-center space-y-3.5">
            <span className="text-4xl block">📦</span>
            <div>
              <h4 className="text-sm font-bold text-slate-800">No Transfer Requests</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">There are currently no custody transfer requests reported.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              Create Transfer Request
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4">Transfer ID</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">From</th>
                  <th className="py-3 px-4">To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Requested On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-slate-650">
                {filteredTransfers.map(trf => (
                  <tr key={trf.id} className="hover:bg-slate-50 transition-colors">
                    {/* Transfer ID in Purple Bold Mono */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#5B5BD6]">{trf.id}</td>
                    
                    {/* Asset ID in Dark Bold Mono */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{trf.assetId}</td>
                    
                    <td className="py-3.5 px-4 text-slate-700">{trf.fromEmployeeId}</td>
                    <td className="py-3.5 px-4 text-slate-750">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trf.toEmployeeId}</span>
                      </div>
                    </td>
                    
                    {/* Dot status badge */}
                    <td className="py-3.5 px-4">
                      <span className={`badge ${STATUS_BADGES[trf.status]}`}>
                        {STATUS_LABELS[trf.status]}
                      </span>
                    </td>
                    
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(trf.date).toLocaleDateString()}
                    </td>
                    
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      {trf.status === 'requested' ? (
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleAction(trf.id, 'rejected')}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full border border-rose-200 transition-all"
                            title="Reject Request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAction(trf.id, 'approved')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-all"
                            title="Approve & Shift Custody"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase select-none tracking-wider">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-2">
              Create Transfer Request
            </h3>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs font-semibold">
              {/* Asset ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">Asset ID Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AF-0001"
                  value={assetId}
                  onChange={e => setAssetId(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              {/* Source/Target Custodians */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current Custodian</label>
                  <select
                    value={fromEmployeeId}
                    onChange={e => setFromEmployeeId(e.target.value)}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {Object.keys(EMPLOYEE_DEPT).map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Recipient Custodian</label>
                  <select
                    value={toEmployeeId}
                    onChange={e => setToEmployeeId(e.target.value)}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {Object.keys(EMPLOYEE_DEPT).map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Transfer Reason</label>
                <textarea
                  required
                  placeholder="Why is this custody shifting?"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="glass-input text-xs h-20 resize-none font-semibold"
                />
              </div>

              {/* Modal controls */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

    </div>
  );
};

export default TransfersPage;
