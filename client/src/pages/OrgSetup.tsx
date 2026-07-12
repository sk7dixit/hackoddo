import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Building, 
  Users, 
  Tags, 
  Plus, 
  Trash2, 
  UserCheck, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Department, Employee, Category } from '../../../server/src/types';

export const OrgSetup: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'departments' | 'employees' | 'categories'>('departments');
  
  // Data lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Forms states
  const [deptForm, setDeptForm] = useState({ name: '', location: '', headId: '' });
  const [catForm, setCatForm] = useState({ name: '', type: 'asset' as 'asset' | 'resource', description: '' });
  
  // UX states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptsData, empsData, catsData] = await Promise.all([
          api.get<Department[]>('/departments'),
          api.get<Employee[]>('/employees'),
          api.get<Category[]>('/categories')
        ]);
        setDepartments(deptsData);
        setEmployees(empsData);
        setCategories(catsData);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch setup data.');
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setSuccess(msg);
      setError(null);
    } else {
      setError(msg);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 4000);
  };

  // Create Department
  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.location) {
      showFeedback('error', 'Name and Location are required.');
      return;
    }
    try {
      await api.post('/departments', {
        name: deptForm.name,
        location: deptForm.location,
        headId: deptForm.headId || null
      });
      setDeptForm({ name: '', location: '', headId: '' });
      showFeedback('success', 'Department created successfully!');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Delete Department
  const handleDeleteDept = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      showFeedback('success', 'Department deleted.');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Update Employee role or department
  const handleUpdateEmployee = async (empId: string, updates: { role?: string; departmentId?: string | null }) => {
    try {
      await api.patch(`/employees/${empId}`, updates);
      showFeedback('success', 'Employee updated successfully.');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) {
      showFeedback('error', 'Category Name is required.');
      return;
    }
    try {
      await api.post('/categories', catForm);
      setCatForm({ name: '', type: 'asset', description: '' });
      showFeedback('success', 'Category created successfully!');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      showFeedback('success', 'Category deleted.');
      triggerRefresh();
    } catch (e: any) {
      showFeedback('error', e.message);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Feedback Messages */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Sub tabs header */}
      <div className="flex border-b border-zinc-800/80 gap-6">
        <button
          onClick={() => setActiveSubTab('departments')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeSubTab === 'departments' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Departments</span>
          {activeSubTab === 'departments' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('employees')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeSubTab === 'employees' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee Directory</span>
          {activeSubTab === 'employees' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${
            activeSubTab === 'categories' ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Tags className="w-4 h-4" />
          <span>Asset Categories Master</span>
          {activeSubTab === 'categories' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
      </div>

      {/* SUB TAB CONTENTS */}
      
      {/* 1. Departments View */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Add Dept Form */}
          <GlassCard className="lg:col-span-1 border-zinc-800/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400 flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-violet-400" />
              Add Department
            </h3>
            <form onSubmit={handleCreateDept} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Finance & Accounting"
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Physical Office Location</label>
                <input
                  type="text"
                  placeholder="e.g. Building C, Suite 400"
                  value={deptForm.location}
                  onChange={e => setDeptForm({ ...deptForm, location: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Department Head (Optional)</label>
                <select
                  value={deptForm.headId}
                  onChange={e => setDeptForm({ ...deptForm, headId: e.target.value })}
                  className="glass-input text-xs cursor-pointer appearance-none bg-zinc-950"
                >
                  <option value="">Select Employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full btn-primary text-xs mt-2 py-3">
                Create Department
              </button>
            </form>
          </GlassCard>

          {/* Depts Table */}
          <GlassCard className="lg:col-span-2 border-zinc-800/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
              Configured Corporate Departments ({departments.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Dept Name</th>
                    <th className="pb-3 pr-4">Office Location</th>
                    <th className="pb-3 pr-4">Head of Department</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 italic">No departments created yet.</td>
                    </tr>
                  ) : (
                    departments.map(dept => {
                      const head = employees.find(e => e.id === dept.headId);
                      return (
                        <tr key={dept.id} className="hover:bg-zinc-900/10">
                          <td className="py-4 font-semibold text-zinc-200">{dept.name}</td>
                          <td className="py-4 text-zinc-400">{dept.location}</td>
                          <td className="py-4 text-zinc-400">
                            {head ? (
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                                {head.name}
                              </span>
                            ) : (
                              <span className="text-zinc-600 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteDept(dept.id)}
                              className="text-rose-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 2. Employee Directory */}
      {activeSubTab === 'employees' && (
        <GlassCard className="border-zinc-800/40">
          <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
            Promote Roles & Department Custody
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Employee Name</th>
                  <th className="pb-3 pr-4">Email Address</th>
                  <th className="pb-3 pr-4">Assigned Department</th>
                  <th className="pb-3 pr-4">Active Role (ERP Permissions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-zinc-900/10">
                    <td className="py-4 font-semibold text-zinc-200">{emp.name}</td>
                    <td className="py-4 text-zinc-400 font-mono text-[11px]">{emp.email}</td>
                    <td className="py-4">
                      <select
                        value={emp.departmentId || ''}
                        onChange={e => handleUpdateEmployee(emp.id, { departmentId: e.target.value || null })}
                        className="glass-input py-1 text-[11px] cursor-pointer bg-zinc-950"
                      >
                        <option value="">No Department</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4">
                      <select
                        value={emp.role}
                        onChange={e => handleUpdateEmployee(emp.id, { role: e.target.value })}
                        className="glass-input py-1 text-[11px] cursor-pointer bg-zinc-950 font-semibold"
                      >
                        <option value="employee">Employee (Normal Custody)</option>
                        <option value="department_head">Department Head</option>
                        <option value="asset_manager">Asset Manager (Store)</option>
                        <option value="admin">System Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* 3. Categories View */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Add Category Form */}
          <GlassCard className="lg:col-span-1 border-zinc-800/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400 flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-violet-400" />
              Add Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. 3D Printers"
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category Type</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setCatForm({ ...catForm, type: 'asset' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
                      catForm.type === 'asset' 
                        ? 'border-violet-500/40 bg-violet-600/10 text-violet-400' 
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-950/20'
                    }`}
                  >
                    Asset (Exclusive Allocation)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatForm({ ...catForm, type: 'resource' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
                      catForm.type === 'resource' 
                        ? 'border-cyan-500/40 bg-cyan-600/10 text-cyan-400' 
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-950/20'
                    }`}
                  >
                    Resource (Shared Booking)
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                <textarea
                  placeholder="Add a brief description..."
                  value={catForm.description}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="glass-input text-xs h-20 resize-none"
                />
              </div>
              <button type="submit" className="w-full btn-primary text-xs mt-2 py-3">
                Create Category
              </button>
            </form>
          </GlassCard>

          {/* Categories Table */}
          <GlassCard className="lg:col-span-2 border-zinc-800/40">
            <h3 className="font-bold text-sm tracking-tight text-white mb-6 uppercase text-zinc-400">
              Active Asset Categories ({categories.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Category Name</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-zinc-900/10">
                      <td className="py-4 font-semibold text-zinc-200">{cat.name}</td>
                      <td className="py-4">
                        <span className={`badge ${cat.type === 'asset' ? 'badge-allocated' : 'badge-reserved'}`}>
                          {cat.type === 'asset' ? 'Asset (Allocation)' : 'Resource (Booking)'}
                        </span>
                      </td>
                      <td className="py-4 text-zinc-400 max-w-[200px] truncate">{cat.description || '-'}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-rose-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default OrgSetup;
