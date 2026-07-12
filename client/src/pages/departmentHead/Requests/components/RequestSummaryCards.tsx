import React from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, FilePlus, ArrowRightLeft, CornerDownLeft } from 'lucide-react';

interface SummaryCardsProps {
  counts: {
    pending: number;
    approvedToday: number;
    rejectedToday: number;
    allocation: number;
    transfer: number;
    returns: number;
  };
}

export const RequestSummaryCards: React.FC<SummaryCardsProps> = ({ counts }) => {
  const cards = [
    { title: 'Pending Requests', value: counts.pending, icon: ClipboardCheck, style: 'bg-orange-50 border-orange-100 text-orange-650' },
    { title: 'Approved Today', value: counts.approvedToday, icon: CheckCircle2, style: 'bg-emerald-50 border-emerald-100 text-emerald-650' },
    { title: 'Rejected Today', value: counts.rejectedToday, icon: XCircle, style: 'bg-rose-50 border-rose-100 text-rose-650' },
    { title: 'Allocation Requests', value: counts.allocation, icon: FilePlus, style: 'bg-blue-50 border-blue-100 text-blue-650' },
    { title: 'Transfer Requests', value: counts.transfer, icon: ArrowRightLeft, style: 'bg-purple-50 border-purple-100 text-purple-650' },
    { title: 'Return Requests', value: counts.returns, icon: CornerDownLeft, style: 'bg-teal-50 border-teal-105 text-teal-650' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

export default RequestSummaryCards;
