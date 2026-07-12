import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  ClipboardCheck, 
  Plus, 
  Check, 
  X, 
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { AuditLog, Asset, Employee, AuditDiscrepancy } from '../../../server/src/types';

export const Audit: React.FC = () => {
  const { activeRole, refreshTrigger, triggerRefresh } = useApp();

  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Active audit (if any is pending)
  const [activeAudit, setActiveAudit] = useState<AuditLog | null>(null);

  // Form states
  const [showStartForm, setShowStartForm] = useState(false);
  const [auditTitle, setAuditTitle] = useState('');

  // Discrepancy check inputs
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [checkNotes, setCheckNotes] = useState('');
  const [checkStatus, setCheckStatus] = useState<'verified' | 'missing'>('verified');

  // Discrepancy resolver inputs
  const [resolvingAssetId, setResolvingAssetId] = useState<string | null>(null);
  const [resolvingAuditId, setResolvingAuditId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // UX Feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auditsData, assetsData, empsData] = await Promise.all([
          api.get<AuditLog[]>('/audit'),
          api.get<Asset[]>('/assets'),
          api.get<Employee[]>('/employees')
        ]);
        
        setAudits(auditsData);
        setEmployees(empsData);

        // Filter physical assets
        const physical = assetsData.filter(a => a.serialNumber !== 'ROOM-ALPHA' && a.serialNumber !== 'ROOM-BETA');
        setAssets(physical);

        // Find active audit
        const pending = auditsData.find(a => a.status === 'pending');
        setActiveAudit(pending || null);
      } catch (e: any) {
        setFeedback({ type: 'error', message: e.message || 'Failed to load audit records' });
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Start new audit
  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAudit = await api.post<AuditLog>('/audit/run', { title: auditTitle });
      showFeedback('success', `Audit cycle "${newAudit.title}" started successfully.`);
      setShowStartForm(false);
      setAuditTitle('');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Perform item check
  const handleVerifyAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAudit || !selectedAssetId) return;

    try {
      await api.patch(`/audit/${activeAudit.id}/verify`, {
        assetId: selectedAssetId,
        status: checkStatus,
        notes: checkNotes
      });

      showFeedback('success', `Hardware verified as: ${checkStatus === 'verified' ? 'Present' : 'Missing'}`);
      setSelectedAssetId(null);
      setCheckNotes('');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Complete Audit run
  const handleCompleteAudit = async () => {
    if (!activeAudit) return;
    if (activeAudit.checkedCount < activeAudit.totalAssetsCount) {
      if (!window.confirm(`Warning: You have only checked ${activeAudit.checkedCount}/${activeAudit.totalAssetsCount} assets. Finalizing will mark all unchecked items as they are, and any missing items will permanently transition to Lost. Proceed?`)) {
        return;
      }
    } else {
      if (!window.confirm('Are you sure you want to finalize this audit cycle?')) return;
    }

    try {
      await api.patch(`/audit/${activeAudit.id}/complete`);
      showFeedback('success', 'Audit completed successfully. Missing assets updated to "Lost".');
      setActiveAudit(null);
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Resolve discrepancy
  const handleResolveDiscrepancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingAuditId || !resolvingAssetId) return;

    try {
      await api.patch(`/audit/${resolvingAuditId}/resolve-discrepancy`, {
        assetId: resolvingAssetId,
        notes: resolutionNotes
      });

      showFeedback('success', 'Discrepancy resolved. Asset re-integrated into inventory.');
      setResolvingAssetId(null);
      setResolvingAuditId(null);
      setResolutionNotes('');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <AlertTriangle className="w-4 h-4" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1. Header action row: trigger new audit */}
      {!activeAudit && !showStartForm && (
        <GlassCard className="border-zinc-800/40 bg-zinc-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
              <ClipboardCheck className="w-4.5 h-4.5 text-violet-400" />
              Start New Inventory Audit
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Create an audit cycle to physically verify hardware custody and location.
            </p>
          </div>
          <button
            onClick={() => setShowStartForm(true)}
            className="btn-primary flex items-center gap-2 text-xs py-3.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch Audit Cycle</span>
          </button>
        </GlassCard>
      )}

      {/* Audit Form Panel */}
      {showStartForm && (
        <GlassCard className="border-zinc-800/40 bg-zinc-900/40 border-t-violet-500/40 border-t-2 max-w-md animate-slide-up">
          <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
            Launch Audit Cycle
          </h3>
          <form onSubmit={handleStartAudit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Audit Cycle Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Q3 IT Hardware Audit"
                value={auditTitle}
                onChange={e => setAuditTitle(e.target.value)}
                className="glass-input text-xs"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowStartForm(false)}
                className="flex-1 btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary text-xs"
              >
                Start Verification Run
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* 2. Active Audit workspace */}
      {activeAudit && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Work list (2/3 width) */}
          <GlassCard className="lg:col-span-2 border-zinc-800/50 bg-zinc-900/40 relative">
            
            {/* Title & Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/60 mb-6">
              <div>
                <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 border border-violet-500/15 rounded">
                  ACTIVE AUDIT CYCLE
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5">{activeAudit.title}</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Started by {activeAudit.performedBy} on {new Date(activeAudit.date).toLocaleDateString()}</p>
              </div>

              <div className="text-right space-y-1 flex flex-col items-end">
                <span className="text-xs font-bold text-zinc-400">
                  Progress: {activeAudit.checkedCount} / {activeAudit.totalAssetsCount} items
                </span>
                <div className="w-48 h-2 bg-zinc-950 rounded-full border border-zinc-900 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${(activeAudit.checkedCount / activeAudit.totalAssetsCount) * 100}%` }}
                  />
                </div>
                <button
                  onClick={handleCompleteAudit}
                  className="btn-success text-[10px] py-1 px-3 mt-2"
                >
                  Finalize Audit Cycle
                </button>
              </div>
            </div>

            {/* Assets checklist table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Hardware Item</th>
                    <th className="pb-3 pr-4">Expected Location</th>
                    <th className="pb-3 pr-4">Db Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {assets.map(asset => {
                    const isChecked = (activeAudit as any).checkedAssetIds?.includes(asset.id);
                    const discrepancy = activeAudit.discrepancies.find(d => d.assetId === asset.id);
                    
                    return (
                      <tr key={asset.id} className="hover:bg-zinc-900/10">
                        <td className="py-4 font-semibold text-zinc-200">
                          <div>
                            <span>{asset.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono block">{asset.qrCode}</span>
                          </div>
                        </td>
                        <td className="py-4 text-zinc-400">{asset.location}</td>
                        <td className="py-4 font-bold text-zinc-400 uppercase tracking-wide">
                          {asset.status}
                        </td>
                        <td className="py-4 text-right">
                          {isChecked ? (
                            discrepancy ? (
                              <span className="text-rose-400 font-bold pr-2 flex items-center justify-end gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Marked Missing
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-bold pr-2 flex items-center justify-end gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Verified
                              </span>
                            )
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedAssetId(asset.id);
                                  setCheckStatus('verified');
                                  setCheckNotes('Present at verified location.');
                                }}
                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-all text-[11px] font-bold"
                              >
                                Match
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAssetId(asset.id);
                                  setCheckStatus('missing');
                                  setCheckNotes('');
                                }}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all text-[11px] font-bold"
                              >
                                Missing
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Verification check form (Right side) */}
          {selectedAssetId && (
            <GlassCard className="border-zinc-800/40 bg-zinc-900/40 lg:col-span-1 border-t-violet-500/40 border-t-2 animate-slide-up">
              <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
                Log verification result
              </h3>

              <div className="mb-4 bg-zinc-950/40 p-3 rounded-lg text-xs space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Verifying Hardware</span>
                <p className="text-zinc-200 font-semibold">{assets.find(a => a.id === selectedAssetId)?.name}</p>
                <p className="text-zinc-500 font-mono text-[9px]">Tag: {assets.find(a => a.id === selectedAssetId)?.qrCode}</p>
              </div>

              <form onSubmit={handleVerifyAsset} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Inspection status</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckStatus('verified');
                        setCheckNotes('Present at verified location.');
                      }}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        checkStatus === 'verified' 
                          ? 'border-emerald-500/40 bg-emerald-600/10 text-emerald-400' 
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-950/20'
                      }`}
                    >
                      Verified Present
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckStatus('missing');
                        setCheckNotes('');
                      }}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        checkStatus === 'missing' 
                          ? 'border-rose-500/40 bg-rose-600/10 text-rose-400' 
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-950/20'
                      }`}
                    >
                      Mark Missing
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Inspection notes</label>
                  <textarea
                    required
                    placeholder="e.g. Asset not found. Employee asserts laptop is off-premise today."
                    value={checkNotes}
                    onChange={e => setCheckNotes(e.target.value)}
                    className="glass-input text-xs h-24 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAssetId(null);
                      setCheckNotes('');
                    }}
                    className="flex-1 btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

        </div>
      )}

      {/* 3. Historical audits & Discrepancies resolver workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Discrepancy list (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="border-zinc-800/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
              Discrepancy Resolver Board
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Hardware Item</th>
                    <th className="pb-3 pr-4">Audit Title</th>
                    <th className="pb-3 pr-4">Inspection description</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {(() => {
                    // Extract all discrepancies across all audits
                    const allDiscrepancies: { auditId: string; auditTitle: string; discrepancy: AuditDiscrepancy }[] = [];
                    audits.forEach(aud => {
                      aud.discrepancies.forEach(d => {
                        allDiscrepancies.push({
                          auditId: aud.id,
                          auditTitle: aud.title,
                          discrepancy: d
                        });
                      });
                    });

                    if (allDiscrepancies.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-zinc-500 italic">
                            No active discrepancies generated.
                          </td>
                        </tr>
                      );
                    }

                    return allDiscrepancies.map(({ auditId, auditTitle, discrepancy }) => (
                      <tr key={`${auditId}-${discrepancy.assetId}`} className="hover:bg-zinc-900/10">
                        <td className="py-4 font-semibold text-zinc-200">
                          <div>
                            <span>{discrepancy.assetName}</span>
                            <span className="text-[9px] text-zinc-500 font-mono block">ID: {discrepancy.assetId}</span>
                          </div>
                        </td>
                        <td className="py-4 text-zinc-400">{auditTitle}</td>
                        <td className="py-4 text-zinc-400 max-w-[200px] truncate" title={discrepancy.notes}>
                          {discrepancy.notes}
                        </td>
                        <td className="py-4">
                          <span className={`badge ${discrepancy.resolved ? 'badge-available' : 'badge-danger'}`}>
                            {discrepancy.resolved ? 'Resolved present' : 'Missing / Unresolved'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {!discrepancy.resolved ? (
                            <button
                              onClick={() => {
                                setResolvingAuditId(auditId);
                                setResolvingAssetId(discrepancy.assetId);
                              }}
                              className="btn-secondary py-1 px-3 text-[11px] font-bold"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-zinc-600 font-semibold pr-2">Cleared</span>
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Resolve Form */}
        {resolvingAssetId && resolvingAuditId && (
          <GlassCard className="border-zinc-800/40 bg-zinc-900/40 lg:col-span-1 border-t-emerald-500/40 border-t-2 animate-slide-up">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
              Clear Discrepancy
            </h3>

            <div className="mb-4 bg-zinc-950/40 p-3 rounded-lg text-xs space-y-1.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Resolving Hardware</span>
              <p className="text-zinc-200 font-semibold">
                {assets.find(a => a.id === resolvingAssetId)?.name || 'Missing Hardware'}
              </p>
            </div>

            <form onSubmit={handleResolveDiscrepancy} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Resolution findings</label>
                <textarea
                  required
                  placeholder="e.g. Asset recovered in Building C storage. Returned to active stock."
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  className="glass-input text-xs h-24 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setResolvingAssetId(null);
                    setResolvingAuditId(null);
                    setResolutionNotes('');
                  }}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-success text-xs"
                >
                  Resolve Present
                </button>
              </div>
            </form>
          </GlassCard>
        )}

      </div>
    </div>
  );
};

export default Audit;
