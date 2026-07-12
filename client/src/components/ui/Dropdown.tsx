import React from 'react';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(({ 
  label, 
  children, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-[10px] text-slate-400 font-bold uppercase select-none mb-1">{label}</label>}
      <select
        ref={ref}
        className={`bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
