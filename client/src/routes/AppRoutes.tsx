import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";

// Module placeholders
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import AssetsPage from "../modules/assets/pages/AssetsPage";
import AllocationPage from "../modules/allocation/pages/AllocationPage";
import TransfersPage from "../modules/transfers/pages/TransfersPage";
import MaintenancePage from "../modules/maintenance/pages/MaintenancePage";
import ReturnsPage from "../modules/returns/pages/ReturnsPage";
import AuditPage from "../modules/audit/pages/AuditPage";
import NotificationsPage from "../modules/notifications/pages/NotificationsPage";
import ProfilePage from "../modules/profile/pages/ProfilePage";
import ActivityLogs from "../pages/ActivityLogs";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import LandingPage from "../pages/LandingPage";
import HelpCenter from "../pages/HelpCenter";
import { NotFound } from "../pages/ErrorViews";
import DepartmentLayout from "../pages/departmentHead/components/layout/DepartmentLayout";
import DeptDashboard from "../pages/departmentHead/Dashboard";
import DeptAssets from "../pages/departmentHead/DepartmentAssets";
import DeptRequests from "../pages/departmentHead/Requests";
import DeptBookings from "../pages/departmentHead/Bookings";
import DeptReports from "../pages/departmentHead/Reports";
import DeptNotifications from "../pages/departmentHead/Notifications";
import DeptActivityLogs from "../pages/departmentHead/ActivityLogs";
import DeptHelp from "../pages/departmentHead/Help";
import DeptProfile from "../pages/departmentHead/Profile";

// Guard for Private Routes
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminOrgSetup from "../pages/admin/AdminOrgSetup";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminCreateUserWizard from "../pages/admin/AdminCreateUserWizard";
import AdminAuditManagement from "../pages/admin/AdminAuditManagement";
import AdminRolePermissions from "../pages/admin/AdminRolePermissions";
import AdminReportsAnalytics from "../pages/admin/AdminReportsAnalytics";
import AdminNotificationCenter from "../pages/admin/AdminNotificationCenter";
import AdminActivityLogs from "../pages/admin/AdminActivityLogs";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminHelpCenter from "../pages/admin/AdminHelpCenter";

import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeAssets from "../pages/employee/EmployeeAssets";
import EmployeeProfile from "../pages/employee/EmployeeProfile";
import EmployeeMaintenance from "../pages/employee/EmployeeMaintenance";
import EmployeeReturnTransfer from "../pages/employee/EmployeeReturnTransfer";
import EmployeeBookResource from "../pages/employee/EmployeeBookResource";
import EmployeeNotifications from "../pages/employee/EmployeeNotifications";
import EmployeeActivity from "../pages/employee/EmployeeActivity";
import { GlobalSearch } from "../pages/shared/GlobalSearch";

interface GuardProps {
  children: React.ReactElement;
}

const PrivateGuard: React.FC<GuardProps> = ({ children }) => {
  const isAuth = authStore.isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Guard for Role-based Access Protection
const RoleGuard: React.FC<{
  children: React.ReactElement;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const user = authStore.getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their default portal depending on role
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "department_head")
      return <Navigate to="/department-head" replace />;
    if (user.role === "employee") return <Navigate to="/employee" replace />;
    return <Navigate to="/employee" replace />;
  }
  return children;
};

// Guard for Public/Guest Routes
const GuestGuard: React.FC<GuardProps> = ({ children }) => {
  const isAuth = authStore.isAuthenticated();
  if (isAuth) {
    const user = authStore.getUser();
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "department_head")
      return <Navigate to="/department-head" replace />;
    if (user?.role === "employee") return <Navigate to="/employee" replace />;
    return <Navigate to="/employee" replace />;
  }
  return children;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Login Gateway */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <Login />
          </GuestGuard>
        }
      />

      {/* Protected Department Head Portal */}
      <Route
        path="/department-head"
        element={
          <RoleGuard allowedRoles={["department_head"]}>
            <DepartmentLayout />
          </RoleGuard>
        }
      >
        <Route index element={<DeptDashboard />} />
        <Route path="assets" element={<DeptAssets />} />
        <Route path="requests" element={<DeptRequests />} />
        <Route path="bookings" element={<DeptBookings />} />
        <Route path="reports" element={<DeptReports />} />
        <Route path="notifications" element={<DeptNotifications />} />
        <Route path="activity" element={<DeptActivityLogs />} />
        <Route path="help" element={<DeptHelp />} />
        <Route path="profile" element={<DeptProfile />} />
        <Route path="search" element={<GlobalSearch />} />
      </Route>

      {/* Protected Portal Layout for Admins */}
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="organization" element={<AdminOrgSetup />} />
        <Route path="organization/departments" element={<AdminOrgSetup />} />
        <Route path="organization/categories" element={<AdminOrgSetup />} />
        <Route path="organization/locations" element={<AdminOrgSetup />} />
        <Route path="organization/calendar" element={<AdminOrgSetup />} />
        <Route path="employees" element={<AdminUserManagement />} />
        <Route path="create-user" element={<AdminCreateUserWizard />} />
        <Route path="roles" element={<AdminRolePermissions />} />
        <Route path="audit" element={<AdminAuditManagement />} />
        <Route path="reports" element={<AdminReportsAnalytics />} />
        <Route path="notifications" element={<AdminNotificationCenter />} />
        <Route path="activity-logs" element={<AdminActivityLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="help" element={<AdminHelpCenter />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="search" element={<GlobalSearch />} />
      </Route>

      {/* Protected Portal Layout for Asset Managers */}
      <Route
        element={
          <RoleGuard allowedRoles={["asset_manager"]}>
            <DashboardLayout />
          </RoleGuard>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="allocation" element={<AllocationPage />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="search" element={<GlobalSearch />} />
      </Route>

      {/* Protected Portal Layout for Employees */}
      <Route
        path="/employee"
        element={
          <RoleGuard allowedRoles={["employee"]}>
            <EmployeeLayout />
          </RoleGuard>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="assets" element={<EmployeeAssets />} />
        <Route path="book-resource" element={<EmployeeBookResource />} />
        <Route path="maintenance" element={<EmployeeMaintenance />} />
        <Route path="return-transfer" element={<EmployeeReturnTransfer />} />
        <Route path="notifications" element={<EmployeeNotifications />} />
        <Route path="activity" element={<EmployeeActivity />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="search" element={<GlobalSearch />} />
      </Route>

      {/* Fallback to custom 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
