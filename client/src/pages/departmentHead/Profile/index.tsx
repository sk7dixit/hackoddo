import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileStats from './components/ProfileStats';
import PermissionCard from './components/PermissionCard';
import LoginActivity from './components/LoginActivity';
import ChangePasswordModal from './components/ChangePasswordModal';
import { toast } from '../../../components/Toast';
import { ShieldCheck, UserCircle, Phone, Mail, Building, KeyRound, Save, LogOut, User, Users, Boxes, CalendarDays, ClipboardCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  // Personal Info Form State
  const [name, setName] = useState('Rahul Sharma');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Avatar State
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatar(uploadEvent.target.result as string);
          toast.success('Profile avatar updated.');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    toast.success('Profile avatar removed.');
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Personal profile details saved successfully.');
  };

  const handleLogoutAll = () => {
    toast.success('Successfully terminated all other active sessions.');
  };

  const mockStats = {
    assets: 186,
    approvals: 84,
    bookings: 19,
    reports: 14
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in font-semibold text-xs text-slate-700">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider mb-2">
        <span className="hover:text-slate-650 cursor-pointer" onClick={() => navigate('/department-head')}>Dashboard</span>
        <span>&gt;</span>
        <span className="text-[#5B5BD6]">My Profile</span>
      </div>

      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">
          Manage personal credentials, scopes, and notifications settings
        </p>
      </div>

      {/* KPI Stats widgets */}
      <ProfileStats stats={mockStats} />

      {/* Profile Banner Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-6 justify-between">
        
        {/* Left Side: Avatar & Details */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          {/* Avatar Upload Frame */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-[#5B5BD6]/30 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-16 h-16 text-slate-450" />
              )}
            </div>
            
            {/* Input Overlay */}
            <label className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
              <span>Change</span>
              <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-950 block leading-tight">{name}</h2>
            <span className="text-xs font-bold text-slate-500 block">
              Department Head • <span className="text-[#5B5BD6] font-extrabold">Information Technology</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 block font-bold mt-1">
              ID: EMP-0045 • departmenthead@gmail.com
            </span>
          </div>

        </div>

        {/* Right Side Control Buttons */}
        <div className="flex gap-2">
          {avatar && (
            <button
              onClick={handleRemoveAvatar}
              className="px-3 py-2 border border-slate-250 hover:border-rose-300 hover:text-rose-600 rounded-xl bg-white text-slate-500 cursor-pointer font-bold transition-all"
            >
              Remove Picture
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#5B5BD6] hover:bg-[#4d4dbf] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm shadow-[#5B5BD6]/10"
          >
            Edit Profile details
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Personal Info & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Personal Info Card */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-800">Personal Information</h4>
              {isEditing && (
                <span className="text-[9.5px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={handleSaveChanges} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="glass-input disabled:bg-slate-50 disabled:text-slate-500 text-xs font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400">Mobile Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="glass-input disabled:bg-slate-50 disabled:text-slate-500 text-xs font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400">Corporate Email</label>
                <input
                  type="text"
                  disabled
                  value="departmenthead@gmail.com"
                  className="glass-input bg-slate-50 text-slate-450 text-xs font-semibold cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400">Employee ID</label>
                <input
                  type="text"
                  disabled
                  value="EMP-0045"
                  className="glass-input bg-slate-50 text-slate-450 text-xs font-semibold font-mono cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="sm:col-span-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1 shadow-sm shadow-emerald-500/10"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}

            </form>
          </div>

          {/* 2. Security Configuration Card */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4.5">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="font-extrabold text-xs text-slate-800">Security Credentials & Sessions</h4>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Reset Password Row */}
              <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 block">Account Password</span>
                  <span className="text-[10px] text-slate-450 block font-normal">Last changed 4 months ago</span>
                </div>
                <button
                  onClick={() => setIsPasswordOpen(true)}
                  className="px-3.5 py-2 border border-slate-200 hover:border-[#5B5BD6] hover:text-[#5B5BD6] bg-white hover:bg-[#5B5BD6]/5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>

              {/* MFA Switch */}
              <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[10px] text-slate-450 block font-normal">Secure logins via authenticator keys</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold">
                  Enabled
                </span>
              </div>

              {/* Session Terminate */}
              <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 block">Session Management</span>
                  <span className="text-[10px] text-slate-450 block font-normal">Currently signed in to 1 device</span>
                </div>
                <button
                  onClick={handleLogoutAll}
                  className="px-3 py-2 border border-slate-250 hover:border-rose-300 hover:text-rose-600 bg-white hover:bg-rose-50/50 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out All Other Devices</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right Columns: Department details and Permissions */}
        <div className="lg:col-span-1 space-y-6">
                 {/* Department Information card */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">Profile context</span>
                <h4 className="font-extrabold text-xs text-slate-800 mt-1">Department Overview</h4>
              </div>
              <span className="text-[9.5px] font-bold text-slate-450 uppercase">Snapshot</span>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              {[
                { label: 'Department', value: 'Information Technology', icon: Building },
                { label: 'Department Head', value: 'Rahul Sharma', icon: User },
                { label: 'Employees count', value: '42 Staff members', icon: Users },
                { label: 'Asset Holdings', value: '186 Registered Units', icon: Boxes },
                { label: 'Shared Resources', value: '12 Shared Resources', icon: CalendarDays },
                { label: 'Open Requests', value: '7 Pending approvals', icon: ClipboardCheck }
              ].map((detail, idx) => {
                const Icon = detail.icon;
                return (
                  <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                    <div className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">
                        {detail.label}
                      </span>
                      <span className="text-xs font-extrabold text-slate-850 block mt-1.5 leading-none">
                        {detail.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permissions vis card */}
          <PermissionCard />

        </div>

      </div>

      {/* Login History */}
      <LoginActivity />

      {/* Change Password modal prompt */}
      <ChangePasswordModal 
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />

    </div>
  );
};

export default Profile;
