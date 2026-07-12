import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportKPICards from './components/ReportKPICards';
import DepartmentHealthCard from './components/DepartmentHealthCard';
import InsightsPanel from './components/InsightsPanel';
import ReportTables from './components/ReportTables';
import { SvgDonutChart, SvgBarChart } from '../../../shared/SvgCharts';
import { toast } from '../../../components/Toast';
import { Calendar, FileText, Printer, Download, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('This Month');

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    if (format === 'CSV' || format === 'Excel') {
      const reportData = [
        { Metric: 'Total Department Assets', Value: '186' },
        { Metric: 'Asset Utilization Rate', Value: '78%' },
        { Metric: 'Active Custody Allocations', Value: '143' },
        { Metric: 'Maintenance Actions This Month', Value: '11' },
        { Metric: 'Resource Bookings Logs', Value: '58' },
        { Metric: 'Overdue Asset Returns', Value: '4' }
      ];

      const headers = Object.keys(reportData[0]).join(',');
      const rows = reportData.map(row => 
        Object.values(row).map(val => {
          const str = String(val);
          return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str;
        }).join(',')
      );
      
      const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `department_analytics_report_${format.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded department_analytics_report_${format.toLowerCase()}.csv`);
    } else if (format === 'PDF') {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Mock KPI counts data
  const mockKpis = {
    totalAssets: 186,
    utilization: 78,
    activeAllocations: 143,
    maintenanceThisMonth: 11,
    resourceBookings: 58,
    overdueReturns: 4
  };

  // Chart data
  const statusData = [
    { label: 'Allocated', value: 113, color: '#5B5BD6' },
    { label: 'Available', value: 45, color: '#22C55E' },
    { label: 'Maintenance', value: 18, color: '#F59E0B' },
    { label: 'Reserved', value: 10, color: '#3b82f6' }
  ];

  const categoryData = [
    { label: 'Laptops', value: 92, color: '#5B5BD6' },
    { label: 'Monitors', value: 45, color: '#3b82f6' },
    { label: 'Vehicles', value: 6, color: '#22C55E' },
    { label: 'Projectors', value: 4, color: '#F59E0B' },
    { label: 'Others', value: 39, color: '#ec4899' }
  ];

  const employeeAllocation = [
    { label: 'Aman', value: 5 },
    { label: 'Rahul', value: 4 },
    { label: 'Priya', value: 3 },
    { label: 'Riya', value: 2 }
  ];

  const maintenanceData = [
    { label: 'Jan', value: 2 },
    { label: 'Feb', value: 5 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 7 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 11 }
  ];

  // Comparison metrics Month over Month
  const MoMComparison = [
    { label: 'Asset utilization', change: '+12% vs last month', isPos: true },
    { label: 'Maintenance requests', change: '-4% vs last month', isPos: true },
    { label: 'Resource bookings', change: '+18% vs last month', isPos: true },
    { label: 'Approval turnaround', change: '9.2 mins faster', isPos: true }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="no-print flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-650 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">Reports</span>
      </div>

      {/* Title Toolbar */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Analyze hardware utilization and shared space reservations for the IT department
          </p>
        </div>

        {/* Date Selector & Export Toolbar */}
        <div className="flex items-center gap-3 text-xs font-bold font-mono">
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="glass-input pl-9 pr-4 py-2 cursor-pointer font-sans"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Quarter">This Quarter</option>
              <option value="Year">This Year</option>
            </select>
          </div>

          <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-xl font-sans">
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

          <button
            onClick={handlePrint}
            className="p-2 border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all font-sans"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print">
        <ReportKPICards data={mockKpis} />
      </div>

      {/* MoM comparison row */}
      <div className="no-print grid grid-cols-2 md:grid-cols-4 gap-4">
        {MoMComparison.map((comp, idx) => (
          <div key={idx} className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">{comp.label}</span>
              <span className="text-xs font-black text-slate-800 block mt-1">{comp.change}</span>
            </div>
            <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 text-[9px] font-bold">
              ↑
            </span>
          </div>
        ))}
      </div>

      {/* Charts section grid */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Status Donut */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Holdings status</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Asset Status Overview</h4>
          </div>
          <div className="py-2 flex justify-center">
            <SvgDonutChart data={statusData} size={130} />
          </div>
        </div>

        {/* Chart 2: Categories Pie */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Hardware inventory</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Asset Category Distribution</h4>
          </div>
          <div className="py-2 flex justify-center">
            <SvgDonutChart data={categoryData} size={130} />
          </div>
        </div>

        {/* Chart 3: Employee Allocation bar */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Top custodians</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Employee Allocation Rank</h4>
          </div>
          <div className="py-1 flex items-end">
            <SvgBarChart data={employeeAllocation} height={130} />
          </div>
        </div>

        {/* Chart 4: Monthly Allocation trend */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Allocation activity</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Monthly Allocation Trend</h4>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="h-[120px] flex items-end relative pt-4">
            <svg className="w-full h-full" viewBox="0 0 300 100">
              <path
                d="M 10 90 L 50 70 L 100 80 L 150 40 L 200 50 L 250 20 L 290 10"
                fill="none"
                stroke="#5B5BD6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Data points */}
              {[
                { x: 10, y: 90, val: 5 },
                { x: 50, y: 70, val: 12 },
                { x: 100, y: 80, val: 8 },
                { x: 150, y: 40, val: 24 },
                { x: 200, y: 50, val: 20 },
                { x: 250, y: 20, val: 32 },
                { x: 290, y: 10, val: 38 }
              ].map((pt, index) => (
                <circle key={index} cx={pt.x} cy={pt.y} r="3.5" fill="#5B5BD6" stroke="#FFFFFF" strokeWidth="1.5" />
              ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-400 px-1 font-mono uppercase">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        {/* Chart 5: Maintenance trend bar */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Diagnostic repair loads</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Maintenance Trend</h4>
          </div>
          <div className="py-1 flex items-end">
            <SvgBarChart data={maintenanceData} height={120} />
          </div>
        </div>

        {/* Chart 6: Peak Hours Heatmap */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Schedules density</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Peak Booking Hours</h4>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center font-bold text-[10px] pt-1">
            {[
              { hour: '09 AM', count: 3, style: 'bg-emerald-100/60 text-emerald-800' },
              { hour: '10 AM', count: 12, style: 'bg-[#5B5BD6]/20 text-[#5B5BD6]' },
              { hour: '11 AM', count: 15, style: 'bg-[#5B5BD6] text-white shadow-sm' },
              { hour: '02 PM', count: 9, style: 'bg-blue-150 text-blue-800' },
              { hour: '04 PM', count: 5, style: 'bg-emerald-100/60 text-emerald-800' }
            ].map((h, idx) => (
              <div 
                key={idx}
                className={`p-2 border border-slate-150 rounded-xl flex flex-col justify-center gap-1 ${h.style}`}
              >
                <span className="block opacity-90 leading-none">{h.hour}</span>
                <span className="font-mono text-[8.5px] block opacity-60 mt-0.5 leading-none">
                  {h.count} Bookings
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tabular details section */}
      <ReportTables />

      {/* Insights & Compliance health cards row */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentHealthCard />
        <InsightsPanel />
      </div>

    </div>
  );
};

export default Reports;
