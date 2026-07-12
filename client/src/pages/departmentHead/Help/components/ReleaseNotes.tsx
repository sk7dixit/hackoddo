import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const ReleaseNotes: React.FC = () => {
  const versions = [
    { tag: 'v1.3', title: 'Department Dashboard Overhaul', desc: 'Introduced live greeting cards, 13 metrics sub-cards, donut allocations, and pending checklists.', date: '12 Jul 2026' },
    { tag: 'v1.2', title: 'Booking Calendar Integration', desc: 'Overlapping reservation conflict alert cards and alternative slot recommenders.', date: '28 Jun 2026' },
    { tag: 'v1.1', title: 'Reports Exports & Filters', desc: 'Supports Excel, PDF, and CSV downloads with quarter and custom date selectors.', date: '15 May 2026' },
    { tag: 'v1.0', title: 'Initial ERP Release', desc: 'Basic custody logins, approvals rosters, and settings configurations.', date: '15 Mar 2026' }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      
      <div className="border-b border-slate-100 pb-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Changelogs</span>
        <h4 className="font-extrabold text-xs text-slate-800 mt-1">Release History Notes</h4>
      </div>

      <div className="relative border-l border-slate-150 pl-5 ml-2.5 py-1 space-y-5 text-xs font-semibold text-slate-700">
        {versions.map((ver, idx) => (
          <div key={idx} className="relative group">
            {/* Node circle */}
            <div className="absolute -left-[30px] top-0 w-5.5 h-5.5 rounded-full border border-slate-250 bg-white flex items-center justify-center text-[#5B5BD6] shadow-sm z-10">
              <Star className="w-3 h-3 text-[#5B5BD6] fill-[#5B5BD6]/20" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 block">
                  {ver.title}
                </span>
                <span className="text-[9.5px] font-bold text-slate-450 uppercase">
                  {ver.tag}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                {ver.desc}
              </p>
              <span className="text-[9px] font-mono text-slate-400 block pt-0.5">{ver.date}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ReleaseNotes;
