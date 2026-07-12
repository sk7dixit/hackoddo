import React from 'react';
import { X, QrCode, FileText, Download, Printer, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { toast } from '../../../../components/Toast';

interface HistoryItem {
  date: string;
  action: string;
  performedBy: string;
  notes?: string;
}

interface MaintenanceHistoryItem {
  date: string;
  issue: string;
  status: string;
}

interface AllocationHistoryItem {
  employee: string;
  from: string;
  to: string;
}

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
  history?: HistoryItem[];
  maintenance?: MaintenanceHistoryItem[];
  allocations?: AllocationHistoryItem[];
}

interface DrawerProps {
  item: AssetItem | null;
  onClose: () => void;
}

export const DepartmentAssetDrawer: React.FC<DrawerProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handlePrintQR = () => {
    toast.success(`QR Label for ${item.id} successfully queued to print.`);
  };

  const handleDownloadQR = () => {
    toast.success(`QR tag image download started for ${item.id}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[520px] bg-white border-l border-slate-200 h-screen flex flex-col z-10 shadow-2xl animate-slide-left font-semibold text-xs text-slate-700">
        
        {/* Header Title */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Asset registry drawer</span>
            <h3 className="font-extrabold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
              <span>Inspect details:</span>
              <span className="font-mono text-[#5B5BD6] font-bold">{item.id}</span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable details panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Basic Information
            </h4>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Category: {item.category} • Condition: <span className="font-extrabold text-[#5B5BD6]">{item.condition}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1 text-[11px]">
              <div>
                <span className="text-slate-450 font-bold block">Manufacturer</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">{item.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Serial Number</span>
                <span className="text-slate-800 font-mono font-bold block mt-0.5">{item.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-450 font-bold block">Purchase Date</span>
                <span className="text-slate-800 font-mono font-bold block mt-0.5">{item.purchaseDate}</span>
              </div>
              <div>
                <span className="text-slate-455 font-bold block">Warranty period</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">{item.warranty}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Current Custody Allocation */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Current Allocation
            </h4>
            {item.assignedTo ? (
              <div className="p-4 bg-[#5B5BD6]/4 border border-[#5B5BD6]/10 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white border border-[#5B5BD6]/15 flex items-center justify-center font-bold text-xs text-[#5B5BD6]">
                    {item.assignedTo.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-850 block">{item.assignedTo}</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5">Information Technology • Holder</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10.5px] border-t border-[#5B5BD6]/8 pt-3">
                  <div>
                    <span className="text-slate-455 font-bold block">Expected Return</span>
                    <span className="text-[#5B5BD6] font-mono font-bold block mt-0.5">
                      {item.returnDate || 'No return date'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-455 font-bold block">Current Location</span>
                    <span className="text-slate-700 font-extrabold block mt-0.5">{item.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-center text-slate-400 italic font-medium py-6">
                No active allocation. Hardware is currently in stock.
              </div>
            )}
          </div>

          {/* Section 3: Visual Lifecycle Timeline */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Lifecycle Timeline
            </h4>
            <div className="border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-4.5 text-[11px]">
              
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Asset Registered</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">15 Jan 2025</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                  <UserCheck className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Allocated to Holder</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">20 Jan 2025 • Notes: Initial deployment</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-slate-50 border border-slate-250 text-slate-400 flex items-center justify-center">
                  <Calendar className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-550 block">Audit Verified & Verified Status</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">02 Jul 2026</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Maintenance History Table */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Maintenance History
            </h4>
            {item.maintenance && item.maintenance.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-400 text-[9px] uppercase">
                      <th className="py-2.5 px-3.5">Date</th>
                      <th className="py-2.5 px-3.5">Reported Issue</th>
                      <th className="py-2.5 px-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                    {item.maintenance.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3.5 font-mono text-[9.5px] text-slate-450">{m.date}</td>
                        <td className="py-2 px-3.5">{m.issue}</td>
                        <td className="py-2 px-3.5 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                            m.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[10.5px] text-slate-400 font-medium italic">No recorded repairs.</div>
            )}
          </div>

          {/* Section 5: Allocation History Table */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Allocation History
            </h4>
            {item.allocations && item.allocations.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-400 text-[9px] uppercase">
                      <th className="py-2.5 px-3.5">Custodian</th>
                      <th className="py-2.5 px-3.5">From</th>
                      <th className="py-2.5 px-3.5 text-right">To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                    {item.allocations.map((a, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3.5 font-extrabold text-slate-800">{a.employee}</td>
                        <td className="py-2 px-3.5 font-mono text-[9.5px] text-slate-455">{a.from}</td>
                        <td className="py-2 px-3.5 font-mono text-[9.5px] text-slate-455 text-right">{a.to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[10.5px] text-slate-400 font-medium italic">No legacy checkouts.</div>
            )}
          </div>

          {/* Section 6: Documents Links */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Related Documents
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-[10px]">
              <a 
                href="#invoice" 
                onClick={e => { e.preventDefault(); toast.success('Downloading Invoice.pdf...'); }}
                className="p-2 border border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 hover:border-slate-350 hover:bg-white transition-all text-center"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>Invoice.pdf</span>
              </a>
              <a 
                href="#warranty" 
                onClick={e => { e.preventDefault(); toast.success('Downloading Warranty.pdf...'); }}
                className="p-2 border border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 hover:border-slate-350 hover:bg-white transition-all text-center"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Warranty.pdf</span>
              </a>
              <a 
                href="#manual" 
                onClick={e => { e.preventDefault(); toast.success('Downloading Manual.pdf...'); }}
                className="p-2 border border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 hover:border-slate-350 hover:bg-white transition-all text-center"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Manual.pdf</span>
              </a>
            </div>
          </div>

          {/* Section 7: QR Code Generation */}
          <div className="space-y-4 pt-1">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              QR Verification Tag
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 border border-slate-150 p-4.5 rounded-2xl">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-[#0F172A]">
                <QrCode className="w-16 h-16" />
              </div>
              <div className="space-y-3 flex-1 w-full text-center sm:text-left">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B5BD6]">QR Barcode label</span>
                  <p className="text-[10.5px] text-slate-500 font-semibold mt-1">
                    Scan tag to quickly retrieve inventory log and active holders.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[9.5px]">
                  <button 
                    onClick={handleDownloadQR}
                    className="px-2.5 py-1.5 border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-lg flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={handlePrintQR}
                    className="px-2.5 py-1.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-lg flex items-center gap-1 cursor-pointer font-bold shadow-sm shadow-[#5B5BD6]/10"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Label</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DepartmentAssetDrawer;
