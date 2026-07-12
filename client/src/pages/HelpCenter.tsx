import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  Laptop, 
  Handshake, 
  Wrench, 
  ClipboardCheck, 
  ChevronDown, 
  ChevronUp,
  Search,
  Star,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  Award
} from 'lucide-react';

interface Guide {
  id: string;
  category: 'assets' | 'allocation' | 'maintenance' | 'returns' | 'audit';
  title: string;
  icon: any;
  steps: string[];
  description: string;
  time: string;
  level: 'Beginner' | 'Advanced' | 'Administrator';
}

export const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openGuideId, setOpenGuideId] = useState<string | null>('reg');

  const guides: Guide[] = [
    {
      id: 'reg',
      category: 'assets',
      title: 'How to Register a New Asset',
      icon: Laptop,
      description: 'Add new hardware or equipment inventory to the active directory.',
      time: '2 min',
      level: 'Beginner',
      steps: [
        'Navigate to the Assets page via the sidebar links.',
        'Click the + Register Asset button on the top right.',
        'Fill in the asset name, serial code, cost, location, category (Electronics, Furniture, etc.), and custody department.',
        'Click Submit. The system will assign a unique AF-XXXX identifier and create an initial history log.'
      ]
    },
    {
      id: 'alloc',
      category: 'allocation',
      title: 'How to Allocate Assets & Transfers',
      icon: Handshake,
      description: 'Check out hardware to custodians, prevent double-allocations, and handle peer-to-peer transfers.',
      time: '3 min',
      level: 'Beginner',
      steps: [
        'Open the Allocation panel in the sidebar.',
        'Select the target asset and verify it is currently Available.',
        'Fill in the employee recipient name and expected return date.',
        'Click Checkout. If the asset was already allocated or in maintenance, the system will block the action.',
        'For peer transfers: click Request Transfer, specify the source custodian, recipient custodian, and click Approve once verified.'
      ]
    },
    {
      id: 'mnt',
      category: 'maintenance',
      title: 'How to Route & Approve Maintenance Requests',
      icon: Wrench,
      description: 'Handle repairs, assign technicians, track progress, and release resolved stock.',
      time: '3 min',
      level: 'Advanced',
      steps: [
        'When an employee reports an issue, it logs in Maintenance -> Pending.',
        'Review the description and click Approve. The asset status shifts to Under Maintenance (making it unavailable for checkout).',
        'Assign a technician specialist (Amit Sharma, Rahul Verma, or Vendor Team).',
        'Technicians update state (Assigned -> In Progress -> Completed).',
        'Click Resolve & Close to restore asset condition and release it back to available stock.'
      ]
    },
    {
      id: 'ret',
      category: 'returns',
      title: 'How to Process Returned Assets',
      icon: RotateCcw,
      description: 'Coordinate returned hardware, verify physical conditions, and release back to stock.',
      time: '2 min',
      level: 'Advanced',
      steps: [
        'Open the Returns page in the sidebar.',
        'Click Verify Condition next to any pending return request.',
        'Select the inspected condition (Excellent, Good, Needs Repair, or Damaged).',
        'Add inspection audit notes and click Submit.',
        'If flagged as damaged or needing repair, the asset automatically routes to the Maintenance queue.'
      ]
    },
    {
      id: 'aud',
      category: 'audit',
      title: 'How to Run Inventory Audit Cycles',
      icon: ClipboardCheck,
      description: 'Initiate scopes, verify expected custodians, and reconcile discrepancy logs.',
      time: '4 min',
      level: 'Administrator',
      steps: [
        'Open the Audit page and click + Create Audit Cycle.',
        'Define a cycle scope (Entire Org, Department, or Location) and dates.',
        'Select verified assets as Verified, Missing, or Damaged.',
        'Any missing/damaged asset logs a discrepancy. Go to the Reconciler panel to resolve (Found -> Available, Mark Lost -> Lost, Send to Maintenance -> Under Maintenance).',
        'Verify all assets in scope, and click Close Audit to permanently lock logs.'
      ]
    }
  ];

  const popularGuides = [
    { id: 'reg', title: 'Register Asset', desc: 'Add new hardware inventory', time: '2 min', level: 'Beginner' },
    { id: 'alloc', title: 'Allocate Laptop', desc: 'Check out laptop to employee', time: '3 min', level: 'Beginner' },
    { id: 'ret', title: 'Process Return', desc: 'Inspect & release back to stock', time: '2 min', level: 'Advanced' },
    { id: 'aud', title: 'Start Audit', desc: 'Initiate inventory verification', time: '4 min', level: 'Administrator' },
  ];

  const handlePopularGuideClick = (id: string) => {
    setOpenGuideId(id);
    const element = document.getElementById(`guide-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Filter logic
  const filteredGuides = guides.filter(g => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="border-b border-slate-200/60 pb-4">
        <h2 className="text-3xl font-black tracking-tight text-[#111827]">
          Help Center & ERP Guide
        </h2>
        <p className="text-sm text-[#475569] font-semibold mt-1">Consult workflow procedures, system business rules, and administrative guides</p>
      </div>

      {/* Global Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search help articles, workflow rules, procedures..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="glass-input pl-10 pr-4 py-2 text-xs w-full focus:ring-[#5B5BD6]/10"
        />
      </div>

      {/* Layout Grid: 70% Help Articles (Left) | 30% Quick Rules & Shortcuts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* LEFT 70%: Help Articles accordion & Categorization (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Categorization Tabs */}
          <div className="glass-card p-3 flex overflow-x-auto gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-slate-200 bg-white shadow-sm">
            {['All', 'Assets', 'Allocation', 'Maintenance', 'Returns', 'Audit'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pb-1 px-1 transition-all ${
                  selectedCategory === cat 
                    ? 'text-[#5B5BD6] border-b-2 border-[#5B5BD6] font-bold' 
                    : 'hover:text-slate-700 font-semibold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion guides list */}
          <div className="space-y-3">
            {filteredGuides.length === 0 ? (
              <GlassCard className="text-center py-16 text-slate-400 italic font-bold border-slate-200 bg-white">
                No matching help articles found.
              </GlassCard>
            ) : (
              filteredGuides.map(g => {
                const Icon = g.icon;
                const isOpen = openGuideId === g.id;

                return (
                  <div 
                    key={g.id}
                    id={`guide-${g.id}`}
                    className={`border transition-all rounded-xl duration-300 shadow-sm ${
                      isOpen 
                        ? 'bg-white border-[#5B5BD6]/30 border-l-4 border-l-[#5B5BD6]' 
                        : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                    }`}
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setOpenGuideId(isOpen ? null : g.id)}
                      className="w-full flex items-center justify-between gap-4 p-4.5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Light purple circle background with purple icon */}
                        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[#5B5BD6] shrink-0">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          {/* Title & metadata row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-xs text-[#111827]">{g.title}</h3>
                            
                            {/* Badges */}
                            <div className="flex gap-1">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-[#64748B] text-[9.5px] font-bold">
                                <Clock className="w-2.5 h-2.5" />
                                {g.time}
                              </span>
                              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                g.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                                g.level === 'Advanced' ? 'bg-orange-50 text-orange-700' :
                                'bg-violet-50 text-violet-700'
                              }`}>
                                <Award className="w-2.5 h-2.5" />
                                {g.level}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#475569] font-medium mt-1 leading-snug">{g.description}</p>
                        </div>
                      </div>
                      
                      {/* Arrow caret indicator */}
                      <div className="shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Animated vertical timeline steps container */}
                    {isOpen && (
                      <div className="px-5 pb-6 border-t border-slate-100 pt-5 animate-fade-in max-w-2xl">
                        {/* Custom vertical timeline */}
                        <div className="relative pl-6 space-y-5 border-l-2 border-slate-150 ml-3.5">
                          {g.steps.map((step, idx) => (
                            <div key={idx} className="relative">
                              {/* Absolute dot index */}
                              <div className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full bg-white border border-[#5B5BD6] flex items-center justify-center text-[10px] font-extrabold text-[#5B5BD6]">
                                {idx + 1}
                              </div>
                              <p className="text-[#475569] font-bold text-xs leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT 30%: Popular Shortcuts & ERP Rules (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Popular guides */}
          <GlassCard className="border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm tracking-tight text-[#111827] uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
              <Star className="w-4 h-4 text-[#5B5BD6] fill-[#5B5BD6]/10" />
              Popular Guides
            </h3>
            
            <div className="space-y-3">
              {popularGuides.map(guide => (
                <div 
                  key={guide.id}
                  onClick={() => handlePopularGuideClick(guide.id)}
                  className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors space-y-1 text-xs font-semibold text-slate-700"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#111827] hover:text-[#5B5BD6] flex items-center gap-1">
                      ⭐ {guide.title}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold">{guide.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{guide.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Business Rules Panel - Colored rules cards */}
          <GlassCard className="border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm tracking-tight text-[#111827] uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-[#5B5BD6]" />
              ERP Business Rules
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              {/* Allocation card */}
              <div className="p-3.5 bg-violet-50 border border-violet-100 text-violet-850 rounded-xl space-y-1">
                <span className="font-extrabold block text-[#111827] text-xs">Allocation Block</span>
                <p className="text-[10.5px] text-[#475569] leading-relaxed font-semibold">
                  Cannot allocate assets if currently 'allocated' or 'under_maintenance'.
                </p>
              </div>

              {/* Maintenance card */}
              <div className="p-3.5 bg-orange-50 border border-orange-100 text-orange-850 rounded-xl space-y-1">
                <span className="font-extrabold block text-[#111827] text-xs">Maintenance Flow</span>
                <p className="text-[10.5px] text-[#475569] leading-relaxed font-semibold">
                  Approval moves asset to 'under_maintenance'. Resolving ticket releases back to 'available'.
                </p>
              </div>

              {/* Audit card */}
              <div className="p-3.5 bg-blue-50 border border-blue-100 text-blue-850 rounded-xl space-y-1">
                <span className="font-extrabold block text-[#111827] text-xs">Audit Discrepancies</span>
                <p className="text-[10.5px] text-[#475569] leading-relaxed font-semibold">
                  Missing/damaged assets trigger discrepancy logs for reconciliation validation.
                </p>
              </div>

              {/* Retirement card */}
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-850 rounded-xl space-y-1">
                <span className="font-extrabold block text-[#111827] text-xs">Retirement Lock</span>
                <p className="text-[10.5px] text-[#475569] leading-relaxed font-semibold">
                  Disposed assets are permanently locked and cannot be checked out or verified.
                </p>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default HelpCenter;
