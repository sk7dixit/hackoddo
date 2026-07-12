import React from 'react';
import { Boxes, Laptop, Users, ClipboardCheck, Wrench, CalendarDays } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: string;
  icon: React.ComponentType<any>;
  theme: 'blue' | 'indigo' | 'orange' | 'amber' | 'green' | 'slate';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, trend, icon: Icon, theme }) => {
  const themes = {
    blue: {
      bg: 'border-slate-200 hover:border-blue-300',
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
      value: 'text-slate-900',
      subtext: 'text-slate-500'
    },
    indigo: {
      bg: 'border-slate-200 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 border-indigo-100 text-[#5B5BD6]',
      value: 'text-slate-900',
      subtext: 'text-slate-500'
    },
    orange: {
      bg: 'border-slate-200 hover:border-orange-300',
      iconBg: 'bg-orange-50 border-orange-100 text-orange-600',
      value: 'text-slate-900',
      subtext: 'text-slate-550'
    },
    amber: {
      bg: 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
      value: 'text-slate-900',
      subtext: 'text-slate-550'
    },
    green: {
      bg: 'border-slate-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      value: 'text-slate-900',
      subtext: 'text-slate-500'
    },
    slate: {
      bg: 'border-slate-200 hover:border-slate-350',
      iconBg: 'bg-slate-50 border-slate-150 text-slate-605',
      value: 'text-slate-900',
      subtext: 'text-slate-500'
    }
  };

  const style = themes[theme] || themes.slate;

  return (
    <div className={`p-4 border rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 ${style.bg} flex flex-col justify-between h-[110px]`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">{title}</span>
          <span className={`text-2.5xl font-black font-mono block mt-2.5 leading-none ${style.value}`}>{value}</span>
        </div>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0 ${style.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 text-[9.5px] font-bold mt-2">
        {trend && (
          <span className="text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-100 px-1 py-0.2 rounded shrink-0">
            {trend}
          </span>
        )}
        <span className={`${style.subtext} truncate`}>{subtext}</span>
      </div>
    </div>
  );
};

export const DepartmentStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-semibold text-xs text-slate-700">
      <StatCard 
        title="Total Assets"
        value={186}
        trend="↑ 6.8%"
        subtext="vs last month"
        icon={Boxes}
        theme="indigo"
      />
      <StatCard 
        title="Allocated"
        value={143}
        trend="↑ 4.2%"
        subtext="77% Utilization"
        icon={Laptop}
        theme="blue"
      />
      <StatCard 
        title="Employees"
        value={42}
        subtext="Active Today: 38"
        icon={Users}
        theme="slate"
      />
      <StatCard 
        title="Pending Approvals"
        value={7}
        subtext="Requires Review"
        icon={ClipboardCheck}
        theme="orange"
      />
      <StatCard 
        title="Maintenance"
        value={4}
        subtext="Active Repairs"
        icon={Wrench}
        theme="amber"
      />
      <StatCard 
        title="Today's Bookings"
        value={3}
        subtext="Reserved Slots"
        icon={CalendarDays}
        theme="green"
      />
    </div>
  );
};

export default DepartmentStats;
