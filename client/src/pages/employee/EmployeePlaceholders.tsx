import React from "react";
import { Link } from "react-router-dom";
import { Compass, ChevronRight, Lock } from "lucide-react";

export const ComingSoon: React.FC<{ title: string; phase: string }> = ({
  title,
  phase,
}) => {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/employee" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">{title}</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            {title}
          </h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Access credentials, request forms, schedules, and active compliance operations.
          </p>
        </div>
      </div>

      {/* Placeholder Card */}
      <div className="bg-white border border-[#E7ECF3] rounded-3xl p-12 text-center max-w-lg mx-auto shadow-[0_8px_24px_rgba(15,23,42,.04)] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border flex items-center justify-center text-[#4F46E5] mx-auto">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-black text-sm text-slate-850 uppercase tracking-wider">
            Module Locked
          </h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed">
            The {title} tab is currently locked and will be unlocked during {phase} of the Employee Portal rollout.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/employee"
            className="btn-primary text-xs py-2 px-5 font-bold shadow-[0_4px_14px_rgba(79,70,229,.20)] inline-block cursor-pointer"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export const EmployeeAssets: React.FC = () => (
  <ComingSoon title="My Assets" phase="Phase 2 (Asset Ledger Details)" />
);

export const EmployeeBookResource: React.FC = () => (
  <ComingSoon title="Book Resource" phase="Phase 3 (Room & Resource Reservations)" />
);

export const EmployeeMaintenance: React.FC = () => (
  <ComingSoon title="Maintenance Requests" phase="Phase 4 (Issue Tickets Logging)" />
);

export const EmployeeReturnTransfer: React.FC = () => (
  <ComingSoon title="Returns & Transfers" phase="Phase 5 (Custody Actions Flow)" />
);

export const EmployeeNotifications: React.FC = () => (
  <ComingSoon title="My Notifications" phase="Phase 6 (Priority Alerts Inbox)" />
);

export const EmployeeActivity: React.FC = () => (
  <ComingSoon title="Activity Timeline Logs" phase="Phase 7 (Traceability Audits)" />
);

export const EmployeeProfile: React.FC = () => (
  <ComingSoon title="My Profile" phase="Phase 1 (Extended Profile Customizations)" />
);
