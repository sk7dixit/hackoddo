import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ 
  headers, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="overflow-x-auto w-full border border-slate-200/60 rounded-xl bg-white">
      <table className={`erp-table ${className}`} {...props}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-slate-500 font-extrabold uppercase py-3.5 px-5 text-[10px] tracking-wider text-left border-b border-slate-200 bg-[#F8FAFC]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
