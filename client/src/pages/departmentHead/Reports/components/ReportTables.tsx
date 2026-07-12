import React, { useState } from 'react';
import { Database, Wrench, RefreshCw, BarChart2 } from 'lucide-react';

export const ReportTables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'maintenance' | 'returns' | 'resources'>('assets');

  const assetUtilization = [
    { asset: 'Laptop AF-0045 (Dell Latitude)', holder: 'Rahul Sharma', days: 120, usage: 'High', status: 'Allocated' },
    { asset: 'Laptop AF-0104 (ThinkPad X1)', holder: 'Rohit Sen', days: 95, usage: 'Medium', status: 'Allocated' },
    { asset: 'iPad Pro AF-0098', holder: 'Amit Kumar', days: 75, usage: 'High', status: 'Allocated' },
    { asset: 'Projector AF-0021', holder: 'Meeting Room Alpha', days: 40, usage: 'Low', status: 'Available' }
  ];

  const maintenanceReport = [
    { asset: 'Dell XPS AF-0144', issue: 'Swollen Battery warping casing', priority: 'High', status: 'In Progress', resolution: '-' },
    { asset: 'ThinkPad X1 AF-0103', issue: 'Keyboard key replacement', priority: 'Low', status: 'Resolved', resolution: '1 Day' },
    { asset: 'LaserJet Printer AF-0007', issue: 'Fuser roller jam repairs', priority: 'Medium', status: 'Resolved', resolution: '3 Days' }
  ];

  const upcomingReturns = [
    { id: 'AF-0104', asset: 'Lenovo ThinkPad X1 Carbon', holder: 'Rohit Sen', date: 'Tomorrow', flag: 'upcoming' },
    { id: 'AF-0098', asset: 'iPad Pro (11-inch)', holder: 'Amit Kumar', date: 'Today', flag: 'today' },
    { id: 'AF-0056', asset: 'Dell XPS 15 9530', holder: 'Sneha Roy', date: '3 Days Overdue', flag: 'overdue' }
  ];

  const resourceUtilization = [
    { name: 'Meeting Room Alpha (12-Seater)', bookings: 42, hours: 168, pct: 91 },
    { name: 'Conference Hall (20-Seater)', bookings: 38, hours: 120, pct: 76 },
    { name: 'Tesla Model Y Utility Car', bookings: 26, hours: 80, pct: 52 },
    { name: 'EPSON Projector #1', bookings: 12, hours: 24, pct: 30 }
  ];

  const getReturnBadge = (flag: string, date: string) => {
    const styles: Record<string, string> = {
      upcoming: 'bg-emerald-50 border-emerald-150 text-emerald-600',
      today: 'bg-orange-50 border-orange-150 text-orange-600',
      overdue: 'bg-rose-50 border-rose-150 text-rose-600'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded border text-[10.5px] font-bold ${styles[flag] || styles.upcoming}`}>
        {date}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 p-5 font-semibold text-xs text-slate-700">
      
      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-6 pb-0.5">
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3 px-1 relative transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'assets' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Asset Utilization</span>
          {activeTab === 'assets' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-3 px-1 relative transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'maintenance' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Report</span>
          {activeTab === 'maintenance' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`pb-3 px-1 relative transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'returns' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upcoming Returns</span>
          {activeTab === 'returns' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-1 relative transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'resources' ? 'text-[#5B5BD6] font-black' : 'hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Resource Utilization</span>
          {activeTab === 'resources' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5BD6] rounded-t-full" />
          )}
        </button>
      </div>

      {/* Roster viewport */}
      <div className="overflow-x-auto pt-2">
        
        {activeTab === 'assets' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Employee Holder</th>
                <th className="py-3 px-4">Days Allocated</th>
                <th className="py-3 px-4">Usage Index</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {assetUtilization.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">{item.asset}</td>
                  <td className="py-3.5 px-4">{item.holder}</td>
                  <td className="py-3.5 px-4 font-mono font-bold">{item.days} Days</td>
                  <td className="py-3.5 px-4">{item.usage}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'maintenance' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Reported Issue</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Resolution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {maintenanceReport.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">{item.asset}</td>
                  <td className="py-3.5 px-4">{item.issue}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-650' : 'bg-slate-50 border-slate-200 text-slate-550'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'Resolved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold">{item.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'returns' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Employee Holder</th>
                <th className="py-3 px-4 text-right">Return Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {upcomingReturns.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-mono font-bold">{item.id}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">{item.asset}</td>
                  <td className="py-3.5 px-4">{item.holder}</td>
                  <td className="py-3.5 px-4 text-right">
                    {getReturnBadge(item.flag, item.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'resources' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Total Bookings</th>
                <th className="py-3 px-4">Hours Used</th>
                <th className="py-3 px-4 text-right">Utilization Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {resourceUtilization.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">{item.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold">{item.bookings} Bookings</td>
                  <td className="py-3.5 px-4 font-mono font-bold">{item.hours} Hrs</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="font-mono font-bold">{item.pct}%</span>
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div className="h-full bg-[#5B5BD6] rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
};

export default ReportTables;
