import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentAssetFilters from './components/DepartmentAssetFilters';
import DepartmentAssetTable from './components/DepartmentAssetTable';
import DepartmentAssetDrawer from './components/DepartmentAssetDrawer';
import { toast } from '../../../components/Toast';
import { Boxes, Laptop, CheckCircle, Wrench, Calendar, AlertTriangle, FileText, Printer, Download, X } from 'lucide-react';
import QRCodeGenerator from '../../../shared/QRCodeGenerator';

interface AssetItem {
  id: string;
  name: string;
  category: string;
  assignedTo: string | null;
  status: 'available' | 'allocated' | 'under_maintenance' | 'reserved' | 'lost' | 'retired';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
  location: string;
  returnDate: string | null;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  warranty: string;
  history?: Array<{ date: string; action: string; performedBy: string; notes?: string }>;
  maintenance?: Array<{ date: string; issue: string; status: string }>;
  allocations?: Array<{ employee: string; from: string; to: string }>;
}

export const DepartmentAssets: React.FC = () => {
  const navigate = useNavigate();
  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [condition, setCondition] = useState('all');
  const [location, setLocation] = useState('all');
  const [returnStatus, setReturnStatus] = useState('all');

  // Selected asset for drawer
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [qrAsset, setQrAsset] = useState<AssetItem | null>(null);

  // Mock Assets List (realistic IT department dataset)
  const mockAssets: AssetItem[] = [
    {
      id: 'AF-0045',
      name: 'Dell Latitude 7440',
      category: 'Electronics',
      assignedTo: 'Rahul Sharma',
      status: 'allocated',
      condition: 'Good',
      location: 'IT Department',
      returnDate: '2026-07-28',
      serialNumber: 'DL5562719X91',
      manufacturer: 'Dell Inc.',
      purchaseDate: '2024-02-15',
      warranty: '3 Years (Active)',
      maintenance: [
        { date: '2025-06-12', issue: 'Keyboard key stuck', status: 'Resolved' }
      ],
      allocations: [
        { employee: 'Rahul Sharma', from: '2024-02-15', to: 'Current' }
      ]
    },
    {
      id: 'AF-0104',
      name: 'Lenovo ThinkPad X1 Carbon',
      category: 'Electronics',
      assignedTo: 'Rohit Sen',
      status: 'allocated',
      condition: 'Excellent',
      location: 'Engineering Lab',
      returnDate: '2026-07-13', // Tomorrow
      serialNumber: 'TP9981276C2',
      manufacturer: 'Lenovo Group',
      purchaseDate: '2024-08-20',
      warranty: '3 Years (Active)',
      maintenance: [],
      allocations: [
        { employee: 'Rohit Sen', from: '2024-08-20', to: 'Current' }
      ]
    },
    {
      id: 'AF-0098',
      name: 'iPad Pro (11-inch)',
      category: 'Electronics',
      assignedTo: 'Amit Kumar',
      status: 'allocated',
      condition: 'Excellent',
      location: 'IT Department',
      returnDate: '2026-07-12', // Today
      serialNumber: 'IP3341829B6',
      manufacturer: 'Apple Inc.',
      purchaseDate: '2025-01-10',
      warranty: '2 Years (Active)',
      maintenance: [],
      allocations: [
        { employee: 'Amit Kumar', from: '2025-01-10', to: 'Current' }
      ]
    },
    {
      id: 'AF-0056',
      name: 'Dell XPS 15 9530',
      category: 'Electronics',
      assignedTo: 'Sneha Roy',
      status: 'allocated',
      condition: 'Good',
      location: 'HQ Office',
      returnDate: '2026-07-09', // Overdue
      serialNumber: 'DL77182910X9',
      manufacturer: 'Dell Inc.',
      purchaseDate: '2024-05-18',
      warranty: '3 Years (Active)',
      maintenance: [
        { date: '2025-11-20', issue: 'OS corruption reinstall', status: 'Resolved' }
      ],
      allocations: [
        { employee: 'Sneha Roy', from: '2024-05-18', to: 'Current' }
      ]
    },
    {
      id: 'AF-0144',
      name: 'Dell XPS 15 (Swollen Battery)',
      category: 'Electronics',
      assignedTo: 'Emma Watson',
      status: 'under_maintenance',
      condition: 'Damaged',
      location: 'IT Department',
      returnDate: null,
      serialNumber: 'DL991827C94',
      manufacturer: 'Dell Inc.',
      purchaseDate: '2024-08-20',
      warranty: '3 Years (Active)',
      maintenance: [
        { date: '2026-07-10', issue: 'Battery swelling up causing keyboard warp', status: 'Pending' }
      ],
      allocations: []
    },
    {
      id: 'AF-0021',
      name: 'EPSON EB-FH06 Projector',
      category: 'Electronics',
      assignedTo: null,
      status: 'available',
      condition: 'Good',
      location: 'Meeting Room Alpha',
      returnDate: null,
      serialNumber: 'EP4451290C1',
      manufacturer: 'Epson',
      purchaseDate: '2023-03-12',
      warranty: '1 Year (Expired)',
      maintenance: [],
      allocations: []
    },
    {
      id: 'AF-0002',
      name: 'Tesla Model Y Utility Car',
      category: 'Vehicles',
      assignedTo: 'Aman Verma',
      status: 'reserved',
      condition: 'Excellent',
      location: 'HQ Office',
      returnDate: '2026-07-15',
      serialNumber: '5YJYGD38190A',
      manufacturer: 'Tesla Motors',
      purchaseDate: '2024-11-12',
      warranty: '4 Years (Active)',
      maintenance: [],
      allocations: [
        { employee: 'Aman Verma', from: '2024-11-12', to: 'Current' }
      ]
    },
    {
      id: 'AF-0007',
      name: 'HP LaserJet Printer',
      category: 'Printers',
      assignedTo: null,
      status: 'available',
      condition: 'Fair',
      location: 'Server Room',
      returnDate: null,
      serialNumber: 'HP44918270Q9',
      manufacturer: 'HP Inc.',
      purchaseDate: '2023-11-12',
      warranty: '1 Year (Expired)',
      maintenance: [],
      allocations: []
    }
  ];

  // Filters logic
  const filteredAssets = mockAssets.filter(item => {
    // Search filter: ID, Name, Serial, or assigned employee name
    const q = search.toLowerCase();
    const searchMatch = !search || 
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.serialNumber.toLowerCase().includes(q) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(q));

    const categoryMatch = category === 'all' || item.category === category;
    const statusMatch = status === 'all' || item.status === status;
    const conditionMatch = condition === 'all' || item.condition === condition;
    const locationMatch = location === 'all' || item.location === location;

    // Timeline deadline check
    let returnMatch = true;
    if (returnStatus === 'upcoming') {
      returnMatch = item.returnDate !== null && (item.returnDate.endsWith('-13') || item.returnDate.endsWith('-12'));
    } else if (returnStatus === 'overdue') {
      returnMatch = item.returnDate !== null && item.returnDate.endsWith('-09');
    }

    return searchMatch && categoryMatch && statusMatch && conditionMatch && locationMatch && returnMatch;
  });

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setCondition('all');
    setLocation('all');
    setReturnStatus('all');
    toast.success('Filters cleared.');
  };

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    if (format === 'CSV' || format === 'Excel') {
      if (filteredAssets.length === 0) {
        toast.error('No asset data available to export.');
        return;
      }
      
      const csvData = filteredAssets.map(item => ({
        AssetTag: item.id,
        Name: item.name,
        Category: item.category,
        Custodian: item.assignedTo || 'Unassigned',
        Status: item.status,
        Condition: item.condition,
        Location: item.location,
        ReturnDate: item.returnDate || 'N/A',
        SerialNumber: item.serialNumber,
        Manufacturer: item.manufacturer,
        PurchaseDate: item.purchaseDate,
        Warranty: item.warranty
      }));

      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => 
        Object.values(row).map(val => {
          const str = String(val);
          return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str;
        }).join(',')
      );
      
      const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `department_assets_${format.toLowerCase() === 'csv' ? 'audit' : 'export'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded department_assets_${format.toLowerCase() === 'csv' ? 'audit' : 'export'}.csv`);
    } else if (format === 'PDF') {
      window.print();
    }
  };

  const handleBulkPrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="no-print flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">Department Assets</span>
      </div>
      
      {/* Brand Header Section */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Department Assets</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Browse and monitor physical units allocated to the Information Technology department
          </p>
        </div>
        
        {/* Bulk Export & Prints */}
        <div className="flex items-center gap-2 text-xs font-bold font-mono">
          <button
            onClick={handleBulkPrint}
            className="px-3.5 py-2.5 border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl flex items-center gap-1.5 cursor-pointer text-slate-700 font-sans"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print QR Labels</span>
          </button>
          
          <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-xl text-slate-650 font-sans">
            <button 
              onClick={() => handleExport('PDF')}
              className="px-2.5 py-1.5 hover:bg-white hover:shadow-xs rounded-lg transition-all flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>PDF</span>
            </button>
            <button 
              onClick={() => handleExport('Excel')}
              className="px-2.5 py-1.5 hover:bg-white hover:shadow-xs rounded-lg transition-all flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Excel</span>
            </button>
            <button 
              onClick={() => handleExport('CSV')}
              className="px-2.5 py-1.5 hover:bg-white hover:shadow-xs rounded-lg transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#5B5BD6]" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats summary Row */}
      <div className="no-print grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B5BD6]">
            <Boxes className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block leading-none">Total Assets</span>
            <span className="text-lg font-black text-slate-800 font-mono block mt-1">186</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Laptop className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block leading-none">Allocated</span>
            <span className="text-lg font-black text-slate-800 font-mono block mt-1">143</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block leading-none">Available</span>
            <span className="text-lg font-black text-slate-800 font-mono block mt-1">29</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Wrench className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block leading-none">Repairs SLA</span>
            <span className="text-lg font-black text-slate-800 font-mono block mt-1">8</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block leading-none">Reserved</span>
            <span className="text-lg font-black text-slate-800 font-mono block mt-1">6</span>
          </div>
        </div>

        <div className="p-4 bg-[#EF4444]/4 border border-rose-200 rounded-2xl flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase text-rose-600 block leading-none">Overdue</span>
            <span className="text-lg font-black text-rose-700 font-mono block mt-1">4</span>
          </div>
        </div>

      </div>

      {/* Sticky Filter component wrapper */}
      {/* Sticky Filter component wrapper */}
      <div className="no-print sticky top-[74px] bg-[#F5F7FB] pt-2 pb-2 z-20 border-b border-slate-200">
        <DepartmentAssetFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          condition={condition}
          setCondition={setCondition}
          location={location}
          setLocation={setLocation}
          returnStatus={returnStatus}
          setReturnStatus={setReturnStatus}
          onClear={handleClearFilters}
        />
      </div>

      {/* Table Results count indicator */}
      <div className="no-print flex justify-between items-center text-xs font-semibold text-slate-500">
        <span>Showing {filteredAssets.length} of {mockAssets.length} Assets matching filters</span>
      </div>

      {/* Asset Table / Empty State Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <Boxes className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-slate-800">No Assets Assigned</h3>
            <p className="text-[10.5px] text-slate-450 font-semibold max-w-sm">
              Your department currently has no registered assets matching the current selection.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-slate-250 hover:border-slate-350 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <DepartmentAssetTable 
          assets={filteredAssets} 
          onSelect={setSelectedAsset} 
          onSelectQr={setQrAsset}
        />
      )}

      {/* Slide Drawer Details */}
      <DepartmentAssetDrawer 
        item={selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />

      {/* Dedicated QrModal popup */}
      {qrAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full relative p-6 space-y-5 animate-slide-up text-center font-semibold text-slate-700">
            
            <button
              onClick={() => setQrAsset(null)}
              className="absolute top-4.5 right-4.5 p-1.5 rounded-lg border border-slate-205 text-slate-400 hover:text-slate-655 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 flex flex-col items-center">
              <span className="text-[10px] font-extrabold text-[#5B5BD6] uppercase tracking-wider">Asset QR Code Pass</span>
              <h3 className="font-extrabold text-sm text-slate-900">{qrAsset.name}</h3>
              <span className="text-[10.5px] font-mono text-slate-450 font-bold">{qrAsset.id}</span>
            </div>

            {/* Styled Large QR code generator box */}
            <div className="p-1.5 flex justify-center bg-white rounded-2xl border border-slate-100 shadow-xs max-w-[180px] mx-auto">
              <QRCodeGenerator value={qrAsset.id} name={qrAsset.name} size={120} />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  document.body.classList.add('print-only-qr');
                  window.print();
                  document.body.classList.remove('print-only-qr');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors text-xs"
              >
                Print Label
              </button>
              <button
                onClick={() => setQrAsset(null)}
                className="flex-1 py-2.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer transition-colors text-xs shadow-sm shadow-[#5B5BD6]/10"
              >
                Close Pass
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentAssets;
