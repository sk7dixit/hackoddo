import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickHelpGrid from './components/QuickHelpGrid';
import FAQAccordion from './components/FAQAccordion';
import WorkflowGuides from './components/WorkflowGuides';
import ReleaseNotes from './components/ReleaseNotes';
import { toast } from '../../../components/Toast';
import { Search, Mail, Phone, AlertTriangle, MonitorPlay, X, Sparkles } from 'lucide-react';

export const Help: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  // Video popup state
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');

  const handleOpenVideo = (title: string) => {
    setVideoTitle(title);
    setIsVideoOpen(true);
  };

  const handleSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support ticket successfully registered. Our team will contact you shortly.');
  };

  const tutorials = [
    { title: 'Asset Approval Flow', desc: 'Authorize and reject custody checkouts.', duration: '2 Mins' },
    { title: 'Resource booking overlap Checks', desc: 'Handling calendar schedules overlaps.', duration: '3 Mins' },
    { title: 'Reports exporting & spreadsheets', desc: 'Filtering date ranges and downloading.', duration: '1.5 Mins' }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-650 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">Help Center</span>
      </div>

      {/* Brand Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Help Center & Guides</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Browse workflow procedures, documentation, and technical support coordinators
          </p>
        </div>

        {/* Global Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides (Ctrl + K)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-9 pr-4 py-2 w-full text-xs font-semibold"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      <QuickHelpGrid onSelectCategory={setSearch} />

      {/* Main split row: FAQ & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FAQAccordion filterText={search} />
          <WorkflowGuides />
        </div>
        <div>
          <ReleaseNotes />
        </div>
      </div>

      {/* Video Guides segment */}
      <div className="space-y-3.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Video Tutorials
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutorials.map((tut, idx) => (
            <div 
              key={idx}
              onClick={() => handleOpenVideo(tut.title)}
              className="p-4 bg-white border border-slate-200 hover:border-[#5B5BD6]/50 rounded-2xl cursor-pointer hover:shadow-sm transition-all group flex flex-col justify-between gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 group-hover:text-[#5B5BD6] group-hover:bg-[#5B5BD6]/5 transition-colors">
                  <MonitorPlay className="w-5 h-5" />
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">{tut.duration}</span>
              </div>

              <div>
                <span className="font-extrabold text-xs text-slate-800 block group-hover:text-[#5B5BD6]">
                  {tut.title}
                </span>
                <p className="text-[10.5px] text-slate-450 mt-1 font-semibold leading-relaxed">
                  {tut.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom split: Support Ticket & Keyboard shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Support contact info */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Support Desk</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Contact Technical Assistance</h4>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px] pb-1">
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-150 rounded-xl">
              <Mail className="w-4 h-4 text-[#5B5BD6]" />
              <span>support@assetflow.com</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-150 rounded-xl">
              <Phone className="w-4 h-4 text-[#5B5BD6]" />
              <span>+91 99999 XXXXX</span>
            </div>
          </div>

          <form onSubmit={handleSupportTicket} className="space-y-3 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-slate-400">Describe Ticket Issue</label>
              <textarea
                required
                placeholder="Brief details about the operational issue..."
                rows={2}
                className="glass-input resize-none w-full p-2.5 text-xs font-semibold"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl font-bold cursor-pointer transition-all"
            >
              Raise Support Ticket
            </button>
          </form>
        </div>

        {/* Keyboard shortcuts */}
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Speed navigation</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-1">Keyboard Shortcuts</h4>
          </div>

          <div className="space-y-3.5 text-xs font-semibold text-slate-700 pt-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-450">Global Search Query</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200/80 rounded-lg text-[9.5px] font-bold font-mono">
                Ctrl + K
              </kbd>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-slate-450">Navigate to Reports</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200/80 rounded-lg text-[9.5px] font-bold font-mono">
                Ctrl + R
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-455">Open Notification center</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200/80 rounded-lg text-[9.5px] font-bold font-mono">
                Ctrl + N
              </kbd>
            </div>
          </div>
        </div>

      </div>

      {/* Video Coming Soon modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full relative p-6 space-y-5 animate-slide-up text-center font-semibold text-slate-700">
            
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4.5 right-4.5 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 mt-4">{videoTitle} Guide</h3>
              <span className="text-[10px] font-bold text-[#5B5BD6] uppercase tracking-wider mt-1 block">Coming Soon</span>
              <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed max-w-xs pt-2">
                This tutorial walkthrough is being prepared. Real videos will be deployed to the production environment shortly.
              </p>
            </div>

            <button
              onClick={() => setIsVideoOpen(false)}
              className="w-full py-2.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm shadow-[#5B5BD6]/10 text-xs"
            >
              Close Guide
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Help;
