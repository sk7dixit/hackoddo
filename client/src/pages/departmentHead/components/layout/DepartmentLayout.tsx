import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentHeader from './DepartmentHeader';
import DepartmentFooter from './DepartmentFooter';

export interface DepartmentContextProps {
  id: number;
  name: string;
  head: string;
  employeeCount: number;
  assetCount: number;
}

const mockDepartmentInfo: DepartmentContextProps = {
  id: 2,
  name: 'Information Technology',
  head: 'Rahul Sharma',
  employeeCount: 42,
  assetCount: 168
};

const DepartmentContext = createContext<DepartmentContextProps>(mockDepartmentInfo);

export const useDepartment = () => useContext(DepartmentContext);

export const DepartmentLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DepartmentContext.Provider value={mockDepartmentInfo}>
      <div className="flex min-h-screen bg-[#F5F7FB] text-slate-800 font-sans">
        
        {/* Sidebar */}
        <DepartmentSidebar open={sidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <DepartmentHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Content Outlet */}
          <main className="flex-grow overflow-y-auto bg-[#F5F7FB] p-0">
            <Outlet />
          </main>

          {/* Footer */}
          <DepartmentFooter />
        </div>

      </div>
    </DepartmentContext.Provider>
  );
};

export default DepartmentLayout;
