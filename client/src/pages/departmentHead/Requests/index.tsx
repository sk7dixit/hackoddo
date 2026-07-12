import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestSummaryCards from './components/RequestSummaryCards';
import RequestFilters from './components/RequestFilters';
import RequestTable from './components/RequestTable';
import RequestDrawer from './components/RequestDrawer';
import ApprovalAnalytics from './components/ApprovalAnalytics';
import { toast } from '../../../components/Toast';
import { ClipboardCheck, CheckSquare, Sparkles } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  employee: string;
  asset: string;
  type: 'allocation' | 'transfer' | 'return';
  priority: 'high' | 'medium' | 'low';
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  designation?: string;
  employeeId?: string;
  assetTag?: string;
  condition?: string;
  reason?: string;
  duration?: string;
}

export const Requests: React.FC = () => {
  const navigate = useNavigate();
  
  // Tabs State
  const [activeTab, setActiveTab] = useState<'allocation' | 'transfer' | 'return' | 'completed'>('allocation');

  // Filters State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [requestType, setRequestType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Drawer selection state
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  // Mock Database Roster list
  const [requestsList, setRequestsList] = useState<ApprovalRequest[]>([
    {
      id: 'AR-1004',
      employee: 'Rahul Verma',
      asset: 'Dell Latitude 7420',
      type: 'allocation',
      priority: 'medium',
      date: '2026-07-12',
      status: 'pending',
      designation: 'Senior Backend Engineer',
      employeeId: 'EMP-1024',
      assetTag: 'AF-LPT-0081',
      condition: 'Excellent',
      reason: 'Need high compute system for mobile app compiles.',
      duration: '90 Days'
    },
    {
      id: 'AR-1005',
      employee: 'Priya Sharma',
      asset: 'Dell XPS 15 9530',
      type: 'allocation',
      priority: 'high',
      date: '2026-07-12',
      status: 'pending',
      designation: 'Staff UX Researcher',
      employeeId: 'EMP-1026',
      assetTag: 'AF-LPT-0098',
      condition: 'Good',
      reason: 'Current assigned laptop screen flickering issue, needs replacement.',
      duration: '180 Days'
    },
    {
      id: 'AR-1006',
      employee: 'Riya Gupta',
      asset: 'ASUS ROG Zephyrus',
      type: 'allocation',
      priority: 'low',
      date: '2026-07-11',
      status: 'pending',
      designation: 'Data Scientist',
      employeeId: 'EMP-1033',
      assetTag: 'AF-LPT-0105',
      condition: 'Good',
      reason: 'Require GPU support for deep learning model training.',
      duration: '30 Days'
    },
    {
      id: 'AR-1010',
      employee: 'Rohit Sen ➔ Priya',
      asset: 'iPad Pro (11-inch)',
      type: 'transfer',
      priority: 'medium',
      date: '2026-07-12',
      status: 'pending',
      designation: 'Product Designer',
      employeeId: 'EMP-1025',
      assetTag: 'AF-TAB-0098',
      condition: 'Excellent',
      reason: 'Project team transition. Transferring tablet device custody.',
      duration: 'Indefinite'
    },
    {
      id: 'AR-1011',
      employee: 'Amit Kumar ➔ Kavita',
      asset: 'ThinkPad X1 Carbon',
      type: 'transfer',
      priority: 'low',
      date: '2026-07-11',
      status: 'pending',
      designation: 'Developer Intern',
      employeeId: 'EMP-1038',
      assetTag: 'AF-LPT-0104',
      condition: 'Good',
      reason: 'Intern handoff allocation.',
      duration: '90 Days'
    },
    {
      id: 'AR-1020',
      employee: 'Rohit Sen',
      asset: 'Dell XPS 13',
      type: 'return',
      priority: 'medium',
      date: '2026-07-12',
      status: 'pending',
      designation: 'Senior QA Engineer',
      employeeId: 'EMP-1025',
      assetTag: 'AF-LPT-0022',
      condition: 'Good',
      reason: 'Releasing temporary test laptop back to department inventory.',
      duration: 'Return'
    },
    {
      id: 'AR-1001',
      employee: 'Aman Verma',
      asset: 'Tesla Model Y Utility',
      type: 'allocation',
      priority: 'high',
      date: '2026-07-10',
      status: 'completed',
      designation: 'Operations Lead',
      employeeId: 'EMP-1002',
      assetTag: 'AF-CAR-0002',
      condition: 'Excellent',
      reason: 'Client site visits reservation.',
      duration: '3 Days'
    },
    {
      id: 'AR-1002',
      employee: 'Sarah Connor',
      asset: 'Dell XPS 15',
      type: 'allocation',
      priority: 'medium',
      date: '2026-07-09',
      status: 'rejected',
      designation: 'HR Coordinator',
      employeeId: 'EMP-1007',
      assetTag: 'AF-LPT-0144',
      condition: 'Good',
      reason: 'Requested replacement unit while current XPS is under repairs.',
      duration: '30 Days'
    }
  ]);

  // Handle Approve from Drawer
  const handleApproveConfirm = (target: ApprovalRequest, remarks: string, notifyEmp: boolean, notifyMgr: boolean) => {
    setRequestsList(prev => prev.map(req => {
      if (req.id === target.id) {
        return { ...req, status: 'approved' };
      }
      return req;
    }));

    toast.success(`Request ${target.id} approved. Remarks: ${remarks || 'None'}`);
    setSelectedRequest(null);
  };

  // Handle Reject from Drawer
  const handleRejectConfirm = (target: ApprovalRequest, remarks: string) => {
    setRequestsList(prev => prev.map(req => {
      if (req.id === target.id) {
        return { ...req, status: 'rejected' };
      }
      return req;
    }));

    toast.success(`Request ${target.id} rejected. Reason: ${remarks}`);
    setSelectedRequest(null);
  };

  // Bulk Approve
  const handleBulkApprove = () => {
    const pendingFiltered = filteredRequests.filter(r => r.status === 'pending');
    if (pendingFiltered.length === 0) {
      toast.error('No pending requests under current filter to bulk approve.');
      return;
    }

    setRequestsList(prev => prev.map(req => {
      const isPendingMatch = pendingFiltered.some(pf => pf.id === req.id);
      if (isPendingMatch) {
        return { ...req, status: 'approved' };
      }
      return req;
    }));

    toast.success(`Successfully bulk approved ${pendingFiltered.length} pending requests.`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setRequestType('all');
    setDateRange('all');
    toast.success('Filters cleared.');
  };

  // Compute summary card statistics
  const summaryCounts = {
    pending: requestsList.filter(r => r.status === 'pending').length,
    approvedToday: requestsList.filter(r => r.status === 'approved' || r.status === 'completed').length,
    rejectedToday: requestsList.filter(r => r.status === 'rejected').length,
    allocation: requestsList.filter(r => r.type === 'allocation' && r.status === 'pending').length,
    transfer: requestsList.filter(r => r.type === 'transfer' && r.status === 'pending').length,
    returns: requestsList.filter(r => r.type === 'return' && r.status === 'pending').length
  };

  // Filters logic
  const filteredRequests = requestsList.filter(item => {
    // Tab filter
    if (activeTab === 'allocation' && (item.type !== 'allocation' || item.status !== 'pending')) return false;
    if (activeTab === 'transfer' && (item.type !== 'transfer' || item.status !== 'pending')) return false;
    if (activeTab === 'return' && (item.type !== 'return' || item.status !== 'pending')) return false;
    if (activeTab === 'completed' && item.status === 'pending') return false;

    // Search Box: ID, Employee, Asset
    const q = search.toLowerCase();
    const searchMatch = !search ||
      item.id.toLowerCase().includes(q) ||
      item.employee.toLowerCase().includes(q) ||
      item.asset.toLowerCase().includes(q) ||
      (item.assetTag && item.assetTag.toLowerCase().includes(q));

    // Dropdowns
    const statusMatch = status === 'all' || item.status === status;
    const priorityMatch = priority === 'all' || item.priority === priority;
    const typeMatch = requestType === 'all' || item.type === requestType;

    return searchMatch && statusMatch && priorityMatch && typeMatch;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-605 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">Requests</span>
      </div>

      {/* Brand Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Requests & Approvals</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Review, authorize, and remark on custody allocations and transfers within the IT department
          </p>
        </div>

        {/* Action Toolbar */}
        {activeTab !== 'completed' && filteredRequests.length > 0 && (
          <button
            onClick={handleBulkApprove}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Bulk Approve</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <RequestSummaryCards counts={summaryCounts} />

      {/* Filters */}
      <RequestFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        requestType={requestType}
        setRequestType={setRequestType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onClear={handleClearFilters}
      />

      {/* Tab selection bar */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-6">
        <button
          onClick={() => setActiveTab('allocation')}
          className={`pb-3.5 px-1 relative transition-all cursor-pointer ${
            activeTab === 'allocation' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <span>Allocation Requests ({summaryCounts.allocation})</span>
          {activeTab === 'allocation' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('transfer')}
          className={`pb-3.5 px-1 relative transition-all cursor-pointer ${
            activeTab === 'transfer' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <span>Transfer Requests ({summaryCounts.transfer})</span>
          {activeTab === 'transfer' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('return')}
          className={`pb-3.5 px-1 relative transition-all cursor-pointer ${
            activeTab === 'return' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <span>Return Requests ({summaryCounts.returns})</span>
          {activeTab === 'return' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3.5 px-1 relative transition-all cursor-pointer ${
            activeTab === 'completed' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <span>Completed Archive</span>
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>
      </div>

      {/* Render Cards Grid for pending, Table for completed logs */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-slate-855">No Pending Requests</h3>
            <p className="text-[10.5px] text-slate-450 font-semibold max-w-sm">
              All department requests under this filter have been processed. Everything is up to date!
            </p>
          </div>
        </div>
      ) : activeTab === 'completed' ? (
        <RequestTable 
          requests={filteredRequests} 
          onSelect={setSelectedRequest} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-semibold text-xs text-slate-700">
          {filteredRequests.map(req => (
            <div 
              key={req.id} 
              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-[180px]"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-xs">{req.employee}</span>
                    <span className="text-[9.5px] text-slate-400 font-mono">({req.employeeId || 'EMP'})</span>
                  </div>
                  <span className="text-[10px] text-slate-450 block leading-none mt-1">{req.designation || 'Staff'}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                  req.priority === 'high' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                  req.priority === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                  'bg-slate-50 border-slate-150 text-slate-500'
                }`}>
                  {req.priority}
                </span>
              </div>

              {/* Justification quote snippet */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-slate-400">Requesting:</span>
                  <span className="font-extrabold text-slate-800 truncate max-w-[200px]">{req.asset}</span>
                </div>
                {req.reason && (
                  <p className="text-[10px] text-slate-500 bg-slate-50 p-2 border border-slate-150 rounded-xl italic leading-relaxed line-clamp-2">
                    "{req.reason}"
                  </p>
                )}
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="px-3.5 py-1.5 border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-bold cursor-pointer text-[10.5px] transition-all"
                >
                  Review Details
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Analytics dashboard segment */}
      <ApprovalAnalytics />

      {/* Details Drawer */}
      <RequestDrawer
        item={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApproveConfirm={handleApproveConfirm}
        onRejectConfirm={handleRejectConfirm}
      />

    </div>
  );
};

export default Requests;
