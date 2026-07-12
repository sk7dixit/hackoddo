import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface AccordionProps {
  filterText: string;
}

export const FAQAccordion: React.FC<AccordionProps> = ({ filterText }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: 'How do I approve an allocation request?',
      answer: 'Navigate to the Requests portal, select the Allocation Requests tab, click on "View Details" to open the drawer, and click "Approve". You can add optional remarks and choose notification channels.',
      category: 'approve'
    },
    {
      question: 'How do I reject a request?',
      answer: 'Rejections require mandatory remarks. In the Requests Details drawer, click "Reject", input the justification reason in the textarea, and confirm. The employee is automatically notified.',
      category: 'approve'
    },
    {
      question: 'How can I book a meeting room?',
      answer: 'Navigate to the Resource Booking workspace, select a resource, and click on any available "Free" hourly slot. Fill in the purpose and attendee count, then confirm. Overlapping conflicts are validated automatically.',
      category: 'booking'
    },
    {
      question: 'How do I export reports?',
      answer: 'Open the Reports tab, select a date scope (Today, Month, Year), and click the export toolbar (PDF, Excel, or CSV) to download the spreadsheet data.',
      category: 'reports'
    }
  ];

  // Filter based on search text or category match
  const filteredFaqs = faqs.filter(faq => 
    !filterText || 
    faq.question.toLowerCase().includes(filterText.toLowerCase()) ||
    faq.answer.toLowerCase().includes(filterText.toLowerCase()) ||
    faq.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 font-semibold text-xs text-slate-700">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
        Frequently Asked Questions
      </span>

      {filteredFaqs.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 italic font-medium py-6 text-center">
          No FAQs match your search criteria.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 text-left font-extrabold text-slate-800 hover:text-slate-900 flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-450" /> : <ChevronDown className="w-4 h-4 text-slate-450" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4.5 pt-0.5 text-[11px] text-slate-505 leading-relaxed font-semibold border-t border-slate-50 bg-slate-50/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FAQAccordion;
