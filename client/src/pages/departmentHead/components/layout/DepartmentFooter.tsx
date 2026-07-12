import React from 'react';

export const DepartmentFooter: React.FC = () => {
  return (
    <footer className="no-print py-3.5 px-6 border-t border-slate-200 bg-[#FAFBFC] text-center text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider shrink-0 flex items-center justify-between">
      <span>AssetFlow ERP • Department Head Portal</span>
      <span>Version 1.0 • Last Sync: 12 Jul 2026 • Powered by Odoo Hackathon</span>
    </footer>
  );
};

export default DepartmentFooter;
