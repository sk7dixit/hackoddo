import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Handshake, 
  Check, 
  X, 
  RefreshCw, 
  RotateCcw,
  ArrowRight,
  User,
  Clock,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Allocation, Asset, Employee } from '../../../server/src/types';

export const Allocations: React.FC = () => {
  const { activeRole, currentUser, refreshTrigger, triggerRefresh } = useApp();

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Tab control
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'history'>('active');

  // Transfer Custody Modal State
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState('');

  // Rejection Reason Modal State
  const [rejectingAllocationId, setRejectingAllocationId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // UX Feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allocsData, assetsData, empsData] = await Promise.all([
          api.get<Allocation[]>('/allocations'),
          api.get<Asset[]>('/assets'),
          api.get<Employee[]>('/employees')
        ]);
        setAllocations(allocsData);
        setAssets(assetsData);
        setEmployees(empsData);
      } catch (e: any) {
        setFeedback({ type: 'error', message: e.message || 'Failed to load allocations data' });
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter allocations based on user role and department
  const filteredAllocs = allocations.filter(alloc => {
    // 1. Employee: only see their own
    if (activeRole === 'employee') {
      return alloc.employeeId === currentUser?.id;
    }
    // 2. Department Head: see allocations of employees in their department
    if (activeRole === 'department_head') {
      const allocUser = employees.find(e => e.id === alloc.employeeId);
      return allocUser?.departmentId === currentUser?.departmentId;
    }
    // 3. Admin / Asset Manager: see everything
    return true;
  });

  const activeAllocs = filteredAllocs.filter(a => a.status === 'requested' || a.status === 'approved' || a.status === 'transfer_pending');
  const historicalAllocs = filteredAllocs.filter(a => a.status === 'returned' || a.status === 'rejected');

  const displayedAllocs = activeSubTab === 'active' ? activeAllocs : historicalAllocs;

  // Actions
  const handleApproveRequest = async (id: string) => {
    try {
      await api.post(`/allocations/${id}/approve`);
      showFeedback('success', 'Allocation request approved and asset dispatched!');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleRejectRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingAllocationId) return;
    try {
      await api.post(`/allocations/${rejectingAllocationId}/reject`, { reason: rejectionReason });
      showFeedback('success', 'Allocation request rejected.');
      setRejectingAllocationId(null);
      setRejectionReason('');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleVerifyReturn = async (id: string) => {
    try {
      await api.post(`/allocations/${id}/return`);
      showFeedback('success', 'Return verified. Asset re-integrated into available warehouse stock.');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleInitiateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocation || !transferTargetId) return;
    try {
      await api.post('/allocations/transfer', {
        assetId: selectedAllocation.assetId,
        targetEmployeeId: transferTargetId
      });
      showFeedback('success', 'Transfer request submitted. Awaiting manager approval.');
      setShowTransferModal(false);
      setSelectedAllocation(null);
      setTransferTargetId('');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleApproveTransfer = async (id: string) => {
    try {
      await api.post(`/allocations/${id}/approve-transfer`);
      showFeedback('success', 'Asset transfer custody approved and updated.');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Feedback banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <AlertCircle className="w-4 h-4" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs selector */}
      <div className="flex border-b border-zinc-800/80 gap-6">
        <button
          onClick={() => setActiveSubTab('active')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeSubTab === 'active' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>Active Custody & Requests ({activeAllocs.length})</span>
          {activeSubTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeSubTab === 'history' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Historical logs ({historicalAllocs.length})</span>
          {activeSubTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
      </div>

      {/* Table Card */}
      <GlassCard className="border-zinc-800/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Hardware Asset</th>
                <th className="pb-3 pr-4">Custodian Employee</th>
                <th className="pb-3 pr-4">Allocation dates</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {displayedAllocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 italic">
                    No allocation records found in this category.
                  </td>
                </tr>
              ) : (
                displayedAllocs.map(alloc => {
                  const asset = assets.find(a => a.id === alloc.assetId);
                  const custodian = employees.find(e => e.id === alloc.employeeId);
                  const transferTarget = alloc.transferToEmployeeId ? employees.find(e => e.id === alloc.transferToEmployeeId) : null;
                  
                  // Check if expected return has passed (overdue)
                  const isOverdue = 
                    alloc.status === 'approved' && 
                    alloc.expectedReturnDate && 
                    new Date(alloc.expectedReturnDate).getTime() < Date.now();

                  return (
                    <tr key={alloc.id} className="hover:bg-zinc-900/10">
                      
                      {/* Asset details */}
                      <td className="py-4 font-semibold text-zinc-200">
                        <div>
                          <span>{asset?.name || 'Unknown Asset'}</span>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{asset?.qrCode}</p>
                        </div>
                      </td>

                      {/* Custodian details */}
                      <td className="py-4">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          {custodian?.name || 'Unknown'}
                        </span>
                        {custodian?.departmentId && (
                          <span className="text-[10px] text-zinc-500">
                            Dept: {employees.find(e => e.id === custodian.id)?.departmentId}
                          </span>
                        )}
                      </td>

                      {/* Allocation dates */}
                      <td className="py-4 text-zinc-400 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          <span>Req: {new Date(alloc.requestDate).toLocaleDateString()}</span>
                        </div>
                        {alloc.allocationDate && (
                          <div className="text-zinc-300">
                            Alocated: {new Date(alloc.allocationDate).toLocaleDateString()}
                          </div>
                        )}
                        {alloc.expectedReturnDate && alloc.status === 'approved' && (
                          <div className={`font-medium ${isOverdue ? 'text-rose-400' : 'text-zinc-400'}`}>
                            Return due: {new Date(alloc.expectedReturnDate).toLocaleDateString()} {isOverdue && '(OVERDUE)'}
                          </div>
                        )}
                        {alloc.actualReturnDate && (
                          <div className="text-zinc-500">
                            Returned: {new Date(alloc.actualReturnDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        {alloc.status === 'requested' && (
                          <span className="badge badge-reserved">Requested Approval</span>
                        )}
                        {alloc.status === 'approved' && (
                          <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-allocated'}`}>
                            {isOverdue ? 'Overdue return' : 'In Custody'}
                          </span>
                        )}
                        {alloc.status === 'transfer_pending' && (
                          <span className="badge badge-reserved flex flex-col items-start gap-1 p-2 rounded-lg max-w-[160px]">
                            <span className="font-bold">Transfer Pending</span>
                            <span className="text-[9px] text-amber-500/80 leading-snug">
                              To: {transferTarget?.name || 'Target'}
                            </span>
                          </span>
                        )}
                        {alloc.status === 'returned' && (
                          <span className="badge badge-available">Returned & Checked</span>
                        )}
                        {alloc.status === 'rejected' && (
                          <span className="badge badge-neutral">Rejected Request</span>
                        )}
                        
                        {/* Show rejection notes or notes if available */}
                        {alloc.notes && (
                          <p className="text-[10px] text-zinc-500 mt-1 max-w-[180px] truncate" title={alloc.notes}>
                            Note: {alloc.notes}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        
                        {/* Managers Actions on pending request */}
                        {(activeRole === 'admin' || activeRole === 'asset_manager') && alloc.status === 'requested' && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleApproveRequest(alloc.id)}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-all"
                              title="Approve request"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectingAllocationId(alloc.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                              title="Reject request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Managers Actions on active allocation */}
                        {(activeRole === 'admin' || activeRole === 'asset_manager') && alloc.status === 'approved' && (
                          <button
                            onClick={() => handleVerifyReturn(alloc.id)}
                            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 ml-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Verify Return</span>
                          </button>
                        )}

                        {/* Managers Actions on pending Transfer request */}
                        {(activeRole === 'admin' || activeRole === 'asset_manager') && alloc.status === 'transfer_pending' && (
                          <button
                            onClick={() => handleApproveTransfer(alloc.id)}
                            className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1.5 ml-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Custody Transfer</span>
                          </button>
                        )}

                        {/* Employees Actions on active allocated item */}
                        {activeRole === 'employee' && alloc.status === 'approved' && (
                          <button
                            onClick={() => {
                              setSelectedAllocation(alloc);
                              setShowTransferModal(true);
                            }}
                            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 ml-auto"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Transfer Custody</span>
                          </button>
                        )}

                        {alloc.status === 'returned' || alloc.status === 'rejected' ? (
                          <span className="text-zinc-600 font-mono text-[10px] pr-2">Archived</span>
                        ) : null}

                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* MODAL 1: Transfer Custody Form */}
      {showTransferModal && selectedAllocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCw className="w-5 h-5 text-violet-400 animate-spin-slow" />
              <h3 className="font-bold text-sm tracking-tight text-white uppercase text-zinc-400">
                Initiate Custody Transfer
              </h3>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-800/60 p-3.5 rounded-xl text-xs space-y-1.5 mb-5">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Hardware to transfer</span>
              <p className="text-zinc-200 font-semibold text-sm">
                {assets.find(a => a.id === selectedAllocation.assetId)?.name}
              </p>
              <p className="text-zinc-500 font-mono text-[10px]">
                Tag: {assets.find(a => a.id === selectedAllocation.assetId)?.qrCode}
              </p>
            </div>

            <form onSubmit={handleInitiateTransfer} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Select Recipient Employee
                </label>
                <select
                  required
                  value={transferTargetId}
                  onChange={e => setTransferTargetId(e.target.value)}
                  className="glass-input text-xs cursor-pointer bg-zinc-950"
                >
                  <option value="">Choose employee...</option>
                  {employees
                    .filter(e => e.id !== currentUser?.id)
                    .map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                    ))}
                </select>
              </div>

              <p className="text-[10.5px] text-amber-500/80 leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                ⚠️ **Important Note:** A transfer request will notify the recipient and register in the manager review queue. You remain fully responsible for this hardware until the Asset Manager signs off on the transfer.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedAllocation(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-1.5"
                >
                  Request Transfer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL 2: Rejection Reason Input Form */}
      {rejectingAllocationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-400" />
              Specify Rejection Reason
            </h3>

            <form onSubmit={handleRejectRequest} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Rejection Feedback Notes</label>
                <textarea
                  required
                  placeholder="e.g. This laptop has been reserved for engineering onboarding."
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="glass-input text-xs h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingAllocationId(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-danger"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Allocations;
