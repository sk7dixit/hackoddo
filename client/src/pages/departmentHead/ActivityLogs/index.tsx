import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivitySummaryCards from './components/ActivitySummaryCards';
import ActivityFilters from './components/ActivityFilters';
import ActivityTable from './components/ActivityTable';
import ActivityTimeline from './components/ActivityTimeline';
import ActivityDrawer from './components/ActivityDrawer';
import ActivityAnalytics from './components/ActivityAnalytics';
import { toast } from '../../../components/Toast';
import { FileText, Download, Printer, History, CheckCircle } from 'lucide-react';

interface ActivityLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  target: string;
  status: 'completed' | 'pending' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  employeeId?: string;
  remarks?: string;
}

export const ActivityLogs: React.FC = () => {
  const navigate = useNavigate();
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Selected item drawer
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  // Mock database audit logs
  const [logsList] = useState<ActivityLogItem[]>([
    {
      id: 'ACT-00245',
      time: '10:25 AM',
      user: 'Rahul Sharma',
      action: 'Approved Asset Transfer',
      module: 'transfer',
      target: 'Laptop AF-0102',
      status: 'completed',
      priority: 'high',
      employeeId: 'EMP-1001',
      remarks: 'Approved for Project Phoenix deployment. Priority: High'
    },
    {
      id: 'ACT-00244',
      time: '10:15 AM',
      user: 'Priya Sharma',
      action: 'Booked Room Alpha',
      module: 'booking',
      target: 'Meeting Room Alpha',
      status: 'completed',
      priority: 'medium',
      employeeId: 'EMP-1026',
      remarks: 'Sprint planning sync.'
    },
    {
      id: 'ACT-00243',
      time: '09:55 AM',
      user: 'Aman Verma',
      action: 'Returned Projector Unit',
      module: 'return',
      target: 'Projector AF-0021',
      status: 'completed',
      priority: 'low',
      employeeId: 'EMP-1002',
      remarks: 'Returned in good working condition.'
    },
    {
      id: 'ACT-00242',
      time: '09:20 AM',
      user: 'Rahul Sharma',
      action: 'Approved Repair Request',
      module: 'maintenance',
      target: 'Dell XPS AF-0144',
      status: 'completed',
      priority: 'critical',
      employeeId: 'EMP-1001',
      remarks: 'Battery swelling concerns raised. Queued to technician.'
    },
    {
      id: 'ACT-00241',
      time: '08:45 AM',
      user: 'Rahul Sharma',
      action: 'User Login Gateway',
      module: 'login',
      target: 'Portal Session',
      status: 'completed',
      priority: 'low',
      employeeId: 'EMP-1001',
      remarks: 'Department Head rahul login verified.'
    },
    {
      id: 'ACT-00238',
      time: 'Yesterday',
      user: 'Rahul Sharma',
      action: 'Exported Roster PDF',
      module: 'reports',
      target: 'Compliance Report',
      status: 'completed',
      priority: 'medium',
      employeeId: 'EMP-1001',
      remarks: 'Downloaded quarterly compliance PDF report.'
    },
    {
      id: 'ACT-00235',
      time: 'Yesterday',
      user: 'Sneha Roy',
      action: 'Raised Allocation Request',
      module: 'approval',
      target: 'Dell XPS 15 9530',
      status: 'pending',
      priority: 'high',
      employeeId: 'EMP-1029',
      remarks: 'Pending Department Head review.'
    }
  ]);

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    if (format === 'CSV' || format === 'Excel') {
      if (filteredLogs.length === 0) {
        toast.error('No activity data available to export.');
        return;
      }
      
      const csvData = filteredLogs.map(item => ({
        ActivityID: item.id,
        Timestamp: item.time,
        User: item.user,
        Action: item.action,
        Module: item.module,
        Target: item.target,
        Status: item.status,
        Priority: item.priority,
        EmployeeID: item.employeeId || 'N/A',
        Remarks: item.remarks || 'None'
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
      link.setAttribute("download", `department_activity_logs_${format.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded department_activity_logs_${format.toLowerCase()}.csv`);
    } else if (format === 'PDF') {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedType('all');
    setStatus('all');
    setPriority('all');
    setDateRange('all');
    toast.success('Filters cleared.');
  };

  // KPI summary statistics
  const summaryCounts = {
    total: 2483,
    today: 38,
    pending: 6,
    assets: 1245,
    bookings: 421,
    approvals: 817
  };

  // Filter logs list
  const filteredLogs = logsList.filter(item => {
    const q = search.toLowerCase();
    const searchMatch = !search ||
      item.id.toLowerCase().includes(q) ||
      item.user.toLowerCase().includes(q) ||
      item.action.toLowerCase().includes(q) ||
      item.target.toLowerCase().includes(q);

    const typeMatch = selectedType === 'all' || item.module.toLowerCase() === selectedType;
    const statusMatch = status === 'all' || item.status === status;
    const priorityMatch = priority === 'all' || item.priority === priority;

    return searchMatch && typeMatch && statusMatch && priorityMatch;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="no-print flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-605 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">Activity Logs</span>
      </div>

      {/* Brand Header */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Activity Logs</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Permanent audit trail record tracking allocations, bookings, login events, and reports downloads
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 text-xs font-bold font-mono">
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

      {/* Summary Cards */}
      <div className="no-print">
        <ActivitySummaryCards counts={summaryCounts} />
      </div>

      {/* Recent activities alert banner */}
      <div className="no-print p-3.5 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center gap-3">
        <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-emerald-850 block">Audit Log Stream online</span>
          <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed">
            Latest audit log event: <span className="font-extrabold text-emerald-800">"ACT-00245 Approved Asset Transfer Laptop AF-0102"</span> successfully logged by Department Head Rahul Sharma.
          </p>
        </div>
      </div>

      {/* Sticky Filter wrapper */}
      <div className="no-print sticky top-[74px] bg-[#F5F7FB] pt-2 pb-2 z-20 border-b border-slate-200">
        <ActivityFilters
          search={search}
          setSearch={setSearch}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onClear={handleClearFilters}
        />
      </div>

      {/* Table grid and chronological timeline split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <span className="no-print text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Audit Spreadsheet
          </span>
          {filteredLogs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-405 animate-pulse">
                <History className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-800">No activity logs recorded</h3>
                <p className="text-[10.5px] text-slate-450 font-semibold">Your department has no logged events under current selection.</p>
              </div>
            </div>
          ) : (
            <ActivityTable 
              logs={filteredLogs} 
              selectedLogId={selectedLog?.id}
              onSelect={setSelectedLog} 
            />
          )}
        </div>
        <div className="no-print">
          <ActivityTimeline 
            logs={filteredLogs} 
            selectedLogId={selectedLog?.id}
            onSelect={setSelectedLog} 
          />
        </div>
      </div>

      {/* Utilization and heatmap analytics */}
      <div className="no-print">
        <ActivityAnalytics />
      </div>

      {/* Detail drawer */}
      <ActivityDrawer
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

    </div>
  );
};

export default ActivityLogs;
