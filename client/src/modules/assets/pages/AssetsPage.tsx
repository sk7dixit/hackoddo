import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassCard from '../../../components/GlassCard';
import QRCodeGenerator from '../../../shared/QRCodeGenerator';
import { 
  Laptop, 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  History, 
  MapPin, 
  User,
  Clock, 
  Edit3, 
  Trash2, 
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  Workflow,
  Handshake,
  Wrench,
  ClipboardCheck
} from 'lucide-react';

interface AssetHistoryEntry {
  id: string;
  type: 'Allocation' | 'Maintenance' | 'Audit' | 'Transfer' | 'System';
  date: string;
  message: string;
}

interface Asset {
  id: string;
  name: string;
  categoryId: string;
  departmentId: string;
  location: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  cost: number;
  condition: 'Excellent' | 'Good' | 'Needs Repair' | 'Damaged';
  sharedResource: boolean;
  status: 'available' | 'allocated' | 'reserved' | 'under_maintenance' | 'lost' | 'retired';
  holder: string | null;
  history: AssetHistoryEntry[];
  allocationDetail?: {
    employeeName: string;
    department: string;
    allocationDate: string;
    expectedReturn: string;
  };
}

const STATUS_BADGES: Record<string, string> = {
  available: 'badge-available',
  allocated: 'badge-allocated',
  reserved: 'badge-reserved',
  under_maintenance: 'badge-maintenance',
  lost: 'badge-danger',
  retired: 'badge-neutral',
};

const STATUS_LABELS: Record<string, string> = {
  available: '🟢 Available',
  allocated: '🔵 Allocated',
  reserved: '🟡 Reserved',
  under_maintenance: '🟠 Maintenance',
  lost: '🔴 Lost',
  retired: '⚫ Retired',
};

