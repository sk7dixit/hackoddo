import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore';
import { 
  Hexagon, 
  Laptop, 
  Handshake, 
  Wrench, 
  ClipboardCheck, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  UserCheck,
  Building,
  Settings,
  ShieldCheck,
  Clock,
  Check,
  Play,
  Database,
  Server,
  Terminal,
  ChevronRight,
  AlertCircle,
  Lock,
  User,
  Star,
  Info,
  Layers,
  X
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE FOR INTERACTIVE SECTIONS ---
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeLifecycleIdx, setActiveLifecycleIdx] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'asset_manager' | 'department_head' | 'employee'>('asset_manager');
  const [workflowActiveStep, setWorkflowActiveStep] = useState(0);
  const [workflowIsPlaying, setWorkflowIsPlaying] = useState(true);

  // --- LOGIN FORM STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- ANIMATED COUNTERS STATE ---
  const [employeesCount, setEmployeesCount] = useState(0);
  const [assetsCount, setAssetsCount] = useState(0);
  const [accuracyCount, setAccuracyCount] = useState(0);
  const [efficiencyCount, setEfficiencyCount] = useState(0);

  // Auto-increment counters on mount
  useEffect(() => {
    const duration = 1200; // ms
    const steps = 30;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setEmployeesCount(Math.min(Math.floor((500 / steps) * currentStep), 500));
      setAssetsCount(Math.min(Math.floor((200 / steps) * currentStep), 200));
      setAccuracyCount(Math.min(Math.floor((98 / steps) * currentStep), 98));
      setEfficiencyCount(Math.min(Math.floor((45 / steps) * currentStep), 45));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-advance workflow animation steps
  useEffect(() => {
    if (!workflowIsPlaying) return;
    const timer = setInterval(() => {
      setWorkflowActiveStep(prev => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(timer);
  }, [workflowIsPlaying]);

  // Lifecycle steps data
  const lifecycleSteps = [
    { label: 'Purchase', desc: 'Hardware acquired', detail: 'Asset purchase cost, vendor, and serial numbers are logged into the ERP core ledger.' },
    { label: 'Register', desc: 'QR code generated', detail: 'A unique AF-XXXX identifier is assigned and a printable QR code is generated instantly.' },
    { label: 'Allocate', desc: 'Assigned to holder', detail: 'Checked out to a custodian employee, setting expectations and auto-updating holding status.' },
    { label: 'Maintenance', desc: 'Repairs & diagnostics', detail: 'Faulty assets route to technicians, updating state to Under Maintenance and disabling checkout.' },
    { label: 'Return', desc: 'Released back to stock', detail: 'Released by employee, inspected by manager, and returned to active available inventory.' },
    { label: 'Audit', desc: 'Physical verification', detail: 'Periodic scheduled audits verify custody. Discrepancies log and flag for reconciliation.' },
    { label: 'Retire', desc: 'Decommissioned', detail: 'Asset reaches end-of-life cycle, updating status to Retired to preserve historical audit logs.' },
    { label: 'Dispose', desc: 'Safely written off', detail: 'Asset is permanently disposed/sold, locking the entity from any future operations.' }
  ];

  // Features list
  const features = [
    { title: 'Asset Tracking', desc: 'Track physical assets location, cost, and serial identifiers.', chips: ['Real-time', 'History Log'], icon: Laptop },
    { title: 'QR Code Generation', desc: 'Printable QR tags for instant physical verification.', chips: ['PDF Print', 'Mobile Scan'], icon: ClipboardCheck },
    { title: 'Maintenance Workflow', desc: 'Route repairs, track technicians progress, and log costs.', chips: ['Technician Panel', 'Cost Log'], icon: Wrench },
    { title: 'Audit Cycles', desc: 'Verify physical inventory and reconcile discrepancy sheets.', chips: ['Scope Filter', 'Lock History'], icon: ShieldCheck },
    { title: 'Analytics Heatmaps', desc: 'Monitor meeting room bookings and device utilization index.', chips: ['Usage Stats', 'Visual SVGs'], icon: TrendingUp },
    { title: 'Export Center', desc: 'Generate Excel, PDF, and CSV reports for auditors.', chips: ['Excel', 'PDF Download'], icon: FileSpreadsheet },
    { title: 'Notifications Engine', desc: 'Notify stakeholders on checkout approvals and returns.', chips: ['Live Alert', 'Email Ping'], icon: Sparkles },
    { title: 'Resource Bookings', desc: 'Book company cars and workspaces via shared calendars.', chips: ['Room Calendars', 'Car Slots'], icon: Clock }
  ];

  // Roles detail mockup screens
  const roleViews = {
    admin: {
      title: 'Administrator Console View',
      desc: 'Orchestrate global scopes, user directories, and system integrity.',
      modules: ['Create User Accounts', 'Assign Role Privileges', 'Reset Passwords', 'Disable Staff profiles', 'Audit Configuration'],
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    asset_manager: {
      title: 'Asset Manager Panel View',
      desc: 'Supervise primary inventory lifecycle flows and approvals.',
      modules: ['Asset Registry Console', 'Checkout & Allocations', 'Reconcile Audits', 'Approve Repairs', 'Export Reports'],
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    department_head: {
      title: 'Department Head Dashboard View',
      desc: 'Oversight of department-specific custody, costs, and transfers.',
      modules: ['Department Assets Custody', 'Peer-to-Peer Transfer Approvals', 'Expense Aggregates', 'Active Requests review'],
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    employee: {
      title: 'Employee Request Portal View',
      desc: 'Request assets and coordinate shared resources.',
      modules: ['Request Hardware Catalog', 'Meeting Room Bookings', 'Report Defective Items', 'Personal Custody list'],
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  };

  const workflowSteps = [
    { actor: 'Employee', action: 'Requests Laptop', desc: 'Employee logs request for work machine.' },
    { actor: 'Dept Head', action: 'Reviews Request', desc: 'Manager verifies budget and department scope.' },
    { actor: 'Asset Manager', action: 'Approves & Allocates', desc: 'Hardware Checked Out and status locked.' },
    { actor: 'System Engine', action: 'Generates QR Tag', desc: 'Unique identification code generated.' },
    { actor: 'Alert Routing', action: 'Triggers Notification', desc: 'Employee notified and activity logged.' },
    { actor: 'Employee', action: 'Receives Asset', desc: 'Safe hand-off completed.' }
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.success && data.user) {
        authStore.setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token
        });
        
        setShowLoginModal(false);
        
        // Redirect based on role
        if (data.user.role === 'department_head') {
          navigate('/department-head');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Missing user data from server response');
      }
    } catch (e: any) {
      setError(e.message || 'Connecting to server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (emailVal: string, passVal: string) => {
    setEmail(emailVal);
    setPassword(passVal);
    setError(null);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-800 font-sans selection:bg-[#5B5BD6]/20 selection:text-[#5B5BD6]">
      
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 z-40 h-[74px] flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-xl bg-[#5B5BD6] flex items-center justify-center shadow-lg shadow-[#5B5BD6]/25">
            <Hexagon className="w-4.5 h-4.5 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 leading-none tracking-tight">AssetFlow</h1>
            <span className="text-[9.5px] font-bold text-slate-400 mt-1 block uppercase">Lifecycle Management Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => scrollToSection('problem')} className="text-xs font-bold text-slate-500 hover:text-slate-850 transition-colors">Problem</button>
          <button onClick={() => scrollToSection('lifecycle')} className="text-xs font-bold text-slate-500 hover:text-slate-850 transition-colors">Workflow</button>
          <button onClick={() => scrollToSection('features')} className="text-xs font-bold text-slate-500 hover:text-slate-850 transition-colors">Features</button>
          <button onClick={() => scrollToSection('architecture')} className="text-xs font-bold text-slate-500 hover:text-slate-850 transition-colors">Architecture</button>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white font-bold text-xs rounded-xl px-4.5 py-2.5 transition-all shadow-[0_2px_4px_rgba(91,91,214,0.15)] hover:scale-[1.02]"
          >
            Access Portal
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION (Dynamic Dashboard & Connected Network) */}
      <section className="relative overflow-hidden px-8 py-20 lg:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Soft Radial Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 blur-3xl -z-10 rounded-full" />

        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B5BD6]/8 text-[#5B5BD6] text-[10.5px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Odoo Hackathon Showcase</span>
          </div>
          <h2 className="text-4xl lg:text-5.5xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Unified Asset & Resource Lifecycle
          </h2>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed">
            Register hardware inventory, manage employee custody, route technicians maintenance tickets, and complete locked audits in a unified interface.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white font-bold text-xs rounded-xl px-6 py-3.5 transition-all shadow-[0_4px_12px_rgba(91,91,214,0.2)] hover:scale-[1.02] flex items-center gap-1.5"
            >
              <span>Login to Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('lifecycle')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl px-6 py-3.5 transition-all"
            >
              View Workflow
            </button>
          </div>
        </div>

        {/* Hero Right: Live Interactive Dashboard Mockup */}
        <div className="lg:col-span-7 p-6 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-5 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#5B5BD6] animate-ping shrink-0" />
              <span className="text-xs font-extrabold text-slate-800">AssetFlow Live Monitor</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block leading-none">Available</span>
              <span className="text-base font-black text-slate-800 font-mono block mt-1">160</span>
            </div>
            <div className="p-3 bg-indigo-50/50 border border-indigo-100/60 rounded-xl space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-[#5B5BD6] block leading-none">Allocated</span>
              <span className="text-base font-black text-[#5B5BD6] font-mono block mt-1">80</span>
            </div>
            <div className="p-3 bg-orange-50/50 border border-orange-100/60 rounded-xl space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-orange-700 block leading-none">Repairs</span>
              <span className="text-base font-black text-orange-700 font-mono block mt-1">12</span>
            </div>
            <div className="p-3 bg-rose-50/50 border border-rose-100/60 rounded-xl space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-rose-700 block leading-none">Audit</span>
              <span className="text-base font-black text-rose-700 font-mono block mt-1">4</span>
            </div>
          </div>

          {/* Simulated Activity Stream */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Recent Activity Log</span>
            
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Laptop AF-0008 Allocation Checked Out</span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">12s ago</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Meeting Room Alpha Booked (Sprint Sync)</span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">2m ago</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Dell XPS Repair request resolved & returned to stock</span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">5m ago</span>
              </div>
            </div>
          </div>

          {/* Mini Timeline status indicator */}
          <div className="flex items-center justify-between p-3 bg-[#5B5BD6]/5 border border-[#5B5BD6]/10 rounded-xl text-xs text-[#5B5BD6] font-bold">
            <span>Workflow State: Purchase ➔ Register ➔ Allocate</span>
            <span className="text-[10px] font-extrabold text-[#5B5BD6]">Active</span>
          </div>
        </div>

      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section id="problem" className="bg-white border-y border-slate-200 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Operational Gaps</h3>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Ledger Comparison</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">See how manual tracking models break down compared to an integrated flow system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center max-w-5xl mx-auto text-xs font-semibold">
            {/* Traditional column */}
            <div className="md:col-span-5 p-6 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Traditional (Excel / Email / WhatsApp)</span>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start text-slate-600">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Excel Tracking</span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Static cells become stale. No validation constraints preventing duplicate custody assignments.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start text-slate-600 border-t border-slate-200/50 pt-3">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Paper/Email Requests</span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Asset checkout requests get lost in threads. No audit trails or lifecycle log histories.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start text-slate-600 border-t border-slate-200/50 pt-3">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Manual Audits</span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Auditing means comparing paper lists with physical items. Prone to data loss and human error.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="md:col-span-1 flex justify-center text-slate-400">
              <ChevronRight className="w-6 h-6 hidden md:block" />
            </div>

            {/* AssetFlow column */}
            <div className="md:col-span-5 p-6 border border-[#5B5BD6]/30 bg-indigo-50/10 rounded-2xl space-y-4 border-l-4 border-l-[#5B5BD6]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5BD6] block">The AssetFlow Platform</span>

              <div className="space-y-3">
                <div className="flex gap-3 items-start text-slate-750">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Real-time Asset Directory</span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Database status changes automatically as checkout, return, and repairs are processed.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start text-slate-755 border-t border-indigo-100/50 pt-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">QR verification</span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Asset manager scans dynamic QR tags to instantly retrieve history logs and current custodians.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start text-slate-755 border-t border-indigo-100/50 pt-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Reconciled Compliance Audits</span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Audits verify scopes, logging discrepancies automatically. Reconciler releases and corrects state.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY ASSETFLOW (METRICS COUNTER) */}
      <section className="py-16 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
            <span className="text-3xl font-black text-[#5B5BD6] font-mono block">{employeesCount}+</span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block mt-1.5">Staff Employees</span>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
            <span className="text-3xl font-black text-[#5B5BD6] font-mono block">{assetsCount}+</span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block mt-1.5">Registered Assets</span>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
            <span className="text-3xl font-black text-[#5B5BD6] font-mono block">{accuracyCount}%</span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block mt-1.5">Audit Accuracy</span>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
            <span className="text-3xl font-black text-[#5B5BD6] font-mono block">{efficiencyCount}%</span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block mt-1.5">Faster Allocations</span>
          </div>
        </div>
      </section>

      {/* 4. ASSET LIFECYCLE (INTERACTIVE TIMELINE) */}
      <section id="lifecycle" className="bg-white border-y border-slate-200 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Asset Lifecycle</h3>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Interactive Lifecycle Trail</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">Click through the steps below to follow an asset from initial registration to disposal.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Clickable timeline markers */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {lifecycleSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLifecycleIdx(idx)}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                    activeLifecycleIdx === idx
                      ? 'bg-white border-[#5B5BD6] border-l-4 border-l-[#5B5BD6] shadow-sm'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                      activeLifecycleIdx === idx ? 'bg-[#5B5BD6] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">{step.label === 'Purchase' ? 'Start' : step.label === 'Dispose' ? 'End' : 'Step'}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#111827] block">{step.label}</span>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{step.desc}</p>
                </button>
              ))}
            </div>

            {/* Explanation box */}
            <div className="lg:col-span-4 p-6 border border-slate-200 bg-slate-50 rounded-2xl min-h-[220px] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5BD6] block">Stage details</span>
                <h4 className="font-extrabold text-sm text-[#111827]">{lifecycleSteps[activeLifecycleIdx].label}</h4>
                <p className="text-xs text-[#475569] font-bold leading-relaxed">{lifecycleSteps[activeLifecycleIdx].detail}</p>
              </div>
              <div className="border-t border-slate-200 pt-4 mt-6">
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">Lifecycle State Machine Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM MODULES SECTION */}
      <section id="features" className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Capabilities</h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Eight Core Platform Modules</h2>
          <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">Explore features engineered to maintain visual hierarchy and light-theme contrast guidelines.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:border-[#5B5BD6]/30 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[#5B5BD6]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-350">M0{idx+1}</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-[#111827]">{feat.title}</h4>
                  <p className="text-[11px] text-[#475569] font-semibold leading-relaxed min-h-[36px]">{feat.desc}</p>
                </div>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-3">
                  {feat.chips.map((chip, cIdx) => (
                    <span key={cIdx} className="text-[9.5px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-150">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. USER ROLES SECTION (INTERACTIVE TABS) */}
      <section className="bg-white border-y border-slate-200 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Access scopes</h3>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Interactive User Portals</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">Verify portal scopes by selecting roles below to preview workspace layouts.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Roles tabs left side */}
            <div className="lg:col-span-4 space-y-3">
              {(Object.keys(roleViews) as Array<keyof typeof roleViews>).map(roleKey => (
                <button
                  key={roleKey}
                  onClick={() => setSelectedRole(roleKey)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedRole === roleKey
                      ? 'bg-slate-50 border-[#5B5BD6] border-l-4 border-l-[#5B5BD6] shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-extrabold capitalize text-slate-800">{roleKey.replace('_', ' ')}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selectedRole === roleKey ? 'translate-x-1' : ''}`} />
                </button>
              ))}
            </div>

            {/* Preview panel right side */}
            <div className="lg:col-span-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm space-y-4 min-h-[260px] flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-[#111827]">{roleViews[selectedRole].title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border uppercase ${roleViews[selectedRole].badgeColor}`}>
                    {selectedRole.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-[#475569] font-bold leading-relaxed">{roleViews[selectedRole].desc}</p>
                
                {/* List modules */}
                <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Workspace Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    {roleViews[selectedRole].modules.map((mod, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-2 bg-white border border-slate-150 rounded-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6]" />
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE WORKFLOW DEMO (ANIMATED PLAYBACK) */}
      <section id="workflow" className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Workflow Simulation</h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Interactive Allocation Loop</h2>
          <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">Watch the step-by-step token flow representing employee hardware checkout lifecycle loops.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Controls */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Simulation Playback</span>
            <button
              onClick={() => setWorkflowIsPlaying(!workflowIsPlaying)}
              className="px-3.5 py-1.5 bg-[#5B5BD6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Play className={`w-3.5 h-3.5 ${workflowIsPlaying ? 'animate-pulse' : ''}`} />
              <span>{workflowIsPlaying ? 'Pause Flow' : 'Play Flow'}</span>
            </button>
          </div>

          {/* Connected step line */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all relative z-10 ${
                  workflowActiveStep === idx
                    ? 'bg-indigo-50 border-[#5B5BD6] border-l-4 border-l-[#5B5BD6]'
                    : 'bg-slate-50 border-slate-150'
                }`}
              >
                <div className="flex justify-center">
                  <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                    workflowActiveStep === idx ? 'bg-[#5B5BD6] text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-450 block leading-none">{step.actor}</span>
                <span className="text-xs font-black text-slate-900 block leading-tight">{step.action}</span>
                <p className="text-[9px] text-slate-450 font-semibold leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SYSTEM ARCHITECTURE SECTION */}
      <section id="architecture" className="bg-white border-y border-slate-200 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Stack architecture</h3>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Data Flow Map</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">How the clients and API servers communicate data mutations to the JSON file store.</p>
          </div>

          {/* Architecture Chart */}
          <div className="max-w-3xl mx-auto p-8 bg-slate-50 border border-slate-200 rounded-3xl grid grid-cols-1 md:grid-cols-5 gap-6 text-center text-xs font-bold text-slate-700 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 rounded-3xl" />
            
            <div className="p-4 bg-white border border-slate-150 rounded-2xl relative z-10 space-y-2 flex flex-col justify-center">
              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center font-mono text-[9px] mx-auto font-bold">1</span>
              <span className="text-[#111827] block">React Client</span>
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">Vite SPA workspace UI screens</p>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded-2xl relative z-10 space-y-2 flex flex-col justify-center">
              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center font-mono text-[9px] mx-auto font-bold">2</span>
              <span className="text-[#111827] block">REST API</span>
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">JSON request/response gates</p>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded-2xl relative z-10 space-y-2 flex flex-col justify-center">
              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center font-mono text-[9px] mx-auto font-bold">3</span>
              <span className="text-[#111827] block">Express Server</span>
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">Event emission processing core</p>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded-2xl relative z-10 space-y-2 flex flex-col justify-center">
              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center font-mono text-[9px] mx-auto font-bold">4</span>
              <span className="text-[#111827] block">JSON Db Cache</span>
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">Disk database read/write seeder</p>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded-2xl relative z-10 space-y-2 flex flex-col justify-center">
              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5BD6] flex items-center justify-center font-mono text-[9px] mx-auto font-bold">5</span>
              <span className="text-[#111827] block">Live Events</span>
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">Pings activity feeds and alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. APPLICATION SCREENSHOTS (MOCK CARDS) */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Workspace mockups</h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Production Portal Previews</h2>
          <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">Review clean screenshots representing active components and metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-xs font-semibold text-slate-700">
          {/* Card 1 */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
            <span className="text-[9.5px] font-bold text-[#5B5BD6] uppercase block">Asset Directory Screen</span>
            <div className="aspect-video bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-center text-slate-400 italic">
              [ Assets Registry View & QR Codes ]
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Filter assets by category, export CSV rosters, and scan barcode identifiers directly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
            <span className="text-[9.5px] font-bold text-[#5B5BD6] uppercase block">Maintenance Tickets Screen</span>
            <div className="aspect-video bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-center text-slate-400 italic">
              [ Diagnostic Tickets Queue & Tech Assignment ]
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Approve repair logs, allocate technicians, log vendor fees, and restore equipment to active stock.
            </p>
          </div>
        </div>
      </section>

      {/* 10. TECHNOLOGY STACK GRID */}
      <section className="bg-white border-y border-slate-200 py-20 px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h3 className="text-xs uppercase font-extrabold text-[#5B5BD6] tracking-widest">Platform Engine</h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Structured Technology Stack</h2>
          <p className="text-slate-555 text-sm font-semibold max-w-md mx-auto">Built using clean packages and React Vite compiling scripts.</p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {['React / Vite', 'Express.js', 'Node.ts', 'JSON File DB', 'JWT Session', 'QR Generator', 'TailwindCSS', 'REST APIs'].map((tech, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-55/10 font-bold text-xs text-slate-700 font-mono shadow-sm bg-white">
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* 11. GITHUB + DEMO ACCESS */}
      <section className="py-20 px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ready to Run the Demo?</h2>
        <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">
          Authenticate directly using our quick-fill credentials panel or review details in the docs.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white font-bold text-xs rounded-xl px-6 py-3.5 transition-all shadow-[0_4px_12px_rgba(91,91,214,0.15)] hover:scale-102"
          >
            Sign in to Demo Portal
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold text-xs rounded-xl px-6 py-3.5 transition-all flex items-center justify-center"
          >
            GitHub Repository
          </a>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-900 text-slate-450 py-12 px-8 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-5 text-xs font-semibold">
          <div className="flex justify-center items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-[#5B5BD6] flex items-center justify-center">
              <Hexagon className="w-3.5 h-3.5 text-white fill-white/10" />
            </div>
            <span className="text-white font-bold">AssetFlow</span>
          </div>
          <p className="text-[11px] text-slate-400">Enterprise Asset Lifecycle Platform. Made for Odoo Hackathon 2026.</p>
          <div className="flex justify-center gap-6 text-[11px]">
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
            <button onClick={() => navigate('/help')} className="hover:text-white transition-colors">Documentation</button>
            <button onClick={() => setShowLoginModal(true)} className="hover:text-white transition-colors">Demo Portal</button>
          </div>
        </div>
      </footer>

      {/* --- EMBEDDED MODAL: LOGIN & QUICK-FILL CREDENTIALS --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F5F7FB] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 relative animate-slide-up">
            
            {/* Close Button */}
            <button 
              onClick={() => { setShowLoginModal(false); setError(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors z-55"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Left Side (col-span-5) */}
            <div className="hidden md:flex md:col-span-5 bg-[#5B5BD6] text-white flex-col justify-between p-8 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl" />

              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                  <Hexagon className="w-4.5 h-4.5 text-white fill-white/10" />
                </div>
                <h1 className="font-extrabold text-xs text-white">AssetFlow</h1>
              </div>

              <div className="space-y-5 relative z-10 my-auto">
                <h3 className="font-black text-xl leading-tight">Orchestrate Assets at Scale</h3>
                <div className="space-y-3 text-[11px] font-semibold text-indigo-150">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-200" />
                    <span>160 Registered Assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-indigo-200" />
                    <span>80 Custody Allocations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-indigo-200" />
                    <span>12 Under Maintenance</span>
                  </div>
                </div>
              </div>

              <span className="text-[9.5px] text-indigo-200 font-semibold relative z-10">Odoo Hackathon Entry</span>
            </div>

            {/* Modal Right Side (col-span-7) */}
            <div className="col-span-1 md:col-span-7 p-8 flex flex-col justify-center space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-black text-lg text-slate-900">Welcome Back</h3>
                <p className="text-xs text-slate-500 font-semibold">Sign in using email or Employee ID</p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 font-semibold text-xs text-slate-700">
                {/* Email / Employee ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Employee ID / Email</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="EMP-1001 or email@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="glass-input pl-10 text-xs w-full font-semibold"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="glass-input pl-10 text-xs w-full font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-xs py-3.5 mt-2 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40 disabled:pointer-events-none"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              {/* Quick Fill Credentials Panel */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Quick-Fill Demo Credentials
                </span>

                <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                  {/* Admin */}
                  <button
                    onClick={() => handleQuickFill('admin@assetflow.com', 'admin123')}
                    className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-white hover:bg-[#5B5BD6]/5 transition-colors text-left"
                  >
                    <span className="font-extrabold text-slate-800 block">👑 Admin</span>
                    <span className="font-mono text-slate-400 block text-[9px]">admin@assetflow.com</span>
                  </button>

                  {/* Asset Manager */}
                  <button
                    onClick={() => handleQuickFill('manager@assetflow.com', 'manager123')}
                    className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-white hover:bg-[#5B5BD6]/5 transition-colors text-left"
                  >
                    <span className="font-extrabold text-slate-800 block">📦 Asset Manager</span>
                    <span className="font-mono text-slate-400 block text-[9px]">manager@assetflow.com</span>
                  </button>

                  {/* Department Head */}
                  <button
                    onClick={() => handleQuickFill('departmenthead@gmail.com', '12345')}
                    className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-white hover:bg-[#5B5BD6]/5 transition-colors text-left"
                  >
                    <span className="font-extrabold text-slate-800 block">💼 Dept Head</span>
                    <span className="font-mono text-slate-400 block text-[9px]">departmenthead@gmail.com</span>
                  </button>

                  {/* Employee */}
                  <button
                    onClick={() => handleQuickFill('EMP-1001', 'employee123')}
                    className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-white hover:bg-[#5B5BD6]/5 transition-colors text-left"
                  >
                    <span className="font-extrabold text-slate-800 block">👤 Employee ID</span>
                    <span className="font-mono text-slate-400 block text-[9px]">EMP-1001</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
