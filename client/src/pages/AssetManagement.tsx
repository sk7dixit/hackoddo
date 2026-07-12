import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import QRCodeModal from '../components/QRCodeModal';
import { 
  Laptop, 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  History, 
  MapPin, 
  DollarSign, 
  Calendar,
  CheckCircle,
  FileText,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { Asset, Category, Department, Employee, AssetStatus } from '../../../server/src/types';

const STATUS_BADGES: Record<AssetStatus, string> = {
  available: 'badge-available',
  allocated: 'badge-allocated',
  reserved: 'badge-reserved',
  under_maintenance: 'badge-maintenance',
  retired: 'badge-neutral',
  disposed: 'badge-neutral',
  lost: 'badge-danger',
};

const STATUS_LABELS: Record<AssetStatus, string> = {
  available: 'Available',
  allocated: 'Allocated',
  reserved: 'Reserved',
  under_maintenance: 'In Repair',
  retired: 'Retired',
  disposed: 'Disposed',
  lost: 'Lost / Missing',
};

export const AssetManagement: React.FC = () => {
  const { activeRole, currentUser, refreshTrigger, triggerRefresh, setActiveTab } = useApp();
  
  // Data lists
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Selected asset for detail drawer/modal
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // UI Panels toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAsset, setQrAsset] = useState<Asset | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Add/Edit Form states
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    serialNumber: '',
    qrCode: '',
    cost: '',
    purchaseDate: '',
    departmentId: '',
    location: '',
  });

  // Allocation request form modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNotes, setRequestNotes] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  // UX Feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, catsData, deptsData, empsData] = await Promise.all([
          api.get<Asset[]>('/assets'),
          api.get<Category[]>('/categories'),
          api.get<Department[]>('/departments'),
          api.get<Employee[]>('/employees'),
        ]);
        setAssets(assetsData);
        setCategories(catsData);
        setDepartments(deptsData);
        setEmployees(empsData);

        // Pre-select category in form if available
        if (catsData.length > 0 && !formData.categoryId) {
          setFormData(f => ({ ...f, categoryId: catsData[0].id }));
        }
      } catch (e: any) {
        setFeedback({ type: 'error', message: e.message || 'Failed to fetch inventory' });
      }
    };
    fetchData();
  }, [refreshTrigger]);

  // Keep selected asset in sync after data refreshes
  useEffect(() => {
    if (selectedAsset) {
      const updated = assets.find(a => a.id === selectedAsset.id);
      if (updated) setSelectedAsset(updated);
    }
  }, [assets]);

  const handleShowFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Add new Asset
  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.location) {
      handleShowFeedback('error', 'Name, Category and Location are required.');
      return;
    }
    try {
      const newAsset = await api.post<Asset>('/assets', {
        ...formData,
        cost: Number(formData.cost) || 0
      });
      handleShowFeedback('success', `"${newAsset.name}" registered successfully.`);
      setShowAddForm(false);
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        serialNumber: '',
        qrCode: '',
        cost: '',
        purchaseDate: '',
        departmentId: '',
        location: '',
      });
      triggerRefresh();
    } catch (e: any) {
      handleShowFeedback('error', e.message);
    }
  };

  // Edit/Update selected asset fields (e.g. changing status manually)
  const handleUpdateStatus = async (status: AssetStatus) => {
    if (!selectedAsset) return;
    try {
      const updated = await api.patch<Asset>(`/assets/${selectedAsset.id}`, { status });
      setSelectedAsset(updated);
      handleShowFeedback('success', `Status updated to ${STATUS_LABELS[status]}.`);
      triggerRefresh();
    } catch (e: any) {
      handleShowFeedback('error', e.message);
    }
  };

  // Request allocation form handler
  const handleRequestAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      await api.post('/allocations/request', {
        assetId: selectedAsset.id,
        expectedReturnDate,
        notes: requestNotes
      });
      handleShowFeedback('success', `Request for "${selectedAsset.name}" submitted successfully.`);
      setShowRequestModal(false);
      setRequestNotes('');
      setExpectedReturnDate('');
      triggerRefresh();
    } catch (e: any) {
      handleShowFeedback('error', e.message);
    }
  };

  // Filtered Assets list calculation
  const filteredAssets = assets.filter(a => {
    const category = categories.find(c => c.id === a.categoryId);
    const matchesSearch = 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.qrCode.toLowerCase().includes(search.toLowerCase()) ||
      (a.serialNumber && a.serialNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = !categoryFilter || a.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || a.status === statusFilter;
    const matchesType = !typeFilter || category?.type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Feedback banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Primary search & controls row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets name, serial, QR..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass-input pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-900 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-900 px-3 py-1.5 rounded-xl text-xs">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {Object.keys(STATUS_LABELS).map(status => (
                <option key={status} value={status}>{STATUS_LABELS[status as AssetStatus]}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-900 px-3 py-1.5 rounded-xl text-xs">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="asset">Physical Assets</option>
              <option value="resource">Shared Resources</option>
            </select>
          </div>
        </div>

        {/* Register Button */}
        {(activeRole === 'admin' || activeRole === 'asset_manager') && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedAsset(null);
            }}
            className="btn-primary flex items-center justify-center gap-2 text-xs py-3"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        )}
      </div>

      {/* Grid split layout: List & Detail drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Assets List */}
        <div className={`space-y-4 ${selectedAsset || showAddForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <GlassCard className="border-zinc-800/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Asset Label / Name</th>
                    <th className="pb-3 pr-4">QR / Serial</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500 italic">
                        <FolderOpen className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
                        No assets found matching current filter values.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map(asset => {
                      const cat = categories.find(c => c.id === asset.categoryId);
                      const isSelected = selectedAsset?.id === asset.id;
                      return (
                        <tr 
                          key={asset.id} 
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowAddForm(false);
                          }}
                          className={`hover:bg-zinc-900/20 cursor-pointer transition-all duration-150 ${
                            isSelected ? 'bg-violet-950/15 border-l-2 border-l-violet-500' : ''
                          }`}
                        >
                          <td className="py-4 font-semibold text-zinc-200">
                            <div>
                              <span>{asset.name}</span>
                              <span className="text-[9px] uppercase font-extrabold text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded ml-2 border border-zinc-800/40 font-mono">
                                {cat?.type === 'asset' ? 'Hardware' : 'Resource'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 font-mono text-[10px] text-zinc-400">
                            <div>QR: {asset.qrCode}</div>
                            {asset.serialNumber !== 'N/A' && <div className="text-zinc-500">SN: {asset.serialNumber}</div>}
                          </td>
                          <td className="py-4 text-zinc-400">{cat?.name || 'Uncategorized'}</td>
                          <td className="py-4">
                            <span className={`badge ${STATUS_BADGES[asset.status]}`}>
                              {STATUS_LABELS[asset.status]}
                            </span>
                          </td>
                          <td className="py-4 text-zinc-400">{asset.location}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column Panel: Form or Selected Asset details */}
        
        {/* Panel 1: Create Asset Form */}
        {showAddForm && (
          <GlassCard className="border-zinc-800/50 bg-zinc-900/40 lg:col-span-1 border-t-violet-500/40 border-t-2 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm tracking-tight text-white uppercase text-zinc-400 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-violet-400" />
                Register Hardware/Resource
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Asset/Resource Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dell UltraSharp 34 Monitor"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Master Category</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  className="glass-input text-xs cursor-pointer bg-zinc-950"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type === 'asset' ? 'Hardware' : 'Resource'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Serial Number (S/N)</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-88A902"
                    value={formData.serialNumber}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Custom QR Tag</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={formData.qrCode}
                    onChange={e => setFormData({ ...formData, qrCode: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Purchase Cost ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={formData.cost}
                    onChange={e => setFormData({ ...formData, cost: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Owning Department</label>
                <select
                  value={formData.departmentId}
                  onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                  className="glass-input text-xs cursor-pointer bg-zinc-950"
                >
                  <option value="">No Department (Global/Shared)</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Physical Location</label>
                <input
                  type="text"
                  placeholder="e.g. Building B, 3rd Floor Rack"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>

              <button type="submit" className="w-full btn-primary text-xs py-3 mt-2">
                Register in Database
              </button>
            </form>
          </GlassCard>
        )}

        {/* Panel 2: Selected Asset Details Panel */}
        {selectedAsset && (
          <GlassCard className="border-zinc-800/50 bg-zinc-900/40 lg:col-span-1 animate-slide-up space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/60">
              <div>
                <h3 className="font-extrabold text-sm text-white truncate max-w-[200px]">{selectedAsset.name}</h3>
                <span className={`badge ${STATUS_BADGES[selectedAsset.status]} mt-1`}>
                  {STATUS_LABELS[selectedAsset.status]}
                </span>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Asset Metadata Grid */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <span className="text-zinc-200 font-semibold">{selectedAsset.location}</span>
              </div>

              {selectedAsset.serialNumber !== 'N/A' && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" /> Serial No
                  </span>
                  <span className="text-zinc-200 font-mono font-semibold">{selectedAsset.serialNumber}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" /> QR Label
                </span>
                <span className="text-zinc-200 font-mono font-bold flex items-center gap-1.5">
                  {selectedAsset.qrCode}
                  <button 
                    onClick={() => {
                      setQrAsset(selectedAsset);
                      setShowQrModal(true);
                    }}
                    className="p-1 hover:bg-zinc-800 rounded text-violet-400 hover:text-violet-300 transition-colors"
                    title="Print QR Tag"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>

              {selectedAsset.cost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Cost Value
                  </span>
                  <span className="text-zinc-200 font-mono font-semibold">${selectedAsset.cost.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Registered
                </span>
                <span className="text-zinc-200 font-semibold">{selectedAsset.purchaseDate}</span>
              </div>
            </div>

            {/* Actions for Employees vs Managers */}
            <div className="pt-4 border-t border-zinc-800/60">
              {/* Asset Manager/Admin Manual overrides */}
              {(activeRole === 'admin' || activeRole === 'asset_manager') && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Force Status override
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button
                      onClick={() => handleUpdateStatus('available')}
                      disabled={selectedAsset.status === 'available'}
                      className="py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-emerald-400 font-semibold disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Make Available
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('retired')}
                      disabled={selectedAsset.status === 'retired'}
                      className="py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 font-semibold disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Retire Asset
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('disposed')}
                      disabled={selectedAsset.status === 'disposed'}
                      className="py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 font-semibold disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Dispose Asset
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('lost')}
                      disabled={selectedAsset.status === 'lost'}
                      className="py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-rose-400 font-semibold disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Mark Lost
                    </button>
                  </div>
                </div>
              )}

              {/* Employee/Head Request Allocation or Resource Booking */}
              {activeRole === 'employee' || activeRole === 'department_head' ? (
                (() => {
                  const cat = categories.find(c => c.id === selectedAsset.categoryId);
                  if (cat?.type === 'asset') {
                    return (
                      <button
                        onClick={() => setShowRequestModal(true)}
                        disabled={selectedAsset.status !== 'available'}
                        className="w-full btn-primary text-xs py-3 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                      >
                        Request Physical Allocation
                      </button>
                    );
                  } else {
                    return (
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="w-full btn-success text-xs py-3 flex items-center justify-center gap-1.5"
                      >
                        Go to Booking Calendar
                      </button>
                    );
                  }
                })()
              ) : null}
            </div>

            {/* Lifecycle History Log */}
            <div className="pt-4 border-t border-zinc-800/60">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-3">
                <History className="w-3.5 h-3.5" /> Lifecycle history log
              </h4>
              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1">
                {selectedAsset.history && selectedAsset.history.length > 0 ? (
                  selectedAsset.history.slice().reverse().map(log => (
                    <div key={log.id} className="text-[11px] border-l-2 border-zinc-800 pl-3 py-0.5 space-y-0.5">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="font-bold text-zinc-300">{log.action}</span>
                        <span className="text-[9px] font-mono text-zinc-600">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-zinc-500 leading-relaxed">{log.notes || 'No description notes provided.'}</p>
                      <p className="text-[9px] text-zinc-600 font-medium">By: {
                        employees.find(e => e.id === log.performedBy)?.name || log.performedBy
                      }</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-zinc-600 italic">No history log records exist.</p>
                )}
              </div>
            </div>
          </GlassCard>
        )}

      </div>

      {/* MODAL 1: Request Physical Allocation Form */}
      {showRequestModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Request Asset Allocation
            </h3>
            
            <div className="mb-4 bg-zinc-950/40 border border-zinc-800/60 p-3.5 rounded-xl text-xs space-y-1">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Requested Hardware</span>
              <p className="text-zinc-200 font-semibold text-sm">{selectedAsset.name}</p>
              <p className="text-zinc-500 font-mono text-[10px]">QR Code: {selectedAsset.qrCode}</p>
            </div>

            <form onSubmit={handleRequestAllocation} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Expected Return Date</label>
                <input
                  type="date"
                  required
                  value={expectedReturnDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setExpectedReturnDate(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reason / Usage Notes</label>
                <textarea
                  placeholder="State why you need this hardware..."
                  value={requestNotes}
                  onChange={e => setRequestNotes(e.target.value)}
                  className="glass-input text-xs h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* QR Code label modal display */}
      {showQrModal && (
        <QRCodeModal 
          asset={qrAsset}
          onClose={() => {
            setShowQrModal(false);
            setQrAsset(null);
          }}
        />
      )}
    </div>
  );
};

export default AssetManagement;
