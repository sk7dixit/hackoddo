import React, { useEffect, useState, useRef } from 'react';
import GlassCard from '../../../components/GlassCard';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { 
  Handshake, 
  Plus, 
  ArrowRightLeft, 
  RotateCcw, 
  AlertTriangle, 
  User, 
  Laptop, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  MoreVertical,
  X,
  FileText,
  Search,
  Filter,
  Check,
  Building
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  categoryId: string;
  departmentId: string;
  location: string;
  status: string;
  holder: string | null;
}

interface Allocation {
  id: string;
  assetId: string;
  employeeId: string;
  allocatedOn: string;
  expectedReturnDate: string;
  status: 'active' | 'returned' | 'rejected';
  notes?: string;
}

interface TransferRequest {
  id: string;
  assetId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  reason: string;
  status: 'requested' | 'approved' | 'rejected';
  date: string;
}

interface ReturnRequest {
  id: string;
  assetId: string;
  employeeId: string;
  status: 'pending' | 'approved';
  reportedCondition: string;
  date: string;
  notes?: string;
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

export const AllocationPage: React.FC = () => {
  // Database lists
  const [assets, setAssets] = useState<Asset[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);

  // Toggles for forms and workflows
  const [showAllocateDrawer, setShowAllocateDrawer] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReturnInspectionModal, setShowReturnInspectionModal] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'active' | 'transfers' | 'returns' | 'history'>('active');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // Action Menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Allocation form state
  const [allocateForm, setAllocateForm] = useState({
    assetId: '',
    employeeId: 'Rahul',
    department: 'Computer Science',
    expectedReturnDate: '',
    notes: ''
  });

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    assetId: '',
    fromEmployeeId: '',
    toEmployeeId: 'Shashwat',
    reason: ''
  });

  // Selected return request for condition verification
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [returnVerifyCondition, setReturnVerifyCondition] = useState<'Excellent' | 'Good' | 'Needs Repair' | 'Damaged'>('Good');
  const [returnInspectionNotes, setReturnInspectionNotes] = useState('');

  // Conflict Double-allocation State
  const [allocationConflict, setAllocationConflict] = useState<{
    assetId: string;
    holder: string;
    message: string;
  } | null>(null);

  // UI notifications
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [returnConfirmData, setReturnConfirmData] = useState<{ assetId: string, employeeId: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, allocsRes, transfersRes, returnsRes] = await Promise.all([
          fetch('http://localhost:5000/api/assets').then(r => r.json()),
          fetch('http://localhost:5000/api/allocations').then(r => r.json()),
          fetch('http://localhost:5000/api/transfers').then(r => r.json()),
          fetch('http://localhost:5000/api/returns').then(r => r.json())
        ]);

        setAssets(assetsRes);
        setAllocations(allocsRes);
        setTransfers(transfersRes);
        setReturns(returnsRes);
      } catch (e) {
        showFeedback('error', 'Failed to fetch allocation records.');
      }
    };
    fetchData();
  }, [refreshTrigger]);

  // Click outside listener to close action menus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeMenuId]);

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

  const handleEmployeeChange = (empName: string) => {
    setAllocateForm(prev => ({
      ...prev,
      employeeId: empName,
      department: EMPLOYEE_DEPT[empName] || 'Operations'
    }));
  };

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocationConflict(null);

    if (!allocateForm.assetId) {
      showFeedback('error', 'Please select an asset to allocate.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: allocateForm.assetId,
          employeeId: allocateForm.employeeId,
          expectedReturnDate: allocateForm.expectedReturnDate,
          notes: allocateForm.notes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.alreadyAllocated) {
          setAllocationConflict({
            assetId: allocateForm.assetId,
            holder: data.holder || 'another employee',
            message: data.error
          });
          return;
        }
        throw new Error(data.error || 'Failed to checkout allocation');
      }

      showFeedback('success', `Asset ${allocateForm.assetId} successfully allocated to ${allocateForm.employeeId}!`);
      setShowAllocateDrawer(false);
      setAllocateForm(prev => ({ ...prev, assetId: '', notes: '', expectedReturnDate: '' }));
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const triggerTransferFromConflict = () => {
    if (!allocationConflict) return;
    setTransferForm({
      assetId: allocationConflict.assetId,
      fromEmployeeId: allocationConflict.holder,
      toEmployeeId: allocateForm.employeeId,
      reason: `Automated custody transition from ${allocationConflict.holder} to ${allocateForm.employeeId}.`
    });
    setAllocationConflict(null);
    setShowAllocateDrawer(false);
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferForm)
      });

      if (!res.ok) throw new Error('Failed to request transfer');

      showFeedback('success', `Transfer request submitted for asset ${transferForm.assetId}.`);
      setShowTransferModal(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleApproveTransfer = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transfers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (!res.ok) throw new Error('Failed to approve transfer');

      showFeedback('success', 'Transfer request approved successfully.');
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleRejectTransfer = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transfers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!res.ok) throw new Error('Failed to reject transfer');

      showFeedback('success', 'Transfer request rejected.');
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleReturnInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;

    try {
      const res = await fetch(`http://localhost:5000/api/returns/${selectedReturn.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          verifiedCondition: returnVerifyCondition,
          notes: returnInspectionNotes
        })
      });

      if (!res.ok) throw new Error('Failed to approve return request');

      showFeedback('success', `Return approved. Asset is now ${
        returnVerifyCondition === 'Needs Repair' || returnVerifyCondition === 'Damaged' 
          ? 'routed to Maintenance' 
          : 'released to Available inventory stock'
      }.`);

      setShowReturnInspectionModal(false);
      setSelectedReturn(null);
      setReturnInspectionNotes('');
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleTriggerReturnRequest = (assetId: string, employeeId: string) => {
    setReturnConfirmData({ assetId, employeeId });
  };

  const executeReturnRequest = async (assetId: string, employeeId: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, employeeId, condition: 'Good' })
      });

      if (!res.ok) throw new Error('Failed to create return request');

      showFeedback('success', `Return request logged for asset ${assetId}. Verification pending.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Helper: Overdue Calculations
  const today = new Date();
  const getOverdueDays = (dateStr: string) => {
    const expDate = new Date(dateStr);
    const timeDiff = expDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatOverdueBadge = (dateStr: string) => {
    const days = getOverdueDays(dateStr);
    if (days < 0) {
      return (
        <span className="badge badge-danger text-[10.5px]">
          🔴 {Math.abs(days)} Days Overdue
        </span>
      );
    }
    if (days === 0) {
      return (
        <span className="badge badge-reserved text-[10.5px]">
          🟠 Due Today
        </span>
      );
    }
    if (days > 0 && days <= 3) {
      return (
        <span className="badge bg-amber-50 text-amber-700 border-amber-100 text-[10.5px]">
          🟡 {days} Days Left
        </span>
      );
    }
    return (
      <span className="badge badge-available text-[10.5px]">
        🟢 {days} Days Left
      </span>
    );
  };

  // KPI calculations
  const activeCount = allocations.filter(a => a.status === 'active').length;
  const pendingTransfersCount = transfers.filter(t => t.status === 'requested').length;
  const pendingReturnsCount = returns.filter(r => r.status === 'pending').length;
  const overdueCount = allocations.filter(a => {
    if (a.status !== 'active') return false;
    return getOverdueDays(a.expectedReturnDate) < 0;
  }).length;

  const availableAssetsList = assets.filter(a => a.status === 'available');

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

      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Allocation Management
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">Allocate, transfer and verify company assets</p>
        </div>
        <button
          onClick={() => setShowAllocateDrawer(true)}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Asset</span>
        </button>
      </div>

      {/* KPI Cards Grid - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Allocations</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-800 font-mono">{activeCount}</span>
            <span className="text-[9px] font-bold text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">+5 today</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending Transfers</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-blue-600 font-mono">{pendingTransfersCount}</span>
            <span className="text-[9.5px] text-slate-450 font-bold">Awaiting</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending Returns</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-orange-600 font-mono">{pendingReturnsCount}</span>
            <span className="text-[9.5px] text-slate-450 font-bold">Verifying</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-rose-50/50 border-rose-100">
          <span className="text-[10px] text-rose-700 font-semibold uppercase tracking-wider">Overdue Returns</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-rose-600 font-mono">{overdueCount}</span>
            <span className="text-[9.5px] text-rose-500 font-bold font-mono">Alerts active</span>
          </div>
        </GlassCard>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-400 gap-6">
        <button
          onClick={() => { setActiveTab('active'); setSearchQuery(''); }}
          className={`pb-3 transition-all ${activeTab === 'active' ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6]' : 'hover:text-slate-700'}`}
        >
          Active Allocations
        </button>
        <button
          onClick={() => { setActiveTab('transfers'); setSearchQuery(''); }}
          className={`pb-3 transition-all relative ${activeTab === 'transfers' ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6]' : 'hover:text-slate-700'}`}
        >
          Transfers
          {pendingTransfersCount > 0 && (
            <span className="absolute -top-1.5 -right-3.5 bg-blue-50 text-blue-700 border border-blue-200 text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {pendingTransfersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab('returns'); setSearchQuery(''); }}
          className={`pb-3 transition-all relative ${activeTab === 'returns' ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6]' : 'hover:text-slate-700'}`}
        >
          Returns
          {pendingReturnsCount > 0 && (
            <span className="absolute -top-1.5 -right-3.5 bg-orange-50 text-orange-700 border border-orange-200 text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {pendingReturnsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab('history'); setSearchQuery(''); }}
          className={`pb-3 transition-all ${activeTab === 'history' ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6]' : 'hover:text-slate-700'}`}
        >
          History
        </button>
      </div>

      {/* Dynamic Tab Filter Bar */}
      <div className="glass-card p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search box (Asset Code, Custodian) */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Asset ID, Name or Custodian"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3 items-center w-full sm:w-auto justify-end">
            {activeTab === 'active' && (
              <label className="flex items-center gap-2 text-xs font-bold text-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOverdueOnly}
                  onChange={e => setShowOverdueOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#5B5BD6] focus:ring-[#5B5BD6] bg-white border-slate-350 cursor-pointer"
                />
                <span>Overdue Only</span>
              </label>
            )}

            {activeTab === 'active' && (
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700 min-w-[140px]"
              >
                <option value="">All Departments</option>
                {Array.from(new Set(Object.values(EMPLOYEE_DEPT))).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}

            <button
              onClick={() => { setSearchQuery(''); setDeptFilter(''); setShowOverdueOnly(false); }}
              className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Consolidated Table Container */}
      <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          {activeTab === 'active' && (() => {
            const list = allocations.filter(a => {
              if (a.status !== 'active') return false;
              
              const matchesSearch = 
                a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
                
              const dept = EMPLOYEE_DEPT[a.employeeId] || 'Operations';
              const matchesDept = !deptFilter || dept === deptFilter;
              
              const matchesOverdue = !showOverdueOnly || getOverdueDays(a.expectedReturnDate) < 0;
              
              return matchesSearch && matchesDept && matchesOverdue;
            });

            if (list.length === 0) {
              return (
                <div className="py-16 text-center space-y-2">
                  <span className="text-3xl block">📦</span>
                  <h4 className="text-xs font-bold text-slate-700">No Active Allocations</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Create a new checkout allocation using the button above.</p>
                </div>
              );
            }

            return (
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Custodian Holder</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Allocated On</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status / Alert</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {list.map(alloc => (
                    <tr key={alloc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{alloc.assetId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{alloc.employeeId}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{EMPLOYEE_DEPT[alloc.employeeId] || 'Operations'}</td>
                      <td className="py-3 px-4 text-slate-400">{alloc.allocatedOn}</td>
                      <td className="py-3 px-4 text-slate-750 font-bold">{alloc.expectedReturnDate || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {formatOverdueBadge(alloc.expectedReturnDate)}
                      </td>
                      <td className="py-3 px-4 text-right relative" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end items-center">
                          <button
                            onClick={() => {
                              setTransferForm({
                                assetId: alloc.assetId,
                                fromEmployeeId: alloc.employeeId,
                                toEmployeeId: 'Shashwat',
                                reason: ''
                              });
                              setShowTransferModal(true);
                            }}
                            className="btn-secondary py-1 px-2.5 text-[10.5px] text-blue-600 hover:border-blue-200 hover:bg-blue-50/20"
                          >
                            Transfer
                          </button>
                          <button
                            onClick={() => handleTriggerReturnRequest(alloc.assetId, alloc.employeeId)}
                            className="btn-secondary py-1 px-2.5 text-[10.5px] text-rose-600 hover:border-rose-200 hover:bg-rose-50/20"
                          >
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}

          {activeTab === 'transfers' && (() => {
            const list = transfers.filter(t => {
              if (t.status !== 'requested') return false;
              return t.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     t.fromEmployeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     t.toEmployeeId.toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (list.length === 0) {
              return (
                <div className="py-16 text-center space-y-2">
                  <span className="text-3xl block">📦</span>
                  <h4 className="text-xs font-bold text-slate-700">No Pending Custody Transfers</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Employee custody change requests will appear here.</p>
                </div>
              );
            }

            return (
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Current Holder</th>
                    <th className="py-3 px-4">Target Holder</th>
                    <th className="py-3 px-4">Transfer Reason</th>
                    <th className="py-3 px-4">Requested On</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {list.map(trf => (
                    <tr key={trf.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#5B5BD6]">{trf.assetId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{trf.fromEmployeeId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{trf.toEmployeeId}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium italic">"{trf.reason}"</td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(trf.date).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleRejectTransfer(trf.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full border border-rose-250 transition-all"
                            title="Reject Request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleApproveTransfer(trf.id)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full border border-emerald-250 transition-all"
                            title="Approve & Shift Custody"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}

          {activeTab === 'returns' && (() => {
            const list = returns.filter(r => {
              if (r.status !== 'pending') return false;
              return r.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (list.length === 0) {
              return (
                <div className="py-16 text-center space-y-2">
                  <span className="text-3xl block">📦</span>
                  <h4 className="text-xs font-bold text-slate-700">No Pending Returns Verification</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Verify returned equipment conditions before restocking.</p>
                </div>
              );
            }

            return (
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Custodian Employee</th>
                    <th className="py-3 px-4">Reported Condition</th>
                    <th className="py-3 px-4">Request Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {list.map(ret => (
                    <tr key={ret.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#5B5BD6]">{ret.assetId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{ret.employeeId}</td>
                      <td className="py-3.5 px-4">
                        <span className={`badge ${
                          ret.reportedCondition === 'Excellent' || ret.reportedCondition === 'Good' 
                            ? 'badge-available' 
                            : 'badge-maintenance'
                        }`}>
                          {ret.reportedCondition}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(ret.date).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedReturn(ret);
                            setReturnVerifyCondition(ret.reportedCondition as any);
                            setShowReturnInspectionModal(true);
                          }}
                          className="btn-primary py-1 px-3 text-[10.5px] font-bold inline-flex items-center gap-1"
                        >
                          <span>Verify & Accept</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}

          {activeTab === 'history' && (() => {
            const list = allocations.filter(a => {
              if (a.status === 'active') return false;
              return a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     a.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (list.length === 0) {
              return (
                <div className="py-16 text-center space-y-2">
                  <span className="text-3xl block">📦</span>
                  <h4 className="text-xs font-bold text-slate-700">No Allocation History Logs</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Historical records will populate here as checkouts close.</p>
                </div>
              );
            }

            return (
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Allocated On</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {list.map(alloc => (
                    <tr key={alloc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{alloc.assetId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{alloc.employeeId}</td>
                      <td className="py-3 px-4 text-slate-400">{alloc.allocatedOn}</td>
                      <td className="py-3 px-4 text-slate-400">{alloc.expectedReturnDate}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          alloc.status === 'returned' ? 'badge-available' : 'badge-danger'
                        }`}>
                          {alloc.status === 'returned' ? 'Returned' : 'Rejected'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium max-w-[200px] truncate" title={alloc.notes}>
                        {alloc.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>
      </GlassCard>

      {/* RIGHT SLIDE-OUT DRAWER: Allocate Asset Form */}
      {showAllocateDrawer && (
        <>
          {/* Backdrop mask */}
          <div 
            onClick={() => { setShowAllocateDrawer(false); setAllocationConflict(null); }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 animate-fade-in" 
          />
          
          <aside className="fixed top-0 right-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-50 p-6 flex flex-col justify-between animate-slide-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-[#5B5BD6]" />
                  Allocate Asset
                </h3>
                <button
                  onClick={() => { setShowAllocateDrawer(false); setAllocationConflict(null); }}
                  className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all border border-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Conflict override banner */}
              {allocationConflict && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-3">
                  <div className="flex gap-2 text-xs text-amber-700">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <p className="font-bold leading-relaxed">{allocationConflict.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={triggerTransferFromConflict}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10.5px] font-bold transition-all shadow-[0_1px_2px_rgba(245,158,11,0.2)]"
                  >
                    Request Custody Transfer
                  </button>
                </div>
              )}

              <form onSubmit={handleAllocateSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Employee Custodian */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Employee Custodian</label>
                  <select
                    value={allocateForm.employeeId}
                    onChange={e => handleEmployeeChange(e.target.value)}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {Object.keys(EMPLOYEE_DEPT).map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>

                {/* Department Auto-fill */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">Department (Auto-filled)</label>
                  <input
                    type="text"
                    disabled
                    value={allocateForm.department}
                    className="glass-input text-xs bg-slate-50 border-slate-200 text-slate-400 font-bold"
                  />
                </div>

                {/* Select Available Asset */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Select Available Asset</label>
                  <select
                    value={allocateForm.assetId}
                    onChange={e => { setAllocateForm({ ...allocateForm, assetId: e.target.value }); setAllocationConflict(null); }}
                    className="glass-input text-xs cursor-pointer bg-white font-mono font-bold text-[#5B5BD6]"
                  >
                    <option value="" className="text-slate-400 font-sans">-- Choose Asset --</option>
                    {availableAssetsList.map(a => (
                      <option key={a.id} value={a.id} className="text-slate-800">
                        {a.id} - {a.name} ({a.categoryId})
                      </option>
                    ))}
                    <option disabled className="text-slate-300 font-sans mt-2">-- Allocated / Conflicts --</option>
                    {assets.filter(a => a.status !== 'available').map(a => (
                      <option key={a.id} value={a.id} className="text-rose-500">
                        [Conflict] {a.id} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expected Return Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Expected Return Date</label>
                  <input
                    type="date"
                    value={allocateForm.expectedReturnDate}
                    onChange={e => setAllocateForm({ ...allocateForm, expectedReturnDate: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>

                {/* Allocation Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Allocation Notes</label>
                  <textarea
                    placeholder="Provide checkout reason, serial checks, accessories list..."
                    value={allocateForm.notes}
                    onChange={e => setAllocateForm({ ...allocateForm, notes: e.target.value })}
                    className="glass-input text-xs h-20 resize-none font-semibold"
                  />
                </div>

              </form>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 border-t border-slate-100 pt-4 mt-6">
              <button
                type="button"
                onClick={() => { setShowAllocateDrawer(false); setAllocationConflict(null); }}
                className="flex-1 btn-secondary text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocateSubmit}
                className="flex-1 btn-primary text-xs py-2.5"
              >
                Allocate
              </button>
            </div>
          </aside>
        </>
      )}

      {/* MODAL 2: Request Transfer Form */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-1.5">
              <ArrowRightLeft className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Request Custody Transfer
            </h3>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">Asset ID</label>
                <input
                  type="text"
                  disabled
                  value={transferForm.assetId}
                  className="glass-input text-xs bg-slate-50 border-slate-200 text-slate-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">Current Holder</label>
                  <input
                    type="text"
                    disabled
                    value={transferForm.fromEmployeeId}
                    className="glass-input text-xs bg-slate-50 border-slate-200 text-slate-400 font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">New Target Custodian</label>
                  <select
                    value={transferForm.toEmployeeId}
                    onChange={e => setTransferForm({ ...transferForm, toEmployeeId: e.target.value })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {Object.keys(EMPLOYEE_DEPT)
                      .filter(emp => emp !== transferForm.fromEmployeeId)
                      .map(emp => (
                        <option key={emp} value={emp}>{emp}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Transfer Reason</label>
                <textarea
                  required
                  placeholder="Provide custody transfer reasons..."
                  value={transferForm.reason}
                  onChange={e => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="glass-input text-xs h-20 resize-none font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
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

      {/* MODAL 3: Return Condition Verification and Approval */}
      {showReturnInspectionModal && selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-1.5">
              <RotateCcw className="w-4.5 h-4.5 text-orange-600" />
              Accept Return Verification
            </h3>

            <form onSubmit={handleReturnInspectionSubmit} className="space-y-4 text-xs font-semibold">
              
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700">
                <div className="flex justify-between font-mono font-bold text-slate-800">
                  <span>Asset: {selectedReturn.assetId}</span>
                  <span>From: {selectedReturn.employeeId}</span>
                </div>
                <p className="text-[10.5px] text-slate-500 font-semibold">Reported condition by employee: <span className="text-amber-700 font-bold">{selectedReturn.reportedCondition}</span></p>
              </div>

              {/* Verified Condition Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Verified Inspection Condition</label>
                <select
                  value={returnVerifyCondition}
                  onChange={e => setReturnVerifyCondition(e.target.value as any)}
                  className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                >
                  <option value="Excellent">Excellent condition (Restock Available)</option>
                  <option value="Good">Good condition (Restock Available)</option>
                  <option value="Needs Repair">Needs Repair (Decommission to Repairs)</option>
                  <option value="Damaged">Damaged (Decommission to Repairs)</option>
                </select>
              </div>

              {/* Inspection notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Verification / Condition Notes</label>
                <textarea
                  placeholder="Verify screens, keyboard keys, and physical details..."
                  value={returnInspectionNotes}
                  onChange={e => setReturnInspectionNotes(e.target.value)}
                  className="glass-input text-xs h-20 resize-none font-semibold"
                />
              </div>

              {/* Lifecycle Info Warning */}
              <div className="p-3 bg-slate-50 border border-slate-200 flex gap-2 rounded-xl text-[10.5px] text-slate-500">
                <Clock className="w-4 h-4 text-[#5B5BD6] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">
                  {returnVerifyCondition === 'Needs Repair' || returnVerifyCondition === 'Damaged' ? (
                    <span>⚠️ Approving will update status to <span className="text-orange-600 font-bold">Under Maintenance</span> and trigger a high-priority repair ticket.</span>
                  ) : (
                    <span>✅ Approving will release hardware back into active warehouse stock as <span className="text-emerald-600 font-bold">Available</span>.</span>
                  )}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowReturnInspectionModal(false); setSelectedReturn(null); }}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  Approve Return
                </button>
              </div>

            </form>
          </GlassCard>
        </div>
      )}
      {/* Custom Confirm Dialog for return requests */}
      <ConfirmDialog
        isOpen={!!returnConfirmData}
        title="Confirm Return"
        message={`Are you sure you want to log a return request for asset ${returnConfirmData?.assetId}? This will place it under Return Verification.`}
        confirmText="Request Return"
        cancelText="Cancel"
        onConfirm={() => {
          if (returnConfirmData) {
            executeReturnRequest(returnConfirmData.assetId, returnConfirmData.employeeId);
          }
          setReturnConfirmData(null);
        }}
        onCancel={() => setReturnConfirmData(null)}
      />

    </div>
  );
};

export default AllocationPage;
