import React from 'react';
import { Boxes, Laptop, Percent, Wrench, CalendarRange, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
  data: {
    totalAssets: number;
    utilization: number;
    activeAllocations: number;
    maintenanceThisMonth: number;
    resourceBookings: number;
    overdueReturns: number;
  };
}

export const ReportKPICards: React.FC<KPICardsProps> = ({ data }) => {
  const cards = [
    { title: 'Total Dept Assets', value: data.totalAssets, icon: Boxes, style: 'bg-blue-50 border-blue-100 text-blue-650' },
    { title: 'Asset Utilization', value: `${data.utilization}%`, icon: Percent, style: 'bg-emerald-55/10 border-emerald-100 text-emerald-650' },
    { title: 'Active Allocations', value: data.activeAllocations, icon: Laptop, style: 'bg-indigo-50 border-indigo-100 text-[#5B5BD6]' },
    { title: 'Repairs This Month', value: data.maintenanceThisMonth, icon: Wrench, style: 'bg-orange-50 border-orange-100 text-orange-650' },
    { title: 'Resource Bookings', value: data.resourceBookings, icon: CalendarRange, style: 'bg-purple-50 border-purple-100 text-purple-650' },
    { title: 'Overdue Returns', value: data.overdueReturns, icon: AlertTriangle, style: 'bg-rose-50 border-rose-100 text-rose-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-semibold text-xs text-slate-700">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`p-4 border rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-all ${card.style}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">{card.title}</span>
                <span className="text-2.5xl font-black font-mono block mt-2.5">{card.value}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportKPICards;
