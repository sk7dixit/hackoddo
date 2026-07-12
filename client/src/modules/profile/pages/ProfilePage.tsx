import React from 'react';
import GlassCard from '../../../components/GlassCard';
import { authStore } from '../../../store/authStore';
import { 
  Shield, 
  Key, 
  Activity, 
  CheckCircle2, 
  Laptop, 
  Handshake, 
  Wrench, 
  ClipboardCheck, 
  BarChart3,
  Calendar,
  MapPin,
  Lock,
  Globe,
  Monitor,
  User,
  Plus
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const user = authStore.getUser() || {
    id: 'AM-001',
    name: 'John Carter',
    email: 'assetmanager@gmail.com',
    role: 'Asset Manager'
  };

  const accessModules = [
    { label: 'Assets', access: 'Full Access', icon: Laptop, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/50' },
    { label: 'Allocation', access: 'Approve', icon: Handshake, color: 'text-[#22C55E] border-emerald-100 bg-emerald-50/50' },
    { label: 'Maintenance', access: 'Approve', icon: Wrench, color: 'text-orange-600 border-orange-100 bg-orange-50/50' },
    { label: 'Audit', access: 'Manage', icon: ClipboardCheck, color: 'text-amber-600 border-amber-100 bg-amber-50/50' },
    { label: 'Reports', access: 'View', icon: BarChart3, color: 'text-sky-600 border-sky-100 bg-sky-50/50' }
  ];

  const securityItems = [
    { title: 'Password', value: 'Last Changed 30 Days Ago', icon: Lock, status: 'Secure' },
    { title: 'MFA Status', value: 'Disabled', icon: Shield, status: 'Setup Needed', statusColor: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Last Login', value: 'Today, 09:45 AM', icon: Calendar, status: 'Active' },
    { title: 'Session Dev', value: 'Chrome / Windows 11', icon: Monitor, status: 'Current' },
    { title: 'Client IP', value: '192.168.1.42 (Vadodara, IN)', icon: Globe, status: 'HQ intranet' }
  ];

  const quickStats = [
    { label: 'Assets Registered', value: 142, icon: Plus },
    { label: 'Transfers Approved', value: 28, icon: Handshake },
    { label: 'Maintenance Approved', value: 39, icon: Wrench },
    { label: 'Audits Completed', value: 12, icon: ClipboardCheck }
  ];

  const recentTimeline = [
    { action: 'Registered Asset AF-0010 (MacBook Pro)', time: '09:20 AM', icon: Plus, color: 'bg-indigo-50 text-indigo-600' },
    { action: 'Approved Maintenance Request for AF-0008', time: '10:00 AM', icon: Wrench, color: 'bg-orange-50 text-orange-600' },
    { action: 'Completed Site Audit - Floor 2 East Wing', time: '11:30 AM', icon: ClipboardCheck, color: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-16 bg-[#F8FAFC]">
      
      {/* Profile Header Title Block (32px title, 13px caption) */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
          Good Morning, {user.name}
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-2 tracking-wide">
          Asset Manager | Enterprise Asset Management System
        </p>
      </div>

      {/* Main Grid: Left side (LinkedIn style Card) vs Right Side (Metrics & Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Profile Overview Card */}
        <div className="space-y-6">
          <GlassCard className="border-slate-250 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            {/* Avatar Gradient Circle */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#5B5BD6] to-indigo-400 text-white font-extrabold text-3xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5 mt-4">
              <h2 className="text-xl font-bold text-slate-900 leading-none">{user.name}</h2>
              <p className="text-xs text-slate-500 font-semibold">{user.email}</p>
              
              <div className="flex items-center gap-1.5 justify-center pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Asset Manager
                </span>
              </div>
            </div>

            {/* Account Details Divider */}
            <div className="w-full border-t border-slate-100 my-5" />

            <div className="w-full text-xs font-semibold text-slate-600 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Employee ID</span>
                <span className="font-mono text-slate-800 font-extrabold">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Joined Date</span>
                <span className="text-slate-700">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department</span>
                <span className="text-slate-700">Operations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HQ Location</span>
                <span className="text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>HQ Building, Floor 2</span>
                </span>
              </div>
            </div>

            {/* Quick Statistics Divider */}
            <div className="w-full border-t border-slate-100 my-5" />

            <div className="w-full space-y-3.5 text-left">
              <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Quick Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((st, idx) => {
                  const Icon = st.icon;
                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between h-[64px]">
                      <span className="text-base font-extrabold text-slate-850 font-mono leading-none">{st.value}</span>
                      <span className="text-[9.5px] text-slate-500 font-semibold mt-1 truncate">{st.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </GlassCard>
        </div>

        {/* Right Side: Permissions Summary, Security & Activity Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Access Permissions Summary (22px section title) */}
          <GlassCard className="border-slate-250 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#5B5BD6]" />
                Access Summary
              </h3>
              <span className="text-[10px] font-bold text-[#5B5BD6] bg-[#5B5BD6]/5 px-2 py-0.5 rounded-lg border border-[#5B5BD6]/10">
                Active Privileges
              </span>
            </div>

            {/* Small colorful white cards for permissions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {accessModules.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-slate-350 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg border ${mod.color} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">{mod.label}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{mod.access}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#10B981] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-lg shrink-0">
                      ✓ Active
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Section: Account & Security Settings */}
          <GlassCard className="border-slate-250 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Key className="w-5 h-5 text-[#5B5BD6]" />
                Security Settings
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">L3 Clearance Level</span>
            </div>

            {/* Small box grid replacing huge box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {securityItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">{item.title}</span>
                      <p className="text-xs font-bold text-slate-750 truncate">{item.value}</p>
                      <span className={`inline-block text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md mt-1.5 ${
                        item.statusColor || 'text-indigo-600 bg-indigo-50 border border-indigo-100'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Section: Recent Activities */}
          <GlassCard className="border-slate-250 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="w-5 h-5 text-[#5B5BD6]" />
              Recent Activities
            </h3>

            {/* Vertical Activity Timeline */}
            <div className="space-y-4 pt-1">
              {recentTimeline.map((tl, idx) => {
                const Icon = tl.icon;
                return (
                  <div key={idx} className="flex gap-4 text-xs font-semibold items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`p-1.5 rounded-lg ${tl.color} border border-current/15`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {idx < recentTimeline.length - 1 && (
                        <div className="w-[1.5px] h-8 bg-slate-100 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5 text-slate-700">
                      <p className="font-extrabold leading-snug">{tl.action}</p>
                      <span className="text-[10px] text-slate-400 font-mono font-bold mt-1 block">{tl.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
