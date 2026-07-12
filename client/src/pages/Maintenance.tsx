import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Wrench, 
  Plus, 
  Check, 
  AlertTriangle,
  User,
  WrenchIcon,
  DollarSign,
  Calendar,
  Send,
  Info
} from 'lucide-react';
import { Maintenance, Asset, Employee } from '../../../server/src/types';

export const MaintenancePage: React.FC = () => {
  const { activeRole, currentUser, refreshTrigger, triggerRefresh } = useApp();

  const [tickets, setTickets] = useState<Maintenance[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Selected ticket for manager actions
  const [selectedTicket, setSelectedTicket] = useState<Maintenance | null>(null);

  // Layout control
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'resolved'>('active');
  const [showReportForm, setShowReportForm] = useState(false);

  // Forms states
  const [reportForm, setReportForm] = useState({ assetId: '', issueDescription: '' });
  const [approveForm, setApproveForm] = useState({ technician: '', cost: '' });
  const [resolveForm, setResolveForm] = useState({ technician: '', cost: '', notes: '' });

  // UX Feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsData, assetsData, empsData] = await Promise.all([
          api.get<Maintenance[]>('/maintenance'),
          api.get<Asset[]>('/assets'),
          api.get<Employee[]>('/employees')
        ]);
        setTickets(ticketsData);
        setAssets(assetsData);
        setEmployees(empsData);

        // Pre-select first physical asset in report form
        const physicalAssets = assetsData.filter(a => a.serialNumber !== 'ROOM-ALPHA' && a.serialNumber !== 'ROOM-BETA');
        if (physicalAssets.length > 0 && !reportForm.assetId) {
          setReportForm(f => ({ ...f, assetId: physicalAssets[0].id }));
        }
      } catch (e: any) {
        setFeedback({ type: 'error', message: e.message || 'Failed to load maintenance records' });
      }
    };
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated) {
        setSelectedTicket(updated);
        // Pre-populate resolve form with current details
        setResolveForm({
          technician: updated.technician,
          cost: updated.cost.toString(),
          notes: ''
        });
      }
    }
  }, [tickets]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter tickets based on roles
  const filteredTickets = tickets.filter(ticket => {
    if (activeRole === 'employee') {
      return ticket.reportedBy === currentUser?.id;
    }
    return true;
  });

  const activeTickets = filteredTickets.filter(t => t.status === 'reported' || t.status === 'approved');
  const resolvedTickets = filteredTickets.filter(t => t.status === 'resolved');

  const displayedTickets = activeSubTab === 'active' ? activeTickets : resolvedTickets;

  // Submit report
  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.assetId || !reportForm.issueDescription) {
      showFeedback('error', 'Please select an asset and describe the issue.');
      return;
    }
    try {
      await api.post('/maintenance', reportForm);
      showFeedback('success', 'Repair ticket raised successfully. Asset Managers have been notified.');
      setShowReportForm(false);
      setReportForm(f => ({ ...f, issueDescription: '' }));
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Manager Approve ticket (dispatch technician)
  const handleApproveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !approveForm.technician) {
      showFeedback('error', 'Technician/Vendor name is required.');
      return;
    }
    try {
      await api.patch(`/maintenance/${selectedTicket.id}/approve`, {
        technician: approveForm.technician,
        cost: Number(approveForm.cost) || 0
      });
      showFeedback('success', 'Repair approved and technician dispatched. Asset marked: Under Maintenance.');
      setApproveForm({ technician: '', cost: '' });
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Manager Resolve ticket (return asset to stock)
  const handleResolveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      await api.patch(`/maintenance/${selectedTicket.id}/resolve`, {
        technician: resolveForm.technician,
        cost: Number(resolveForm.cost) || 0,
        notes: resolveForm.notes
      });
      showFeedback('success', 'Repair resolved. Asset re-integrated into warehouse stock.');
      setSelectedTicket(null);
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Feedback Banner */}
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

      {/* Tabs / Actions Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800/80">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveSubTab('active');
              setSelectedTicket(null);
              setShowReportForm(false);
            }}
            className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
              activeSubTab === 'active' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Active Tickets ({activeTickets.length})</span>
            {activeSubTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveSubTab('resolved');
              setSelectedTicket(null);
              setShowReportForm(false);
            }}
            className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
              activeSubTab === 'resolved' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Resolved History ({resolvedTickets.length})</span>
            {activeSubTab === 'resolved' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
            )}
          </button>
        </div>

        {/* Report Button */}
        {activeRole === 'employee' && (
          <button
            onClick={() => {
              setShowReportForm(!showReportForm);
              setSelectedTicket(null);
            }}
            className="btn-primary flex items-center justify-center gap-2 text-xs py-3 mb-2"
          >
            <Plus className="w-4 h-4" />
            <span>Report Faulty Asset</span>
          </button>
        )}
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Tickets list */}
        <div className={`space-y-4 ${selectedTicket || showReportForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <GlassCard className="border-zinc-800/40">
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {displayedTickets.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 italic">
                  No tickets found in this segment.
                </div>
              ) : (
                displayedTickets.map(ticket => {
                  const asset = assets.find(a => a.id === ticket.assetId);
                  const reporter = employees.find(e => e.id === ticket.reportedBy);
                  const isSelected = selectedTicket?.id === ticket.id;

                  return (
                    <div 
                      key={ticket.id}
                      onClick={() => {
                        if (activeRole === 'admin' || activeRole === 'asset_manager') {
                          setSelectedTicket(ticket);
                          setShowReportForm(false);
                        }
                      }}
                      className={`p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                        activeRole === 'admin' || activeRole === 'asset_manager' ? 'cursor-pointer hover:border-zinc-800' : ''
                      } ${isSelected ? 'bg-violet-950/15 border-l-2 border-l-violet-500' : ''}`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-200 text-sm">{asset?.name || 'Unknown hardware'}</span>
                          <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                            {asset?.qrCode}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 font-medium">
                          Issue: <span className="text-zinc-300">"{ticket.issueDescription}"</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Reported: {new Date(ticket.reportedDate).toLocaleDateString()}
                          </span>
                          {ticket.technician && (
                            <span className="flex items-center gap-1">
                              <WrenchIcon className="w-3.5 h-3.5 text-violet-400" />
                              Tech: {ticket.technician}
                            </span>
                          )}
                          {ticket.cost > 0 && (
                            <span className="flex items-center gap-1 font-mono text-zinc-400 font-semibold">
                              <DollarSign className="w-3.5 h-3.5" />
                              Cost: ${ticket.cost.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-zinc-600 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" /> Reported by: {reporter?.name || ticket.reportedBy}
                        </p>
                      </div>

                      {/* Right side status badge */}
                      <div className="self-start md:self-center pr-2">
                        {ticket.status === 'reported' && (
                          <span className="badge badge-reserved">Reported</span>
                        )}
                        {ticket.status === 'approved' && (
                          <span className="badge badge-maintenance">In Repair</span>
                        )}
                        {ticket.status === 'resolved' && (
                          <span className="badge badge-available">Resolved</span>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Dynamic Form Panel */}

        {/* Form 1: Employee reports fault */}
        {showReportForm && (
          <GlassCard className="border-zinc-800/50 bg-zinc-900/40 lg:col-span-1 border-t-violet-500/40 border-t-2 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm tracking-tight text-white uppercase text-zinc-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-violet-400" />
                Report Hardware Fault
              </h3>
              <button 
                onClick={() => setShowReportForm(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Select Faulty Asset</label>
                <select
                  required
                  value={reportForm.assetId}
                  onChange={e => setReportForm({ ...reportForm, assetId: e.target.value })}
                  className="glass-input text-xs cursor-pointer bg-zinc-950"
                >
                  <option value="">Select hardware...</option>
                  {assets
                    // exclude rooms
                    .filter(a => a.serialNumber !== 'ROOM-ALPHA' && a.serialNumber !== 'ROOM-BETA')
                    .map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.qrCode})</option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Problem Description</label>
                <textarea
                  required
                  placeholder="Explain the fault details, what isn't working..."
                  value={reportForm.issueDescription}
                  onChange={e => setReportForm({ ...reportForm, issueDescription: e.target.value })}
                  className="glass-input text-xs h-32 resize-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary text-xs py-3 mt-2 flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </GlassCard>
        )}

        {/* Form 2: Manager Actions on selected ticket */}
        {selectedTicket && (
          <GlassCard className="border-zinc-800/50 bg-zinc-900/40 lg:col-span-1 border-t-orange-500/40 border-t-2 animate-slide-up space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/60">
              <div>
                <h4 className="font-extrabold text-sm text-zinc-200">
                  {assets.find(a => a.id === selectedTicket.assetId)?.name || 'Hardware Repair'}
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Ticket ID: {selectedTicket.id.substring(0, 8)}</p>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Ticket Info */}
            <div className="space-y-2 text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Fault Description</span>
              <p className="text-zinc-300 leading-relaxed italic bg-zinc-950/20 p-3 rounded-lg border border-zinc-800/60">
                "{selectedTicket.issueDescription}"
              </p>
            </div>

            {/* Manager Approve Form (technician assignment) */}
            {selectedTicket.status === 'reported' && (
              <form onSubmit={handleApproveTicket} className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Dispatch to technician
                </h4>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Technician / Repair Vendor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dell Support, Apple Bar"
                    value={approveForm.technician}
                    onChange={e => setApproveForm({ ...approveForm, technician: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Est. Repair Cost ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={approveForm.cost}
                    onChange={e => setApproveForm({ ...approveForm, cost: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <button type="submit" className="w-full btn-primary text-xs py-3">
                  Approve & Dispatch
                </button>
              </form>
            )}

            {/* Manager Resolve Form (closing out active repair) */}
            {selectedTicket.status === 'approved' && (
              <form onSubmit={handleResolveTicket} className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <WrenchIcon className="w-3.5 h-3.5 text-orange-400" />
                  Close Maintenance Ticket
                </h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Technician Name</label>
                  <input
                    type="text"
                    required
                    value={resolveForm.technician}
                    onChange={e => setResolveForm({ ...resolveForm, technician: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Actual Repair Cost ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 120"
                    value={resolveForm.cost}
                    onChange={e => setResolveForm({ ...resolveForm, cost: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Resolution Notes</label>
                  <textarea
                    placeholder="Describe what was repaired/replaced..."
                    value={resolveForm.notes}
                    onChange={e => setResolveForm({ ...resolveForm, notes: e.target.value })}
                    className="glass-input text-xs h-20 resize-none"
                  />
                </div>

                <button type="submit" className="w-full btn-success text-xs py-3">
                  Mark Resolved (Return to Stock)
                </button>
              </form>
            )}

            {/* Info note */}
            <div className="bg-zinc-950/30 p-3 rounded-lg border border-zinc-800 flex gap-2 text-[10px]">
              <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <p className="text-zinc-400 leading-relaxed">
                Resolving a repair ticket updates the hardware inventory status back to <span className="text-emerald-400 font-semibold">Available</span>, releasing it for allocation.
              </p>
            </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
};

export default MaintenancePage;