export const AssetsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  // Data lists
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories] = useState(['Electronics', 'Furniture', 'Vehicles', 'Meeting Rooms', 'Printers']);
  const [departments] = useState(['IT', 'HR', 'Sales', 'Operations']);
  const [conditions] = useState(['Excellent', 'Good', 'Needs Repair', 'Damaged']);

  // Filter states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [conditionFilter, setConditionFilter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected asset for Details Drawer
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [historyTab, setHistoryTab] = useState<'All' | 'Allocation' | 'Maintenance' | 'Audit' | 'Transfer'>('All');

  // Modals visibility toggles
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    categoryId: 'Electronics',
    departmentId: 'IT',
    location: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    cost: '',
    condition: 'Excellent' as any,
    sharedResource: false,
  });

  const [editForm, setEditForm] = useState({
    location: '',
    condition: 'Excellent' as any,
    departmentId: 'IT',
    categoryId: 'Electronics',
    status: 'available' as any
  });

  // UX Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (initialStatus) {
      setStatusFilter(initialStatus);
    }
  }, [initialStatus]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assets');
        const data = await res.json();
        if (res.ok) {
          setAssets(data);
        } else {
          showFeedback('error', data.error || 'Failed to fetch assets.');
        }
      } catch (e) {
        showFeedback('error', 'Connection to backend failed.');
      }
    };
    fetchAssets();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedAsset) {
      const updated = assets.find(a => a.id === selectedAsset.id);
      if (updated) setSelectedAsset(updated);
    }
  }, [assets]);

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

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setDeptFilter('');
    setLocationFilter('');
    setStatusFilter('');
    setConditionFilter('');
    setCurrentPage(1);
  };

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.location) {
      showFeedback('error', 'Name and Location details are required.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to register asset');
      
      showFeedback('success', `Asset ${data.id} registered successfully!`);
      setShowAddModal(false);
      setAddForm({
        name: '',
        categoryId: 'Electronics',
        departmentId: 'IT',
        location: '',
        serialNumber: '',
        manufacturer: '',
        model: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        cost: '',
        condition: 'Excellent',
        sharedResource: false,
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleEditAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      const res = await fetch(`http://localhost:5000/api/assets/${selectedAsset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to edit asset');

      showFeedback('success', `Asset ${selectedAsset.id} updated successfully.`);
      setShowEditModal(false);
      setSelectedAsset(data);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!window.confirm(`Caution: Are you sure you want to retire asset ${id}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/assets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete asset');

      showFeedback('success', `Asset ${id} retired successfully.`);
      setSelectedAsset(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  const openEditModal = (asset: Asset) => {
    setEditForm({
      location: asset.location,
      condition: asset.condition,
      departmentId: asset.departmentId,
      categoryId: asset.categoryId,
      status: asset.status
    });
    setShowEditModal(true);
  };

  // Filtering Logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.id.toLowerCase().includes(search.toLowerCase()) ||
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      (asset.serialNumber && asset.serialNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = !categoryFilter || asset.categoryId === categoryFilter;
    const matchesDept = !deptFilter || asset.departmentId === deptFilter;
    const matchesLoc = !locationFilter || asset.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    const matchesCond = !conditionFilter || asset.condition === conditionFilter;

    return matchesSearch && matchesCat && matchesDept && matchesLoc && matchesStatus && matchesCond;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

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

      {/* Directory Header (28px Title, 15px Subtitle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Assets
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">Manage company hardware and resources</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card p-4.5 space-y-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] border-slate-200 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative col-span-1 lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Asset ID, Name or Serial Number"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-full focus:ring-[#5B5BD6]/10"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700 font-bold"
          >
            <option value="">All Statuses</option>
            {Object.keys(STATUS_LABELS).map(st => (
              <option key={st} value={st}>{STATUS_LABELS[st]}</option>
            ))}
          </select>

          {/* Condition */}
          <select
            value={conditionFilter}
            onChange={e => { setConditionFilter(e.target.value); setCurrentPage(1); }}
            className="glass-input py-1.5 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Conditions</option>
            {conditions.map(cd => (
              <option key={cd} value={cd}>{cd}</option>
            ))}
          </select>
        </div>

        {/* Advanced Location Drawer / Toggle Row */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-3 border-t border-slate-100 animate-slide-up">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Location Physical Space</label>
              <input
                type="text"
                placeholder="e.g. Floor 2, Desk 4..."
                value={locationFilter}
                onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                className="glass-input text-xs w-full py-1.5"
              />
            </div>
          </div>
        )}

        {/* Reset & Advanced Filter Button Controls */}
        <div className="flex justify-between items-center pt-1">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[10.5px] font-bold text-[#5B5BD6] hover:underline flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Location Filter' : 'Show Location Filter'}</span>
          </button>
          
          <button
            onClick={handleResetFilters}
            className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid View split: Table & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Assets Table (Left side) */}
        <div className={`space-y-4 ${selectedAsset ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <GlassCard className="p-0 overflow-hidden border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Holder</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 italic">No assets match filter query.</td>
                    </tr>
                  ) : (
                    currentItems.map(asset => {
                      const isSelected = selectedAsset?.id === asset.id;
                      return (
                        <tr 
                          key={asset.id} 
                          onClick={() => setSelectedAsset(asset)}
                          className={`transition-colors duration-150 ${
                            isSelected ? 'bg-indigo-50/50 hover:bg-indigo-50 border-l-2 border-l-[#5B5BD6]' : ''
                          }`}
                        >
                          {/* Asset ID in Purple & Semi Bold */}
                          <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{asset.id}</td>
                          
                          {/* Name in Dark & Bold */}
                          <td className="py-3 px-4 font-bold text-slate-900">{asset.name}</td>
                          
                          <td className="py-3 px-4 text-slate-500 font-medium">{asset.categoryId}</td>
                          
                          {/* Department & Location in Gray */}
                          <td className="py-3 px-4 text-slate-500 font-medium">{asset.departmentId}</td>
                          <td className="py-3 px-4 text-slate-500 font-medium">{asset.location}</td>
                          
                          {/* Status Badge with bullet */}
                          <td className="py-3 px-4">
                            <span className={`badge ${STATUS_BADGES[asset.status]}`}>
                              {STATUS_LABELS[asset.status]}
                            </span>
                          </td>
                          
                          {/* Holder in Dark */}
                          <td className="py-3 px-4 text-slate-700 font-semibold">{asset.holder || '—'}</td>
                          
                          <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setSelectedAsset(asset)}
                                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-[#5B5BD6] transition-all"
                                title="View Details"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedAsset(asset); openEditModal(asset); }}
                                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-[#5B5BD6] transition-all"
                                title="Edit Asset"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedAsset(asset); setHistoryTab('All'); }}
                                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-[#5B5BD6] transition-all"
                                title="View History"
                              >
                                <History className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedAsset(asset); setShowQrModal(true); }}
                                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-[#5B5BD6] transition-all"
                                title="Print QR"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAsset(asset.id)}
                                className="p-1.5 hover:bg-rose-50 rounded-full text-rose-500 hover:text-rose-700 transition-all"
                                title="Retire Asset"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-200 mt-0 text-xs font-semibold text-slate-500">
                <span>
                  Showing Page {currentPage} of {totalPages} ({filteredAssets.length} items)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Selected Asset Details Drawer (Right side) */}
        {selectedAsset && (
          <GlassCard className="border-slate-200 bg-white lg:col-span-1 animate-slide-up space-y-5 p-5 shadow-sm">
            
            {/* Header: Name & ID */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#5B5BD6] bg-[#5B5BD6]/5 px-2 py-0.5 border border-[#5B5BD6]/10 rounded font-mono">
                  {selectedAsset.id}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2 truncate max-w-[200px]">{selectedAsset.name}</h3>
                <span className={`badge ${STATUS_BADGES[selectedAsset.status]} mt-1.5`}>
                  {STATUS_LABELS[selectedAsset.status]}
                </span>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 hover:bg-slate-50 rounded transition-all"
              >
                Close
              </button>
            </div>

            {/* General Info Grid */}
            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category</span>
                <span className="text-slate-800">{selectedAsset.categoryId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department</span>
                <span className="text-slate-800">{selectedAsset.departmentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-800">{selectedAsset.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Serial Number</span>
                <span className="text-slate-800 font-mono">{selectedAsset.serialNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Purchase Date</span>
                <span className="text-slate-800">{selectedAsset.purchaseDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cost Details</span>
                <span className="text-slate-800">${selectedAsset.cost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Condition</span>
                <span className="text-slate-800">{selectedAsset.condition}</span>
              </div>
              
              {/* Holder display */}
              <div className="pt-2 border-t border-slate-100">
                {selectedAsset.status === 'allocated' && selectedAsset.allocationDetail ? (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Active Custody Holder</span>
                    <div className="flex items-center gap-2 text-slate-850">
                      <User className="w-3.5 h-3.5 text-[#5B5BD6]" />
                      <span className="font-bold text-xs">{selectedAsset.allocationDetail.employeeName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Allocated: {selectedAsset.allocationDetail.allocationDate} <br/>
                      Return due: {selectedAsset.allocationDetail.expectedReturn}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-center text-[10.5px] text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>In Warehouse Stock (No Holder)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions for selected Asset */}
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(selectedAsset)}
                className="flex-1 btn-secondary text-xs flex items-center justify-center gap-1.5 py-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Fields</span>
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="flex-1 btn-primary text-xs flex items-center justify-center gap-1.5 py-2"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>View QR</span>
              </button>
            </div>

            {/* Traced History Tabs */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {(['All', 'Allocation', 'Maintenance', 'Audit', 'Transfer'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHistoryTab(tab)}
                    className={`pb-1 transition-all ${historyTab === tab ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6]' : 'hover:text-slate-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* History Timeline */}
              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                {(() => {
                  let list = selectedAsset.history || [];
                  if (historyTab !== 'All') {
                    list = list.filter(h => h.type === historyTab);
                  }

                  if (list.length === 0) {
                    return <p className="text-[11px] text-slate-400 italic py-2">No history logs in this category.</p>;
                  }

                  return list.slice().reverse().map((log, lIdx) => (
                    <div key={log.id || lIdx} className="text-[11px] border-l border-slate-200 pl-3.5 py-0.5 relative space-y-1">
                      <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-300" />
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          {log.type === 'Allocation' && <Handshake className="w-3 h-3 text-blue-500" />}
                          {log.type === 'Maintenance' && <Wrench className="w-3 h-3 text-orange-500" />}
                          {log.type === 'Transfer' && <Workflow className="w-3 h-3 text-indigo-500" />}
                          {log.type === 'Audit' && <ClipboardCheck className="w-3 h-3 text-amber-500" />}
                          <span>{log.type} Event</span>
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-500 font-semibold leading-relaxed">{log.message}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </GlassCard>
        )}

      </div>

      {/* MODAL 1: Register Asset Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <GlassCard className="w-full max-w-lg bg-white border-slate-200 shadow-xl relative my-8 p-6 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 uppercase flex items-center gap-2">
              <Laptop className="w-5 h-5 text-[#5B5BD6]" />
              Register Inventory Hardware
            </h3>

            <form onSubmit={handleRegisterAsset} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dell Latitude 7440"
                    value={addForm.name}
                    onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Category</label>
                  <select
                    value={addForm.categoryId}
                    onChange={e => setAddForm({ ...addForm, categoryId: e.target.value })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Department</label>
                  <select
                    value={addForm.departmentId}
                    onChange={e => setAddForm({ ...addForm, departmentId: e.target.value })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Floor 2, Desk 4"
                    value={addForm.location}
                    onChange={e => setAddForm({ ...addForm, location: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-991A"
                    value={addForm.serialNumber}
                    onChange={e => setAddForm({ ...addForm, serialNumber: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Dell"
                    value={addForm.manufacturer}
                    onChange={e => setAddForm({ ...addForm, manufacturer: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Latitude"
                    value={addForm.model}
                    onChange={e => setAddForm({ ...addForm, model: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Purchase Date</label>
                  <input
                    type="date"
                    value={addForm.purchaseDate}
                    onChange={e => setAddForm({ ...addForm, purchaseDate: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Cost ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={addForm.cost}
                    onChange={e => setAddForm({ ...addForm, cost: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Condition</label>
                  <select
                    value={addForm.condition}
                    onChange={e => setAddForm({ ...addForm, condition: e.target.value as any })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shared Resource Checkbox */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1">
                <input
                  type="checkbox"
                  id="sharedResource"
                  checked={addForm.sharedResource}
                  onChange={e => setAddForm({ ...addForm, sharedResource: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5B5BD6] focus:ring-[#5B5BD6] bg-white border-slate-300 cursor-pointer"
                />
                <label htmlFor="sharedResource" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Mark as Shared Resource (Bookable by time slots)
                </label>
              </div>

              {/* Info Label */}
              <div className="p-3 bg-slate-50 border border-slate-200 flex gap-2 rounded-xl text-[10.5px]">
                <Info className="w-4 h-4 text-[#5B5BD6] shrink-0 mt-0.5" />
                <p className="text-slate-500 font-semibold leading-relaxed">
                  Every newly registered asset automatically starts in the <span className="text-emerald-600 font-bold">Available</span> status and receives an auto-generated Asset ID (e.g. AF-0081).
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  Register in Directory
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL 2: Edit Asset Form */}
      {showEditModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-white border-slate-200 shadow-xl p-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-6 uppercase">
              Edit Asset Details: {selectedAsset.id}
            </h3>

            <form onSubmit={handleEditAssetSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">Asset ID (Locked)</label>
                <input
                  type="text"
                  disabled
                  value={selectedAsset.id}
                  className="glass-input text-xs bg-slate-50 border-slate-200 text-slate-400 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Location</label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Condition</label>
                  <select
                    value={editForm.condition}
                    onChange={e => setEditForm({ ...editForm, condition: e.target.value as any })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Department</label>
                  <select
                    value={editForm.departmentId}
                    onChange={e => setEditForm({ ...editForm, departmentId: e.target.value })}
                    className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Category</label>
                <select
                  value={editForm.categoryId}
                  onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}
                  className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL 3: Print QR Code Tag */}
      {showQrModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <GlassCard className="w-full max-w-sm bg-white border-slate-200 shadow-xl relative p-6">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-6 uppercase flex items-center gap-1.5">
              <QrCode className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Print Hardware Barcode Tag
            </h3>

            <div className="py-4 bg-slate-50 border border-slate-200 rounded-xl">
              <QRCodeGenerator value={selectedAsset.id} name={selectedAsset.name} />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 btn-secondary text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 btn-primary text-xs flex items-center justify-center gap-1.5"
              >
                <span>Print Tag Label</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default AssetsPage;
