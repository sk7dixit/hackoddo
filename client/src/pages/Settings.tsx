import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { toast } from '../components/Toast';
import { 
  Building, 
  Bell, 
  Save, 
  Eye 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [companyName, setCompanyName] = useState('AssetFlow Corp');
  const [timezone, setTimezone] = useState('GMT+5:30');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(false);
  const [auditAlerts, setAuditAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  const [compactView, setCompactView] = useState(false);
  const [tableDensity, setTableDensity] = useState('Comfortable');
  const [animations, setAnimations] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings saved successfully.');
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in pb-16">
      
      {/* Title Header (28px Title, 15px Subtitle) */}
      <div className="border-b border-slate-200/60 pb-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          System Settings
        </h2>
        <p className="text-sm text-slate-500 font-semibold mt-1">Configure workspace metadata, notification routing, and client views</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: General & Appearance (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Settings */}
          <GlassCard className="border-slate-200 p-6 space-y-5 bg-white shadow-sm">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4.5 h-4.5 text-[#5B5BD6]" />
              General Organization Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="glass-input text-xs font-semibold text-slate-750"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">System Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                >
                  <option value="GMT+5:30">New Delhi (GMT+5:30)</option>
                  <option value="GMT+0:00">London (GMT+0:00)</option>
                  <option value="GMT-5:00">New York (GMT-5:00)</option>
                  <option value="GMT+8:00">Singapore (GMT+8:00)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Date Format</label>
                <select
                  value={dateFormat}
                  onChange={e => setDateFormat(e.target.value)}
                  className="glass-input text-xs cursor-pointer bg-white text-slate-700"
                >
                  <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 12-07-2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-07-12)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/12/2026)</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Appearance Settings */}
          <GlassCard className="border-slate-200 p-6 space-y-5 bg-white shadow-sm">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
              <Eye className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Appearance & Layout Density
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">Compact View Mode</span>
                  <p className="text-[10px] text-slate-400">Shrinks side margins and padding for dashboards</p>
                </div>
                <input
                  type="checkbox"
                  checked={compactView}
                  onChange={e => setCompactView(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">Table Density</span>
                  <p className="text-[10px] text-slate-400">Comfortable vs compact row spacers</p>
                </div>
                <select
                  value={tableDensity}
                  onChange={e => setTableDensity(e.target.value)}
                  className="glass-input py-1.5 px-3 text-xs w-32 cursor-pointer bg-white text-slate-700"
                >
                  <option value="Comfortable">Comfortable</option>
                  <option value="Compact">Compact</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">System Animations</span>
                  <p className="text-[10px] text-slate-400">Transitions and interactive dashboard glows</p>
                </div>
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={e => setAnimations(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">Portal Language</span>
                  <p className="text-[10px] text-slate-400">Primary translation language</p>
                </div>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="glass-input py-1.5 px-3 text-xs w-32 cursor-pointer bg-white text-slate-700"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Alerts & Save (1/3 width) */}
        <div className="space-y-6">
          
          {/* Notification Preferences */}
          <GlassCard className="border-slate-200 p-6 space-y-4 bg-white shadow-sm">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4.5 h-4.5 text-[#5B5BD6]" />
              Alert Subscriptions
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-750">
              <div className="flex items-center justify-between">
                <span className="text-slate-800">Email Alerts</span>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={e => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-800">Push Banner Notifications</span>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={e => setPushNotif(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-800">Overdue Returns Pings</span>
                <input
                  type="checkbox"
                  checked={reminderNotif}
                  onChange={e => setReminderNotif(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-800">Audit Verification Alerts</span>
                <input
                  type="checkbox"
                  checked={auditAlerts}
                  onChange={e => setAuditAlerts(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-800">Maintenance Ticket Updates</span>
                <input
                  type="checkbox"
                  checked={maintenanceAlerts}
                  onChange={e => setMaintenanceAlerts(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#5B5BD6]"
                />
              </div>
            </div>
          </GlassCard>

          {/* Form Save Button */}
          <button
            type="submit"
            className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>

        </div>

      </form>

    </div>
  );
};

export default Settings;
