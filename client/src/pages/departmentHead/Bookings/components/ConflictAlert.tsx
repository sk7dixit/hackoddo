import React from 'react';
import { AlertCircle, CalendarRange } from 'lucide-react';

interface ConflictProps {
  resourceName: string;
  conflictTitle: string;
  conflictTime: string;
  onSelectAlternative: (start: number, end: number) => void;
}

export const ConflictAlert: React.FC<ConflictProps> = ({
  resourceName,
  conflictTitle,
  conflictTime,
  onSelectAlternative
}) => {
  const alternatives = [
    { label: '09:00 AM - 10:00 AM', start: 9, end: 10 },
    { label: '11:30 AM - 12:30 PM', start: 11, end: 12 },
    { label: '02:00 PM - 03:00 PM', start: 14, end: 15 }
  ];

  return (
    <div className="p-4.5 bg-rose-50 border border-rose-250 rounded-2xl space-y-3.5 text-xs font-semibold text-rose-700">
      
      <div className="flex gap-2.5 items-start">
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-[#991b1b] block">Resource Schedule Overlap Conflict</span>
          <p className="text-rose-600 font-semibold leading-relaxed">
            <span className="font-extrabold text-rose-800">{resourceName}</span> is already reserved for <span className="font-extrabold text-rose-800">"{conflictTitle}"</span> from <span className="font-mono font-bold text-rose-800">{conflictTime}</span>.
          </p>
        </div>
      </div>

      <div className="border-t border-rose-200/60 pt-3 space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 block flex items-center gap-1">
          <CalendarRange className="w-3.5 h-3.5" />
          <span>Recommended Alternative Slots</span>
        </span>
        
        <div className="flex flex-wrap gap-2 pt-1">
          {alternatives.map((alt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectAlternative(alt.start, alt.end)}
              className="px-3 py-1.5 bg-white border border-rose-200 hover:border-rose-400 text-rose-700 hover:bg-rose-100/40 rounded-xl font-bold cursor-pointer transition-all text-[10.5px]"
            >
              {alt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ConflictAlert;
