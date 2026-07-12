import React from 'react';

export const LoginActivity: React.FC = () => {
  const activities = [
    { date: '12 Jul 2026, 08:45 AM', device: 'Workstation Laptop', browser: 'Chrome', location: 'Vadodara, India', status: 'Success' },
    { date: '11 Jul 2026, 09:12 AM', device: 'Workstation Laptop', browser: 'Chrome', location: 'Vadodara, India', status: 'Success' },
    { date: '10 Jul 2026, 02:30 PM', device: 'Android Mobile App', browser: 'System WebView', location: 'Vadodara, India', status: 'Success' }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 font-sans text-xs">
      
      <div className="border-b border-slate-100 pb-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Security traces</span>
        <h4 className="font-extrabold text-xs text-slate-800 mt-1">Recent Login Activity</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
          
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-4">Date & Time</th>
              <th className="py-2.5 px-4">Device</th>
              <th className="py-2.5 px-4">Browser</th>
              <th className="py-2.5 px-4">Location</th>
              <th className="py-2.5 px-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {activities.map((act, idx) => (
              <tr key={idx} className="hover:bg-slate-50/30">
                <td className="py-2.5 px-4 font-mono text-slate-500 font-bold">{act.date}</td>
                <td className="py-2.5 px-4 font-extrabold text-slate-800">{act.device}</td>
                <td className="py-2.5 px-4">{act.browser}</td>
                <td className="py-2.5 px-4">{act.location}</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold">
                    {act.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default LoginActivity;
