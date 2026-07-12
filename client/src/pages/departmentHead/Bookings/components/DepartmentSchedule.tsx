import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const DepartmentSchedule: React.FC = () => {
  const schedule = [
    { time: '09:00 AM', resource: 'Meeting Room Alpha', title: 'Sprint Sync planning meeting', duration: '1 Hour' },
    { time: '11:30 AM', resource: 'EPSON Projector #1', title: 'Customer onboarding slides demo', duration: '1.5 Hours' },
    { time: '02:00 PM', resource: 'Tesla Model Y car', title: 'Operational courier run', duration: '2 Hours' },
    { time: '04:00 PM', resource: 'Conference Hall', title: 'IT Dept retrospective round-table', duration: '1.5 Hours' }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Schedule view</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Today's Department Agenda</h4>
        </div>
        <span className="text-[9.5px] font-bold text-slate-450 uppercase">Chronological</span>
      </div>

      <div className="relative border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-5 text-xs font-semibold text-slate-700">
        {schedule.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[30px] top-0 w-5.5 h-5.5 rounded-full border border-slate-250 bg-white flex items-center justify-center text-slate-400 shadow-sm z-10 transition-transform group-hover:scale-110">
              <Calendar className="w-3 h-3 text-slate-450" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-850 block">
                  {item.title}
                </span>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">
                  {item.time}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10.5px] text-slate-500 font-semibold mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.resource}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSchedule;
