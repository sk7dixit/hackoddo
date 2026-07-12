import React, { useEffect, useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import { 
  ClipboardCheck, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  MapPin, 
  RotateCcw,
  Wrench,
  HelpCircle,
  ChevronRight,
  Clock,
  History,
  Activity
} from 'lucide-react';

interface AuditAsset {
  assetId: string;
  location: string;
  expectedHolder: string | null;
  status: 'unverified' | 'verified' | 'missing' | 'damaged';
  notes?: string;
}

interface AuditCycle {
  id: string;
  name: string;
  scopeType: 'organization' | 'department' | 'location';
  scopeValue?: string;
  startDate: string;
  endDate: string;
  auditors: string[];
  status: 'active' | 'closed';
  assets: AuditAsset[];
}

interface Discrepancy {
  id: string;
  auditCycleId: string;
  assetId: string;
  issue: 'Missing' | 'Damaged';
  departmentId: string;
  holder: string | null;
  status: 'pending' | 'resolved';
  resolution?: string;
}

export const AuditPage: React.FC = () => {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  
  // Active selected audit cycle for verification view
  const [selectedCycle, setSelectedCycle] = useState<AuditCycle | null>(null);

  // Form / Wizard states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    name: 'Quarter 3 Audit',
    scopeType: 'organization' as 'organization' | 'department' | 'location',
    scopeValue: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    auditors: ['John Carter']
  });

  // Selected discrepancy for resolution
  const [selectedDisc, setSelectedDisc] = useState<Discrepancy | null>(null);

  // Filter asset verification list
  const [assetSearch, setAssetSearch] = useState('');
  const [assetStatusFilter, setAssetStatusFilter] = useState('');

  // UX Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Audit Timeline Mock Data
  const [timelineEvents] = useState([
    { id: '1', time: '09:00 AM', user: 'John Carter', msg: 'Audit Cycle initialized.' },
    { id: '2', time: '10:15 AM', user: 'John Carter', msg: 'Verified 45 items in IT department.' },
    { id: '3', time: '11:30 AM', user: 'John Carter', msg: 'Flagged AF-0002 as missing.' },
    { id: '4', time: '02:00 PM', user: 'John Carter', msg: 'Reconciled discrepancy for AF-0008.' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auditsRes, discRes] = await Promise.all([
          fetch('http://localhost:5000/api/audits').then(r => r.json()),
          fetch('http://localhost:5000/api/discrepancies').then(r => r.json())
        ]);
        setCycles(auditsRes);
        setDiscrepancies(discRes);
        
        // Auto-select active cycle if present and none is selected
        if (auditsRes.length > 0) {
          const active = auditsRes.find((c: any) => c.status === 'active');
          if (active) setSelectedCycle(active);
          else setSelectedCycle(auditsRes[0]);
        }
      } catch (e) {
        setError('Failed to fetch audits database.');
      }
    };
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedCycle) {
      const updated = cycles.find(c => c.id === selectedCycle.id);
      if (updated) setSelectedCycle(updated);
    }
  }, [cycles]);

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

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create audit cycle');

      showFeedback('success', `Audit Cycle ${data.id} created with ${data.assets?.length} assets in scope.`);
      setShowCreateModal(false);
      setSelectedCycle(data);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleVerifyAsset = async (assetId: string, result: 'verified' | 'missing' | 'damaged', notes = '') => {
    if (!selectedCycle) return;
    try {
      const res = await fetch(`http://localhost:5000/api/audits/${selectedCycle.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, verificationResult: result, notes })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to verify asset');

      setSelectedCycle(data);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleResolveDiscrepancy = async (resolution: 'Found' | 'Mark Lost' | 'Send to Maintenance') => {
    if (!selectedDisc || !selectedCycle) return;

    try {
      const res = await fetch(`http://localhost:5000/api/audits/${selectedCycle.id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discrepancyId: selectedDisc.id,
          resolution
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to resolve discrepancy');

      showFeedback('success', `Discrepancy for ${selectedDisc.assetId} resolved: ${resolution}.`);
      setShowResolveModal(false);
      setSelectedDisc(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleCloseAudit = async (cycleId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/audits/${cycleId}/close`, {
        method: 'PATCH'
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to close audit cycle');

      showFeedback('success', `Audit Cycle ${cycleId} closed and locked.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Metric summaries
  const activeCount = cycles.filter(c => c.status === 'active').length;
  const completedCount = cycles.filter(c => c.status === 'closed').length;
  const pendingVerifyCount = selectedCycle ? selectedCycle.assets.filter(a => a.status === 'unverified').length : 0;
  const totalInScope = selectedCycle ? selectedCycle.assets.length : 0;
  const verifiedInScope = selectedCycle ? selectedCycle.assets.filter(a => a.status === 'verified').length : 0;
  
  const missingCount = discrepancies.filter(d => d.issue === 'Missing' && d.status === 'pending').length;
  const damagedCount = discrepancies.filter(d => d.issue === 'Damaged' && d.status === 'pending').length;
  const totalDiscrepancies = discrepancies.filter(d => d.status === 'pending').length;

  const filteredAssets = selectedCycle
    ? selectedCycle.assets.filter(a => {
        const matchesSearch = a.assetId.toLowerCase().includes(assetSearch.toLowerCase());
        const matchesStatus = !assetStatusFilter || a.status === assetStatusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

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
            Inventory Audit Management
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">Verify expected custody physical existence and reconcile discrepancy logs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Audit Cycle</span>
        </button>
      </div>

      {/* KPI Stats Cards - Compact 100px */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Cycles</span>
          <span className="text-2xl font-black text-violet-650 font-mono mt-2">{activeCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Completed Audits</span>
          <span className="text-2xl font-black text-slate-800 font-mono mt-2">{completedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending Checks</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-2">{pendingVerifyCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-rose-50/50 border-rose-100">
          <span className="text-[10px] text-rose-700 font-semibold uppercase tracking-wider">Missing Assets</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2">{missingCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-orange-50/50 border-orange-100">
          <span className="text-[10px] text-orange-700 font-semibold uppercase tracking-wider">Damaged Assets</span>
          <span className="text-2xl font-black text-orange-600 font-mono mt-2">{damagedCount}</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Discrepancies</span>
          <span className="text-2xl font-black text-slate-800 font-mono mt-2">{totalDiscrepancies}</span>
        </GlassCard>
      </div>

      {/* Main Verification Dashboard Split: Left side 25%, Right side 75% */}
      {selectedCycle && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* LEFT 25%: Progress bar & Scope Detail & Audit Timeline */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Active Cycle Details Card */}
            <GlassCard className="border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className={`badge ${selectedCycle.status === 'active' ? 'bg-violet-50 text-violet-700 border-violet-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {selectedCycle.status === 'active' ? '🟢 Active Scope' : '⚫ Closed'}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-2.5 leading-snug">{selectedCycle.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">
                  Scope: {selectedCycle.scopeType} {selectedCycle.scopeValue && `(${selectedCycle.scopeValue})`}
                </p>
                <p className="text-[10.5px] text-slate-500 font-semibold mt-1">Lead: {selectedCycle.auditors.join(', ')}</p>
              </div>

              {/* Progress Bar (Compact Size) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-[10.5px] font-bold text-slate-500">
                  <span>Reconciled</span>
                  <span>{totalInScope - pendingVerifyCount} / {totalInScope} Items</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-[#5B5BD6] to-indigo-500 transition-all duration-500"
                    style={{ width: `${totalInScope > 0 ? ((totalInScope - pendingVerifyCount) / totalInScope) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {selectedCycle.status === 'active' && (
                <button
                  onClick={() => handleCloseAudit(selectedCycle.id)}
                  className="w-full btn-primary py-2 text-xs font-bold shadow-sm"
                >
                  Finalize Audit Cycle
                </button>
              )}
            </GlassCard>

            {/* Audit Timeline Component */}
            <GlassCard className="border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h4 className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#5B5BD6]" />
                Audit timeline
              </h4>
              
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {timelineEvents.map(event => (
                  <div key={event.id} className="text-[10.5px] border-l border-slate-200 pl-3 relative py-0.5 space-y-0.5 font-semibold">
                    <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-300" />
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-slate-600">{event.user}</span>
                      <span className="text-[9px] font-mono">{event.time}</span>
                    </div>
                    <p className="text-slate-500 leading-snug">{event.msg}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          {/* RIGHT 75%: Verification Table */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Table Filters header */}
            <div className="glass-card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-slate-200 bg-white shadow-sm">
              <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Asset Scope Verification Directory</h4>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Asset ID..."
                  value={assetSearch}
                  onChange={e => setAssetSearch(e.target.value)}
                  className="glass-input px-3 py-1 text-xs w-36"
                />
                <select
                  value={assetStatusFilter}
                  onChange={e => setAssetStatusFilter(e.target.value)}
                  className="glass-input px-3 py-1 text-xs bg-white text-slate-700 font-semibold"
                >
                  <option value="">All Verification Results</option>
                  <option value="unverified">Unverified</option>
                  <option value="verified">Verified</option>
                  <option value="missing">Missing</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
            </div>

            {/* Table Container */}
            <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                <table className="erp-table">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4">Asset ID</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Expected Holder</th>
                      <th className="py-3 px-4">Audit Result</th>
                      <th className="py-3 px-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-650">
                    {filteredAssets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 italic">No assets in scope match search query.</td>
                      </tr>
                    ) : (
                      filteredAssets.map(asset => (
                        <tr key={asset.assetId} className="hover:bg-slate-50 transition-colors">
                          {/* Asset ID in Purple Bold Mono */}
                          <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{asset.assetId}</td>
                          
                          <td className="py-3 px-4 text-slate-500 font-medium">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{asset.location}</span>
                            </div>
                          </td>
                          
                          <td className="py-3 px-4 text-slate-700">{asset.expectedHolder || 'Warehouse Stock'}</td>
                          
                          {/* Status Result Tag */}
                          <td className="py-3 px-4">
                            <span className={`badge ${
                              asset.status === 'verified' ? 'badge-available' :
                              asset.status === 'missing' ? 'badge-danger' :
                              asset.status === 'damaged' ? 'badge-maintenance' :
                              'badge-neutral'
                            }`}>
                              {asset.status === 'unverified' ? '🟡 Unverified' :
                               asset.status === 'verified' ? '🟢 Verified' :
                               asset.status === 'missing' ? '🔴 Missing' :
                               '🟠 Damaged'}
                            </span>
                          </td>
                          
                          <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                            {selectedCycle.status === 'active' ? (
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => handleVerifyAsset(asset.assetId, 'verified')}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 font-bold rounded text-[10.5px]"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleVerifyAsset(asset.assetId, 'missing')}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded text-[10.5px]"
                                >
                                  Missing
                                </button>
                                <button
                                  onClick={() => handleVerifyAsset(asset.assetId, 'damaged')}
                                  className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-650 border border-orange-200 font-bold rounded text-[10.5px]"
                                >
                                  Damaged
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase select-none tracking-wider">Closed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>

          </div>

        </div>
      )}

      {/* BOTTOM LOGS: Audit Cycles history & Discrepancies Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3">
        
        {/* 1/3: Audit Cycles Log */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Audit Cycles Log</h3>
          <GlassCard className="border-slate-200 bg-white p-4 space-y-2.5 max-h-[260px] overflow-y-auto shadow-sm">
            {cycles.map(cyc => (
              <div
                key={cyc.id}
                onClick={() => setSelectedCycle(cyc)}
                className={`p-3 border rounded-xl cursor-pointer text-xs transition-all ${
                  selectedCycle?.id === cyc.id
                    ? 'bg-indigo-50/40 border-[#5B5BD6]'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800">{cyc.name}</span>
                  <span className={`text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded ${cyc.status === 'active' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                    {cyc.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 mt-2 font-bold uppercase tracking-wider">Scope: {cyc.scopeType} ({cyc.scopeValue || 'Org Wide'})</p>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* 2/3: Discrepancy Reconciliation */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Reconcile Discrepancy Log</h3>
          <GlassCard className="border-slate-200 bg-white p-4 shadow-sm max-h-[260px] overflow-y-auto pr-1">
            {discrepancies.filter(d => d.status === 'pending').length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <span className="text-3xl block">📦</span>
                <h4 className="text-xs font-bold text-slate-700">No Discrepancies Found</h4>
                <p className="text-[11px] text-slate-400 font-medium">All scope audit physical verifications match expectation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {discrepancies.filter(d => d.status === 'pending').map(disc => (
                  <div key={disc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#5B5BD6]">{disc.assetId}</span>
                      <span className="badge badge-danger text-[9.5px] py-0.5">
                        {disc.issue === 'Missing' ? '🔴 Missing' : '🟠 Damaged'}
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-slate-450 leading-relaxed">
                      <p>Dept: <strong className="text-slate-700">{disc.departmentId}</strong></p>
                      {disc.holder && <p>Custodian: <strong className="text-slate-700">{disc.holder}</strong></p>}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDisc(disc);
                        setShowResolveModal(true);
                      }}
                      className="w-full btn-primary py-1.5 text-[10.5px] font-bold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Resolve Discrepancy</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

      </div>

      {/* MODAL 1: Create Audit Cycle Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#5B5BD6]" />
              Create Audit Cycle
            </h3>

            <form onSubmit={handleCreateAudit} className="space-y-4 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Audit Cycle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Organization Audit"
                  value={createForm.name}
                  onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Scope Type</label>
                  <select
                    value={createForm.scopeType}
                    onChange={e => setCreateForm({ ...createForm, scopeType: e.target.value as any, scopeValue: '' })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    <option value="organization">Entire Organization</option>
                    <option value="department">Department Scope</option>
                    <option value="location">Location Scope</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Scope Target Value</label>
                  {createForm.scopeType === 'organization' ? (
                    <input
                      type="text"
                      disabled
                      placeholder="Organization Wide"
                      className="glass-input text-xs bg-slate-50 border-slate-200 text-slate-400 font-bold"
                    />
                  ) : createForm.scopeType === 'department' ? (
                    <select
                      value={createForm.scopeValue}
                      onChange={e => setCreateForm({ ...createForm, scopeValue: e.target.value })}
                      className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                    >
                      <option value="">-- Choose Dept --</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Building A"
                      value={createForm.scopeValue}
                      onChange={e => setCreateForm({ ...createForm, scopeValue: e.target.value })}
                      className="glass-input text-xs"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Start Date</label>
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={e => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">End Date</label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={e => setCreateForm({ ...createForm, endDate: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Assign Lead Auditor</label>
                <select
                  value={createForm.auditors[0]}
                  onChange={e => setCreateForm({ ...createForm, auditors: [e.target.value] })}
                  className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                >
                  <option value="John Carter">John Carter (Asset Manager)</option>
                  <option value="Rahul">Rahul</option>
                  <option value="Priya">Priya</option>
                </select>
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
                  Create Scope Cycle
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL 2: Resolve Discrepancy Form */}
      {showResolveModal && selectedDisc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-sm bg-white border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-6 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Resolve Audit Discrepancy
            </h3>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700 font-semibold font-mono">
              <p>Asset ID: {selectedDisc.assetId}</p>
              <p>Reported Issue: <span className="text-rose-700 font-bold font-sans">{selectedDisc.issue}</span></p>
              <p className="font-sans text-[10.5px] text-slate-450">Cycle: {selectedDisc.auditCycleId}</p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Select Reconciliation Action</span>
              
              {selectedDisc.issue === 'Missing' ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleResolveDiscrepancy('Found')}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Asset Found (Release to Stock)</span>
                  </button>
                  
                  <button
                    onClick={() => handleResolveDiscrepancy('Mark Lost')}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Mark Lost (Asset Write-Off)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleResolveDiscrepancy('Send to Maintenance')}
                  className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-250 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Decommission to Repair Lab</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => { setShowResolveModal(false); setSelectedDisc(null); }}
                className="w-full btn-secondary text-xs py-2.5 mt-2"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default AuditPage;
