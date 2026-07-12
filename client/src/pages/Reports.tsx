import React, { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import { SvgDonutChart, SvgBarChart } from '../shared/SvgCharts';
import { toast } from '../components/Toast';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  AlertTriangle, 
  Clock, 
  PieChart, 
  Layers,
  ChevronRight,
  Filter,
  Activity,
  FileSpreadsheet,
  Package,
  CheckCircle2,
  XCircle,
  FileText,
  FileDown
} from 'lucide-react';

interface ReportStats {
  totalAssets: number;
  availableAssets: number;
  idleAssets: number;
  totalMntCost: number;
  nearRetirement: number;
  overdueReturns: number;
}

interface IdleAsset {
  id: string;
  name: string;
  daysIdle: number;
  idleLevel: 'High' | 'Medium' | 'Low';
}

interface DeptSummary {
  name: string;
  total: number;
  allocated: number;
  available: number;
  maintenance: number;
}

interface RepairLog {
  id: string;
  repairs: number;
  status: string;
}

export const Reports: React.FC = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [assetsList, setAssetsList] = useState<any[]>([]);
  const [allocsList, setAllocsList] = useState<any[]>([]);
  const [mntsList, setMntsList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [auditsList, setAuditsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [deptFilter, setDeptFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const [statsRes, assetsRes, allocsRes, mntsRes, bookingsRes, auditsRes] = await Promise.all([
          fetch('http://localhost:5000/api/reports/overview').then(r => r.json()),
          fetch('http://localhost:5000/api/assets').then(r => r.json()),
          fetch('http://localhost:5000/api/allocations').then(r => r.json()),
          fetch('http://localhost:5000/api/maintenance').then(r => r.json()),
          fetch('http://localhost:5000/api/dashboard/returns').then(r => r.json()),
          fetch('http://localhost:5000/api/audits').then(r => r.json())
        ]);

        setStats(statsRes);
        setAssetsList(assetsRes);
        setAllocsList(allocsRes);
        setMntsList(mntsRes);
        setAuditsList(auditsRes);
        
        // Mock bookings list for heatmap
        const timeSlots = ['09-10', '10-11', '11-12', '14-15', '15-16'];
        const rooms = ['Meeting Room A', 'Meeting Room B', 'Meeting Room C'];
        const mockBookings = Array(45).fill(null).map((_, idx) => ({
          id: `bk-${idx}`,
          room: rooms[idx % rooms.length],
          slot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
          value: Math.floor(Math.random() * 5) + 1
        }));
        setBookingsList(mockBookings);
      } catch (e) {
        console.error('Failed to load reports data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReportsData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-[#F5F7FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5B5BD6]/30 border-t-[#5B5BD6] rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-semibold tracking-wide">Generating analytics reports...</span>
        </div>
      </div>
    );
  }

  const filteredAssets = assetsList.filter(a => {
    const matchesDept = !deptFilter || a.departmentId === deptFilter;
    const matchesCat = !catFilter || a.categoryId === catFilter;
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesDept && matchesCat && matchesStatus;
  });

  const statusLabels = ['available', 'allocated', 'reserved', 'under_maintenance', 'lost', 'retired'];
  const statusDonutData = statusLabels.map(st => {
    const count = filteredAssets.filter(a => a.status === st).length;
    return {
      label: st.charAt(0).toUpperCase() + st.slice(1).replace('_', ' '),
      value: count
    };
  });

  const deptsList = ['IT', 'HR', 'Sales', 'Operations'];
  const deptBarData = deptsList.map(dp => {
    const count = filteredAssets.filter(a => a.departmentId === dp).length;
    return {
      label: dp,
      value: count
    };
  });

  const idleAssetsList: IdleAsset[] = filteredAssets
    .filter(a => a.status === 'available')
    .slice(0, 5)
    .map((a, idx) => ({
      id: a.id,
      name: a.name,
      daysIdle: 15 + (idx * 8),
      idleLevel: (15 + (idx * 8)) >= 30 ? 'High' : 'Medium'
    }));

  const deptSummaryList: DeptSummary[] = deptsList.map(dp => {
    const list = filteredAssets.filter(a => a.departmentId === dp);
    return {
      name: dp,
      total: list.length,
      allocated: list.filter(a => a.status === 'allocated').length,
      available: list.filter(a => a.status === 'available').length,
      maintenance: list.filter(a => a.status === 'under_maintenance').length
    };
  });

  const repeatedRepairsList: RepairLog[] = filteredAssets
    .slice(0, 3)
    .map((a, idx) => ({
      id: a.id,
      repairs: 8 - (idx * 2),
      status: (8 - (idx * 2)) >= 6 ? 'Consider Replacement' : 'Good'
    }));

  const timeSlots = ['09-10', '10-11', '11-12', '14-15', '15-16'];
  const rooms = ['Meeting Room A', 'Meeting Room B', 'Meeting Room C'];
  
  const getHeatmapIntensity = (room: string, slot: string) => {
    const count = bookingsList.filter(b => b.room === room && b.slot === slot).length;
    if (count >= 5) return 'bg-[#5B5BD6] text-white';
    if (count >= 3) return 'bg-[#5B5BD6]/60 text-white';
    if (count >= 1) return 'bg-[#5B5BD6]/20 text-[#5B5BD6]';
    return 'bg-slate-50 text-slate-400';
  };

  // Mock File Download triggers for PDF & Excel
  const triggerMockDownload = (filename: string, ext: 'xlsx' | 'pdf', content: string) => {
    toast.success(`Exporting ${ext.toUpperCase()} file...`);
    const blob = new Blob([content], { type: ext === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const encodedUri = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (moduleName: string, format: 'CSV' | 'Excel' | 'PDF') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let title = '';

    if (moduleName === 'Assets') {
      title = 'Assets_Utilization_Report';
      headers = ['Asset ID', 'Name', 'Category', 'Department', 'Location', 'Status', 'Condition', 'Cost'];
      rows = filteredAssets.map(a => [
        a.id, a.name, a.categoryId, a.departmentId, a.location, a.status, a.condition, String(a.cost)
      ]);
    } else if (moduleName === 'Checkout') {
      title = 'Assets_Checkout_Report';
      headers = ['Allocation ID', 'Asset ID', 'Custodian Employee', 'Allocated On', 'Expected Return', 'Status'];
      rows = allocsList.map(a => [
        a.id, a.assetId, a.employeeId, a.allocatedOn, a.expectedReturnDate, a.status
      ]);
    } else {
      title = 'Maintenance_Repair_Report';
      headers = ['Request ID', 'Asset ID', 'Employee Custodian', 'Priority', 'Report Date', 'Status', 'Problem'];
      rows = mntsList.map(m => [
        m.id, m.assetId, m.employeeId, m.priority, m.date, m.status, m.problemDescription
      ]);
    }

    if (format === 'CSV') {
      downloadCSV(title, headers, rows);
    } else if (format === 'Excel') {
      const excelText = headers.join('\t') + '\n' + rows.map(r => r.join('\t')).join('\n');
      triggerMockDownload(title, 'xlsx', excelText);
    } else {
      const pdfText = `%PDF-1.4\n1 0 obj\n<< /Title (${title.replace(/_/g, ' ')}) >>\nendobj\n`;
      triggerMockDownload(title, 'pdf', pdfText);
    }
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="border-b border-slate-200/60 pb-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Reports & Analytics Console
        </h2>
        <p className="text-sm text-slate-500 font-semibold mt-1">Read-only performance reports, utilization indexes, and audit sheets</p>
      </div>

      {/* Advanced Filters toolbar - styled with white background selects */}
      <div className="glass-card p-4 space-y-2 border-slate-200 shadow-sm bg-white">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <Filter className="w-4 h-4 text-[#5B5BD6]" />
          <span>Advanced Reports Filter</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="glass-input py-2 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Departments</option>
            {deptsList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="glass-input py-2 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Categories</option>
            {['Electronics', 'Furniture', 'Vehicles', 'Printers'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="glass-input py-2 text-xs cursor-pointer bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            {statusLabels.map(st => (
              <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1).replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats Cards - Added icons and set compact 100px height */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Assets</span>
            <Package className="w-4 h-4 text-[#5B5BD6] shrink-0" />
          </div>
          <span className="text-2xl font-black text-slate-800 font-mono mt-2">{filteredAssets.length}</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Available Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <span className="text-2xl font-black text-emerald-650 font-mono mt-2">
            {filteredAssets.filter(a => a.status === 'available').length}
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Idle Assets</span>
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <span className="text-2xl font-black text-amber-650 font-mono mt-2">{stats.idleAssets}</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Maintenance Cost</span>
            <TrendingUp className="w-4 h-4 text-rose-600 shrink-0" />
          </div>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2">${stats.totalMntCost}</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-white">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Nearing Retirement</span>
            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
          </div>
          <span className="text-2xl font-black text-orange-655 font-mono mt-2">
            {filteredAssets.filter(a => {
              const buyYear = new Date(a.purchaseDate).getFullYear();
              return (2026 - buyYear) >= 2;
            }).length}
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-slate-200 shadow-sm h-[100px] bg-rose-50/50 border-rose-100">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-rose-700 font-semibold uppercase tracking-wider">Overdue Returns</span>
            <XCircle className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
          </div>
          <span className="text-2xl font-black text-rose-600 font-mono mt-2">
            {stats.overdueReturns}
          </span>
        </GlassCard>
      </div>

      {/* Split Section: Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <GlassCard className="border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-4 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <PieChart className="w-4 h-4 text-[#5B5BD6]" />
            Asset Utilization Share
          </h3>
          <div className="py-1">
            <SvgDonutChart data={statusDonutData} />
          </div>
        </GlassCard>

        {/* Department Inventory Share */}
        <GlassCard className="border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-4 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-[#5B5BD6]" />
            Department Inventory Shares
          </h3>
          <div className="py-1">
            <SvgBarChart data={deptBarData} />
          </div>
        </GlassCard>
      </div>

      {/* Split Section: Department Summary & Resource usage Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Department Summary Table (2/3 width) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Department Inventory Index</h3>
          <GlassCard className="p-0 overflow-hidden border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Total Assets</th>
                    <th className="py-3 px-4">Allocated</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4 text-right">In Repair Lab</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {deptSummaryList.map(summary => (
                    <tr key={summary.name} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-900 font-bold">{summary.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{summary.total}</td>
                      <td className="py-3 px-4 font-mono text-indigo-650">{summary.allocated}</td>
                      <td className="py-3 px-4 font-mono text-emerald-650">{summary.available}</td>
                      <td className="py-3 px-4 text-right font-mono text-orange-650">{summary.maintenance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Booking Heatmap Widget (1/3 width) */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Resource Booking Heatmap</h3>
          <GlassCard className="border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-6 gap-2 text-center text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              <div>Room</div>
              {timeSlots.map(slot => (
                <div key={slot}>{slot}</div>
              ))}
            </div>

            {rooms.map(room => (
              <div key={room} className="grid grid-cols-6 gap-2 text-center items-center">
                <span className="text-[9px] text-slate-500 font-bold font-sans truncate text-left">{room.split(' ')[2]}</span>
                {timeSlots.map(slot => (
                  <div
                    key={slot}
                    className={`h-6 rounded flex items-center justify-center font-bold font-mono text-[9px] ${getHeatmapIntensity(room, slot)}`}
                    title={`${room} at ${slot}`}
                  >
                    •
                  </div>
                ))}
              </div>
            ))}

            <div className="flex gap-4 pt-3 border-t border-slate-100 justify-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200" />
                <span>Idle</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-[#5B5BD6]/20" />
                <span>Light</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-[#5B5BD6]" />
                <span>Peak</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Bottom rows: Idle Assets & Repeated Repairs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Idle Assets List */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Idle Assets Warning</h3>
          <GlassCard className="p-0 overflow-hidden border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Days Idle</th>
                    <th className="py-3 px-4 text-right">Action Index</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-650">
                  {idleAssetsList.map(idle => (
                    <tr key={idle.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{idle.id}</td>
                      <td className="py-3 px-4 text-slate-700">{idle.name}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{idle.daysIdle} days</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`badge ${idle.idleLevel === 'High' ? 'badge-danger' : 'badge-maintenance'}`}>
                          {idle.idleLevel} Idle
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Repeated Repairs warning */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Repeated Repairs (Consider Decommission)</h3>
          <GlassCard className="p-0 overflow-hidden border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4">Asset Code</th>
                    <th className="py-3 px-4">Repair Count</th>
                    <th className="py-3 px-4 text-right">Decommission Suggestion</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-655">
                  {repeatedRepairsList.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#5B5BD6]">{rep.id}</td>
                      <td className="py-3 px-4 text-slate-700 font-mono">{rep.repairs} Repairs</td>
                      
                      {/* Suggestion Badge: Reduced size & width */}
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border max-w-[140px] text-center inline-block whitespace-nowrap ${
                          rep.status === 'Consider Replacement' 
                            ? 'bg-rose-50 text-rose-700 border-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Export Center widget panel: Added distinct PDF, Excel, and CSV actions */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Export Center</h3>
        <GlassCard className="border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800">Generate Structured Performance Sheets</h4>
            <p className="text-[11px] text-slate-400 font-semibold">Generate structured exports of your active filtered lists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-slate-100">
            {/* Category 1: Assets Inventory */}
            <div className="space-y-2 border border-slate-150 p-3 rounded-xl bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Asset Inventories</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Assets', 'CSV')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport('Assets', 'Excel')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => handleExport('Assets', 'PDF')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Category 2: Checkout History */}
            <div className="space-y-2 border border-slate-150 p-3 rounded-xl bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Checkout & Custody</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Checkout', 'CSV')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport('Checkout', 'Excel')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => handleExport('Checkout', 'PDF')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Category 3: Maintenance Logs */}
            <div className="space-y-2 border border-slate-150 p-3 rounded-xl bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Maintenance & Repairs</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Maintenance', 'CSV')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport('Maintenance', 'Excel')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => handleExport('Maintenance', 'PDF')}
                  className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default Reports;
