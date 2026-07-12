import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { toast } from '../../../../components/Toast';

export const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    allocation: true,
    transfer: true,
    maintenance: true,
    returns: true,
    bookings: true,
    audits: false
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    toast.success('Notification routing preferences saved successfully.');
  };

  const options = [
    { key: 'allocation', label: 'Allocation requests', desc: 'Email alerts for employee device requests' },
    { key: 'transfer', label: 'Transfer requests', desc: 'Alert when a staff member transfers custody' },
    { key: 'maintenance', label: 'Maintenance status updates', desc: 'Notify on service ticket SLA changes' },
    { key: 'returns', label: 'Return checklists due dates', desc: 'Alert when equipment checkout period ends' },
    { key: 'bookings', label: 'Room booking confirmations', desc: 'Instant confirmations on room slots reservation' },
    { key: 'audits', label: 'System audit logs reporting', desc: 'Notify on weekly system status compliance' }
  ];

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Settings panel</span>
          <h4 className="font-extrabold text-xs text-slate-800 mt-1">Notification Preferences</h4>
        </div>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-lg flex items-center gap-1.5 cursor-pointer text-[10px] font-extrabold"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-4 pt-1 text-xs font-semibold text-slate-700">
        {options.map(opt => {
          const isEnabled = preferences[opt.key as keyof typeof preferences];
          return (
            <div key={opt.key} className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-800 block">{opt.label}</span>
                <span className="text-[10px] text-slate-450 block font-normal">{opt.desc}</span>
              </div>

              <button
                onClick={() => handleToggle(opt.key as keyof typeof preferences)}
                className={`text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0`}
              >
                {isEnabled ? (
                  <ToggleRight className="w-9 h-9 text-[#5B5BD6]" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300" />
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default NotificationPreferences;
